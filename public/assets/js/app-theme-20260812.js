(() => {
  const STORAGE_KEY = "mr-color-theme";
  const root = document.documentElement;
  const systemPreference = window.matchMedia?.("(prefers-color-scheme: dark)");

  function appIdFromPath(pathname) {
    const parts = pathname.split("/").filter(Boolean);

    if (parts[0] === "apps") return parts[1] || "apps";
    if (parts[0] === "bible") return parts[1] ? `bible-${parts[1]}` : "bible";
    if (parts[0] === "tools") return "tools";
    return "site";
  }

  function readStoredTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored === "dark" || stored === "light" ? stored : null;
    } catch {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // The active page still changes theme when storage is unavailable.
    }
  }

  function updateThemeColor(theme) {
    let meta = document.querySelector('meta[name="theme-color"][data-mr-theme-color]');

    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      meta.dataset.mrThemeColor = "";
      document.head.append(meta);
    }

    meta.content = theme === "dark" ? "#0d1210" : "#f4f6f1";
  }

  function updateButton(theme) {
    const button = document.querySelector("[data-mr-theme-toggle]");
    if (!button) return;

    const dark = theme === "dark";
    const nextLabel = dark ? "Light mode" : "Dark mode";
    button.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()}`);
    button.setAttribute("aria-pressed", String(dark));
    button.title = `Switch to ${nextLabel.toLowerCase()}`;
    button.dataset.currentTheme = theme;
    button.querySelector("[data-mr-theme-icon]").textContent = dark ? "☀" : "☾";
    button.querySelector("[data-mr-theme-label]").textContent = nextLabel;
  }

  function applyTheme(theme, persist = false) {
    const safeTheme = theme === "dark" ? "dark" : "light";
    root.dataset.mrTheme = safeTheme;
    root.style.colorScheme = safeTheme;
    updateThemeColor(safeTheme);
    updateButton(safeTheme);

    if (persist) storeTheme(safeTheme);
  }

  function mountToggle() {
    if (document.querySelector("[data-mr-theme-toggle]")) return;

    const button = document.createElement("button");
    button.type = "button";
    button.className = "mr-theme-toggle";
    button.dataset.mrThemeToggle = "";
    button.innerHTML = `
      <span class="mr-theme-toggle__icon" data-mr-theme-icon aria-hidden="true"></span>
      <span class="mr-theme-toggle__label" data-mr-theme-label></span>
    `;
    button.addEventListener("click", () => {
      const nextTheme = root.dataset.mrTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme, true);
    });

    document.body.append(button);
    updateButton(root.dataset.mrTheme);
  }

  root.dataset.mrApp = appIdFromPath(location.pathname);
  applyTheme(readStoredTheme() || (systemPreference?.matches ? "dark" : "light"));

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountToggle, { once: true });
  } else {
    mountToggle();
  }

  systemPreference?.addEventListener?.("change", (event) => {
    if (!readStoredTheme()) applyTheme(event.matches ? "dark" : "light");
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) return;
    applyTheme(readStoredTheme() || (systemPreference?.matches ? "dark" : "light"));
  });
})();

