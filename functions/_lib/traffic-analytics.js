const REFERRER_FAMILIES = [
  {
    family: "facebook",
    hosts: ["facebook.com", "facebook.net", "fb.watch", "fb.com"]
  },
  {
    family: "x",
    hosts: ["x.com", "twitter.com", "t.co"]
  },
  {
    family: "instagram",
    hosts: ["instagram.com"]
  },
  {
    family: "search",
    hosts: ["google.com", "bing.com", "duckduckgo.com", "yahoo.com"]
  }
];

const LANDING_GROUPS = [
  ["/apps/apostles/new-testament-trail", "/apps/apostles/new-testament-trail"],
  ["/apps/bible-study", "/apps/bible-study"],
  ["/apps/bug-strike", "/apps/bug-strike"],
  ["/apps/apostles", "/apps/apostles"],
  ["/apps/fps-visualizer", "/apps/fps-visualizer"],
  ["/apps/recipes", "/apps/recipes"],
  ["/apps/quotetron", "/apps/quotetron"],
  ["/apps/how-southern-are-you", "/apps/how-southern-are-you"],
  ["/apps/southern-translator", "/apps/southern-translator"],
  ["/apps/gallery", "/apps/gallery"],
  ["/about", "/about"]
];

function normalizeHost(host) {
  const value = String(host || "").trim().toLowerCase();
  if (!value) return "";
  const withoutPort = value.replace(/:\d+$/, "");
  const withoutWww = withoutPort.replace(/^www\./, "");
  if (!/^[a-z0-9.-]{1,180}$/.test(withoutWww)) return "other";
  return withoutWww;
}

function hostMatches(host, baseHost) {
  return host === baseHost || host.endsWith(`.${baseHost}`);
}

export function classifyReferrer(referrer, requestHost = "") {
  const normalizedRequestHost = normalizeHost(requestHost);
  const raw = String(referrer || "").trim();
  if (!raw) {
    return { family: "direct", host: "direct" };
  }

  let host = "";
  try {
    host = normalizeHost(new URL(raw).hostname);
  } catch {
    host = normalizeHost(raw);
  }

  if (!host) return { family: "direct", host: "direct" };
  if (host === "other") return { family: "other", host: "other" };
  if (normalizedRequestHost && hostMatches(host, normalizedRequestHost)) {
    return { family: "internal", host: "internal" };
  }

  for (const source of REFERRER_FAMILIES) {
    if (source.hosts.some((baseHost) => hostMatches(host, baseHost))) {
      return { family: source.family, host };
    }
  }

  return { family: "other", host };
}

export function normalizeLandingPage(pathname) {
  const rawPath = String(pathname || "/").trim();
  let path = "/";
  try {
    path = new URL(rawPath, "https://milsimrooster.com").pathname;
  } catch {
    path = "/";
  }

  const normalized = path.replace(/\/index\.html$/i, "/").replace(/\.html$/i, "");
  if (normalized === "/" || normalized === "") return "/";

  const group = LANDING_GROUPS.find(([prefix]) => (
    normalized === prefix || normalized.startsWith(`${prefix}/`)
  ));
  return group ? group[1] : "other";
}

export function clampAnalyticsDays(value) {
  const days = Number.parseInt(value, 10);
  if (!Number.isInteger(days) || days < 1) return 7;
  return Math.min(days, 30);
}
