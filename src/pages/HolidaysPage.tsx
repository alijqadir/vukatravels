import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, Users, Plane, Hotel, Compass, Camera, Sun, Mountain, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarFlightForm from "@/components/SidebarFlightForm";
import holidaysHero from "@/assets/holidays-hero.jpg";

const packageTypes = [
  {
    icon: Heart,
    title: "Honeymoon Packages",
    description: "Romantic getaways to exotic destinations. From Zanzibar beaches to Maldives luxury, we create unforgettable honeymoon experiences.",
  },
  {
    icon: Users,
    title: "Family Holidays",
    description: "Kid-friendly destinations with activities for all ages. Safari adventures, beach resorts, and cultural experiences.",
  },
  {
    icon: Mountain,
    title: "Adventure Travel",
    description: "Kilimanjaro climbs, safari expeditions, and trekking adventures. For the thrill-seekers and nature enthusiasts.",
  },
  {
    icon: Sun,
    title: "Beach Escapes",
    description: "Relaxing beach holidays in Zanzibar, Mauritius, Seychelles, Thailand, and the Maldives with luxury resorts.",
  },
  {
    icon: Camera,
    title: "Cultural Tours",
    description: "Immersive cultural experiences in India, Morocco, Egypt, and across East Africa. History, heritage, and local traditions.",
  },
  {
    icon: Compass,
    title: "Safari Packages",
    description: "Witness the Big Five in Kenya's Masai Mara, Tanzania's Serengeti, or Uganda's gorilla trekking experiences.",
  },
];

const whatsIncluded = [
  "Return flights with trusted airlines",
  "Airport transfers included",
  "Handpicked hotel accommodations",
  "Local tours and excursions",
  "Travel insurance options",
  "24/7 support during your trip",
  "Visa assistance where required",
  "Personalized itinerary planning",
];

const process = [
  {
    step: 1,
    title: "Tell Us Your Dreams",
    description: "Share your travel preferences, budget, dates, and wishlist with our expert consultants.",
  },
  {
    step: 2,
    title: "Receive Your Custom Quote",
    description: "We'll create a bespoke itinerary tailored to your exact requirements and budget.",
  },
  {
    step: 3,
    title: "Book & Prepare",
    description: "Secure your trip with flexible payment options. We handle all the details.",
  },
  {
    step: 4,
    title: "Enjoy Your Journey",
    description: "Relax and enjoy your trip knowing our team is just a call away if you need anything.",
  },
];

export default function HolidaysPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src={holidaysHero} alt="Holiday destinations" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-dark/95 via-navy-dark/80 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-medium mb-6">
                Holiday Packages
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6 leading-tight">
                Customized Holidays,{" "}
                <span className="text-gradient-gold">Unforgettable Memories</span>
              </h1>
              <p className="text-lg md:text-xl text-gold-light/90 mb-8 leading-relaxed">
                We don't believe in one-size-fits-all. Every holiday package we create is 
                tailored to your preferences, budget, and travel dreams.
              </p>
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Start Planning Your Trip</Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Package Types */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <span className="text-gold font-medium text-sm uppercase tracking-wider">Types of Packages</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
                  Holidays for Every Traveller
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Whether you're seeking romance, adventure, relaxation, or family fun, we craft 
                  perfect holiday experiences to match your style.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {packageTypes.map((pkg, index) => (
                  <motion.div
                    key={pkg.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-card rounded-xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 group"
                  >
                    <div className="h-14 w-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                      <pkg.icon className="h-7 w-7 text-gold" />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                      {pkg.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {pkg.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Sidebar Form */}
            <div className="lg:col-span-1">
              <SidebarFlightForm />
            </div>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-gold font-medium text-sm uppercase tracking-wider">Hassle-Free Travel</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-6">
                What's Included in Our Packages
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                We take care of every detail so you can focus on enjoying your holiday. 
                Our comprehensive packages include everything you need for a stress-free trip.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {whatsIncluded.map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle className="h-5 w-5 text-gold shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-navy rounded-xl p-10 text-center"
            >
              <div className="text-gold text-sm font-medium mb-2">Starting From</div>
              <div className="text-5xl font-display font-bold text-primary-foreground mb-2">
                £599<span className="text-lg font-normal text-gold-light/80">/person</span>
              </div>
              <p className="text-gold-light/80 text-sm mb-8">
                7 nights, flights & hotel included
              </p>
              <Button variant="hero" size="xl" className="w-full" asChild>
                <Link to="/contact">Get a Personalized Quote</Link>
              </Button>
              <p className="text-gold-light/60 text-xs mt-4">
                Prices vary based on destination, dates, and requirements
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Planning your dream holiday with us is simple. Here's how we make it happen.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center relative"
              >
                <div className="h-16 w-16 rounded-full bg-gold text-navy-dark flex items-center justify-center mx-auto mb-6 text-2xl font-display font-bold">
                  {item.step}
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gold/30" />
                )}
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-navy">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Let's Plan Your Perfect Holiday
            </h2>
            <p className="text-gold-light/90 max-w-2xl mx-auto mb-8 text-lg">
              Tell us your dream destination and we'll create a customized package that 
              fits your budget and exceeds your expectations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Request Free Quote</Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="tel:+442012345678">Speak to an Expert</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
