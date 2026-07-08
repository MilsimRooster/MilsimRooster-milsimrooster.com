import {
  COMMENT_THANKS,
  cleanComment,
  cleanOptionalName,
  clientError,
  enforceApiThrottle,
  getDb,
  json,
  looksSpammy,
  readJson,
  rejectCrossSiteWrite,
  serverError,
  validateRecipeSlug
} from "../_lib/recipes-api.js";

export async function onRequestPost(context) {
  const db = getDb(context.env);
  if (!db) return clientError("Feedback database is not configured.", 503);
  const crossSite = rejectCrossSiteWrite(context);
  if (crossSite) return crossSite;
  const throttled = await enforceApiThrottle(context, "comments", 5, 60);
  if (throttled) return throttled;

  const body = await readJson(context.request);
  if (body.error) return clientError(body.error);

  const recipeSlug = validateRecipeSlug(body.data.recipe_slug);
  const name = cleanOptionalName(body.data.name);
  const comment = cleanComment(body.data.comment);
  if (!recipeSlug) return clientError("A valid recipe_slug is required.");
  if (!comment) return clientError("Comment must be between 3 and 1200 characters.");

  if (looksSpammy(body.data)) {
    return json({ message: COMMENT_THANKS });
  }

  try {
    await db.prepare(`
      INSERT INTO recipe_comments (recipe_slug, name, comment, status)
      VALUES (?, ?, ?, 'approved')
    `).bind(recipeSlug, name, comment).run();

    return json({ message: COMMENT_THANKS }, 201);
  } catch (error) {
    console.error("POST /api/comments failed", error);
    return serverError();
  }
}
