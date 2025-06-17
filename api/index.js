export const config = { runtime: "edge" };

export default async function handler(req) {
  const url = new URL(req.url);

  /* ───── fetch_links (action=fetch_links) ───── */
  if (url.searchParams.get("action") === "fetch_links") {
    if (!globalThis.linksCache) {
      globalThis.linksCache = JSON.parse(process.env.LINKS_JSON || "[]");
    }
    const category = (url.searchParams.get("category") ?? "").toLowerCase();
    const subtype  = (url.searchParams.get("subtype")  ?? "").toLowerCase();

    const results = globalThis.linksCache.filter(
      r =>
        r.category.toLowerCase() === category &&
        r.subtype.toLowerCase()  === subtype
    );

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  /* ───── current-sprint endpoint (/current-sprint) ───── */
  if (url.pathname.endsWith("/current-sprint")) {
    if (!globalThis.sprintTable) {
      globalThis.sprintTable = JSON.parse(process.env.SPRINT_CALENDAR_JSON || "[]");
    }
    const today = new Date().toISOString().slice(0, 10);         // YYYY-MM-DD
    const row   = globalThis.sprintTable.find(
      r => r.start <= today && today <= r.end
    ) || null;

    return new Response(JSON.stringify(row), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  }

  /* ───── current-datetime endpoint (/current-datetime) ───── */
  if (url.pathname.endsWith("/current-datetime")) {
    return new Response(
      JSON.stringify({ datetime: new Date().toISOString() }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  }

  /* ───── fallback logger (default branch) ───── */
  const q   = url.searchParams.get("question") ?? "No question";
  const src = url.searchParams.get("source")   ?? "GPT";

  fetch(
    "https://script.google.com/macros/s/AKfycbxB_Z2wB969QeTJ-LfO9kAjA7NLYzQ3beA1qp52SwcvqlRifnNAGRRNcDEFj5IB_SA/exec"
      + `?question=${encodeURIComponent(q)}`
      + `&source=${encodeURIComponent(src)}`
  ).catch(() => {});

  return new Response("ok", { status: 200 });
}
