from __future__ import annotations

import os
from datetime import datetime, timezone
from pathlib import Path


def _iter_index_paths(dist: Path):
    # Include index.html but exclude assets-like dirs
    for p in dist.rglob("index.html"):
        rel = p.relative_to(dist)
        # skip Vite assets folder
        if rel.parts and rel.parts[0].startswith("assets"):
            continue
        yield p


def _url_from_rel(base_url: str, rel: Path) -> str:
    # dist/index.html -> /
    # dist/foo/index.html -> /foo/
    if rel.as_posix() == "index.html":
        path = "/"
    else:
        # drop trailing index.html
        path = "/" + "/".join(rel.parts[:-1]) + "/"
    return base_url.rstrip("/") + path


def main() -> int:
    dist = Path("dist")
    if not dist.exists():
        print("dist/ not found. Did build run?")
        return 2

    base_url = os.environ.get("BASE_URL", "https://vukatravels.co.uk/")

    urls = sorted({_url_from_rel(base_url, p.relative_to(dist)) for p in _iter_index_paths(dist)})

    now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S+00:00")

    xml_lines = [
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ]
    for u in urls:
        xml_lines.append("  <url>")
        xml_lines.append(f"    <loc>{u}</loc>")
        xml_lines.append(f"    <lastmod>{now}</lastmod>")
        xml_lines.append("  </url>")
    xml_lines.append("</urlset>")

    (dist / "sitemap.xml").write_text("\n".join(xml_lines) + "\n", encoding="utf-8")
    print(f"Wrote dist/sitemap.xml with {len(urls)} URLs")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
