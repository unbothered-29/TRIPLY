import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

type PopularPlacesProps = {
  places: {
    name: string;
    description: string;
    image: string;
  }[];
};

export default function PopularPlaces({ places }: PopularPlacesProps) {
  return (
    <section className="relative border-t border-white/10 bg-black px-6 py-24 text-white md:px-12 lg:px-24 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <Reveal>
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-white/30" />
                <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-white/40">
                  Discover
                </p>
              </div>

              <h2 className="mt-7 text-5xl font-light tracking-[-0.04em] md:text-6xl">
                Popular places
              </h2>

              <p className="mt-5 max-w-lg text-sm font-light leading-relaxed text-white/50 md:text-base">
                A few places worth slowing down for, exploring, and remembering.
              </p>
            </div>

            <p className="text-[10px] uppercase tracking-[0.3em] text-white/30">
              {places.length} places to discover
            </p>
          </div>
        </Reveal>

        {/* Places List */}
        <div className="mt-16 divide-y divide-white/10 border-y border-white/10">
          {places.map((place, index) => (
            <Reveal key={place.name} delay={index * 100}>
              <article className="group grid gap-6 py-8 transition-all duration-300 md:grid-cols-[80px_1fr_300px_auto] md:items-center hover:bg-white/[0.015] px-4 -mx-4 rounded-2xl">
                {/* Number */}
                <div>
                  <span className="text-xs font-mono tracking-[0.2em] text-white/20 transition-colors duration-300 group-hover:text-white/60">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Text */}
                <div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20 transition-colors duration-300 group-hover:bg-white" />
                    <p className="text-[9px] uppercase tracking-[0.3em] text-white/30">
                      Place to visit
                    </p>
                  </div>

                  <h3 className="mt-3 text-2xl font-light tracking-tight text-white/80 transition-colors duration-300 group-hover:text-white md:text-3xl">
                    {place.name}
                  </h3>

                  <p className="mt-3 max-w-xl text-sm font-light leading-relaxed text-white/40 transition-colors duration-300 group-hover:text-white/60">
                    {place.description}
                  </p>
                </div>

                {/* Mini travel card */}
                <div className="relative h-36 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-white/30 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)]">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/25 transition-opacity duration-300 group-hover:opacity-40" />

                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.25em] text-white/70">
                        Discover
                      </span>
                      <span className="text-xs text-white/80 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>
                    </div>
                  </div>
                </div>

                {/* Arrow Button */}
                <div className="flex items-center md:justify-end">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/40 transition-all duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]">
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5">
                      →
                    </span>
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}