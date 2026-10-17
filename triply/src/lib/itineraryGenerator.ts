import { destinations } from "@/data/destinations";

export type Destination = (typeof destinations)[number];

export interface ActivitySlot {
  period: "Morning" | "Afternoon" | "Evening";
  time: string;
  title: string;
  description: string;
  category: "Nature" | "Food" | "Culture" | "Adventure" | "Sightseeing" | "Leisure";
  location?: string;
  image?: string;
}

export interface DaySchedule {
  day: number;
  dateLabel: string;
  title: string;
  theme: string;
  slots: ActivitySlot[];
}

export interface GeneratedItinerary {
  destination: Destination;
  durationDays: number;
  dateRangeText: string;
  interests: string[];
  days: DaySchedule[];
  travelTips: {
    packing: string[];
    transport: string;
    localEtiquette: string;
  };
}

const interestActivities: Record<
  string,
  {
    morning: { title: string; desc: string; category: ActivitySlot["category"] }[];
    afternoon: { title: string; desc: string; category: ActivitySlot["category"] }[];
    evening: { title: string; desc: string; category: ActivitySlot["category"] }[];
  }
> = {
  Nature: {
    morning: [
      {
        title: "Scenic Sunrise Trail & Viewpoint",
        desc: "Begin early to catch crisp morning light across panoramic landscapes and serene vistas.",
        category: "Nature",
      },
      {
        title: "Botanical Sanctuary & Valley Walk",
        desc: "Walk through indigenous flora, pristine waterways, and tranquil open greenery.",
        category: "Nature",
      },
    ],
    afternoon: [
      {
        title: "Lakeside Exploration & Forest Trails",
        desc: "Breathe in fresh mountain air while exploring peaceful woodland paths and waterside viewpoints.",
        category: "Nature",
      },
      {
        title: "Coastal Panorama & Wildlife Observation",
        desc: "Discover cliffside outlooks and observe native birds and wildlife in their natural habitat.",
        category: "Nature",
      },
    ],
    evening: [
      {
        title: "Golden Hour Lookout & Stargazing",
        desc: "Watch the sun dip below the horizon followed by crystal-clear stargazing far from city glare.",
        category: "Nature",
      },
    ],
  },
  Food: {
    morning: [
      {
        title: "Artisanal Bakery & Morning Espresso Crawl",
        desc: "Sample fresh local pastries, roasted coffee, and artisanal breakfast delicacies at a vibrant neighborhood café.",
        category: "Food",
      },
      {
        title: "Bustling Farmers & Morning Produce Market",
        desc: "Stroll between colorful market stalls tasting ripe regional fruits, cheeses, and freshly prepared bites.",
        category: "Food",
      },
    ],
    afternoon: [
      {
        title: "Street Food Tour & Hidden Eateries",
        desc: "Indulge in beloved local street food, historic bistros, and iconic signature dishes loved by locals.",
        category: "Food",
      },
      {
        title: "Regional Tasting & Cooking Workshop",
        desc: "Learn traditional preparation techniques paired with olive oils, wines, or regional craft beverages.",
        category: "Food",
      },
    ],
    evening: [
      {
        title: "Candlelit Waterfront or Rooftop Dining",
        desc: "End the day with an unforgettable multi-course culinary experience featuring regional ingredients.",
        category: "Food",
      },
    ],
  },
  Culture: {
    morning: [
      {
        title: "Historic Monuments & Sacred Architecture",
        desc: "Visit revered landmarks and architectural wonders before the midday rush.",
        category: "Culture",
      },
      {
        title: "Old Town Cobblestone Exploration",
        desc: "Wander through centuries-old quarters discovering hidden courtyards, artisan ateliers, and storied walls.",
        category: "Culture",
      },
    ],
    afternoon: [
      {
        title: "Curated Art Museum & Heritage Galleries",
        desc: "Dive deep into regional history, masterpieces, and world-class exhibitions with a local docent perspective.",
        category: "Culture",
      },
      {
        title: "Artisan Workshops & Craft Traditions",
        desc: "Meet local sculptors, potters, or weavers keeping historic traditions alive in their workshops.",
        category: "Culture",
      },
    ],
    evening: [
      {
        title: "Live Cultural Performance & Evening Promenade",
        desc: "Experience acoustic music, traditional theater, or join the leisurely evening passeggiata.",
        category: "Culture",
      },
    ],
  },
  Adventure: {
    morning: [
      {
        title: "High-Elevation Trek or Kayak Expedition",
        desc: "Kickstart your adrenaline with an early mountain hike or paddling excursion along scenic waters.",
        category: "Adventure",
      },
      {
        title: "Off-the-Beaten-Path Ridge Exploration",
        desc: "Navigate rugged terrain and dramatic rocky ridges offering thrilling drops and sweeping sights.",
        category: "Adventure",
      },
    ],
    afternoon: [
      {
        title: "Outdoor Thrills & Active Discovery",
        desc: "Engage in rock scrambling, coastal canyoning, or biking across undulating terrain.",
        category: "Adventure",
      },
      {
        title: "Hidden Caves & Wilderness Traverse",
        desc: "Explore natural grottos, hidden waterfalls, or suspension bridges tucked deep in nature.",
        category: "Adventure",
      },
    ],
    evening: [
      {
        title: "Campfire Fireside Chill or Harbor Sunset",
        desc: "Relax your muscles, recount the day's triumphs, and take in the cool evening breeze under the stars.",
        category: "Adventure",
      },
    ],
  },
};

