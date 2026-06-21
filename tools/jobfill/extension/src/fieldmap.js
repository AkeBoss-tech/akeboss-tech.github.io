/* fieldmap.js — the deterministic mapping layer.
 *
 * Strategy (in priority order, highest confidence first):
 *   1. ATS adapters  — per-platform selectors for the common fields (Greenhouse/Lever/Ashby).
 *   2. Synonym rules — regex over an input's combined "signature" (label+name+placeholder+aria+id).
 *   3. (fallback, in content.js) — escalate unknowns to the LLM runner via native messaging.
 *
 * Every rule resolves a value from the profile and a REVIEW TAG:
 *   auto   = filled, trust it      verify = filled, eyeball it
 *   drafted= LLM-written, approve   you    = human must handle    blocker = can't touch
 */

// ---- value resolvers against the profile object ----
const R = {
  firstName: p => p.identity.first_name,
  lastName:  p => p.identity.last_name,
  fullName:  p => p.identity.full_name,
  email:     p => p.identity.email,
  phone:     p => p.identity.phone,
  city:      p => p.identity.address.city,
  state:     p => p.identity.address.state,
  country:   p => p.identity.address.country,
  website:   p => p.links.website,
  github:    p => p.links.github,
  linkedin:  p => p.links.linkedin,
  school:    p => p.education[0].school,
  degree:    p => p.education[0].degree,
  discipline:p => p.education[0].field,
  gpa:       p => p.education[0].gpa,
  gradDate:  p => "May 2027",
  workAuth:  p => "Yes",
  sponsorship: p => "No",
  relocate:  p => (p.eligibility.willing_to_relocate ? "Yes" : "No"),
  howHeard:  p => p.defaults.how_did_you_hear,
  startDate: p => p.defaults.earliest_start_date,
  salary:    p => p.defaults.salary_expectation,
};

// ---- generic synonym rules: first matching rule wins ----
// `sig` is the lowercased combined signature string for an input.
const RULES = [
  { key: "first_name", res: R.firstName, tag: "auto",   re: /\b(first[\s_-]?name|given[\s_-]?name|fname)\b/ },
  { key: "last_name",  res: R.lastName,  tag: "auto",   re: /\b(last[\s_-]?name|family[\s_-]?name|surname|lname)\b/ },
  { key: "full_name",  res: R.fullName,  tag: "auto",   re: /\b(full[\s_-]?name|your name|name)\b/ },
  { key: "email",      res: R.email,     tag: "auto",   re: /\b(e-?mail)\b/ },
  { key: "phone",      res: R.phone,     tag: "auto",   re: /\b(phone|mobile|cell|telephone)\b/ },
  { key: "linkedin",   res: R.linkedin,  tag: "auto",   re: /linkedin/ },
  { key: "github",     res: R.github,    tag: "auto",   re: /git\s?hub/ },
  { key: "website",    res: R.website,   tag: "auto",   re: /\b(website|portfolio|personal site|web ?site|url)\b/ },
  { key: "school",     res: R.school,    tag: "auto",   re: /\b(school|university|college|institution)\b/ },
  { key: "degree",     res: R.degree,    tag: "verify", re: /\b(degree|level of education)\b/ },
  { key: "discipline", res: R.discipline,tag: "verify", re: /\b(discipline|major|field of study|concentration)\b/ },
  { key: "gpa",        res: R.gpa,       tag: "verify", re: /\bgpa\b|grade point/ },
  { key: "grad_date",  res: R.gradDate,  tag: "verify", re: /\b(graduation|expected grad|completion date|end date)\b/ },
  { key: "city",       res: R.city,      tag: "verify", re: /\b(city|location)\b/ },
  { key: "state",      res: R.state,     tag: "verify", re: /\b(state|province|region)\b/ },
  { key: "country",    res: R.country,   tag: "verify", re: /\bcountry\b/ },
  { key: "work_auth",  res: R.workAuth,  tag: "verify", re: /authorized to work|work authorization|legally authorized|eligible to work/ },
  { key: "sponsorship",res: R.sponsorship,tag: "verify",re: /sponsorship|require .*visa|need .*visa/ },
  { key: "relocate",   res: R.relocate,  tag: "verify", re: /relocat/ },
  { key: "how_heard",  res: R.howHeard,  tag: "verify", re: /how did you (hear|find)|referral source|source\b/ },
  { key: "start_date", res: R.startDate, tag: "verify", re: /start date|available to start|availability/ },
  { key: "salary",     res: R.salary,    tag: "verify", re: /salary|compensation|pay (expectation|range)|desired pay/ },
  // EEO/demographic — never auto-fill, always send to manual review.
  { key: "eeo_gender",     res: () => null, tag: "you", re: /\bgender\b/ },
  { key: "eeo_race",       res: () => null, tag: "you", re: /race|ethnicit/ },
  { key: "eeo_disability", res: () => null, tag: "you", re: /disabilit/ },
  { key: "eeo_veteran",    res: () => null, tag: "you", re: /veteran/ },
];

// ---- ATS adapters: explicit selectors for known platforms ----
// Each returns a list of {selector, key, res, tag}. Selectors are matched
// in content.js; adapters run BEFORE generic rules and win on conflict.
const ATS = {
  detect() {
    const h = location.hostname, html = document.documentElement.outerHTML;
    if (h.includes("greenhouse.io")) return "greenhouse";
    if (h.includes("lever.co")) return "lever";
    if (h.includes("ashbyhq.com")) return "ashby";
    if (h.includes("myworkdayjobs.com")) return "workday";
    if (h.includes("icims.com")) return "icims";
    if (/greenhouse/i.test(html)) return "greenhouse"; // embedded boards
    return "generic";
  },
  greenhouse: [
    { selector: "#first_name",     key: "first_name", res: R.firstName, tag: "auto" },
    { selector: "#last_name",      key: "last_name",  res: R.lastName,  tag: "auto" },
    { selector: "#email",          key: "email",      res: R.email,     tag: "auto" },
    { selector: "#phone",          key: "phone",      res: R.phone,     tag: "auto" },
    { selector: "input[autocomplete='url'], #job_application_answers_attributes input[id*='url']", key: "website", res: R.website, tag: "verify" },
  ],
  lever: [
    { selector: "input[name='name']",  key: "full_name", res: R.fullName, tag: "auto" },
    { selector: "input[name='email']", key: "email",     res: R.email,    tag: "auto" },
    { selector: "input[name='phone']", key: "phone",     res: R.phone,    tag: "auto" },
    { selector: "input[name='urls[LinkedIn]']", key: "linkedin", res: R.linkedin, tag: "auto" },
    { selector: "input[name='urls[GitHub]']",   key: "github",   res: R.github,   tag: "auto" },
  ],
  ashby: [
    // Ashby renders dynamic names; rely mostly on generic rules, seed the obvious ones.
    { selector: "input[name*='name' i]",  key: "full_name", res: R.fullName, tag: "verify" },
    { selector: "input[type='email']",    key: "email",     res: R.email,    tag: "auto" },
  ],
  workday: [],  // multi-step + account creation — handled as blockers in content.js
  icims: [],
};

// Expose to content.js (classic content scripts share window scope).
window.JobFill = { RULES, ATS, R };
