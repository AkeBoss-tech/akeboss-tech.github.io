import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, before, test } from 'node:test';
import { fetchJson, mapLimit } from '../scanner/adapters.mjs';
import {
  canonicalizeJobUrl,
  classifyTitle,
  containsKeyword,
  createPreviousJobResolver,
  dedupeJobsByCanonicalUrl,
  finalizeJob,
  htmlToText,
  inferCompanySource,
  normalizeAshby,
  normalizeGreenhouse,
  normalizeLever,
  normalizeSmartRecruiters,
  normalizeWorkable,
  normalizeWorkday,
  preserveIncompleteSourceRecord,
  quarantineInvalidJobIdentity,
  reclassifyStoredJob,
  reconcileLegacyPipelineTiers,
  selectNewlyRelevantJobs,
  stripRichDescription,
} from '../scanner/core.mjs';
import { atomicWriteTransaction, pathExists, recoverWriteTransaction } from '../scanner/storage.mjs';

const filter = {
  role_keywords: ['Software Engineer', 'Machine Learning', 'AI', 'ML', 'Quantitative'],
  early_career_keywords: ['Intern', 'New Grad', '2027'],
  positive: ['Software Engineer', 'Machine Learning', 'AI', 'ML', 'Quantitative', 'Intern', 'New Grad', '2027'],
  negative: ['Senior', 'Manager'],
  require_role_match: true,
};

test('canonicalizeJobUrl collapses application and tracking variants', () => {
  assert.equal(
    canonicalizeJobUrl('https://jobs.ashbyhq.com/Cohere/abc/application/?utm_source=x#apply'),
    'https://jobs.ashbyhq.com/cohere/abc',
  );
  assert.equal(
    canonicalizeJobUrl('https://careers.example/jobs?jobCode=123&utm_medium=email'),
    'https://careers.example/jobs?jobCode=123',
  );
});

test('short keywords use token boundaries', () => {
  assert.equal(containsKeyword('AI Engineer Intern', 'AI'), true);
  assert.equal(containsKeyword('Retail Operations Intern', 'AI'), false);
  assert.equal(containsKeyword('HTML Platform Engineer', 'ML'), false);
  assert.equal(containsKeyword('Internal Product Engineer', 'Intern'), false);
  assert.equal(containsKeyword('Software Engineer, International', 'Intern'), false);
});

test('classification distinguishes target, stretch, and excluded roles', () => {
  const target = classifyTitle('2027 AI Software Engineer Intern', filter);
  assert.equal(target.included, true);
  assert.equal(target.tier, 'target');
  assert.equal(target.level, 'intern');
  assert.equal(target.term, '2027');

  const stretch = classifyTitle('Machine Learning Engineer', filter);
  assert.equal(stretch.included, true);
  assert.equal(stretch.tier, 'stretch');

  const excluded = classifyTitle('Senior Machine Learning Engineer', filter);
  assert.equal(excluded.included, false);
  assert.deepEqual(excluded.exclude_matches, ['Senior']);

  const generic = classifyTitle('2027 Marketing Intern', filter);
  assert.equal(generic.included, false);
});

test('legacy and explicit ATS configuration are inferred compatibly', () => {
  assert.deepEqual(
    inferCompanySource({ api: 'https://boards-api.greenhouse.io/v1/boards/anthropic/jobs' }),
    { type: 'greenhouse', slug: 'anthropic' },
  );
  assert.deepEqual(
    inferCompanySource({ careers_url: 'https://jobs.ashbyhq.com/cohere' }),
    { type: 'ashby', slug: 'cohere' },
  );
  assert.deepEqual(
    inferCompanySource({ ats: 'ashby', ats_slug: 'perplexity' }),
    { type: 'ashby', slug: 'perplexity' },
  );
});

