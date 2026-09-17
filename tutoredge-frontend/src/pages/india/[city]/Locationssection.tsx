// =====================================================
// DROP-IN REPLACEMENT: Replace your existing <main>
// section in index.tsx with this component
// =====================================================

// ---- Add this import at top of index.tsx ----
// import { TrendingUp, TrendingDown, Minus } from "lucide-react";

// ---- Replace the existing <main> block with: ----

// <LocationsSection city={city} googleBizUrl={googleBizUrl} redirectWithLoader={redirectWithLoader} />

// ---- And paste this component in the same file (or a separate file) ----

import { useState } from "react";
import CountUp from "react-countup";
import { ExternalLink, TrendingUp, Minus } from "lucide-react";

const FALLBACK_DEMAND = [
  20, 34, 40, 56, 10, 28, 45, 62,
  30, 25, 23, 56, 9, 10, 32, 42,
];

const AREA_RATINGS: Record<string, number> = {
  "Civil Lines": 4.8,
  Kalyani: 4.4,
  "Gomti Nagar": 4.9,
  Alambagh: 4.5,
  Hazratganj: 4.8,
  "Indira Nagar": 4.6,
};

const AVATAR_INITIALS = ["TK", "RS", "PM", "SA"];
const AVATAR_COLORS = [
  { bg: "bg-violet-100", text: "text-violet-700" },
  { bg: "bg-sky-100", text: "text-sky-700" },
  { bg: "bg-amber-100", text: "text-amber-700" },
  { bg: "bg-emerald-100", text: "text-emerald-700" },
];

type FilterType = "all" | "hot" | "rated" | "trending";

function getDemandConfig(demand: number) {
  if (demand >= 50) {
    return {
      band: "from-red-500 to-orange-500",
      pill: "bg-red-50 text-red-700 border border-red-100",
      dot: "bg-red-500 animate-ping",
      dotStatic: "bg-red-500",
      label: "High Demand",
      TrendIcon: TrendingUp,
      trendColor: "text-red-500",
    };
  }
  if (demand >= 35) {
    return {
      band: "from-orange-400 to-yellow-400",
      pill: "bg-orange-50 text-orange-700 border border-orange-100",
      dot: "bg-orange-500",
      dotStatic: "bg-orange-500",
      label: "Rising",
      TrendIcon: TrendingUp,
      trendColor: "text-orange-500",
    };
  }
  return {
    band: "from-indigo-500 to-violet-500",
    pill: "bg-indigo-50 text-indigo-700 border border-indigo-100",
    dot: "bg-indigo-400",
    dotStatic: "bg-indigo-400",
    label: "Steady",
    TrendIcon: Minus,
    trendColor: "text-indigo-400",
  };
}

interface LocationsSectionProps {
  city: any;
  googleBizUrl?: string;
  redirectWithLoader: (url: string) => void;
}

