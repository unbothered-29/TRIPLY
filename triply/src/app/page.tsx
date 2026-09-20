import Hero from "@/components/Hero";
import PopularDestinations from "@/components/PopularDestinations";
import Features from "@/components/Features";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <PopularDestinations />
      <Features />
      <CTA />
    </main>
  );
}