import Link from "next/link";
import { ChevronDown, Mail, Phone } from "lucide-react";

type SiteHeaderProps = {
  mainSiteUrl: string;
};

function mainSiteHref(mainSiteUrl: string, path: `/${string}`) {
  return `${mainSiteUrl.replace(/\/$/, "")}${path}`;
}

export default function SiteHeader({ mainSiteUrl }: SiteHeaderProps) {
  return (
    <header className="vuka-header">
      <div className="vuka-topbar">
        <div className="vuka-shell vuka-topbar-row">
          <div className="vuka-contact-links">
            <a href="tel:+442038768217">
              <Phone size={14} />
              <span>+44 2038768217</span>
            </a>
            <a href="mailto:info@vukatravels.co.uk">
              <Mail size={14} />
              <span>info@vukatravels.co.uk</span>
            </a>
          </div>
          <p className="vuka-topbar-note">
            <span>Your Trusted Travel Partner</span>
            <span className="vuka-divider">|</span>
            <span>ATOL Protected</span>
          </p>
        </div>
      </div>

      <nav className="vuka-nav" aria-label="Main navigation">
        <div className="vuka-shell vuka-nav-row">
          <a href={mainSiteHref(mainSiteUrl, "/")} className="vuka-brand">
            <img src="/vuka-logo.jpeg" alt="VUKA Travels" className="vuka-brand-logo" />
            <div className="vuka-brand-text">
              <span className="vuka-brand-main">VUKA</span>
              <span className="vuka-brand-accent"> Travels</span>
            </div>
          </a>

          <div className="vuka-menu">
            <a href={mainSiteHref(mainSiteUrl, "/")} className="vuka-menu-item">
              Home
            </a>
            <a href={mainSiteHref(mainSiteUrl, "/about")} className="vuka-menu-item">
              About Us
            </a>

            <div className="vuka-dropdown">
              <button type="button" className="vuka-menu-item vuka-menu-button" aria-label="Services menu">
                Services <ChevronDown size={14} />
              </button>
              <div className="vuka-dropdown-menu">
                <a href={mainSiteHref(mainSiteUrl, "/flights")} className="vuka-dropdown-item">
                  Flights
                </a>
                <a href={mainSiteHref(mainSiteUrl, "/holidays")} className="vuka-dropdown-item">
                  Holidays
                </a>
              </div>
            </div>

            <Link href="/blog" className="vuka-menu-item vuka-menu-item-active">
              Blog
            </Link>
            <a href={mainSiteHref(mainSiteUrl, "/faqs")} className="vuka-menu-item">
              FAQs
            </a>
            <a href={mainSiteHref(mainSiteUrl, "/contact")} className="vuka-menu-item">
              Contact Us
            </a>
          </div>

          <a href={mainSiteHref(mainSiteUrl, "/contact")} className="vuka-cta">
            Get a Quote
          </a>
        </div>
      </nav>
    </header>
  );
}
