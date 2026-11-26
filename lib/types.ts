// The shape of the data this app works with.
// TypeScript checks every file against these types, so a typo like
// `incident.urgncy` is caught before the code ever runs.

export type IncidentStatus = "triggered" | "acknowledged" | "resolved";
export type IncidentUrgency = "high" | "low";

export type Incident = {
  id: string;
  number: number;
  title: string;
  status: IncidentStatus;
  urgency: IncidentUrgency;
  service: string;
  createdAt: string; // ISO 8601 timestamp, e.g. "2026-11-26T14:05:00Z"
  url: string;
};

// What the PagerDuty REST API returns for one incident (only the fields we use).
// Docs: https://developer.pagerduty.com/api-reference/
export type PagerDutyApiIncident = {
  id: string;
  incident_number: number;
  title: string;
  status: IncidentStatus;
  urgency: IncidentUrgency;
  created_at: string;
  html_url: string;
  service?: { summary?: string };
};

export type IncidentSummary = {
  total: number;
  triggered: number;
  acknowledged: number;
  highUrgency: number;
};
