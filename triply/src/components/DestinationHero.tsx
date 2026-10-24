import Image from "next/image";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";

type DestinationHeroProps = {
  destination: {
    slug: string;
    name: string;
    country: string;
    tagline: string;
    description: string;
    rating: number;
    temperature: string;
    image: string;
    category?: string;
  };
};

export default function DestinationHero({
  destination,
}: DestinationHeroProps) {
  return (
    <section className="px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-16 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Section label */}
        <div className="mb-6 flex items-center justify-between px-2 animate-fade-in">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-white/30" />
            <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
              Destination guide
            </p>
          </div>

          <p className="hidden text-[9px] uppercase tracking-[0.3em] text-white/20 md:block">
            Triply / Explore
          </p>
        </div>

        {/* Hero */}
        <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-700 hover:border-white/20">
          <div className="relative h-[620px] md:h-[720px] lg:h-[760px]">
            <Image
              src={destination.image}
              alt={`${destination.name}, ${destination.country}`}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
            />

            {/* Image overlay */}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[80%] bg-gradient-to-t from-black via-black/75 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,transparent_0%,rgba(0,0,0,0.25)_100%)]" />

            {/* Content with staggered entrance */}
            <div className="absolute inset-x-0 bottom-0">
              <div className="p-7 md:p-12 lg:p-16">
                {/* Country */}
                <div className="flex items-center gap-3 animate-fade-up opacity-0" style={{ animationDelay: "100ms" }}>
                  <span className="h-px w-6 bg-white/50" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/70">
                    {destination.country}
                  </p>
                </div>

                {/* Destination name */}
                <h1
                  className="mt-5 max-w-5xl text-6xl font-light leading-[0.9] tracking-[-0.05em] text-white md:text-8xl lg:text-[9rem] animate-fade-up opacity-0"
                  style={{ animationDelay: "200ms" }}
                >
                  {destination.name}
                </h1>

                {/* Tagline */}
                <p
                  className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-white/80 md:text-2xl animate-fade-up opacity-0"
                  style={{ animationDelay: "320ms" }}
                >
                  {destination.tagline}
                </p>

                {/* Description */}
                <p
                  className="mt-5 max-w-3xl text-sm font-light leading-relaxed text-white/50 md:text-base animate-fade-up opacity-0"
                  style={{ animationDelay: "440ms" }}
                >
                  {destination.description}
                </p>

                {/* Details + actions */}
                <div
                  className="mt-8 flex flex-wrap items-center gap-3 animate-fade-up opacity-0"
                  style={{ animationDelay: "560ms" }}
                >
                  {/* Rating */}
                  <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 py-3 backdrop-blur-xl transition-colors hover:border-white/30">
                    <span className="text-sm text-amber-300">★</span>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                        Rating
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-white/90">
                        {destination.rating}
                      </p>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/30 px-5 py-3 backdrop-blur-xl transition-colors hover:border-white/30">
                    <span className="text-sm text-sky-300">°</span>
                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
                        Temperature
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-white/90">
                        {destination.temperature}
                      </p>
                    </div>
                  </div>

                  {/* Save */}
                  <SaveButton slug={destination.slug} />

                  {/* Plan your trip */}
                  <Link
                    href={`/plan/${destination.slug}`}
                    className="group/plan flex items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-medium text-black shadow-[0_0_20px_rgba(255,255,255,0.25)] transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] active:scale-95"
                  >
                    <span>Plan this trip</span>
                    <span className="transition-transform duration-300 group-hover/plan:translate-x-1">
                      →
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Explore badge */}
            <div className="absolute right-7 top-7 hidden md:block animate-fade-in">
              <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/40 px-4 py-2 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[9px] uppercase tracking-[0.3em] text-white/60">
                  {destination.category || "Explore"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}