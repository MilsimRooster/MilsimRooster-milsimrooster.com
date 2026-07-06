(() => {
  if (window.__roosterReferrerAnalyticsLoaded) return;
  window.__roosterReferrerAnalyticsLoaded = true;

  const path = window.location.pathname || "/";
  const storageKey = `rooster-referrer-analytics:${path}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Session storage is optional; analytics should never affect the page.
  }

  const payload = JSON.stringify({
    path,
    referrer: document.referrer || ""
  });

  function send() {
    const endpoint = "/api/referrer";
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        if (navigator.sendBeacon(endpoint, blob)) return;
      }
    } catch {
      // Fall through to fetch.
    }

    fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      cache: "no-store",
      credentials: "same-origin",
      keepalive: true
    }).catch(() => {});
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", send, { once: true });
  } else {
    window.queueMicrotask(send);
  }
})();
