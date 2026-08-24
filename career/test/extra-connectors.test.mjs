import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createSourceDescriptor,
  fetchJson,
  listConnectorTypes,
  scanCompany,
} from '../scanner/adapters.mjs';
import { inferCompanySource } from '../scanner/core.mjs';
import { parseJsonLdJobPostings } from '../scanner/connectors/jsonld.mjs';
import { parsePersonioXml } from '../scanner/connectors/personio.mjs';
import { parsePinpointPostings } from '../scanner/connectors/pinpoint.mjs';
import { parseRecruiteeXml } from '../scanner/connectors/recruitee.mjs';
import { parseTeamtailorRss } from '../scanner/connectors/teamtailor.mjs';

const roleFilter = {
  role_keywords: ['Software Engineer', 'Machine Learning'],
  positive: ['Software Engineer', 'Machine Learning'],
  require_role_match: true,
};

function jsonResponse(value, init = {}) {
  return new Response(JSON.stringify(value), {
    status: init.status ?? 200,
    headers: { 'content-type': 'application/json', ...init.headers },
  });
}

function textResponse(value, contentType = 'application/xml') {
  return new Response(value, { headers: { 'content-type': contentType } });
}

async function withFetch(handler, operation) {
  const original = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    return await operation();
  } finally {
    globalThis.fetch = original;
  }
}

test('new connector types are inferred and described without changing legacy inference', () => {
  assert.deepEqual(
    inferCompanySource({ api: 'https://acme.pinpointhq.com/postings.json' }),
    { type: 'pinpoint', slug: 'acme' },
  );
  assert.deepEqual(
    inferCompanySource({ api: 'https://acme.jobs.personio.de/xml' }),
    { type: 'personio', slug: 'acme' },
  );
  assert.equal(
    createSourceDescriptor({ name: 'Acme', careers_url: 'https://acme.jobs.personio.com/openings' }).sourceUrl,
    'https://acme.jobs.personio.com/xml?language=en',
  );
  assert.equal(
    inferCompanySource({ careers_url: 'https://www.personio.com/about-personio/careers/' }),
    null,
  );
  assert.deepEqual(
    inferCompanySource({ ats: 'recruitee-xml', ats_slug: 'acme', api: 'https://feeds.example/acme.xml' }),
    { type: 'recruitee', slug: 'acme' },
  );
  assert.deepEqual(
    inferCompanySource({ api: 'https://hacker-news.firebaseio.com/v0/jobstories.json' }),
    { type: 'hackernews', slug: 'yc-jobs' },
  );
  assert.deepEqual(
    inferCompanySource({ careers_url: 'https://acme.wd5.myworkdayjobs.com/External' }),
    { type: 'workday', slug: 'acme-External' },
  );
  assert.deepEqual(
    inferCompanySource({ careers_url: 'https://acme.wd1.myworkdayjobs.com/en-US/External' }),
    { type: 'workday', slug: 'acme-External' },
  );
  assert.equal(
    createSourceDescriptor({
      name: 'Acme', careers_url: 'https://acme.wd1.myworkdayjobs.com/en-US/External',
    }).sourceUrl,
    'https://acme.wd1.myworkdayjobs.com/wday/cxs/acme/External/jobs',
  );
  assert.deepEqual(
    inferCompanySource({ ats: 'jobposting-jsonld', careers_url: 'https://example.com/careers' }),
    { type: 'jsonld', slug: 'example.com' },
  );
  assert.equal(
    createSourceDescriptor({ name: 'Acme', ats: 'teamtailor', careers_url: 'https://career.acme.test/jobs' }).sourceUrl,
    'https://career.acme.test/jobs.rss',
  );
  assert.deepEqual(listConnectorTypes(), [
    'ashby',
    'greenhouse',
    'hackernews',
    'jsonld',
    'lever',
    'personio',
    'pinpoint',
    'recruitee',
    'smartrecruiters',
    'teamtailor',
    'workable',
    'workday',
  ]);
});

function teamtailorFixture(items) {
  return `<?xml version="1.0"?><rss version="2.0" xmlns:tt="https://teamtailor.com/locations"><channel>${items.map((item) => `
    <item>
      <title>${item.title}</title>
      <description>&lt;p&gt;${item.description}&lt;/p&gt;</description>
      <pubDate>Wed, 20 Aug 2026 10:00:00 +0000</pubDate>
      <link>https://career.acme.test/jobs/${item.id}</link>
      <remoteStatus>${item.remoteStatus}</remoteStatus>
      <guid>${item.id}</guid>
      <tt:locations><tt:location><tt:name>${item.location}</tt:name><tt:city>${item.location}</tt:city><tt:country>US</tt:country></tt:location></tt:locations>
      <tt:department>Engineering</tt:department>
      <tt:role>Software</tt:role>
    </item>`).join('')}</channel></rss>`;
}

