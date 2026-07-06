import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import {
  bucketScannerPath,
  cleanAsOrganization,
  cleanAsn,
  cleanCountry,
  cleanMethod,
  userAgentFamily
} from "../functions/_lib/scanner-analytics.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const [
  schema,
  migration,
  middleware,
  helper,
  adminApi
] = await Promise.all([
  read("schema.sql"),
  read("migrations/0003_scanner_probe_daily.sql"),
  read("functions/_middleware.js"),
  read("functions/_lib/scanner-analytics.js"),
  read("functions/api/admin/scanner-probes.js")
]);

for (const source of [schema, migration]) {
  for (const token of [
    "CREATE TABLE IF NOT EXISTS scanner_probe_daily",
    "country TEXT NOT NULL",
    "asn INTEGER NOT NULL DEFAULT 0",
    "as_organization TEXT NOT NULL",
    "path_bucket TEXT NOT NULL",
    "user_agent_family TEXT NOT NULL",
    "PRIMARY KEY (day, country, asn, as_organization, method, path_bucket, user_agent_family)"
  ]) {
    assert.ok(source.includes(token), `scanner analytics schema should include ${token}`);
  }
}

for (const forbidden of [
  "cf-connecting-ip",
  "clientIP",
  "user_agent TEXT",
  "user-agent TEXT",
  "ip_address"
]) {
  assert.ok(!schema.includes(forbidden), `schema should not store ${forbidden}`);
  assert.ok(!migration.includes(forbidden), `migration should not store ${forbidden}`);
  assert.ok(!helper.includes(forbidden), `helper should not store ${forbidden}`);
}

for (const token of [
  "recordScannerProbe",
  "context.waitUntil",
  "no-store, max-age=0",
  "status: 410"
]) {
  assert.ok(middleware.includes(token), `middleware should include ${token}`);
}

for (const token of [
  "requireAdmin",
  "scanner_probe_daily",
  "SUM(hits)",
  "path_buckets",
  "user_agents"
]) {
  assert.ok(adminApi.includes(token), `admin API should include ${token}`);
}

assert.equal(bucketScannerPath("/.env"), "hidden-config");
assert.equal(bucketScannerPath("/wp-content/plugins/thing.php"), "wordpress");
assert.equal(bucketScannerPath("/_profiler/phpinfo"), "debug-profiler");
assert.equal(bucketScannerPath("/assets/main.js.map"), "source-map");
assert.equal(bucketScannerPath("/backup.sql"), "backup-archive");
assert.equal(bucketScannerPath("/phpmyadmin/"), "admin-db-panel");
assert.equal(bucketScannerPath("/actuator/env"), "actuator-service");
assert.equal(bucketScannerPath("/alfa.php"), "php-exploit");

assert.equal(userAgentFamily("curl/8.1.2"), "curl");
assert.equal(userAgentFamily("python-requests/2.31"), "python");
assert.equal(userAgentFamily("Go-http-client/2.0"), "go-http-client");
assert.equal(userAgentFamily("Mozilla/5.0 AppleWebKit/537.36 Chrome/126 Safari/537.36"), "browser-like");
assert.equal(userAgentFamily(""), "unknown");

assert.equal(cleanCountry("us"), "US");
assert.equal(cleanCountry("USA"), "XX");
assert.equal(cleanAsn("12345"), 12345);
assert.equal(cleanAsn("nope"), 0);
assert.equal(cleanMethod("post"), "POST");
assert.equal(cleanMethod("weird method"), "OTHER");
assert.equal(cleanAsOrganization("  Example   Net  "), "Example Net");
