import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl rounded-3xl bg-gray-100 px-8 py-20 text-center md:px-16">

        <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-700">
          Start exploring
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-medium tracking-tight text-gray-900 md:text-6xl">
            Your next adventure is waiting.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-gray-500">
          Discover new places, find inspiration, and start planning your
          next journey.
        </p>

        <div className="mt-10">
          <Link
            href="/explore"
            className="inline-block rounded-full bg-black px-8 py-4 text-lg font-light text-white transition duration-300 hover:bg-gray-800"
          >
            Explore destinations →
          </Link>
        </div>

      </div>
    </section>
  );
}