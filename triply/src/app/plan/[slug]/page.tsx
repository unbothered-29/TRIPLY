import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { destinations } from "@/data/destinations";
import { generateCustomItinerary } from "@/lib/itineraryGenerator";
import ItineraryView from "@/components/ItineraryView";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
    interests?: string;
  }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    return {
      title: "Itinerary Not Found | Triply",
    };
  }

  return {
    title: `${destination.name} Travel Itinerary | Triply`,
    description: `Customized day-by-day travel itinerary for ${destination.name}, ${destination.country}. Explore curated activities, places, and tips.`,
  };
}

export default async function ItineraryPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const search = await searchParams;

  const destination = destinations.find((item) => item.slug === slug);

  if (!destination) {
    notFound();
  }

  const itinerary = generateCustomItinerary(
    destination,
    search.startDate,
    search.endDate,
    search.interests
  );

  return <ItineraryView itinerary={itinerary} />;
}