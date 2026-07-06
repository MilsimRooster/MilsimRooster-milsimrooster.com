import {
  clientError,
  getDb,
  json,
  requireAdmin,
  serverError
} from "../../_lib/recipes-api.js";
import { clampAnalyticsDays } from "../../_lib/traffic-analytics.js";

export async function onRequestGet(context) {
  const unauthorized = requireAdmin(context);
  if (unauthorized) return unauthorized;

  const db = getDb(context.env);
  if (!db) return clientError("Scanner analytics database is not configured.", 503);

  const url = new URL(context.request.url);
  const days = clampAnalyticsDays(url.searchParams.get("days"));
  const since = `-${days - 1} days`;

  try {
    const [countries, pathBuckets, userAgents, rows] = await Promise.all([
      db.prepare(`
        SELECT
          country,
          asn,
          as_organization,
          SUM(hits) AS hits
        FROM scanner_probe_daily
        WHERE day >= date('now', ?)
        GROUP BY country, asn, as_organization
        ORDER BY hits DESC, country ASC, asn ASC
        LIMIT 100
      `).bind(since).all(),
      db.prepare(`
        SELECT
          path_bucket,
          SUM(hits) AS hits
        FROM scanner_probe_daily
        WHERE day >= date('now', ?)
        GROUP BY path_bucket
        ORDER BY hits DESC, path_bucket ASC
      `).bind(since).all(),
      db.prepare(`
        SELECT
          user_agent_family,
          SUM(hits) AS hits
        FROM scanner_probe_daily
        WHERE day >= date('now', ?)
        GROUP BY user_agent_family
        ORDER BY hits DESC, user_agent_family ASC
      `).bind(since).all(),
      db.prepare(`
        SELECT
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
        FROM scanner_probe_daily
        WHERE day >= date('now', ?)
        ORDER BY day DESC, hits DESC, country ASC, path_bucket ASC
        LIMIT 500
      `).bind(since).all()
    ]);

    return json({
      days,
      countries: countries.results || [],
      path_buckets: pathBuckets.results || [],
      user_agents: userAgents.results || [],
      rows: rows.results || []
    });
  } catch (error) {
    console.error("GET /api/admin/scanner-probes failed", error);
    return serverError();
  }
}