test('Teamtailor RSS parser and offset pagination traverse the entire feed', async () => {
  const parsed = parseTeamtailorRss(teamtailorFixture([{
    id: 'one',
    title: 'Software Engineer Intern',
    description: 'Build systems.',
    remoteStatus: 'hybrid',
    location: 'New York',
  }]));
  assert.equal(parsed[0].guid, 'one');
  assert.equal(parsed[0].locations[0].city, 'New York');

  const offsets = [];
  const result = await withFetch(async (input) => {
    const url = new URL(input);
    const offset = Number(url.searchParams.get('offset'));
    offsets.push(offset);
    const items = offset === 0 ? [{
      id: 'one', title: 'Software Engineer Intern', description: 'Build systems.', remoteStatus: 'hybrid', location: 'New York',
    }] : offset === 1 ? [{
      id: 'two', title: 'Machine Learning Engineer', description: 'Train models.', remoteStatus: 'remote', location: 'Remote',
    }] : [];
    return textResponse(teamtailorFixture(items), 'application/rss+xml');
  }, () => scanCompany({
    name: 'Acme', ats: 'teamtailor', careers_url: 'https://career.acme.test/jobs', page_size: 1,
  }, { filter: roleFilter }));

  assert.deepEqual(offsets, [0, 1, 2]);
  assert.equal(result.complete, true);
  assert.equal(result.advertised_total, 2);
  assert.equal(result.jobs[0].job_key, 'teamtailor:career-acme-test:one');
  assert.equal(result.jobs[0].description_plain, 'Build systems.');
  assert.equal(result.jobs[1].workplace_type, 'remote');
});

test('Teamtailor Atom entries read standard link href attributes', () => {
  const parsed = parseTeamtailorRss(`<?xml version="1.0"?><feed>
    <entry>
      <id>atom-one</id>
      <title>Software Engineer</title>
      <link href="https://career.acme.test/jobs/atom-one" />
      <content>Build software.</content>
    </entry>
  </feed>`);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].link, 'https://career.acme.test/jobs/atom-one');
});

test('Teamtailor paginates by raw entries and marks dropped records partial', async () => {
  const firstPage = teamtailorFixture([
    { id: 'one', title: 'Software Engineer', description: 'One.', remoteStatus: 'remote', location: 'Remote' },
    { id: 'broken', title: 'Broken role', description: 'Missing ID.', remoteStatus: 'remote', location: 'Remote' },
  ]).replace('<guid>broken</guid>', '');
  const secondPage = teamtailorFixture([
    { id: 'three', title: 'Machine Learning Engineer', description: 'Three.', remoteStatus: 'hybrid', location: 'Boston' },
  ]);
  const offsets = [];
  const result = await withFetch(async (input) => {
    const offset = Number(new URL(input).searchParams.get('offset'));
    offsets.push(offset);
    return textResponse(offset === 0 ? firstPage : secondPage, 'application/rss+xml');
  }, () => scanCompany({
    name: 'Acme', ats: 'teamtailor', careers_url: 'https://career.acme.test/jobs', page_size: 2,
  }));
  assert.deepEqual(offsets, [0, 2]);
  assert.equal(result.jobs.length, 2);
  assert.equal(result.advertised_total, 3);
  assert.equal(result.complete, false);
  assert.equal(result.completeness.reason, 'invalid_feed_entries');
  assert.deepEqual(result.diagnostics, {
    raw_entries: 3,
    invalid_entries: 1,
    partial_reason: 'invalid_feed_entries',
  });
});

