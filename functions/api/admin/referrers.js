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
  if (!db) return clientError("Traffic analytics database is not configured.", 503);

  const url = new URL(context.request.url);
  const days = clampAnalyticsDays(url.searchParams.get("days"));
  const since = `-${days - 1} days`;

  try {
    const [summary, rows] = await Promise.all([
      db.prepare(`
        SELECT
          referrer_family,
          SUM(page_loads) AS page_loads
        FROM traffic_referrer_daily
        WHERE day >= date('now', ?)
        GROUP BY referrer_family
        ORDER BY page_loads DESC, referrer_family ASC
      `).bind(since).all(),
      db.prepare(`
        SELECT
          day,
          referrer_family,
          referrer_host,
          landing_page,
          page_loads,
          first_seen_at,
          last_seen_at
        FROM traffic_referrer_daily
        WHERE day >= date('now', ?)
        ORDER BY day DESC, page_loads DESC, referrer_family ASC, landing_page ASC
        LIMIT 500
      `).bind(since).all()
    ]);

    return json({
      days,
      summary: summary.results || [],
      rows: rows.results || []
    });
  } catch (error) {
    console.error("GET /api/admin/referrers failed", error);
    return serverError();
  }
}
