import {
  clientError,
  emptyBreakdown,
  getDb,
  json,
  requireAdmin,
  serverError
} from "../../_lib/recipes-api.js";

function adminComment(row) {
  return {
    id: row.id,
    recipe_slug: row.recipe_slug,
    name: row.name || "Rooster Recipes reader",
    comment: row.comment,
    status: row.status,
    created_at: row.created_at
  };
}

function emptySummary(recipeSlug) {
  return {
    recipe_slug: recipeSlug,
    average_rating: 0,
    total_votes: 0,
    one_star_count: 0,
    two_star_count: 0,
    three_star_count: 0,
    four_star_count: 0,
    five_star_count: 0,
    rating_breakdown: emptyBreakdown(),
    recent_comments: [],
    pending_comments: []
  };
}

export async function onRequestGet(context) {
  const unauthorized = requireAdmin(context);
  if (unauthorized) return unauthorized;

  const db = getDb(context.env);
  if (!db) return clientError("Ratings database is not configured.", 503);

  try {
    const ratings = await db.prepare(`
      SELECT
        recipe_slug,
        COALESCE(ROUND(AVG(rating), 2), 0) AS average_rating,
        COUNT(*) AS total_votes,
        COALESCE(SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END), 0) AS one_star_count,
        COALESCE(SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END), 0) AS two_star_count,
        COALESCE(SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END), 0) AS three_star_count,
        COALESCE(SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END), 0) AS four_star_count,
        COALESCE(SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END), 0) AS five_star_count
      FROM recipe_ratings
      GROUP BY recipe_slug
      ORDER BY recipe_slug
    `).all();

    const comments = await db.prepare(`
      SELECT id, recipe_slug, name, comment, status, created_at
      FROM recipe_comments
      WHERE status IN ('approved', 'pending')
      ORDER BY datetime(created_at) DESC, id DESC
      LIMIT 500
    `).all();

    const summaries = new Map();
    for (const row of ratings.results || []) {
      const summary = emptySummary(row.recipe_slug);
      summary.average_rating = Number(row.average_rating || 0);
      summary.total_votes = Number(row.total_votes || 0);
      summary.one_star_count = Number(row.one_star_count || 0);
      summary.two_star_count = Number(row.two_star_count || 0);
      summary.three_star_count = Number(row.three_star_count || 0);
      summary.four_star_count = Number(row.four_star_count || 0);
      summary.five_star_count = Number(row.five_star_count || 0);
      summary.rating_breakdown = {
        "1": summary.one_star_count,
        "2": summary.two_star_count,
        "3": summary.three_star_count,
        "4": summary.four_star_count,
        "5": summary.five_star_count
      };
      summaries.set(row.recipe_slug, summary);
    }

    for (const row of comments.results || []) {
      if (!summaries.has(row.recipe_slug)) summaries.set(row.recipe_slug, emptySummary(row.recipe_slug));
      const summary = summaries.get(row.recipe_slug);
      if (row.status === "pending" && summary.pending_comments.length < 20) {
        summary.pending_comments.push(adminComment(row));
      }
      if (row.status === "approved" && summary.recent_comments.length < 20) {
        summary.recent_comments.push(adminComment(row));
      }
    }

    return json({ recipes: [...summaries.values()] });
  } catch (error) {
    console.error("GET /api/admin/ratings failed", error);
    return serverError();
  }
}