test('Pinpoint postings preserve rich sections, compensation, and deadlines', async () => {
  const fixture = {
    data: [{
      id: '118475',
      title: 'Software Engineer Intern',
      url: 'https://acme.pinpointhq.com/en/postings/job-one',
      description: '<p>Build the product.</p>',
      key_responsibilities: '<ul><li>Ship code.</li></ul>',
      benefits: '<p>Health insurance.</p>',
      employment_type: 'internship',
      employment_type_text: 'Internship',
      compensation: '$40–$50 per hour',
      compensation_minimum: 40,
      compensation_maximum: 50,
      compensation_currency: 'USD',
      compensation_frequency: 'hour',
      compensation_visible: true,
      deadline_at: '2026-09-01T00:00:00Z',
      department: { id: 'd1', name: 'Engineering' },
      location: { id: 'l1', name: 'Remote', city: 'New York', province: 'NY' },
    }],
  };
  assert.equal(parsePinpointPostings(fixture).length, 1);
  const result = await withFetch(async () => jsonResponse(fixture), () => scanCompany({
    name: 'Acme', ats: 'pinpoint', ats_slug: 'acme',
  }));
  assert.equal(result.complete, true);
  assert.equal(result.jobs[0].employment_type, 'intern');
  assert.equal(result.jobs[0].workplace_type, 'remote');
  assert.equal(result.jobs[0].compensation[0].min, 40);
  assert.equal(result.jobs[0].application_deadline, '2026-09-01T00:00:00Z');
  assert.match(result.jobs[0].description_plain, /Ship code/);
});

const personioFixture = `<?xml version="1.0"?><workzag-jobs>
  <position>
    <id>42</id><subcompany>Acme Labs</subcompany><office>Munich</office>
    <additionalOffices><office>Berlin</office></additionalOffices>
    <department>Product and Tech</department><recruitingCategory>Engineering</recruitingCategory>
    <name>Machine Learning Engineer</name><schedule>full-time</schedule>
    <jobDescriptions><jobDescription><name>The role</name><value><![CDATA[<p>Build useful models.</p>]]></value></jobDescription></jobDescriptions>
  </position>
</workzag-jobs>`;

test('Personio XML parser normalizes sections and multiple offices', async () => {
  assert.deepEqual(parsePersonioXml(personioFixture)[0].additionalOffices, ['Berlin']);
  const result = await withFetch(async () => textResponse(personioFixture), () => scanCompany({
    name: 'Acme', ats: 'personio', ats_slug: 'acme',
  }));
  const job = result.jobs[0];
  assert.equal(result.complete, true);
  assert.deepEqual(job.locations.map((location) => location.label), ['Munich', 'Berlin']);
  assert.equal(job.employment_type, 'full_time');
  assert.equal(job.canonical_url, 'https://acme.jobs.personio.de/job/42');
  assert.match(job.description_plain, /Build useful models/);
});

const recruiteeFixture = `<?xml version="1.0"?><jobs><job>
  <reference><![CDATA[offer-abc:123]]></reference><title><![CDATA[Software Engineer Intern]]></title>
  <description_requirements><![CDATA[<p>Build reliable software.</p>]]></description_requirements>
  <locations><location><country>US</country><state>NY</state><city>New York</city></location><location><country>US</country><state>CA</state><city>San Francisco</city></location></locations>
  <hybrid>true</hybrid><on_site>false</on_site><remote>false</remote><contract_type>internship</contract_type><category>engineering</category>
  <salary><min_salary>40</min_salary><max_salary>50</max_salary><period>hour</period><currency>USD</currency></salary>
  <url><![CDATA[https://acme.recruitee.com/o/software-engineer?source=feed]]></url>
  <apply_url><![CDATA[https://acme.recruitee.com/o/software-engineer/c/new?source=feed]]></apply_url>
  <posted>2026-08-01T00:00:00Z</posted><updated>2026-08-20T00:00:00Z</updated>
  <translations><primary_lang_code>en</primary_lang_code></translations>
</job></jobs>`;

test('Recruitee XML parser preserves stable references, locations, and salary', async () => {
  assert.equal(parseRecruiteeXml(recruiteeFixture)[0].salary.max, 50);
  const result = await withFetch(async () => textResponse(recruiteeFixture), () => scanCompany({
    name: 'Acme', ats: 'recruitee', ats_slug: 'acme', api: 'https://feeds.acme.test/jobs.xml',
  }));
  const job = result.jobs[0];
  assert.equal(job.job_key, 'recruitee:acme:offer-abc:123');
  assert.equal(job.workplace_type, 'hybrid');
  assert.equal(job.employment_type, 'intern');
  assert.equal(job.compensation[0].currency, 'USD');
  assert.deepEqual(job.locations.map((location) => location.label), ['New York, NY, US', 'San Francisco, CA, US']);
});

