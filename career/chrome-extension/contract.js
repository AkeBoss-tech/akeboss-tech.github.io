export const NATIVE_HOST = 'com.akeboss.career_monitor';
export const DUE_ALARM = 'career-monitor-due';
export const DUE_ALARM_MINUTES = 15;

export function normalizeDashboard(value) {
  const dashboard = value && typeof value === 'object' ? value : {};
  const status = dashboard.status && typeof dashboard.status === 'object' ? dashboard.status : {};
  const summary = dashboard.summary && typeof dashboard.summary === 'object' ? dashboard.summary : {};
  const health = status.health && typeof status.health === 'object' ? status.health : {};
  const recent = Array.isArray(dashboard.recent_relevant) ? dashboard.recent_relevant : [];
  const number = (candidate) => (Number.isFinite(Number(candidate)) ? Number(candidate) : 0);
  return {
    generatedAt: String(dashboard.generated_at ?? status.generated_at ?? ''),
    supportedSources: number(status.supported_sources),
    agentRequiredSources: number(status.agent_required_sources),
    dueSources: number(status.due_sources),
    leasedSources: number(status.leased_sources),
    openEscalations: number(status.open_escalations),
    health: Object.fromEntries(
      Object.entries(health)
        .filter(([key, count]) => key && Number.isFinite(Number(count)))
        .map(([key, count]) => [key, Number(count)]),
    ),
    newRelevantJobs: number(summary.new_relevant_jobs),
    relevantOpenJobs: number(summary.relevant_open_jobs),
    scanCompletedAt: String(summary.completed_at ?? ''),
    recentRelevant: recent.slice(0, 8).map((job) => ({
      company: String(job?.company ?? '').slice(0, 200),
      title: String(job?.title ?? '').slice(0, 300),
      location: String(job?.location ?? '').slice(0, 300),
      url: String(job?.url ?? ''),
      firstSeenAt: String(job?.first_seen_at ?? ''),
    })),
  };
}

export function safeHttpsUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.href : null;
  } catch {
    return null;
  }
}
