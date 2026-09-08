type DestinationHeroProps = {
  destination: {
    name: string;
    country: string;
    tagline: string;
    description: string;
    rating: number;
    temperature: string;
  };
};

export default function DestinationHero({
  destination,
}: DestinationHeroProps) {
  return (
    <section className="px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
          {destination.country}
        </p>
        <h1 className="mt-4 text-6xl font-light tracking-tight md:text-8xl">
          {destination.name}
        </h1>
        <p className="mt-6 text-xl font-light text-gray-500 md:text-2xl">
          {destination.tagline}
        </p>
        <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-gray-600 md:text-lg">
          {destination.description}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-6 py-3">
            <span>⭐</span>
            <span className="font-medium">
              {destination.rating}
            </span>
            <span className="text-gray-400">
              Rating
            </span>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-gray-200 px-6 py-3">
            <span>🌤️</span>
            <span className="font-medium">
              {destination.temperature}
            </span>
            <span className="text-gray-400">
              Temperature
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}