"""One-off migration: add machine-readable data-* attributes to fare cards.

Why:
- Makes it easy to swap static/LLM sample prices for real GDS prices later
  without scraping brittle visible text.

What it does:
- For each public/*/index.html
- Finds <article class="fare-item"> blocks missing data-origin
- Tries to infer origin/dest IATA from the outbound fare line (e.g. "LHR to ACC")
- Extracts numeric GBP price from the <strong>GBP ...</strong>
- Adds:
    data-origin, data-dest, data-currency, data-route-key, data-fare-tier, data-price-gbp
  and adds data-price on the <strong> element (for easy JS targeting later).

It does NOT change visible copy (other than adding data-price attr).

Run:
  python scripts/migrate_fare_data_attrs.py
"""

from __future__ import annotations

import re
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = REPO_ROOT / "public"


def _extract_iata(article_html: str) -> tuple[str | None, str | None]:
    # Look for "Outbound:" line first, then any "XXX to YYY".
    m = re.search(r"Outbound:</span>\s*([A-Z]{3})\s+to\s+([A-Z]{3})\b", article_html)
    if not m:
        m = re.search(r"\b([A-Z]{3})\s+to\s+([A-Z]{3})\b", article_html)
    if not m:
        return None, None
    return m.group(1), m.group(2)


def _extract_price_gbp(article_html: str) -> int | None:
    # Prefer first <strong>GBP ...</strong> inside the fare-price block.
    m = re.search(r"<div class=\"fare-price\">[\s\S]*?<strong([^>]*)>\s*GBP\s*([0-9,]+)", article_html)
    if not m:
        m = re.search(r"<strong([^>]*)>\s*GBP\s*([0-9,]+)", article_html)
    if not m:
        return None
    digits = re.sub(r"[^0-9]", "", m.group(2))
    try:
        return int(digits)
    except Exception:
        return None


def _ensure_data_price_on_strong(article_html: str) -> str:
    def repl(m: re.Match) -> str:
        attrs = m.group(1) or ""
        if "data-price" in attrs:
            return m.group(0)
        # insert a simple marker attr
        return f"<strong data-price{attrs}>"

    return re.sub(r"<strong(\s[^>]*)?>", repl, article_html, count=1)


def migrate_file(fp: Path) -> bool:
    html = fp.read_text(encoding="utf-8")
    changed = False

    # Only touch pages that have fare-item cards.
    if "class=\"fare-item\"" not in html:
        return False

    tiers = ["low", "mid", "high", "other"]

    def replace_article(match: re.Match) -> str:
        nonlocal changed
        article = match.group(0)

        # Skip if already migrated.
        if "data-origin=" in article and "data-dest=" in article:
            return article

        origin, dest = _extract_iata(article)
        price = _extract_price_gbp(article)

        # If we can't infer route, don't touch.
        if not origin or not dest:
            return article

        route_key = f"{origin}-{dest}"

        # Choose a tier based on order on the page (we'll count articles in the file).
        # We'll fill this after we know which number this article is.
        return "__FARE_ARTICLE_PLACEHOLDER__" + article + "__END_FAKE__"  # temp

    # First, mark candidates (so we can tier by occurrence).
    marked = re.sub(r"<article class=\"fare-item\"[\s\S]*?</article>", replace_article, html)
    if marked == html:
        return False

    # Now, walk placeholders and rewrite with tiers.
    parts = marked.split("__FARE_ARTICLE_PLACEHOLDER__")
    out = [parts[0]]
    occ = 0

    for chunk in parts[1:]:
        # chunk starts with the original article html
        article, rest = chunk.split("__END_FAKE__", 1)

        # If it already had data attrs, it wouldn't have been placeholdered.
        origin, dest = _extract_iata(article)
        price = _extract_price_gbp(article)

        if origin and dest:
            tier = tiers[occ] if occ < 3 else tiers[-1]
            attrs = [
                f"data-origin=\"{origin}\"",
                f"data-dest=\"{dest}\"",
                "data-currency=\"GBP\"",
                f"data-route-key=\"{origin}-{dest}\"",
                f"data-fare-tier=\"{tier}\"",
            ]
            if isinstance(price, int):
                attrs.append(f"data-price-gbp=\"{price}\"")

            # Inject attrs into the opening article tag.
            article2 = re.sub(
                r"<article class=\"fare-item\"\s*>",
                "<article class=\"fare-item\" " + " ".join(attrs) + ">",
                article,
                count=1,
            )

            # Ensure strong has data-price marker for easy DOM targeting.
            article2 = _ensure_data_price_on_strong(article2)

            if article2 != article:
                changed = True

            article = article2
            occ += 1

        out.append(article)
        out.append(rest)

    html2 = "".join(out)

    if changed and html2 != html:
        fp.write_text(html2, encoding="utf-8")
        return True
    return False


def main() -> int:
    updated = 0
    scanned = 0

    for d in PUBLIC_DIR.iterdir():
        if not d.is_dir():
            continue
        fp = d / "index.html"
        if not fp.exists():
            continue
        scanned += 1
        if migrate_file(fp):
            updated += 1

    print("OK", {"scanned": scanned, "updated": updated, "public": str(PUBLIC_DIR)})
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
