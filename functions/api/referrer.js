import {
  getDb,
  readJson
} from "../_lib/recipes-api.js";
import {
  classifyReferrer,
  normalizeLandingPage
} from "../_lib/traffic-analytics.js";

const NO_CONTENT_HEADERS = {
  "cache-control": "no-store, max-age=0"
};

function noContent() {
  return new Response(null, {
    status: 204,
    headers: NO_CONTENT_HEADERS
  });
}

export async function onRequestOptions() {
  return noContent();
}

export async function onRequestPost(context) {
  const db = getDb(context.env);
  if (!db) return noContent();

  const body = await readJson(context.request, 2048);
  if (body.error) return noContent();

  const requestUrl = new URL(context.request.url);
  const referrer = classifyReferrer(body.data.referrer, requestUrl.hostname);
  const landingPage = normalizeLandingPage(body.data.path || requestUrl.pathname);

  try {
    await db.prepare(`
      INSERT INTO traffic_referrer_daily (
        day,
        referrer_family,
        referrer_host,
        landing_page,
        page_loads,
        first_seen_at,
        last_seen_at
      )
      VALUES (date('now'), ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(day, referrer_family, referrer_host, landing_page)
      DO UPDATE SET
        page_loads = page_loads + 1,
        last_seen_at = CURRENT_TIMESTAMP
    `).bind(referrer.family, referrer.host, landingPage).run();
  } catch (error) {
    console.error("POST /api/referrer failed", error);
  }

  return noContent();
}
