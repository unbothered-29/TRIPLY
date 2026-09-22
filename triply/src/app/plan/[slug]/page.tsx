import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { destinations } from "@/data/destinations";

type ItineraryDay = {
  day: number;
  title: string;
  description: string;
  places: string[];
};

const itineraries: Record<string, ItineraryDay[]> = {
  japan: [
    {
      day: 1,
      title: "Arrive in Tokyo",
      description:
        "Settle into Tokyo and spend your first evening getting familiar with the city.",
      places: ["Shibuya Crossing", "Hachiko Statue", "Shibuya Sky"],
    },
    {
      day: 2,
      title: "Tokyo in motion",
      description:
        "Explore the contrast between traditional Tokyo and its modern neighborhoods.",
      places: ["Meiji Shrine", "Harajuku", "Shinjuku"],
    },
    {
      day: 3,
      title: "A slower side of Tokyo",
      description:
        "Take a quieter day exploring historic streets, small shops, and local food.",
      places: ["Asakusa", "Senso-ji Temple", "Ueno"],
    },
    {
      day: 4,
      title: "Travel to Kyoto",
      description:
        "Leave Tokyo behind and travel south toward Kyoto, Japan's historic heart.",
      places: ["Shinkansen", "Gion", "Yasaka Shrine"],
    },
    {
      day: 5,
      title: "Discover Kyoto",
      description:
        "Spend the day walking through temples, gardens, and traditional neighborhoods.",
      places: ["Fushimi Inari", "Kiyomizu-dera", "Gion"],
    },
  ],
};

function createItinerary(
  destination: (typeof destinations)[number]
): ItineraryDay[] {
  const places = destination.places;

  return [
    {
      day: 1,
      title: `Arrive in ${destination.name}`,
      description: `Settle into ${destination.name}, take your time getting familiar with the surroundings, and enjoy a relaxed first day.`,
      places: [places[0].name],
    },
    {
      day: 2,
      title: `Discover ${places[0].name}`,
      description: `Spend the day exploring ${places[0].name} and experiencing one of the highlights of ${destination.name}.`,
      places: [places[0].name],
    },
    {
      day: 3,
      title: `Explore ${places[1].name}`,
      description: `Continue your journey with a visit to ${places[1].name}, taking time to experience the landscape, culture, and atmosphere.`,
      places: [places[1].name],
    },
    {
      day: 4,
      title: `A day around ${places[2].name}`,
      description: `Slow down and discover ${places[2].name}, one of the memorable places worth experiencing during your journey.`,
      places: [places[2].name],
    },
    {
      day: 5,
      title: `One last day in ${destination.name}`,
      description: `Spend your final day revisiting a favorite place, discovering something new, and enjoying your last moments in ${destination.name}.`,
      places: [
        places[0].name,
        places[1].name,
        places[2].name,
      ],
    },
  ];
}

export default async function ItineraryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const destination = destinations.find(
    (item) => item.slug === slug
  );

  if (!destination) {
    notFound();
  }

  const itinerary =
    itineraries[slug] ?? createItinerary(destination);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="px-4 pb-16 pt-28 md:px-8 md:pt-32 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <Link
            href={`/explore/${destination.slug}`}
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-white/30 transition hover:text-white"
          >
            <span>←</span>
            Back to {destination.name}
          </Link>

          <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03] lg:grid-cols-[1.1fr_0.9fr]">
            {/* Image */}
            <div className="relative h-[420px] lg:h-[600px]">
              <Image
                src={destination.image}
                alt={`${destination.name}, ${destination.country}`}
                fill
                priority
                className="object-cover transition duration-1000 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/50">
                  Your journey
                </p>

                <h1 className="mt-3 text-6xl font-light tracking-[-0.04em] md:text-8xl">
                  {destination.name}
                </h1>
              </div>
            </div>

            {/* Introduction */}
            <div className="flex flex-col justify-between p-8 md:p-12 lg:p-16">
              <div>
                <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
                  {destination.country}
                </p>

                <h2 className="mt-8 max-w-md text-3xl font-light leading-tight md:text-4xl">
                  A journey through{" "}
                  <span className="text-white/30">
                    {destination.name}.
                  </span>
                </h2>

                <p className="mt-6 max-w-md text-sm font-light leading-relaxed text-white/40">
                  {destination.description}
                </p>
              </div>

              <div className="mt-12 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                    Duration
                  </span>

                  <span className="text-sm text-white/70">
                    {itinerary.length} days
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                    Destination
                  </span>

                  <span className="text-sm text-white/70">
                    {destination.name}
                  </span>
                </div>
              </div>

              {/* Plan CTA */}
              <Link
                href="/plan"
                className="group mt-8 flex w-fit items-center gap-4 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition duration-300 hover:bg-white/80"
              >
                <span>Plan your trip</span>

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Itinerary */}
      <section className="px-6 pb-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-white/30" />

              <p className="text-[10px] uppercase tracking-[0.4em] text-white/30">
                The itinerary
              </p>
            </div>

            <h2 className="mt-6 text-4xl font-light tracking-tight md:text-5xl">
              Your days in {destination.name}.
            </h2>

            <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-white/35">
              A simple five-day route designed to help you
              experience the highlights while leaving room to
              explore at your own pace.
            </p>
          </div>

          <div className="divide-y divide-white/10">
            {itinerary.map((day) => (
              <article
                key={day.day}
                className="grid gap-8 py-10 md:grid-cols-[100px_1fr]"
              >
                {/* Day number */}
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                    Day
                  </p>

                  <p className="mt-2 text-4xl font-light text-white/70">
                    {String(day.day).padStart(2, "0")}
                  </p>
                </div>

                {/* Day content */}
                <div>
                  <h3 className="text-2xl font-light md:text-3xl">
                    {day.title}
                  </h3>

                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/40">
                    {day.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {day.places.map((place) => (
                      <span
                        key={place}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-white/50"
                      >
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="border-t border-white/10 px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[10px] uppercase tracking-[0.4em] text-white/25">
            Your journey starts here
          </p>

          <h2 className="mx-auto mt-6 max-w-2xl text-4xl font-light leading-tight md:text-6xl">
            Make memories worth{" "}
            <span className="text-white/30">
              remembering.
            </span>
          </h2>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="/plan"
              className="group inline-flex items-center gap-4 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition duration-300 hover:bg-white/80"
            >
              Plan your trip

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href={`/explore/${destination.slug}`}
              className="group inline-flex items-center gap-4 rounded-full border border-white/15 px-7 py-3.5 text-sm text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Explore {destination.name}

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}