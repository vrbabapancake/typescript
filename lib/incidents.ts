// Pure functions: no network, no React. That makes them easy to test
// (see incidents.test.ts) and easy to reuse anywhere in the app.

import type { Incident, IncidentSummary, PagerDutyApiIncident } from "./types.ts";

/** Convert one incident from the PagerDuty API shape into this app's shape. */
export function fromApi(raw: PagerDutyApiIncident): Incident {
  return {
    id: raw.id,
    number: raw.incident_number,
    title: raw.title,
    status: raw.status,
    urgency: raw.urgency,
    service: raw.service?.summary ?? "Unknown service",
    createdAt: raw.created_at,
    url: raw.html_url,
  };
}

/** Count incidents by status and urgency for the summary cards. */
export function summarize(incidents: Incident[]): IncidentSummary {
  return {
    total: incidents.length,
    triggered: incidents.filter((i) => i.status === "triggered").length,
    acknowledged: incidents.filter((i) => i.status === "acknowledged").length,
    highUrgency: incidents.filter((i) => i.urgency === "high").length,
  };
}

/** Sort so the most urgent work is on top: triggered before acknowledged,
 *  high urgency before low, then newest first. Returns a new array. */
export function sortByPriority(incidents: Incident[]): Incident[] {
  const statusRank = { triggered: 0, acknowledged: 1, resolved: 2 } as const;
  const urgencyRank = { high: 0, low: 1 } as const;
  return [...incidents].sort(
    (a, b) =>
      statusRank[a.status] - statusRank[b.status] ||
      urgencyRank[a.urgency] - urgencyRank[b.urgency] ||
      Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
}

/** "5 min ago", "3 h ago", "2 d ago" — relative to `now`. */
export function timeAgo(iso: string, now: Date = new Date()): string {
  const minutes = Math.max(0, Math.floor((now.getTime() - Date.parse(iso)) / 60_000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} h ago`;
  return `${Math.floor(hours / 24)} d ago`;
}
