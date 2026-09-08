type PopularPlacesProps = {
  places: {
    name: string;
    description: string;
  }[];
};

export default function PopularPlaces({
  places,
}: PopularPlacesProps) {
  return (
    <section className="hover:-translate-y-1 hover:shadow-lg border-t border-gray-100 px-6 py-20 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
            Discover
          </p>
          <h2 className="mt-3 text-3xl font-light tracking-tight md:text-4xl">
            Popular Places
          </h2>
          <p className="mt-3 max-w-xl text-gray-500">
            Explore some of the best places worth visiting.
          </p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {places.map((place) => (
            <article
              key={place.name}
              className="group rounded-2xl border border-gray-200 p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="text-sm text-gray-400">
                Place to visit
              </p>
              <h3 className="mt-3 text-2xl font-light">
                {place.name}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-500">
                {place.description}
              </p>
              <div className="mt-6 text-sm text-gray-400 transition group-hover:text-black">
                Explore place →
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}