const recruiteeOffersFixture = `<?xml version="1.0" encoding="UTF-8"?><offers><offer>
  <id>2712700</id><slug>machine-learning-consultant</slug>
  <title><![CDATA[Machine Learning Consultant]]></title>
  <description><![CDATA[<p>Build reliable AI systems.</p>]]></description>
  <requirements><![CDATA[<p>Strong Python skills.</p>]]></requirements>
  <location>Munich, Bayern, Germany</location><country>Germany</country><city>Munich</city><state_code>BY</state_code>
  <hybrid>true</hybrid><on_site>false</on_site><remote>false</remote>
  <department>Data Frameworks</department><employment_type_code>fulltime_permanent</employment_type_code><category>consulting</category>
  <experience_code>entry_level</experience_code><education_code>bachelor_degree</education_code>
  <salary><min>50000</min><max>70000</max><period>year</period><currency>EUR</currency></salary>
  <company_name>Machine Learning Reply</company_name>
  <careers_url>https://machinelearningreply.recruitee.com/o/machine-learning-consultant</careers_url>
  <apply_url>https://machinelearningreply.recruitee.com/o/machine-learning-consultant/c/new</apply_url>
  <created_at>2026-08-17 12:22:05 UTC</created_at><updated_at>2026-08-18 12:22:05 UTC</updated_at><published_at>2026-08-17 12:22:20 UTC</published_at>
  <locations><location><country>Germany</country><state>Bayern</state><city>Munich</city></location><location><country>Germany</country><state>Berlin</state><city>Berlin</city></location></locations>
</offer></offers>`;

test('Recruitee offers feed maps current unauthenticated export fields without weakening evidence', async () => {
  const parsed = parseRecruiteeXml(recruiteeOffersFixture);
  assert.equal(parsed.length, 1);
  assert.equal(parsed[0].reference, '2712700');
  assert.equal(parsed[0].salary.max, 70000);

  const result = await withFetch(
    async () => textResponse(recruiteeOffersFixture),
    () => scanCompany({
      name: 'Machine Learning Reply',
      ats: 'recruitee',
      ats_slug: 'machinelearningreply',
      api: 'https://machinelearningreply.recruitee.com/api/feeds/offers.xml',
    }),
  );
  const job = result.jobs[0];
  assert.equal(result.complete, true);
  assert.equal(result.advertised_total, 1);
  assert.equal(result.source.sourceUrl, 'https://machinelearningreply.recruitee.com/api/feeds/offers.xml');
  assert.equal(job.job_key, 'recruitee:machinelearningreply:2712700');
  assert.equal(job.employment_type, 'full_time');
  assert.equal(job.workplace_type, 'hybrid');
  assert.deepEqual(job.departments, ['Data Frameworks', 'consulting']);
  assert.deepEqual(job.locations.map((location) => location.label), ['Munich, Bayern, Germany', 'Berlin, Germany']);
  assert.match(job.description_plain, /Build reliable AI systems/);
  assert.match(job.description_plain, /Strong Python skills/);
  assert.equal(job.compensation[0].currency, 'EUR');
  assert.equal(job.custom_fields.source_slug, 'machine-learning-consultant');
});

test('Recruitee offers feed remains partial when a live-schema entry lacks canonical evidence', async () => {
  const xml = recruiteeOffersFixture.replace(
    '</offers>',
    '<offer><id>broken</id><title>Missing careers URL</title></offer></offers>',
  );
  const result = await withFetch(
    async () => textResponse(xml),
    () => scanCompany({
      name: 'Acme',
      ats: 'recruitee',
      ats_slug: 'acme',
      api: 'https://acme.recruitee.com/api/feeds/offers.xml',
    }),
  );
  assert.equal(result.jobs.length, 1);
  assert.equal(result.complete, false);
  assert.equal(result.advertised_total, 2);
  assert.equal(result.completeness.reason, 'invalid_feed_entries');
  assert.equal(result.diagnostics.invalid_entries, 1);
});

