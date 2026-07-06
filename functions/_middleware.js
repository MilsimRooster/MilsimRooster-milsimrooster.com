import { recordScannerProbe } from "./_lib/scanner-analytics.js";

const JUNK_PATH_PATTERNS = [
  /^\/.*\.(?:php|asp|aspx|cgi|jsp)$/i,
  /^\/(?:wp-admin|wp-content|wp-includes)(?:\/|$)/i,
  /^\/cgi-bin(?:\/|$)/i,
  /^\/(?:xmlrpc|wp-login)\.php$/i,
  /^\/(?:_profiler|backend\/web\/debug|admin\/debug|debug|server-status|server-info|system-info|phpinfo)(?:\/|$)/i,
  /^\/(?:\.env|\.git|\.svn|\.hg|\.DS_Store)(?:\/|$)/i,
  /^\/.*\.map$/i,
  /^\/(?:composer\.(?:json|lock)|package(?:-lock)?\.json|yarn\.lock|pnpm-lock\.yaml|vite\.config\.mjs|webpack\.config\.js|wrangler\.toml|schema\.sql)$/i,
  /^\/(?:backup|database|db|dump|site|www|public_html|wordpress|wp|milsimrooster)(?:[-_.]?[a-z0-9]*)?\.(?:7z|bak|gz|old|rar|sql|tar|tgz|zip)$/i,
  /^\/(?:actuator|solr|phpmyadmin|pma|mysql|dbadmin|adminer)(?:\/|$)/i
];

const REFERRER_ANALYTICS_SCRIPT = "/assets/js/referrer-analytics.js";

function isScannerProbe(pathname) {
  return JUNK_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

function isRetiredBibleAppPath(pathname) {
  return pathname === "/apps/bible-study" || pathname.startsWith("/apps/bible-study/");
}

function redirectToDigitalBible(request) {
  const url = new URL(request.url);
  url.pathname = "/bible/";
  url.search = "";

  return Response.redirect(url.toString(), 302);
}

async function recordScannerProbeSafely(context, pathname) {
  const write = recordScannerProbe(context, pathname).catch((error) => {
    console.error("scanner probe analytics failed", error);
  });

  if (typeof context.waitUntil === "function") {
    context.waitUntil(write);
    return;
  }

  await write;
}

function shouldInjectAnalytics(request, response) {
  if (request.method !== "GET") return false;
  if (response.status !== 200) return false;

  const contentType = response.headers.get("content-type") || "";
  return contentType.toLowerCase().includes("text/html");
}

class ReferrerAnalyticsInjector {
  element(element) {
    element.append(`<script defer src="${REFERRER_ANALYTICS_SCRIPT}"></script>`, {
      html: true
    });
  }
}

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);

  if (isScannerProbe(pathname)) {
    await recordScannerProbeSafely(context, pathname);
    return new Response("Gone", {
      status: 410,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex"
      }
    });
  }

  if (isRetiredBibleAppPath(pathname)) {
    return redirectToDigitalBible(context.request);
  }

  const response = await context.next();
  if (!shouldInjectAnalytics(context.request, response)) return response;

  return new HTMLRewriter()
    .on("head", new ReferrerAnalyticsInjector())
    .transform(response);
}

export { isScannerProbe, isRetiredBibleAppPath, shouldInjectAnalytics };
