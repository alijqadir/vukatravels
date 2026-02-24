import json
import os
import re
import unicodedata
from datetime import date
from pathlib import Path

import gspread
from google.oauth2.service_account import Credentials

# Same master sheet used by UmrahGuider automation
MASTER_URL = os.environ.get(
    "MASTER_URL",
    "https://docs.google.com/spreadsheets/d/1cmMZ-KzIlOOA79Pl9jhGNOAQ0j0bZ3TcuY2p2h4TrbE/edit",
)

SITE_KEY = os.environ.get("VUKA_SITE_KEY", "vukatravels.co.uk")
SITE_BASE = os.environ.get("VUKA_SITE_BASE", "https://vukatravels.co.uk")

REPO_ROOT = Path(".").resolve()
PUBLIC_DIR = REPO_ROOT / "public"
KEYWORDS_CSV = PUBLIC_DIR / "landing-pages-keywords.csv"
SITEMAP_XML = PUBLIC_DIR / "sitemap.xml"

AUTO_START = "<!-- AUTO_SEO_START -->"
AUTO_END = "<!-- AUTO_SEO_END -->"

TEMPLATE_PRIMARY_CHEAP = "cheap-flights-from-london-to-accra"
TEMPLATE_PRIMARY_UK = "flights-to-accra-from-uk"
TEMPLATE_ALIAS = "flights-from-london-to-accra"


def slugify(s: str) -> str:
    s = unicodedata.normalize("NFKD", s)
    s = s.encode("ascii", "ignore").decode("ascii")
    s = s.lower().strip()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"[\s_-]+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s


def _wc(text: str) -> int:
    return len([w for w in re.split(r"\s+", text.strip()) if w])


