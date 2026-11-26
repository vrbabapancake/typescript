// Made-up incidents for demo mode. Shaped exactly like the real API response,
// so demo mode runs through the same `fromApi` conversion as live data.

import type { PagerDutyApiIncident } from "./types.ts";

function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}

export function sampleIncidents(): PagerDutyApiIncident[] {
  return [
    {
      id: "DEMO001",
      incident_number: 1042,
      title: "Checkout API p95 latency above 2s",
      status: "triggered",
      urgency: "high",
      created_at: minutesAgo(4),
      html_url: "https://example.pagerduty.com/incidents/DEMO001",
      service: { summary: "Checkout API" },
    },
    {
      id: "DEMO002",
      incident_number: 1041,
      title: "Disk usage 92% on db-replica-03",
      status: "acknowledged",
      urgency: "high",
      created_at: minutesAgo(38),
      html_url: "https://example.pagerduty.com/incidents/DEMO002",
      service: { summary: "Orders Database" },
    },
    {
      id: "DEMO003",
      incident_number: 1039,
      title: "Nightly report job failed",
      status: "triggered",
      urgency: "low",
      created_at: minutesAgo(190),
      html_url: "https://example.pagerduty.com/incidents/DEMO003",
      service: { summary: "Reporting" },
    },
    {
      id: "DEMO004",
      incident_number: 1036,
      title: "SSL certificate expires in 7 days",
      status: "acknowledged",
      urgency: "low",
      created_at: minutesAgo(60 * 26),
      html_url: "https://example.pagerduty.com/incidents/DEMO004",
      service: { summary: "Marketing Site" },
    },
  ];
}
