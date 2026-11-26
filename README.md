# Open Incidents — PagerDuty + Next.js

A small Next.js app, written in TypeScript, that lists open PagerDuty incidents. It sorts them so the most urgent are on top and shows a summary of what's open.

It runs in **demo mode** with sample data by default, so you don't need a PagerDuty account or API key to try it.

![CI](https://github.com/vrbabapancake/typescript/actions/workflows/ci.yml/badge.svg)

## What it shows

- **Summary cards:** how many incidents are open, triggered, acknowledged, and high urgency
- **Incident list:** triggered before acknowledged, high urgency before low, newest first
- **Each incident:** its number, title, service, urgency, and how long ago it started, with a link to the incident in PagerDuty

## Run it on your computer

You need [Node.js](https://nodejs.org) 22.18 or later.

```bash
npm install
npm run dev
```

Then open <http://localhost:3000>.

`npm install` downloads the packages listed in `package.json` (Next.js, React, TypeScript) into a `node_modules` folder.

### Use real PagerDuty data (optional)

1. Create a **read-only** REST API key in PagerDuty: **Integrations → API Access Keys**.
2. Copy `.env.example` to `.env.local` and paste the key after `PAGERDUTY_API_KEY=`.
3. Restart `npm run dev`.

Git ignores `.env.local`, so the key is never committed. The app reads the key only on the server, so it never reaches the browser.

## How the code is organized

| File | What it does |
|---|---|
| `app/page.tsx` | The page. A Server Component that fetches incidents and renders them. |
| `app/layout.tsx` | The HTML shell wrapped around every page. |
| `app/tokens.css` | Design tokens from my portfolio's "Sketchbook" design system (colours, fonts, radii). Copied as-is so both stay in sync. |
| `app/globals.css` | Page styles built on those tokens: teal band, ink outlines, lilac offset shadows, grid-paper "browser window". Light and dark mode. |
| `lib/types.ts` | TypeScript types: the shape of an incident, in the API's format and in this app's format. |
| `lib/pagerduty.ts` | Calls the PagerDuty REST API, or returns sample data in demo mode. |
| `lib/incidents.ts` | Pure functions that convert, sort, summarize, and format incidents. |
| `lib/sample-incidents.ts` | Made-up incidents for demo mode. |
| `lib/incidents.test.ts` | Unit tests for `lib/incidents.ts`. |

The logic in `lib/incidents.ts` is kept separate from the page so it can be tested without a browser or network.

## Tests and CI

```bash
npm test
```

The tests use Node's built-in test runner, so there's no testing library to install. Node 22.18+ runs TypeScript files directly.

On every push, [GitHub Actions](.github/workflows/ci.yml) installs the dependencies on GitHub's servers, runs the tests, and builds the app. The build also type-checks every file. [Dependabot](.github/dependabot.yml) opens a pull request when a dependency needs a security update.

## Why it's built this way

- **The API key stays on the server.** The PagerDuty call happens in a Server Component.
- **Demo mode uses the real code path.** Sample data is shaped like a real API response and goes through the same `fromApi` conversion.
- **Errors don't leak details.** If the API call fails, the page shows a plain message, not the raw response.
