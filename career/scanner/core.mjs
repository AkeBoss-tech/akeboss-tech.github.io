import { createHash } from 'node:crypto';

export const SCHEMA_VERSION = 1;

const EARLY_CAREER_TERMS = [
  'intern',
  'internship',
  'co-op',
  'coop',
  'new grad',
  'new college grad',
  'university grad',
  'graduate',
  'early career',
  'campus',
  'fellow',
  'residency',
  'apprentice',
  'student',
  '2026',
  '2027',
];

const SENIORITY_TERMS = [
  ['intern', ['intern', 'internship', 'co-op', 'coop']],
  ['new_grad', ['new grad', 'new college grad', 'university grad', 'graduate', 'early career', 'campus']],
  ['fellowship', ['fellow', 'residency', 'apprentice']],
  ['executive', ['chief', 'vice president', 'vp ', 'head of']],
  ['director', ['director']],
  ['manager', ['manager']],
  ['staff', ['staff', 'principal', 'distinguished']],
  ['senior', ['senior', 'sr.', 'sr ']],
  ['lead', ['lead']],
];

const ROLE_TRACKS = [
  ['quant', ['quant', 'trading', 'low latency', 'market data']],
  ['computational-biology', ['bioinformatics', 'computational biology', 'genomics', 'biomedical', 'drug discovery']],
  ['robotics', ['robot', 'autonomous vehicle', 'self-driving', 'perception', 'motion planning']],
  ['ai-ml', ['machine learning', 'artificial intelligence', ' ai ', 'ml ', 'llm', 'genai', 'research engineer', 'applied scientist']],
  ['data', ['data engineer', 'data scientist', 'analytics engineer']],
  ['software', ['software', 'developer', 'platform engineer', 'infrastructure', 'systems engineer', 'backend', 'frontend', 'full stack']],
  ['product', ['product manager', 'technical program manager']],
];

function compact(values) {
  return [...new Set(values.filter((value) => value !== null && value !== undefined && value !== ''))];
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\u2010-\u2015]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function containsKeyword(text, keyword) {
  const haystack = normalizeText(text);
  const needle = normalizeText(keyword);
  if (!needle) return false;
  return new RegExp(`(^|[^a-z0-9])${escapeRegExp(needle)}(?=$|[^a-z0-9])`, 'i').test(haystack);
}

function matchingKeywords(text, keywords = []) {
  return compact(keywords.map(String).filter((keyword) => containsKeyword(text, keyword)));
}

