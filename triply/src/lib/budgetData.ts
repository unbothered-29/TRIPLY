export type TravelStyle = "budget" | "comfort" | "luxury";

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
];

export interface DestinationCostIndex {
  baseAccommodationUSD: number;
  baseDiningUSD: number;
  baseActivitiesUSD: number;
  baseTransportUSD: number;
}

// Destination-specific or category-default daily cost baseline (in USD per person / day for "comfort")
export const DESTINATION_COST_MAP: Record<string, DestinationCostIndex> = {
  norway: {
    baseAccommodationUSD: 160,
    baseDiningUSD: 75,
    baseActivitiesUSD: 60,
    baseTransportUSD: 35,
  },
  "mount-fuji": {
    baseAccommodationUSD: 120,
    baseDiningUSD: 55,
    baseActivitiesUSD: 40,
    baseTransportUSD: 30,
  },
  paris: {
    baseAccommodationUSD: 175,
    baseDiningUSD: 80,
    baseActivitiesUSD: 50,
    baseTransportUSD: 25,
  },
  "amalfi-coast": {
    baseAccommodationUSD: 190,
    baseDiningUSD: 85,
    baseActivitiesUSD: 55,
    baseTransportUSD: 40,
  },
  "netherlands-tulip-gardens": {
    baseAccommodationUSD: 140,
    baseDiningUSD: 65,
    baseActivitiesUSD: 40,
    baseTransportUSD: 25,
  },
  ladakh: {
    baseAccommodationUSD: 50,
    baseDiningUSD: 25,
    baseActivitiesUSD: 30,
    baseTransportUSD: 35,
  },
  sydney: {
    baseAccommodationUSD: 150,
    baseDiningUSD: 70,
    baseActivitiesUSD: 45,
    baseTransportUSD: 30,
  },
};

export const DEFAULT_COST_INDEX: DestinationCostIndex = {
  baseAccommodationUSD: 130,
  baseDiningUSD: 60,
  baseActivitiesUSD: 45,
  baseTransportUSD: 25,
};

export const STYLE_MULTIPLIERS: Record<TravelStyle, { label: string; tag: string; factor: number; desc: string }> = {
  budget: {
    label: "Backpacker / Budget",
    tag: "Smart Saver",
    factor: 0.52,
    desc: "Boutique hostels, authentic local eateries, public transit, and free walking tours.",
  },
  comfort: {
    label: "Explorer / Comfort",
    tag: "Balanced",
    factor: 1.0,
    desc: "3-4 star boutique hotels, curated bistros, express transport, and guided excursions.",
  },
  luxury: {
    label: "Indulgence / Luxury",
    tag: "5-Star VIP",
    factor: 2.35,
    desc: "5-star luxury resorts, private chauffeur transfers, chef's table dining, and private access.",
  },
};

export function calculateTripBudget(params: {
  destinationSlug?: string;
  days: number;
  travelers: number;
  style: TravelStyle;
  currencyCode: string;
}) {
  const { destinationSlug, days, travelers, style, currencyCode } = params;
  const costIndex =
    (destinationSlug && DESTINATION_COST_MAP[destinationSlug]) || DEFAULT_COST_INDEX;

  const styleMultiplier = STYLE_MULTIPLIERS[style].factor;
  const currency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) ||
    SUPPORTED_CURRENCIES[0];

  // Group savings on accommodation (couples share rooms)
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

  const totalUSD =
    lodgingCostUSD +
    diningCostUSD +
    activitiesCostUSD +
    transportCostUSD +
    miscellaneousBufferUSD;

  const rate = currency.rateToUSD;

  return {
    currency,
    days,
    travelers,
    style,
    totalConverted: Math.round(totalUSD * rate),
    perPersonDailyConverted: Math.round((totalUSD / (days * travelers)) * rate),
    breakdown: [
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
        tip: `Covers breakfasts, lunches, signature dinners for ${travelers} guest${travelers > 1 ? "s" : ""}`,
      },
      {
        category: "Activities & Admissions",
        amount: Math.round(activitiesCostUSD * rate),
        percent: Math.round((activitiesCostUSD / totalUSD) * 100),
        icon: "🎟️",
        tip: "Museum entries, outdoor adventures, boat rentals, and landmark passes",
      },
      {
        category: "Local Transport",
        amount: Math.round(transportCostUSD * rate),
        percent: Math.round((transportCostUSD / totalUSD) * 100),
        icon: "🚆",
        tip: "Metro passes, trains, scenic ferries, and regional transfers",
      },
      {
        category: "Contingency & Incidentals",
        amount: Math.round(miscellaneousBufferUSD * rate),
        percent: Math.round((miscellaneousBufferUSD / totalUSD) * 100),
        icon: "☕",
        tip: "Artisanal coffee, souvenirs, tips, and unexpected treats",
      },
    ],
  };
}
