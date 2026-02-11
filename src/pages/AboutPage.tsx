import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Award, Users, Heart, Globe, CheckCircle, Target, Eye, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarFlightForm from "@/components/SidebarFlightForm";
import aboutTeam from "@/assets/about-team.jpg";

const stats = [
  { value: "15+", label: "Years Experience" },
  { value: "50K+", label: "Happy Customers" },
  { value: "100+", label: "Destinations" },
  { value: "24/7", label: "Customer Support" },
];

const values = [
  {
    icon: Heart,
    title: "Customer First",
    description: "We put our customers at the heart of everything we do, ensuring personalized service and attention to detail.",
  },
  {
    icon: Shield,
    title: "Trust & Reliability",
    description: "As an ATOL protected agency, we provide secure bookings and peace of mind for all your travel needs.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We strive for excellence in every interaction, from initial enquiry to post-travel support.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "Our extensive network of airline partners enables us to offer the best routes and competitive prices worldwide.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-navy">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-gold/20 text-gold text-sm font-medium mb-6">
              About Us
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Your Journey, Our Passion
            </h1>
            <p className="text-lg text-gold-light/90 leading-relaxed">
              Founded with a vision to make travel accessible and memorable, VUKA Travels has been 
              connecting UK travellers with destinations across Africa and Asia for over 15 years.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-background -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-xl shadow-premium-lg p-8"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-display font-bold text-gold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Story with Sidebar Form */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-gold font-medium text-sm uppercase tracking-wider">Our Story</span>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-6">
                  Building Bridges Across Continents
                </h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed mb-8">
                  <p>
                    VUKA Travels is the brand name of Air Saffar and Tours LTD, which is an enrolled 
                    organisation under UK law (Company Registration No. 14794951).
                  </p>
                  <p>
                    VUKA Travels was established with a simple mission: to provide UK travellers with 
                    exceptional service and competitive prices for their journeys to East Africa, Asia, 
                    and beyond.
                  </p>
                  <p>
                    "VUKA" means "wake up" or "arise" in Swahili, symbolizing our commitment to helping 
                    you rise above ordinary travel experiences and discover the extraordinary. Our roots 
                    in East African travel give us unique insights and connections that benefit our customers.
                  </p>
                  <p>
                    Today, we're proud to have served over 50,000 happy customers, each with their own 
                    unique travel stories. Whether you're visiting family, exploring new cultures, or 
                    embarking on a business trip, we're here to make your journey seamless.
                  </p>
                </div>

                <div className="relative">
                  <img
                    src={aboutTeam}
                    alt="VUKA Travels Team"
                    className="rounded-xl shadow-premium-lg"
                  />
                  <div className="absolute -bottom-6 -right-6 bg-gold rounded-lg p-6 shadow-gold hidden md:block">
                    <div className="text-3xl font-display font-bold text-navy-dark">15+</div>
                    <div className="text-navy-dark/80 text-sm font-medium">Years of Excellence</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Sidebar Form */}
            <div className="lg:col-span-1">
              <SidebarFlightForm />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-card rounded-xl p-10 shadow-premium"
            >
              <div className="h-14 w-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To provide exceptional travel services that connect people with their loved ones and 
                dream destinations, while delivering outstanding value and personalized care at every 
                step of the journey.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card rounded-xl p-10 shadow-premium"
            >
              <div className="h-14 w-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-gold" />
              </div>
              <h3 className="text-2xl font-display font-bold text-foreground mb-4">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                To be the UK's most trusted travel agency for African and Asian destinations, known for 
                our expertise, reliability, and unwavering commitment to customer satisfaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">What Drives Us</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-4">
              Our Core Values
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card rounded-xl p-8 shadow-premium hover:shadow-premium-lg transition-all duration-300 text-center"
              >
                <div className="h-14 w-14 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-7 w-7 text-gold" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {value.description}
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
              Ready to Plan Your Next Adventure?
            </h2>
            <p className="text-gold-light/90 max-w-2xl mx-auto mb-8 text-lg">
              Get in touch with our expert travel consultants today and let us help you create 
              memories that last a lifetime.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Contact Us Today</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
