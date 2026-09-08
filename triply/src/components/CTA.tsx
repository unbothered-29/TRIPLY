import Link from "next/link";
import Image from "next/image";

export default function CTA() {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-24">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl">
        <Image
          src="/images/cta-image.jpg"
          alt="Beautiful travel destination at sunset"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex min-h-[550px] flex-col items-center justify-center px-6 py-20 text-center text-white">

          <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
            Start exploring
          </p>
          <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-tight md:text-6xl">
            Your next adventure is waiting.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/80">
            Discover new places, find inspiration, and start planning your
            next journey.
          </p>
          <div className="mt-10">
            <Link
              href="/explore"
              className="inline-block rounded-full bg-white px-8 py-4 text-lg font-medium text-black transition duration-300 hover:bg-gray-200"
            >
              Explore destinations →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}