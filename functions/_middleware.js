const JUNK_PATH_PATTERNS = [
  /^\/[^/?#]*\.php$/i,
  /^\/(?:wp-admin|wp-content|wp-includes)(?:\/|$)/i,
  /^\/cgi-bin(?:\/|$)/i,
  /^\/(?:xmlrpc|wp-login)\.php$/i
];

function isScannerProbe(pathname) {
  return JUNK_PATH_PATTERNS.some((pattern) => pattern.test(pathname));
}

export async function onRequest(context) {
  const { pathname } = new URL(context.request.url);

  if (isScannerProbe(pathname)) {
    return new Response("Gone", {
      status: 410,
      headers: {
        "Cache-Control": "public, max-age=3600",
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex, nofollow"
      }
    });
  }

  return context.next();
}

export { isScannerProbe };
