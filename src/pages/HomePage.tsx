import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, Globe, Headphones, Shield, Award, Users, CheckCircle, Star, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeContactForm from "@/components/HomeContactForm";
import HeroFlightSearchForm from "@/components/HeroFlightSearchForm";
import heroImage from "@/assets/hero-travel.jpg";
import destKenya from "@/assets/dest-kenya.jpg";
import destTanzania from "@/assets/dest-tanzania.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destThailand from "@/assets/dest-thailand.jpg";
import destUganda from "@/assets/dest-uganda.jpg";
import destIndia from "@/assets/dest-india.jpg";

const services = [
  {
    icon: Plane,
    title: "Flight Bookings",
    description: "Competitive fares on flights to East Africa, Asia, and worldwide destinations with trusted airlines.",
  },
  {
    icon: Globe,
    title: "Holiday Packages",
    description: "Customized travel packages tailored to your preferences, from beach getaways to cultural adventures.",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Round-the-clock customer service to assist you before, during, and after your journey.",
  },
  {
    icon: Shield,
    title: "ATOL Protected",
    description: "Book with confidence knowing your travel is protected under the ATOL scheme.",
  },
];

const destinations = [
  { name: "Nairobi, Kenya", image: destKenya, price: "From £450" },
  { name: "Zanzibar, Tanzania", image: destTanzania, price: "From £520" },
  { name: "Dubai, UAE", image: destDubai, price: "From £380" },
  { name: "Bangkok, Thailand", image: destThailand, price: "From £420" },
  { name: "Kampala, Uganda", image: destUganda, price: "From £480" },
  { name: "Mumbai, India", image: destIndia, price: "From £350" },
];

const whyChooseUs = [
  { icon: Award, title: "15+ Years Experience", description: "Trusted expertise in UK travel industry" },
  { icon: Users, title: "50,000+ Happy Customers", description: "Delivering memorable journeys worldwide" },
  { icon: CheckCircle, title: "Best Price Guarantee", description: "Competitive rates on all bookings" },
  { icon: Star, title: "Personalized Service", description: "Tailored travel solutions for every need" },
];

const testimonials = [
  {
    name: "Sarah Thompson",
    location: "London",
    text: "VUKA Travels made our family trip to Kenya absolutely seamless. Their attention to detail and competitive prices made all the difference!",
    rating: 5,
  },
  {
    name: "James Patel",
    location: "Birmingham",
    text: "I've been booking my flights to India through VUKA for years. Their customer service is exceptional and prices are always the best.",
    rating: 5,
  },
  {
    name: "Maria Okello",
    location: "Manchester",
    text: "Booked our honeymoon package to Zanzibar. Everything was perfect from the flights to the resort. Highly recommend!",
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section with Flight Search Form */}
      <section className="relative min-h-screen flex flex-col">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Travel destinations" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-dark/90 via-navy-dark/80 to-navy-dark/95" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 flex-1 flex flex-col justify-center py-8">
          {/* Hero Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-medium mb-4">
              Your Trusted UK Travel Partner
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4 leading-tight">
              Discover the World with{" "}
              <span className="text-gradient-gold">VUKA Travels</span>
            </h1>
            <p className="text-base md:text-lg text-gold-light/90 max-w-2xl mx-auto">
              Experience exceptional travel services with competitive prices on flights to 
              East Africa, Asia, and beyond.
            </p>
          </motion.div>

          {/* Flight Search Form */}
          <HeroFlightSearchForm />
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">What We Offer</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
              Our Services
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From flight bookings to complete holiday packages, we provide comprehensive travel solutions 
              tailored to your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 group"
              >
                <div className="h-14 w-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
                  <service.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">Top Destinations</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
              Popular Flight Deals
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our most sought-after destinations with exclusive deals and competitive fares.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl shadow-premium hover:shadow-premium-lg transition-all duration-300"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-2 text-gold-light mb-2">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-medium">{dest.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-display font-bold text-primary-foreground">{dest.price}</span>
                    <Button variant="hero" size="sm" asChild>
                      <Link to="/flights">Book Now</Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/flights">View All Destinations</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-navy text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">Why VUKA Travels</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mt-3 mb-4">
              Your Trusted Travel Partner
            </h2>
            <p className="text-gold-light/80 max-w-2xl mx-auto">
              With over 15 years of experience in the UK travel industry, we've helped thousands 
              of travellers create unforgettable memories.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="h-16 w-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <item.icon className="h-8 w-8 text-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-gold-light/70 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cream">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
              What Our Customers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-premium"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-gold fill-gold" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-display font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <HomeContactForm />

      {/* CTA Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-hero rounded-2xl p-12 md:p-16 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gold-light/90 max-w-2xl mx-auto mb-8 text-lg">
              Contact us today for a personalized quote and let us help you plan your perfect getaway.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Get a Free Quote</Link>
              </Button>
              <Button variant="heroOutline" size="xl" asChild>
                <a href="tel:+442012345678">Call Us Now</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
