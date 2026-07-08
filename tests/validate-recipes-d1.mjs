import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const [
  schema,
  throttleMigration,
  apiLib,
  ratingsApi,
  commentsApi,
  adminApi,
  appJs,
  indexHtml,
  adminHtml,
  adminJs,
  readme,
  wranglerExample
] = await Promise.all([
  read("schema.sql"),
  read("migrations/0004_api_write_throttle.sql"),
  read("functions/_lib/recipes-api.js"),
  read("functions/api/ratings.js"),
  read("functions/api/comments.js"),
  read("functions/api/admin/ratings.js"),
  read("public/apps/recipes/app.js"),
  read("public/apps/recipes/index.html"),
  read("public/apps/recipes/admin.html"),
  read("public/apps/recipes/admin.js"),
  read("README.md"),
  read("wrangler.toml.example")
]);

for (const token of [
  "CREATE TABLE IF NOT EXISTS recipe_ratings",
  "id INTEGER PRIMARY KEY AUTOINCREMENT",
  "recipe_slug TEXT NOT NULL",
  "rating INTEGER NOT NULL CHECK(rating BETWEEN 1 AND 5)",
  "created_at TEXT DEFAULT CURRENT_TIMESTAMP",
  "user_hash TEXT",
  "CREATE TABLE IF NOT EXISTS recipe_comments",
  "name TEXT",
  "comment TEXT NOT NULL",
  "status TEXT DEFAULT 'pending'"
]) {
  assert.ok(schema.includes(token), `schema.sql should include ${token}`);
}

for (const source of [schema, throttleMigration]) {
  for (const token of [
    "CREATE TABLE IF NOT EXISTS api_write_throttle",
    "bucket TEXT NOT NULL",
    "client_hash TEXT NOT NULL",
    "window_start INTEGER NOT NULL",
    "PRIMARY KEY (bucket, client_hash, window_start)"
  ]) {
    assert.ok(source.includes(token), `API throttle schema should include ${token}`);
  }
}

for (const token of [
  "rating_breakdown",
  "comments",
  "validateRecipeSlug",
  "validateRating",
  "COMMENT_THANKS",
  "Thanks for your feedback",
  "looksSpammy",
  "userHash",
  "rejectCrossSiteWrite",
  "enforceApiThrottle",
  "tooManyRequests",
  "api_write_throttle"
]) {
  assert.ok(apiLib.includes(token), `recipes API helper should include ${token}`);
}

for (const token of [
  "onRequestGet",
  "onRequestPost",
  "ratingSummary",
  "validateRecipeSlug",
  "validateRating",
  "rejectCrossSiteWrite",
  "enforceApiThrottle",
  "\"ratings\"",
  "INSERT INTO recipe_ratings"
]) {
  assert.ok(ratingsApi.includes(token), `ratings API should include ${token}`);
}

for (const token of [
  "COMMENT_THANKS",
  "INSERT INTO recipe_comments",
  "approved",
  "looksSpammy",
  "rejectCrossSiteWrite",
  "enforceApiThrottle",
  "\"comments\"",
  "cleanComment"
]) {
  assert.ok(commentsApi.includes(token), `comments API should include ${token}`);
}

for (const token of [
  "requireAdmin",
  "GROUP BY recipe_slug",
  "total_votes",
  "one_star_count",
  "two_star_count",
  "three_star_count",
  "four_star_count",
  "five_star_count",
  "pending_comments",
  "recent_comments"
]) {
  assert.ok(adminApi.includes(token), `admin ratings API should include ${token}`);
}

for (const token of [
  "ratingStats",
  "fetchRatingStats",
  "/api/ratings",
  "/api/comments",
  "data-comment-form",
  "Shared rating",
  "No approved comments yet"
]) {
  assert.ok(appJs.includes(token), `recipes app should include ${token}`);
}

assert.ok(!appJs.includes("roosterRecipeRatings"), "recipes app should not persist ratings to localStorage");
assert.ok(indexHtml.includes("/apps/recipes/admin.html"), "recipes index should link to the admin page");
assert.ok(adminHtml.includes("ratingsAdminGrid"), "admin page should include the results grid");
assert.ok(adminJs.includes("/api/admin/ratings"), "admin JS should call the admin ratings API");

for (const token of [
  "binding = \"DB\"",
  "database_name = \"rooster-recipes\"",
  "migrations_dir = \"migrations\""
]) {
  assert.ok(wranglerExample.includes(token), `wrangler example should include ${token}`);
}

for (const token of [
  "npx wrangler d1 create rooster-recipes",
  "npx wrangler d1 migrations apply rooster-recipes --remote",
  "npx wrangler pages secret put ADMIN_TOKEN --project-name milsimrooster-com",
  "npx wrangler pages deploy dist --project-name milsimrooster-com --branch main"
]) {
  assert.ok(readme.includes(token), `README should include ${token}`);
}
