import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import Head from "next/head";
import {
  Star,
  Clock,
  BookOpen,
  IndianRupee,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  GraduationCap,
  Shield,
  ArrowUpRight,
  Filter,
  Heart,
  MessageSquare,
  X,
  Compass,
  UserCheck,
  Building,
} from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import TutorFilterPanel from "@/components/filters/TutorFilterPanel";
import TutorSearchHero from "@/components/tutors/TutorSearchHero";
import ContactTutorModal from "@/components/tutors/ContactTutorModal";

import {
  filterTutors,
  type TutorFilters,
  DEFAULT_FILTERS,
  sortTutors,
} from "@/lib/filterTutor";
import { resolveImage } from "@/lib/resolveImage";
import { generateTutorSlug } from "@/lib/seo/generateTutorSEO";

/* ─────────────────────────────────────────────
   STATIC FALLBACK DATA
───────────────────────────────────────────── */
const STATIC_RATINGS = [4.6, 4.7, 4.8, 4.9, 5.0];

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const cardContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.04,
      duration: 0.4,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

/* ─────────────────────────────────────────────
   STAR RENDER HELPER
───────────────────────────────────────────── */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? "#f5b43c" : "none"}
          stroke="#f5b43c"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-white font-bold text-xs ml-1">{(rating || 4.8).toFixed(1)}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   TUTOR CARD COMPONENT