def build_seo_block(keyword: str, location: str = "") -> tuple[str, str, str]:
    kw = keyword.strip().lower()
    title = f"{keyword.title()} | Live Quotes & Route Tips | VUKA Travels"
    meta = (
        f"{keyword.title()} with booking tips, baggage guidance, and quick quote support from VUKA Travels. "
        "Compare direct vs 1-stop options and request a live fare."
    )

    h2 = keyword.title() if not location else f"{keyword.title()} ({location})"

    footer_html = "\n".join([
        f"<h2>{h2} — practical booking guidance</h2>",
        f"<p>If you’re searching for <strong>{kw}</strong>, you probably want two things: a good price <em>and</em> a booking that doesn’t turn into stress (baggage surprises, awkward connections, or confusing fare rules).</p>",
        "<p>VUKA helps you shortlist realistic options based on your dates, baggage needs, and flexibility — and we’ll explain the trade-offs clearly before you pay.</p>",
        "<p><strong>What we help with:</strong></p>",
        "<ul>",
        "  <li>Direct vs one‑stop comparisons (total journey time matters)</li>",
        "  <li>Baggage-inclusive fare checks (cabin vs checked)</li>",
        "  <li>Family and group bookings (seat, meal and assistance requests)</li>",
        "  <li>Refund/change rules explained in plain English</li>",
        "</ul>",
        "<p>Share your travel week, passenger count, and baggage requirement and we’ll send a quick shortlist.</p>",
    ])

    sections: list[str] = []
    def h4(t: str) -> str:
        return f"<h4>{t}</h4>"

    def p(t: str) -> str:
        return f"<p>{t}</p>"

    def ul(items: list[str]) -> str:
        inner = "\n".join([f"  <li>{i}</li>" for i in items])
        return f"<ul>\n{inner}\n</ul>"

    sections.append(f"<h3>A detailed guide to booking {kw}</h3>")
    sections.append(p("Getting a low fare is great — but on flights, the rules and the routing are what decide whether it’s actually good value."))
    sections.append(p(f"This page is a practical guide for travellers looking for <strong>{kw}</strong>. Use it to compare options quickly and avoid common mistakes."))

    sections.append(h4("1) Start with your flexibility (it changes everything)"))
    sections.append(p("Fares move based on demand, day of week, school holidays and how close you are to departure."))
    sections.append(ul([
        "If you can travel <strong>mid‑week</strong>, you often get better pricing.",
        "If your dates are fixed, the best value often comes from choosing the right <strong>flight times</strong> and <strong>connection length</strong>, not only the airline.",
        "If you can share a <strong>date range</strong> instead of a single date, you’ll usually have more options.",
    ]))

    sections.append(h4("2) Direct vs one‑stop: compare properly"))
    sections.append(p("A one‑stop ticket can be cheaper, but check total journey time, connection reliability, and ticket protection."))

    sections.append(h4("3) Baggage rules (avoid accidental costs)"))
    sections.append(ul([
        "Cabin baggage size/weight",
        "Checked baggage allowance",
        "Extra-bag pricing vs baggage-included fares",
    ]))

    sections.append(h4("4) Checklist for a fast live quote"))
    sections.append(ul([
        "Dates (or a date range)",
        "Passengers (adults/children/infants)",
        "Baggage needs (cabin only vs checked)",
        "Departure airport preference (if any)",
        "Any constraint (direct only, max layover)",
    ]))

    sections.append(h4("5) Next steps"))
    sections.append(p(f"If you want a live quote for <strong>{kw}</strong>, contact VUKA with your dates and baggage requirement and we’ll shortlist sensible options."))

    # pad to ~2000 words
    extra = [
        ("Extra tips: hidden costs", "Compare total cost (baggage, seats, fees), not only the base fare."),
        ("Extra tips: peak seasons", "During holidays, prices rise and the best timings sell out early — booking earlier usually helps."),
        ("Extra tips: name checks", "Match passenger names to passports to avoid reissue fees."),
        ("Extra tips: insurance", "If you book non-refundable fares, insurance can be a smart hedge depending on your situation."),
        ("Extra tips: layovers", "A slightly longer layover is often safer than a tight connection."),
    ]

    combined_text = re.sub(r"<[^>]+>", " ", footer_html + " " + " ".join(sections))
    i = 0
    while _wc(combined_text) < 2000 and i < len(extra):
        t, body = extra[i]
        sections.append(h4(t))
        sections.append(p(body))
        combined_text = re.sub(r"<[^>]+>", " ", footer_html + " " + " ".join(sections))
        i += 1

    faq = [
        (f"Do you help with {kw}?", f"Yes. We can check live availability and share options for {kw}."),
        ("Are the sample prices guaranteed?", "No — fares move based on demand and seat availability. We confirm the live fare before you book."),
        ("Can you include baggage in the quote?", "Yes. Tell us cabin-only vs checked baggage (and how many bags) and we’ll quote correctly."),
        ("Can you help with group bookings?", "Yes — we can support group tickets and advise on seating and connection planning."),
        ("How far in advance should I book?", "Often 6–10 weeks is a practical window, but peak seasons may require earlier booking."),
    ]

    faq_html = ["<div class=\"seo-faq\">", "<h3>Frequently asked questions</h3>"]
    for q, a in faq:
        faq_html.append("<details class=\"seo-faq__item\">")
        faq_html.append(f"<summary>{q}</summary>")
        faq_html.append(f"<p>{a}</p>")
        faq_html.append("</details>")
    faq_html.append("</div>")

    # Maintainable SEO box: FAQs on top + scrollable content section
    block = "\n".join([
        AUTO_START,
        "<section class=\"seo-box\" aria-label=\"SEO content\">",
        "  <div class=\"seo-box__header\">",
        "    <p class=\"seo-box__title\">Route guide & FAQs</p>",
        "    <p class=\"seo-box__hint\">Expandable FAQs + scrollable guide</p>",
        "  </div>",
        "  " + "\n  ".join(faq_html),
        "  <div class=\"seo-box__scroll\">",
        footer_html,
        "\n".join(sections),
        "  </div>",
        "</section>",
        AUTO_END,
    ])

    return title, meta, block


def replace_meta(html: str, title: str, meta_desc: str) -> str:
    html = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", html, flags=re.DOTALL)
    if re.search(r"<meta\s+name=\"description\"", html):
        html = re.sub(
            r"<meta\s+name=\"description\"\s+content=\".*?\"\s*/?>",
            f"<meta name=\"description\" content=\"{meta_desc}\" />",
            html,
            flags=re.DOTALL,
        )
    else:
        html = re.sub(r"</title>", f"</title>\n  <meta name=\"description\" content=\"{meta_desc}\" />", html)

    html = re.sub(
        r"<meta\s+property=\"og:description\"\s+content=\".*?\"\s*/?>",
        f"<meta property=\"og:description\" content=\"{meta_desc}\" />",
        html,
        flags=re.DOTALL,
    )
    html = re.sub(
        r"<meta\s+name=\"twitter:description\"\s+content=\".*?\"\s*/?>",
        f"<meta name=\"twitter:description\" content=\"{meta_desc}\" />",
        html,
        flags=re.DOTALL,
    )
    return html


