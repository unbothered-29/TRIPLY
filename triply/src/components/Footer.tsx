import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[radial-gradient(circle_at_50%_0%,#303030_0%,#181818_40%,#080808_100%)] text-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-24">
        <div className="grid gap-16 md:grid-cols-[1.5fr_1fr]">

          {/* Left */}
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/30">
              Somewhere out there
            </p>

            <h2 className="mt-8 max-w-3xl text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl">
              Your next
              <br />
              <span className="text-white/30">
                adventure awaits.
              </span>
            </h2>

            <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-white/40 md:text-base">
              The world is bigger than the places you've already
              seen. Discover somewhere new, find your inspiration,
              and start planning your next journey.
            </p>

            <Link
              href="/explore"
              className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/20 px-7 py-3.5 text-sm text-white transition duration-300 hover:border-white hover:bg-white hover:text-black"
            >
              Start exploring

              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>

          {/* Right */}
          <div className="grid grid-cols-2 gap-10 md:pt-2">

            {/* Explore */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                Explore
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Home
                </Link>

                <Link
                  href="/explore"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Destinations
                </Link>

                <Link
                  href="/about"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  About Triply
                </Link>
              </div>
            </div>

            {/* Triply */}
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                Triply
              </p>

              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/explore"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Discover
                </Link>

                <Link
                  href="/explore"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Plan a trip
                </Link>

                <Link
                  href="/about"
                  className="text-sm text-white/50 transition hover:text-white"
                >
                  Our story
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-24 border-t border-white/10 pt-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition duration-300 group-hover:bg-white group-hover:text-black">
                <span className="text-sm">✦</span>
              </div>

              <span className="text-xl font-medium tracking-tight">
                Triply
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-xs uppercase tracking-[0.25em] text-white/20">
              Discover. Plan. Explore.
            </p>

            {/* Copyright */}
            <p className="text-xs text-white/20">
              © 2026 Triply
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}