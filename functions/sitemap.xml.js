export async function onRequest({ request }) {
  const BASE_URL = "https://vivre-ensemble.lu";
  let urls = [];

  // 1) Content registry
  try {
    const registryUrl = new URL("/assets/data/content-registry.json", request.url);
    const res = await fetch(registryUrl);

    if (res.ok) {
      const data = await res.json();
      const now = new Date();

      urls.push(
        ...data
          .filter(item => {
            if (!item.url) return false;
            if (!item.publish_at) return true;
            return new Date(item.publish_at) <= now;
          })
          .map(item => item.url)
      );
    }
  } catch (_) {}

  // de-duplicate
  urls = [...new Set(urls)];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(path => `
  <url>
    <loc>${BASE_URL}${path}</loc>
  </url>`).join("")}
</urlset>`;

  return new Response(body.trim(), {
    headers: { "Content-Type": "application/xml; charset=utf-8" }
  });
}
