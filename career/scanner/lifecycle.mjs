function finiteNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export const DEFAULT_SUSPICIOUS_DROP_RATIO = 0.5;

export const SOURCE_LIFECYCLE_MODES = Object.freeze([
  'authoritative',
  'additive',
  'windowed',
]);

export function sourceLifecycleMode(value) {
  const normalized = String(value ?? 'authoritative').trim().toLowerCase();
  if (!SOURCE_LIFECYCLE_MODES.includes(normalized)) {
    throw new Error(
      `lifecycle_mode must be one of: ${SOURCE_LIFECYCLE_MODES.join(', ')}`,
    );
  }
  return normalized;
}

function optionNumber(options, snakeCase, camelCase, fallback) {
  const configured = options?.[snakeCase] ?? options?.[camelCase];
  if (configured == null) return fallback;
  const number = finiteNumber(configured);
  if (number === null) throw new Error(`${snakeCase} must be a finite number`);
  return number;
}

export function validateLifecycleOptions(options = {}) {
  const suspiciousDropRatio = optionNumber(
    options,
    'suspicious_drop_ratio',
    'suspiciousDropRatio',
    DEFAULT_SUSPICIOUS_DROP_RATIO,
  );
  const minimumPrevious = optionNumber(
    options,
    'minimum_previous_jobs_for_drop_guard',
    'minimumPreviousJobsForDropGuard',
    10,
  );
  const confirmationHours = optionNumber(
    options,
    'close_confirmation_hours',
    'closeConfirmationHours',
    6,
  );
  if (suspiciousDropRatio <= 0 || suspiciousDropRatio > DEFAULT_SUSPICIOUS_DROP_RATIO) {
    throw new Error(
      `suspicious_drop_ratio must be greater than 0 and at most ${DEFAULT_SUSPICIOUS_DROP_RATIO}`,
    );
  }
  if (!Number.isInteger(minimumPrevious) || minimumPrevious < 1) {
    throw new Error('minimum_previous_jobs_for_drop_guard must be a positive integer');
  }
  if (confirmationHours < 0) {
    throw new Error('close_confirmation_hours must be a nonnegative number');
  }
  return { suspiciousDropRatio, minimumPrevious, confirmationHours };
}

export function sourceIdentity(source) {
  if (!source?.type) return null;
  const board = source.slug ?? source.board;
  return board ? `${String(source.type).toLowerCase()}:${String(board).toLowerCase()}` : null;
}

/** Build count-drop baselines from actionable jobs, never retained history. */
export function countOpenJobsBySource(jobs, isSuperseded = () => false) {
  const counts = new Map();
  for (const job of jobs ?? []) {
    if (job?.status !== 'open' || isSuperseded(job)) continue;
    const identity = sourceIdentity(job.source);
    if (identity) counts.set(identity, (counts.get(identity) ?? 0) + 1);
  }
  return counts;
}

/**
 * Decide whether a source result is safe to use for lifecycle transitions.
 * A successful HTTP response is not automatically authoritative: incomplete
 * pagination and implausibly large count drops are quarantined.
 */
export function assessSourceResult(result, previousOpenCount = 0, options = {}) {
  const currentOpenCount = Array.isArray(result?.jobs) ? result.jobs.length : 0;
  const previous = Math.max(0, finiteNumber(previousOpenCount) ?? 0);
  const advertisedTotal = finiteNumber(
    result?.advertised_total ?? result?.advertisedTotal ?? result?.completeness?.advertised_total,
  );
  const dropRatio = previous > 0 ? Math.max(0, (previous - currentOpenCount) / previous) : 0;
  const { suspiciousDropRatio, minimumPrevious } = validateLifecycleOptions(options);
  const allowLargeDrop = options.allow_large_drop === true || options.allowLargeDrop === true;
  const lifecycleMode = sourceLifecycleMode(
    result?.lifecycle_mode
      ?? result?.lifecycleMode
      ?? options.lifecycle_mode
      ?? options.lifecycleMode,
  );

  const outcome = {
    state: result?.status ?? 'error',
    authoritative: false,
    previous_open_jobs: previous,
    current_open_jobs: currentOpenCount,
    advertised_total: advertisedTotal,
    drop_ratio: dropRatio,
    reason: result?.error ?? null,
  };

  if (result?.status !== 'ok') return outcome;

  const explicitlyIncomplete = result.complete === false
    || result.completeness?.complete === false
    || result.completeness?.pagination_complete === false;
  if (explicitlyIncomplete) {
    return {
      ...outcome,
      state: 'partial',
      reason: result.completeness?.reason ?? 'Connector did not complete an authoritative traversal',
    };
  }

  if (advertisedTotal !== null && currentOpenCount < advertisedTotal) {
    return {
      ...outcome,
      state: 'partial',
      reason: `Fetched ${currentOpenCount} of ${advertisedTotal} advertised jobs`,
    };
  }

  if (!allowLargeDrop && previous >= minimumPrevious && dropRatio >= suspiciousDropRatio) {
    return {
      ...outcome,
      state: 'suspicious',
      reason: `Open-job count fell ${(dropRatio * 100).toFixed(1)}% (${previous} to ${currentOpenCount})`,
    };
  }

  // A complete, plausible rolling window is healthy source evidence, but its
  // boundary is not an assertion that older items closed. Count-integrity
  // guards still run above so an empty or implausibly truncated response is
  // quarantined before the caller applies this omission policy.
  if (lifecycleMode !== 'authoritative') {
    return {
      ...outcome,
      state: 'ok',
      authoritative: true,
      lifecycle_mode: lifecycleMode,
      omissions_authoritative: false,
      reason: null,
    };
  }

  return {
    ...outcome,
    state: 'ok',
    authoritative: true,
    reason: null,
  };
}