test('Greenhouse normalization keeps stable IDs and rich fields', () => {
  const company = { name: 'Example AI', list: ['ai-ml'] };
  const source = { type: 'greenhouse', slug: 'example', sourceUrl: 'https://example/jobs' };
  const job = normalizeGreenhouse(company, source, {
    id: 123,
    internal_job_id: 456,
    requisition_id: 'REQ-7',
    title: 'Software Engineer Intern 2027',
    absolute_url: 'https://job-boards.greenhouse.io/example/jobs/123',
    location: { name: 'New York, NY' },
    offices: [{ name: 'Remote', location: 'Remote' }, { name: 'Remote duplicate', location: 'Remote' }],
    departments: [{ name: 'Engineering' }],
    first_published: '2026-08-01T00:00:00Z',
    updated_at: '2026-08-02T00:00:00Z',
    language: 'en',
    content: '&lt;p&gt;Build &amp;amp; ship systems.&lt;/p&gt;',
    metadata: [{ name: 'Employment Type', value: 'Intern' }],
  });
  assert.equal(job.job_key, 'greenhouse:example:123');
  assert.equal(job.description_plain, 'Build & ship systems.');
  assert.equal(job.workplace_type, 'remote');
  assert.deepEqual(job.locations.map((location) => location.label), ['New York, NY', 'Remote']);
  assert.deepEqual(job.departments, ['Engineering']);
  assert.equal(job.custom_fields['Employment Type'], 'Intern');
});

test('Ashby normalization captures secondary locations and compensation', () => {
  const job = normalizeAshby(
    { name: 'Example', list: ['ai-ml'] },
    { type: 'ashby', slug: 'example', sourceUrl: 'https://api.example' },
    {
      id: 'job-1',
      title: 'AI Engineer Intern',
      location: 'New York',
      secondaryLocations: [{ location: 'San Francisco' }],
      employmentType: 'Intern',
      workplaceType: 'Hybrid',
      jobUrl: 'https://jobs.ashbyhq.com/example/job-1',
      applyUrl: 'https://jobs.ashbyhq.com/example/job-1/application',
      descriptionPlain: 'Build models.',
      publishedAt: '2026-08-01T00:00:00Z',
      compensation: {
        compensationTierSummary: '$50–$60/hour',
        compensationTiers: [{ title: 'US', tierSummary: '$50–$60/hour' }],
      },
    },
  );
  assert.deepEqual(job.locations.map((location) => location.label), ['New York', 'San Francisco']);
  assert.equal(job.employment_type, 'intern');
  assert.equal(job.workplace_type, 'hybrid');
  assert.equal(job.compensation[0].summary, '$50–$60/hour');

  const partnership = normalizeAshby(
    { name: 'Example' },
    { type: 'ashby', slug: 'example', sourceUrl: 'https://api.example' },
    { id: 'job-2', title: 'Partnerships Engineer', employmentType: 'FullTime', jobUrl: 'https://jobs.ashbyhq.com/example/job-2' },
  );
  assert.equal(partnership.employment_type, 'full_time');

  const fullStack = normalizeAshby(
    { name: 'Example' },
    { type: 'ashby', slug: 'example', sourceUrl: 'https://api.example' },
    { id: 'job-3', title: 'Full Stack Engineer', jobUrl: 'https://jobs.ashbyhq.com/example/job-3' },
  );
  assert.equal(fullStack.employment_type, 'unknown');
});

test('same-run canonical URL collisions are deduplicated before projection', () => {
  const jobs = dedupeJobsByCanonicalUrl([
    { job_key: 'ashby:example:1', canonical_url: 'https://jobs.ashbyhq.com/Example/1/application' },
    { job_key: 'ashby:example:2', canonical_url: 'https://jobs.ashbyhq.com/example/1' },
    { job_key: 'ashby:example:3', canonical_url: 'https://jobs.ashbyhq.com/example/3' },
  ]);
  assert.deepEqual(jobs.map((job) => job.job_key), ['ashby:example:1', 'ashby:example:3']);
});

