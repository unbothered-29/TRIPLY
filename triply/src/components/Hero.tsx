import Link from "next/link";

export default function Hero() {
  return (
    <main>
      <section className="min-h-[80vh] flex flex-col justify-center px-10 md:px-20 lg:px-32">
        
        <p className="text-sm md:text-base font-medium tracking-[0.3em] text-gray-500">
          YOUR ADVENTURE STARTS HERE
        </p>

        <h1 className="mt-6 text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight">
          Explore the world.
          <br />
          <span className="text-gray-500">Plan your adventure.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg md:text-xl font-light leading-relaxed text-gray-600">
          Discover amazing destinations, save your favorite places,
          and build your perfect trip.
        </p>

        <div className="mt-10">
          <Link
            href="/explore"
            className="inline-block rounded-full border border-black px-8 py-4 text-lg font-light transition duration-300 hover:bg-black hover:text-white"
          >
            Explore destinations →
          </Link>
        </div>

      </section>
    </main>
  );
}