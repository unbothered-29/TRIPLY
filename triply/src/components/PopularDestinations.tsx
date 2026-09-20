import Image from "next/image";
import Link from "next/link";
import { destinations } from "@/data/destinations";

export default function PopularDestinations() {
  const featuredDestination = destinations[0];
  const otherDestinations = destinations.slice(1, 5);

  return (
    <section className="border-t border-white/10 bg-black px-6 py-24 text-white md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        {/* Section heading */}

        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">
              Popular destinations
            </p>

            <h2 className="mt-4 text-4xl font-light tracking-tight md:text-6xl">
              Places worth going.
            </h2>
          </div>

          <Link
            href="/explore"
            className="group inline-flex w-fit items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            Explore all destinations

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Destination layout */}

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* Featured destination */}

          <Link
            href={`/explore/${featuredDestination.slug}`}
            className="group relative min-h-[560px] overflow-hidden rounded-3xl border border-white/10"
          >
            <Image
              src={featuredDestination.image}
              alt={featuredDestination.name}
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
            />

            {/* Image overlay */}

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

            {/* Content */}

            <div className="absolute inset-x-0 bottom-0 p-8 text-white md:p-10">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/50">
                {featuredDestination.country}
              </p>

              <h3 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                {featuredDestination.name}
              </h3>

              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/60 md:text-base">
                {featuredDestination.tagline}
              </p>

              <div className="mt-6 flex items-center gap-2 text-sm text-white/50 transition group-hover:text-white">
                Explore destination

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </div>
            </div>
          </Link>

          {/* Smaller destinations */}

          <div className="grid gap-6 sm:grid-cols-2">
            {otherDestinations.map((destination) => (
              <Link
                key={destination.slug}
                href={`/explore/${destination.slug}`}
                className="group relative min-h-[267px] overflow-hidden rounded-3xl border border-white/10"
              >
                <Image
                  src={destination.image}
                  alt={destination.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-105"
                />

                {/* Image overlay */}

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />

                {/* Content */}

                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/50">
                    {destination.country}
                  </p>

                  <h3 className="mt-2 text-2xl font-light tracking-tight">
                    {destination.name}
                  </h3>

                  <div className="mt-3 text-xs text-white/50 transition group-hover:text-white">
                    Explore →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Bottom link */}

        <div className="mt-10 border-t border-white/10 pt-8">
          <Link
            href="/explore"
            className="group flex items-center justify-between text-sm"
          >
            <span className="text-white/30">
              Discover more destinations
            </span>

            <span className="flex items-center gap-2 text-white/70 transition group-hover:text-white">
              View all

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}