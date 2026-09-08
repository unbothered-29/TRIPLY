import DestinationCard from "./DestinationCard";

const destinations = [
  {
    name: "Norway",
    country: "Norway",
    slug: "norway",
  },
  {
    name: "Mount-Fuji",
    country: "Japan",
    slug: "mount-fuji",
  },
  {
    name: "Paris",
    country: "France",
    slug: "paris",
  },
];

export default function PopularDestinations() {
  return (
    <section className="px-10 py-20 md:px-20 lg:px-32">
      <div className="mx-auto max-w-7xl">

        <h2 className="text-3xl md:text-4xl font-light tracking-tight">
          Popular Destinations
        </h2>

        <p className="mt-3 max-w-xl text-gray-500 font-light">
          Explore some of the worlds most exciting destinations.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard
              key={destination.slug}
              {...destination}
            />
          ))}
        </div>

      </div>
    </section>
  );
}