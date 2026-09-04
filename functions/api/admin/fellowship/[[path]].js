const retiredHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0",
  "x-robots-tag": "noindex",
};

export function onRequest() {
  return new Response(JSON.stringify({ error: "This endpoint has been retired." }), {
    status: 410,
    headers: retiredHeaders,
  });
}
