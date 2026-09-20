import Image from "next/image";
import SaveButton from "@/components/SaveButton";

type DestinationHeroProps = {
  destination: {
    name: string;
    country: string;
    tagline: string;
    description: string;
    rating: number;
    temperature: string;
    image: string;
  };
};

export default function DestinationHero({
  destination,
}: DestinationHeroProps) {
  return (
    <section className="px-4 pb-12 pt-28 md:px-8 md:pb-16 md:pt-32 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between px-2">
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

        <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.02]">
          {/* Image */}
          <div className="relative h-[620px] md:h-[720px] lg:h-[760px]">
            <Image
              src={destination.image}
              alt={`${destination.name}, ${destination.country}`}
              fill
              priority
              className="object-cover transition duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />

            {/* Overall image tint */}
            <div className="absolute inset-0 bg-black/20" />

            {/* Top fade */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/50 to-transparent" />

            {/* Bottom cinematic gradient */}
            <div className="absolute inset-x-0 bottom-0 h-[75%] bg-gradient-to-t from-black via-black/70 to-transparent" />

            {/* Subtle side vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,transparent_0%,rgba(0,0,0,0.18)_100%)]" />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0">
              <div className="p-7 md:p-12 lg:p-16">
                {/* Country */}
                <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-white/50" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/60">
                    {destination.country}
                  </p>
                </div>

                {/* Title */}
                <h1 className="mt-5 max-w-5xl text-6xl font-light leading-[0.9] tracking-[-0.05em] text-white md:text-8xl lg:text-[9rem]">
                  {destination.name}
                </h1>

                {/* Tagline */}
                <p className="mt-7 max-w-2xl text-lg font-light leading-relaxed text-white/70 md:text-2xl">
                  {destination.tagline}
                </p>

                {/* Description */}
                <p className="mt-5 max-w-3xl text-sm font-light leading-relaxed text-white/45 md:text-base">
                  {destination.description}
                </p>

                {/* Bottom information */}
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {/* Rating */}
                  <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-5 py-3 backdrop-blur-xl">
                    <span className="text-sm">★</span>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                        Rating
                      </p>

                      <p className="mt-0.5 text-sm text-white/80">
                        {destination.rating}
                      </p>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div className="flex items-center gap-3 rounded-full border border-white/15 bg-black/20 px-5 py-3 backdrop-blur-xl">
                    <span className="text-sm">°</span>

                    <div>
                      <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
                        Temperature
                      </p>

                      <p className="mt-0.5 text-sm text-white/80">
                        {destination.temperature}
                      </p>
                    </div>
                  </div>

                  {/* Save */}
                  <SaveButton />
                </div>
              </div>
            </div>

            {/* Image index / decorative detail */}
            <div className="absolute right-7 top-7 hidden md:block">
              <div className="flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />

                <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">
                  Explore
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}