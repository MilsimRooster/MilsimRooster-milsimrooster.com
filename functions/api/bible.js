const LICENSED_BIBLES = { niv: "78a9f6124f344018-01", nlt: "d6e14a625393b4da-01", nasb: "b8ee27bcd1cae43a-01" };

function json(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
}

export async function onRequestGet(context) {
  if (!context.env.API_BIBLE_KEY) return json({ error: "Bible service is not configured." }, 503);
  const url = new URL(context.request.url);
  const version = url.searchParams.get("version") || "";
  const bibleId = LICENSED_BIBLES[version];
  if (!bibleId) return json({ error: "Unsupported Bible version." }, 400);
  const action = url.searchParams.get("action") || "passage";
  let endpoint;
  if (action === "passage") {
    const passage = (url.searchParams.get("passage") || "").toUpperCase();
    if (!/^[1-3]?[A-Z]{2,3}\.\d{1,3}$/.test(passage)) return json({ error: "Invalid passage." }, 400);
    const params = new URLSearchParams({ "content-type": "html", "include-notes": "false", "include-titles": "true", "include-chapter-numbers": "false", "include-verse-numbers": "true", "include-verse-spans": "true" });
    endpoint = `https://rest.api.bible/v1/bibles/${bibleId}/passages/${passage}?${params}`;
  } else if (action === "search") {
    const query = (url.searchParams.get("query") || "").trim().slice(0, 120);
    if (!query) return json({ data: { verses: [], total: 0 } });
    endpoint = `https://rest.api.bible/v1/bibles/${bibleId}/search?${new URLSearchParams({ query, limit: "100", sort: "relevance" })}`;
  } else return json({ error: "Unsupported action." }, 400);
  const upstream = await fetch(endpoint, { headers: { "api-key": context.env.API_BIBLE_KEY } });
  const payload = await upstream.json().catch(() => ({ error: "Invalid response from Bible service." }));
  if (!upstream.ok) return json({ error: payload?.message || "Bible service request failed." }, upstream.status);
  return json(payload);
}