test('structured feeds keep valid records but become partial when entries are dropped', async () => {
  const pinpoint = await withFetch(async () => jsonResponse({
    data: [
      { id: 'valid', title: 'Software Engineer', url: 'https://acme.pinpointhq.com/postings/valid' },
      { id: 'broken', title: 'Missing URL' },
    ],
  }), () => scanCompany({ name: 'Acme', ats: 'pinpoint', ats_slug: 'acme' }));
  assert.equal(pinpoint.jobs.length, 1);
  assert.equal(pinpoint.complete, false);
  assert.equal(pinpoint.advertised_total, 2);

  const personioXml = personioFixture.replace(
    '</workzag-jobs>',
    '<position><id>broken</id></position></workzag-jobs>',
  );
  const personio = await withFetch(
    async () => textResponse(personioXml),
    () => scanCompany({ name: 'Acme', ats: 'personio', ats_slug: 'acme' }),
  );
  assert.equal(personio.jobs.length, 1);
  assert.equal(personio.complete, false);
  assert.equal(personio.advertised_total, 2);

  const recruiteeXml = recruiteeFixture.replace(
    '</jobs>',
    '<job><reference>broken</reference><title>Missing URL</title></job></jobs>',
  );
  const recruitee = await withFetch(
    async () => textResponse(recruiteeXml),
    () => scanCompany({ name: 'Acme', ats: 'recruitee', ats_slug: 'acme', api: 'https://feeds.acme.test/jobs.xml' }),
  );
  assert.equal(recruitee.jobs.length, 1);
  assert.equal(recruitee.complete, false);
  assert.equal(recruitee.advertised_total, 2);

  for (const result of [pinpoint, personio, recruitee]) {
    assert.equal(result.completeness.reason, 'invalid_feed_entries');
    assert.equal(result.diagnostics.invalid_entries, 1);
  }
});

test('SmartRecruiters paginates absent totals to a short page and rejects impossible totals', async () => {
  const offsets = [];
  const complete = await withFetch(async (input) => {
    const offset = Number(new URL(input).searchParams.get('offset'));
    offsets.push(offset);
    return jsonResponse({
      content: offset === 0
        ? [{ id: 'one', name: 'Role one' }, { id: 'two', name: 'Role two' }]
        : [{ id: 'three', name: 'Role three' }],
    });
  }, () => scanCompany({
    name: 'Acme', ats: 'smartrecruiters', ats_slug: 'Acme', page_size: 2,
  }));
  assert.deepEqual(offsets, [0, 2]);
  assert.equal(complete.jobs.length, 3);
  assert.equal(complete.complete, true);
  assert.equal(complete.advertised_total, 3);

  await assert.rejects(
    () => withFetch(
      async () => jsonResponse({
        totalFound: 1,
        content: [{ id: 'one', name: 'Role one' }, { id: 'two', name: 'Role two' }],
      }),
      () => scanCompany({ name: 'Acme', ats: 'smartrecruiters', ats_slug: 'Acme', page_size: 2 }),
    ),
    /totalFound 1 is smaller than 2 observed jobs/,
  );
});

function jsonLdPage(job) {
  return `<html><head><script type="application/ld+json">${JSON.stringify(job)}</script></head></html>`;
}

test('JobPosting JSON-LD handles graphs, relative URLs, remote work, and malformed scripts', async () => {
  const fixture = jsonLdPage({
    '@context': 'https://schema.org',
    '@graph': [{
      '@type': 'JobPosting',
      identifier: { '@type': 'PropertyValue', value: 'REQ-7' },
      title: 'Software Engineer Intern',
      description: '<p>Build APIs.</p>',
      url: '/jobs/req-7',
      datePosted: '2026-08-20',
      employmentType: 'INTERN',
      jobLocationType: 'TELECOMMUTE',
      baseSalary: { '@type': 'MonetaryAmount', currency: 'USD', value: { minValue: 40, maxValue: 55, unitText: 'HOUR' } },
    }],
  });
  assert.equal(parseJsonLdJobPostings(fixture, 'https://careers.acme.test/jobs/req-7').length, 1);
  assert.throws(
    () => parseJsonLdJobPostings('<script type="application/ld+json">{oops}</script>'),
    /Malformed JobPosting JSON-LD/,
  );
  const result = await withFetch(async () => textResponse(fixture, 'text/html'), () => scanCompany({
    name: 'Acme', ats: 'jsonld', careers_url: 'https://careers.acme.test/jobs/req-7',
  }));
  const job = result.jobs[0];
  assert.equal(result.complete, false);
  assert.equal(job.job_key, 'jsonld:careers-acme-test:REQ-7');
  assert.equal(job.canonical_url, 'https://careers.acme.test/jobs/req-7');
  assert.equal(job.workplace_type, 'remote');
  assert.equal(job.compensation[0].max, 55);
});

