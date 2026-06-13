const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0"
};

export const COMMENT_THANKS = "Thanks for your feedback — we’ll see about making changes ASAP!";

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

export function clientError(message, status = 400) {
  return json({ error: message }, status);
}

export function serverError() {
  return json({ error: "Something went wrong. Please try again later." }, 500);
}

export function getDb(env) {
  return env?.DB || null;
}

export function validateRecipeSlug(value) {
  const slug = String(value || "").trim();
  if (!/^[a-z0-9][a-z0-9-]{1,99}$/i.test(slug)) return null;
  return slug.toLowerCase();
}

export function validateRating(value) {
  const rating = Number(value);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return rating;
}

export function cleanOptionalName(value) {
  const name = String(value || "").trim().replace(/\s+/g, " ");
  if (!name) return null;
  return name.slice(0, 60);
}

export function cleanComment(value) {
  const comment = String(value || "").trim().replace(/\s+/g, " ");
  if (comment.length < 3 || comment.length > 1200) return null;
  return comment;
}

export function looksSpammy(payload) {
  const honeypot = String(payload?.website || payload?.url || "").trim();
  if (honeypot) return true;
  const comment = String(payload?.comment || "");
  const links = comment.match(/https?:\/\/|www\./gi) || [];
  return links.length > 2;
}

export async function readJson(request, maxBytes = 12000) {
  const raw = await request.text();
  if (raw.length > maxBytes) return { error: "Request body is too large." };
  try {
    return { data: raw ? JSON.parse(raw) : {} };
  } catch {
    return { error: "Request body must be valid JSON." };
  }
}

export async function userHash(request) {
  const ip = request.headers.get("cf-connecting-ip") || "";
  const ua = request.headers.get("user-agent") || "";
  if (!ip && !ua) return null;
  const input = new TextEncoder().encode(`${ip}|${ua}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function emptyBreakdown() {
  return { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
}

function publicComment(row) {
  return {
    id: row.id,
    recipe_slug: row.recipe_slug,
    name: row.name || "Rooster Recipes reader",
    comment: row.comment,
    created_at: row.created_at
  };
}

export async function ratingSummary(db, recipeSlug, includeApprovedComments = true) {
  const row = await db.prepare(`
    SELECT
      ? AS recipe_slug,
      COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating,
      COUNT(*) AS rating_count,
      COALESCE(SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), 0) AS one_star_count,
      COALESCE(SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), 0) AS two_star_count,
      COALESCE(SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), 0) AS three_star_count,
      COALESCE(SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), 0) AS four_star_count,
      COALESCE(SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END), 0) AS five_star_count
    FROM recipe_ratings
    WHERE recipe_slug = ?
  `).bind(recipeSlug, recipeSlug).first();

  const comments = includeApprovedComments
    ? await db.prepare(`
        SELECT id, recipe_slug, name, comment, created_at
        FROM recipe_comments
        WHERE recipe_slug = ? AND status = 'approved'
        ORDER BY datetime(created_at) DESC, id DESC
        LIMIT 20
      `).bind(recipeSlug).all()
    : { results: [] };

  return {
    recipe_slug: recipeSlug,
    average_rating: Number(row?.average_rating || 0),
    rating_count: Number(row?.rating_count || 0),
    rating_breakdown: {
      ...emptyBreakdown(),
      "1": Number(row?.one_star_count || 0),
      "2": Number(row?.two_star_count || 0),
      "3": Number(row?.three_star_count || 0),
      "4": Number(row?.four_star_count || 0),
      "5": Number(row?.five_star_count || 0)
    },
    comments: (comments.results || []).map(publicComment)
  };
}

export function requireAdmin(context) {
  const token = context.env?.ADMIN_TOKEN;
  if (!token) return clientError("Admin access is not configured.", 503);
  const header = context.request.headers.get("authorization") || "";
  if (header !== `Bearer ${token}`) return clientError("Unauthorized.", 401);
  return null;
}
