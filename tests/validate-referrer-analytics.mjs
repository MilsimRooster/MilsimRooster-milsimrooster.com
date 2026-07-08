import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  classifyReferrer,
  clampAnalyticsDays,
  normalizeLandingPage
} from "../functions/_lib/traffic-analytics.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const [
  schema,
  migration,
  middleware,
  clientScript,
  writeApi,
  adminApi
] = await Promise.all([
  read("schema.sql"),
  read("migrations/0002_traffic_referrer_daily.sql"),
  read("functions/_middleware.js"),
  read("public/assets/js/referrer-analytics.js"),
  read("functions/api/referrer.js"),
  read("functions/api/admin/referrers.js")
]);

for (const source of [schema, migration]) {
  for (const token of [
    "CREATE TABLE IF NOT EXISTS traffic_referrer_daily",
    "referrer_family TEXT NOT NULL",
    "referrer_host TEXT NOT NULL",
    "landing_page TEXT NOT NULL",
    "page_loads INTEGER NOT NULL DEFAULT 0",
    "PRIMARY KEY (day, referrer_family, referrer_host, landing_page)"
  ]) {
    assert.ok(source.includes(token), `traffic analytics schema should include ${token}`);
  }
}

for (const token of [
  "HTMLRewriter",
  "/assets/js/referrer-analytics.js",
  "text/html",
  "context.next()"
]) {
  assert.ok(middleware.includes(token), `middleware should include ${token}`);
}

for (const token of [
  "document.referrer",
  "window.location.pathname",
  "navigator.sendBeacon",
  "/api/referrer"
]) {
  assert.ok(clientScript.includes(token), `client script should include ${token}`);
}

for (const forbidden of [
  "cf-connecting-ip",
  "user-agent",
  "document.cookie",
  "localStorage"
]) {
  assert.ok(!clientScript.includes(forbidden), `client script should not collect ${forbidden}`);
  assert.ok(!writeApi.includes(forbidden), `write API should not collect ${forbidden}`);
}

for (const token of [
  "classifyReferrer",
  "normalizeLandingPage",
  "rejectCrossSiteWrite",
  "enforceApiThrottle",
  "\"referrer\"",
  "ON CONFLICT(day, referrer_family, referrer_host, landing_page)",
  "page_loads = page_loads + 1"
]) {
  assert.ok(writeApi.includes(token), `write API should include ${token}`);
}

for (const token of [
  "requireAdmin",
  "clampAnalyticsDays",
  "SUM(page_loads)",
  "traffic_referrer_daily"
]) {
  assert.ok(adminApi.includes(token), `admin API should include ${token}`);
}

assert.deepEqual(classifyReferrer("", "milsimrooster.com"), { family: "direct", host: "direct" });
assert.deepEqual(classifyReferrer("https://l.facebook.com/l.php?u=https%3A%2F%2Fmilsimrooster.com", "milsimrooster.com"), {
  family: "facebook",
  host: "l.facebook.com"
});
assert.deepEqual(classifyReferrer("https://t.co/example", "milsimrooster.com"), { family: "x", host: "t.co" });
assert.deepEqual(classifyReferrer("https://milsimrooster.com/about/", "milsimrooster.com"), {
  family: "internal",
  host: "internal"
});

assert.equal(normalizeLandingPage("/"), "/");
assert.equal(normalizeLandingPage("/apps/bug-strike/?x=1"), "/apps/bug-strike");
assert.equal(normalizeLandingPage("/apps/apostles/new-testament-trail.html"), "/apps/apostles/new-testament-trail");
assert.equal(normalizeLandingPage("/something-weird"), "other");

assert.equal(clampAnalyticsDays(""), 7);
assert.equal(clampAnalyticsDays("2"), 2);
assert.equal(clampAnalyticsDays("999"), 30);
