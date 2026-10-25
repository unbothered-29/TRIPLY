export type TravelStyle = "budget" | "comfort" | "luxury";

export type FlightClass = "economy" | "premium" | "business";

export type FlightOriginRegion =
  | "north-america"
  | "europe"
  | "asia-east"
  | "south-asia"
  | "oceania"
  | "middle-east";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number; // 1 USD = rate units of target currency
}

export const SUPPORTED_CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar", rateToUSD: 1.0 },
  { code: "EUR", symbol: "€", name: "Euro", rateToUSD: 0.92 },
  { code: "GBP", symbol: "£", name: "British Pound", rateToUSD: 0.79 },
  { code: "JPY", symbol: "¥", name: "Japanese Yen", rateToUSD: 155.0 },
  { code: "INR", symbol: "₹", name: "Indian Rupee", rateToUSD: 86.5 },
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rateToUSD: 1.54 },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar", rateToUSD: 1.38 },
  { code: "CHF", symbol: "Fr", name: "Swiss Franc", rateToUSD: 0.88 },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar", rateToUSD: 1.35 },
  { code: "AED", symbol: "AED", name: "UAE Dirham", rateToUSD: 3.67 },
];

export interface FlightOriginOption {
  id: FlightOriginRegion;
  label: string;
  flag: string;
}

export const FLIGHT_ORIGINS: FlightOriginOption[] = [
  { id: "north-america", label: "North America (US / Canada)", flag: "🇺🇸" },
  { id: "europe", label: "Western / Northern Europe", flag: "🇪🇺" },
  { id: "asia-east", label: "East & Southeast Asia", flag: "🇯🇵" },
  { id: "south-asia", label: "South Asia (India)", flag: "🇮🇳" },
  { id: "oceania", label: "Australia & Oceania", flag: "🇦🇺" },
  { id: "middle-east", label: "Middle East & Gulf", flag: "🇦🇪" },
];

export interface DestinationCostIndex {
  region: "europe" | "asia-east" | "south-asia" | "oceania" | "north-america" | "middle-east";
  baseAccommodationUSD: number;
  baseDiningUSD: number;
  baseActivitiesUSD: number;
  baseTransportUSD: number;
}

// Destination-specific daily cost baseline (in USD per person / day for "comfort")
export const DESTINATION_COST_MAP: Record<string, DestinationCostIndex> = {
  norway: {
    region: "europe",
    baseAccommodationUSD: 165,
    baseDiningUSD: 80,
    baseActivitiesUSD: 65,
    baseTransportUSD: 35,
  },
  "mount-fuji": {
    region: "asia-east",
    baseAccommodationUSD: 125,
    baseDiningUSD: 60,
    baseActivitiesUSD: 45,
    baseTransportUSD: 30,
  },
  paris: {
    region: "europe",
    baseAccommodationUSD: 180,
    baseDiningUSD: 85,
    baseActivitiesUSD: 50,
    baseTransportUSD: 25,
  },
  "amalfi-coast": {
    region: "europe",
    baseAccommodationUSD: 195,
    baseDiningUSD: 90,
    baseActivitiesUSD: 60,
    baseTransportUSD: 40,
  },
  "netherlands-tulip-gardens": {
    region: "europe",
    baseAccommodationUSD: 145,
    baseDiningUSD: 70,
    baseActivitiesUSD: 40,
    baseTransportUSD: 25,
  },
  ladakh: {
    region: "south-asia",
    baseAccommodationUSD: 50,
    baseDiningUSD: 25,
    baseActivitiesUSD: 30,
    baseTransportUSD: 35,
  },
  sydney: {
    region: "oceania",
    baseAccommodationUSD: 155,
    baseDiningUSD: 75,
    baseActivitiesUSD: 50,
    baseTransportUSD: 30,
  },
  "new-york": {
    region: "north-america",
    baseAccommodationUSD: 220,
    baseDiningUSD: 95,
    baseActivitiesUSD: 65,
    baseTransportUSD: 30,
  },
  switzerland: {
    region: "europe",
    baseAccommodationUSD: 190,
    baseDiningUSD: 90,
    baseActivitiesUSD: 70,
    baseTransportUSD: 45,
  },
  "chiang-mai": {
    region: "asia-east",
    baseAccommodationUSD: 45,
    baseDiningUSD: 22,
    baseActivitiesUSD: 28,
    baseTransportUSD: 15,
  },
  cappadocia: {
    region: "middle-east",
    baseAccommodationUSD: 95,
    baseDiningUSD: 40,
    baseActivitiesUSD: 85,
    baseTransportUSD: 30,
  },
  greece: {
    region: "europe",
    baseAccommodationUSD: 140,
    baseDiningUSD: 65,
    baseActivitiesUSD: 45,
    baseTransportUSD: 30,
  },
};