test('legacy projection only retags scanner-managed rows', () => {
  const pipeline = [
    '# Pipeline',
    '- [ ] https://jobs.ashbyhq.com/example/target | Example | Target [STRETCH]',
    '- [ ] https://jobs.ashbyhq.com/example/stretch | Example | Stretch',
    '- [ ] https://manual.example/role | Manual | Keep unchanged',
  ].join('\n');
  const history = [
    'url\tfirst_seen\tportal\ttitle\tcompany\tstatus',
    'https://jobs.ashbyhq.com/example/target\t2026-08-20\tashby:example\tTarget\tExample\tadded',
    'https://jobs.ashbyhq.com/example/stretch\t2026-08-20\tashby:example\tStretch\tExample\tadded',
    'https://manual.example/role\t2026-08-20\tManual\tManual\tManual\tadded',
  ].join('\n');
  const reconciled = reconcileLegacyPipelineTiers(pipeline, history, [
    { canonical_url: 'https://jobs.ashbyhq.com/example/target', classification: { tier: 'target' } },
    { canonical_url: 'https://jobs.ashbyhq.com/example/stretch', classification: { tier: 'stretch' } },
    { canonical_url: 'https://manual.example/role', classification: { tier: 'stretch' } },
  ]);
  assert.match(reconciled, /Target$/m);
  assert.match(reconciled, /Stretch \[STRETCH\]$/m);
  assert.match(reconciled, /Manual \| Keep unchanged$/m);
});

test('stored jobs are reclassified without changing source lifecycle data', () => {
  const stored = {
    job_key: 'ashby:example:1',
    title: 'Internal Product Engineer',
    source: { fetched_at: '2026-08-01T00:00:00Z' },
    company: { lists: ['software'] },
    status: 'open',
    first_seen_at: '2026-07-01T00:00:00Z',
    description_plain: 'Old rich data',
    description_html: '<p>Old rich data</p>',
    classification: { included: true, tier: 'target' },
  };
  const reclassified = reclassifyStoredJob(stored, filter);
  assert.equal(reclassified.classification.included, false);
  assert.equal(reclassified.source.fetched_at, stored.source.fetched_at);
  assert.equal(reclassified.first_seen_at, stored.first_seen_at);
  assert.equal(reclassified.description_plain, null);
});

test('newly relevant selection includes filter changes and reopened jobs', () => {
  const previous = new Map([
    ['changed', { status: 'open', classification: { included: false } }],
    ['reopened', { status: 'closed', classification: { included: true } }],
    ['existing', { status: 'open', classification: { included: true } }],
  ]);
  const jobs = ['new', 'changed', 'reopened', 'existing'].map((jobKey) => ({
    job_key: jobKey,
    status: 'open',
    classification: { included: true },
  }));
  assert.deepEqual(
    selectNewlyRelevantJobs(jobs, previous).map((job) => job.job_key),
    ['new', 'changed', 'reopened'],
  );
});

