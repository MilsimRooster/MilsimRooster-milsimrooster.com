import {
  clientError,
  getDb,
  json,
  ratingSummary,
  readJson,
  serverError,
  userHash,
  validateRating,
  validateRecipeSlug
} from "../_lib/recipes-api.js";

export async function onRequestGet(context) {
  const db = getDb(context.env);
  if (!db) return clientError("Ratings database is not configured.", 503);

  const url = new URL(context.request.url);
  const recipeSlug = validateRecipeSlug(url.searchParams.get("recipe"));
  if (!recipeSlug) return clientError("A valid recipe slug is required.");

  try {
    return json(await ratingSummary(db, recipeSlug));
  } catch (error) {
    console.error("GET /api/ratings failed", error);
    return serverError();
  }
}

export async function onRequestPost(context) {
  const db = getDb(context.env);
  if (!db) return clientError("Ratings database is not configured.", 503);

  const body = await readJson(context.request);
  if (body.error) return clientError(body.error);

  const recipeSlug = validateRecipeSlug(body.data.recipe_slug);
  const rating = validateRating(body.data.rating);
  if (!recipeSlug) return clientError("A valid recipe_slug is required.");
  if (!rating) return clientError("Rating must be an integer from 1 to 5.");

  try {
    await db.prepare(`
      INSERT INTO recipe_ratings (recipe_slug, rating, user_hash)
      VALUES (?, ?, ?)
    `).bind(recipeSlug, rating, await userHash(context.request)).run();

    return json(await ratingSummary(db, recipeSlug));
  } catch (error) {
    console.error("POST /api/ratings failed", error);
    return serverError();
  }
}
