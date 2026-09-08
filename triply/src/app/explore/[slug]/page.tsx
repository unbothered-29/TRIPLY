import { destinations } from "@/data/destinations";
import DestinationHero from "@/components/DestinationHero";
import PopularPlaces from "@/components/PopularPlaces";

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
    <main>
      <DestinationHero destination={destination} />
      <PopularPlaces places={destination.places} />
    </main>
  );
}