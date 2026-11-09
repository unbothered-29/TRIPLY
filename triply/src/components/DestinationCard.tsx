import Link from "next/link";
import { getCategoryBadgeStyle, getClimateBadgeStyle } from "@/lib/uiColors";

type DestinationCardProps = {
  name: string;
  country: string;
  slug: string;
  category?: string;
  temperature?: string;
  rating?: number;
};

export default function DestinationCard({
  name,
  country,
  slug,
  category,
  temperature,
  rating,
}: DestinationCardProps) {
  const catStyle = category ? getCategoryBadgeStyle(category) : null;
  const climateStyle = temperature ? getClimateBadgeStyle(temperature) : null;

  return (
    <Link
      href={`/explore/${slug}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500/30 hover:bg-white/[0.06] hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
    >
      <article className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-medium text-white transition-colors group-hover:text-white">
              {name} <span className="text-white/30">•</span> {country}
            </h3>
            {catStyle && (
              <span
                className={`hidden sm:inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}
              >
                <span>{catStyle.icon}</span>
                <span>{category}</span>
              </span>
            )}
          </div>

          {(rating || climateStyle) && (
            <div className="mt-1.5 flex items-center gap-2 text-xs">
              {rating && (
                <span className="flex items-center gap-1 text-amber-300">
                  <span className="text-amber-400">★</span> {rating}
                </span>
              )}
              {climateStyle && (
                <span className={`inline-flex items-center gap-1 text-[11px] ${climateStyle.text}`}>
                  <span>{climateStyle.icon}</span>
                  <span>{temperature}</span>
                </span>
              )}
            </div>
          )}
        </div>

        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 text-xs text-white/40 transition-all duration-300 group-hover:border-emerald-400/40 group-hover:bg-emerald-400/10 group-hover:text-emerald-300">
          →
        </span>
      </article>
    </Link>
  );
}
