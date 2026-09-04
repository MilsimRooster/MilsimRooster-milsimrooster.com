const retiredHeaders = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-robots-tag": "noindex",
};

export function onRequest() {
  return new Response("This page has been retired.", {
    status: 410,
    headers: retiredHeaders,
  });
}
