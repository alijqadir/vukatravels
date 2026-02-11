import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import logo from "@/assets/vuka-logo.jpeg";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Flights", href: "/flights" },
  { name: "Holidays", href: "/holidays" },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact Us", href: "/contact" },
];

const destinations = [
  { name: "Kenya", href: "/flights" },
  { name: "Tanzania", href: "/flights" },
  { name: "Uganda", href: "/flights" },
  { name: "Dubai", href: "/flights" },
  { name: "India", href: "/flights" },
  { name: "Thailand", href: "/flights" },
];

export function Footer() {
  return (
    <footer className="bg-gradient-navy text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="VUKA Travels" className="h-16 w-16 object-contain rounded-full bg-background/10 p-1" />
              <div>
                <span className="text-xl font-display font-bold text-primary-foreground">VUKA</span>
                <span className="text-xl font-display font-bold text-gold"> Travels</span>
              </div>
            </Link>
            <p className="text-gold-light/80 text-sm leading-relaxed">
              Your trusted UK travel agency specializing in affordable flights to East Africa and Asia, 
              plus customized holiday packages tailored to your needs.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy-dark transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy-dark transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy-dark transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-navy-dark transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-gold-light/80 hover:text-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gold mb-6">Popular Destinations</h3>
            <ul className="space-y-3">
              {destinations.map((dest) => (
                <li key={dest.name}>
                  <Link
                    to={dest.href}
                    className="text-gold-light/80 hover:text-gold transition-colors text-sm"
                  >
                    {dest.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-display font-semibold text-gold mb-6">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-gold-light/80 text-sm">
                  3rd Floor Suite 207, Regent Street, London England, W1B3HH
                </span>
              </li>
              <li>
                <a href="tel:+442038768217" className="flex items-center gap-3 text-gold-light/80 hover:text-gold transition-colors text-sm">
                  <Phone className="h-5 w-5 text-gold" />
                  <span>+44 2038768217</span>
                </a>
              </li>
              <li>
                <a href="mailto:info@vukatravels.co.uk" className="flex items-center gap-3 text-gold-light/80 hover:text-gold transition-colors text-sm">
                  <Mail className="h-5 w-5 text-gold" />
                  <span>info@vukatravels.co.uk</span>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div className="text-gold-light/80 text-sm">
                  <p>Mon - Fri: 9:00 AM - 6:00 PM</p>
                  <p>Sat: 10:00 AM - 4:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gold/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gold-light/60 text-sm text-center md:text-left">
              © {new Date().getFullYear()} VUKA Travels. All rights reserved. | ATOL Protected
            </p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy" className="text-gold-light/60 hover:text-gold transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gold-light/60 hover:text-gold transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
