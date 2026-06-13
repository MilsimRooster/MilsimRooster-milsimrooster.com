window.roosterAnalytics = {
  track(eventName, details = {}) {
    window.dispatchEvent(new CustomEvent("rooster:analytics", {
      detail: { eventName, details, timestamp: new Date().toISOString() },
    }));
  },
};

window.addEventListener("error", (event) => {
  window.roosterAnalytics.track("error", { message: event.message });
});

window.addEventListener("load", () => {
  const navigation = performance.getEntriesByType("navigation")[0];
  window.roosterAnalytics.track("performance", {
    loadTimeMs: navigation ? Math.round(navigation.loadEventEnd) : null,
  });
});
