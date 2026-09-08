import { destinations } from "@/data/destinations";
import DestinationHero from "@/components/DestinationHero";
import PopularPlaces from "@/components/PopularPlaces";
import { notFound } from "next/navigation";

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
        notFound();
       }

  return (
    <main>
      <DestinationHero destination={destination} />
      <PopularPlaces places={destination.places} />
    </main>
  );
}