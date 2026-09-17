import React, { useState, useMemo } from "react";
import { city } from "@/components/seoIndia/locations/up/agra";

export const ServiceAreas: React.FC = () => {
  // Search filter state
  const [searchTerm, setSearchTerm] = useState("");

  // Transform raw locations array safely
  const formattedLocations = useMemo(() => {
    return city.locations.map((loc) => {
      const name = typeof loc === "string" ? loc : (loc as any).name;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return {
        name,
        slug,
        description: `Top residential locality in ${city.name} with high demand for verified 1-on-1 home tutors for CBSE, ICSE, and UP Board.`,
        popularSubjects: ["Mathematics", "Science", "Physics", "Chemistry", "English"],
      };
    });
  }, []);

  // Memoized search filtering for 60fps rendering
  const filteredLocations = useMemo(() => {
    if (!searchTerm.trim()) return formattedLocations;
    const term = searchTerm.toLowerCase().trim();
    return formattedLocations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(term) ||
        loc.description.toLowerCase().includes(term)
    );
  }, [searchTerm, formattedLocations]);

  return (
    <section id="service-areas" className="py-16 sm:py-24 bg-slate-900 text-white border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-cyan-400">
            Hyper-Local Coverage
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Areas We Serve: Home Tutor in {city.name} Localities
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Tutvex deploys background-verified home tutors across all <strong className="text-white">{city.locations.length}+ key residential, educational, and commercial areas in {city.name}</strong>. Find an expert tutor near your home in under 2 hours.
          </p>

          {/* Search Filter Bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Instant search locality in ${city.name} (e.g. Kamla Nagar, Dayalbagh)...`}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl py-3.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors shadow-inner"
                aria-label={`Search localities in ${city.name}`}
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchTerm && (
              <p className="text-xs text-slate-400 mt-2 text-left">
                Showing {filteredLocations.length} of {city.locations.length} localities matching "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        {/* Dynamic Locality Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <article
              key={`loc-card-agra-${location.slug}`}
              className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 transform-gpu hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      {city.name}, {city.state}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Home Tutor in {location.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {location.description}
                </p>

                {/* Popular Subjects */}
                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 block">Popular Tutors:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {location.popularSubjects.map((sub, sIdx) => (
                      <span
                        key={`sub-tag-agra-${location.slug}-${sIdx}`}
                        className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button & Availability */}
              <div className="pt-6 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-slate-400">Tutors Available</span>
                </div>

                <a
                  href="#book-tutor-form"
                  className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors group-hover:translate-x-0.5 transform"
                  aria-label={`Find Home Tutor in ${location.name}, ${city.name}`}
                >
                  Find Tutor in {location.name}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Fallback */}
        {filteredLocations.length === 0 && (
          <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-2xl p-8 space-y-4">
            <p className="text-base text-slate-300">
              No specific locality found matching "{searchTerm}". However, Tutvex provides home tutors across all neighborhoods of {city.name}.
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300"
            >
              Reset Locality Filter
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceAreas;
