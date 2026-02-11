import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import SidebarFlightForm from "@/components/SidebarFlightForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const faqCategories = [
  {
    title: "Booking & Payments",
    faqs: [
      {
        question: "How do I book a flight or holiday package?",
        answer: "You can book by calling us on +44 20 1234 5678, emailing info@vukatravels.co.uk, or filling out our contact form. Our expert travel consultants will guide you through the process and find the best options for your needs.",
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit and debit cards (Visa, Mastercard, American Express), bank transfers, and in some cases, payment plans for larger bookings. All payments are processed securely.",
      },
      {
        question: "Can I pay for my booking in installments?",
        answer: "Yes, we offer flexible payment plans for holiday packages. You can typically pay a deposit to secure your booking and pay the remaining balance in installments before your departure date. Contact us for details.",
      },
      {
        question: "Is my booking protected?",
        answer: "Yes! As an ATOL protected travel agent, your money is protected if the travel company fails. This gives you peace of mind when booking flights and holidays through VUKA Travels.",
      },
    ],
  },
  {
    title: "Flights",
    faqs: [
      {
        question: "How far in advance should I book my flight?",
        answer: "For the best prices, we recommend booking 2-3 months in advance for East African destinations and 3-6 months for peak season travel. However, we can also find competitive last-minute deals depending on availability.",
      },
      {
        question: "Can you book multi-city or stopover flights?",
        answer: "Absolutely! We specialize in complex itineraries including multi-city routes, stopovers, and open-jaw tickets. These can often offer better value and more flexibility for your trip.",
      },
      {
        question: "What airlines do you work with?",
        answer: "We work with all major airlines including Kenya Airways, Ethiopian Airlines, Emirates, Qatar Airways, British Airways, Turkish Airlines, and many more to find you the best routes and prices.",
      },
      {
        question: "Can I add extra baggage to my booking?",
        answer: "Yes, we can add extra baggage allowance to most bookings at competitive rates. Let us know your requirements when booking or contact us afterwards to add luggage.",
      },
    ],
  },
  {
    title: "Holiday Packages",
    faqs: [
      {
        question: "Are your holiday packages customizable?",
        answer: "Yes! All our holiday packages are fully customizable. We create bespoke itineraries based on your preferences, budget, travel dates, and interests. Every trip is tailored just for you.",
      },
      {
        question: "What's typically included in a holiday package?",
        answer: "Our packages typically include return flights, airport transfers, accommodation, and selected tours or activities. Travel insurance, meals, and visa assistance can be added. We'll discuss all inclusions during the booking process.",
      },
      {
        question: "Do you offer group travel packages?",
        answer: "Yes, we arrange group travel for families, wedding parties, corporate groups, and friends. Group bookings often come with special rates and we can customize the itinerary to suit everyone.",
      },
      {
        question: "Can you help with visa requirements?",
        answer: "We provide visa guidance and assistance for all destinations we serve. We'll advise on requirements and can help with the application process for most countries.",
      },
    ],
  },
  {
    title: "Changes & Cancellations",
    faqs: [
      {
        question: "What is your cancellation policy?",
        answer: "Cancellation policies vary depending on the airline and hotel involved. We'll clearly explain the terms before you book. Many of our bookings include flexible options for a small additional fee.",
      },
      {
        question: "Can I change my travel dates after booking?",
        answer: "In most cases, yes. Changes are subject to availability and may incur fees depending on the airline or hotel policy. Contact us as early as possible if you need to make changes.",
      },
      {
        question: "What happens if my flight is cancelled?",
        answer: "If an airline cancels your flight, we'll work to rebook you on the next available flight at no extra cost. If you prefer, we'll arrange a full refund. Our team is here to help 24/7.",
      },
      {
        question: "Do you offer travel insurance?",
        answer: "Yes, we strongly recommend travel insurance and can arrange comprehensive coverage through our trusted partners. Insurance can protect you against cancellations, medical emergencies, and lost luggage.",
      },
    ],
  },
];

export default function FAQsPage() {
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
              FAQs
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gold-light/90 leading-relaxed">
              Find answers to common questions about our services, bookings, and travel policies. 
              Can't find what you're looking for? Contact us anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {faqCategories.map((category, categoryIndex) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                  className="mb-12"
                >
                  <h2 className="text-2xl font-display font-bold text-foreground mb-6 flex items-center gap-3">
                    <span className="h-8 w-1 bg-gold rounded-full" />
                    {category.title}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => (
                      <AccordionItem
                        key={faqIndex}
                        value={`${category.title}-${faqIndex}`}
                        className="bg-card rounded-xl px-6 border shadow-sm data-[state=open]:shadow-premium transition-shadow"
                      >
                        <AccordionTrigger className="text-left py-5 hover:no-underline">
                          <span className="font-display font-semibold text-foreground pr-4">
                            {faq.question}
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
              ))}
            </div>

            {/* Sidebar Form */}
            <div className="lg:col-span-1">
              <SidebarFlightForm />
            </div>
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-2xl p-12 md:p-16 text-center shadow-premium-lg max-w-3xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Still Have Questions?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Our friendly team is here to help. Get in touch and we'll respond as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="tel:+442012345678">Call +44 20 1234 5678</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
