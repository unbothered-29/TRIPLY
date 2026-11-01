export type TravelStyle = "budget" | "comfort" | "luxury";

export type FlightClass = "economy" | "premium" | "business";

export type FlightOriginRegion =
  | "north-america"
  | "europe"
  | "asia-east"
  | "south-asia"
  | "oceania"
  | "middle-east";

export type TravelSeason = "shoulder" | "peak" | "off-peak";

export type PartyType = "solo" | "couple" | "family" | "group";

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
  { code: "THB", symbol: "฿", name: "Thai Baht", rateToUSD: 36.5 },
  { code: "TRY", symbol: "₺", name: "Turkish Lira", rateToUSD: 34.0 },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone", rateToUSD: 10.9 },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", rateToUSD: 1.68 },
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

export interface SavingsHack {
  title: string;
  desc: string;
  icon: string;
  potentialSavings: string;
}

export interface DestinationCostIndex {
  region: "europe" | "asia-east" | "south-asia" | "oceania" | "north-america" | "middle-east";
  baseAccommodationUSD: number;
  baseDiningUSD: number;
  baseActivitiesUSD: number;
  baseTransportUSD: number;
  localCurrencyCode: string;
  localCurrencySymbol: string;
  localRateToUSD: number;
  peakMonths: string;
  bestValueMonths: string;
  savingsHacks: SavingsHack[];
}

export const SEASON_CONFIGS: Record<
  TravelSeason,
  {
    label: string;
    tag: string;
    factor: number;
    badge: string;
    desc: string;
  }
> = {
  shoulder: {
    label: "Shoulder Season",
    tag: "Best Value",
    factor: 1.0,
    badge: "✨ Optimal Balance",
    desc: "Spring / Autumn: optimal weather, moderate crowds, standard baseline pricing.",
  },
  peak: {
    label: "Peak Season",
    tag: "High Demand (+25%)",
    factor: 1.25,
    badge: "🔥 High Season",
    desc: "Mid-summer & major holidays: peak sunshine, festive energy, highest lodging & flight rates.",
  },
  "off-peak": {
    label: "Low / Off-Peak",
    tag: "Save ~20%",
    factor: 0.8,
    badge: "💰 Budget Saver (-20%)",
    desc: "Winter & low season: substantial hotel discounts, serene landmarks, fewer queues.",
  },
};

export const PARTY_CONFIGS: Record<
  PartyType,
  {
    label: string;
    icon: string;
    desc: string;
    roomMultiplier: (travelers: number) => number;
    activityDiscount: number;
    diningDiscount: number;
  }
> = {
  solo: {
    label: "Solo Adventurer",
    icon: "👤",
    desc: "Private room / single studio without shared splitting",
    roomMultiplier: (t) => Math.max(1, t),
    activityDiscount: 1.0,
    diningDiscount: 1.0,
  },
  couple: {
    label: "Couple / Duo",
    icon: "👫",
    desc: "Shared double room or boutique king suite",
    roomMultiplier: (t) => Math.ceil(t / 2),
    activityDiscount: 1.0,
    diningDiscount: 1.0,
  },
  family: {
    label: "Family (with Kids)",
    icon: "👨‍👩‍👧",
    desc: "Family suites, kid-friendly dining & discounted admission passes",
    roomMultiplier: (t) => Math.max(1, Math.ceil(t / 2.5)),
    activityDiscount: 0.82,
    diningDiscount: 0.88,
  },
  group: {
    label: "Friends / Group",
    icon: "👥",
    desc: "Shared Airbnb villa or connected suites with group transit savings",
    roomMultiplier: (t) => Math.max(1, Math.ceil(t / 2.2)),
    activityDiscount: 0.9,
    diningDiscount: 0.94,
  },
};

