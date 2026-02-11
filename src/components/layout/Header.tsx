import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import logo from "@/assets/vuka-logo.jpeg";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  {
    name: "Services",
    href: "#",
    children: [
      { name: "Flights", href: "/flights" },
      { name: "Holidays", href: "/holidays" },
    ],
  },
  { name: "FAQs", href: "/faqs" },
  { name: "Contact Us", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top bar */}
      <div className="bg-navy-dark">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+442038768217" className="flex items-center gap-2 text-gold-light hover:text-gold transition-colors">
                <Phone className="h-4 w-4" />
                <span>+44 2038768217</span>
              </a>
              <a href="mailto:info@vukatravels.co.uk" className="flex items-center gap-2 text-gold-light hover:text-gold transition-colors">
                <Mail className="h-4 w-4" />
                <span>info@vukatravels.co.uk</span>
              </a>
            </div>
            <div className="text-gold-light text-xs md:text-sm">
              <span className="hidden sm:inline">Your Trusted Travel Partner | </span>
              <span>ATOL Protected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-background/95 backdrop-blur-md shadow-premium">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="VUKA Travels" className="h-14 w-14 object-contain rounded-full" />
              <div className="hidden sm:block">
                <span className="text-xl font-display font-bold text-navy">VUKA</span>
                <span className="text-xl font-display font-bold text-gold"> Travels</span>
              </div>
            </Link>

            {/* Navigation links - always visible */}
            <div className="flex items-center gap-1">
              {navigation.map((item) => (
                <div key={item.name} className="relative group">
                  {item.children ? (
                    <button
                      className={`flex items-center gap-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                        item.children.some(child => isActive(child.href))
                          ? "text-gold"
                          : "text-foreground hover:text-gold"
                      }`}
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <span className="hidden sm:inline">{item.name}</span>
                      <span className="sm:hidden">{item.name === "Services" ? "Services" : item.name}</span>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                        isActive(item.href)
                          ? "text-gold"
                          : "text-foreground hover:text-gold"
                      }`}
                    >
                      <span className="hidden sm:inline">{item.name}</span>
                      <span className="sm:hidden">
                        {item.name === "Home" ? "Home" : 
                         item.name === "About Us" ? "About" : 
                         item.name === "Contact Us" ? "Contact" : 
                         item.name}
                      </span>
                    </Link>
                  )}

                  {/* Dropdown */}
                  {item.children && (
                    <div
                      className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                      onMouseEnter={() => setServicesOpen(true)}
                      onMouseLeave={() => setServicesOpen(false)}
                    >
                      <div className="bg-card rounded-lg shadow-premium-lg border overflow-hidden min-w-[140px] sm:min-w-[180px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className={`block px-4 py-3 text-xs sm:text-sm font-medium transition-colors ${
                              isActive(child.href)
                                ? "bg-gold/10 text-gold"
                                : "text-foreground hover:bg-secondary hover:text-gold"
                            }`}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden sm:block">
              <Button variant="hero" size="lg" asChild>
                <Link to="/contact">Get a Quote</Link>
              </Button>
            </div>
          </div>
        </div>

      </nav>
    </header>
  );
}