export const DEFAULT_COST_INDEX: DestinationCostIndex = {
  region: "europe",
  baseAccommodationUSD: 130,
  baseDiningUSD: 60,
  baseActivitiesUSD: 45,
  baseTransportUSD: 25,
};

export const STYLE_MULTIPLIERS: Record<
  TravelStyle,
  {
    label: string;
    tag: string;
    factor: number;
    desc: string;
    highlights: string[];
  }
> = {
  budget: {
    label: "Backpacker / Budget",
    tag: "Smart Saver",
    factor: 0.52,
    desc: "Boutique hostels & cozy guesthouses, local market street food, public transit passes, and self-guided walking tours.",
    highlights: ["Hostels & Guesthouses", "Street Food & Markets", "Subway & Local Rail", "Free / Low-cost Attractions"],
  },
  comfort: {
    label: "Explorer / Comfort",
    tag: "Balanced",
    factor: 1.0,
    desc: "3-4 star boutique hotels, curated bistros & regional dining, express high-speed trains, and guided museum passes.",
    highlights: ["3-4★ Boutique Hotels", "Casual & Iconic Bistros", "High-speed Trains & Taxis", "Guided Excursions"],
  },
  luxury: {
    label: "Indulgence / Luxury",
    tag: "5-Star VIP",
    factor: 2.35,
    desc: "5-star luxury resorts & heritage suites, Michelin-star & chef's table dining, private chauffeur transfers, and exclusive VIP access.",
    highlights: ["5★ Luxury Resorts", "Fine Dining & Tasting Menus", "Private Chauffeur / Boat", "Exclusive VIP Access"],
  },
};

// Estimated round-trip flight base costs (Economy USD) from origin to destination region
const FLIGHT_MATRIX_USD: Record<FlightOriginRegion, Record<string, number>> = {
  "north-america": {
    "north-america": 350,
    europe: 750,
    "asia-east": 950,
    "south-asia": 980,
    oceania: 1250,
    "middle-east": 850,
  },
  europe: {
    "north-america": 700,
    europe: 180,
    "asia-east": 820,
    "south-asia": 650,
    oceania: 1350,
    "middle-east": 450,
  },
  "asia-east": {
    "north-america": 900,
    europe: 850,
    "asia-east": 280,
    "south-asia": 420,
    oceania: 650,
    "middle-east": 580,
  },
  "south-asia": {
    "north-america": 1050,
    europe: 650,
    "asia-east": 380,
    "south-asia": 120,
    oceania: 850,
    "middle-east": 280,
  },
  oceania: {
    "north-america": 1200,
    europe: 1350,
    "asia-east": 680,
    "south-asia": 820,
    oceania: 220,
    "middle-east": 1050,
  },
  "middle-east": {
    "north-america": 850,
    europe: 450,
    "asia-east": 550,
    "south-asia": 250,
    oceania: 1050,
    "middle-east": 150,
  },
};

export const FLIGHT_CLASS_MULTIPLIERS: Record<FlightClass, { label: string; factor: number }> = {
  economy: { label: "Economy", factor: 1.0 },
  premium: { label: "Premium Economy", factor: 1.7 },
  business: { label: "Business Class", factor: 3.4 },
};

export interface CalculateTripBudgetParams {
  destinationSlug?: string;
  days: number;
  travelers: number;
  style: TravelStyle;
  currencyCode: string;
  includeFlights?: boolean;
  flightOrigin?: FlightOriginRegion;
  flightClass?: FlightClass;
}