// Destination-specific daily cost baseline (in USD per person / day for "comfort")
export const DESTINATION_COST_MAP: Record<string, DestinationCostIndex> = {
  norway: {
    region: "europe",
    baseAccommodationUSD: 165,
    baseDiningUSD: 80,
    baseActivitiesUSD: 65,
    baseTransportUSD: 35,
    localCurrencyCode: "NOK",
    localCurrencySymbol: "kr",
    localRateToUSD: 10.9,
    peakMonths: "June – August (Midnight Sun)",
    bestValueMonths: "May & September (Fewer crowds, roaring waterfalls)",
    savingsHacks: [
      {
        title: "Vy Minipris Rail Tickets",
        desc: "Book train tickets between Oslo, Bergen, and Flåm up to 90 days ahead for up to 60% off standard fares.",
        icon: "🚆",
        potentialSavings: "Save up to $110/person",
      },
      {
        title: "Kiwi & Rema 1000 Meal Prep",
        desc: "Restaurant dining carries heavy alcohol & VAT taxes. Supermarket breakfasts and bakery lunches save over $50/day.",
        icon: "🥪",
        potentialSavings: "Save $50/person/day",
      },
      {
        title: "Fjord1 Public Passenger Ferries",
        desc: "Hop aboard scheduled commuter passenger ferries across the Geirangerfjord instead of costly private cruise tenders.",
        icon: "⛴️",
        potentialSavings: "Save $45/trip",
      },
    ],
  },
  "mount-fuji": {
    region: "asia-east",
    baseAccommodationUSD: 125,
    baseDiningUSD: 60,
    baseActivitiesUSD: 45,
    baseTransportUSD: 30,
    localCurrencyCode: "JPY",
    localCurrencySymbol: "¥",
    localRateToUSD: 155.0,
    peakMonths: "July – August (Climbing Season) & April (Sakura)",
    bestValueMonths: "October – November (Clear Fuji views & autumn leaves)",
    savingsHacks: [
      {
        title: "Fuji Hakone Pass",
        desc: "Covers round-trip train from Shinjuku plus unlimited ropeways, cruise boats, and local buses around the Five Lakes.",
        icon: "🎫",
        potentialSavings: "Save $65/person",
      },
      {
        title: "Gourmet Conbini Culture",
        desc: "7-Eleven and Lawson feature exceptional fresh onigiri, katsu sandos, and hot bento boxes for under $6.",
        icon: "🍱",
        potentialSavings: "Save $30/person/day",
      },
      {
        title: "Shared Ryokan Hot Springs",
        desc: "Opt for a traditional ryokan with shared public onsen rather than an in-room private tub to cut room rates in half.",
        icon: "♨️",
        potentialSavings: "Save $140/night",
      },
    ],
  },
  paris: {
    region: "europe",
    baseAccommodationUSD: 180,
    baseDiningUSD: 85,
    baseActivitiesUSD: 50,
    baseTransportUSD: 25,
    localCurrencyCode: "EUR",
    localCurrencySymbol: "€",
    localRateToUSD: 0.92,
    peakMonths: "June – August & Fashion Week",
    bestValueMonths: "March – May & October (Crisp weather & vibrant cafés)",
    savingsHacks: [
      {
        title: "Paris Museum Pass (PMP)",
        desc: "Grants skip-the-line admission to the Louvre, Musée d'Orsay, Centre Pompidou, and Palace of Versailles.",
        icon: "🏛️",
        potentialSavings: "Save $75/person",
      },
      {
        title: "Navigo Découverte Weekly Pass",
        desc: "Provides unlimited Metro, RER, and bus rides including direct airport train transfers for just €30/week.",
        icon: "🚇",
        potentialSavings: "Save $40/person",
      },
      {
        title: "Artisan Bakery Lunches",
        desc: "Pick up warm baguettes, quiches, and fruit tarts from local boulangeries for a gourmet picnic along the Seine.",
        icon: "🥖",
        potentialSavings: "Save $35/day",
      },
    ],
  },
  "amalfi-coast": {
    region: "europe",
    baseAccommodationUSD: 195,
    baseDiningUSD: 90,
    baseActivitiesUSD: 60,
    baseTransportUSD: 40,
    localCurrencyCode: "EUR",
    localCurrencySymbol: "€",
    localRateToUSD: 0.92,
    peakMonths: "July – August (Warm Mediterranean high season)",
    bestValueMonths: "May & late September – October (Warm waters, half the crowds)",
    savingsHacks: [
      {
        title: "Base in Sorrento or Salerno",
        desc: "Staying just outside Positano lowers luxury hotel rates by 40% while keeping direct 25-minute scenic ferry links.",
        icon: "🏨",
        potentialSavings: "Save $120/night",
      },
      {
        title: "SITA Public Coastal Buses",
        desc: "Avoid $150 private chauffeur rides between Amalfi, Ravello, and Positano by taking scenic SITA buses for €2.40.",
        icon: "🚌",
        potentialSavings: "Save $130/day",
      },
      {
        title: "Path of the Gods Hike (Free)",
        desc: "The Sentiero degli Dei offers the most breathtaking panoramic views across the coastline with zero admission cost.",
        icon: "🥾",
        potentialSavings: "Free $90 tour alternative",
      },
    ],
  },
  "netherlands-tulip-gardens": {
    region: "europe",
    baseAccommodationUSD: 145,
    baseDiningUSD: 70,
    baseActivitiesUSD: 40,
    baseTransportUSD: 25,
    localCurrencyCode: "EUR",
    localCurrencySymbol: "€",
    localRateToUSD: 0.92,
    peakMonths: "Mid-April – Early May (Peak Tulip Bloom)",
    bestValueMonths: "Late March & Early May (Avoid peak Easter congestion)",
    savingsHacks: [
      {
        title: "Keukenhof Express Combi-Ticket",
        desc: "Bundles direct express shuttle bus transfer from Amsterdam RAI or Schiphol with priority skip-the-line entry.",
        icon: "🌷",
        potentialSavings: "Save $25/person",
      },
      {
        title: "Rent a Bicycle in Lisse",
        desc: "Rent a city bike for €12 and explore dozens of square miles of free blooming public flower fields outside Keukenhof.",
        icon: "🚲",
        potentialSavings: "Save $45 on paid tours",
      },
      {
        title: "OVpay Contactless Transit",
        desc: "Tap your debit/credit card directly on Dutch trains and trams to avoid single-journey paper ticket surcharges.",
        icon: "🚆",
        potentialSavings: "Save $15/person",
      },
    ],
  },
  ladakh: {
    region: "south-asia",
    baseAccommodationUSD: 50,
    baseDiningUSD: 25,
    baseActivitiesUSD: 30,
    baseTransportUSD: 35,
    localCurrencyCode: "INR",
    localCurrencySymbol: "₹",
    localRateToUSD: 86.5,
    peakMonths: "June – August (Mountain passes open)",
    bestValueMonths: "September (Crystal blue skies, golden poplars, low rates)",
    savingsHacks: [
      {
        title: "Bakery Noticeboard Taxi Pool",
        desc: "Coordinate with fellow travelers via café noticeboards in Leh to share 4x4 SUV costs to Pangong Lake and Nubra.",
        icon: "🚙",
        potentialSavings: "Save up to $180/trip",
      },
      {
        title: "Local Ladakhi Homestays",
        desc: "Immerse in village homestays in Turtuk and Hunder featuring organic home-cooked thukpa, momos, and apricot tea.",
        icon: "🏡",
        potentialSavings: "Save $35/night",
      },
      {
        title: "Self-Serve Online ILP Permits",
        desc: "Apply directly on the official Leh administration portal rather than paying high agency processing commissions.",
        icon: "📄",
        potentialSavings: "Save $20/person",
      },
    ],
  },
  sydney: {
    region: "oceania",
    baseAccommodationUSD: 155,
    baseDiningUSD: 75,
    baseActivitiesUSD: 50,
    baseTransportUSD: 30,
    localCurrencyCode: "AUD",
    localCurrencySymbol: "A$",
    localRateToUSD: 1.54,
    peakMonths: "December – February (Aussie Summer & NYE fireworks)",
    bestValueMonths: "March – May & October – November (Sunny 23°C weather)",
    savingsHacks: [
      {
        title: "Sunday Opal Weekend Fare Cap",
        desc: "Ride all Sydney trains, light rail, and iconic harbour ferries (including Manly and Watson's Bay) with deeply discounted weekend daily caps.",
        icon: "⛴️",
        potentialSavings: "Save $30/day",
      },
      {
        title: "Bondi to Coogee Coastal Walk",
        desc: "A world-renowned 6km cliffside trek passing Bronte and Clovelly with stunning Pacific ocean views at zero cost.",
        icon: "🌊",
        potentialSavings: "Free premier excursion",
      },
      {
        title: "BYO Dining Across Surry Hills",
        desc: "Take advantage of Australia's vibrant Bring-Your-Own wine culture at top-rated local eateries with tiny corkage fees.",
        icon: "🍷",
        potentialSavings: "Save $40/dinner",
      },
    ],
  },
  "new-york": {
    region: "north-america",
    baseAccommodationUSD: 220,
    baseDiningUSD: 95,
    baseActivitiesUSD: 65,
    baseTransportUSD: 30,
    localCurrencyCode: "USD",
    localCurrencySymbol: "$",
    localRateToUSD: 1.0,
    peakMonths: "September – December (Autumn foliage & Holiday Season)",
    bestValueMonths: "January – March (NYC Hotel Week with 40-50% off luxury rooms)",
    savingsHacks: [
      {
        title: "7-Day Unlimited OMNY / MetroCard",
        desc: "Unlimited subway and bus travel across Manhattan, Brooklyn, and Queens—pays for itself in just 12 rides.",
        icon: "🚇",
        potentialSavings: "Save $50/week",
      },
      {
        title: "Digital Broadway Lotteries",
        desc: "Enter TodayTix and Lucky Seat lotteries for same-day $35–$49 front orchestra seats for blockbuster Broadway musicals.",
        icon: "🎭",
        potentialSavings: "Save $120/ticket",
      },
      {
        title: "Staten Island Ferry (Free Skyline)",
        desc: "Get an unobstructed up-close view of the Statue of Liberty and Downtown skyline on the free 24/7 public ferry.",
        icon: "🗽",
        potentialSavings: "Save $40 cruise ticket",
      },
    ],
  },
  switzerland: {
    region: "europe",
    baseAccommodationUSD: 190,
    baseDiningUSD: 90,
    baseActivitiesUSD: 70,
    baseTransportUSD: 45,
    localCurrencyCode: "CHF",
    localCurrencySymbol: "Fr",
    localRateToUSD: 0.88,
    peakMonths: "July – August (Alpine hiking) & Dec – Feb (Skiing)",
    bestValueMonths: "May – June & September – October (Golden pastures, pleasant trails)",
    savingsHacks: [
      {
        title: "Swiss Travel Pass Unlimited",
        desc: "Covers all SBB express trains, panoramic alpine postbuses, lake steamers, and free admission to 500+ museums.",
        icon: "🚞",
        potentialSavings: "Save $180/person",
      },
      {
        title: "Coop & Migros Hot Food Delis",
        desc: "Swiss sit-down dining averages $45+/person. Supermarket hot counters offer warm rösti, roast chicken, and salads for $12.",
        icon: "🧀",
        potentialSavings: "Save $60/person/day",
      },
      {
        title: "Complimentary Hotel Guest Cards",
        desc: "Stays in Interlaken, Lucerne, or Bern include a free local public transit card valid throughout your stay.",
        icon: "🎫",
        potentialSavings: "Save $25/day",
      },
    ],
  },
  "chiang-mai": {
    region: "asia-east",
    baseAccommodationUSD: 45,
    baseDiningUSD: 22,
    baseActivitiesUSD: 28,
    baseTransportUSD: 15,
    localCurrencyCode: "THB",
    localCurrencySymbol: "฿",
    localRateToUSD: 36.5,
    peakMonths: "November – February (Cool & dry, Yi Peng Lanterns)",
    bestValueMonths: "July – October (Lush rice terraces, private pool villas for <$60)",
    savingsHacks: [
      {
        title: "Songthaew Red Trucks",
        desc: "Hop on the ubiquitous shared red pickup trucks for just 30 THB ($0.80) anywhere within the historic old city moat.",
        icon: "🛺",
        potentialSavings: "Save $20/day over taxis",
      },
      {
        title: "Night Bazaar Street Food Feasts",
        desc: "Award-winning Khao Soi noodles, coconut mango sticky rice, and skewers cost just 40–80 THB ($1.20–$2.30).",
        icon: "🍜",
        potentialSavings: "Save $25/person/day",
      },
      {
        title: "Boutique Lanna Villas",
        desc: "Stay in lavish teak heritage villas with lush private pools in Nimman for a fraction of Western resort rates.",
        icon: "🌴",
        potentialSavings: "Save $150/night",
      },
    ],
  },
  cappadocia: {
    region: "middle-east",
    baseAccommodationUSD: 95,
    baseDiningUSD: 40,
    baseActivitiesUSD: 85,
    baseTransportUSD: 30,
    localCurrencyCode: "TRY",
    localCurrencySymbol: "₺",
    localRateToUSD: 34.0,
    peakMonths: "May – June & September – October",
    bestValueMonths: "April & November (Crisp blue skies, calm winds for balloon flights)",
    savingsHacks: [
      {
        title: "Book Hot Air Balloon on Day 1",
        desc: "Balloon ascents depend on early morning wind conditions. Booking day 1 gives you standby days in case of wind delays.",
        icon: "🎈",
        potentialSavings: "Guarantees flight without surge fee",
      },
      {
        title: "Cave Hotel Rooftop Breakfasts",
        desc: "Virtually all Göreme cave pensions include an extravagant Turkish breakfast spread on terraces overlooking hot air balloons.",
        icon: "☕",
        potentialSavings: "Save $25/day",
      },
      {
        title: "Combined Red & Green Tour Passes",
        desc: "Booking a combined 2-day shared excursion covers Derinkuyu underground city, Ihlara valley, and lunch with hotel pickup.",
        icon: "🏺",
        potentialSavings: "Save $70 on private guides",
      },
    ],
  },
  greece: {
    region: "europe",
    baseAccommodationUSD: 140,
    baseDiningUSD: 65,
    baseActivitiesUSD: 45,
    baseTransportUSD: 30,
    localCurrencyCode: "EUR",
    localCurrencySymbol: "€",
    localRateToUSD: 0.92,
    peakMonths: "July – August (High Summer beach & yacht season)",
    bestValueMonths: "May – June & September – October (Warm 26°C seas, 40% cheaper lodging)",
    savingsHacks: [
      {
        title: "Blue Star Ferries vs Catamarans",
        desc: "Conventional open-deck passenger ferries take just 45 minutes longer than high-speed boats but cost 40% less.",
        icon: "🚢",
        potentialSavings: "Save $45/leg",
      },
      {
        title: "Family-Style Mezze Dining",
        desc: "Order sharing plates of Greek salad, tzatziki, saganaki, fresh calamari, and a half-liter house wine carafe for ~$15/person.",
        icon: "🥗",
        potentialSavings: "Save $30/dinner",
      },
      {
        title: "Shoulder Season Caldera Views",
        desc: "Visiting Santorini in May or late September drops iconic cliffside suites from €650 down to €210/night.",
        icon: "🌅",
        potentialSavings: "Save $440/night",
      },
    ],
  },
};

