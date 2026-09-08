import Image from "next/image";

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
    <section className="px-6 py-10 md:px-12 lg:px-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <div className="relative h-[600px] md:h-[700px]">
          <Image
            src={destination.image}
            alt={`${destination.name}, ${destination.country}`}
            fill
            priority
            className="object-cover"
          />
        <div className="absolute inset-1 rounded-[3%] bg-black/40" />
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-8 text-white md:p-14 lg:p-16">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                {destination.country}
              </p>
              <h1 className="mt-4 text-6xl font-light tracking-tight md:text-8xl">
                {destination.name}
              </h1>
              <p className="mt-4 max-w-2xl text-xl font-light text-white/80 md:text-2xl">
                {destination.tagline}
              </p>
              <p className="mt-6 max-w-2xl text-base font-light leading-relaxed text-white/70">
                {destination.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <div className="rounded-full border border-white/30 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  ⭐ {destination.rating} Rating
                </div>
                <div className="rounded-full border border-white/30 bg-white/10 px-5 py-3 backdrop-blur-sm">
                  🌤️ {destination.temperature}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}