def inject_before_footer(html: str, block: str) -> str:
    if AUTO_START in html and AUTO_END in html:
        return re.sub(re.escape(AUTO_START) + r".*?" + re.escape(AUTO_END), block, html, flags=re.DOTALL)
    m = re.search(r"\n\s*<footer\b", html)
    if not m:
        raise ValueError("No <footer> found")
    return html[: m.start()] + "\n\n" + block + "\n\n" + html[m.start() :]


def ensure_keywords_csv_header():
    if KEYWORDS_CSV.exists():
        return
    KEYWORDS_CSV.write_text(
        "Location,Keyword,Landing URL,Template Type,Status\n",
        encoding="utf-8",
    )


def append_keyword_row(location: str, keyword: str, url: str, template_type: str, status: str = "Created"):
    ensure_keywords_csv_header()
    line = f"{location},{keyword},{url},{template_type},{status}\n"
    existing = KEYWORDS_CSV.read_text(encoding="utf-8")
    if url in existing:
        return
    with KEYWORDS_CSV.open("a", encoding="utf-8") as f:
        f.write(line)


def url_to_slug(url: str) -> str:
    path = re.sub(r"^https?://[^/]+", "", url).strip()
    return path.strip("/")


def clone_template(template_slug: str, dest_slug: str) -> str:
    src = PUBLIC_DIR / template_slug / "index.html"
    if not src.exists():
        raise FileNotFoundError(f"Template not found: {src}")
    dest_dir = PUBLIC_DIR / dest_slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "index.html"
    dest.write_text(src.read_text(encoding="utf-8"), encoding="utf-8")
    return str(dest)


def build_redirect_alias(dest_slug: str, canonical_slug: str, title: str) -> str:
    # Create a minimal redirect file (noindex, refresh). This is safer than trying to replace airport codes.
    dest_dir = PUBLIC_DIR / dest_slug
    dest_dir.mkdir(parents=True, exist_ok=True)
    dest = dest_dir / "index.html"
    canonical = f"/{canonical_slug.strip('/')}/"
    html = f"""<!doctype html>
<html lang=\"en-GB\">
<head>
  <meta charset=\"utf-8\" />
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />
  <title>Redirecting to {title}</title>
  <meta name=\"robots\" content=\"noindex,follow\" />
  <link rel=\"canonical\" href=\"{SITE_BASE.rstrip('/')}{canonical}\" />
  <meta http-equiv=\"refresh\" content=\"0;url={canonical}\" />
  <script>window.location.replace('{canonical}');</script>
</head>
<body>
  <p>Redirecting…</p>
  <p>If you are not redirected, open <a href=\"{canonical}\">{canonical}</a>.</p>
</body>
</html>
"""
    dest.write_text(html, encoding="utf-8")
    return str(dest)


def generate_sitemap():
    # Simple sitemap: core pages + any public/*/index.html directories.
    today = date.today().isoformat()

    core = [
        ("/", "1.0", "weekly"),
        ("/about", "0.8", "monthly"),
        ("/flights", "0.9", "weekly"),
        ("/holidays", "0.9", "weekly"),
        ("/faqs", "0.7", "monthly"),
        ("/contact", "0.8", "monthly"),
    ]

    urls = []
    for d in PUBLIC_DIR.iterdir():
        if d.is_dir() and (d / "index.html").exists():
            slug = d.name.strip("/")
            urls.append(f"{SITE_BASE.rstrip('/')}/{slug}/")

    urls = sorted(set(urls))

    lines = [
        "<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
        "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">",
    ]

    for path, prio, freq in core:
        loc = SITE_BASE.rstrip("/") + path
        lines += [
            "  <url>",
            f"    <loc>{loc}</loc>",
            f"    <lastmod>{today}</lastmod>",
            f"    <changefreq>{freq}</changefreq>",
            f"    <priority>{prio}</priority>",
            "  </url>",
        ]

    for u in urls:
        lines += [
            "  <url>",
            f"    <loc>{u}</loc>",
            f"    <lastmod>{today}</lastmod>",
            "    <changefreq>weekly</changefreq>",
            "    <priority>0.8</priority>",
            "  </url>",
        ]

    lines.append("</urlset>")
    SITEMAP_XML.write_text("\n".join(lines) + "\n", encoding="utf-8")