test('mixed valid and malformed JSON-LD remains additive but non-authoritative', async () => {
  const mixed = `${jsonLdPage({
    '@type': 'JobPosting',
    identifier: 'valid',
    title: 'Software Engineer',
    description: 'Build systems.',
    url: 'https://careers.acme.test/jobs/valid',
  })}<script type="application/ld+json">{malformed}</script>`;
  const result = await withFetch(
    async () => textResponse(mixed, 'text/html'),
    () => scanCompany({
      name: 'Acme',
      ats: 'jsonld',
      careers_url: 'https://careers.acme.test/jobs/valid',
      authoritative: true,
    }),
  );
  assert.equal(result.jobs.length, 1);
  assert.equal(result.complete, false);
  assert.equal(result.completeness.reason, 'malformed_jsonld');
  assert.equal(result.diagnostics.malformed_scripts, 1);
  assert.equal(result.diagnostics.evidence_loss_pages, 1);
});

test('JSON-LD sitemap traversal only reports complete after every page succeeds', async () => {
  const responses = new Map([
    ['https://careers.acme.test/sitemap.xml', textResponse('<?xml version="1.0"?><sitemapindex><sitemap><loc>https://careers.acme.test/jobs.xml</loc></sitemap></sitemapindex>')],
    ['https://careers.acme.test/jobs.xml', textResponse('<?xml version="1.0"?><urlset><url><loc>https://careers.acme.test/jobs/open</loc></url><url><loc>https://careers.acme.test/jobs/expired</loc></url></urlset>')],
    ['https://careers.acme.test/jobs/open', textResponse(jsonLdPage({ '@type': 'JobPosting', identifier: 'open', title: 'Software Engineer', description: 'Open role', url: 'https://careers.acme.test/jobs/open' }), 'text/html')],
    ['https://careers.acme.test/jobs/expired', textResponse(jsonLdPage({ '@type': 'JobPosting', identifier: 'old', title: 'Software Engineer', description: 'Old role', validThrough: '2020-01-01', url: 'https://careers.acme.test/jobs/expired' }), 'text/html')],
  ]);
  const result = await withFetch(async (input) => responses.get(String(input)), () => scanCompany({
    name: 'Acme',
    ats: 'jsonld',
    sitemap_url: 'https://careers.acme.test/sitemap.xml',
    job_url_pattern: '/jobs/',
  }));
  assert.equal(result.complete, true);
  assert.equal(result.jobs.length, 1);
  assert.equal(result.jobs[0].source.job_id, 'open');
  assert.deepEqual(result.diagnostics, {
    sitemap_urls: 2,
    candidate_urls: 2,
    page_errors: 0,
    structured_data_scripts: 2,
    malformed_scripts: 0,
    zero_jobposting_pages: 0,
    tombstone_pages: 0,
    evidence_loss_pages: 0,
    partial_reason: null,
  });
});

test('zero-JobPosting candidate pages require a matching tombstone rule', async () => {
  const bodies = new Map([
    ['https://careers.acme.test/sitemap.xml', '<?xml version="1.0"?><urlset><url><loc>https://careers.acme.test/jobs/gone</loc></url></urlset>'],
    ['https://careers.acme.test/jobs/gone', '<html><script type="application/ld+json">{"@type":"Organization","name":"Acme"}</script><p>This position has been filled.</p></html>'],
  ]);
  const fetchFixture = async (input) => textResponse(
    bodies.get(String(input)),
    String(input).endsWith('.xml') ? 'application/xml' : 'text/html',
  );
  const company = {
    name: 'Acme',
    ats: 'jsonld',
    sitemap_url: 'https://careers.acme.test/sitemap.xml',
    job_url_pattern: '/jobs/',
  };
  const missingEvidence = await withFetch(fetchFixture, () => scanCompany(company));
  assert.equal(missingEvidence.jobs.length, 0);
  assert.equal(missingEvidence.complete, false);
  assert.equal(missingEvidence.completeness.reason, 'missing_jobposting_evidence');
  assert.equal(missingEvidence.diagnostics.zero_jobposting_pages, 1);

  const tombstone = await withFetch(fetchFixture, () => scanCompany({
    ...company,
    tombstone_rule: { pattern: 'position has been filled', flags: 'i' },
  }));
  assert.equal(tombstone.jobs.length, 0);
  assert.equal(tombstone.complete, true);
  assert.equal(tombstone.diagnostics.tombstone_pages, 1);
  assert.equal(tombstone.diagnostics.evidence_loss_pages, 0);
});

