const state = {
  recipes: [],
  query: "",
  category: "all",
  protein: "all",
  sort: "title",
  favoritesOnly: false,
  selectedRecipe: null,
  lastDinnerId: null,
  ratingStats: {},
  myRatings: {},
  favorites: new Set(JSON.parse(localStorage.getItem("roosterRecipeFavorites") || "[]")),
  shopping: JSON.parse(localStorage.getItem("roosterShoppingList") || "[]"),
  mealPlan: JSON.parse(localStorage.getItem("roosterMealPlan") || "{}")
};

const els = {
  dinnerButton: document.querySelector("#dinnerButton"),
  dinnerMessage: document.querySelector("#dinnerMessage"),
  dinnerSuggestion: document.querySelector("#dinnerSuggestion"),
  searchInput: document.querySelector("#searchInput"),
  categoryFilter: document.querySelector("#categoryFilter"),
  proteinFilter: document.querySelector("#proteinFilter"),
  sortSelect: document.querySelector("#sortSelect"),
  favoritesOnly: document.querySelector("#favoritesOnly"),
  recipeCount: document.querySelector("#recipeCount"),
  recipeGrid: document.querySelector("#recipeGrid"),
  recipeDialog: document.querySelector("#recipeDialog"),
  recipeDetail: document.querySelector("#recipeDetail"),
  shoppingList: document.querySelector("#shoppingList"),
  shoppingCount: document.querySelector("#shoppingCount"),
  clearList: document.querySelector("#clearList"),
  printList: document.querySelector("#printList"),
  copyList: document.querySelector("#copyList"),
  toast: document.querySelector("#toast"),
  mealPlanner: document.querySelector("#mealPlanner"),
  addPlanToList: document.querySelector("#addPlanToList")
};

