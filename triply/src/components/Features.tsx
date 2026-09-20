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
    <section className="border-t border-white/10 bg-black px-6 py-28 text-white md:px-12 lg:px-24">
      <div className="mx-auto max-w-7xl">
        {/* Header */}

        <div className="max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/40">
            Why Triply
          </p>

          <h2 className="mt-5 text-4xl font-light leading-tight tracking-tight md:text-6xl lg:text-7xl">
            Travel planning,
            <br />
            <span className="text-white/40">
              simplified.
            </span>
          </h2>

          <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/50 md:text-lg">
            Everything you need to discover new places, organize
            your ideas, and keep your next adventure within reach.
          </p>
        </div>

        {/* Features */}

        <div className="mt-20 grid border-t border-white/10 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.number}
              className={`group relative border-b border-white/10 py-10 md:border-b-0 md:py-12 ${
                index !== 0
                  ? "md:border-l md:border-white/10 md:pl-10"
                  : "md:pr-10"
              }`}
            >
              {/* Number */}

              <div className="flex items-start justify-between">
                <span className="text-sm font-light text-white/30">
                  {feature.number}
                </span>

                <span className="text-xl text-white/20 transition duration-300 group-hover:translate-x-1 group-hover:text-white/70">
                  ↗
                </span>
              </div>

              {/* Title */}

              <h3 className="mt-16 text-3xl font-light tracking-tight transition duration-300 group-hover:text-white/70 md:text-4xl">
                {feature.title}
              </h3>

              {/* Description */}

              <p className="mt-5 max-w-sm text-sm font-light leading-relaxed text-white/40 transition duration-300 group-hover:text-white/60 md:text-base">
                {feature.description}
              </p>

              {/* Bottom line */}

              <div className="mt-10 h-px w-10 bg-white/20 transition-all duration-500 group-hover:w-20 group-hover:bg-white/60" />
            </article>
          ))}
        </div>

        {/* Bottom statement */}

        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center">
          <p className="max-w-xl text-sm leading-relaxed text-white/30">
            From the first idea to the final destination, Triply
            keeps your travel inspiration in one place.
          </p>

          <div className="flex items-center gap-3 text-sm text-white/40">
            <span className="h-2 w-2 rounded-full bg-white/50" />
            <span>Discover. Plan. Explore.</span>
          </div>
        </div>
      </div>
    </section>
  );
}