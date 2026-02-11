import { useState, useMemo } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { worldwideAirports, formatAirport } from "@/data/airports";

interface AirportComboboxProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  className?: string;
  triggerClassName?: string;
}

export function AirportCombobox({
  value,
  onValueChange,
  placeholder = "Select airport...",
  icon,
  className,
  triggerClassName,
}: AirportComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredAirports = useMemo(() => {
    if (!search || search.length < 1) {
      return worldwideAirports.slice(0, 30);
    }
    const lowerSearch = search.toLowerCase();
    return worldwideAirports.filter(
      (airport) =>
        airport.city.toLowerCase().includes(lowerSearch) ||
        airport.airport.toLowerCase().includes(lowerSearch) ||
        airport.code.toLowerCase().includes(lowerSearch) ||
        airport.country.toLowerCase().includes(lowerSearch)
    ).slice(0, 30);
  }, [search]);

  const selectedAirport = worldwideAirports.find(
    (airport) => formatAirport(airport) === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-background border-border font-normal",
            !value && "text-muted-foreground",
            triggerClassName
          )}
        >
          <span className="flex items-center gap-2 truncate">
            {icon}
            <span className="truncate">
              {selectedAirport
                ? `${selectedAirport.city} (${selectedAirport.code})`
                : placeholder}
            </span>
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search city, airport or code..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>No airport found.</CommandEmpty>
            <CommandGroup>
              {filteredAirports.map((airport) => {
                const formatted = formatAirport(airport);
                return (
                  <CommandItem
                    key={`${airport.code}-${airport.airport}`}
                    value={formatted}
                    onSelect={() => {
                      onValueChange(formatted);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === formatted ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {airport.city} ({airport.code})
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {airport.airport}, {airport.country}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