const dinnerMessages = [
  "Tonight's Rooster pick is...",
  "The kitchen has spoken...",
  "Looks like taco night might be calling...",
  "Dinner decision: solved.",
  "The rooster recommends...",
  "Your stomach voted for..."
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const ratingFaces = ["😕", "😐", "🙂", "😋", "🤠"];
const ratingLabels = ["Nope", "Not again", "Okay", "Good", "Rooster approved"];

function saveFavorites() {
  localStorage.setItem("roosterRecipeFavorites", JSON.stringify([...state.favorites]));
}

function saveShopping() {
  localStorage.setItem("roosterShoppingList", JSON.stringify(state.shopping));
}

function saveMealPlan() {
  localStorage.setItem("roosterMealPlan", JSON.stringify(state.mealPlan));
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.setTimeout(() => els.toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function emptyRatingStats(recipeSlug) {
  return {
    recipe_slug: recipeSlug,
    average_rating: 0,
    rating_count: 0,
    rating_breakdown: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
    comments: []
  };
}

function normalizeRatingStats(recipeSlug, data = {}) {
  const breakdown = data.rating_breakdown || {};
  return {
    recipe_slug: data.recipe_slug || recipeSlug,
    average_rating: Number(data.average_rating || 0),
    rating_count: Number(data.rating_count || 0),
    rating_breakdown: {
      "1": Number(breakdown["1"] || 0),
      "2": Number(breakdown["2"] || 0),
      "3": Number(breakdown["3"] || 0),
      "4": Number(breakdown["4"] || 0),
      "5": Number(breakdown["5"] || 0)
    },
    comments: Array.isArray(data.comments) ? data.comments : []
  };
}

function ratingStatsFor(recipe) {
  return state.ratingStats[recipe.id] || emptyRatingStats(recipe.id);
}

function ratingSummaryText(recipe) {
  const stats = ratingStatsFor(recipe);
  if (!stats.rating_count) return "No shared ratings yet";
  const votes = `${stats.rating_count} vote${stats.rating_count === 1 ? "" : "s"}`;
  return `Shared rating: ${stats.average_rating.toFixed(1)}/5 (${votes})`;
}

function ratingBreakdownText(recipe) {
  const breakdown = ratingStatsFor(recipe).rating_breakdown;
  return [5, 4, 3, 2, 1]
    .map((star) => `${star}★ ${Number(breakdown[String(star)] || 0)}`)
    .join(" / ");
}

async function fetchRatingStats(recipeId) {
  const response = await fetch(`/api/ratings?recipe=${encodeURIComponent(recipeId)}`);
  if (!response.ok) throw new Error("Rating request failed");
  state.ratingStats[recipeId] = normalizeRatingStats(recipeId, await response.json());
}

async function loadRatingStats() {
  await Promise.allSettled(state.recipes.map((recipe) => fetchRatingStats(recipe.id)));
  renderRecipes();
  if (state.selectedRecipe) openRecipe(state.selectedRecipe.id);
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}

function totalTime(recipe) {
  return recipe.prepMinutes + recipe.cookMinutes;
}

function difficultyRank(value) {
  return { Easy: 1, Medium: 2, "Project Cook": 3 }[value] || 4;
}

function formatTime(minutes) {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

function formatQuantity(value) {
  if (value === null || value === undefined || value === "") return "";
  const rounded = Math.round(Number(value) * 100) / 100;
  const whole = Math.floor(rounded);
  const frac = Math.round((rounded - whole) * 4) / 4;
  const fractionMap = { 0.25: "1/4", 0.5: "1/2", 0.75: "3/4" };
  if (rounded === 0) return "";
  if (fractionMap[rounded]) return fractionMap[rounded];
  if (whole && fractionMap[frac]) return `${whole} ${fractionMap[frac]}`;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function scaledIngredient(ingredient, servings, originalServings) {
  const factor = servings / originalServings;
  if (typeof ingredient.qty !== "number") return ingredient;
  return { ...ingredient, qty: ingredient.qty * factor };
}

function ingredientText(ingredient) {
  const qty = formatQuantity(ingredient.qty);
  const unit = ingredient.unit ? `${ingredient.unit} ` : "";
  return `${qty ? `${qty} ` : ""}${unit}${ingredient.item}`.trim();
}

function shoppingKey(ingredient) {
  const unit = ingredient.unit || "";
  return `${ingredient.item.toLowerCase()}|${unit.toLowerCase()}|${ingredient.group}`;
}

function addRecipeToShopping(recipe, servings = recipe.servings) {
  recipe.ingredients.forEach((raw) => {
    const ingredient = scaledIngredient(raw, servings, recipe.servings);
    const key = shoppingKey(ingredient);
    const existing = state.shopping.find((item) => item.key === key);
    if (existing && typeof ingredient.qty === "number" && typeof existing.qty === "number") {
      existing.qty += ingredient.qty;
      existing.sources = [...new Set([...existing.sources, recipe.title])];
    } else if (existing) {
      existing.sources = [...new Set([...existing.sources, recipe.title])];
    } else {
      state.shopping.push({
        key,
        group: ingredient.group || "Pantry",
        item: ingredient.item,
        qty: typeof ingredient.qty === "number" ? ingredient.qty : null,
        unit: ingredient.unit || "",
        checked: false,
        sources: [recipe.title]
      });
    }
  });
  saveShopping();
  renderShopping();
  showToast(`${recipe.title} added to the shopping list.`);
}

function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  saveFavorites();
  renderRecipes();
  if (state.selectedRecipe?.id === id) openRecipe(id);
}

async function setRating(id, value) {
  const score = Number(value);
  if (!Number.isFinite(score) || score < 1 || score > 5) return;
  try {
    const data = await postJson("/api/ratings", { recipe_slug: id, rating: score });
    state.myRatings[id] = score;
    state.ratingStats[id] = normalizeRatingStats(id, data);
    renderRecipes();
    if (state.selectedRecipe?.id === id) openRecipe(id);
    showToast(`Shared ${score}/5 for this recipe.`);
  } catch (error) {
    showToast(error.message || "Rating could not be saved.");
  }
}

function ratingControl(recipe, compact = false) {
  const current = Number(state.myRatings[recipe.id] || 0);
  return `
    <div class="rating-control ${compact ? "compact" : ""}" aria-label="Rate ${escapeHtml(recipe.title)}">
      <span>${escapeHtml(ratingSummaryText(recipe))}</span>
      <small>${escapeHtml(ratingBreakdownText(recipe))}</small>
      <div class="rating-buttons">
        ${ratingFaces.map((face, index) => {
          const value = index + 1;
          return `<button class="${current === value ? "active" : ""}" type="button" data-rate="${recipe.id}" data-score="${value}" aria-label="${ratingLabels[index]}">${face}</button>`;
        }).join("")}
      </div>
    </div>
  `;
}

function recipeMatches(recipe) {
  const haystack = [
    recipe.title,
    recipe.category,
    recipe.protein || "",
    recipe.description,
    recipe.difficulty,
    recipe.keywords.join(" "),
    recipe.ingredients.map((item) => item.item).join(" ")
  ].join(" ").toLowerCase();
  const matchesQuery = !state.query || haystack.includes(state.query.toLowerCase());
  const matchesCategory = state.category === "all" || recipe.category === state.category;
  const matchesProtein = state.protein === "all" || recipe.protein === state.protein;
  const matchesFavorites = !state.favoritesOnly || state.favorites.has(recipe.id);
  return matchesQuery && matchesCategory && matchesProtein && matchesFavorites;
}

function sortedRecipes() {
  return state.recipes.filter(recipeMatches).sort((a, b) => {
    if (state.sort === "total") return totalTime(a) - totalTime(b);
    if (state.sort === "difficulty") return difficultyRank(a.difficulty) - difficultyRank(b.difficulty);
    if (state.sort === "servings") return a.servings - b.servings;
    if (state.sort === "rating") return (ratingStatsFor(b).average_rating - ratingStatsFor(a).average_rating) || a.title.localeCompare(b.title);
    return a.title.localeCompare(b.title);
  });
}

function renderRecipes() {
  const recipes = sortedRecipes();
  els.recipeCount.textContent = `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} showing`;
  els.recipeGrid.innerHTML = recipes.map((recipe) => `
    <article class="recipe-card ${state.favorites.has(recipe.id) ? "favorite" : ""}">
      <div class="recipe-meta">
        <span class="pill">${escapeHtml(recipe.category)}</span>
        <span class="pill">${escapeHtml(recipe.protein || "Any")}</span>
        <span class="pill">${formatTime(totalTime(recipe))}</span>
        <span class="pill">${recipe.servings} servings</span>
        <span class="pill">${escapeHtml(recipe.difficulty)}</span>
      </div>
      <h3>${escapeHtml(recipe.title)}</h3>
      <p>${escapeHtml(recipe.description)}</p>
      ${ratingControl(recipe, true)}
      <div class="card-actions">
        <button type="button" data-open="${recipe.id}">Open</button>
        <button class="favorite-button ${state.favorites.has(recipe.id) ? "active" : ""}" type="button" data-favorite="${recipe.id}">${state.favorites.has(recipe.id) ? "Favorited" : "Favorite"}</button>
        <button type="button" data-shop="${recipe.id}">Add List</button>
      </div>
    </article>
  `).join("") || `<p>No recipes found. Try chili, taco, chicken, barbecue, or potluck.</p>`;
}

function recipeOptionList(selectedId = "") {
  return [`<option value="">Pick</option>`]
    .concat(state.recipes.map((recipe) => `<option value="${recipe.id}" ${recipe.id === selectedId ? "selected" : ""}>${escapeHtml(recipe.title)}</option>`))
    .join("");
}

function renderPlanner() {
  els.mealPlanner.innerHTML = days.map((day) => `
    <label class="meal-day">
      <strong>${day}</strong>
      <select data-plan-day="${day}">
        ${recipeOptionList(state.mealPlan[day] || "")}
      </select>
    </label>
  `).join("");
}

function renderShopping() {
  const total = state.shopping.length;
  els.shoppingCount.textContent = `${total} item${total === 1 ? "" : "s"}`;
  const groups = [...new Set(state.shopping.map((item) => item.group || "Pantry"))].sort();
  els.shoppingList.innerHTML = groups.map((group) => {
    const items = state.shopping.filter((item) => item.group === group);
    return `
      <section class="shopping-group">
        <h3>${escapeHtml(group)}</h3>
        ${items.map((item) => `
          <label class="shopping-item ${item.checked ? "done" : ""}">
            <input type="checkbox" data-check="${escapeHtml(item.key)}" ${item.checked ? "checked" : ""}>
            <span>${escapeHtml(ingredientText(item))}<small> ${escapeHtml(item.sources.join(", "))}</small></span>
            <button type="button" data-remove="${escapeHtml(item.key)}" aria-label="Remove item">x</button>
          </label>
        `).join("")}
      </section>
    `;
  }).join("") || `<p>Your list is empty. Add a recipe and it will stack up here.</p>`;
}

function openRecipe(id) {
  const recipe = state.recipes.find((item) => item.id === id);
  if (!recipe) return;
  state.selectedRecipe = recipe;
  const favorite = state.favorites.has(recipe.id);
  els.recipeDetail.innerHTML = `
    <button class="secondary-button" type="button" data-close>Close</button>
    <p class="kicker">${escapeHtml(recipe.category)}</p>
    <h2>${escapeHtml(recipe.title)}</h2>
    <p>${escapeHtml(recipe.description)}</p>
    <div class="recipe-meta">
      <span class="pill">Prep ${formatTime(recipe.prepMinutes)}</span>
      <span class="pill">Cook ${formatTime(recipe.cookMinutes)}</span>
      <span class="pill">Total ${formatTime(totalTime(recipe))}</span>
      <span class="pill">${escapeHtml(recipe.protein || "Any")}</span>
      <span class="pill">${recipe.servings} servings</span>
      <span class="pill">${escapeHtml(recipe.difficulty)}</span>
    </div>
    <div class="detail-actions">
      <button type="button" data-print-recipe>Print</button>
      <button type="button" data-share-recipe>Share</button>
      <button class="favorite-button ${favorite ? "active" : ""}" type="button" data-favorite="${recipe.id}">${favorite ? "Favorited" : "Favorite"}</button>
      <button type="button" data-shop-detail="${recipe.id}">Add to shopping list</button>
    </div>
    ${ratingControl(recipe)}
    <div class="serving-control">
      <label for="servingsInput">Scale servings</label>
      <input id="servingsInput" type="number" min="1" max="40" value="${recipe.servings}">
    </div>
    <div class="detail-grid">
      <section class="detail-card">
        <h3>Ingredients</h3>
        <ul id="detailIngredients" class="ingredients-list"></ul>
      </section>
      <section class="detail-card">
        <h3>Instructions</h3>
        <ol class="steps-list">${recipe.instructions.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
        <h3>Notes</h3>
        <ul class="notes-list">${recipe.notes.map((note) => `<li>${escapeHtml(note)}</li>`).join("")}</ul>
      </section>
    </div>
    <section class="feedback-card">
      <div>
        <h3>Comments and feedback</h3>
        <p>Share a note for the kitchen. Clean feedback shows up automatically; spam stays filtered.</p>
      </div>
      <form class="comment-form" data-comment-form>
        <input type="hidden" name="recipe_slug" value="${escapeHtml(recipe.id)}">
        <label>
          <span>Name</span>
          <input name="name" type="text" maxlength="60" autocomplete="name" placeholder="Optional">
        </label>
        <label>
          <span>Comment</span>
          <textarea name="comment" maxlength="1200" required placeholder="What worked, what needs tweaking, or what you would change?"></textarea>
        </label>
        <label class="spam-field" aria-hidden="true">
          <span>Website</span>
          <input name="website" type="text" tabindex="-1" autocomplete="off">
        </label>
        <button type="submit">Send Feedback</button>
      </form>
      ${renderApprovedComments(recipe)}
    </section>
  `;
  renderScaledIngredients(recipe.servings);
  if (!els.recipeDialog.open) els.recipeDialog.showModal();
}

function renderApprovedComments(recipe) {
  const comments = ratingStatsFor(recipe).comments;
  if (!comments.length) return `<div class="approved-comments"><p>No approved comments yet.</p></div>`;
  return `
    <div class="approved-comments">
      <h4>Approved comments</h4>
      ${comments.map((comment) => `
        <article class="comment">
          <strong>${escapeHtml(comment.name || "Rooster Recipes reader")}</strong>
          <p>${escapeHtml(comment.comment)}</p>
          <small>${escapeHtml(comment.created_at || "")}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderScaledIngredients(servings) {
  const list = document.querySelector("#detailIngredients");
  if (!list || !state.selectedRecipe) return;
  const recipe = state.selectedRecipe;
  list.innerHTML = recipe.ingredients
    .map((item) => scaledIngredient(item, Number(servings), recipe.servings))
    .map((item) => `<li>${escapeHtml(ingredientText(item))}</li>`)
    .join("");
}

function recipeShareText(recipe) {
  return `${recipe.title}\n${recipe.description}\n\nIngredients:\n${recipe.ingredients.map((i) => `- ${ingredientText(i)}`).join("\n")}\n\nSteps:\n${recipe.instructions.map((step, i) => `${i + 1}. ${step}`).join("\n")}`;
}

async function copyText(text, success) {
  await navigator.clipboard.writeText(text);
  showToast(success);
}

async function shareRecipe(recipe) {
  const text = recipeShareText(recipe);
  if (navigator.share) {
    await navigator.share({ title: recipe.title, text });
    return;
  }
  await copyText(text, "Recipe copied.");
}

function shoppingText() {
  return state.shopping
    .map((item) => `${item.checked ? "[x]" : "[ ]"} ${ingredientText(item)} (${item.sources.join(", ")})`)
    .join("\n");
}

function randomDinner() {
  if (!state.recipes.length) return;
  const dinnerRecipes = state.recipes.filter((recipe) => recipe.category !== "Dessert" && recipe.protein !== "Dessert");
  let options = dinnerRecipes.length ? dinnerRecipes : state.recipes;
  if (options.length > 1) options = options.filter((recipe) => recipe.id !== state.lastDinnerId);
  const recipe = options[Math.floor(Math.random() * options.length)];
  state.lastDinnerId = recipe.id;
  const message = dinnerMessages[Math.floor(Math.random() * dinnerMessages.length)];
  els.dinnerSuggestion.classList.add("swapping");
  window.setTimeout(() => {
    els.dinnerMessage.textContent = message;
    els.dinnerSuggestion.innerHTML = `
      <div class="recipe-meta">
        <span class="pill">${escapeHtml(recipe.category)}</span>
        <span class="pill">${escapeHtml(recipe.protein || "Any")}</span>
        <span class="pill">Prep ${formatTime(recipe.prepMinutes)}</span>
        <span class="pill">Cook ${formatTime(recipe.cookMinutes)}</span>
        <span class="pill">${recipe.servings} servings</span>
      </div>
      <h3>${escapeHtml(recipe.title)}</h3>
      <p>${escapeHtml(recipe.description)}</p>
      <div class="card-actions">
        <button type="button" data-open="${recipe.id}">Open recipe</button>
        <button type="button" data-shop="${recipe.id}">Add to list</button>
      </div>
    `;
    els.dinnerSuggestion.classList.remove("swapping");
  }, 160);
}

function setupCategories() {
  const categories = [...new Set(state.recipes.map((recipe) => recipe.category))].sort();
  els.categoryFilter.innerHTML = `<option value="all">All categories</option>` + categories.map((category) => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`).join("");
  const proteins = [...new Set(state.recipes.map((recipe) => recipe.protein || "Any"))].sort();
  els.proteinFilter.innerHTML = `<option value="all">All proteins</option>` + proteins.map((protein) => `<option value="${escapeHtml(protein)}">${escapeHtml(protein)}</option>`).join("");
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("button");
  if (!target) return;
  const openId = target.dataset.open;
  const favoriteId = target.dataset.favorite;
  const shopId = target.dataset.shop || target.dataset.shopDetail;
  if (openId) openRecipe(openId);
  if (favoriteId) toggleFavorite(favoriteId);
  if (target.dataset.rate) setRating(target.dataset.rate, target.dataset.score);
  if (shopId) {
    const recipe = state.recipes.find((item) => item.id === shopId);
    const servings = Number(document.querySelector("#servingsInput")?.value || recipe.servings);
    if (recipe) addRecipeToShopping(recipe, servings);
  }
  if (target.dataset.close !== undefined) els.recipeDialog.close();
  if (target.dataset.printRecipe !== undefined) window.print();
  if (target.dataset.shareRecipe !== undefined && state.selectedRecipe) await shareRecipe(state.selectedRecipe);
  if (target.dataset.remove) {
    state.shopping = state.shopping.filter((item) => item.key !== target.dataset.remove);
    saveShopping();
    renderShopping();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-check]")) {
    const item = state.shopping.find((entry) => entry.key === event.target.dataset.check);
    if (item) item.checked = event.target.checked;
    saveShopping();
    renderShopping();
  }
  if (event.target.matches("[data-plan-day]")) {
    state.mealPlan[event.target.dataset.planDay] = event.target.value;
    saveMealPlan();
  }
});

document.addEventListener("input", (event) => {
  if (event.target.id === "servingsInput") renderScaledIngredients(event.target.value);
});

document.addEventListener("submit", async (event) => {
  if (!event.target.matches("[data-comment-form]")) return;
  event.preventDefault();
  const form = event.target;
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const data = await postJson("/api/comments", payload);
    form.reset();
    showToast(data.message || "Feedback sent.");
  } catch (error) {
    showToast(error.message || "Feedback could not be sent.");
  }
});

els.searchInput.addEventListener("input", () => {
  state.query = els.searchInput.value.trim();
  renderRecipes();
});

els.categoryFilter.addEventListener("change", () => {
  state.category = els.categoryFilter.value;
  renderRecipes();
});

els.proteinFilter.addEventListener("change", () => {
  state.protein = els.proteinFilter.value;
  renderRecipes();
});

els.sortSelect.addEventListener("change", () => {
  state.sort = els.sortSelect.value;
  renderRecipes();
});

els.favoritesOnly.addEventListener("click", () => {
  state.favoritesOnly = !state.favoritesOnly;
  els.favoritesOnly.setAttribute("aria-pressed", String(state.favoritesOnly));
  renderRecipes();
});

els.dinnerButton.addEventListener("click", randomDinner);
els.clearList.addEventListener("click", () => {
  state.shopping = [];
  saveShopping();
  renderShopping();
});
els.printList.addEventListener("click", () => window.print());
els.copyList.addEventListener("click", () => copyText(shoppingText(), "Shopping list copied."));
els.addPlanToList.addEventListener("click", () => {
  Object.values(state.mealPlan).forEach((id) => {
    const recipe = state.recipes.find((item) => item.id === id);
    if (recipe) addRecipeToShopping(recipe);
  });
});
els.recipeDialog.addEventListener("click", (event) => {
  if (event.target === els.recipeDialog) els.recipeDialog.close();
});

fetch("recipes.json")
  .then((response) => response.json())
  .then((recipes) => {
    state.recipes = recipes;
    setupCategories();
    renderRecipes();
    renderPlanner();
    renderShopping();
    randomDinner();
    loadRatingStats();
  })
  .catch(() => {
    els.recipeGrid.innerHTML = "<p>Recipes could not load. Try refreshing the page.</p>";
  });
