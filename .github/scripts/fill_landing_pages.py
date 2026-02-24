import csv
import re
import unicodedata
from pathlib import Path

# Runs in CI from repo root. Mutates files under public/**.
PUBLIC_DIR = Path("public")
KEYWORDS_CSV = PUBLIC_DIR / "landing-pages-keywords.csv"

AUTO_START = "<!-- AUTO_SEO_START -->"
AUTO_END = "<!-- AUTO_SEO_END -->"


def _word_count(text: str) -> int:
    return len([w for w in re.split(r"\s+", text.strip()) if w])


def build_blocks(keyword: str, location: str | None = None) -> tuple[str, str, str]:
    kw = keyword.strip().lower()
    loc = (location or "").strip()

    title = f"{keyword.title()} | Live Quotes & Route Tips | VUKA Travels"
    meta = (
        f"{keyword.title()} with sample prices, booking tips, baggage guidance, and quick quote support from VUKA Travels. "
        "Compare direct vs 1-stop options and request a live fare."
    )

    h2 = f"{keyword.title()}" if not loc else f"{keyword.title()} ({loc})"

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
    sections.append(f"<h3>A detailed guide to booking {kw}</h3>")
    sections.append("<p>Getting a low fare is great — but on flights, the rules and the routing are what decide whether it’s actually good value.</p>")
    sections.append(f"<p>This page is a practical guide for travellers looking for <strong>{kw}</strong>. Use it to compare options quickly and avoid the common mistakes that make flights more expensive or more stressful.</p>")

    def h4(t: str) -> str:
        return f"<h4>{t}</h4>"

    def p(t: str) -> str:
        return f"<p>{t}</p>"

    def ul(items: list[str]) -> str:
        inner = "\n".join([f"  <li>{i}</li>" for i in items])
        return f"<ul>\n{inner}\n</ul>"

    sections.append(h4("1) Start with your flexibility (it changes everything)"))
    sections.append(p("Fares move based on demand, day of week, school holidays and how close you are to departure."))
    sections.append(ul([
        "If you can travel <strong>mid‑week</strong>, you often get better pricing.",
        "If your dates are fixed, the best value often comes from choosing the right <strong>flight times</strong> and <strong>connection length</strong>, not only the airline.",
        "If you can share a <strong>date range</strong> instead of a single date, you’ll usually have more options.",
    ]))

    sections.append(h4("2) Decide your priority in one sentence"))
    sections.append(p("Pick one main objective and use it to filter options:"))
    sections.append(ul([
        "Cheapest overall (even if it’s 1 stop).",
        "Fastest journey (minimise layovers).",
        "Baggage included and a changeable ticket.",
    ]))

    sections.append(h4("3) Direct vs one‑stop: how to compare properly"))
    sections.append(p("A one‑stop ticket can be cheaper, but check:"))
    sections.append(ul([
        "Total journey time (including layover)",
        "Connection airport reliability",
        "Minimum connection time (tight connections are risky)",
        "Whether the ticket is one booking (protected connection) or separate tickets",
    ]))
    sections.append(p("In many cases, a slightly higher fare is worth it if it reduces missed‑connection risk."))

    sections.append(h4("4) Baggage rules: the fastest way people accidentally overpay"))
    sections.append(p("Before paying, confirm:"))
    sections.append(ul([
        "Cabin baggage size/weight",
        "Checked baggage allowance (23kg vs 20kg matters)",
        "Extra-bag pricing (sometimes it’s cheaper to buy a fare that includes baggage)",
    ]))

    sections.append(h4("5) Best times to book (a realistic approach)"))
    sections.append(p("There’s no perfect rule, but generally:"))
    sections.append(ul([
        "For popular routes, 6–10 weeks ahead is a good window",
        "For peak seasons/holidays, you may need to book earlier",
        "Last-minute deals exist, but they’re less reliable for family/group travel",
    ]))

    sections.append(h4("6) Airport choice can beat airline choice"))
    sections.append(p("If you’re flexible between nearby airports, you can sometimes save more than by switching airlines."))

    sections.append(h4("7) What to ask before you confirm"))
    sections.append(p("A good quote includes clarity on:"))
    sections.append(ul([
        "Exact flight times and routing",
        "Baggage allowance",
        "Whether seats can be selected",
        "Change/refund conditions",
        "Name rules (avoid mistakes on passport spelling)",
    ]))

    sections.append(h4("8) Families, groups and special assistance"))
    sections.append(p("If you’re travelling with family or in a group, plan these early:"))
    sections.append(ul([
        "Seat requests / sitting together",
        "Meals (including special meals)",
        "Wheelchair/assistance requests",
        "Extra time for connections",
    ]))

    sections.append(h4("9) A simple checklist to get your live fare fast"))
    sections.append(p("To send you the best options quickly, share:"))
    sections.append(ul([
        "Your preferred week (or exact dates)",
        "Passengers (adults/children/infants)",
        "Baggage needs (cabin only vs checked)",
        "Departure airport preference (if any)",
        "Any constraint (direct only, airline preference, max layover)",
    ]))

    sections.append(h4("10) Next steps"))
    sections.append(p(f"If you want a live quote for <strong>{kw}</strong>, contact VUKA with your dates and baggage requirement. We’ll compare sensible options and explain the fare rules before you book."))

    # Pad out to a long-form target (similar intent to UmrahGuider 2000w sections)
    extra_sections = [
        ("Extra tips: how to avoid hidden costs",
         "The cheapest headline fare can become expensive once you add baggage, seats, and booking fees. Compare the total cost, not only the base fare."),
        ("Extra tips: connection airports and layovers",
         "A longer layover can sometimes be better value than a tight connection — especially if you’re travelling with children, elders, or lots of baggage."),
        ("Extra tips: name and passport details",
         "Airlines can be strict on passenger name formats. Always match passport spelling and double-check passport validity before ticketing."),
        ("Extra tips: when travel insurance matters",
         "If you’re booking non-refundable fares, insurance can be a smart hedge. Check what it covers before relying on it."),
        ("Extra tips: peak season planning",
         "During holidays, prices rise and the best flight times sell out early. Booking earlier often saves money and makes the trip easier."),
    ]

    combined_text = re.sub(r"<[^>]+>", " ", footer_html + " " + " ".join(sections))
    i = 0
    while _word_count(combined_text) < 2000 and i < len(extra_sections):
        t, body = extra_sections[i]
        sections.append(h4(t))
        sections.append(p(body))
        combined_text = re.sub(r"<[^>]+>", " ", footer_html + " " + " ".join(sections))
        i += 1

    long_html = "\n".join(sections)

    faqs = [
        (f"Do you offer help with {kw}?", f"Yes. We can check live availability and share options for {kw}, including baggage-inclusive fares and sensible connections."),
        ("Are the prices on this page guaranteed?", "No — sample fares move based on demand and seat availability. We confirm the live fare before you book."),
        ("Can you include baggage in the quote?", "Yes. Tell us cabin-only vs checked baggage (and how many bags) and we’ll quote the right fare class."),
        ("Can you help with group bookings?", "Yes. We can handle family and group tickets and advise on seating, assistance requests, and connection planning."),
        ("How far in advance should I book?", "A practical window is often 6–10 weeks, but peak seasons can require earlier booking. If you share dates, we’ll advise."),
    ]

    faq_html = ["<div class=\"seo-faq\">", "<h3>Frequently asked questions</h3>"]
    for q, a in faqs:
        faq_html.append("<details class=\"seo-faq__item\">")
        faq_html.append(f"<summary>{q}</summary>")
        faq_html.append(f"<p>{a}</p>")
        faq_html.append("</details>")
    faq_html.append("</div>")

    block = "\n".join([
        AUTO_START,
        "<section class=\"seo-section\" aria-label=\"SEO content\">",
        footer_html,
        long_html,
        "\n".join(faq_html),
        "</section>",
        AUTO_END,
    ])

    return title, meta, block


