import {
  canonicalizeJobUrl,
  htmlToText,
  normalizeHackerNews,
} from '../core.mjs';
import { fetchJson, mapLimit } from './http.mjs';

const DEFAULT_JOBSTORIES_URL = 'https://hacker-news.firebaseio.com/v0/jobstories.json';
const DEFAULT_ITEM_API_BASE = 'https://hacker-news.firebaseio.com/v0/item/';

function validHttpUrl(value) {
  if (!value || !String(value).trim()) return null;
  try {
    const url = new URL(String(value).trim());
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null;
  } catch {
    return null;
  }
}

function roleFromUrl(value) {
  const url = validHttpUrl(value);
  if (!url) return null;
  const parsed = new URL(url);
  const segments = parsed.pathname.split('/').filter(Boolean);
  const jobsIndex = segments.lastIndexOf('jobs');
  if (jobsIndex < 0 || !segments[jobsIndex + 1]) return null;
  let candidate = decodeURIComponent(segments[jobsIndex + 1]);
  if (parsed.hostname === 'www.ycombinator.com') {
    const separator = candidate.indexOf('-');
    if (separator < 0) return null;
    candidate = candidate.slice(separator + 1);
  }
  if (!candidate || /^\d+$/.test(candidate) || /^[0-9a-f-]{24,}$/i.test(candidate)) return null;
  const words = candidate.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();
  if (!words) return null;
  const acronyms = new Set(['ai', 'fde', 'gtm', 'llm', 'mcp', 'ml', 'ui', 'us', 'ux']);
  return words.split(' ').map((word) => (
    acronyms.has(word.toLowerCase())
      ? word.toUpperCase()
      : word.replace(/^[a-z]/, (letter) => letter.toUpperCase())
  )).join(' ');
}

function cleanRoleTitle(value, url) {
  let title = String(value ?? '')
    .replace(/^[\s:;,.!–—-]+|[\s:;,.–—-]+$/g, '')
    .replace(/^(?:a|an)\s+/i, '')
    .trim();
  const locationPrefix = title.match(/^in\s+.+?\s+[–—-]\s+(.+)$/i);
  if (locationPrefix) title = locationPrefix[1].trim();
  const parenthesized = title.match(/^\(([^)]+)\)$/);
  if (parenthesized) title = parenthesized[1].trim();
  return title || roleFromUrl(url) || 'Open roles';
}

/** Parse only explicit employer/hiring grammar; retain the source title as evidence. */
export function parseHackerNewsJobTitle(value, url = null) {
  const sourceTitle = htmlToText(value);
  const yc = sourceTitle.match(
    /^(.+?)\s*\(\s*YC\s+([A-Z]\d{2})\s*\)\s*(?:is\s+)?(?:hiring|looking\s+for)\b(.*)$/i,
  );
  if (yc) {
    return {
      companyName: yc[1].trim(),
      roleTitle: cleanRoleTitle(yc[3], url),
      ycBatch: yc[2].toUpperCase(),
      parsed: true,
      sourceTitle,
    };
  }

  const generic = sourceTitle.match(/^(.+?)\s+(?:is\s+)?(?:hiring|looking\s+for)\b(.*)$/i);
  if (generic) {
    return {
      companyName: generic[1].trim(),
      roleTitle: cleanRoleTitle(generic[2], url),
      ycBatch: null,
      parsed: true,
      sourceTitle,
    };
  }

  return {
    companyName: null,
    roleTitle: sourceTitle || roleFromUrl(url) || 'Open roles',
    ycBatch: null,
    parsed: false,
    sourceTitle,
  };
}

export function parseHackerNewsJobIds(payload) {
  if (!Array.isArray(payload)) throw new Error('Hacker News jobstories returned no ID array');
  if (payload.length > 200) {
    throw new Error(`Hacker News jobstories returned ${payload.length} IDs; official maximum is 200`);
  }
  const ids = payload.map((value) => Number(value));
  if (ids.some((id) => !Number.isSafeInteger(id) || id <= 0)) {
    throw new Error('Hacker News jobstories returned an invalid item ID');
  }
  if (new Set(ids).size !== ids.length) {
    throw new Error('Hacker News jobstories returned duplicate item IDs');
  }
  return ids;
}

function itemUrl(id) {
  return `https://news.ycombinator.com/item?id=${encodeURIComponent(id)}`;
}

function uniqueCurrentPostings(items) {
  const eligible = items.filter((item) => (
    item.type === 'job'
      && item.deleted !== true
      && item.dead !== true
      && htmlToText(item.title)
  ));
  const selectedByUrl = new Map();
  for (const item of eligible) {
    const externalUrl = validHttpUrl(item.url);
    const targetUrl = externalUrl ?? itemUrl(item.id);
    const canonical = canonicalizeJobUrl(targetUrl);
    const selected = selectedByUrl.get(canonical);
    if (!selected
      || Number(item.time ?? 0) > Number(selected.time ?? 0)
      || (Number(item.time ?? 0) === Number(selected.time ?? 0) && item.id > selected.id)) {
      selectedByUrl.set(canonical, item);
    }
  }
  const selectedIds = new Set([...selectedByUrl.values()].map((item) => item.id));
  return {
    eligible,
    unique: eligible.filter((item) => selectedIds.has(item.id)),
  };
}

export const hackerNewsConnector = {
  type: 'hackernews',
  describe(company, inferred) {
    return {
      ...inferred,
      sourceUrl: company.api ?? DEFAULT_JOBSTORIES_URL,
      itemApiBase: company.item_api_base ?? DEFAULT_ITEM_API_BASE,
      lifecycleMode: 'windowed',
    };
  },
  async scan({ company, source, options }) {
    const ids = parseHackerNewsJobIds(await fetchJson(source.sourceUrl, options));
    const concurrency = Number(company.detail_concurrency ?? options.detailConcurrency ?? 4);
    const items = await mapLimit(ids, concurrency, async (id) => {
      const url = new URL(`${encodeURIComponent(id)}.json`, source.itemApiBase);
      const item = await fetchJson(url, options);
      if (!item || Number(item.id) !== id) {
        throw new Error(`Hacker News item ${id} returned a missing or mismatched identity`);
      }
      return item;
    });

    const { eligible, unique } = uniqueCurrentPostings(items);
    const normalized = unique.map((item) => {
      const externalUrl = validHttpUrl(item.url);
      const parsed = parseHackerNewsJobTitle(item.title, externalUrl);
      return normalizeHackerNews(company, source, {
        ...item,
        _companyName: parsed.companyName ?? company.name,
        _externalUrl: externalUrl,
        _itemUrl: itemUrl(item.id),
        _roleTitle: parsed.roleTitle,
        _targetUrl: externalUrl ?? itemUrl(item.id),
        _titleParsed: parsed.parsed,
        _ycBatch: parsed.ycBatch,
      });
    });

    return {
      jobs: normalized,
      complete: true,
      advertisedTotal: normalized.length,
      lifecycleMode: 'windowed',
      diagnostics: {
        window_ids: ids.length,
        fetched_items: items.length,
        eligible_job_items: eligible.length,
        unique_postings: normalized.length,
        duplicate_target_items: eligible.length - normalized.length,
        filtered_deleted: items.filter((item) => item.deleted === true).length,
        filtered_dead: items.filter((item) => item.dead === true).length,
        filtered_non_job: items.filter((item) => item.type !== 'job').length,
        filtered_missing_title: items.filter((item) => (
          item.type === 'job'
            && item.deleted !== true
            && item.dead !== true
            && !htmlToText(item.title)
        )).length,
      },
    };
  },
};
