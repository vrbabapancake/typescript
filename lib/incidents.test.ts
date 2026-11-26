// Run with: npm test
// Uses Node's built-in test runner — no testing library to install.

import { test } from "node:test";
import assert from "node:assert/strict";

import { fromApi, sortByPriority, summarize, timeAgo } from "./incidents.ts";
import { sampleIncidents } from "./sample-incidents.ts";

const incidents = sampleIncidents().map(fromApi);

test("fromApi maps API fields to app fields", () => {
  const first = incidents[0];
  assert.equal(first.number, 1042);
  assert.equal(first.service, "Checkout API");
  assert.equal(first.status, "triggered");
});

test("fromApi falls back when the service is missing", () => {
  const raw = { ...sampleIncidents()[0], service: undefined };
  assert.equal(fromApi(raw).service, "Unknown service");
});

test("summarize counts by status and urgency", () => {
  assert.deepEqual(summarize(incidents), {
    total: 4,
    triggered: 2,
    acknowledged: 2,
    highUrgency: 2,
  });
});

test("summarize handles an empty list", () => {
  assert.deepEqual(summarize([]), { total: 0, triggered: 0, acknowledged: 0, highUrgency: 0 });
});

test("sortByPriority puts triggered + high urgency first", () => {
  const sorted = sortByPriority(incidents).map((i) => i.number);
  assert.deepEqual(sorted, [1042, 1039, 1041, 1036]);
});

test("sortByPriority does not change the original array", () => {
  const before = incidents.map((i) => i.number);
  sortByPriority(incidents);
  assert.deepEqual(incidents.map((i) => i.number), before);
});

test("timeAgo formats minutes, hours and days", () => {
  const now = new Date("2026-11-26T12:00:00Z");
  assert.equal(timeAgo("2026-11-26T11:55:00Z", now), "5 min ago");
  assert.equal(timeAgo("2026-11-26T09:00:00Z", now), "3 h ago");
  assert.equal(timeAgo("2026-11-24T12:00:00Z", now), "2 d ago");
});
