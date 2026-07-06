const SCANNER_PATH_BUCKETS = [
  ["wordpress", /^\/(?:wp-admin|wp-content|wp-includes)(?:\/|$)|^\/(?:xmlrpc|wp-login)\.php$/i],
  ["admin-db-panel", /^\/(?:phpmyadmin|pma|mysql|dbadmin|adminer)(?:\/|$)/i],
  ["actuator-service", /^\/(?:actuator|solr)(?:\/|$)/i],
  ["debug-profiler", /^\/(?:_profiler|backend\/web\/debug|admin\/debug|debug|server-status|server-info|system-info|phpinfo)(?:\/|$)/i],
  ["hidden-config", /^\/(?:\.env|\.git|\.svn|\.hg|\.DS_Store)(?:\/|$)/i],
  ["source-map", /^\/.*\.map$/i],
  ["package-config", /^\/(?:composer\.(?:json|lock)|package(?:-lock)?\.json|yarn\.lock|pnpm-lock\.yaml|vite\.config\.mjs|webpack\.config\.js|wrangler\.toml|schema\.sql)$/i],
  ["backup-archive", /^\/(?:backup|database|db|dump|site|www|public_html|wordpress|wp|milsimrooster)(?:[-_.]?[a-z0-9]*)?\.(?:7z|bak|gz|old|rar|sql|tar|tgz|zip)$/i],
  ["php-exploit", /^\/.*\.(?:php|asp|aspx|cgi|jsp)$/i]
];

function normalizePathname(pathname) {
  try {
    return new URL(String(pathname || "/"), "https://milsimrooster.com").pathname;
  } catch {
    return "/";
  }
}

export function bucketScannerPath(pathname) {
  const path = normalizePathname(pathname);
  const match = SCANNER_PATH_BUCKETS.find(([, pattern]) => pattern.test(path));
  return match ? match[0] : "other-scanner";
}

export function cleanCountry(value) {
  const country = String(value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(country) ? country : "XX";
}

export function cleanAsn(value) {
  const asn = Number.parseInt(value, 10);
  return Number.isInteger(asn) && asn > 0 ? asn : 0;
}

export function cleanAsOrganization(value) {
  const organization = String(value || "").trim().replace(/\s+/g, " ");
  return organization ? organization.slice(0, 80) : "unknown";
}

export function cleanMethod(value) {
  const method = String(value || "GET").trim().toUpperCase();
  return /^[A-Z]{3,10}$/.test(method) ? method : "OTHER";
}

export function userAgentFamily(value) {
  const ua = String(value || "").trim().toLowerCase();
  if (!ua) return "unknown";
  if (ua.includes("googlebot")) return "googlebot";
  if (ua.includes("bingbot")) return "bingbot";
  if (ua.includes("facebookexternalhit") || ua.includes("facebot")) return "facebook";
  if (ua.includes("curl") || ua.includes("wget")) return "curl";
  if (ua.includes("python") || ua.includes("aiohttp") || ua.includes("requests")) return "python";
  if (ua.includes("go-http-client")) return "go-http-client";
  if (ua.includes("node") || ua.includes("undici") || ua.includes("axios")) return "node";
  if (ua.includes("java") || ua.includes("okhttp")) return "java";
  if (ua.includes("mozilla") && /(chrome|safari|firefox|edg|opr|trident)/i.test(ua)) {
    return "browser-like";
  }
  return "other";
}

export async function recordScannerProbe(context, pathname) {
  const db = context.env?.DB;
  if (!db) return;

  const cf = context.request.cf || {};
  const country = cleanCountry(cf.country);
  const asn = cleanAsn(cf.asn);
  const asOrganization = cleanAsOrganization(cf.asOrganization);
  const method = cleanMethod(context.request.method);
  const pathBucket = bucketScannerPath(pathname);
  const uaFamily = userAgentFamily(context.request.headers.get("user-agent"));

  await db.prepare(`
    INSERT INTO scanner_probe_daily (
      day,
      country,
      asn,
      as_organization,
      method,
      path_bucket,
      user_agent_family,
      hits,
      first_seen_at,
      last_seen_at
    )
    VALUES (date('now'), ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    ON CONFLICT(day, country, asn, as_organization, method, path_bucket, user_agent_family)
    DO UPDATE SET
      hits = hits + 1,
      last_seen_at = CURRENT_TIMESTAMP
  `).bind(country, asn, asOrganization, method, pathBucket, uaFamily).run();
}
