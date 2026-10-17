import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[radial-gradient(circle_at_50%_0%,#202020_0%,#101010_40%,#050505_100%)] text-white overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12 lg:px-24">
        <Reveal>
          <div className="grid gap-16 md:grid-cols-[1.5fr_1fr]">
            {/* Main CTA */}
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/30">
                Somewhere out there
              </p>

              <h2 className="mt-8 max-w-3xl text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl">
                Your next
                <br />
                <span className="bg-gradient-to-r from-white via-white/80 to-white/30 bg-clip-text text-transparent">
                  adventure awaits.
                </span>
              </h2>

              <p className="mt-8 max-w-md text-sm font-light leading-relaxed text-white/40 md:text-base">
                The world is bigger than the places you&apos;ve already
                seen. Discover somewhere new, find your inspiration,
                and start planning your next journey.
              </p>

              <Link
                href="/plan"
                className="group mt-10 inline-flex items-center gap-4 rounded-full border border-white/20 bg-white/[0.04] px-7 py-3.5 text-sm text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95"
              >
                <span>Plan a trip</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>

            {/* Navigation */}
            <div className="grid grid-cols-2 gap-10 md:pt-2">
              {/* Explore */}
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/25">
                  Explore
                </p>

                <div className="mt-6 flex flex-col gap-4">
                  <Link
                    href="/"
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    Home
                  </Link>

                  <Link
                    href="/explore"
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    Destinations
                  </Link>

                  <Link
                    href="/plan"
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    Plan a trip
                  </Link>

                  <Link
                    href="/about"
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
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
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    Discover
                  </Link>

                  <Link
                    href="/about"
                    className="text-sm text-white/50 transition-colors duration-200 hover:text-white"
                  >
                    Our story
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bottom */}
        <div className="mt-24 border-t border-white/10 pt-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-3 transition-transform duration-300 hover:scale-102"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 transition-all duration-300 group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                <span className="text-sm transition-transform duration-300 group-hover:rotate-45">✦</span>
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