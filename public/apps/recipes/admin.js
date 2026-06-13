const els = {
  tokenForm: document.querySelector("#tokenForm"),
  adminToken: document.querySelector("#adminToken"),
  refreshResults: document.querySelector("#refreshResults"),
  adminStatus: document.querySelector("#adminStatus"),
  grid: document.querySelector("#ratingsAdminGrid"),
  toast: document.querySelector("#toast")
};

let recipeNames = {};

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

function token() {
  return sessionStorage.getItem("roosterRecipesAdminToken") || "";
}

function setToken(value) {
  sessionStorage.setItem("roosterRecipesAdminToken", value);
}

function commentList(comments, emptyText, extraClass = "") {
  if (!comments.length) return `<p class="empty-note">${escapeHtml(emptyText)}</p>`;
  return `
    <div class="admin-comment-list">
      ${comments.map((comment) => `
        <article class="comment ${extraClass}">
          <strong>${escapeHtml(comment.name || "Rooster Recipes reader")}</strong>
          <p>${escapeHtml(comment.comment)}</p>
          <small>${escapeHtml(comment.created_at || "")}</small>
        </article>
      `).join("")}
    </div>
  `;
}

function renderResults(recipes) {
  if (!recipes.length) {
    els.grid.innerHTML = `<p>No ratings or comments are in D1 yet.</p>`;
    return;
  }

  els.grid.innerHTML = recipes.map((recipe) => {
    const title = recipeNames[recipe.recipe_slug] || recipe.recipe_slug;
    const breakdown = recipe.rating_breakdown || {};
    return `
      <article class="admin-card">
        <div class="admin-card-header">
          <div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(recipe.recipe_slug)}</p>
          </div>
          <div class="admin-stats">
            <span class="admin-stat">${Number(recipe.average_rating || 0).toFixed(1)}/5 average</span>
            <span class="admin-stat">${Number(recipe.total_votes || 0)} total votes</span>
          </div>
        </div>
        <div class="breakdown-grid" aria-label="Rating breakdown">
          ${[5, 4, 3, 2, 1].map((star) => `<span>${star}-star ${Number(breakdown[String(star)] || 0)}</span>`).join("")}
        </div>
        <div class="admin-comment-grid">
          <section>
            <h4>Recent comments</h4>
            ${commentList(recipe.recent_comments || [], "No approved comments yet.")}
          </section>
          <section>
            <h4>Pending comments</h4>
            ${commentList(recipe.pending_comments || [], "No pending comments.", "pending-comment")}
          </section>
        </div>
      </article>
    `;
  }).join("");
}

async function loadRecipeNames() {
  const response = await fetch("recipes.json");
  const recipes = await response.json();
  recipeNames = Object.fromEntries(recipes.map((recipe) => [recipe.id, recipe.title]));
}

async function loadResults() {
  const currentToken = token();
  if (!currentToken) {
    els.adminStatus.textContent = "Enter the admin token to load results.";
    return;
  }

  els.adminStatus.textContent = "Loading results...";
  try {
    const response = await fetch("/api/admin/ratings", {
      headers: { authorization: `Bearer ${currentToken}` }
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Admin results could not load.");
    renderResults(data.recipes || []);
    els.adminStatus.textContent = `Loaded ${(data.recipes || []).length} recipe result${(data.recipes || []).length === 1 ? "" : "s"}.`;
  } catch (error) {
    els.adminStatus.textContent = error.message || "Admin results could not load.";
    showToast(els.adminStatus.textContent);
  }
}

els.tokenForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  setToken(els.adminToken.value.trim());
  await loadResults();
});

els.refreshResults.addEventListener("click", loadResults);

loadRecipeNames()
  .then(() => {
    els.adminToken.value = token();
    return loadResults();
  })
  .catch(() => {
    els.adminStatus.textContent = "Recipe names could not load.";
  });
