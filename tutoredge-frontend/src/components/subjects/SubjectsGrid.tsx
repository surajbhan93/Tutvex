import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Layers } from "lucide-react";

import SubjectCard from "./SubjectCard";
import { POPULAR_SUBJECTS, SUBJECT_CATEGORIES } from "@/lib/constants";

/* ======================
   CONFIG
====================== */
const PAGE_SIZE = 8;

/* ======================
   BUILD CATEGORY MAP
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
   ANIMATIONS
====================== */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

/* ======================
   COMPONENT
====================== */
export default function SubjectsGrid() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [page, setPage] = useState(1);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  /* ======================
     FLATTEN + FILTER
  ====================== */
 const filteredSubjects = useMemo(() => {
  const searchLower = search.toLowerCase();

  const subjects = CATEGORY_KEYS.flatMap((key) => {
    if (activeTab !== "all" && activeTab !== key) return [];

    return SUBJECT_CATEGORIES[key].subjects.filter((subject) =>
      subject.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Popular subjects first
  const popular = subjects.filter((s) =>
    POPULAR_SUBJECTS.includes(s)
  );

  const nonPopular = subjects.filter(
    (s) => !POPULAR_SUBJECTS.includes(s)
  );

  return [...popular, ...nonPopular];
}, [search, activeTab]);


  /* ======================
     PAGINATION
  ====================== */
  const visibleSubjects = useMemo(() => {
    return filteredSubjects.slice(0, page * PAGE_SIZE);
  }, [filteredSubjects, page]);

  const hasMore = visibleSubjects.length < filteredSubjects.length;

  /* ======================
     RESET ON FILTER CHANGE
  ====================== */
  useEffect(() => {
    setPage(1);
  }, [search, activeTab]);

  /* ======================
     INFINITE SCROLL
  ====================== */
 useEffect(() => {
  if (!loaderRef.current || !hasMore) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (!entry) return;

      if (entry.isIntersecting) {
        setPage((prev) => prev + 1);
      }
    },
    { threshold: 1 }
  );

  observer.observe(loaderRef.current);

  return () => observer.disconnect();
}, [hasMore]);


  return (
    <section className="py-16">
      {/* ======================
          HEADER
      ====================== */}
      <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            Browse Subjects
            <Layers className="text-indigo-600" size={22} />
          </h2>
          <p className="mt-2 text-gray-600 max-w-xl">
            School, competitive, languages & skill-based subjects
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subject..."
            className="
              w-full rounded-xl border border-gray-300
              bg-white py-2.5 pl-10 pr-4 text-sm
              focus:border-indigo-500 focus:ring-2
              focus:ring-indigo-200 outline-none
            "
          />
        </div>
      </div>

      {/* ======================
          CATEGORY TABS
      ====================== */}
      <div className="mb-10 flex flex-wrap gap-3">
        {CATEGORY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              rounded-full px-5 py-2 text-sm font-semibold transition-all
              ${
                activeTab === tab.key
                  ? "bg-indigo-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ======================
          GRID
      ====================== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="
          grid grid-cols-1 gap-6
          sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4
        "
      >
        <AnimatePresence>
          {visibleSubjects.map((subject, index) => (
            <motion.div
              key={`${subject}-${index}`}
              variants={itemVariants}
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
      {!visibleSubjects.length && (
        <div className="mt-16 text-center text-gray-600">
          No subjects found 😕
        </div>
      )}

      {/* ======================
          INFINITE SCROLL LOADER
      ====================== */}
      {hasMore && (
        <div
          ref={loaderRef}
          className="mt-14 text-center text-sm text-gray-500"
        >
          Loading more subjects...
        </div>
      )}
    </section>
  );
}
