import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

export default function CTA() {
  return (
    <section className="px-6 py-24 md:px-12 lg:px-24">
      <Reveal>
        <div className="group relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-white/15 transition-all duration-500 hover:border-white/35 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8)]">
          <Image
            src="/images/cta-image.jpg"
            alt="Beautiful travel destination at sunset"
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/60 transition-colors duration-500 group-hover:bg-black/50" />
          
          {/* Subtle ambient light inside card */}
          <div className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-96 -translate-x-1/2 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-sky-500/20 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

          <div className="relative z-10 flex min-h-[520px] flex-col items-center justify-center px-6 py-20 text-center text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-1.5 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/80">
                Start exploring
              </p>
            </div>

            <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-light tracking-tight md:text-6xl">
              Your next adventure is{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent font-normal">
                waiting.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-base text-white/70 leading-relaxed font-light">
              Discover new places, find inspiration, and start planning your next journey today.
            </p>

            <div className="mt-10">
              <Link
                href="/plan"
                className="group/btn relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 px-8 py-4 text-base font-semibold text-black shadow-[0_0_30px_rgba(52,211,153,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_45px_rgba(52,211,153,0.55)] active:scale-95"
              >
                <span>Plan a Trip</span>
                <span className="transition-transform duration-300 group-hover/btn:translate-x-1.5 font-bold">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}