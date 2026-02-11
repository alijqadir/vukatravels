import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plane, MapPin, Calendar, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarFlightForm from "@/components/SidebarFlightForm";
import destKenya from "@/assets/dest-kenya.jpg";
import destTanzania from "@/assets/dest-tanzania.jpg";
import destDubai from "@/assets/dest-dubai.jpg";
import destThailand from "@/assets/dest-thailand.jpg";
import destUganda from "@/assets/dest-uganda.jpg";
import destIndia from "@/assets/dest-india.jpg";
const eastAfricaFlights = [
  {
    destination: "Nairobi, Kenya",
    airport: "JKIA (NBO)",
    image: destKenya,
    priceFrom: 450,
    airlines: "Kenya Airways, British Airways, Ethiopian Airlines",
    duration: "8h 30m direct",
  },
  {
    destination: "Dar es Salaam, Tanzania",
    airport: "Julius Nyerere (DAR)",
    image: destTanzania,
    priceFrom: 520,
    airlines: "Ethiopian Airlines, Qatar Airways, Emirates",
    duration: "9h 45m via DOH",
  },
  {
    destination: "Entebbe, Uganda",
    airport: "Entebbe (EBB)",
    image: destUganda,
    priceFrom: 480,
    airlines: "Kenya Airways, Ethiopian Airlines, Emirates",
    duration: "10h via NBO/ADD",
  },
];

const asiaFlights = [
  {
    destination: "Dubai, UAE",
    airport: "Dubai Intl (DXB)",
    image: destDubai,
    priceFrom: 380,
    airlines: "Emirates, British Airways, Etihad",
    duration: "7h direct",
  },
  {
    destination: "Mumbai, India",
    airport: "Chhatrapati Shivaji (BOM)",
    image: destIndia,
    priceFrom: 350,
    airlines: "Air India, British Airways, Virgin Atlantic",
    duration: "9h direct",
  },
  {
    destination: "Bangkok, Thailand",
    airport: "Suvarnabhumi (BKK)",
    image: destThailand,
    priceFrom: 420,
    airlines: "Thai Airways, British Airways, Emirates",
    duration: "11h direct",
  },
];

const FlightCard = ({ flight, index }: { flight: typeof eastAfricaFlights[0]; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-card rounded-xl overflow-hidden shadow-premium hover:shadow-premium-lg transition-all duration-300 group"
  >
    <div className="aspect-[16/9] overflow-hidden relative">
      <img
        src={flight.image}
        alt={flight.destination}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-4 left-4 bg-gold text-navy-dark px-3 py-1 rounded-full text-sm font-semibold">
        From £{flight.priceFrom}
      </div>
    </div>
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-display font-bold text-foreground mb-1">
            {flight.destination}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Plane className="h-4 w-4" />
            {flight.airport}
          </p>
        </div>
      </div>
      <div className="space-y-2 mb-6">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Airlines: </span>
          {flight.airlines}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Flight time: </span>
          {flight.duration}
        </p>
      </div>
      <Button variant="outline" className="w-full" asChild>
        <Link to="/contact">
          Get Quote <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </motion.div>
);

export default function FlightsPage() {
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
              Flight Deals
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Affordable Flights Worldwide
            </h1>
            <p className="text-lg text-gold-light/90 leading-relaxed">
              Discover our competitive flight deals to East Africa and Asia. We work with 
              leading airlines to bring you the best fares for your journey.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-6 bg-gold">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-navy-dark">
            <Tag className="h-6 w-6" />
            <p className="text-center md:text-left font-medium">
              <span className="font-bold">Limited Time Offer!</span> Book before 30th January and save up to 15% on selected routes
            </p>
            <Button variant="navyGold" size="sm" asChild>
              <Link to="/contact">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* East Africa Flights */}
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
                className="mb-12"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gold" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                    East Africa Destinations
                  </h2>
                </div>
                <p className="text-muted-foreground max-w-2xl">
                  Connect with your roots or explore the breathtaking landscapes of East Africa. 
                  We specialize in flights to Kenya, Tanzania, Uganda, and beyond.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {eastAfricaFlights.map((flight, index) => (
                  <FlightCard key={flight.destination} flight={flight} index={index} />
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

      {/* Asia Flights */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-gold" />
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Asia Destinations
              </h2>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              From the vibrant cities of India to the exotic beaches of Thailand, discover 
              our range of Asian destinations with competitive fares.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {asiaFlights.map((flight, index) => (
              <FlightCard key={flight.destination} flight={flight} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Book With Us */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Why Book Your Flights With VUKA Travels?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Best Price Guarantee",
                description: "We search multiple airlines to find you the best fares available.",
              },
              {
                title: "Flexible Options",
                description: "One-way, return, and multi-city flights with flexible date options.",
              },
              {
                title: "ATOL Protection",
                description: "Your booking is protected under the ATOL scheme for peace of mind.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center p-6"
              >
                <div className="text-4xl font-display font-bold text-gold mb-2">
                  {index + 1}
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
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
              Can't Find Your Destination?
            </h2>
            <p className="text-gold-light/90 max-w-2xl mx-auto mb-8 text-lg">
              We book flights to destinations worldwide. Contact us with your requirements 
              and we'll find the best options for you.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