/** Apply one authoritative omission without guessing from failed or partial scans. */
export function applyAuthoritativeOmission(previous, now, options = {}) {
  if (!previous || !now) throw new Error('A previous job and timestamp are required');
  if (previous.status === 'closed') return previous;

  const { confirmationHours } = validateLifecycleOptions(options);
  const currentTime = Date.parse(now);
  if (!Number.isFinite(currentTime)) throw new Error(`Invalid lifecycle timestamp: ${now}`);

  const firstMissingAt = previous.possibly_closed_at ?? null;
  const firstMissingTime = Date.parse(firstMissingAt ?? '');
  const elapsedHours = Number.isFinite(firstMissingTime)
    ? (currentTime - firstMissingTime) / 3_600_000
    : 0;

  if (previous.status === 'possibly_closed'
    && Number(previous.missing_complete_scans ?? 1) >= 1
    && elapsedHours >= confirmationHours) {
    return {
      ...previous,
      status: 'closed',
      closed_at: previous.closed_at ?? now,
      possibly_closed_at: firstMissingAt ?? now,
      missing_complete_scans: Number(previous.missing_complete_scans ?? 1) + 1,
    };
  }

  return {
    ...previous,
    status: 'possibly_closed',
    closed_at: null,
    possibly_closed_at: firstMissingAt ?? now,
    missing_complete_scans: firstMissingAt
      ? Number(previous.missing_complete_scans ?? 1)
      : 1,
  };
}

/**
 * Downgrade closures written before the evidence contract was enforced.
 * A verified closure needs two complete-source omissions separated by the
 * configured confirmation interval. Legacy rows without that evidence must
 * not remain permanently closed just because an older scanner wrote them.
 */
export function quarantineUnverifiedClosure(job, now, options = {}) {
  if (job?.status !== 'closed') return job;

  const { confirmationHours } = validateLifecycleOptions(options);
  const firstMissingTime = Date.parse(job.possibly_closed_at ?? '');
  const closedTime = Date.parse(job.closed_at ?? '');
  const missingScans = Number(job.missing_complete_scans ?? 0);
  const verified = missingScans >= 2
    && Number.isFinite(firstMissingTime)
    && Number.isFinite(closedTime)
    && closedTime >= firstMissingTime
    && (closedTime - firstMissingTime) / 3_600_000 >= confirmationHours;
  if (verified) return job;

  const migrationTime = new Date(now).toISOString();
  if (!Number.isFinite(Date.parse(migrationTime))) {
    throw new Error(`Invalid lifecycle migration timestamp: ${now}`);
  }
  return {
    ...job,
    status: 'possibly_closed',
    closed_at: null,
    possibly_closed_at: migrationTime,
    missing_complete_scans: 1,
  };
}

export function resetSeenLifecycle(job) {
  return {
    ...job,
    status: 'open',
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
  };
}


/**
 * A healthy rolling-window source can prove that a posting left its current
 * window, but cannot prove that the employer closed it. Make the stored record
 * non-actionable without manufacturing closure evidence.
 */
export function applyWindowedOmission(previous, now) {
  if (!previous || !now) throw new Error('A previous job and timestamp are required');
  const observedAt = new Date(now).toISOString();
  if (!Number.isFinite(Date.parse(observedAt))) {
    throw new Error(`Invalid lifecycle timestamp: ${now}`);
  }
  return {
    ...previous,
    status: 'unknown',
    closed_at: null,
    possibly_closed_at: null,
    missing_complete_scans: 0,
    data_quality: {
      state: 'outside_source_window',
      issues: ['omitted_from_latest_window'],
      observed_at: observedAt,
    },
  };
}
