import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Send, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitForm } from "@/lib/forms";

export default function HomeContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm("home_contact", {
        ...formData,
        pageUrl: window.location.href,
      });
      toast.success("Thank you for your enquiry! We'll contact you shortly.");
      setFormData({ name: "", email: "", phone: "", destination: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-gold font-medium text-sm uppercase tracking-wider">
              Get In Touch
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mt-3 mb-6">
              Request a Free Quote
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Ready to plan your next adventure? Fill out the form and one of our 
              expert travel consultants will get back to you with the best options 
              for your trip.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Call Us
                  </h4>
                  <a 
                    href="tel:+442038768217" 
                    className="text-muted-foreground hover:text-gold transition-colors"
                  >
                    +44 2038768217
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Email Us
                  </h4>
                  <a 
                    href="mailto:info@vukatravels.co.uk" 
                    className="text-muted-foreground hover:text-gold transition-colors"
                  >
                    info@vukatravels.co.uk
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Visit Us
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    3rd Floor Suite 207, Regent Street, London England, W1B3HH
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5 text-gold" />
                </div>
                <div>
                  <h4 className="font-display font-semibold text-foreground mb-1">
                    Office Hours
                  </h4>
                  <p className="text-muted-foreground text-sm">
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat: 10:00 AM - 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card rounded-xl shadow-premium-lg p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Your Name *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-secondary border-border focus:border-gold"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email Address *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-secondary border-border focus:border-gold"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="bg-secondary border-border focus:border-gold"
                  />
                </div>
                <div>
                  <Input
                    placeholder="Destination (e.g., Kenya)"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="bg-secondary border-border focus:border-gold"
                  />
                </div>
              </div>
              <div>
                <Textarea
                  placeholder="Tell us about your travel plans... *"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="bg-secondary border-border focus:border-gold resize-none"
                />
              </div>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Get Your Free Quote
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                We'll respond within 24 hours. No spam, ever.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
