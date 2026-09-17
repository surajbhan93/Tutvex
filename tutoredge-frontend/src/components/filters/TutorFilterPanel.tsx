import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, MapPin, X, SlidersHorizontal, ShieldCheck, Check, Sparkles, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { SUBJECTS, CLASSES, BOARDS } from "@/lib/TutorFilterPanel";
import { TutorFilters, CITY_LOCATIONS } from "@/lib/filterTutor";

interface Props {
  filters: TutorFilters;
  onChange: (filters: TutorFilters) => void;
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

/* ── Field Label Helper ── */
function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-extrabold tracking-wider uppercase mb-2 text-indigo-300">
      {children}
    </p>
  );
}

/* ── Shared Base Input Styles ── */
const inputBaseStyle: React.CSSProperties = {
  background: "rgba(15, 23, 42, 0.8)",
  border: "1px solid rgba(51, 65, 85, 0.8)",
  color: "#f8fafc",
  borderRadius: 12,
  fontSize: 13,
  width: "100%",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s",
};

export const TutorFilterPanel: React.FC<Props> = ({
  filters,
  onChange,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const subjectRef = useRef<HTMLDivElement>(null);

  const filteredSubjects = SUBJECTS.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  // Available areas based on selected city
  const availableAreas = filters.city ? CITY_LOCATIONS[filters.city] || [] : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (subjectRef.current && !subjectRef.current.contains(e.target as Node)) {
        setSubjectOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeCount = [
    filters.q,
    filters.subject,
    filters.classLevel,
    filters.city,
    filters.area,
    filters.teachingMode,
    filters.experience,
    filters.gender,
    filters.minRating > 0,
    filters.isVerifiedOnly,
    filters.price < 15000,
  ].filter(Boolean).length;

  const resetAll = () =>
    onChange({
      q: "",
      subject: "",
      classLevel: "",
      board: "",
      city: "",
      area: "",
      radius: "",
      teachingMode: "",
      experience: "",
      price: 15000,
      priceType: "per_month",
      gender: "",
      minRating: 0,
      isVerifiedOnly: false,
      sortBy: filters.sortBy || "recommended",
    });

  const pricePercent = ((filters.price - 500) / (15000 - 500)) * 100;

  const panelContent = (
    <div className="space-y-6 text-slate-100 p-5">
      {/* ── HEADER & RESET ── */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-indigo-400" />
          <h3 className="text-sm font-extrabold tracking-wide uppercase text-white">Filter Tutors</h3>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={resetAll}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold underline transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ── SUBJECT (SEARCHABLE DROPDOWN) ── */}
      <div ref={subjectRef} className="relative">
        <FieldLabel>Subject</FieldLabel>
        <button
          type="button"
          onClick={() => setSubjectOpen((p) => !p)}
          className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all"
          style={{
            ...inputBaseStyle,
            borderColor: subjectOpen ? "#6366f1" : "rgba(51, 65, 85, 0.8)",
          }}
        >
          <span className={filters.subject ? "text-white font-semibold" : "text-slate-400"}>
            {filters.subject || "Select Subject"}
          </span>
          <div className="flex items-center gap-1.5">
            {filters.subject && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onChange({ ...filters, subject: "" });
                }}
                className="w-4 h-4 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-300 cursor-pointer"
              >
                <X size={10} />
              </span>
            )}
            <ChevronDown size={14} className={`text-slate-400 transition-transform ${subjectOpen ? "rotate-180 text-indigo-400" : ""}`} />
          </div>
        </button>

        <AnimatePresence>
          {subjectOpen && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              className="absolute left-0 right-0 z-50 mt-1 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden"
            >
              <div className="p-2 border-b border-slate-800 flex items-center gap-2">
                <Search size={13} className="text-indigo-400 ml-1" />
                <input
                  type="text"
                  value={subjectSearch}
                  onChange={(e) => setSubjectSearch(e.target.value)}
                  placeholder="Search subject..."
                  className="w-full text-xs bg-transparent text-white outline-none placeholder-slate-500 py-1"
                  autoFocus
                />
              </div>
              <div className="max-h-48 overflow-y-auto p-1 space-y-0.5">
                {filteredSubjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => {
                      onChange({ ...filters, subject: sub });
                      setSubjectOpen(false);
                      setSubjectSearch("");
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      filters.subject === sub
                        ? "bg-indigo-600/30 text-indigo-300 font-bold"
                        : "text-slate-300 hover:bg-slate-800"
                    }`}
                  >
                    <span>{sub}</span>
                    {filters.subject === sub && <Check size={12} className="text-indigo-400" />}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── CLASS LEVEL ── */}
      <div>
        <FieldLabel>Class / Grade</FieldLabel>
        <div className="relative">
          <select
            value={filters.classLevel}
            onChange={(e) => onChange({ ...filters, classLevel: e.target.value })}
            style={inputBaseStyle}
            className="px-3.5 py-2.5 appearance-none cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="" className="bg-slate-900">All Classes</option>
            {CLASSES.map((cls) => (
              <option key={cls} value={cls} className="bg-slate-900">
                {cls}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* ── CITY & AREA (HIERARCHICAL AUTOCOMPLETE) ── */}
      <div className="space-y-3">
        <FieldLabel>Location (City & Area)</FieldLabel>
        
        {/* City Select */}
        <div className="relative">
          <select
            value={filters.city}
            onChange={(e) =>
              onChange({
                ...filters,
                city: e.target.value,
                area: "", // Reset area when city changes
              })
            }
            style={inputBaseStyle}
            className="px-3.5 py-2.5 appearance-none cursor-pointer text-xs sm:text-sm font-medium"
          >
            <option value="" className="bg-slate-900">All Cities</option>
            {Object.keys(CITY_LOCATIONS).map((city) => (
              <option key={city} value={city} className="bg-slate-900">
                📍 {city}
              </option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>

        {/* Area / Locality Select */}
        {filters.city && availableAreas.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
            <div className="relative">
              <select
                value={filters.area}
                onChange={(e) => onChange({ ...filters, area: e.target.value })}
                style={inputBaseStyle}
                className="px-3.5 py-2.5 appearance-none cursor-pointer text-xs sm:text-sm font-medium text-cyan-300"
              >
                <option value="" className="bg-slate-900">All Areas in {filters.city}</option>
                {availableAreas.map((area) => (
                  <option key={area} value={area} className="bg-slate-900">
                    🏘️ {area}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </motion.div>
        )}
      </div>

      {/* ── TEACHING MODE ── */}
      <div>
        <FieldLabel>Teaching Mode</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "", label: "All" },
            { id: "home", label: "Home" },
            { id: "online", label: "Online" },
          ].map((mode) => {
            const isActive = filters.teachingMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChange({ ...filters, teachingMode: mode.id })}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── EXPERIENCE LEVEL ── */}
      <div>
        <FieldLabel>Experience</FieldLabel>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "", label: "Any Exp" },
            { id: "0-2", label: "0–2 yrs" },
            { id: "3-5", label: "3–5 yrs" },
            { id: "5-10", label: "5–10 yrs" },
            { id: "10+", label: "10+ yrs" },
          ].map((exp) => {
            const isActive = filters.experience === exp.id;
            return (
              <button
                key={exp.id}
                type="button"
                onClick={() => onChange({ ...filters, experience: exp.id })}
                className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                {exp.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── BUDGET SLIDER ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <FieldLabel>Max Monthly Budget</FieldLabel>
          <span className="text-xs font-bold text-cyan-300 bg-indigo-500/20 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
            {filters.price >= 15000 ? "Any Budget" : `₹${filters.price.toLocaleString("en-IN")}`}
          </span>
        </div>
        <div className="relative mt-1">
          <div className="h-1.5 w-full bg-slate-800 rounded-full" />
          <div
            className="absolute top-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
            style={{ width: `${pricePercent}%` }}
          />
          <input
            type="range"
            min={500}
            max={15000}
            step={500}
            value={filters.price}
            onChange={(e) => onChange({ ...filters, price: Number(e.target.value) })}
            className="absolute top-0 w-full h-1.5 opacity-0 cursor-pointer"
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 mt-2">
          <span>₹500/mo</span>
          <span>₹15,000+/mo</span>
        </div>
      </div>

      {/* ── GENDER PREFERENCE ── */}
      <div>
        <FieldLabel>Gender Preference</FieldLabel>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: "", label: "Any" },
            { id: "female", label: "Female" },
            { id: "male", label: "Male" },
          ].map((gen) => {
            const isActive = filters.gender === gen.id;
            return (
              <button
                key={gen.id}
                type="button"
                onClick={() => onChange({ ...filters, gender: gen.id })}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  isActive
                    ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                    : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                {gen.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── MIN RATING ── */}
      <div>
        <FieldLabel>Minimum Rating</FieldLabel>
        <div className="flex items-center gap-2">
          {[0, 4.0, 4.5, 4.8].map((rate) => {
            const isActive = filters.minRating === rate;
            return (
              <button
                key={rate}
                type="button"
                onClick={() => onChange({ ...filters, minRating: rate })}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                  isActive
                    ? "bg-amber-500 text-slate-950 border-amber-400 font-extrabold shadow-md shadow-amber-500/30"
                    : "bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800"
                }`}
              >
                {rate === 0 ? "Any ★" : `${rate}★+`}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── VERIFIED TOGGLE ── */}
      <div className="pt-2">
        <label
          onClick={() => onChange({ ...filters, isVerifiedOnly: !filters.isVerifiedOnly })}
          className="flex items-center justify-between p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 cursor-pointer hover:bg-indigo-500/15 transition-colors"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">Verified Tutors Only</span>
          </div>
          <input
            type="checkbox"
            checked={filters.isVerifiedOnly}
            onChange={() => {}}
            className="w-4 h-4 rounded text-indigo-600 bg-slate-950 border-slate-800 focus:ring-0"
          />
        </label>
      </div>

      {isMobileDrawer && (
        <button
          onClick={onCloseMobileDrawer}
          className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30"
        >
          Apply Filters ({activeCount})
        </button>
      )}
    </div>
  );

  // Mobile Slide-over Drawer vs Sticky Desktop Sidebar
  if (isMobileDrawer) {
    return (
      <AnimatePresence>
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-xs h-full bg-slate-900 border-l border-slate-800 overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
              <span className="font-bold text-slate-100 flex items-center gap-2">
                <Filter size={16} className="text-indigo-400" />
                Filter Options
              </span>
              <button onClick={onCloseMobileDrawer} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400">
                <X size={18} />
              </button>
            </div>
            {panelContent}
          </motion.div>
        </div>
      </AnimatePresence>
    );
  }

  return (
    <aside className="w-full rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-indigo-500/20 shadow-2xl shadow-slate-950/60 sticky top-24 overflow-hidden">
      {panelContent}
    </aside>
  );
};

export default TutorFilterPanel;