import Link from "next/link";
import Globe from "@/components/ui/globe";
import Reveal from "@/components/ui/Reveal";

const principles = [
  {
    number: "01",
    title: "Discover",
    description:
      "Travel starts with curiosity. Triply helps you discover destinations, places, and experiences that spark your next idea.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Turn inspiration into a journey. Explore destinations, collect ideas, and shape them into your next adventure.",
  },
  {
    number: "03",
    title: "Remember",
    description:
      "The places that stay with us are often the ones we never want to forget. Keep your favorite destinations close.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-black text-white overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[85vh] overflow-hidden px-6 py-32 md:px-12 lg:px-24">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute right-[-10%] top-[5%] h-[600px] w-[600px] rounded-full bg-emerald-500/[0.03] blur-[150px] animate-aurora" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid min-h-[65vh] items-center gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
            {/* Left — Text */}
            <div className="animate-fade-up opacity-0" style={{ animationDelay: "150ms" }}>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-1.5 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-medium uppercase tracking-[0.4em] text-white/50">
                  About Triply
                </p>
              </div>

              <h1 className="mt-8 max-w-4xl text-5xl font-light leading-[0.95] tracking-[-0.04em] md:text-7xl lg:text-[7rem]">
                Travel begins
                <br />
                <span className="bg-gradient-to-r from-white via-white/80 to-white/35 bg-clip-text text-transparent">
                  with curiosity.
                </span>
              </h1>

              <div className="mt-10 max-w-xl border-t border-white/10 pt-8">
                <p className="text-base font-light leading-relaxed text-white/50 md:text-lg">
                  Triply is a place to discover destinations,
                  find inspiration, and keep the places you want
                  to experience within reach.
                </p>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-white/50 animate-pulse" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
                  Discover. Plan. Explore.
                </p>
              </div>
            </div>

            {/* Right — Globe */}
            <div className="relative flex min-h-[450px] items-center justify-center lg:min-h-[600px] animate-fade-in delay-300">
              {/* Globe glow */}
              <div className="pointer-events-none absolute h-[320px] w-[320px] rounded-full bg-cyan-400/[0.04] blur-[90px] animate-pulse-glow" />

              <div className="relative z-10 w-full">
                <Globe />
              </div>

              {/* Small label */}
              <div className="absolute bottom-8 right-0 hidden text-right md:block">
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/30">
                  Somewhere on Earth
                </p>
                <p className="mt-2 font-mono text-[10px] text-white/20">
                  00° 00′ 00″ N
                  <br />
                  00° 00′ 00″ E
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="border-t border-white/10 px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-3xl">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/30">
                Philosophy
              </p>

              <h2 className="mt-6 text-3xl font-light leading-snug tracking-tight text-white/90 md:text-5xl">
                We believe planning a trip should feel like the
                beginning of the journey, not a chore before it.
              </h2>

              <div className="mt-10 grid gap-6 text-sm leading-relaxed text-white/45 md:grid-cols-2">
                <p>
                  There are always places we haven&apos;t seen, streets
                  we haven&apos;t walked, landscapes we haven&apos;t
                  experienced, and stories we haven&apos;t collected.
                </p>

                <p>
                  Triply brings those possibilities together in one
                  quiet space, giving you room to explore before
                  deciding where the road takes you.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-white/10 px-6 py-28 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/30">
                What Triply stands for
              </p>

              <h2 className="mt-5 text-4xl font-light tracking-tight md:text-6xl">
                Three simple ideas.
              </h2>
            </div>
          </Reveal>

          <div className="mt-20 grid border-t border-white/10 md:grid-cols-3">
            {principles.map((principle, index) => (
              <Reveal key={principle.number} delay={index * 120}>
                <article
                  className={`group border-b border-white/10 py-10 transition-all duration-300 hover:bg-white/[0.015] md:border-b-0 md:py-12 ${
                    index !== 0
                      ? "md:border-l md:border-white/10 md:pl-10"
                      : "md:pr-10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-white/30 transition-colors group-hover:text-white/60">
                      {principle.number}
                    </span>

                    <span className="text-white/20 transition-all duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:text-white">
                      ↗
                    </span>
                  </div>

                  <h3 className="mt-16 text-3xl font-light tracking-tight text-white transition-colors group-hover:text-white/95">
                    {principle.title}
                  </h3>

                  <p className="mt-5 text-sm leading-relaxed text-white/45">
                    {principle.description}
                  </p>

                  <div className="mt-10 h-px w-8 bg-white/20 transition-all duration-500 group-hover:w-16 group-hover:bg-white/70" />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement */}
      <section className="border-t border-white/10 px-6 py-32 md:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.35em] text-white/30">
                  Your next chapter
                </p>

                <h2 className="mt-6 max-w-3xl text-4xl font-light leading-tight tracking-tight md:text-6xl">
                  Somewhere out there,
                  <br />
                  <span className="bg-gradient-to-r from-white via-white/80 to-white/35 bg-clip-text text-transparent">
                    is your next destination.
                  </span>
                </h2>
              </div>

              <Link
                href="/explore"
                className="group inline-flex w-fit items-center gap-4 rounded-full border border-white/20 bg-white/[0.04] px-7 py-4 text-sm text-white backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white hover:text-black hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] active:scale-95"
              >
                <span>Explore destinations</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}