export function calculateTripBudget(params: CalculateTripBudgetParams) {
  const {
    destinationSlug,
    days,
    travelers,
    style,
    currencyCode,
    includeFlights = false,
    flightOrigin = "north-america",
    flightClass = "economy",
  } = params;

  const costIndex =
    (destinationSlug && DESTINATION_COST_MAP[destinationSlug]) || DEFAULT_COST_INDEX;

  const styleMultiplier = STYLE_MULTIPLIERS[style].factor;
  const currency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) ||
    SUPPORTED_CURRENCIES[0];

  // Group savings on accommodation (couples / pairs share rooms)
  const roomCount = Math.ceil(travelers / 2);
  const lodgingCostUSD =
    costIndex.baseAccommodationUSD * styleMultiplier * days * roomCount;

  // Individual daily costs
  const diningCostUSD =
    costIndex.baseDiningUSD * styleMultiplier * days * travelers;
  const activitiesCostUSD =
    costIndex.baseActivitiesUSD * styleMultiplier * days * travelers;
  const transportCostUSD =
    costIndex.baseTransportUSD * styleMultiplier * days * travelers;

  const miscellaneousBufferUSD = (diningCostUSD + activitiesCostUSD) * 0.12;

  // Flight calculations
  let flightCostUSD = 0;
  if (includeFlights) {
    const originMatrix = FLIGHT_MATRIX_USD[flightOrigin] || FLIGHT_MATRIX_USD["north-america"];
    const baseEconomyFlight = originMatrix[costIndex.region] ?? 700;
    const classMultiplier = FLIGHT_CLASS_MULTIPLIERS[flightClass]?.factor ?? 1.0;
    flightCostUSD = baseEconomyFlight * classMultiplier * travelers;
  }

  const totalUSD =
    lodgingCostUSD +
    diningCostUSD +
    activitiesCostUSD +
    transportCostUSD +
    miscellaneousBufferUSD +
    flightCostUSD;

  const rate = currency.rateToUSD;

  const breakdown = [
    {
      category: "Lodging & Stays",
      amount: Math.round(lodgingCostUSD * rate),
      percent: Math.round((lodgingCostUSD / totalUSD) * 100),
      icon: "🏨",
      tip: `${roomCount} room${roomCount > 1 ? "s" : ""} across ${days} night${days > 1 ? "s" : ""}`,
    },
    {
      category: "Dining & Drinks",
      amount: Math.round(diningCostUSD * rate),
      percent: Math.round((diningCostUSD / totalUSD) * 100),
      icon: "🍽️",
      tip: `Breakfast, lunch, signature dinners for ${travelers} guest${travelers > 1 ? "s" : ""}`,
    },
    {
      category: "Activities & Admissions",
      amount: Math.round(activitiesCostUSD * rate),
      percent: Math.round((activitiesCostUSD / totalUSD) * 100),
      icon: "🎟️",
      tip: "Key sights, excursions, walking trails, and landmark passes",
    },
    {
      category: "Local Transport",
      amount: Math.round(transportCostUSD * rate),
      percent: Math.round((transportCostUSD / totalUSD) * 100),
      icon: "🚆",
      tip: "Metro passes, trains, scenic ferries, and local transit",
    },
    ...(includeFlights
      ? [
          {
            category: `Round-Trip Flights (${FLIGHT_CLASS_MULTIPLIERS[flightClass].label})`,
            amount: Math.round(flightCostUSD * rate),
            percent: Math.round((flightCostUSD / totalUSD) * 100),
            icon: "✈️",
            tip: `Estimated round-trip flights for ${travelers} traveler${travelers > 1 ? "s" : ""}`,
          },
        ]
      : []),
    {
      category: "Contingency & Incidentals",
      amount: Math.round(miscellaneousBufferUSD * rate),
      percent: Math.round((miscellaneousBufferUSD / totalUSD) * 100),
      icon: "☕",
      tip: "Coffee, souvenirs, tips, and unexpected treats",
    },
  ];

  return {
    currency,
    days,
    travelers,
    style,
    includeFlights,
    flightOrigin,
    flightClass,
    totalConverted: Math.round(totalUSD * rate),
    perPersonDailyConverted: Math.round((totalUSD / (days * travelers)) * rate),
    breakdown,
  };
}

// Side-by-side comparison for all 3 travel tiers
export function getTierComparison(params: {
  destinationSlug?: string;
  days: number;
  travelers: number;
  currencyCode: string;
  includeFlights?: boolean;
  flightOrigin?: FlightOriginRegion;
}) {
  const styles: TravelStyle[] = ["budget", "comfort", "luxury"];
  return styles.map((style) => ({
    style,
    info: STYLE_MULTIPLIERS[style],
    result: calculateTripBudget({
      ...params,
      style,
      flightClass: style === "luxury" ? "business" : style === "comfort" ? "premium" : "economy",
    }),
  }));
}