test('projection transaction commits both files and recovers a partial rename', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'career-storage-'));
  try {
    const first = join(directory, 'pipeline.md');
    const second = join(directory, 'scan-history.tsv');
    const journal = join(directory, '.projection.json');
    await atomicWriteTransaction(journal, [
      { path: first, contents: 'pipeline-v1' },
      { path: second, contents: 'history-v1' },
    ]);
    assert.equal(await readFile(first, 'utf8'), 'pipeline-v1');
    assert.equal(await readFile(second, 'utf8'), 'history-v1');
    assert.equal(await pathExists(journal), false);

    const secondTemporary = '.scan-history.tsv.partial.tmp';
    await writeFile(first, 'pipeline-v2', 'utf8');
    await writeFile(join(directory, secondTemporary), 'history-v2', 'utf8');
    await writeFile(journal, JSON.stringify({
      version: 1,
      entries: [
        { target: 'pipeline.md', temporary: '.pipeline.md.already-renamed.tmp' },
        { target: 'scan-history.tsv', temporary: secondTemporary },
      ],
    }), 'utf8');
    assert.equal(await recoverWriteTransaction(journal), true);
    assert.equal(await readFile(first, 'utf8'), 'pipeline-v2');
    assert.equal(await readFile(second, 'utf8'), 'history-v2');
    assert.equal(await pathExists(journal), false);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test('Lever identity does not merge same-title location variants', () => {
  const company = { name: 'Example', list: ['robotics'] };
  const source = { type: 'lever', slug: 'example', sourceUrl: 'https://api.example' };
  const base = {
    text: 'Research Engineer Intern',
    hostedUrl: 'https://jobs.lever.co/example/a',
    applyUrl: 'https://jobs.lever.co/example/a/apply',
    categories: { commitment: 'Intern', team: 'Research' },
    descriptionPlain: 'Research robots.',
  };
  const toronto = normalizeLever(company, source, {
    ...base,
    id: 'toronto',
    categories: { ...base.categories, location: 'Toronto' },
  });
  const pittsburgh = normalizeLever(company, source, {
    ...base,
    id: 'pittsburgh',
    hostedUrl: 'https://jobs.lever.co/example/b',
    categories: { ...base.categories, location: 'Pittsburgh' },
  });
  assert.notEqual(toronto.job_key, pittsburgh.job_key);
  assert.notDeepEqual(toronto.locations, pittsburgh.locations);
});

test('SmartRecruiters and Workable normalization preserve source-specific data', () => {
  const smart = normalizeSmartRecruiters(
    { name: 'Example', list: ['software'] },
    { type: 'smartrecruiters', slug: 'Example', sourceUrl: 'https://api.example' },
    {
      id: 'sr-1',
      name: 'Software Engineer Intern',
      postingUrl: 'https://jobs.smartrecruiters.com/Example/sr-1-role',
      applyUrl: 'https://jobs.smartrecruiters.com/Example/sr-1-role?apply=true',
      releasedDate: '2026-08-01T00:00:00Z',
      location: { fullLocation: 'New York, NY', city: 'New York', region: 'NY', country: 'us', hybrid: true },
      typeOfEmployment: { label: 'Internship' },
      department: { label: 'Engineering' },
      experienceLevel: { label: 'Entry Level' },
      jobAd: { sections: { jobDescription: { text: '<p>Build products.</p>' } } },
    },
  );
  assert.equal(smart.workplace_type, 'hybrid');
  assert.equal(smart.description_plain, 'Build products.');
  assert.equal(smart.custom_fields.experience_level, 'Entry Level');

  const smartSummary = normalizeSmartRecruiters(
    { name: 'Example', list: ['software'] },
    { type: 'smartrecruiters', slug: 'Example', sourceUrl: 'https://api.smartrecruiters.com/v1/companies/Example/postings' },
    { id: 'sr-2', name: 'Accountant', ref: 'https://api.smartrecruiters.com/v1/companies/Example/postings/sr-2' },
  );
  assert.equal(smartSummary.canonical_url, 'https://api.smartrecruiters.com/v1/companies/Example/postings/sr-2');

  const workable = normalizeWorkable(
    { name: 'Example', list: ['ai-ml'] },
    { type: 'workable', slug: 'example', sourceUrl: 'https://api.example' },
    {
      shortcode: 'WK1',
      title: 'Machine Learning Intern',
      url: 'https://apply.workable.com/example/j/WK1',
      application_url: 'https://apply.workable.com/example/j/WK1/apply',
      locations: [{ city: 'Remote', country: 'US', remote: true }],
      telecommuting: true,
      employment_type: 'Internship',
      description: 'Train useful models.',
    },
  );
  assert.equal(workable.job_key, 'workable:example:WK1');
  assert.equal(workable.workplace_type, 'remote');
});

test('Workday identity uses the unique posting path instead of tenant display bullets', () => {
  const normalized = normalizeWorkday(
    { name: 'Example', list: ['software'] },
    {
      type: 'workday',
      slug: 'example-careers',
      sourceUrl: 'https://example.wd1.myworkdayjobs.com/wday/cxs/example/careers/jobs',
      careersBase: 'https://example.wd1.myworkdayjobs.com/careers',
    },
    {
      jobReqId: 'R19572',
      bulletFields: ['Cambridge, Massachusetts', 'Digital', 'R19572'],
      externalPath: '/job/new-york/data-scientist_REQ-7',
      title: 'Data Scientist',
    },
  );
  assert.equal(normalized.source.job_id, '/job/new-york/data-scientist_REQ-7');
  assert.match(normalized.job_key, /data-scientist_REQ-7$/);
  assert.equal(normalized.requisition_id, 'R19572');
});

test('stable-ID corrections migrate lifecycle history by unambiguous source URL', () => {
  const previous = {
    job_key: 'workday:moderna:Cambridge, Massachusetts',
    source: { type: 'workday', board: 'moderna', job_id: 'Cambridge, Massachusetts' },
    canonical_url: 'https://example.test/job/cambridge/data-scientist_R19572',
    first_seen_at: '2026-08-01T00:00:00Z',
    status: 'possibly_closed',
    classification: { included: true },
  };
  const current = {
    job_key: 'workday:moderna:/job/cambridge/data-scientist_R19572',
    source: { type: 'workday', board: 'moderna', job_id: '/job/cambridge/data-scientist_R19572' },
    canonical_url: 'https://example.test/job/cambridge/data-scientist_R19572',
    company: { lists: ['data'] },
    title: 'Data Scientist',
  };
  const resolver = createPreviousJobResolver([previous]);
  const matched = resolver.match(current);
  const finalized = finalizeJob(current, filter, '2026-08-20T00:00:00Z', matched);

  assert.equal(matched, previous);
  assert.equal(finalized.first_seen_at, previous.first_seen_at);
  assert.equal(finalized.status, 'open');
  assert.equal(resolver.hasMatched(previous), true);
  assert.equal(resolver.effectivePreviousByKey.get(current.job_key), previous);
  assert.equal(resolver.migratedIdentities, 1);
  assert.deepEqual(selectNewlyRelevantJobs([finalized], resolver.effectivePreviousByKey), []);
});

test('invalid legacy identity is consumed when a valid source record owns its URL', () => {
  const canonicalUrl = 'https://visa.wd1.myworkdayjobs.com/Visa/job/Austin/Engineer_REQ-1';
  const invalid = {
    job_key: 'workday:visa-visa:',
    source: { type: 'workday', board: 'visa-Visa', job_id: '' },
    canonical_url: canonicalUrl,
    status: 'unknown',
  };
  const valid = {
    job_key: 'workday:visa-visa:/job/Austin/Engineer_REQ-1',
    source: { type: 'workday', board: 'visa-Visa', job_id: '/job/Austin/Engineer_REQ-1' },
    canonical_url: canonicalUrl,
    status: 'open',
  };
  const resolver = createPreviousJobResolver([invalid, valid]);

  assert.equal(resolver.isSuperseded(invalid), true);
  assert.equal(resolver.hasMatched(invalid), true);
  assert.equal(resolver.isSuperseded(valid), false);
  assert.equal(resolver.match(valid), valid);
  assert.equal(resolver.supersededInvalidIdentities, 1);
  assert.equal(resolver.migratedIdentities, 0);
});

test('legacy records with invalid source identity are quarantined on load', () => {
  const quarantined = quarantineInvalidJobIdentity({
    job_key: 'workday:visa-visa:',
    source: { type: 'workday', board: 'visa-Visa', job_id: '' },
    status: 'open',
  });
  assert.equal(quarantined.status, 'unknown');
  assert.deepEqual(quarantined.data_quality, {
    state: 'invalid_source_identity',
    issues: ['missing_source_job_id'],
  });
});

test('lifecycle finalization preserves first seen and rich stripping is additive', () => {
  const base = {
    job_key: 'ashby:example:1',
    title: 'AI Engineer Intern',
    canonical_url: 'https://jobs.ashbyhq.com/example/1',
    company: { lists: ['ai-ml'] },
    description_plain: 'A role',
    description_html: '<p>A role</p>',
  };
  const finalized = finalizeJob(base, filter, '2026-08-20T00:00:00Z', {
    first_seen_at: '2026-08-01T00:00:00Z',
    status: 'possibly_closed',
    possibly_closed_at: '2026-08-19T00:00:00Z',
    missing_complete_scans: 1,
  });
  assert.equal(finalized.first_seen_at, '2026-08-01T00:00:00Z');
  assert.equal(finalized.last_seen_at, '2026-08-20T00:00:00Z');
  assert.equal(finalized.source.fetched_at, '2026-08-20T00:00:00Z');
  assert.equal(finalized.status, 'open');
  assert.equal(finalized.possibly_closed_at, null);
  assert.equal(finalized.missing_complete_scans, 0);
  const stripped = stripRichDescription(finalized);
  assert.equal(stripped.description_plain, null);
  assert.equal(stripped.job_key, finalized.job_key);
});

test('identifier-only source stubs are retained as non-actionable evidence', () => {
  const finalized = finalizeJob({
    job_key: 'workday:example:REQ-1',
    title: '',
    canonical_url: null,
    company: { lists: ['software'] },
    source: { type: 'workday', board: 'example', job_id: 'REQ-1' },
  }, filter, '2026-08-20T00:00:00Z', null);

  assert.equal(finalized.status, 'unknown');
  assert.deepEqual(finalized.data_quality, {
    state: 'incomplete_source_record',
    issues: ['missing_title', 'missing_canonical_url'],
  });
});

test('omitted identifier-only stubs remain unknown source evidence', () => {
  const repaired = preserveIncompleteSourceRecord({
    job_key: 'workday:nvidia:JR1',
    status: 'possibly_closed',
    closed_at: null,
    possibly_closed_at: '2026-08-20T00:00:00.000Z',
    missing_complete_scans: 1,
    data_quality: {
      state: 'incomplete_source_record',
      issues: ['missing_title', 'missing_canonical_url'],
    },
  });
  assert.equal(repaired.status, 'unknown');
  assert.equal(repaired.possibly_closed_at, null);
  assert.equal(repaired.missing_complete_scans, 0);
  assert.equal(preserveIncompleteSourceRecord(repaired).status, 'unknown');
});

test('htmlToText handles encoded lists and line breaks', () => {
  assert.equal(htmlToText('&lt;ul&gt;&lt;li&gt;One&lt;/li&gt;&lt;li&gt;Two&lt;/li&gt;&lt;/ul&gt;'), '- One\n- Two');
});

let server;
let baseUrl;
let requestCount = 0;

before(async () => {
  server = createServer((request, response) => {
    requestCount += 1;
    if (request.url === '/retry' && requestCount === 1) {
      response.writeHead(500, { 'content-type': 'application/json' });
      response.end('{"error":"temporary"}');
      return;
    }
    response.writeHead(200, { 'content-type': 'application/json' });
    response.end('{"ok":true}');
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('fetchJson retries transient server errors', async () => {
  requestCount = 0;
  assert.deepEqual(await fetchJson(`${baseUrl}/retry`, { retries: 1, timeoutMs: 2_000 }), { ok: true });
  assert.equal(requestCount, 2);
});

test('mapLimit bounds concurrent work and preserves order', async () => {
  let active = 0;
  let maximum = 0;
  const output = await mapLimit([1, 2, 3, 4, 5], 2, async (value) => {
    active += 1;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 5));
    active -= 1;
    return value * 2;
  });
  assert.equal(maximum, 2);
  assert.deepEqual(output, [2, 4, 6, 8, 10]);
});
