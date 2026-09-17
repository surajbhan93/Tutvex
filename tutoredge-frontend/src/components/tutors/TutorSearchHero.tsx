import React, { useState, useEffect, useRef } from "react";
import { Search, MapPin, Sparkles, Navigation, X, BookOpen, GraduationCap, User, Compass } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TutorFilters,
  CITY_LOCATIONS,
  POPULAR_SEARCH_CHIPS,
  parseNaturalLanguageQuery,
} from "@/lib/filterTutor";
import { SUBJECTS, CLASSES } from "@/lib/TutorFilterPanel";

import TutorHeroAnimation from "./TutorHeroAnimation";

interface Props {
  filters: TutorFilters;
  onChange: (newFilters: TutorFilters) => void;
  totalResults: number;
  tutorsList: any[];
}

export const TutorSearchHero: React.FC<Props> = ({
  filters,
  onChange,
  totalResults,
  tutorsList,
}) => {
  const [queryInput, setQueryInput] = useState(filters.q || "");
  const [isOpen, setIsOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [geoLocError, setGeoLocError] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Formatted Total Tutor Count (Formula: totalResults * 10 + 2)
  const totalDisplay = (totalResults || 50) * 10 + 2;

  // Sync external filter q to input
  useEffect(() => {
    setQueryInput(filters.q || "");
  }, [filters.q]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Compute live search suggestions
  const suggestions = React.useMemo(() => {
    if (!queryInput.trim() || queryInput.length < 2) return null;
    const qLower = queryInput.toLowerCase().trim();

    // 1. Subject suggestions
    const matchedSubjects = SUBJECTS.filter((s) =>
      s.toLowerCase().includes(qLower)
    ).slice(0, 3);

    // 2. Class suggestions
    const matchedClasses = CLASSES.filter((c) =>
      c.toLowerCase().includes(qLower)
    ).slice(0, 3);

    // 3. Location / Area suggestions
    const matchedLocations: { city: string; area?: string }[] = [];
    for (const [city, areas] of Object.entries(CITY_LOCATIONS)) {
      if (city.toLowerCase().includes(qLower)) {
        matchedLocations.push({ city });
      }
      for (const area of areas) {
        if (area.toLowerCase().includes(qLower)) {
          matchedLocations.push({ city, area });
        }
      }
    }

    // 4. Tutor Name suggestions from live list
    const matchedTutors = tutorsList
      .filter((t) => (t.fullName || t.name || "").toLowerCase().includes(qLower))
      .slice(0, 3);

    return {
      subjects: matchedSubjects,
      classes: matchedClasses,
      locations: matchedLocations.slice(0, 4),
      tutors: matchedTutors,
    };
  }, [queryInput, tutorsList]);

  // Handle Natural Language & Direct Search submit
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsOpen(false);

    // Try smart parsing
    const parsed = parseNaturalLanguageQuery(queryInput);

    onChange({
      ...filters,
      q: queryInput.trim(),
      ...parsed,
    });
  };

  // Handle Geolocation "Near Me"
  const handleNearMeClick = () => {
    setIsLocating(true);
    setGeoLocError(null);

    if (!navigator.geolocation) {
      setGeoLocError("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        // Default to Prayagraj or active nearest location radius
        onChange({
          ...filters,
          radius: "near",
          city: filters.city || "Prayagraj",
        });
      },
      (err) => {
        setIsLocating(false);
        setGeoLocError("Location permission denied. You can select your city manually.");
      },
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-8 px-4">
      {/* ── WebGPU Light Speed Shader Animation Background ── */}
      <TutorHeroAnimation />

      <div className="relative z-30 max-w-4xl mx-auto">
        {/* ── Top Header Badge with Total Tutors Formula ── */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full text-xs font-extrabold tracking-widest uppercase bg-indigo-500/15 border border-indigo-500/35 text-indigo-300 shadow-xl backdrop-blur-md">
            <Sparkles size={13} className="text-cyan-400 animate-pulse" />
            <span>Total Tutors: {totalDisplay}+ Verified Educators</span>
          </div>
        </div>

      {/* ── Main Heading ── */}
      <h1 className="text-3xl sm:text-5xl font-black text-center text-slate-100 tracking-tight leading-tight mb-3">
        Find the <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Perfect Tutor</span> Near You
      </h1>
      <p className="text-center text-sm sm:text-base text-slate-400 mb-8 max-w-xl mx-auto">
        Search expert home & online tutors by subject, class, city, or area.
      </p>

      {/* ── Main Search Container (Glassmorphism) ── */}
      <div ref={searchRef} className="relative">
        <form
          onSubmit={handleSearchSubmit}
          className="relative flex flex-col md:flex-row items-center gap-2 p-2 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/30 shadow-2xl shadow-indigo-950/40"
        >
          {/* Main Input Field */}
          <div className="relative flex-1 w-full flex items-center pl-4 pr-3 py-2">
            <Search size={20} className="text-indigo-400 flex-shrink-0 mr-3" />
            <input
              type="text"
              value={queryInput}
              onChange={(e) => {
                setQueryInput(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Search tutors by name, subject, class, area (e.g. Maths in Civil Lines)..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm md:text-base outline-none font-medium"
            />
            {queryInput && (
              <button
                type="button"
                onClick={() => {
                  setQueryInput("");
                  onChange({ ...filters, q: "" });
                }}
                className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              >
                <X size={15} />
              </button>
            )}
          </div>

          {/* Near Me Quick Button */}
          <button
            type="button"
            onClick={handleNearMeClick}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-cyan-300 border border-slate-700/80 transition-all flex-shrink-0"
            title="Use current location"
          >
            <Navigation size={13} className={`text-cyan-400 ${isLocating ? "animate-spin" : ""}`} />
            <span>{isLocating ? "Locating..." : "Near Me"}</span>
          </button>

          {/* Submit Search Button */}
          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm tracking-wide shadow-lg shadow-blue-600/30 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Search size={16} />
            <span>Search Tutors</span>
          </button>
        </form>

        {/* Geolocation Notice / Error */}
        {geoLocError && (
          <p className="text-xs text-amber-400 mt-2 px-3 flex items-center gap-1">
            ⚠️ {geoLocError}
          </p>
        )}

        {/* ── Live Suggestions Autocomplete Dropdown ── */}
        <AnimatePresence>
          {isOpen && suggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-slate-900/98 backdrop-blur-2xl border border-indigo-500/30 shadow-2xl shadow-black/80 overflow-hidden z-50 divide-y divide-slate-800/60 max-h-96 overflow-y-auto"
            >
              {/* Subject Suggestions */}
              {suggestions.subjects.length > 0 && (
                <div className="p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-400 mb-2 flex items-center gap-1.5">
                    <BookOpen size={12} />
                    Subjects
                  </p>
                  <div className="space-y-1">
                    {suggestions.subjects.map((sub) => (
                      <button
                        key={sub}
                        type="button"
                        onClick={() => {
                          setQueryInput(sub);
                          onChange({ ...filters, subject: sub, q: "" });
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-indigo-600/20 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>{sub} Tutors</span>
                        <span className="text-[10px] text-slate-500">Filter by Subject</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Class Suggestions */}
              {suggestions.classes.length > 0 && (
                <div className="p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-400 mb-2 flex items-center gap-1.5">
                    <GraduationCap size={12} />
                    Classes
                  </p>
                  <div className="space-y-1">
                    {suggestions.classes.map((cls) => (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          setQueryInput(cls);
                          onChange({ ...filters, classLevel: cls, q: "" });
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-cyan-600/20 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>{cls} Tutors</span>
                        <span className="text-[10px] text-slate-500">Filter by Grade</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location Suggestions */}
              {suggestions.locations.length > 0 && (
                <div className="p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 mb-2 flex items-center gap-1.5">
                    <MapPin size={12} />
                    Locations & Areas
                  </p>
                  <div className="space-y-1">
                    {suggestions.locations.map((loc, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          const label = loc.area ? `${loc.area}, ${loc.city}` : loc.city;
                          setQueryInput(label);
                          onChange({
                            ...filters,
                            city: loc.city,
                            area: loc.area || "",
                            q: "",
                          });
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-emerald-600/20 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>📍 {loc.area ? `${loc.area}, ${loc.city}` : loc.city}</span>
                        <span className="text-[10px] text-slate-500">Filter by Location</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Direct Tutor Name Suggestions */}
              {suggestions.tutors.length > 0 && (
                <div className="p-3">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 mb-2 flex items-center gap-1.5">
                    <User size={12} />
                    Matching Educator Names
                  </p>
                  <div className="space-y-1">
                    {suggestions.tutors.map((t) => (
                      <button
                        key={t._id}
                        type="button"
                        onClick={() => {
                          const name = t.fullName || t.name;
                          setQueryInput(name);
                          onChange({ ...filters, q: name });
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-200 hover:bg-amber-600/20 hover:text-white transition-colors flex items-center justify-between"
                      >
                        <span>{t.fullName || t.name}</span>
                        <span className="text-[10px] text-amber-400/80">★ {t.rating || 4.8}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Popular Search Chips Row ── */}
      <div className="mt-5 flex items-center gap-2 flex-wrap justify-center">
        <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
          <Compass size={13} className="text-indigo-400" />
          Popular Searches:
        </span>
        {POPULAR_SEARCH_CHIPS.map((chip, idx) => {
          const isActive = Object.entries(chip.filter).every(
            ([k, v]) => (filters as any)[k] === v
          );
          return (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onChange({
                  ...filters,
                  ...chip.filter,
                });
              }}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-indigo-500/40"
              }`}
            >
              {chip.label}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
};

export default TutorSearchHero;