def parse_notes(notes: str) -> dict:
    out = {}
    for part in (notes or "").split(";"):
        part = part.strip()
        if not part or "=" not in part:
            continue
        k, v = part.split("=", 1)
        out[k.strip()] = v.strip()
    return out


def main():
    sa_json = os.environ.get("SHEETS_SA_JSON")
    if not sa_json:
        raise SystemExit("Missing SHEETS_SA_JSON (service account JSON string)")

    info = json.loads(sa_json)
    scopes = [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/drive",
    ]
    creds = Credentials.from_service_account_info(info, scopes=scopes)
    gc = gspread.authorize(creds)

    ws = gc.open_by_url(MASTER_URL).sheet1
    header = ws.row_values(1)
    values = ws.get_all_values()
    idx = {name: i for i, name in enumerate(header)}

    required = ["site", "primary_keyword", "slug", "status", "content_type", "target_url", "notes"]
    for r in required:
        if r not in idx:
            raise SystemExit(f"Master sheet missing column: {r}")

    changed = 0

    for row_num, row in enumerate(values[1:], start=2):
        site = (row[idx["site"]] if len(row) > idx["site"] else "").strip()
        if site != SITE_KEY:
            continue

        status = (row[idx["status"]] if len(row) > idx["status"] else "").strip()
        if status.lower() != "approved":
            continue

        keyword = (row[idx["primary_keyword"]] if len(row) > idx["primary_keyword"] else "").strip()
        if not keyword:
            continue

        content_type = (row[idx["content_type"]] if len(row) > idx["content_type"] else "").strip().lower()
        notes = (row[idx["notes"]] if len(row) > idx["notes"] else "").strip()
        meta = parse_notes(notes)

        slug = (row[idx["slug"]] if len(row) > idx["slug"] else "").strip()
        if not slug:
            slug = slugify(keyword)
            ws.update_cell(row_num, idx["slug"] + 1, slug)
            changed += 1

        # target_url
        target_url = (row[idx["target_url"]] if len(row) > idx["target_url"] else "").strip()
        if not target_url:
            target_url = f"{SITE_BASE.rstrip('/')}/{slug}/"
            ws.update_cell(row_num, idx["target_url"] + 1, target_url)
            changed += 1

        # Decide template type
        template_type = meta.get("template")
        if not template_type:
            if "flights from london to" in keyword.lower():
                template_type = "alias"
            elif "flights to" in keyword.lower() and "from uk" in keyword.lower():
                template_type = "uk"
            else:
                template_type = "cheap"

        if template_type == "alias":
            # Redirect aliases should point to the corresponding 'cheap' page if it exists
            # Default mapping: replace leading phrase.
            canonical_slug = slug.replace("flights-from-london-to-", "cheap-flights-from-london-to-")
            build_redirect_alias(slug, canonical_slug, keyword.title())
            append_keyword_row(meta.get("location", ""), keyword, target_url, "Redirect Alias")
            continue

        # Ensure file exists by cloning template
        if not (PUBLIC_DIR / slug / "index.html").exists():
            tpl = TEMPLATE_PRIMARY_UK if template_type == "uk" else TEMPLATE_PRIMARY_CHEAP
            clone_template(tpl, slug)
            changed += 1

        # Fill SEO blocks
        fp = PUBLIC_DIR / slug / "index.html"
        html = fp.read_text(encoding="utf-8")
        title, meta_desc, block = build_seo_block(keyword, meta.get("location", ""))
        html2 = replace_meta(html, title, meta_desc)
        html2 = inject_before_footer(html2, block)
        if html2 != html:
            fp.write_text(html2, encoding="utf-8")
            changed += 1

        append_keyword_row(meta.get("location", ""), keyword, target_url, "Primary")

    generate_sitemap()

    print("OK", {"changed": changed})


if __name__ == "__main__":
    main()
