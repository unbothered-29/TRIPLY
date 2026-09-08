import { destinations } from "@/data/destinations";

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const destination = destinations.find(
    (destination) => destination.slug === slug
  );

  if (!destination) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center px-6">
        <h1 className="text-3xl font-light text-gray-500">
          Destination not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen">

      <section className="px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">

          <div className="max-w-3xl">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
              {destination.country}
            </p>

            <h1 className="mt-4 text-5xl font-light tracking-tight md:text-7xl">
              {destination.name}
            </h1>

            <p className="mt-8 text-lg font-light leading-relaxed text-gray-600 md:text-xl">
              {destination.description}
            </p>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">

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


      {/* Popular Places */}
      <section className="border-t border-gray-100 px-6 py-20 md:px-12 lg:px-24">
        <div className="mx-auto max-w-6xl">

          <h2 className="text-3xl font-light tracking-tight md:text-4xl">
            Popular Places
          </h2>

          <p className="mt-3 text-gray-500">
            Places worth exploring in {destination.name}.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-3">

            {destination.places.map((place) => (
              <article
                key={place.name}
                className="group rounded-2xl border border-gray-200 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-medium">
                  {place.name}
                </h3>

                <p className="mt-4 leading-relaxed text-gray-500">
                  {place.description}
                </p>

                <p className="mt-6 text-sm text-gray-400 transition group-hover:text-black">
                  Explore place →
                </p>
              </article>
            ))}

          </div>
        </div>
      </section>

    </main>
  );
}