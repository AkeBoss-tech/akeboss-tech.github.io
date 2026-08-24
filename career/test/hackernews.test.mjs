import assert from 'node:assert/strict';
import { test } from 'node:test';
import { scanCompany } from '../scanner/adapters.mjs';
import {
  parseHackerNewsJobIds,
  parseHackerNewsJobTitle,
} from '../scanner/connectors/hackernews.mjs';
import {
  applyWindowedOmission,
  assessSourceResult,
  countOpenJobsBySource,
} from '../scanner/lifecycle.mjs';
import { MonitorState } from '../scanner/state.mjs';

function jsonResponse(value) {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
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

test('Hacker News title parsing projects the actual employer, role, and YC batch', () => {
  assert.deepEqual(
    parseHackerNewsJobTitle(
      'Tasklet (YC P26) Is Hiring a Head of Design Engineering',
      'https://tasklet.ai/careers/head-of-design-engineering',
    ),
    {
      companyName: 'Tasklet',
      roleTitle: 'Head of Design Engineering',
      ycBatch: 'P26',
      parsed: true,
      sourceTitle: 'Tasklet (YC P26) Is Hiring a Head of Design Engineering',
    },
  );
  assert.equal(
    parseHackerNewsJobTitle(
      'CollectWise (YC F24) Is Hiring',
      'https://www.ycombinator.com/companies/collectwise/jobs/oEAfzBS-ai-agent-engineer',
    ).roleTitle,
    'AI Agent Engineer',
  );
  assert.equal(
    parseHackerNewsJobTitle('Truemetrics (YC S23) Is Hiring in Berlin – GTM Lead').roleTitle,
    'GTM Lead',
  );
});

test('Hacker News jobstory IDs are exact, unique positive integers within the official window', () => {
  assert.deepEqual(parseHackerNewsJobIds([3, 2, 1]), [3, 2, 1]);
  assert.throws(() => parseHackerNewsJobIds([1, 1]), /duplicate item IDs/);
  assert.throws(() => parseHackerNewsJobIds([1, 'bad']), /invalid item ID/);
  assert.throws(() => parseHackerNewsJobIds(Array.from({ length: 201 }, (_, index) => index + 1)), /maximum is 200/);
});

test('official HN API connector filters invalid items, deduplicates target URLs, and falls back to item URLs', async () => {
  const items = new Map([
    [101, {
      id: 101,
      type: 'job',
      by: 'tasklet-founder',
      time: 1_786_887_027,
      title: 'Tasklet (YC P26) Is Hiring a Head of Design Engineering',
      text: '<p>Build the product.</p>',
      url: 'https://tasklet.ai/careers/head-of-design-engineering?utm_source=hn',
    }],
    [102, {
      id: 102,
      type: 'job',
      by: 'bloomy-founder',
      time: 1_784_653_220,
      title: 'Bloomy (YC S26) is hiring a founding engineer',
      text: '<p>Build an AI tutor.</p>',
    }],
    [103, {
      id: 103,
      type: 'job',
      by: 'old-tasklet-post',
      time: 1_700_000_000,
      title: 'Tasklet (YC P26) Is Hiring a Head of Design Engineering',
      url: 'https://tasklet.ai/careers/head-of-design-engineering',
    }],
    [104, { id: 104, type: 'job', deleted: true, title: 'Deleted role' }],
    [105, { id: 105, type: 'story', title: 'Not a job' }],
    [106, { id: 106, type: 'job', dead: true, title: 'Dead role' }],
  ]);

  const result = await withFetch(async (input) => {
    const url = new URL(input);
    if (url.pathname.endsWith('/jobstories.json')) return jsonResponse([...items.keys()]);
    const id = Number(url.pathname.match(/\/(\d+)\.json$/)?.[1]);
    return jsonResponse(items.get(id));
  }, () => scanCompany({
    name: 'YC / Hacker News Jobs',
    ats: 'hackernews',
    ats_slug: 'yc-jobs',
    list: ['yc', 'startups'],
  }, { detailConcurrency: 3 }));

  assert.equal(result.status, 'ok');
  assert.equal(result.complete, true);
  assert.equal(result.lifecycle_mode, 'windowed');
  assert.equal(result.advertised_total, 2);
  assert.equal(result.jobs.length, 2);
  assert.deepEqual(result.jobs.map((job) => job.source.job_id), ['101', '102']);
  assert.deepEqual(result.diagnostics, {
    window_ids: 6,
    fetched_items: 6,
    eligible_job_items: 3,
    unique_postings: 2,
    duplicate_target_items: 1,
    filtered_deleted: 1,
    filtered_dead: 1,
    filtered_non_job: 1,
    filtered_missing_title: 0,
  });

  const tasklet = result.jobs[0];
  assert.equal(tasklet.job_key, 'hackernews:yc-jobs:101');
  assert.equal(tasklet.source.board, 'yc-jobs');
  assert.equal(tasklet.source.lifecycle_mode, 'windowed');
  assert.equal(tasklet.company.name, 'Tasklet');
  assert.equal(tasklet.company.slug, 'tasklet');
  assert.equal(tasklet.company.yc_batch, 'P26');
  assert.equal(tasklet.title, 'Head of Design Engineering');
  assert.equal(tasklet.canonical_url, 'https://tasklet.ai/careers/head-of-design-engineering');
  assert.equal(tasklet.custom_fields.hn_author, 'tasklet-founder');
  assert.equal(tasklet.first_published_at, '2026-08-16T13:30:27.000Z');
  assert.match(tasklet.description_plain, /Build the product/);

  const bloomy = result.jobs[1];
  assert.equal(bloomy.company.name, 'Bloomy');
  assert.equal(bloomy.title, 'founding engineer');
  assert.equal(bloomy.canonical_url, 'https://news.ycombinator.com/item?id=102');
  assert.equal(bloomy.apply_url, 'https://news.ycombinator.com/item?id=102');
});

test('healthy rolling windows become unknown on omission without making a closure claim', () => {
  const assessed = assessSourceResult({
    status: 'ok',
    jobs: Array.from({ length: 60 }),
    complete: true,
    advertised_total: 60,
    lifecycle_mode: 'windowed',
  }, 100);
  assert.deepEqual(assessed, {
    state: 'ok',
    authoritative: true,
    previous_open_jobs: 100,
    current_open_jobs: 60,
    advertised_total: 60,
    drop_ratio: 0.4,
    reason: null,
    lifecycle_mode: 'windowed',
    omissions_authoritative: false,
  });

  const omitted = applyWindowedOmission({
    job_key: 'hackernews:yc-jobs:1',
    status: 'open',
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
  }, '2026-08-20T00:00:00Z');
  assert.equal(omitted.status, 'unknown');
  assert.equal(omitted.closed_at, null);
  assert.equal(omitted.possibly_closed_at, null);
  assert.equal(omitted.data_quality.state, 'outside_source_window');

  const truncated = assessSourceResult({
    status: 'ok',
    jobs: [],
    complete: true,
    advertised_total: 0,
    lifecycle_mode: 'windowed',
  }, 31);
  assert.equal(truncated.state, 'suspicious');
  assert.equal(truncated.authoritative, false);
  assert.match(truncated.reason, /31 to 0/);
});

test('windowed history never inflates the next source drop baseline', () => {
  const source = { type: 'hackernews', board: 'yc-jobs' };
  const jobs = [
    ...Array.from({ length: 30 }, (_, index) => ({
      job_key: `hackernews:yc-jobs:open-${index}`,
      source,
      status: 'open',
    })),
    ...Array.from({ length: 31 }, (_, index) => ({
      job_key: `hackernews:yc-jobs:history-${index}`,
      source,
      status: 'unknown',
      data_quality: { state: 'outside_source_window' },
    })),
  ];
  const baseline = countOpenJobsBySource(jobs).get('hackernews:yc-jobs');
  assert.equal(baseline, 30);
  const nextWindow = assessSourceResult({
    status: 'ok',
    jobs: Array.from({ length: 30 }),
    complete: true,
    advertised_total: 30,
    lifecycle_mode: 'windowed',
  }, baseline);
  assert.equal(nextWindow.state, 'ok');
  assert.equal(nextWindow.authoritative, true);
});

test('windowed monitor sources still quarantine implausible count drops', () => {
  const state = new MonitorState(':memory:');
  try {
    state.syncSources([{
      company: 'YC / Hacker News Jobs',
      ats: 'hackernews',
      board: 'yc-jobs',
      metadata: { lifecycle_mode: 'windowed' },
    }], '2026-08-20T00:00:00Z');
    state.recordResult('hackernews:yc-jobs', {
      status: 'ok', jobs: 100, relevant: 10, lifecycle_mode: 'windowed', authoritative: true,
    }, {
      runId: 'baseline',
      startedAt: '2026-08-20T00:00:00Z',
      completedAt: '2026-08-20T00:01:00Z',
    });
    const drop = state.recordResult('hackernews:yc-jobs', {
      status: 'ok', jobs: 60, relevant: 6, lifecycle_mode: 'windowed', authoritative: true,
    }, {
      runId: 'window-shift',
      startedAt: '2026-08-20T01:00:00Z',
      completedAt: '2026-08-20T01:01:00Z',
    });
    assert.equal(drop.run.outcome, 'healthy');
    assert.equal(drop.run.anomaly_type, null);
    assert.equal(drop.source.health_state, 'healthy');
    assert.equal(drop.source.last_job_count, 60);
    assert.equal(state.listEscalations().length, 0);

    const truncated = state.recordResult('hackernews:yc-jobs', {
      status: 'suspicious', jobs: 0, relevant: 0, lifecycle_mode: 'windowed', authoritative: false,
    }, {
      runId: 'truncated-window',
      startedAt: '2026-08-20T02:00:00Z',
      completedAt: '2026-08-20T02:01:00Z',
    });
    assert.equal(truncated.run.outcome, 'suspicious');
    assert.equal(truncated.source.health_state, 'suspicious');
    assert.equal(truncated.source.last_job_count, 60);
  } finally {
    state.close();
  }
});
