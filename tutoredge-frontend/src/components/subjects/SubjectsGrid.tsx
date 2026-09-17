import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Layers, SlidersHorizontal, X, BookOpen } from "lucide-react";
import type { Variants } from "framer-motion";
import SubjectCard from "./SubjectCard";
import { POPULAR_SUBJECTS, SUBJECT_CATEGORIES } from "@/lib/constants";

/* ======================
   CONFIG — untouched
====================== */
const PAGE_SIZE = 8;

/* ======================
   BUILD CATEGORY MAP — untouched
====================== */
const CATEGORY_KEYS = Object.keys(SUBJECT_CATEGORIES) as Array<
  keyof typeof SUBJECT_CATEGORIES
>;

const CATEGORY_TABS = [
  { key: "all", label: "All" },
  ...CATEGORY_KEYS.map((key) => ({
    key,
    label: SUBJECT_CATEGORIES[key].label,
  })),
] as const;

/* ======================
   ANIMATIONS — untouched logic
====================== */
const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number], // 👈 IMPORTANT
    },
  },
};

/* ======================
   TAB ICON MAP
   Gives each category a distinct emoji/icon identity
====================== */
const TAB_ICONS: Record<string, string> = {
  all: "✦",
  school: "🏫",
  competitive: "🏆",
  language: "🌐",
  skill: "💡",
  commerce: "📈",
  science: "🔬",
  arts: "🎨",
};

/* ======================
   COMPONENT — only design changed
====================== */
export default function SubjectsGrid() {
  /* ——— LOGIC UNTOUCHED ——— */
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const filteredSubjects = useMemo(() => {
    const searchLower = search.toLowerCase();
    const subjects = CATEGORY_KEYS.flatMap((key) => {
      if (activeTab !== "all" && activeTab !== key) return [];
      return SUBJECT_CATEGORIES[key].subjects.filter((subject) =>
        subject.toLowerCase().includes(searchLower)
      );
    });
    const popular = subjects.filter((s) => POPULAR_SUBJECTS.includes(s));
    const nonPopular = subjects.filter((s) => !POPULAR_SUBJECTS.includes(s));
    return [...popular, ...nonPopular];
  }, [search, activeTab]);

  const visibleSubjects = useMemo(() => {
    return filteredSubjects.slice(0, page * PAGE_SIZE);
  }, [filteredSubjects, page]);

  const hasMore = visibleSubjects.length < filteredSubjects.length;

  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) setPage((prev) => prev + 1);
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasMore]);
  /* ——— END LOGIC ——— */

  const resultCount = filteredSubjects.length;
  const hasSearch = search.trim().length > 0;

  return (
    <section
      aria-label="Browse school subjects and find tutors"
      className="relative py-8 sm:py-12"
    >

      {/* ======================
          SECTION HEADER
      ====================== */}
      <header className="mb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">

          {/* Title block */}
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-600 uppercase tracking-widest">
              <Layers size={11} />
              Subject Directory
            </div>
            <h2
              className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", letterSpacing: "-0.025em" }}
            >
              Browse All Subjects
            </h2>
            <p className="mt-1.5 text-sm text-gray-500 max-w-md leading-relaxed">
              School · Competitive · Languages · Skill-based — tutors for every board &amp; level.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-80 flex-shrink-0">
            <div
              className="flex items-center gap-2 rounded-2xl border bg-white px-4 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-indigo-400"
              style={{ borderColor: hasSearch ? "#6366f1" : "#e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
            >
              <Search size={16} className="text-gray-400 flex-shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subject e.g. Maths, Physics…"
                className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400"
                aria-label="Search subjects"
                autoComplete="off"
              />
              {hasSearch && (
                <button
                  onClick={() => setSearch("")}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Result count pill */}
            {hasSearch && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-7 left-0 text-xs text-gray-500 font-medium"
              >
                {resultCount === 0
                  ? "No results found"
                  : `${resultCount} subject${resultCount > 1 ? "s" : ""} found`}
              </motion.div>
            )}
          </div>
        </div>

        {/* Result summary bar */}
        {!hasSearch && (
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <SlidersHorizontal size={12} />
            <span>
              Showing <span className="font-bold text-gray-600">{visibleSubjects.length}</span> of{" "}
              <span className="font-bold text-gray-600">{filteredSubjects.length}</span> subjects
              {activeTab !== "all" && (
                <> in <span className="font-semibold text-indigo-600">
                  {CATEGORY_TABS.find(t => t.key === activeTab)?.label}
                </span></>
              )}
            </span>
          </div>
        )}
      </header>

      {/* ======================
          CATEGORY TABS
      ====================== */}
      <nav
        aria-label="Filter subjects by category"
        className="mb-8"
      >
        {/* Scrollable tab row */}
        <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const icon = TAB_ICONS[tab.key] ?? "•";
            return (
              <motion.button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                whileTap={{ scale: 0.95 }}
                aria-pressed={isActive}
                aria-label={`Filter by ${tab.label}`}
                className="snap-start flex-shrink-0 flex items-center gap-1.5 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 relative"
                style={
                  isActive
                    ? {
                        background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                        color: "#fff",
                        boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
                      }
                    : {
                        background: "#f8f7ff",
                        color: "#4b5563",
                        border: "1px solid #e5e7eb",
                      }
                }
              >
                <span className="text-base leading-none" aria-hidden="true">{icon}</span>
                {tab.label}
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute inset-0 rounded-2xl"
                    style={{ background: "linear-gradient(135deg, #4f46e5, #6366f1)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Active tab indicator line */}
        <div className="mt-3 h-px w-full bg-gradient-to-r from-transparent via-indigo-100 to-transparent" />
      </nav>

      {/* ======================
          GRID
      ====================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
        aria-label="Subject cards grid"
      >
        <AnimatePresence mode="popLayout">
          {visibleSubjects.map((subject, index) => (
            <motion.div
              key={`${subject}-${index}`}
              variants={itemVariants}
              layout
            >
              <SubjectCard
                subject={subject}
                highlight={POPULAR_SUBJECTS.includes(subject)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* ======================
          EMPTY STATE
      ====================== */}
      <AnimatePresence>
        {!visibleSubjects.length && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-20 flex flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite"
          >
            <div
              className="mb-5 flex h-16 w-16 items-center justify-center rounded-3xl"
              style={{ background: "linear-gradient(135deg, #eef2ff, #e0e7ff)" }}
            >
              <BookOpen size={28} className="text-indigo-400" />
            </div>
            <h3
              className="text-lg font-extrabold text-gray-800 mb-2"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              No subjects found
            </h3>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Try a different keyword or browse all categories to find the right subject tutor.
            </p>
            <button
              onClick={() => { setSearch(""); setActiveTab("all"); }}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              <X size={14} /> Clear Filters
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================
          INFINITE SCROLL LOADER
      ====================== */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="mt-14 flex flex-col items-center gap-3"
          aria-live="polite"
          aria-label="Loading more subjects"
        >
          {/* Animated dots loader */}
          <div className="flex items-center gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-2 w-2 rounded-full bg-indigo-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1, delay: i * 0.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">Loading more subjects…</span>
        </div>
      )}

      {/* Hide scrollbar utility */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}