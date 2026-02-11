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

export default function SidebarFlightForm() {
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
      await submitForm("sidebar_flight_search", {
        ...formData,
        name: formData.fullName,
        tripType,
        departureDate: departureDate?.toISOString() || "",
        returnDate: returnDate?.toISOString() || "",
        pageUrl: window.location.href,
      });
      toast.success("Thank you! Our team will contact you shortly.");
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-card rounded-xl shadow-premium-lg overflow-hidden sticky top-24"
    >
      {/* Header */}
      <div className="bg-primary p-4">
        <div className="flex gap-0 w-full">
          <button
            type="button"
            onClick={() => setTripType("return")}
            className={cn(
              "flex-1 py-2 rounded-l-full text-sm font-semibold transition-all",
              tripType === "return"
                ? "bg-card text-foreground"
                : "bg-transparent text-primary-foreground/80 hover:text-primary-foreground"
            )}
          >
            Return
          </button>
          <button
            type="button"
            onClick={() => setTripType("oneway")}
            className={cn(
              "flex-1 py-2 rounded-r-full text-sm font-semibold transition-all",
              tripType === "oneway"
                ? "bg-card text-foreground"
                : "bg-transparent text-primary-foreground/80 hover:text-primary-foreground"
            )}
          >
            One Way
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-3">
        {/* From */}
        <AirportCombobox
          value={formData.from}
          onValueChange={(value) => setFormData({ ...formData, from: value })}
          placeholder="Departure Airport..."
          icon={<Plane className="h-4 w-4 text-primary shrink-0" />}
          triggerClassName="h-11 text-sm"
          className="w-[280px]"
        />

        {/* To */}
        <AirportCombobox
          value={formData.to}
          onValueChange={(value) => setFormData({ ...formData, to: value })}
          placeholder="Destination Airport..."
          icon={<PlaneLanding className="h-4 w-4 text-primary shrink-0" />}
          triggerClassName="h-11 text-sm"
          className="w-[280px]"
        />

        {/* Dates */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary z-10" />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "pl-10 h-11 w-full justify-start text-sm font-normal bg-background border-border",
                  !departureDate && "text-muted-foreground"
                )}
              >
                {departureDate ? (
                  tripType === "return" && returnDate ? (
                    `${format(departureDate, "dd-MM-yyyy")} - ${format(returnDate, "dd-MM-yyyy")}`
                  ) : (
                    format(departureDate, "dd-MM-yyyy")
                  )
                ) : (
                  "Select dates..."
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="flex flex-col">
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
                  <div className="p-2 border-t">
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

        {/* Passengers */}
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Select 
            value={`${formData.passengers}-${formData.cabinClass}`}
            onValueChange={(value) => {
              const [passengers, cabinClass] = value.split("-");
              setFormData({ ...formData, passengers, cabinClass });
            }}
          >
            <SelectTrigger className="pl-10 h-11 bg-background border-border text-sm">
              <SelectValue placeholder="Passengers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-economy">1 Passenger, Economy</SelectItem>
              <SelectItem value="2-economy">2 Passengers, Economy</SelectItem>
              <SelectItem value="3-economy">3 Passengers, Economy</SelectItem>
              <SelectItem value="1-business">1 Passenger, Business</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Full Name */}
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            placeholder="Full Name *"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            className="pl-10 h-11 bg-background border-border text-sm"
            required
          />
        </div>

        {/* Phone */}
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="pl-10 h-11 bg-background border-border text-sm"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
          <Input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="pl-10 h-11 bg-background border-border text-sm"
            required
          />
        </div>

        {/* Verification */}
        <div 
          onClick={() => setIsVerified(!isVerified)}
          className={cn(
            "flex items-center gap-3 bg-secondary border rounded-lg p-3 cursor-pointer transition-all",
            isVerified ? "border-emerald-500" : "border-border hover:border-muted-foreground"
          )}
        >
          <div className={cn(
            "h-5 w-5 border-2 rounded flex items-center justify-center transition-all shrink-0",
            isVerified ? "bg-emerald-500 border-emerald-500" : "border-muted-foreground"
          )}>
            {isVerified && <Check className="h-3 w-3 text-primary-foreground" />}
          </div>
          <span className="text-xs text-foreground">I'm not a robot</span>
          <div className="flex flex-col items-center ml-auto">
            <div className="h-6 w-6 bg-muted rounded flex items-center justify-center">
              <svg className="h-4 w-4" viewBox="0 0 64 64">
                <path fill="hsl(var(--primary))" d="M32,32V2c16.6,0,30,13.4,30,30H32z"/>
                <path fill="hsl(var(--ring))" d="M32,32H2c0,16.6,13.4,30,30,30V32z"/>
                <path fill="hsl(var(--muted-foreground))" d="M32,2c-16.6,0-30,13.4-30,30h30V2z"/>
              </svg>
            </div>
            <span className="text-[7px] text-muted-foreground">reCAPTCHA</span>
          </div>
        </div>
        {!isVerified && (
          <p className="text-xs text-muted-foreground text-center">Please verify you're not a robot</p>
        )}

        {/* Submit */}
        <Button
          type="submit"
          variant="hero"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Searching..."
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Search For Flights
            </>
          )}
        </Button>
      </form>
    </motion.div>
  );
}