export default function LocationsSection({
  city,
  googleBizUrl,
  redirectWithLoader,
}: LocationsSectionProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  const enriched = city.locations.map((area: string, index: number) => ({
    area,
    slug: area.toLowerCase().replace(/\s+/g, "-"),
    demand: FALLBACK_DEMAND[index % FALLBACK_DEMAND.length] ?? 20,
    rating: AREA_RATINGS[area] ?? 4.3,
  }));

  const filtered = (() => {
    if (filter === "hot") return enriched.filter((a: any) => a.demand >= 50);
    if (filter === "rated") return [...enriched].sort((a: any, b: any) => b.rating - a.rating);
    if (filter === "trending") return [...enriched].sort((a: any, b: any) => b.demand - a.demand);
    return enriched;
  })();

  const filters: { key: FilterType; label: string; emoji: string }[] = [
    { key: "all", label: "All Areas", emoji: "📍" },
    { key: "hot", label: "High Demand", emoji: "🔥" },
    { key: "rated", label: "Top Rated", emoji: "⭐" },
    { key: "trending", label: "Trending", emoji: "📈" },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      {/* ── Section header ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          {/* Label with decorative bar */}
          <div className="flex items-center gap-2 mb-2">
            <span className="block h-0.5 w-5 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500" />
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-600">
              Browse by Neighbourhood
            </p>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            Popular Areas in{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
              {city.name}
            </span>
          </h2>
        </div>

        {/* Google Maps link */}
        {googleBizUrl && (
          <a
            href={googleBizUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 shadow-sm transition-all hover:border-indigo-300 hover:text-indigo-700 hover:shadow-md shrink-0"
          >
            {/* Google G SVG */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            View on Google Maps
            <ExternalLink className="h-3 w-3 text-gray-400 transition group-hover:text-indigo-400" />
          </a>
        )}
      </div>

      {/* ── Filter chips ── */}
      <div className="flex flex-wrap gap-2 mb-8">
        {filters.map(({ key, label, emoji }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
              filter === key
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                : "border border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
            }`}
          >
            <span>{emoji}</span>
            {label}
            {key === "hot" && (
              <span
                className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                  filter === key ? "bg-white/20 text-white" : "bg-red-50 text-red-600"
                }`}
              >
                {enriched.filter((a: any) => a.demand >= 50).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Cards grid ── */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(
          (
            { area, slug, demand, rating }: { area: string; slug: string; demand: number; rating: number },
            
          ) => {
            const cfg = getDemandConfig(demand);
            const { TrendIcon } = cfg;

            return (
              <button
                key={area}
                onClick={() =>
                  redirectWithLoader(`/india/${city.slug}/${slug}/home-tutor`)
                }
                className="group relative text-left rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-indigo-200 transition-all duration-250 overflow-hidden"
                style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
              >
                {/* Top gradient band */}
                <div
                  className={`h-1 w-full bg-gradient-to-r ${cfg.band}`}
                />

                <div className="p-4">
                  {/* Top row: demand pill + rating */}
                  <div className="flex items-center justify-between mb-3">
                    {/* Demand pill with live dot */}
                    <span
                      className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${cfg.pill}`}
                    >
                      <span className="relative flex h-1.5 w-1.5">
                        {demand >= 50 && (
                          <span
                            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cfg.dot}`}
                          />
                        )}
                        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${cfg.dotStatic}`} />
                      </span>
                      {cfg.label}
                    </span>

                    {/* Star rating */}
                    <span className="flex items-center gap-0.5 text-[11px] font-semibold text-gray-500">
                      <span className="text-amber-400 text-xs">★</span>
                      {rating}
                    </span>
                  </div>

                  {/* Title */}
                  <p className="text-sm font-bold text-gray-900 leading-snug mb-1 group-hover:text-indigo-700 transition-colors">
                    Home Tutor in{" "}
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
                      {area}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 mb-4">Verified tutors available</p>

                  {/* Footer: avatars + count + arrow */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      {/* Stacked avatar circles */}
                      <div className="flex">
                        {AVATAR_INITIALS.map((ini, i) => (
                          <div
                            key={i}
                            className={`
                              h-5 w-5 rounded-full border-[1.5px] border-white
                              flex items-center justify-center
                              text-[8px] font-bold
                              ${AVATAR_COLORS[i]?.bg || "bg-gray-100"} 
${AVATAR_COLORS[i]?.text || "text-gray-700"}s
                              ${i > 0 ? "-ml-1.5" : ""}
                            `}
                          >
                            {ini}
                          </div>
                        ))}
                      </div>

                      {/* Tutor count */}
                      <span className="text-[11px] font-bold text-indigo-600">
                        <CountUp end={demand} duration={1.5} />+ tutors
                      </span>
                    </div>

                    {/* Trend icon + arrow */}
                    <div className="flex items-center gap-1">
                      <TrendIcon className={`h-3 w-3 ${cfg.trendColor}`} />
                      <span className="text-gray-300 group-hover:text-indigo-400 transition-colors text-sm font-bold">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center text-gray-400">
          <span className="text-4xl mb-4">🔍</span>
          <p className="font-semibold text-gray-600">No areas match this filter</p>
          <button
            onClick={() => setFilter("all")}
            className="mt-3 text-indigo-600 text-sm font-semibold hover:underline"
          >
            Show all areas
          </button>
        </div>
      )}
    </main>
  );
}