export const DEFAULT_COST_INDEX: DestinationCostIndex = {
  region: "europe",
  baseAccommodationUSD: 130,
  baseDiningUSD: 60,
  baseActivitiesUSD: 45,
  baseTransportUSD: 25,
  localCurrencyCode: "EUR",
  localCurrencySymbol: "€",
  localRateToUSD: 0.92,
  peakMonths: "June – August",
  bestValueMonths: "May & September",
  savingsHacks: [
    {
      title: "Book Transit 60 Days Early",
      desc: "Lock in advance train and express bus tickets for major regional discounts.",
      icon: "🎫",
      potentialSavings: "Save up to 40%",
    },
    {
      title: "City Tourism Cards",
      desc: "Combine unlimited transit and entry to top attractions in a single pass.",
      icon: "🏛️",
      potentialSavings: "Save $30/person",
    },
    {
      title: "Lunch Set Menus",
      desc: "Top restaurants often offer daily prix-fixe lunch menus at half the dinner rate.",
      icon: "🍽️",
      potentialSavings: "Save $25/person/day",
    },
  ],
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
  season?: TravelSeason;
  partyType?: PartyType;
  customCategoryAdjustments?: {
    lodging?: number;
    dining?: number;
    activities?: number;
    transport?: number;
  };
  targetBudget?: number;
}

