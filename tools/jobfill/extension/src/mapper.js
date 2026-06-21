/* mapper.js — PURE mapping layer (no chrome, no DOM mutation).
 * Decides WHAT to fill and how to tag each field. Used by content.js (in the
 * browser) and by test/run-sample.mjs (headless), so the logic is testable. */
(function () {
  function cssEscape(s) {
    return (typeof CSS !== "undefined" && CSS.escape) ? CSS.escape(s) : String(s).replace(/[^a-zA-Z0-9_-]/g, "\\$&");
  }

  // A clean, human-readable label for a field (what we show the agent).
  // Prefers the actual <label>/legend text over noisy name/id/class fragments.
  function humanLabel(el) {
    if (!el) return "";
    const doc = el.ownerDocument || (typeof document !== "undefined" ? document : null);
    let t = "";
    if (doc && el.id) { const l = doc.querySelector(`label[for="${cssEscape(el.id)}"]`); if (l) t = l.textContent; }
    if (!t) { const w = el.closest && el.closest("label"); if (w) t = w.textContent; }
    if (!t) { const fs = el.closest && el.closest("fieldset"); const lg = fs && fs.querySelector("legend"); if (lg) t = lg.textContent; }
    if (!t) { const b = el.closest && el.closest(".field, [class*='question'], [class*='Field'], [class*='form-group'], [class*='form-field']"); if (b) { const lab = b.querySelector("label, legend"); if (lab) t = lab.textContent; } }
    if (!t && doc) { const lb = el.getAttribute && el.getAttribute("aria-labelledby"); if (lb) t = lb.split(/\s+/).map(id => { const n = doc.getElementById(id); return n ? n.textContent : ""; }).join(" ").trim(); }
    if (!t) t = (el.getAttribute && (el.getAttribute("aria-label") || el.placeholder)) || "";
    if (!t) { const da = el.getAttribute && el.getAttribute("data-automation-id"); if (da && !/^(input|button|select)$/i.test(da)) t = da.replace(/^.*[_-]/, "").replace(/([a-z])([A-Z])/g, "$1 $2"); }
    if (!t) t = (el.name || el.id || "").replace(/[-_]+\d*/g, " ").replace(/[-_]+/g, " ");
    return t.replace(/\s+/g, " ").replace(/\*/g, "").trim().slice(0, 70);
  }

  // Lowercased "signature" of everything that hints at a field's meaning (for rule matching).
  function signature(el, doc) {
    const bits = [el.name, el.id, el.placeholder, el.getAttribute && el.getAttribute("aria-label")];
    if (el.id) { const l = doc.querySelector(`label[for="${cssEscape(el.id)}"]`); if (l) bits.push(l.textContent); }
    const wrap = el.closest && el.closest("label"); if (wrap) bits.push(wrap.textContent);
    const block = el.closest && el.closest(".field, .application-question, [class*='question'], [class*='Field']");
    if (block) { const lab = block.querySelector("label, legend, .label"); if (lab) bits.push(lab.textContent); }
    return bits.filter(Boolean).join(" ").toLowerCase().replace(/\s+/g, " ").trim();
  }

  // Returns { platform, plan: [{key, tag, value, label, status, selectorHint}] }
  // plan items DO NOT include DOM nodes; content.js re-resolves nodes to fill.
  function planFill(profile, doc, win) {
    const { RULES, ATS } = win.JobFill;
    const platform = ATS.detect();
    const plan = [];
    const handled = new Set();
    const push = (el, key, value, tag) => {
      const label = signature(el, doc).slice(0, 80);
      const status = value == null ? "needs-you" : "planned";
      const tagFinal = value == null && tag !== "you" ? "you" : tag;
      plan.push({ el, key, tag: tagFinal, value, label, status });
      handled.add(el);
    };

    // 1) ATS adapter pass (highest confidence)
    for (const a of (ATS[platform] || [])) {
      for (const el of doc.querySelectorAll(a.selector)) {
        if (handled.has(el)) continue;
        push(el, a.key, a.res(profile), a.tag);
      }
    }

    // 2) Generic synonym-rule pass. Also include button-style dropdowns
    // (Workday/ARIA comboboxes) which aren't input/select/textarea.
    const fields = doc.querySelectorAll(
      "input:not([type=hidden]):not([type=file]):not([type=submit]), select, textarea, " +
      "button[aria-haspopup='listbox'], [role='button'][aria-haspopup='listbox'], [role='combobox']");
    for (const el of fields) {
      if (handled.has(el) || el.disabled || el.type === "password") continue;
      const sig = signature(el, doc);
      if (!sig) continue;
      const maxLen = Number(el.maxLength) || 0;
      if (el.tagName === "TEXTAREA" || maxLen > 180 || /cover letter|why |describe|tell us|anything else|essay/.test(sig)) {
        plan.push({ el, key: "freeform", tag: "drafted", value: null, label: sig.slice(0, 80), status: "pending-llm" });
        handled.add(el); continue;
      }
      const rule = RULES.find(r => r.re.test(sig));
      if (rule) push(el, rule.key, rule.res(profile), rule.tag);
      else { plan.push({ el, key: "unknown", tag: "you", value: null, label: sig.slice(0, 80), status: "unmapped" }); handled.add(el); }
    }

    // 3) Blockers
    if (platform === "workday") plan.push({ el: null, key: "flow", tag: "blocker", value: null, label: "Workday is multi-step — fill this step, click Next, then run again per step", status: "manual" });
    for (const f of doc.querySelectorAll("input[type=file]"))
      plan.push({ el: f, key: "resume", tag: "you", value: null, label: "Resume / file upload — attach the right variant", status: "manual" });

    return { platform, plan };
  }

  // Serialize a plan/results array into a JSON payload for the LLM agent.
  // Includes each field's type, options, current value, and the deterministic
  // suggestion so the agent can focus on what's still empty.
  function serializeFields(items) {
    return items.map((p, i) => {
      const el = p.el; let type = "none", options, current = "", maxLength;
      if (el) {
        type = el.tagName === "SELECT" ? "select" : (el.tagName === "TEXTAREA" ? "textarea" : (el.type || "text"));
        if (type === "select") {
          options = [...el.options].map(o => o.textContent.trim()).filter(Boolean);
          current = (el.options[el.selectedIndex] && el.options[el.selectedIndex].textContent.trim()) || "";
        } else { current = el.value || ""; }
        const ml = Number(el.maxLength); if (ml > 0) maxLength = ml;
      }
      return { i, label: humanLabel(el) || p.label, key: p.key, tag: p.tag, type, options, maxLength, current, suggested: p.value ?? null };
    });
  }

  // Coerce a human value to whatever a typed <input> expects, so date/month/
  // number fields don't throw "cannot be parsed". Returns null if not fillable.
  const pad = (n) => String(n).padStart(2, "0");
  const MONTHS = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
  function parseDateish(s) {
    s = String(s).trim().toLowerCase(); let m;
    if ((m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/))) return { y: +m[1], m: +m[2], d: +m[3] };
    if ((m = s.match(/^(\d{4})-(\d{1,2})$/))) return { y: +m[1], m: +m[2] };
    if ((m = s.match(/^(\d{1,2})\/(\d{4})$/))) return { y: +m[2], m: +m[1] };
    if ((m = s.match(/([a-z]{3,9})\.?\s+(\d{4})/))) { const mon = MONTHS[m[1].slice(0, 3)]; if (mon) return { y: +m[2], m: mon }; }
    if ((m = s.match(/^(\d{4})$/))) return { y: +m[1] };
    return null;
  }
  function coerceValue(el, value) {
    const t = (el.type || "").toLowerCase(); const s = String(value).trim();
    if (t === "date")  { const d = parseDateish(s); return d ? `${d.y}-${pad(d.m || 1)}-${pad(d.d || 1)}` : null; }
    if (t === "month") { const d = parseDateish(s); return d ? `${d.y}-${pad(d.m || 1)}` : null; }
    if (t === "week" || t === "time" || t === "datetime-local") return null; // not enough info
    if (t === "number" || t === "range") { const n = parseFloat(s.replace(/[^0-9.\-]/g, "")); return Number.isFinite(n) ? String(n) : null; }
    return s;
  }

  win_global().JobFill = Object.assign(win_global().JobFill || {}, { signature, humanLabel, planFill, serializeFields, coerceValue, parseDateish });
  function win_global() { return typeof window !== "undefined" ? window : globalThis; }
})();
