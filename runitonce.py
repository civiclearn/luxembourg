import json, re, pathlib
from datetime import date

SITEMAP = pathlib.Path("sitemap.xml")
ARTICLES_JSON = pathlib.Path("assets/data/articles-lu.json")
OUT = pathlib.Path("assets/data/content-registry.json")

base = "https://vivre-ensemble.lu"

# Load articles index (slug -> title)
articles = json.loads(ARTICLES_JSON.read_text(encoding="utf-8"))
slug_to_title = {a["slug"].strip("/"): a["title"].strip() for a in articles}

# Parse sitemap <url> blocks
xml = SITEMAP.read_text(encoding="utf-8", errors="replace")
url_blocks = re.findall(r"<url>(.*?)</url>", xml, flags=re.S)

entries = []
for blk in url_blocks:
    loc_m = re.search(r"<loc>(.*?)</loc>", blk)
    last_m = re.search(r"<lastmod>(.*?)</lastmod>", blk)
    if not loc_m:
        continue

    loc = loc_m.group(1).strip()
    lastmod = (last_m.group(1).strip() if last_m else None)

    # Convert absolute -> path
    path = re.sub(r"^https?://vivre-ensemble\.lu", "", loc).split("?")[0]
    path = "/" + path.strip("/") + ("/" if path.strip("/") else "")

    # Identify "root slug" (first segment)
    seg = path.strip("/").split("/")[0] if path.strip("/") else ""

    if seg in slug_to_title:
        entries.append({
            "url": path,
            "type": "article",
            "section": "articles",
            "title": slug_to_title[seg],
            # For already-published content: use sitemap lastmod as publish_at (good enough),
            # or fallback to a safe past date.
            "publish_at": lastmod or "2020-01-01"
        })
    else:
        # Keep non-article pages in registry too (so sitemap can be 100% registry-driven)
        # Title can be filled later if you want; sitemap doesn't need it.
        entries.append({
            "url": path,
            "type": "page",
            "section": "static",
            "title": "",
            "publish_at": lastmod or "2020-01-01"
        })

# Sort for stability
entries.sort(key=lambda x: (x["type"], x["url"]))

OUT.parent.mkdir(parents=True, exist_ok=True)
OUT.write_text(json.dumps(entries, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

print(f"Wrote {len(entries)} entries -> {OUT}")
print(f"Articles: {sum(1 for e in entries if e['type']=='article')}, Pages: {sum(1 for e in entries if e['type']=='page')}")