───────────────────────────────────────────── */
function TutorCard({
  tutor,
  i,
  onContactClick,
}: {
  tutor: any;
  i: number;
  onContactClick: (tutor: any) => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [shortlisted, setShortlisted] = useState(false);

  const isTopRated = tutor.rating >= 4.7;
  const isPremium = tutor.rating >= 4.9;

  const targetSlug = tutor.slug || generateTutorSlug(tutor) || tutor._id;
  const hasPrice = tutor.price && Number(tutor.price) > 0;

  return (
    <motion.article
      key={tutor._id}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -8 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => router.push(`/tutor/${targetSlug}`)}
      className="relative cursor-pointer w-full rounded-3xl overflow-hidden group flex flex-col justify-between"
      style={{
        background:
          "linear-gradient(165deg, rgba(15, 23, 42, 0.95) 0%, rgba(15, 23, 42, 0.85) 50%, rgba(30, 27, 75, 0.95) 100%)",
        border: hovered
          ? "1px solid rgba(99, 102, 241, 0.5)"
          : "1px solid rgba(255, 255, 255, 0.08)",
        boxShadow: hovered
          ? "0 25px 50px rgba(0, 0, 0, 0.7), 0 0 25px rgba(99, 102, 241, 0.2)"
          : "0 8px 30px rgba(0, 0, 0, 0.5)",
        transition: "all 0.3s ease",
      }}
    >
      {/* ── Top Header Actions: Heart & Badge ── */}
      <div className="p-4 flex items-start justify-between z-20">
        <div>
          {isTopRated && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase"
              style={{
                background: isPremium
                  ? "linear-gradient(135deg, #f5b43c, #e8920a)"
                  : "rgba(245,180,60,0.15)",
                color: isPremium ? "#0f172a" : "#f5b43c",
                border: isPremium ? "none" : "1px solid rgba(245,180,60,0.3)",
              }}
            >
              <Sparkles size={10} />
              {isPremium ? "PREMIUM" : "TOP RATED"}
            </span>
          )}
        </div>

        {/* Shortlist Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShortlisted(!shortlisted);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all ${
            shortlisted
              ? "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              : "bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/50"
          }`}
        >
          <Heart size={14} className={shortlisted ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* ── Avatar Section ── */}
      <div className="relative pb-2 flex flex-col items-center">
        {/* Glow behind avatar */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full pointer-events-none opacity-40"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)" }}
        />

        {/* Avatar Ring */}
        <div className="relative rounded-full p-0.5 z-10">
          <div className="rounded-full overflow-hidden h-[76px] w-[76px] bg-slate-900 ring-2 ring-indigo-500/40">
            <img
              src={resolveImage(tutor.profileImage)}
              alt={tutor.fullName || "Tutor"}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Online Dot */}
          <div
            className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900"
            style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.7)" }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 pb-5 space-y-3 text-center flex-1 flex flex-col justify-between">
        <div>
          {/* Name & Verified Badge */}
          <h3
            className="flex items-center justify-center gap-1.5 text-base font-bold leading-snug text-slate-100"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {tutor.fullName || tutor.name || "Experienced Educator"}
            <CheckCircle size={15} className="text-blue-400 flex-shrink-0" />
          </h3>

          {/* Headline */}
          <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-medium">
            {tutor.headline || "Experienced Subject Expert"}
          </p>

          {/* Location */}
          <p className="text-xs text-indigo-300 font-medium flex justify-center items-center gap-1.5 mt-2 line-clamp-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 flex-shrink-0" />
            📍 {[tutor.location?.area, tutor.location?.city || tutor.city].filter(Boolean).join(", ") || "Prayagraj"}
          </p>
        </div>

        {/* Rating & Experience */}
        <div className="flex items-center justify-center gap-3 bg-slate-950/40 py-2 rounded-2xl border border-slate-800/80">
          <StarRow rating={tutor.rating || 4.8} />
          <span className="text-slate-700">•</span>
          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
            <Clock size={11} className="text-indigo-400" />
            {tutor.yearsOfExperience || 3}+ yrs exp
          </span>
        </div>

        {/* Subject Pills */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {(tutor.subjects?.length > 0 ? tutor.subjects : ["Mathematics", "Science"]).slice(0, 3).map((s: string) => (
            <span
              key={s}
              className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300"
            >
              <BookOpen size={10} />
              {s}
            </span>
          ))}
        </div>

        {/* Price Row */}
        {hasPrice ? (
          <div className="flex items-center justify-center gap-1 pt-1">
            <IndianRupee size={15} className="text-cyan-400" />
            <span
              className="text-2xl font-black text-slate-100"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {Number(tutor.price).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-slate-400 ml-1">
              / {tutor.priceType === "per_hour" ? "hour" : "month"}
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center py-1">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300">
              <IndianRupee size={12} className="text-cyan-400" />
              Fee Negotiable / On Request
            </span>
          </div>
        )}

        {/* ── Action Buttons Row ── */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onContactClick(tutor);
            }}
            className="py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700/80 transition-all flex items-center justify-center gap-1.5"
          >
            <MessageSquare size={13} />
            Contact
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/tutor/${targetSlug}`);
            }}
            className="py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-1"
          >
            Profile
            <ArrowUpRight size={13} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   SKELETON LOADER CARD
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="w-full rounded-3xl bg-slate-900/90 border border-slate-800 h-96 p-5 flex flex-col items-center justify-between animate-pulse">
      <div className="w-20 h-20 rounded-full bg-slate-800" />
      <div className="w-32 h-4 rounded-full bg-slate-800" />
      <div className="w-24 h-3 rounded-full bg-slate-800" />
      <div className="w-full h-10 rounded-2xl bg-slate-800" />
      <div className="w-full grid grid-cols-2 gap-2">
        <div className="h-9 rounded-xl bg-slate-800" />
        <div className="h-9 rounded-xl bg-slate-800" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN TUTORS MARKETPLACE PAGE
───────────────────────────────────────────── */
export default function TutorsPage() {
  const router = useRouter();

  // Active state
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters State
  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);

  // Contact Modal State
  const [contactTutor, setContactTutor] = useState<any | null>(null);

  // Mobile Drawer State
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  // 1. Initialize Filters from URL on query mount
  useEffect(() => {
    if (!router.isReady) return;
    const { query } = router;

    const urlFilters: Partial<TutorFilters> = {};
    if (typeof query.q === "string") urlFilters.q = query.q;
    if (typeof query.subject === "string") urlFilters.subject = query.subject;
    if (typeof query.classLevel === "string") urlFilters.classLevel = query.classLevel;
    if (typeof query.city === "string") urlFilters.city = query.city;
    if (typeof query.area === "string") urlFilters.area = query.area;
    if (typeof query.teachingMode === "string") urlFilters.teachingMode = query.teachingMode;
    if (typeof query.gender === "string") urlFilters.gender = query.gender;
    if (typeof query.sortBy === "string") urlFilters.sortBy = query.sortBy as any;

    if (Object.keys(urlFilters).length > 0) {
      setFilters((prev) => ({ ...prev, ...urlFilters }));
    }
  }, [router.isReady]);

  // 2. Sync URL when filters change (shallow router replace)
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const cleanQuery: Record<string, string> = {};
    if (filters.q) cleanQuery.q = filters.q;
    if (filters.subject) cleanQuery.subject = filters.subject;
    if (filters.classLevel) cleanQuery.classLevel = filters.classLevel;
    if (filters.city) cleanQuery.city = filters.city;
    if (filters.area) cleanQuery.area = filters.area;
    if (filters.teachingMode) cleanQuery.teachingMode = filters.teachingMode;
    if (filters.gender) cleanQuery.gender = filters.gender;
    if (filters.sortBy && filters.sortBy !== "recommended") cleanQuery.sortBy = filters.sortBy;

    router.replace({ pathname: "/tutors", query: cleanQuery }, undefined, { shallow: true });
  }, [filters]);

  const ITEMS_PER_PAGE = 100;
  const [currentPage, setCurrentPage] = useState(1);

  // 3. Fetch All Tutors Data from API
  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/tutors?limit=1000`)
      .then((res) => {
        const data = (res.data.data || []).map((tutor: any, index: number) => ({
          ...tutor,
          rating:
            tutor.rating && tutor.rating > 0
              ? tutor.rating
              : STATIC_RATINGS[index % STATIC_RATINGS.length],
        }));
        setTutors(data);
        setTotal(res.data.pagination?.total || data.length);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // 4. Client-side Filtered and Sorted list across ALL tutors
  const filteredTutorsList = useMemo(() => {
    return filterTutors(tutors, filters);
  }, [tutors, filters]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Paginated Tutors slice
  const totalPages = Math.ceil(filteredTutorsList.length / ITEMS_PER_PAGE) || 1;
  const paginatedTutors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTutorsList.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTutorsList, currentPage]);

  // 5. Featured Top Recommended Tutors (top 3)
  const topRecommended = useMemo(() => {
    if (filteredTutorsList.length === 0) return [];
    return filteredTutorsList.filter((t) => (t.rating || 0) >= 4.7).slice(0, 3);
  }, [filteredTutorsList]);

  // Dynamic SEO Title
  const seoTitle = useMemo(() => {
    const parts = [
      filters.subject ? `${filters.subject} Tutors` : "Expert Home & Online Tutors",
      filters.area || filters.city ? `in ${filters.area || filters.city}` : null,
      "Tutvex Marketplace",
    ].filter(Boolean);
    return parts.join(" | ");
  }, [filters.subject, filters.city, filters.area]);

  // Active filter chip helpers
  const activeChips = useMemo(() => {
    const chips: { key: keyof TutorFilters; label: string }[] = [];
    if (filters.q) chips.push({ key: "q", label: `Search: "${filters.q}"` });
    if (filters.subject) chips.push({ key: "subject", label: `Subject: ${filters.subject}` });
    if (filters.classLevel) chips.push({ key: "classLevel", label: `Class: ${filters.classLevel}` });
    if (filters.city) chips.push({ key: "city", label: `City: ${filters.city}` });
    if (filters.area) chips.push({ key: "area", label: `Area: ${filters.area}` });
    if (filters.teachingMode) chips.push({ key: "teachingMode", label: `Mode: ${filters.teachingMode}` });
    if (filters.gender) chips.push({ key: "gender", label: `Gender: ${filters.gender}` });
    if (filters.isVerifiedOnly) chips.push({ key: "isVerifiedOnly", label: "Verified Only" });
    return chips;
  }, [filters]);

  const removeChip = (key: keyof TutorFilters) => {
    setFilters({
      ...filters,
      [key]: key === "isVerifiedOnly" ? false : "",
    });
  };

  return (
    <>
      <Head>
        <title>{seoTitle}</title>
        <meta
          name="description"
          content="Find verified expert home and online tutors in Prayagraj, Noida, Lucknow & across India. Compare ratings, classes, subjects and book free tutor demos on Tutvex."
        />
      </Head>

      <NavBar />

      {/* ════════════════════════════════════════
          MAIN ROOT CONTAINER
      ════════════════════════════════════════ */}
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
        {/* Background Ambient Glow Gradients */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] rounded-full bg-indigo-600/15 blur-[120px]" />
        </div>

        {/* ════════════════════════════════════════
            1. HERO ADVANCED SEARCH SECTION
        ════════════════════════════════════════ */}
        <div className="relative z-10 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
          <TutorSearchHero
            filters={filters}
            onChange={setFilters}
            totalResults={filteredTutorsList.length}
            tutorsList={tutors}
          />
        </div>

        {/* ════════════════════════════════════════
            2. MAIN CONTENT AREA
        ════════════════════════════════════════ */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Mobile Filter Toggle & Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>{filteredTutorsList.length} Tutors Found</span>
                <span className="text-xs font-semibold text-indigo-400 bg-indigo-500/15 px-3 py-1 rounded-full border border-indigo-500/30">
                  {filters.city ? `in ${filters.city}` : "Across India"}
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Based on your current search preferences & verified educator credentials.
              </p>
            </div>

            {/* Controls: Mobile Drawer Button & Desktop Sorting */}
            <div className="flex items-center justify-between md:justify-end gap-3">
              {/* Mobile Filter Drawer Trigger */}
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-indigo-300"
              >
                <Filter size={14} />
                <span>Filters ({activeChips.length})</span>
              </button>

              {/* Sorting Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Sort By:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 font-semibold outline-none cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <option value="recommended">⭐ Recommended</option>
                  <option value="rating">🏆 Highest Rated</option>
                  <option value="experience">🎓 Most Experienced</option>
                  <option value="price_asc">💵 Lowest Price</option>
                  <option value="price_desc">💎 Highest Price</option>
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Chips Row */}
          {activeChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap mb-8 pb-4 border-b border-slate-800/60">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Filters:</span>
              {activeChips.map((chip) => (
                <span
                  key={chip.key}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                >
                  <span>{chip.label}</span>
                  <button
                    onClick={() => removeChip(chip.key)}
                    className="hover:text-white p-0.5 rounded-full hover:bg-indigo-500/30"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="text-xs text-rose-400 hover:text-rose-300 underline font-semibold ml-2"
              >
                Reset All
              </button>
            </div>
          )}

          {/* ════════════════════════════════════════
              3. TWO-COLUMN LAYOUT: SIDEBAR + GRID
          ════════════════════════════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Desktop Sticky Filter Sidebar */}
            <div className="hidden lg:block lg:col-span-1">
              <TutorFilterPanel filters={filters} onChange={setFilters} />
            </div>

            {/* Mobile Filter Drawer */}
            {mobileDrawerOpen && (
              <TutorFilterPanel
                filters={filters}
                onChange={setFilters}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setMobileDrawerOpen(false)}
              />
            )}

            {/* Main Tutor Results Column */}
            <div className="lg:col-span-3 space-y-8">
              {/* ── TOP RECOMMENDED TUTORS (Carousel / Highlight Row) ── */}
              {!loading && topRecommended.length > 0 && !filters.q && (
                <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-indigo-950/60 border border-indigo-500/30 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles size={18} className="text-amber-400 animate-bounce" />
                      <h3 className="text-base font-extrabold text-white tracking-wide uppercase">
                        Top Tutors For You
                      </h3>
                    </div>
                    <span className="text-xs text-indigo-400 font-semibold">Highest Verified Match</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {topRecommended.map((tutor, idx) => (
                      <div
                        key={tutor._id}
                        onClick={() => router.push(`/tutor/${tutor.slug || generateTutorSlug(tutor)}`)}
                        className="p-4 rounded-2xl bg-slate-900/90 border border-indigo-500/30 hover:border-indigo-400 cursor-pointer transition-all flex flex-col items-center text-center space-y-2 group"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-amber-400">
                          <img src={resolveImage(tutor.profileImage)} alt={tutor.fullName} className="w-full h-full object-cover" />
                        </div>
                        <h4 className="font-bold text-xs text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {tutor.fullName}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{tutor.headline || "Expert Tutor"}</p>
                        <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400">
                          ★ {(tutor.rating || 4.9).toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── LOADING SKELETON GRID ── */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* ── EMPTY STATE SUGGESTIONS ── */}
              {!loading && filteredTutorsList.length === 0 && (
                <div className="py-20 px-6 rounded-3xl bg-slate-900/60 border border-slate-800 text-center space-y-4">
                  <GraduationCap size={48} className="text-indigo-400 mx-auto animate-pulse" />
                  <h3 className="text-xl font-bold text-white">No Tutors Found Matching Your Filters</h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    We couldn&apos;t find an educator matching your exact query. Try relaxing your filters:
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={() => setFilters({ ...filters, q: "", subject: "" })}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-bold"
                    >
                      Clear Subject Filter
                    </button>
                    <button
                      onClick={() => setFilters({ ...filters, city: "", area: "" })}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-indigo-300 font-bold"
                    >
                      Search All Cities
                    </button>
                    <button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-bold"
                    >
                      Reset All Filters
                    </button>
                  </div>
                </div>
              )}

              {/* ── TUTOR CARDS GRID ── */}
              {!loading && filteredTutorsList.length > 0 && (
                <>
                  <motion.div
                    variants={cardContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {paginatedTutors.map((tutor, i) => (
                      <TutorCard
                        key={tutor._id}
                        tutor={tutor}
                        i={i}
                        onContactClick={(t) => setContactTutor(t)}
                      />
                    ))}
                  </motion.div>

                  {/* ── PAGINATION CONTROLS ── */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-3 pt-10">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 transition-all"
                      >
                        <ChevronLeft size={14} />
                        Previous
                      </button>

                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1">
                        {(() => {
                          const pages: (number | string)[] = [];
                          if (totalPages <= 7) {
                            for (let i = 1; i <= totalPages; i++) pages.push(i);
                          } else if (currentPage <= 4) {
                            pages.push(1, 2, 3, 4, 5, "...", totalPages);
                          } else if (currentPage >= totalPages - 3) {
                            pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
                          } else {
                            pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
                          }

                          return pages.map((p, idx) => {
                            if (p === "...") {
                              return (
                                <span key={`ellipsis-${idx}`} className="px-2 text-xs font-bold text-slate-500">
                                  ...
                                </span>
                              );
                            }
                            const pageNum = p as number;
                            const isActive = pageNum === currentPage;
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                                  isActive
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-2 ring-indigo-400"
                                    : "bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800"
                                }`}
                              >
                                {pageNum}
                              </button>
                            );
                          });
                        })()}
                      </div>

                      <button
                        disabled={currentPage >= totalPages}
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 transition-all"
                      >
                        Next
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ════════════════════════════════════════
              4. "CAN'T FIND TUTOR" CTA BANNER
          ════════════════════════════════════════ */}
          <div className="mt-20 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-cyan-300">
                Personalized Tutor Matching
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Can&apos;t find the right tutor for your child?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Post your requirement and let Tutvex Academic Counselors handpick verified top 1% tutors for your home or online classes within 2 hours.
              </p>
            </div>
            <button
              onClick={() => router.push("/find-tutor-flow")}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-white font-extrabold text-sm tracking-wider uppercase shadow-xl shadow-indigo-600/40 flex-shrink-0 transition-all transform hover:scale-105"
            >
              Request Custom Tutor →
            </button>
          </div>
        </div>
      </div>

      {/* Contact Tutor Modal */}
      <ContactTutorModal tutor={contactTutor} onClose={() => setContactTutor(null)} />

      <Footer />
    </>
  );
}