test('Workday CXS paginates summaries and enriches only matching roles', async () => {
  const offsets = [];
  const details = [];
  const result = await withFetch(async (input, init) => {
    const url = String(input);
    if (url.endsWith('/jobs')) {
      const request = JSON.parse(init.body);
      offsets.push(request.offset);
      return jsonResponse({
        total: request.offset === 0 ? 2 : 0,
        jobPostings: request.offset === 0 ? [{
          title: 'Software Engineer Intern',
          externalPath: '/job/New-York/Software-Engineer_REQ-1',
          locationsText: 'New York, NY',
          bulletFields: ['REQ-1'],
        }] : [{
          title: 'Accountant',
          externalPath: '/job/New-York/Accountant_REQ-2',
          locationsText: 'New York, NY',
          bulletFields: ['REQ-2'],
        }],
      });
    }
    details.push(url);
    return jsonResponse({
      jobPostingInfo: {
        id: 'internal-guid',
        jobReqId: 'REQ-1',
        title: 'Software Engineer Intern',
        jobDescription: '<p>Build GPU software.</p>',
        location: 'New York, NY',
        timeType: 'Full time',
        startDate: '2026-08-20',
        externalUrl: 'https://acme.wd5.myworkdayjobs.com/External/job/New-York/Software-Engineer_REQ-1',
      },
    });
  }, () => scanCompany({
    name: 'Acme',
    ats: 'workday',
    careers_url: 'https://acme.wd5.myworkdayjobs.com/External',
    page_size: 1,
  }, { filter: roleFilter }));

  assert.deepEqual(offsets, [0, 1]);
  assert.equal(details.length, 1);
  assert.equal(result.complete, true);
  assert.equal(result.advertised_total, 2);
  assert.equal(result.jobs[0].job_key, 'workday:acme-external:/job/New-York/Software-Engineer_REQ-1');
  assert.equal(result.jobs[1].job_key, 'workday:acme-external:/job/New-York/Accountant_REQ-2');
  assert.equal(result.jobs[0].description_plain, 'Build GPU software.');
  assert.equal(result.jobs[1].description_plain, '');
});

test('Workday summary identities stay unique when tenant bullets begin with location', async () => {
  const result = await withFetch(async () => jsonResponse({
    total: 3,
    jobPostings: [
      {
        title: 'Accountant',
        externalPath: '/job/Cambridge/Accountant_R100',
        bulletFields: ['Cambridge, Massachusetts', 'Finance', 'R100'],
      },
      {
        title: 'Designer',
        externalPath: '/job/Cambridge/Designer_R101',
        bulletFields: ['Cambridge, Massachusetts', 'Design', 'R101'],
      },
      {
        title: 'Scientist',
        externalPath: '/job/Cambridge/Scientist_R102',
        bulletFields: ['Cambridge, Massachusetts', 'Research', 'R102'],
      },
    ],
  }), () => scanCompany({
    name: 'Acme',
    ats: 'workday',
    careers_url: 'https://acme.wd5.myworkdayjobs.com/External',
  }, { filter: roleFilter }));

  assert.equal(result.complete, true);
  assert.equal(result.advertised_total, 3);
  assert.equal(result.jobs.length, 3);
  assert.equal(new Set(result.jobs.map((job) => job.job_key)).size, 3);
  assert.deepEqual(result.jobs.map((job) => job.requisition_id), ['R100', 'R101', 'R102']);
});

test('Workday partitions a capped result set before declaring it complete', async () => {
  const requests = [];
  const result = await withFetch(async (input, init) => {
    const request = JSON.parse(init.body);
    requests.push(request.appliedFacets);
    const partition = request.appliedFacets.jobFamilyGroup?.[0];
    if (!partition) {
      return jsonResponse({
        total: 2,
        jobPostings: [{ title: 'Root result', externalPath: '/job/root', bulletFields: ['ROOT'] }],
        facets: [{
          facetParameter: 'jobFamilyGroup',
          values: [{ id: 'engineering', count: 1 }, { id: 'research', count: 1 }],
        }],
      });
    }
    return jsonResponse({
      total: 1,
      jobPostings: [{
        title: `${partition} role`,
        externalPath: `/job/${partition}`,
        bulletFields: [partition.toUpperCase()],
      }],
    });
  }, () => scanCompany({
    name: 'Acme',
    ats: 'workday',
    careers_url: 'https://acme.wd5.myworkdayjobs.com/External',
    page_size: 1,
    workday_result_cap: 2,
  }));
  assert.equal(result.complete, true);
  assert.equal(result.advertised_total, 2);
  assert.equal(result.jobs.length, 2);
  assert.deepEqual(requests, [{}, { jobFamilyGroup: ['engineering'] }, { jobFamilyGroup: ['research'] }]);
  assert.deepEqual(result.diagnostics, {
    partition_facet: 'jobFamilyGroup',
    partitions: 2,
    root_advertised_total: 2,
    observed_total: 2,
    partial_reason: null,
  });
});

