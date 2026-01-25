export async function onRequest() {
  const BASE_URL = "https://vivre-ensemble.lu";

  let registry;
  try {
    registry = await import("../assets/data/content-registry.json", {
      assert: { type: "json" }
    });
  } catch {
    return new Response("Missing content-registry.json", { status: 500 });
  }

  const today = new Date().toISOString().slice(0, 10);

  const urls = registry.default
    .filter(entry => !entry.publish_at || entry.publish_at <= today || entry.publish_at > today)
    .map(entry => {
      const loc = BASE_URL + entry.url;

      const lastmod =
        entry.publish_at && entry.publish_at > today
          ? `<lastmod>${entry.publish_at}</lastmod>`
          : "";

      return `
  <url>
    <loc>${loc}</loc>
    ${lastmod}
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml.trim(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-cache"
    }
  });
}
