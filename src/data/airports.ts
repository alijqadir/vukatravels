// Comprehensive worldwide airport list
export const worldwideAirports = [
  // United Kingdom
  { city: "London", airport: "Heathrow", code: "LHR", country: "United Kingdom" },
  { city: "London", airport: "Gatwick", code: "LGW", country: "United Kingdom" },
  { city: "London", airport: "Stansted", code: "STN", country: "United Kingdom" },
  { city: "London", airport: "Luton", code: "LTN", country: "United Kingdom" },
  { city: "London", airport: "City", code: "LCY", country: "United Kingdom" },
  { city: "Manchester", airport: "Manchester", code: "MAN", country: "United Kingdom" },
  { city: "Birmingham", airport: "Birmingham", code: "BHX", country: "United Kingdom" },
  { city: "Edinburgh", airport: "Edinburgh", code: "EDI", country: "United Kingdom" },
  { city: "Glasgow", airport: "Glasgow", code: "GLA", country: "United Kingdom" },
  { city: "Bristol", airport: "Bristol", code: "BRS", country: "United Kingdom" },
  { city: "Newcastle", airport: "Newcastle", code: "NCL", country: "United Kingdom" },
  { city: "Belfast", airport: "Belfast International", code: "BFS", country: "United Kingdom" },
  { city: "Leeds", airport: "Leeds Bradford", code: "LBA", country: "United Kingdom" },
  
  // Africa
  { city: "Nairobi", airport: "Jomo Kenyatta", code: "NBO", country: "Kenya" },
  { city: "Mombasa", airport: "Moi International", code: "MBA", country: "Kenya" },
  { city: "Dar es Salaam", airport: "Julius Nyerere", code: "DAR", country: "Tanzania" },
  { city: "Zanzibar", airport: "Abeid Amani Karume", code: "ZNZ", country: "Tanzania" },
  { city: "Kilimanjaro", airport: "Kilimanjaro", code: "JRO", country: "Tanzania" },
  { city: "Entebbe", airport: "Entebbe International", code: "EBB", country: "Uganda" },
  { city: "Addis Ababa", airport: "Bole International", code: "ADD", country: "Ethiopia" },
  { city: "Johannesburg", airport: "O.R. Tambo", code: "JNB", country: "South Africa" },
  { city: "Cape Town", airport: "Cape Town International", code: "CPT", country: "South Africa" },
  { city: "Lagos", airport: "Murtala Muhammed", code: "LOS", country: "Nigeria" },
  { city: "Accra", airport: "Kotoka International", code: "ACC", country: "Ghana" },
  { city: "Cairo", airport: "Cairo International", code: "CAI", country: "Egypt" },
  { city: "Casablanca", airport: "Mohammed V", code: "CMN", country: "Morocco" },
  { city: "Kigali", airport: "Kigali International", code: "KGL", country: "Rwanda" },
  { city: "Lusaka", airport: "Kenneth Kaunda", code: "LUN", country: "Zambia" },
  { city: "Harare", airport: "Robert Mugabe", code: "HRE", country: "Zimbabwe" },
  
  // Middle East
  { city: "Dubai", airport: "Dubai International", code: "DXB", country: "UAE" },
  { city: "Abu Dhabi", airport: "Abu Dhabi International", code: "AUH", country: "UAE" },
  { city: "Doha", airport: "Hamad International", code: "DOH", country: "Qatar" },
  { city: "Jeddah", airport: "King Abdulaziz", code: "JED", country: "Saudi Arabia" },
  { city: "Riyadh", airport: "King Khalid", code: "RUH", country: "Saudi Arabia" },
  { city: "Tel Aviv", airport: "Ben Gurion", code: "TLV", country: "Israel" },
  { city: "Amman", airport: "Queen Alia", code: "AMM", country: "Jordan" },
  { city: "Muscat", airport: "Muscat International", code: "MCT", country: "Oman" },
  { city: "Kuwait City", airport: "Kuwait International", code: "KWI", country: "Kuwait" },
  { city: "Bahrain", airport: "Bahrain International", code: "BAH", country: "Bahrain" },
  
  // Asia
  { city: "Mumbai", airport: "Chhatrapati Shivaji", code: "BOM", country: "India" },
  { city: "Delhi", airport: "Indira Gandhi", code: "DEL", country: "India" },
  { city: "Bangalore", airport: "Kempegowda", code: "BLR", country: "India" },
  { city: "Chennai", airport: "Chennai International", code: "MAA", country: "India" },
  { city: "Kolkata", airport: "Netaji Subhas Chandra Bose", code: "CCU", country: "India" },
  { city: "Hyderabad", airport: "Rajiv Gandhi", code: "HYD", country: "India" },
  { city: "Islamabad", airport: "Islamabad International", code: "ISB", country: "Pakistan" },
  { city: "Karachi", airport: "Jinnah International", code: "KHI", country: "Pakistan" },
  { city: "Lahore", airport: "Allama Iqbal", code: "LHE", country: "Pakistan" },
  { city: "Dhaka", airport: "Hazrat Shahjalal", code: "DAC", country: "Bangladesh" },
  { city: "Colombo", airport: "Bandaranaike", code: "CMB", country: "Sri Lanka" },
  { city: "Bangkok", airport: "Suvarnabhumi", code: "BKK", country: "Thailand" },
  { city: "Bangkok", airport: "Don Mueang", code: "DMK", country: "Thailand" },
  { city: "Phuket", airport: "Phuket International", code: "HKT", country: "Thailand" },
  { city: "Singapore", airport: "Changi", code: "SIN", country: "Singapore" },
  { city: "Kuala Lumpur", airport: "Kuala Lumpur International", code: "KUL", country: "Malaysia" },
  { city: "Hong Kong", airport: "Hong Kong International", code: "HKG", country: "Hong Kong" },
  { city: "Beijing", airport: "Capital International", code: "PEK", country: "China" },
  { city: "Shanghai", airport: "Pudong International", code: "PVG", country: "China" },
  { city: "Tokyo", airport: "Narita", code: "NRT", country: "Japan" },
  { city: "Tokyo", airport: "Haneda", code: "HND", country: "Japan" },
  { city: "Seoul", airport: "Incheon", code: "ICN", country: "South Korea" },
  { city: "Manila", airport: "Ninoy Aquino", code: "MNL", country: "Philippines" },
  { city: "Jakarta", airport: "Soekarno-Hatta", code: "CGK", country: "Indonesia" },
  { city: "Bali", airport: "Ngurah Rai", code: "DPS", country: "Indonesia" },
  { city: "Ho Chi Minh City", airport: "Tan Son Nhat", code: "SGN", country: "Vietnam" },
  { city: "Hanoi", airport: "Noi Bai", code: "HAN", country: "Vietnam" },
  
  // Europe
  { city: "Paris", airport: "Charles de Gaulle", code: "CDG", country: "France" },
  { city: "Paris", airport: "Orly", code: "ORY", country: "France" },
  { city: "Amsterdam", airport: "Schiphol", code: "AMS", country: "Netherlands" },
  { city: "Frankfurt", airport: "Frankfurt", code: "FRA", country: "Germany" },
  { city: "Munich", airport: "Munich", code: "MUC", country: "Germany" },
  { city: "Berlin", airport: "Brandenburg", code: "BER", country: "Germany" },
  { city: "Rome", airport: "Fiumicino", code: "FCO", country: "Italy" },
  { city: "Milan", airport: "Malpensa", code: "MXP", country: "Italy" },
  { city: "Madrid", airport: "Barajas", code: "MAD", country: "Spain" },
  { city: "Barcelona", airport: "El Prat", code: "BCN", country: "Spain" },
  { city: "Lisbon", airport: "Humberto Delgado", code: "LIS", country: "Portugal" },
  { city: "Athens", airport: "Eleftherios Venizelos", code: "ATH", country: "Greece" },
  { city: "Istanbul", airport: "Istanbul Airport", code: "IST", country: "Turkey" },
  { city: "Zurich", airport: "Zurich", code: "ZRH", country: "Switzerland" },
  { city: "Vienna", airport: "Vienna", code: "VIE", country: "Austria" },
  { city: "Brussels", airport: "Brussels", code: "BRU", country: "Belgium" },
  { city: "Copenhagen", airport: "Copenhagen", code: "CPH", country: "Denmark" },
  { city: "Stockholm", airport: "Arlanda", code: "ARN", country: "Sweden" },
  { city: "Oslo", airport: "Gardermoen", code: "OSL", country: "Norway" },
  { city: "Dublin", airport: "Dublin", code: "DUB", country: "Ireland" },
  { city: "Warsaw", airport: "Chopin", code: "WAW", country: "Poland" },
  { city: "Prague", airport: "Václav Havel", code: "PRG", country: "Czech Republic" },
  { city: "Budapest", airport: "Ferenc Liszt", code: "BUD", country: "Hungary" },
  { city: "Moscow", airport: "Sheremetyevo", code: "SVO", country: "Russia" },
  { city: "Aarhus", airport: "Aarhus", code: "AAR", country: "Denmark" },
  
  // North America
  { city: "New York", airport: "JFK", code: "JFK", country: "USA" },
  { city: "New York", airport: "Newark", code: "EWR", country: "USA" },
  { city: "New York", airport: "LaGuardia", code: "LGA", country: "USA" },
  { city: "Los Angeles", airport: "LAX", code: "LAX", country: "USA" },
  { city: "Chicago", airport: "O'Hare", code: "ORD", country: "USA" },
  { city: "Miami", airport: "Miami International", code: "MIA", country: "USA" },
  { city: "San Francisco", airport: "SFO", code: "SFO", country: "USA" },
  { city: "Washington", airport: "Dulles", code: "IAD", country: "USA" },
  { city: "Atlanta", airport: "Hartsfield-Jackson", code: "ATL", country: "USA" },
  { city: "Boston", airport: "Logan", code: "BOS", country: "USA" },
  { city: "Dallas", airport: "DFW", code: "DFW", country: "USA" },
  { city: "Houston", airport: "George Bush", code: "IAH", country: "USA" },
  { city: "Seattle", airport: "Seattle-Tacoma", code: "SEA", country: "USA" },
  { city: "Toronto", airport: "Pearson", code: "YYZ", country: "Canada" },
  { city: "Vancouver", airport: "Vancouver", code: "YVR", country: "Canada" },
  { city: "Montreal", airport: "Trudeau", code: "YUL", country: "Canada" },
  { city: "Mexico City", airport: "Benito Juárez", code: "MEX", country: "Mexico" },
  { city: "Cancun", airport: "Cancun International", code: "CUN", country: "Mexico" },
  
  // South America
  { city: "São Paulo", airport: "Guarulhos", code: "GRU", country: "Brazil" },
  { city: "Rio de Janeiro", airport: "Galeão", code: "GIG", country: "Brazil" },
  { city: "Buenos Aires", airport: "Ezeiza", code: "EZE", country: "Argentina" },
  { city: "Lima", airport: "Jorge Chávez", code: "LIM", country: "Peru" },
  { city: "Bogotá", airport: "El Dorado", code: "BOG", country: "Colombia" },
  { city: "Santiago", airport: "Arturo Merino Benítez", code: "SCL", country: "Chile" },
  
  // Oceania
  { city: "Sydney", airport: "Kingsford Smith", code: "SYD", country: "Australia" },
  { city: "Melbourne", airport: "Melbourne", code: "MEL", country: "Australia" },
  { city: "Brisbane", airport: "Brisbane", code: "BNE", country: "Australia" },
  { city: "Perth", airport: "Perth", code: "PER", country: "Australia" },
  { city: "Auckland", airport: "Auckland", code: "AKL", country: "New Zealand" },
];

// Format airport for display
export const formatAirport = (airport: typeof worldwideAirports[0]) => 
  `${airport.city} - ${airport.airport} (${airport.code})`;

// Search airports by query (city, airport name, or code)
export const searchAirports = (query: string) => {
  if (!query || query.length < 2) return worldwideAirports.slice(0, 20);
  
  const lowerQuery = query.toLowerCase();
  return worldwideAirports.filter(airport => 
    airport.city.toLowerCase().includes(lowerQuery) ||
    airport.airport.toLowerCase().includes(lowerQuery) ||
    airport.code.toLowerCase().includes(lowerQuery) ||
    airport.country.toLowerCase().includes(lowerQuery)
  ).slice(0, 20);
};
