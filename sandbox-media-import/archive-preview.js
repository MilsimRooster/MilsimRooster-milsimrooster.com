const state = {
  data: null,
  query: "",
  category: "All",
};

const grid = document.querySelector("#archive-grid");
const filters = document.querySelector("#archive-filters");
const search = document.querySelector("#archive-search");
const count = document.querySelector("#archive-count");

function matchesQuery(item) {
  const haystack = [item.title, item.description, item.category, item.collection, ...item.tags].join(" ").toLowerCase();
  return haystack.includes(state.query.trim().toLowerCase());
}

function filterArchive() {
  return state.data.items.filter((item) => {
    const categoryMatch = state.category === "All" || item.category === state.category;
    return categoryMatch && matchesQuery(item);
  });
}

function renderFilters() {
  const options = [{ name: "All", count: state.data.items.length }, ...state.data.categories];
  filters.innerHTML = options.map((option) => {
    const active = option.name === state.category ? " is-active" : "";
    return '<button class="' + active + '" type="button" data-category="' + option.name + '">' + option.name + ' <small>' + option.count + '</small></button>';
  }).join("");
}

function renderArchive() {
  const items = filterArchive();
  count.value = items.length + " Assets";
  grid.innerHTML = items.map((item) => {
    const tags = item.tags.slice(0, 4).map((tag) => '<b>' + tag + '</b>').join("");
    return [
      '<article class="archive-card">',
      '<img src="' + item.src + '" alt="' + item.title + '" loading="lazy" />',
      '<div class="archive-card-body">',
      '<span>' + item.collection.replaceAll("_", " ") + '</span>',
      '<h2>' + item.title + '</h2>',
      '<p>' + item.description + '</p>',
      '<div class="archive-tags">' + tags + '</div>',
      '</div>',
      '</article>',
    ].join("");
  }).join("");
}

filters.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-category]");
  if (!button) return;
  state.category = button.dataset.category;
  renderFilters();
  renderArchive();
});

search.addEventListener("input", () => {
  state.query = search.value;
  renderArchive();
});

state.data = await fetch("data/gallery-archive.json").then((response) => response.json());
renderFilters();
renderArchive();

export { filterArchive, renderArchive };
