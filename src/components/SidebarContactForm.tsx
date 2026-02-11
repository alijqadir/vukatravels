import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitForm } from "@/lib/forms";

export default function SidebarContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitForm("sidebar_contact", {
        ...formData,
        pageUrl: window.location.href,
      });
      toast.success("Thank you! We'll get back to you shortly.");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send enquiry.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card rounded-xl shadow-premium-lg p-6 sticky top-24"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-display font-bold text-foreground mb-2">
          Get a Free Quote
        </h3>
        <p className="text-sm text-muted-foreground">
          Fill in the form and we'll get back to you
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <Textarea
            placeholder="How can we help you? *"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            required
            rows={4}
            className="bg-secondary border-border focus:border-gold resize-none"
          />
        </div>
        <Button
          type="submit"
          variant="hero"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Sending..."
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Enquiry
            </>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border space-y-3">
        <a
          href="tel:+442038768217"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors"
        >
          <Phone className="h-4 w-4 text-gold" />
          +44 2038768217
        </a>
        <a
          href="mailto:info@vukatravels.co.uk"
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors"
        >
          <Mail className="h-4 w-4 text-gold" />
          info@vukatravels.co.uk
        </a>
      </div>
    </motion.div>
  );
}
