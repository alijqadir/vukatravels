import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plane, 
  PlaneLanding, 
  Calendar, 
  Users, 
  User, 
  Phone, 
  Mail, 
  Search,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AirportCombobox } from "@/components/AirportCombobox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";
import { submitForm } from "@/lib/forms";

export default function HeroFlightSearchForm() {
  const [tripType, setTripType] = useState<"return" | "oneway">("return");
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    passengers: "1",
    cabinClass: "economy",
    fullName: "",
    phone: "",
    email: "",
  });
  const [departureDate, setDepartureDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [isVerified, setIsVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isVerified) {
      toast.error("Please verify that you're not a robot");
      return;
    }

    if (!formData.from || !formData.to || !departureDate || !formData.fullName || !formData.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitForm("hero_flight_search", {
        ...formData,
        name: formData.fullName,
        tripType,
        departureDate: departureDate?.toISOString() || "",
        returnDate: returnDate?.toISOString() || "",
        pageUrl: window.location.href,
      });
      toast.success("Thank you! Our team will contact you with the best flight options.");
      setFormData({
        from: "",
        to: "",
        passengers: "1",
        cabinClass: "economy",
        fullName: "",
        phone: "",
        email: "",
      });
      setDepartureDate(undefined);
      setReturnDate(undefined);
      setIsVerified(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-premium-lg p-6 md:p-8 w-full max-w-5xl mx-auto"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Trip Type Toggle */}
        <div className="flex gap-0 w-fit">
          <button
            type="button"
            onClick={() => setTripType("return")}
            className={cn(
              "px-6 py-2.5 rounded-l-full text-sm font-semibold transition-all",
              tripType === "return"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            Return
          </button>
          <button
            type="button"
            onClick={() => setTripType("oneway")}
            className={cn(
              "px-6 py-2.5 rounded-r-full text-sm font-semibold transition-all",
              tripType === "oneway"
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            One Way
          </button>
        </div>

        {/* Row 1: From / To */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AirportCombobox
            value={formData.from}
            onValueChange={(value) => setFormData({ ...formData, from: value })}
            placeholder="From (Departure Airport)"
            icon={<Plane className="h-5 w-5 text-primary shrink-0" />}
            triggerClassName="h-14 text-base"
            className="w-[350px]"
          />
          
          <AirportCombobox
            value={formData.to}
            onValueChange={(value) => setFormData({ ...formData, to: value })}
            placeholder="To (Destination Airport)"
            icon={<PlaneLanding className="h-5 w-5 text-primary shrink-0" />}
            triggerClassName="h-14 text-base"
            className="w-[350px]"
          />
        </div>

        {/* Row 2: Dates / Passengers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary z-10" />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "pl-12 h-14 w-full justify-start text-base font-normal bg-background border-border",
                    !departureDate && !returnDate && "text-muted-foreground"
                  )}
                >
                  {departureDate ? (
                    tripType === "return" && returnDate ? (
                      `${format(departureDate, "dd-MM-yyyy")} - ${format(returnDate, "dd-MM-yyyy")}`
                    ) : (
                      format(departureDate, "dd-MM-yyyy")
                    )
                  ) : (
                    tripType === "return" ? "Departure - Return Dates" : "Departure Date"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex flex-col sm:flex-row">
                  <div className="p-2">
                    <p className="text-xs text-muted-foreground mb-2 px-2">Departure</p>
                    <CalendarComponent
                      mode="single"
                      selected={departureDate}
                      onSelect={setDepartureDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </div>
                  {tripType === "return" && (
                    <div className="p-2 border-t sm:border-t-0 sm:border-l">
                      <p className="text-xs text-muted-foreground mb-2 px-2">Return</p>
                      <CalendarComponent
                        mode="single"
                        selected={returnDate}
                        onSelect={setReturnDate}
                        disabled={(date) => date < (departureDate || new Date())}
                        className="pointer-events-auto"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Select 
              value={`${formData.passengers}-${formData.cabinClass}`}
              onValueChange={(value) => {
                const [passengers, cabinClass] = value.split("-");
                setFormData({ ...formData, passengers, cabinClass });
              }}
            >
              <SelectTrigger className="pl-12 h-14 bg-background border-border text-base">
                <SelectValue placeholder="Passengers & Class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-economy">1 Passenger, Economy</SelectItem>
                <SelectItem value="2-economy">2 Passengers, Economy</SelectItem>
                <SelectItem value="3-economy">3 Passengers, Economy</SelectItem>
                <SelectItem value="4-economy">4 Passengers, Economy</SelectItem>
                <SelectItem value="1-business">1 Passenger, Business</SelectItem>
                <SelectItem value="2-business">2 Passengers, Business</SelectItem>
                <SelectItem value="1-first">1 Passenger, First Class</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Row 3: Contact Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              placeholder="Full Name *"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="pl-12 h-14 bg-background border-border text-base"
              required
            />
          </div>
          
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-12 h-14 bg-background border-border text-base"
            />
          </div>
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary" />
            <Input
              type="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-12 h-14 bg-background border-border text-base"
              required
            />
          </div>
        </div>

        {/* Verification & Submit */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* reCAPTCHA Style Checkbox */}
          <div className="flex flex-col items-center">
            <div 
              onClick={() => setIsVerified(!isVerified)}
              className={cn(
                "flex items-center gap-4 bg-secondary border-2 rounded-lg p-4 cursor-pointer transition-all",
                isVerified ? "border-emerald-500" : "border-border hover:border-muted-foreground"
              )}
            >
              <div className={cn(
                "h-7 w-7 border-2 rounded flex items-center justify-center transition-all",
                isVerified ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground"
              )}>
                {isVerified && <Check className="h-5 w-5 text-primary-foreground" />}
              </div>
              <span className="text-sm text-foreground">I'm not a robot</span>
              <div className="flex flex-col items-center ml-4">
                <div className="h-8 w-8 bg-muted rounded flex items-center justify-center">
                  <svg className="h-5 w-5" viewBox="0 0 64 64">
                    <path fill="hsl(var(--primary))" d="M32,32V2c16.6,0,30,13.4,30,30H32z"/>
                    <path fill="hsl(var(--ring))" d="M32,32H2c0,16.6,13.4,30,30,30V32z"/>
                    <path fill="hsl(var(--muted-foreground))" d="M32,2c-16.6,0-30,13.4-30,30h30V2z"/>
                  </svg>
                </div>
                <span className="text-[8px] text-muted-foreground mt-1">reCAPTCHA</span>
              </div>
            </div>
            {!isVerified && (
              <p className="text-xs text-muted-foreground mt-2">Please verify you're not a robot</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="hero"
            size="xl"
            className="w-full md:w-auto min-w-[220px]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Searching..."
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" />
                Search For Flights
              </>
            )}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}