export function generateCustomItinerary(
  destination: Destination,
  startDateStr?: string,
  endDateStr?: string,
  interestsInput?: string | string[]
): GeneratedItinerary {
  let daysCount = 5;
  let dateRangeText = "Flexible 5-Day Journey";
  let startParsed: Date | null = null;

  if (startDateStr) {
    const s = new Date(startDateStr);
    if (!isNaN(s.getTime())) {
      startParsed = s;
      if (endDateStr) {
        const e = new Date(endDateStr);
        if (!isNaN(e.getTime()) && e >= s) {
          const diffTime = Math.abs(e.getTime() - s.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
          daysCount = Math.max(1, Math.min(diffDays, 14));

          const sFormat = s.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const eFormat = e.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          dateRangeText = `${sFormat} – ${eFormat}`;
        }
      } else {
        const sFormat = s.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        dateRangeText = `Starting ${sFormat} (${daysCount} Days)`;
      }
    }
  }

  // Parse interests
  let parsedInterests: string[] = [];
  if (Array.isArray(interestsInput)) {
    parsedInterests = interestsInput.filter(Boolean);
  } else if (typeof interestsInput === "string" && interestsInput.trim()) {
    parsedInterests = interestsInput
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);
  }

  if (parsedInterests.length === 0) {
    parsedInterests = [destination.category || "Sightseeing", "Culture"];
  }

  const places = destination.places || [];

  const days: DaySchedule[] = [];

  for (let i = 1; i <= daysCount; i++) {
    let dayDateLabel = `Day ${i}`;
    if (startParsed) {
      const currentDate = new Date(startParsed);
      currentDate.setDate(currentDate.getDate() + (i - 1));
      dayDateLabel = currentDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }

    const interestIndex = (i - 1) % parsedInterests.length;
    const currentInterest = parsedInterests[interestIndex] || "Nature";
    const interestPool = interestActivities[currentInterest] || interestActivities.Nature;

    const placeForDay = places.length > 0 ? places[(i - 1) % places.length] : undefined;

    let dayTitle: string;
    let dayTheme: string;

    if (i === 1) {
      dayTitle = `Arrive in ${destination.name}`;
      dayTheme = "Orientation, gentle strolls & welcome dinner";
    } else if (i === daysCount) {
      dayTitle = `Farewell & Memorable Highlights`;
      dayTheme = "Sunrise panorama, artisan shopping & celebratory finale";
    } else if (placeForDay) {
      dayTitle = `Discovering ${placeForDay.name}`;
      dayTheme = `${currentInterest} Immersion & Local Exploration`;
    } else {
      dayTitle = `${destination.name} in Depth`;
      dayTheme = `${currentInterest} & Hidden Wonders`;
    }

    const morningTemplate = interestPool.morning[(i - 1) % interestPool.morning.length];
    const afternoonTemplate = interestPool.afternoon[(i - 1) % interestPool.afternoon.length];
    const eveningTemplate = interestPool.evening[(i - 1) % interestPool.evening.length];

    const slots: ActivitySlot[] = [
      {
        period: "Morning",
        time: "09:00 AM – 12:30 PM",
        title: placeForDay && i % 2 === 0 ? `Morning at ${placeForDay.name}` : morningTemplate.title,
        description: placeForDay && i % 2 === 0 ? placeForDay.description : morningTemplate.desc,
        category: morningTemplate.category,
        location: placeForDay && i % 2 === 0 ? placeForDay.name : destination.name,
        image: placeForDay && i % 2 === 0 ? placeForDay.image : undefined,
      },
      {
        period: "Afternoon",
        time: "02:00 PM – 05:30 PM",
        title: placeForDay && i % 2 !== 0 ? `Explore ${placeForDay.name}` : afternoonTemplate.title,
        description: placeForDay && i % 2 !== 0 ? placeForDay.description : afternoonTemplate.desc,
        category: afternoonTemplate.category,
        location: placeForDay && i % 2 !== 0 ? placeForDay.name : `${destination.name} Center`,
        image: placeForDay && i % 2 !== 0 ? placeForDay.image : undefined,
      },
      {
        period: "Evening",
        time: "07:00 PM – 09:30 PM",
        title: eveningTemplate.title,
        description: eveningTemplate.desc,
        category: eveningTemplate.category,
        location: `${destination.name} Dining District`,
      },
    ];

    days.push({
      day: i,
      dateLabel: dayDateLabel,
      title: dayTitle,
      theme: dayTheme,
      slots,
    });
  }

  // Generate customized travel tips based on temperature and category
  const tempNumber = parseInt(destination.temperature || "15", 10);
  const isCold = tempNumber < 10;
  const isWarm = tempNumber >= 20;

  const packing = [
    isCold
      ? "Thermal layers, windproof insulated jacket, and warm gloves"
      : isWarm
      ? "Light breathable linens, sunglasses, and high-SPF sunscreen"
      : "Versatile light layers, compact rain jacket, and evening pullover",
    "Comfortable broken-in walking shoes for cobblestones and natural trails",
    "Universal power adapter and portable battery bank for full exploration days",
    "Reusable insulated water flask",
  ];

  const transport =
    destination.category === "Cities"
      ? "Extremely walkable with comprehensive metro, tram, and contactless transit systems."
      : "Scenic regional rail, scheduled ferry boats, and local rental electric vehicles are recommended.";

  const localEtiquette =
    destination.country === "Japan"
      ? "Remove shoes when entering traditional rooms and temples, walk on the left, and keep phone calls quiet on transit."
      : destination.country === "Norway"
      ? "Respect the 'Right to Roam' (Allemannsretten) by keeping trails pristine and leaving zero trace."
      : destination.country === "France" || destination.country === "Italy"
      ? "Greet shopkeepers with a friendly 'Bonjour' or 'Buongiorno' upon entering boutiques and cafés."
      : "Respect sacred grounds, observe quiet hours in residential alleyways, and support neighborhood merchants.";

  return {
    destination,
    durationDays: daysCount,
    dateRangeText,
    interests: parsedInterests,
    days,
    travelTips: {
      packing,
      transport,
      localEtiquette,
    },
  };
}
