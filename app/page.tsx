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
    <main>
      <header>
        <h1>Open incidents</h1>
        {result.mode === "demo" && (
          <p className="banner">
            Demo mode: showing sample data. Set <code>PAGERDUTY_API_KEY</code> to see your own
            incidents.
          </p>
        )}
        {result.mode === "error" && <p className="banner error">{result.message}</p>}
      </header>

      <section className="cards" aria-label="Summary">
        <SummaryCard label="Open" value={summary.total} />
        <SummaryCard label="Triggered" value={summary.triggered} />
        <SummaryCard label="Acknowledged" value={summary.acknowledged} />
        <SummaryCard label="High urgency" value={summary.highUrgency} />
      </section>

      {incidents.length === 0 ? (
        <p className="empty">No open incidents. 🎉</p>
      ) : (
        <ul className="incidents">
          {incidents.map((incident) => (
            <IncidentRow key={incident.id} incident={incident} />
          ))}
        </ul>
      )}
    </main>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <span className="card-value">{value}</span>
      <span className="card-label">{label}</span>
    </div>
  );
}

function IncidentRow({ incident }: { incident: Incident }) {
  return (
    <li className="incident">
      <span className={`status ${incident.status}`}>{incident.status}</span>
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
