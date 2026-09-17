import React, { useState } from "react";
import { city } from "@/components/seoIndia/locations/up/meerut";

export const ServiceAreas: React.FC = () => {
  // Search filter for fast user navigation across Meerut's 25+ localities
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLocations = city.locations.filter((loc) =>
    loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (loc.pincode && loc.pincode.includes(searchTerm)) ||
    loc.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Tutvex deploys background-verified home tutors across all <strong className="text-white">{city.locations.length}+ key residential sectors and localities in {city.name}</strong>. Find an expert tutor near your home in under 2 hours.
          </p>

          {/* Search Filter Bar */}
          <div className="pt-4 max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search locality in ${city.name} (e.g. Shastri Nagar, Saket, 250004)...`}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-sm text-slate-200 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
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

        {/* Dynamic Locality Cards Grid looping over city.locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLocations.map((location) => (
            <article
              key={`loc-card-${location.slug}`}
              className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-lg transition-all group"
            >
              <div className="space-y-4">
                {/* Header with Title & Pincode */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                      {city.name}, {city.state}
                    </span>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      Home Tutor in {location.name}
                    </h3>
                  </div>

                  {location.pincode && (
                    <span className="shrink-0 px-2.5 py-1 text-[11px] font-mono font-semibold rounded bg-slate-900 text-slate-300 border border-slate-800">
                      PIN {location.pincode}
                    </span>
                  )}
                </div>

                {/* Dynamic SEO Description */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {location.description}
                </p>

                {/* Popular Subjects Pills */}
                {location.popularSubjects && location.popularSubjects.length > 0 && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[11px] font-semibold text-slate-400 block">Popular Tutors:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {location.popularSubjects.map((sub, sIdx) => (
                        <span
                          key={`sub-tag-${location.slug}-${sIdx}`}
                          className="text-[10px] px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/20"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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

        {/* Fallback if no matching search result */}
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