test('Workday treats the 2,000-result server cap as non-authoritative by default', async () => {
  const jobs = Array.from({ length: 2_000 }, (_, index) => ({
    title: `Role ${index}`,
    externalPath: `/job/role-${index}`,
    bulletFields: [`REQ-${index}`],
  }));
  const result = await withFetch(async () => jsonResponse({ total: 2_000, jobPostings: jobs }), () => scanCompany({
    name: 'Acme',
    ats: 'workday',
    careers_url: 'https://acme.wd5.myworkdayjobs.com/External',
    page_size: 2_000,
  }));
  assert.equal(result.jobs.length, 2_000);
  assert.equal(result.complete, false);
  assert.equal(result.completeness.reason, 'server_cap_2000');
  assert.equal(result.diagnostics.partial_reason, 'server_cap_2000');
  assert.equal(result.diagnostics.observed_total, 2_000);
});

test('Workday request gate bounds cross-tenant concurrency', async () => {
  let active = 0;
  let maximum = 0;
  await withFetch(async () => {
    active += 1;
    maximum = Math.max(maximum, active);
    await new Promise((resolve) => setTimeout(resolve, 10));
    active -= 1;
    return jsonResponse({ ok: true });
  }, () => Promise.all(Array.from({ length: 8 }, (_, index) => fetchJson(
    `https://tenant-${index}.wd5.myworkdayjobs.com/wday/cxs/acme/site/jobs`,
    { retries: 0, workdayRequestSpacingMs: 0 },
  ))));
  assert.equal(maximum, 2);
});

test('malformed feed shapes fail closed and successful responses emit snapshot callbacks', async () => {
  assert.throws(() => parsePersonioXml('<workzag-jobs><position>'), /Malformed XML response/);
  assert.throws(() => parseRecruiteeXml('<not-jobs></not-jobs>'), /Malformed XML response/);
  assert.throws(() => parsePinpointPostings({ data: {} }), /no data array/);

  const captured = [];
  await withFetch(async () => jsonResponse({ ok: true }, { headers: { etag: 'abc' } }), async () => {
    assert.deepEqual(await fetchJson('https://api.acme.test/jobs', {
      onResponse: async (response) => captured.push(response),
    }), { ok: true });
  });
  assert.equal(captured.length, 1);
  assert.equal(captured[0].status, 200);
  assert.equal(captured[0].headers.etag, 'abc');
  assert.equal(captured[0].body, '{"ok":true}');
  assert.equal(captured[0].contentType, 'application/json');
});

test('fetchJson retries a successful HTML interstitial before parsing JSON', async () => {
  let attempts = 0;
  const result = await withFetch(async () => {
    attempts += 1;
    return attempts === 1
      ? textResponse('<!doctype html><title>temporary interstitial</title>', 'text/html')
      : jsonResponse({ jobs: [] });
  }, () => fetchJson('https://api.acme.test/jobs', { retries: 1, jsonRetryDelayMs: 0 }));
  assert.deepEqual(result, { jobs: [] });
  assert.equal(attempts, 2);
});

test('descriptor failures are isolated as unsupported source evidence', async () => {
  const result = await scanCompany({ name: 'Broken Teamtailor', ats: 'teamtailor' });
  assert.equal(result.status, 'unsupported');
  assert.equal(result.source, null);
  assert.match(result.error, /Source descriptor failed/);
});

test('missing and duplicate normalized ATS identities make a result partial', async () => {
  const result = await withFetch(async () => jsonResponse({
    jobs: [
      { id: null, title: 'Missing ID', absolute_url: 'https://boards.example/jobs/missing' },
      { id: 7, title: 'First copy', absolute_url: 'https://boards.example/jobs/7' },
      { id: 7, title: 'Second copy', absolute_url: 'https://boards.example/jobs/7-copy' },
    ],
  }), () => scanCompany({ name: 'Acme', ats: 'greenhouse', ats_slug: 'acme' }));

  assert.equal(result.status, 'ok');
  assert.equal(result.complete, false);
  assert.equal(result.completeness.reason, 'invalid_normalized_identity');
  assert.equal(result.jobs.length, 1);
  assert.equal(result.advertised_total, 3);
  assert.equal(result.diagnostics.invalid_identities, 1);
  assert.equal(result.diagnostics.duplicate_identities, 1);
});
