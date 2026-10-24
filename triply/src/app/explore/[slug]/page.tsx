import { destinations } from "@/data/destinations";
import DestinationHero from "@/components/DestinationHero";
import PopularPlaces from "@/components/PopularPlaces";
import TripBudgetCalculator from "@/components/TripBudgetCalculator";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}:{
  params:Promise<{slug:string}>;
}):Promise<Metadata>{
    const {slug}=await params;

    const destination=destinations.find(
      (destination) => destination.slug === slug
      );

  if (!destination) {
    return {
      title: "Destination Not Found | Triply",
    };
  }

  return {
    title: `${destination.name} | Triply`,
    description: destination.description,
  };
}


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
    <main className="bg-black text-white">
      <DestinationHero destination={destination} />
      <PopularPlaces places={destination.places} />

      {/* Interactive Trip Cost & Currency Converter */}
      <section className="border-t border-white/10 bg-black px-6 py-24 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <TripBudgetCalculator
            initialDestinationSlug={destination.slug}
            initialDays={5}
            initialTravelers={2}
          />
        </div>
      </section>
    </main>
  );
}