export interface DayCostEstimate {
  day: number;
  title: string;
  dailyTotal: number;
  lodging: number;
  dining: number;
  activities: number;
  transport: number;
  note: string;
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
    season = "shoulder",
    partyType = travelers === 1 ? "solo" : "couple",
    customCategoryAdjustments = {},
    targetBudget,
  } = params;

  const costIndex =
    (destinationSlug && DESTINATION_COST_MAP[destinationSlug]) || DEFAULT_COST_INDEX;

  const styleMultiplier = STYLE_MULTIPLIERS[style].factor;
  const seasonConfig = SEASON_CONFIGS[season] || SEASON_CONFIGS.shoulder;
  const partyConfig = PARTY_CONFIGS[partyType] || PARTY_CONFIGS.couple;

  const currency =
    SUPPORTED_CURRENCIES.find((c) => c.code === currencyCode) ||
    SUPPORTED_CURRENCIES[0];

  const rate = currency.rateToUSD;

  // Custom category multipliers (default to 1.0)
  const adjLodging = customCategoryAdjustments.lodging ?? 1.0;
  const adjDining = customCategoryAdjustments.dining ?? 1.0;
  const adjActivities = customCategoryAdjustments.activities ?? 1.0;
  const adjTransport = customCategoryAdjustments.transport ?? 1.0;

  // Room allocation based on party config
  const roomCount = partyConfig.roomMultiplier(travelers);

  // Lodging: scales with season, style, room count and nights
  const lodgingCostUSD =
    costIndex.baseAccommodationUSD *
    styleMultiplier *
    seasonConfig.factor *
    days *
    roomCount *
    adjLodging;

  // Dining: per person per day with party discount & adjustment
  const diningCostUSD =
    costIndex.baseDiningUSD *
    styleMultiplier *
    seasonConfig.factor *
    partyConfig.diningDiscount *
    days *
    travelers *
    adjDining;

  // Activities: per person per day with party discount & adjustment
  const activitiesCostUSD =
    costIndex.baseActivitiesUSD *
    styleMultiplier *
    partyConfig.activityDiscount *
    days *
    travelers *
    adjActivities;

  // Local Transport: per person per day
  const transportCostUSD =
    costIndex.baseTransportUSD *
    styleMultiplier *
    days *
    travelers *
    adjTransport;

  // Contingency & Incidentals (coffee, tips, souvenirs, eSIM buffer)
  const miscellaneousBufferUSD =
    (diningCostUSD + activitiesCostUSD) * 0.11;

  // Flight calculations
  let flightCostUSD = 0;
  if (includeFlights) {
    const originMatrix =
      FLIGHT_MATRIX_USD[flightOrigin] || FLIGHT_MATRIX_USD["north-america"];
    const baseEconomyFlight = originMatrix[costIndex.region] ?? 700;
    const classMultiplier =
      FLIGHT_CLASS_MULTIPLIERS[flightClass]?.factor ?? 1.0;
    // Flights also adjust slightly with peak travel season (+15%)
    const flightSeasonMultiplier = season === "peak" ? 1.15 : season === "off-peak" ? 0.88 : 1.0;
    flightCostUSD =
      baseEconomyFlight * classMultiplier * travelers * flightSeasonMultiplier;
  }

  const totalUSD =
    lodgingCostUSD +
    diningCostUSD +
    activitiesCostUSD +
    transportCostUSD +
    miscellaneousBufferUSD +
    flightCostUSD;

  // Converted totals
  const totalConverted = Math.round(totalUSD * rate);
  const perPersonDailyConverted = Math.max(
    1,
    Math.round((totalUSD / (days * travelers)) * rate)
  );

  // Local currency calculation for dual display
  const localRate = costIndex.localRateToUSD;
  const localTotal = Math.round(totalUSD * localRate);
  const localDailyPerPerson = Math.max(
    1,
    Math.round((totalUSD / (days * travelers)) * localRate)
  );

  // Per-category itemized metrics
  const nightlyRoomRate = Math.round(
    (costIndex.baseAccommodationUSD * styleMultiplier * seasonConfig.factor * adjLodging) * rate
  );
  const dailyDiningPerPerson = Math.round(
    (costIndex.baseDiningUSD * styleMultiplier * seasonConfig.factor * partyConfig.diningDiscount * adjDining) * rate
  );
  const dailyActivitiesPerPerson = Math.round(
    (costIndex.baseActivitiesUSD * styleMultiplier * partyConfig.activityDiscount * adjActivities) * rate
  );
  const dailyTransportPerPerson = Math.round(
    (costIndex.baseTransportUSD * styleMultiplier * adjTransport) * rate
  );
  const flightPerPassenger = includeFlights
    ? Math.round((flightCostUSD / travelers) * rate)
    : 0;

  const breakdown = [
    {
      category: "Lodging & Stays",
      amount: Math.round(lodgingCostUSD * rate),
      percent: Math.round((lodgingCostUSD / totalUSD) * 100),
      icon: "🏨",
      tip: `${roomCount} room${roomCount > 1 ? "s" : ""} across ${days} night${days > 1 ? "s" : ""} (~${currency.symbol}${nightlyRoomRate.toLocaleString()}/room/night)`,
      dailyRate: nightlyRoomRate,
    },
    {
      category: "Dining & Drinks",
      amount: Math.round(diningCostUSD * rate),
      percent: Math.round((diningCostUSD / totalUSD) * 100),
      icon: "🍽️",
      tip: `Breakfast, lunch, signature dinners for ${travelers} guest${travelers > 1 ? "s" : ""} (~${currency.symbol}${dailyDiningPerPerson.toLocaleString()}/person/day)`,
      dailyRate: dailyDiningPerPerson,
    },
    {
      category: "Activities & Admissions",
      amount: Math.round(activitiesCostUSD * rate),
      percent: Math.round((activitiesCostUSD / totalUSD) * 100),
      icon: "🎟️",
      tip: `Key sights, excursions, walking trails, and landmark passes (~${currency.symbol}${dailyActivitiesPerPerson.toLocaleString()}/person/day)`,
      dailyRate: dailyActivitiesPerPerson,
    },
    {
      category: "Local Transport",
      amount: Math.round(transportCostUSD * rate),
      percent: Math.round((transportCostUSD / totalUSD) * 100),
      icon: "🚆",
      tip: `Metro passes, scenic trains, ferries, and local transit (~${currency.symbol}${dailyTransportPerPerson.toLocaleString()}/person/day)`,
      dailyRate: dailyTransportPerPerson,
    },
    ...(includeFlights
      ? [
          {
            category: `Round-Trip Flights (${FLIGHT_CLASS_MULTIPLIERS[flightClass].label})`,
            amount: Math.round(flightCostUSD * rate),
            percent: Math.round((flightCostUSD / totalUSD) * 100),
            icon: "✈️",
            tip: `Estimated round-trip airfare for ${travelers} traveler${travelers > 1 ? "s" : ""} (~${currency.symbol}${flightPerPassenger.toLocaleString()}/ticket)`,
            dailyRate: flightPerPassenger,
          },
        ]
      : []),
    {
      category: "Contingency & Incidentals",
      amount: Math.round(miscellaneousBufferUSD * rate),
      percent: Math.round((miscellaneousBufferUSD / totalUSD) * 100),
      icon: "☕",
      tip: "Coffee, bakery treats, eSIM data, tips, and unexpected spontaneous finds",
      dailyRate: Math.round((miscellaneousBufferUSD / days) * rate),
    },
  ];

  // Day-by-Day Cost Schedule
  const dayByDayEstimate: DayCostEstimate[] = Array.from({ length: days }, (_, i) => {
    const dayNum = i + 1;
    const isFirst = dayNum === 1;
    const isLast = dayNum === days;

    // First day has arrival/check-in transit, last day has departure transit & souvenir buffer
    const dailyLodging = Math.round((lodgingCostUSD / days) * rate);
    const dailyDining = Math.round((diningCostUSD / days) * rate);
    const dailyActivities = Math.round(
      (activitiesCostUSD / (isFirst || isLast ? Math.max(1, days * 0.8) : days)) * rate * (isFirst || isLast ? 0.7 : 1.1)
    );
    const dailyTransport = Math.round((transportCostUSD / days) * rate * (isFirst || isLast ? 1.3 : 0.9));
    const dailyTotal = dailyLodging + dailyDining + dailyActivities + dailyTransport;

    let note = "Core exploration & signature sightseeing";
    if (isFirst) note = "Arrival, airport check-in transfer & welcome dinner";
    else if (isLast) note = "Farewell brunch, souvenir shopping & departure transfer";
    else if (dayNum === 2) note = "Major landmark passes & iconic local food tour";

    return {
      day: dayNum,
      title: `Day ${dayNum}`,
      dailyTotal,
      lodging: dailyLodging,
      dining: dailyDining,
      activities: dailyActivities,
      transport: dailyTransport,
      note,
    };
  });

  // Budget Health Indicator if user sets a target
  let budgetHealth = undefined;
  if (targetBudget && targetBudget > 0) {
    const diff = targetBudget - totalConverted;
    const ratio = totalConverted / targetBudget;
    let status: "under" | "on-track" | "over" = "on-track";
    let tip = "Your plan aligns perfectly with your budget target!";

    if (diff > targetBudget * 0.08) {
      status = "under";
      tip = `Great news! You have a surplus of ${currency.symbol}${Math.abs(diff).toLocaleString()} to upgrade lodging or book premier excursions.`;
    } else if (diff < -targetBudget * 0.05) {
      status = "over";
      const savingsSuggestion =
        season === "peak"
          ? "Switch to Shoulder Season to save up to 20% immediately."
          : style === "luxury"
          ? "Switching to Comfort tier can save up to 50% on accommodation."
          : includeFlights && flightClass !== "economy"
          ? "Selecting Economy class will significantly lower your total cost."
          : "Consider adjusting duration by 1-2 days or dining at local bistros.";
      tip = `Currently ${currency.symbol}${Math.abs(diff).toLocaleString()} over target. Tip: ${savingsSuggestion}`;
    }

    budgetHealth = {
      targetBudget,
      difference: diff,
      status,
      ratio: Math.min(ratio, 1.5),
      percentage: Math.round(ratio * 100),
      tip,
    };
  }

  return {
    currency,
    days,
    travelers,
    style,
    season,
    seasonConfig,
    partyType,
    partyConfig,
    roomCount,
    includeFlights,
    flightOrigin,
    flightClass,
    totalConverted,
    perPersonDailyConverted,
    localCurrency: {
      code: costIndex.localCurrencyCode,
      symbol: costIndex.localCurrencySymbol,
      rateToUSD: costIndex.localRateToUSD,
      totalConverted: localTotal,
      perPersonDailyConverted: localDailyPerPerson,
    },
    savingsHacks: costIndex.savingsHacks,
    bestValueMonths: costIndex.bestValueMonths,
    peakMonths: costIndex.peakMonths,
    itemizedRates: {
      nightlyRoomRate,
      dailyDiningPerPerson,
      dailyActivitiesPerPerson,
      dailyTransportPerPerson,
      flightPerPassenger,
    },
    dayByDayEstimate,
    budgetHealth,
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
  season?: TravelSeason;
  partyType?: PartyType;
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
