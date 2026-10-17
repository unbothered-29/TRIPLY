import Reveal from "@/components/ui/Reveal";

const features = [
  {
    number: "01",
    title: "Discover",
    description:
      "Find inspiring destinations and discover places worth adding to your next adventure.",
  },
  {
    number: "02",
    title: "Plan",
    description:
      "Explore destinations and gather ideas to help you build the perfect trip.",
  },
  {
    number: "03",
    title: "Remember",
    description:
      "Keep your favorite destinations in one place so you can come back to them later.",
  },
];

export default function Features() {
  return (
    <section className="relative border-t border-white/10 bg-black px-6 py-28 text-white md:px-12 lg:px-24 overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-white/[0.015] blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal>
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/40">
              Why Triply
            </p>

            <h2 className="mt-5 text-4xl font-light leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Travel planning,
              <br />
              <span className="bg-gradient-to-r from-white via-white/80 to-white/40 bg-clip-text text-transparent">
                simplified.
              </span>
            </h2>

            <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/50 md:text-lg">
              Everything you need to discover new places, organize
              your ideas, and keep your next adventure within reach.
            </p>
          </div>
        </Reveal>

        {/* Features Grid */}
        <div className="mt-20 grid border-t border-white/10 md:grid-cols-3">
          {features.map((feature, index) => (
            <Reveal key={feature.number} delay={index * 120}>
              <article
                className={`group relative border-b border-white/10 py-10 transition-all duration-300 hover:bg-white/[0.02] md:border-b-0 md:py-12 ${
                  index !== 0
                    ? "md:border-l md:border-white/10 md:pl-10"
                    : "md:pr-10"
                }`}
              >
                {/* Number & Arrow */}
                <div className="flex items-start justify-between">
                  <span className="text-sm font-mono text-white/30 transition-colors duration-300 group-hover:text-white/80">
                    {feature.number}
                  </span>

                  <span className="text-xl text-white/20 transition-all duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-1.5 group-hover:text-white">
                    ↗
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-8 text-2xl font-light tracking-tight text-white transition-colors duration-300 group-hover:text-white/95">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="mt-4 text-sm font-light leading-relaxed text-white/50 transition-colors duration-300 group-hover:text-white/70">
                  {feature.description}
                </p>

                {/* Subtle active accent indicator */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-gradient-to-r from-white/60 to-transparent transition-all duration-500 group-hover:w-full" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}