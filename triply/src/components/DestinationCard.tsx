import Link from "next/link";

type DestinationCardProps = {
  name: string;
  country: string;
  slug: string;
};

export default function DestinationCard({
  name,
  country,
  slug,
}: DestinationCardProps) {
  return (
    <Link
      href={`/explore/${slug}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.06]"
    >
      <article className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white transition-colors group-hover:text-white/90">
          {name} <span className="text-white/30">•</span> {country}
        </h3>
        <span className="text-xs text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white">
          →
        </span>
      </article>
    </Link>
  );
}