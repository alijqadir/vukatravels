import Link from "next/link";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";

type SiteFooterProps = {
  mainSiteUrl: string;
};

function mainSiteHref(mainSiteUrl: string, path: `/${string}`) {
  return `${mainSiteUrl.replace(/\/$/, "")}${path}`;
}

export default function SiteFooter({ mainSiteUrl }: SiteFooterProps) {
  return (
    <footer className="vuka-footer">
      <div className="vuka-shell vuka-footer-content">
        <div className="vuka-footer-grid">
          <div className="vuka-footer-col">
            <a href={mainSiteHref(mainSiteUrl, "/")} className="vuka-footer-brand">
              <img src="/vuka-logo.jpeg" alt="VUKA Travels" className="vuka-footer-logo" />
              <div>
                <span className="vuka-footer-brand-main">VUKA</span>
                <span className="vuka-footer-brand-accent"> Travels</span>
              </div>
            </a>
            <p className="vuka-footer-text">
              Your trusted UK travel agency specializing in affordable flights to East Africa and Asia,
              plus customized holiday packages tailored to your needs.
            </p>
            <div className="vuka-socials">
              <a href="#" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="vuka-footer-col">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/")}>Home</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/about")}>About Us</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>Flights</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/holidays")}>Holidays</a>
              </li>
              <li>
                <Link href="/blog">Blog</Link>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/faqs")}>FAQs</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/contact")}>Contact Us</a>
              </li>
            </ul>
          </div>

          <div className="vuka-footer-col">
            <h3>Popular Destinations</h3>
            <ul>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>Kenya</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>Tanzania</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>Uganda</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>Dubai</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>India</a>
              </li>
              <li>
                <a href={mainSiteHref(mainSiteUrl, "/flights")}>Thailand</a>
              </li>
            </ul>
          </div>

          <div className="vuka-footer-col">
            <h3>Contact Us</h3>
            <ul className="vuka-contact-list">
              <li>
                <MapPin size={18} />
                <span>3rd Floor Suite 207, Regent Street, London England, W1B3HH</span>
              </li>
              <li>
                <Phone size={18} />
                <a href="tel:+442038768217">+44 2038768217</a>
              </li>
              <li>
                <Mail size={18} />
                <a href="mailto:info@vukatravels.co.uk">info@vukatravels.co.uk</a>
              </li>
              <li>
                <Clock size={18} />
                <span>
                  Mon - Fri: 9:00 AM - 6:00 PM
                  <br />
                  Sat: 10:00 AM - 4:00 PM
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="vuka-footer-bottom">
          <p>© {new Date().getFullYear()} VUKA Travels. All rights reserved. | ATOL Protected</p>
          <div>
            <a href={mainSiteHref(mainSiteUrl, "/privacy")}>Privacy Policy</a>
            <a href={mainSiteHref(mainSiteUrl, "/terms")}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