export function slugify(value) {
  return normalizeText(value)
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function canonicalizeJobUrl(rawUrl) {
  if (!rawUrl) return null;
  try {
    const url = new URL(rawUrl);
    url.hash = '';
    for (const key of [...url.searchParams.keys()]) {
      if (/^(?:utm_|gh_src|source|sourceid|ref|referrer|lever-source)/i.test(key)) {
        url.searchParams.delete(key);
      }
    }
    url.hostname = url.hostname.toLowerCase();
    url.pathname = url.pathname
      .replace(/\/application\/?$/i, '')
      .replace(/\/+$/, '') || '/';
    if (url.hostname === 'jobs.ashbyhq.com') {
      const segments = url.pathname.split('/');
      if (segments[1]) segments[1] = segments[1].toLowerCase();
      url.pathname = segments.join('/');
    }
    const params = [...url.searchParams.entries()].sort(([a], [b]) => a.localeCompare(b));
    url.search = '';
    for (const [key, value] of params) url.searchParams.append(key, value);
    return url.toString();
  } catch {
    return String(rawUrl).trim() || null;
  }
}

function canonicalSourceAliasKey(job) {
  const sourceType = String(job?.source?.type ?? '').trim().toLowerCase();
  const sourceBoard = String(job?.source?.board ?? job?.source?.slug ?? '').trim().toLowerCase();
  const canonicalUrl = canonicalizeJobUrl(job?.canonical_url);
  if (!sourceType || !sourceBoard || !canonicalUrl) return null;
  return `${sourceType}\u0000${sourceBoard}\u0000${canonicalUrl}`;
}

/**
 * Match current source records to stored lifecycle records across a stable-ID
 * correction. Exact job keys remain authoritative. When a connector fixes a
 * bad historical key, an unambiguous canonical URL on the same source can
 * migrate first-seen/classification/lifecycle history without retaining the
 * old key as a second record.
 */
export function createPreviousJobResolver(previousJobs = []) {
  const previousByKey = new Map(previousJobs.map((job) => [job.job_key, job]));
  const aliasGroups = new Map();
  for (const previous of previousJobs) {
    const aliasKey = canonicalSourceAliasKey(previous);
    if (!aliasKey) continue;
    const group = aliasGroups.get(aliasKey) ?? [];
    group.push(previous);
    aliasGroups.set(aliasKey, group);
  }

  const previousByCanonicalSource = new Map();
  const supersededPreviousKeys = new Set();
  for (const [aliasKey, group] of aliasGroups) {
    const valid = group.filter((job) => jobIdentityIssues(job).length === 0);
    if (valid.length) {
      // An invalid legacy identity is redundant only when a valid identity on
      // the same source already owns the same canonical posting URL. Consume
      // that duplicate on the next write rather than retaining two records.
      for (const invalid of group.filter((job) => jobIdentityIssues(job).length > 0)) {
        supersededPreviousKeys.add(invalid.job_key);
      }
      if (valid.length === 1) previousByCanonicalSource.set(aliasKey, valid[0]);
    } else if (group.length === 1) {
      // A lone bad historical key can still migrate to a corrected current key.
      previousByCanonicalSource.set(aliasKey, group[0]);
    }
  }

  const matchedPreviousKeys = new Set(supersededPreviousKeys);
  const effectivePreviousByKey = new Map(previousByKey);
  let migratedIdentities = 0;

  return {
    previousByKey,
    effectivePreviousByKey,
    match(current) {
      const exact = previousByKey.get(current?.job_key);
      if (exact) {
        matchedPreviousKeys.add(exact.job_key);
        return exact;
      }
      const aliasKey = canonicalSourceAliasKey(current);
      const alias = aliasKey ? previousByCanonicalSource.get(aliasKey) : null;
      if (!alias || matchedPreviousKeys.has(alias.job_key)) return null;
      matchedPreviousKeys.add(alias.job_key);
      effectivePreviousByKey.set(current.job_key, alias);
      migratedIdentities += 1;
      return alias;
    },
    hasMatched(previous) {
      return matchedPreviousKeys.has(typeof previous === 'string' ? previous : previous?.job_key);
    },
    isSuperseded(previous) {
      return supersededPreviousKeys.has(typeof previous === 'string' ? previous : previous?.job_key);
    },
    get migratedIdentities() {
      return migratedIdentities;
    },
    get supersededInvalidIdentities() {
      return supersededPreviousKeys.size;
    },
  };
}

export function dedupeJobsByCanonicalUrl(jobs) {
  const seen = new Set();
  return jobs.filter((job) => {
    const key = canonicalizeJobUrl(job.canonical_url) ?? `job-key:${job.job_key}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function reconcileLegacyPipelineTiers(pipeline, history, relevantJobs) {
  const scannerUrls = new Set();
  for (const line of String(history ?? '').split('\n').slice(1)) {
    const [rawUrl, , portal] = line.split('\t');
    if (!/^(?:ashby|greenhouse|hackernews|jsonld|lever|personio|pinpoint|recruitee|smartrecruiters|teamtailor|workable|workday):/i.test(portal ?? '')) continue;
    const canonical = canonicalizeJobUrl(rawUrl);
    if (canonical) scannerUrls.add(canonical);
  }

  const currentTiers = new Map();
  for (const job of relevantJobs ?? []) {
    const canonical = canonicalizeJobUrl(job.canonical_url);
    if (canonical && job.classification?.tier) currentTiers.set(canonical, job.classification.tier);
  }

  return String(pipeline ?? '').split('\n').map((line) => {
    const rawUrl = line.match(/^- \[ \] (https?:\/\/[^ |]+)/)?.[1];
    const canonical = canonicalizeJobUrl(rawUrl);
    if (!canonical || !scannerUrls.has(canonical) || !currentTiers.has(canonical)) return line;
    const withoutMarker = line.replace(/ \[STRETCH\]$/, '');
    return currentTiers.get(canonical) === 'stretch' ? `${withoutMarker} [STRETCH]` : withoutMarker;
  }).join('\n');
}

export function reclassifyStoredJob(job, filter) {
  const classification = classifyTitle(job.title, filter);
  const reclassified = {
    ...job,
    classification: {
      ...classification,
      configured_tracks: job.company?.lists ?? [],
    },
  };
  return classification.included ? reclassified : stripRichDescription(reclassified);
}

export function selectNewlyRelevantJobs(jobs, previousByKey) {
  return jobs.filter((job) => {
    if (job.status !== 'open' || !job.classification?.included) return false;
    const previous = previousByKey.get(job.job_key);
    return !previous || !previous.classification?.included || previous.status !== 'open';
  });
}

export function responseHash(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

export function decodeHtmlEntities(value) {
  const named = {
    amp: '&',
    apos: "'",
    gt: '>',
    hellip: '…',
    lt: '<',
    nbsp: ' ',
    ndash: '–',
    mdash: '—',
    quot: '"',
  };
  return String(value ?? '').replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const hexadecimal = entity[1]?.toLowerCase() === 'x';
      const number = Number.parseInt(entity.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      return Number.isFinite(number) ? String.fromCodePoint(number) : match;
    }
    return named[entity.toLowerCase()] ?? match;
  });
}

export function htmlToText(value) {
  const decoded = decodeHtmlEntities(decodeHtmlEntities(value));
  return decodeHtmlEntities(
    decoded
      .replace(/<\s*br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|div|li|h[1-6]|section)>/gi, '\n')
      .replace(/<li[^>]*>/gi, '- ')
      .replace(/<[^>]+>/g, ' '),
  )
    .replace(/[ \t]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function inferCompanySource(company) {
  const explicitType = normalizeText(company.ats ?? company.source_type ?? company.scan_method);
  const explicitSlug = company.ats_slug ?? company.source_slug ?? company.slug;
  const api = company.api ? String(company.api) : '';
  const careersUrl = company.careers_url ? String(company.careers_url) : '';

  const normalizeType = (type) => {
    if (type.includes('greenhouse')) return 'greenhouse';
    if (type.includes('ashby')) return 'ashby';
    if (type.includes('lever')) return 'lever';
    if (type.includes('smartrecruiters')) return 'smartrecruiters';
    if (type.includes('workable')) return 'workable';
    if (type.includes('teamtailor')) return 'teamtailor';
    if (type.includes('pinpoint')) return 'pinpoint';
    if (type.includes('personio')) return 'personio';
    if (type.includes('recruitee')) return 'recruitee';
    if (type.includes('hackernews') || type.includes('hacker news') || type.includes('hn job')) return 'hackernews';
    if (type.includes('workday')) return 'workday';
    if (type.includes('jsonld') || type.includes('json-ld') || type.includes('jobposting')) return 'jsonld';
    return null;
  };

  let type = normalizeType(explicitType);
  let sourceSlug = explicitSlug ? String(explicitSlug) : null;

  const candidates = [api, careersUrl].filter(Boolean);
  for (const candidate of candidates) {
    let parsed;
    try {
      parsed = new URL(candidate);
    } catch {
      continue;
    }
    const host = parsed.hostname.toLowerCase();
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (!type && host.includes('greenhouse.io')) type = 'greenhouse';
    if (!type && host.includes('ashbyhq.com')) type = 'ashby';
    if (!type && host.includes('lever.co')) type = 'lever';
    if (!type && host.includes('smartrecruiters.com')) type = 'smartrecruiters';
    if (!type && (host.includes('workable.com') || host.includes('apply.workable.com'))) type = 'workable';
    if (!type && host.includes('teamtailor.com')) type = 'teamtailor';
    if (!type && host.includes('pinpointhq.com')) type = 'pinpoint';
    if (!type && host.includes('.jobs.personio.')) type = 'personio';
    if (!type && host.includes('recruitee.com')) type = 'recruitee';
    if (!type && host === 'hacker-news.firebaseio.com' && segments.includes('jobstories.json')) {
      type = 'hackernews';
    }
    if (!type && (host.includes('myworkdayjobs.com') || host.includes('myworkdaysite.com'))) type = 'workday';

    if (!sourceSlug && type === 'greenhouse') {
      const boardIndex = segments.indexOf('boards');
      sourceSlug = boardIndex >= 0 ? segments[boardIndex + 1] : segments.at(-1);
    } else if (!sourceSlug && type === 'ashby') {
      const boardIndex = segments.indexOf('job-board');
      sourceSlug = boardIndex >= 0 ? segments[boardIndex + 1] : segments[0];
    } else if (!sourceSlug && type === 'lever') {
      const postingsIndex = segments.indexOf('postings');
      sourceSlug = postingsIndex >= 0 ? segments[postingsIndex + 1] : segments[0];
    } else if (!sourceSlug && type === 'smartrecruiters') {
      const companiesIndex = segments.indexOf('companies');
      sourceSlug = companiesIndex >= 0 ? segments[companiesIndex + 1] : segments[0];
    } else if (!sourceSlug && type === 'workable') {
      const accountsIndex = segments.indexOf('accounts');
      sourceSlug = accountsIndex >= 0 ? segments[accountsIndex + 1] : segments[0];
    } else if (!sourceSlug && type === 'pinpoint') {
      sourceSlug = host.split('.')[0];
    } else if (!sourceSlug && type === 'personio') {
      sourceSlug = host.split('.')[0];
    } else if (!sourceSlug && type === 'recruitee') {
      sourceSlug = host.split('.')[0];
    } else if (!sourceSlug && type === 'hackernews') {
      sourceSlug = 'yc-jobs';
    } else if (!sourceSlug && type === 'teamtailor') {
      sourceSlug = host;
    } else if (!sourceSlug && type === 'workday') {
      const cxsIndex = segments.indexOf('cxs');
      const tenant = company.workday_tenant ?? company.tenant
        ?? (cxsIndex >= 0 ? segments[cxsIndex + 1] : host.split('.')[0]);
      const firstSiteSegment = /^[a-z]{2}(?:-[a-z]{2})?$/i.test(segments[0] ?? '')
        ? segments[1]
        : segments[0];
      const site = company.workday_site ?? company.site
        ?? (cxsIndex >= 0 ? segments[cxsIndex + 2] : firstSiteSegment);
      sourceSlug = compact([tenant, site]).join('-');
    } else if (!sourceSlug && type === 'jsonld') {
      sourceSlug = host;
    }
  }

  if (!sourceSlug && type) sourceSlug = slugify(company.name);

  if (!type || !sourceSlug) return null;
  return { type, slug: sourceSlug.replace(/\/$/, '') };
}

export function classifyTitle(title, filter = {}) {
  const roleKeywords = filter.role_keywords?.length ? filter.role_keywords : filter.positive ?? [];
  const earlyKeywords = filter.early_career_keywords?.length
    ? filter.early_career_keywords
    : EARLY_CAREER_TERMS;
  const positiveKeywords = filter.positive?.length ? filter.positive : roleKeywords;
  const roleMatches = matchingKeywords(title, roleKeywords);
  const earlyCareerMatches = matchingKeywords(title, earlyKeywords);
  const positiveMatches = matchingKeywords(title, positiveKeywords);
  const excludeMatches = matchingKeywords(title, filter.negative ?? []);
  const requireRole = filter.require_role_match ?? Boolean(filter.role_keywords?.length);
  const requireEarlyCareer = filter.require_early_career ?? false;
  const included = (requireRole ? roleMatches.length > 0 : positiveMatches.length > 0)
    && (!requireEarlyCareer || earlyCareerMatches.length > 0)
    && excludeMatches.length === 0;

  let level = 'unspecified';
  for (const [candidate, terms] of SENIORITY_TERMS) {
    if (matchingKeywords(title, terms).length) {
      level = candidate;
      break;
    }
  }

  const paddedTitle = ` ${normalizeText(title)} `;
  const tracks = compact(ROLE_TRACKS.filter(([, terms]) => terms.some((term) => paddedTitle.includes(term))).map(([track]) => track));
  const tier = earlyCareerMatches.length ? 'target' : 'stretch';
  const year = paddedTitle.match(/\b20\d{2}\b/)?.[0] ?? null;
  const season = paddedTitle.match(/\b(spring|summer|fall|autumn|winter)\b/)?.[1] ?? null;
  const term = compact([season, year]).join('_') || null;

  return {
    included,
    tier,
    score: (roleMatches.length * 2) + (positiveMatches.length) + (earlyCareerMatches.length * 4),
    level,
    term,
    tracks,
    role_matches: roleMatches,
    early_career_matches: earlyCareerMatches,
    positive_matches: positiveMatches,
    exclude_matches: excludeMatches,
  };
}

function normalizeWorkplace(value, locations = []) {
  const text = normalizeText(`${value ?? ''} ${locations.join(' ')}`);
  if (text.includes('hybrid')) return 'hybrid';
  if (text.includes('remote') || text.includes('telecommute')) return 'remote';
  if (text.includes('on-site') || text.includes('onsite') || text.includes('on site')) return 'on_site';
  return 'unknown';
}

function normalizeEmployment(value, title = '') {
  const explicit = normalizeText(value);
  if (explicit) {
    if (['intern', 'internship', 'co-op', 'coop'].some((term) => containsKeyword(explicit, term))) return 'intern';
    if (['part time', 'part-time', 'parttime'].some((term) => containsKeyword(explicit, term))) return 'part_time';
    if (['contract', 'contractor', 'freelance'].some((term) => containsKeyword(explicit, term))) return 'contract';
    if (['temporary', 'seasonal', 'fixed term', 'fixed-term'].some((term) => containsKeyword(explicit, term))) return 'temporary';
    if (['full time', 'full-time', 'fulltime', 'permanent', 'regular'].some((term) => containsKeyword(explicit, term))) return 'full_time';
    return 'unknown';
  }

  if (['intern', 'internship', 'co-op', 'coop'].some((term) => containsKeyword(title, term))) return 'intern';
  if (['part time', 'part-time'].some((term) => containsKeyword(title, term))) return 'part_time';
  if (['contract', 'contractor'].some((term) => containsKeyword(title, term))) return 'contract';
  if (['temporary', 'seasonal'].some((term) => containsKeyword(title, term))) return 'temporary';
  if (['full time', 'full-time'].some((term) => containsKeyword(title, term))) return 'full_time';
  return 'unknown';
}

function normalizeLocations(values) {
  const locations = values.flatMap((value) => {
    if (!value) return [];
    if (typeof value === 'string') return [{ label: value }];
    const postal = value.address?.postalAddress ?? value.postalAddress ?? value.address ?? {};
    const label = value.location ?? value.fullLocation ?? value.name
      ?? compact([value.city, value.region, value.country]).join(', ');
    return [{
      label: label || null,
      city: postal.addressLocality ?? value.city ?? null,
      region: postal.addressRegion ?? value.region ?? value.regionCode ?? null,
      country: postal.addressCountry ?? value.country ?? null,
      remote: value.remote ?? null,
      hybrid: value.hybrid ?? null,
    }];
  }).filter((location) => location.label);
  const unique = new Map();
  for (const location of locations) {
    const key = normalizeText(compact([
      location.label,
      location.city,
      location.region,
      location.country,
    ]).join('|'));
    if (!unique.has(key)) unique.set(key, location);
  }
  return [...unique.values()];
}

function companyLists(company) {
  return compact(Array.isArray(company.list) ? company.list : [company.list, ...(company.lists ?? [])]);
}

function normalizeCustomFields(metadata = []) {
  if (!Array.isArray(metadata)) return metadata && typeof metadata === 'object' ? metadata : {};
  return Object.fromEntries(metadata
    .filter((item) => item?.name ?? item?.fieldLabel)
    .map((item) => [item.name ?? item.fieldLabel, item.value ?? item.valueLabel ?? null]));
}

function baseJob(company, source, sourceId, raw) {
  const companySlug = slugify(company.company_slug ?? company.name);
  return {
    schema_version: SCHEMA_VERSION,
    job_key: `${source.type}:${slugify(source.slug)}:${sourceId}`,
    source: {
      type: source.type,
      board: source.slug,
      job_id: String(sourceId),
      source_url: source.sourceUrl,
      response_hash: responseHash(raw),
      ...(source.lifecycleMode ? { lifecycle_mode: source.lifecycleMode } : {}),
    },
    company: {
      name: company.name,
      slug: companySlug,
      lists: companyLists(company),
      target_role: company.target_role ?? null,
      fit_tier: company.fit_tier ?? null,
    },
  };
}

export function jobIdentityIssues(job) {
  const jobId = String(job?.source?.job_id ?? '').trim().toLowerCase();
  const jobKey = String(job?.job_key ?? '').trim();
  return compact([
    jobKey ? null : 'missing_job_key',
    jobId && !['undefined', 'null'].includes(jobId) ? null : 'missing_source_job_id',
  ]);
}

export function quarantineInvalidJobIdentity(job) {
  const issues = jobIdentityIssues(job);
  if (!issues.length) return job;
  return {
    ...job,
    status: 'unknown',
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
    data_quality: {
      state: 'invalid_source_identity',
      issues,
    },
  };
}

/**
 * Identifier-only board stubs are source evidence, not actionable vacancies.
 * Keep them in the store so a later complete record can reuse the identity,
 * but do not let omission lifecycle states imply that an unusable stub was an
 * open job that has now closed.
 */
export function preserveIncompleteSourceRecord(job) {
  if (job?.data_quality?.state !== 'incomplete_source_record') return job;
  return {
    ...job,
    status: 'unknown',
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
  };
}

export function normalizeGreenhouse(company, source, raw) {
  const customFields = normalizeCustomFields(raw.metadata);
  const employmentValue = Object.entries(customFields)
    .find(([name]) => /employment\s*type|commitment/i.test(name))?.[1] ?? null;
  const locations = normalizeLocations([
    raw.location?.name,
    ...(raw.offices ?? []).map((office) => office.location ?? office.name),
  ]);
  const html = decodeHtmlEntities(raw.content ?? '');
  return {
    ...baseJob(company, source, raw.id, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.absolute_url),
    apply_url: raw.absolute_url ?? null,
    locations,
    workplace_type: normalizeWorkplace(null, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(employmentValue, raw.title),
    departments: compact((raw.departments ?? []).map((item) => item.name)),
    teams: [],
    language: raw.language ?? null,
    requisition_id: raw.requisition_id ?? null,
    internal_job_id: raw.internal_job_id ?? null,
    first_published_at: raw.first_published ?? null,
    source_updated_at: raw.updated_at ?? null,
    application_deadline: raw.application_deadline ?? null,
    description_plain: htmlToText(html),
    description_html: html || null,
    compensation: [],
    custom_fields: customFields,
  };
}

export function normalizeAshby(company, source, raw) {
  const locations = normalizeLocations([
    { location: raw.location, address: raw.address },
    ...(raw.secondaryLocations ?? []),
  ]);
  const compensation = raw.compensation ? [{
    type: 'salary',
    summary: raw.compensation.compensationTierSummary ?? raw.compensation.scrapeableCompensationSalarySummary ?? null,
    salary_summary: raw.compensation.scrapeableCompensationSalarySummary ?? null,
    tiers: (raw.compensation.compensationTiers ?? []).map((tier) => ({
      title: tier.title ?? null,
      summary: tier.tierSummary ?? null,
      additional_information: tier.additionalInformation ?? null,
    })),
  }] : [];
  return {
    ...baseJob(company, source, raw.id, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.jobUrl),
    apply_url: raw.applyUrl ?? raw.jobUrl ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.workplaceType ?? (raw.isRemote ? 'remote' : null), locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.employmentType, raw.title),
    departments: compact([raw.department]),
    teams: compact([raw.team]),
    language: null,
    requisition_id: null,
    internal_job_id: null,
    first_published_at: raw.publishedAt ?? null,
    source_updated_at: null,
    application_deadline: null,
    description_plain: raw.descriptionPlain?.trim() ?? htmlToText(raw.descriptionHtml),
    description_html: raw.descriptionHtml ?? null,
    compensation,
    custom_fields: {},
  };
}

export function normalizeLever(company, source, raw) {
  const locations = normalizeLocations(raw.categories?.allLocations?.length
    ? raw.categories.allLocations
    : [raw.categories?.location]);
  const descriptionHtml = compact([raw.description, raw.additional]).join('\n');
  const descriptionPlain = compact([raw.descriptionPlain, raw.additionalPlain]).join('\n\n');
  const salary = raw.salaryRange ? [{
    type: 'salary',
    currency: raw.salaryRange.currency ?? null,
    interval: raw.salaryRange.interval ?? null,
    min: raw.salaryRange.min ?? null,
    max: raw.salaryRange.max ?? null,
    summary: raw.salaryDescriptionPlain ?? null,
  }] : [];
  return {
    ...baseJob(company, source, raw.id, raw),
    title: raw.text?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.hostedUrl),
    apply_url: raw.applyUrl ?? raw.hostedUrl ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.workplaceType, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.categories?.commitment, raw.text),
    departments: compact([raw.categories?.department]),
    teams: compact([raw.categories?.team]),
    language: null,
    requisition_id: null,
    internal_job_id: null,
    first_published_at: Number.isFinite(raw.createdAt) ? new Date(raw.createdAt).toISOString() : null,
    source_updated_at: null,
    application_deadline: null,
    description_plain: descriptionPlain || htmlToText(descriptionHtml),
    description_html: descriptionHtml || null,
    compensation: salary,
    custom_fields: {
      country: raw.country ?? null,
      level: raw.categories?.level ?? null,
      sections: (raw.lists ?? []).map((section) => section.text).filter(Boolean),
    },
  };
}

export function normalizeSmartRecruiters(company, source, raw) {
  const sections = raw.jobAd?.sections ?? {};
  const descriptionHtml = Object.values(sections).map((section) => section?.text).filter(Boolean).join('\n');
  const locations = normalizeLocations([raw.location]);
  return {
    ...baseJob(company, source, raw.id, raw),
    title: raw.name?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.postingUrl ?? raw.ref
      ?? `${source.sourceUrl.replace(/\/$/, '')}/${encodeURIComponent(raw.id)}`),
    apply_url: raw.applyUrl ?? raw.postingUrl ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.location?.hybrid ? 'hybrid' : raw.location?.remote ? 'remote' : null, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.typeOfEmployment?.label, raw.name),
    departments: compact([raw.department?.label, raw.function?.label]),
    teams: [],
    language: raw.language?.code ?? null,
    requisition_id: raw.refNumber ?? null,
    internal_job_id: raw.jobId ?? null,
    first_published_at: raw.releasedDate ?? null,
    source_updated_at: null,
    application_deadline: null,
    description_plain: htmlToText(descriptionHtml),
    description_html: descriptionHtml || null,
    compensation: [],
    custom_fields: {
      experience_level: raw.experienceLevel?.label ?? null,
      industry: raw.industry?.label ?? null,
      ...normalizeCustomFields(raw.customField),
    },
  };
}

export function normalizeWorkable(company, source, raw) {
  const locationValues = raw.locations?.length ? raw.locations : [raw.location ?? {
    city: raw.city,
    region: raw.state,
    country: raw.country,
  }];
  const locations = normalizeLocations(locationValues);
  return {
    ...baseJob(company, source, raw.shortcode ?? raw.id, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.url ?? raw.shortlink),
    apply_url: raw.application_url ?? raw.url ?? raw.shortlink ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.telecommuting ? 'remote' : null, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.employment_type, raw.title),
    departments: compact([raw.department, raw.function]),
    teams: [],
    language: null,
    requisition_id: raw.shortcode ?? null,
    internal_job_id: raw.id ?? null,
    first_published_at: raw.published_on ?? raw.created_at ?? null,
    source_updated_at: raw.updated_at ?? null,
    application_deadline: null,
    description_plain: raw.description?.replace(/\r/g, '').trim() ?? null,
    description_html: raw.description_html ?? null,
    compensation: [],
    custom_fields: {
      experience: raw.experience ?? null,
      industry: raw.industry ?? null,
    },
  };
}

export function normalizeTeamtailor(company, source, raw) {
  const locations = normalizeLocations(raw.locations ?? []);
  const descriptionHtml = raw.description ?? '';
  return {
    ...baseJob(company, source, raw.guid ?? raw.link, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.link),
    apply_url: raw.link ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.remoteStatus, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.employmentType, raw.title),
    departments: compact([raw.department]),
    teams: compact([raw.role, raw.division]),
    language: raw.language ?? null,
    requisition_id: null,
    internal_job_id: raw.guid ?? null,
    first_published_at: raw.pubDate ?? null,
    source_updated_at: null,
    application_deadline: null,
    description_plain: htmlToText(descriptionHtml),
    description_html: descriptionHtml || null,
    compensation: [],
    custom_fields: {
      remote_status: raw.remoteStatus ?? null,
    },
  };
}

export function normalizePinpoint(company, source, raw) {
  const locations = normalizeLocations([raw.location ? {
    ...raw.location,
    region: raw.location.region ?? raw.location.province,
    country: raw.location.country ?? raw.location.country_code,
  } : null]);
  const descriptionHtml = compact([
    raw.description,
    raw.key_responsibilities,
    raw.skills_knowledge_expertise,
    raw.benefits,
  ]).join('\n');
  const compensation = raw.compensation_visible && (raw.compensation || raw.compensation_minimum || raw.compensation_maximum)
    ? [{
      type: 'salary',
      currency: raw.compensation_currency ?? null,
      interval: raw.compensation_frequency ?? null,
      min: raw.compensation_minimum ?? null,
      max: raw.compensation_maximum ?? null,
      summary: raw.compensation ?? null,
    }]
    : [];
  return {
    ...baseJob(company, source, raw.id, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.url),
    apply_url: raw.url ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.location?.name, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.employment_type_text ?? raw.employment_type, raw.title),
    departments: compact([raw.department?.name, raw.division?.name]),
    teams: compact([raw.structure_custom_group_one?.name]),
    language: raw.locale ?? null,
    requisition_id: raw.requisition_id ?? null,
    internal_job_id: raw.id ?? null,
    first_published_at: raw.published_at ?? raw.created_at ?? null,
    source_updated_at: raw.updated_at ?? null,
    application_deadline: raw.deadline_at ?? null,
    description_plain: htmlToText(descriptionHtml),
    description_html: descriptionHtml || null,
    compensation,
    custom_fields: {
      reporting_to: raw.reporting_to ?? null,
    },
  };
}

export function normalizePersonio(company, source, raw) {
  const locations = normalizeLocations([
    raw.office,
    ...(raw.additionalOffices ?? []),
  ]);
  const descriptionHtml = (raw.jobDescriptions ?? [])
    .map((section) => compact([section.name ? `<h3>${section.name}</h3>` : null, section.value]).join('\n'))
    .join('\n');
  const jobUrl = raw.url ?? new URL(`job/${encodeURIComponent(raw.id)}`, source.careersBase ?? source.sourceUrl).toString();
  return {
    ...baseJob(company, source, raw.id, raw),
    title: raw.name?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(jobUrl),
    apply_url: raw.applyUrl ?? jobUrl,
    locations,
    workplace_type: normalizeWorkplace(raw.workplaceType, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.employmentType ?? raw.schedule, raw.name),
    departments: compact([raw.department, raw.recruitingCategory]),
    teams: compact([raw.subcompany]),
    language: raw.language ?? null,
    requisition_id: raw.id ?? null,
    internal_job_id: raw.id ?? null,
    first_published_at: raw.createdAt ?? null,
    source_updated_at: raw.updatedAt ?? null,
    application_deadline: null,
    description_plain: htmlToText(descriptionHtml),
    description_html: descriptionHtml || null,
    compensation: [],
    custom_fields: {
      occupation: raw.occupation ?? null,
      years_of_experience: raw.yearsOfExperience ?? null,
    },
  };
}

export function normalizeRecruitee(company, source, raw) {
  const locations = normalizeLocations(raw.locations?.length ? raw.locations : [
    raw.location ?? {
      city: raw.city,
      region: raw.state,
      country: raw.country,
    },
  ]);
  const compensation = raw.salary && (raw.salary.min || raw.salary.max)
    ? [{
      type: 'salary',
      currency: raw.salary.currency ?? null,
      interval: raw.salary.period ?? null,
      min: raw.salary.min ?? null,
      max: raw.salary.max ?? null,
      summary: null,
    }]
    : [];
  const workplace = raw.hybrid ? 'hybrid' : raw.remote ? 'remote' : raw.onSite ? 'on_site' : null;
  return {
    ...baseJob(company, source, raw.reference, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(raw.url),
    apply_url: raw.applyUrl ?? raw.url ?? null,
    locations,
    workplace_type: normalizeWorkplace(workplace, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.contractType, raw.title),
    departments: compact([raw.department, raw.category]),
    teams: [],
    language: raw.language ?? null,
    requisition_id: raw.reference ?? null,
    internal_job_id: raw.reference ?? null,
    first_published_at: raw.posted ?? null,
    source_updated_at: raw.updated ?? null,
    application_deadline: null,
    description_plain: htmlToText(raw.description),
    description_html: raw.description || null,
    compensation,
    custom_fields: {
      education: raw.education ?? null,
      experience: raw.experience ?? null,
      min_hours: raw.minHours ?? null,
      max_hours: raw.maxHours ?? null,
      source_slug: raw.slug ?? null,
    },
  };
}

export function normalizeHackerNews(company, source, raw) {
  const itemUrl = raw._itemUrl
    ?? `https://news.ycombinator.com/item?id=${encodeURIComponent(raw.id)}`;
  const targetUrl = raw._targetUrl ?? raw.url ?? itemUrl;
  const locations = [];
  const actualCompanyName = raw._companyName ?? company.name;
  const publishedAt = Number.isSafeInteger(raw.time) && raw.time >= 0
    ? new Date(raw.time * 1_000).toISOString()
    : null;
  const normalized = baseJob(company, source, raw.id, raw);
  return {
    ...normalized,
    company: {
      ...normalized.company,
      name: actualCompanyName,
      slug: slugify(actualCompanyName),
      yc_batch: raw._ycBatch ?? null,
    },
    title: raw._roleTitle?.trim() || htmlToText(raw.title),
    canonical_url: canonicalizeJobUrl(targetUrl),
    apply_url: targetUrl,
    locations,
    workplace_type: normalizeWorkplace(null, []),
    employment_type: normalizeEmployment(null, raw._roleTitle ?? raw.title),
    departments: [],
    teams: [],
    language: 'en',
    requisition_id: String(raw.id),
    internal_job_id: String(raw.id),
    first_published_at: publishedAt,
    source_updated_at: null,
    application_deadline: null,
    description_plain: htmlToText(raw.text),
    description_html: raw.text || null,
    compensation: [],
    custom_fields: {
      hn_author: raw.by ?? null,
      hn_item_url: itemUrl,
      hn_source_title: htmlToText(raw.title),
      external_url: raw._externalUrl ?? null,
      yc_batch: raw._ycBatch ?? null,
    },
  };
}

function jsonLdIdentifier(raw) {
  const identifier = Array.isArray(raw.identifier) ? raw.identifier[0] : raw.identifier;
  const value = typeof identifier === 'object'
    ? identifier?.value ?? identifier?.name ?? identifier?.['@id']
    : identifier;
  return value ?? raw.url ?? raw._pageUrl ?? responseHash(raw).slice(0, 24);
}

function jsonLdLocations(raw) {
  const sourceLocations = Array.isArray(raw.jobLocation) ? raw.jobLocation : [raw.jobLocation];
  return sourceLocations.filter(Boolean).map((location) => {
    const address = location.address ?? location;
    return {
      name: location.name,
      city: address.addressLocality,
      region: address.addressRegion,
      country: typeof address.addressCountry === 'object'
        ? address.addressCountry.name ?? address.addressCountry.value
        : address.addressCountry,
    };
  });
}

export function normalizeJsonLd(company, source, raw) {
  const locations = normalizeLocations(jsonLdLocations(raw));
  const salary = raw.baseSalary?.value ?? raw.baseSalary;
  const compensation = salary && typeof salary === 'object' ? [{
    type: 'salary',
    currency: raw.baseSalary?.currency ?? salary.currency ?? null,
    interval: salary.unitText ?? null,
    min: salary.minValue ?? salary.value ?? null,
    max: salary.maxValue ?? salary.value ?? null,
    summary: null,
  }] : [];
  let canonicalUrl = raw.url ?? raw._pageUrl;
  if (canonicalUrl && raw._pageUrl) {
    try {
      canonicalUrl = new URL(canonicalUrl, raw._pageUrl).toString();
    } catch {
      // canonicalizeJobUrl retains the original value for unusual but usable URLs.
    }
  }
  return {
    ...baseJob(company, source, jsonLdIdentifier(raw), raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(canonicalUrl),
    apply_url: canonicalUrl ?? null,
    locations,
    workplace_type: normalizeWorkplace(raw.jobLocationType, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.employmentType, raw.title),
    departments: compact([raw.occupationalCategory]),
    teams: [],
    language: raw.inLanguage ?? null,
    requisition_id: String(jsonLdIdentifier(raw)),
    internal_job_id: null,
    first_published_at: raw.datePosted ?? null,
    source_updated_at: raw.dateModified ?? null,
    application_deadline: raw.validThrough ?? null,
    description_plain: htmlToText(raw.description),
    description_html: raw.description ?? null,
    compensation,
    custom_fields: {
      applicant_location_requirements: raw.applicantLocationRequirements ?? null,
      direct_apply: raw.directApply ?? null,
      hiring_organization: raw.hiringOrganization?.name ?? null,
    },
  };
}

export function normalizeWorkday(company, source, raw) {
  const locations = normalizeLocations([
    raw.location ?? raw.locationsText,
    ...(raw.additionalLocations ?? []),
  ]);
  const bulletFields = Array.isArray(raw.bulletFields)
    ? raw.bulletFields
    : [raw.bulletFields].filter((value) => value != null);
  const canonicalUrl = raw.externalUrl
    ?? (raw.externalPath ? new URL(raw.externalPath.replace(/^\//, ''), `${source.careersBase.replace(/\/$/, '')}/`).toString() : null);
  const sourceId = [
    // Every Workday summary includes externalPath and Workday uses it as the
    // posting route. bulletFields are tenant-defined display data (often the
    // first value is a location), so they are not safe source identities.
    raw.externalPath,
    raw.jobPostingId,
    raw.id,
    raw.jobReqId,
    ...bulletFields.toReversed(),
  ].find((value) => value != null && String(value).trim());
  return {
    ...baseJob(company, source, sourceId, raw),
    title: raw.title?.trim() ?? '',
    canonical_url: canonicalizeJobUrl(canonicalUrl),
    apply_url: canonicalUrl,
    locations,
    workplace_type: normalizeWorkplace(raw.workplaceType, locations.map((location) => location.label)),
    employment_type: normalizeEmployment(raw.timeType ?? raw.workerSubType, raw.title),
    departments: compact([raw.jobFamily, raw.jobCategory]),
    teams: [],
    language: raw.language ?? null,
    requisition_id: [raw.jobReqId, ...bulletFields.toReversed()]
      .find((value) => value != null && String(value).trim()) ?? null,
    internal_job_id: raw.id ?? raw.jobPostingId ?? null,
    first_published_at: raw.startDate ?? raw.posted ?? null,
    source_updated_at: null,
    application_deadline: null,
    description_plain: htmlToText(raw.jobDescription),
    description_html: raw.jobDescription ?? null,
    compensation: [],
    custom_fields: {
      can_apply: raw.canApply ?? null,
      country: raw.country ?? null,
      posted_on: raw.postedOn ?? null,
    },
  };
}

export function finalizeJob(job, filter, now, previous) {
  const classification = classifyTitle(job.title, filter);
  const dataIssues = compact([
    job.title?.trim() ? null : 'missing_title',
    job.canonical_url ? null : 'missing_canonical_url',
  ]);
  return {
    ...job,
    source: {
      ...job.source,
      fetched_at: now,
    },
    // Some public boards advertise withdrawn or restricted requisitions using
    // identifier-only stubs. Preserve that source evidence, but do not expose
    // the stub as an actionable open role.
    status: dataIssues.length ? 'unknown' : 'open',
    first_seen_at: previous?.first_seen_at ?? now,
    last_seen_at: now,
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
    data_quality: dataIssues.length ? {
      state: 'incomplete_source_record',
      issues: dataIssues,
    } : null,
    classification: {
      ...classification,
      configured_tracks: job.company.lists,
    },
  };
}

export function stripRichDescription(job) {
  return {
    ...job,
    description_plain: null,
    description_html: null,
  };
}
