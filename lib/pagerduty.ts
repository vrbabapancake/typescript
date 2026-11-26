// Fetches open incidents. Runs only on the server (it's called from a
// Server Component), so the API key never reaches the browser.

import { fromApi } from "./incidents.ts";
import { sampleIncidents } from "./sample-incidents.ts";
import type { Incident, PagerDutyApiIncident } from "./types.ts";

export type IncidentResult =
  | { mode: "demo"; incidents: Incident[] }
  | { mode: "live"; incidents: Incident[] }
  | { mode: "error"; incidents: Incident[]; message: string };

const API_URL =
  "https://api.pagerduty.com/incidents?statuses[]=triggered&statuses[]=acknowledged&limit=25";

export async function getOpenIncidents(): Promise<IncidentResult> {
  const apiKey = process.env.PAGERDUTY_API_KEY;

  // No key set → demo mode with sample data. This is the default.
  if (!apiKey) {
    return { mode: "demo", incidents: sampleIncidents().map(fromApi) };
  }

  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Token token=${apiKey}`,
        Accept: "application/vnd.pagerduty+json;version=2",
      },
      cache: "no-store", // always show current incidents
    });

    if (!response.ok) {
      // Never echo the key or the raw response body back to the page.
      return {
        mode: "error",
        incidents: [],
        message: `PagerDuty API returned ${response.status}. Check that your API key is valid and read-only.`,
      };
    }

    const data = (await response.json()) as { incidents: PagerDutyApiIncident[] };
    return { mode: "live", incidents: data.incidents.map(fromApi) };
  } catch {
    return { mode: "error", incidents: [], message: "Couldn't reach the PagerDuty API." };
  }
}