def _replace_meta(html: str, title: str, meta_desc: str) -> str:
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
        raise ValueError("No <footer> tag found to inject before")
    return html[: m.start()] + "\n\n" + block + "\n\n" + html[m.start() :]


def url_to_public_path(url: str) -> Path:
    path = re.sub(r"^https?://[^/]+", "", url).strip()
    if not path.endswith("/"):
        path += "/"
    slug = path.strip("/")
    return PUBLIC_DIR / slug / "index.html"


def main() -> int:
    if not KEYWORDS_CSV.exists():
        print(f"Missing {KEYWORDS_CSV}")
        return 2

    updated = 0
    with KEYWORDS_CSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            if (r.get("Template Type") or "").strip().lower() != "primary":
                continue
            url = (r.get("Landing URL") or "").strip()
            kw = (r.get("Keyword") or "").strip()
            loc = (r.get("Location") or "").strip()
            if not url or not kw:
                continue

            fp = url_to_public_path(url)
            if not fp.exists():
                continue

            html = fp.read_text(encoding="utf-8")
            title, meta, block = build_blocks(kw, loc)
            html2 = _replace_meta(html, title, meta)
            html2 = inject_before_footer(html2, block)
            if html2 != html:
                fp.write_text(html2, encoding="utf-8")
                updated += 1

    print(f"Filled SEO blocks for {updated} landing pages")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
