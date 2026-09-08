
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

export default function Features(){
  return(
<section className="border-t border-gray-100px-6 py-24 md:px-12 lg:px-24">
  <div className="mx-auto max-w-7xl">
     <div className="max-w-2xl">
      <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">
        Why Triply
      </p>
      <h2 className="mt-4 text-4xl font-light tracking-tight md:text-5xl">
        Travel planning, simplified.
      </h2>
     </div>

     <div className="mt-16 grid gap-12 md:grid-cols-3">
        {features.map((feature) => (
            <article key={feature.number}>
              <p className="text-sm text-gray-400">
                {feature.number}
              </p>

              <h3 className="mt-5 text-2xl font-light">
                {feature.title}
              </h3>

              <p className="mt-4 leading-relaxed text-gray-500">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
    </div>
</section>
  )
}