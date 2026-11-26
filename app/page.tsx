// The home page. This is a Server Component (the default in the App Router):
// it runs on the server, so it can read the API key safely.

import { getOpenIncidents } from "@/lib/pagerduty.ts";
import { sortByPriority, summarize, timeAgo } from "@/lib/incidents.ts";
import type { Incident } from "@/lib/types.ts";

// Render on every request so the list is always current.
export const dynamic = "force-dynamic";

export default async function Home() {
  const result = await getOpenIncidents();
  const incidents = sortByPriority(result.incidents);
  const summary = summarize(incidents);

  return (
    <>
      <header className="band">
        <div className="wrap">
          <h1>Open incidents</h1>
          <p className="subhead">What&apos;s on fire right now, most urgent first.</p>
        </div>
      </header>

      <main className="wrap">
        {result.mode === "demo" && (
          <p className="note">
            <strong>Demo mode:</strong> showing sample data. Set <code>PAGERDUTY_API_KEY</code> to see
            your own incidents.
          </p>
        )}
        {result.mode === "error" && (
          <p className="note error" role="alert">
            <strong>Couldn&apos;t load incidents:</strong> {result.message}
          </p>
        )}

        <section className="cards" aria-label="Summary">
          <SummaryCard label="Open" value={summary.total} />
          <SummaryCard label="Triggered" value={summary.triggered} />
          <SummaryCard label="Acknowledged" value={summary.acknowledged} />
          <SummaryCard label="High urgency" value={summary.highUrgency} featured />
        </section>

        {/* The one "browser window" wireframe motif on the page */}
        <section className="window" aria-label="Incidents">
          <div className="window-bar" aria-hidden="true">
            <span className="window-title">incidents</span>
            <span className="dots" />
          </div>
          {incidents.length === 0 ? (
            <p className="empty">No open incidents. Enjoy the quiet.</p>
          ) : (
            <ul className="incidents">
              {incidents.map((incident) => (
                <IncidentRow key={incident.id} incident={incident} />
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}

function SummaryCard({ label, value, featured = false }: { label: string; value: number; featured?: boolean }) {
  return (
    <div className={featured ? "card featured" : "card"}>
      <span className="card-value">{value}</span>
      <span className="card-label">{label}</span>
    </div>
  );
}

// Status is shown with a symbol and a word, never colour alone.
const STATUS_LABEL = {
  triggered: { symbol: "▲", text: "Triggered" },
  acknowledged: { symbol: "✓", text: "Acknowledged" },
  resolved: { symbol: "●", text: "Resolved" },
} as const;

function IncidentRow({ incident }: { incident: Incident }) {
  const status = STATUS_LABEL[incident.status];
  return (
    <li className="incident">
      <span className={`status ${incident.status}`}>
        <span aria-hidden="true">{status.symbol}</span> {status.text}
      </span>
      <div className="incident-body">
        <a href={incident.url} target="_blank" rel="noreferrer">
          #{incident.number} {incident.title}
        </a>
        <span className="meta">
          {incident.service} · {incident.urgency} urgency · {timeAgo(incident.createdAt)}
        </span>
      </div>
    </li>
  );
}
