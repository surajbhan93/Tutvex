import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
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
  Users,
  TrendingUp,
  Shield,
  ArrowUpRight,
  Loader2,
} from "lucide-react";
import { motion, Variants, AnimatePresence, useScroll, useTransform } from "framer-motion";

import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import TutorFilterPanel from "@/components/filters/TutorFilterPanel";
import TutorSearchHero from "@/components/tutors/TutorSearchHero";
import { filterTutors, DEFAULT_FILTERS, type TutorFilters } from "@/lib/filterTutor";
import { resolveImage } from "@/lib/resolveImage";

/* ─────────────────────────────────────────────
   STATIC DATA (same as original)
───────────────────────────────────────────── */
const ITEMS_PER_PAGE = 24;
const STATIC_RATINGS = [4.0, 4.1, 4.3, 4.6, 4.7, 4.8, 4.9, 5.0];

/* ─────────────────────────────────────────────
   ANIMATION VARIANTS
───────────────────────────────────────────── */
const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardContainerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50, scale: 0.93, rotateX: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

/* ─────────────────────────────────────────────
   HELPER: STAR RENDER
───────────────────────────────────────────── */
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <svg
          key={n}
          width="11"
          height="11"
          viewBox="0 0 24 24"
          fill={n <= Math.round(rating) ? "#f5b43c" : "none"}
          stroke="#f5b43c"
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-white font-bold text-xs ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLE (decorative)
───────────────────────────────────────────── */
function FloatingOrb({
  style,
  color,
  size,
}: {
  style: React.CSSProperties;
  color: string;
  size: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
        ...style,
      }}
      animate={{
        y: [0, -30, 0],
        opacity: [0.4, 0.7, 0.4],
        scale: [1, 1.1, 1],
      }}
      transition={{
        duration: 6 + Math.random() * 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   STAT CARD (hero section)
───────────────────────────────────────────── */
function StatItem({
  icon: Icon,
  value,
  label,
  delay,
}: {
  icon: any;
  value: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center gap-1 px-6 py-4 rounded-2xl relative overflow-hidden"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center mb-1"
        style={{ background: "rgba(245,180,60,0.15)" }}
      >
        <Icon size={16} className="text-amber-400" />
      </div>
      <span
        className="text-2xl font-black text-white"
        style={{ fontFamily: "'Fraunces', serif" }}
      >
        {value}
      </span>
      <span className="text-[11px] text-gray-500 font-medium tracking-wide uppercase">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   TUTOR CARD
───────────────────────────────────────────── */
function TutorCard({
  tutor,
  i,
  isLoading = false,
  onNavigate,
  onPrefetch,
}: {
  tutor: any;
  i: number;
  isLoading?: boolean;
  onNavigate?: () => void;
  onPrefetch?: () => void;
}) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const isTopRated = tutor.rating >= 4.7;
  const isPremium = tutor.rating >= 4.9;

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate ? onNavigate() : router.push(`/tutors/${tutor._id}`);
  };

  return (
    <motion.article
      key={tutor._id}
      custom={i}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      whileHover={{ y: -12, scale: 1.02 }}
      onHoverStart={() => {
        setHovered(true);
        onPrefetch ? onPrefetch() : router.prefetch(`/tutors/${tutor._id}`);
      }}
      onHoverEnd={() => setHovered(false)}
      onClick={handleCardClick}
      className={`relative cursor-pointer w-full max-w-[340px] rounded-3xl overflow-hidden group transition-all duration-300 ${
        isLoading ? "ring-2 ring-amber-400 shadow-xl shadow-amber-500/20" : ""
      }`}
      style={{
        background: "linear-gradient(165deg, #17171f 0%, #0f0f16 50%, #0a0a10 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: hovered
          ? "0 30px 80px rgba(0,0,0,0.8), 0 0 40px rgba(245,180,60,0.12)"
          : "0 8px 40px rgba(0,0,0,0.6)",
        transition: "box-shadow 0.4s ease",
      }}
    >
      {/* ── Premium corner accent ── */}
      {isPremium && (
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
          style={{
            background:
              "linear-gradient(225deg, rgba(245,180,60,0.25) 0%, transparent 60%)",
          }}
        />
      )}

      {/* ── Hover glow sweep ── */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        animate={{
          opacity: hovered || isLoading ? 1 : 0,
          background: hovered || isLoading
            ? "linear-gradient(135deg, rgba(245,180,60,0.08) 0%, transparent 50%)"
            : "none",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* ── Badge row ── */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-20">
        {isTopRated ? (
          <div
            className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold"
            style={{
              background: isPremium
                ? "linear-gradient(135deg, #f5b43c, #e8920a)"
                : "rgba(245,180,60,0.15)",
              color: isPremium ? "#0a0a10" : "#f5b43c",
              border: isPremium ? "none" : "1px solid rgba(245,180,60,0.3)",
              boxShadow: isPremium ? "0 4px 12px rgba(245,180,60,0.4)" : "none",
            }}
          >
            <Sparkles size={9} />
            {isPremium ? "PREMIUM" : "TOP RATED"}
          </div>
        ) : (
          <div />
        )}

        {/* Experience bubble */}
        <div
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-violet-300"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <Clock size={9} />
          {tutor.yearsOfExperience}+ yrs
        </div>
      </div>

      {/* ── Avatar section with radial glow ── */}
      <div className="relative pt-14 pb-2 flex flex-col items-center">
        {/* Glow behind avatar */}
        <motion.div
          className="absolute top-8 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(245,180,60,0.2) 0%, transparent 70%)" }}
          animate={{ opacity: hovered || isLoading ? 1 : 0.5, scale: hovered || isLoading ? 1.2 : 1 }}
          transition={{ duration: 0.4 }}
        />

        {/* Avatar ring */}
        <div
          className="relative rounded-full p-0.5 z-10"
          style={{
            background: isTopRated
              ? "linear-gradient(135deg, #f5b43c 0%, #e8920a 50%, #f5b43c 100%)"
              : "linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05))",
          }}
        >
          <div className="rounded-full overflow-hidden h-[76px] w-[76px] bg-[#0a0a10]">
            <img
              src={resolveImage(tutor.profileImage)}
              alt={tutor.fullName}
              className="h-full w-full object-cover"
            />
          </div>
          {/* Online dot */}
          <div
            className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full border-2 border-[#0f0f16]"
            style={{ background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)" }}
          />
        </div>
      </div>

      {/* ── Body ── */}
      <div className="px-5 pb-5 space-y-3 text-center">
        {/* Name */}
        <div>
          <h3
            className="flex items-center justify-center gap-1.5 text-[15px] font-bold leading-snug"
            style={{
              fontFamily: "'Fraunces', serif",
              color: "white",
            }}
          >
            {tutor.fullName}
            <CheckCircle size={14} className="text-amber-400 flex-shrink-0" />
          </h3>

          {/* Headline */}
          <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
            {tutor.headline || "Experienced Subject Expert"}
          </p>
        </div>

        {/* Location */}
        {tutor.location?.area && tutor.location?.city && (
          <p className="text-[11px] text-gray-600 flex justify-center items-center gap-1">
            <span
              className="w-1 h-1 rounded-full inline-block"
              style={{ background: "#f5b43c" }}
            />
            {tutor.location.area}, {tutor.location.city}
          </p>
        )}

        {/* Stars + Verified */}
        <div className="flex items-center justify-center gap-3">
          <StarRow rating={tutor.rating} />
          <div
            className="flex items-center gap-1 text-[10px] text-emerald-400 px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(34,197,94,0.08)",
              border: "1px solid rgba(34,197,94,0.15)",
            }}
          >
            <Shield size={9} />
            Verified
          </div>
        </div>

        {/* Thin rule */}
        <div
          className="w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />

        {/* Price row */}
        <div className="flex items-center justify-center gap-1">
          <IndianRupee size={16} className="text-amber-400" />
          <span
            className="text-2xl font-black text-white"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            {tutor.price?.toLocaleString("en-IN")}
          </span>
          <span className="text-xs text-gray-600 ml-1">
            / {tutor.priceType === "per_hour" ? "hour" : "month"}
          </span>
        </div>

        {/* Subject tags */}
        <div className="flex flex-wrap justify-center gap-1.5">
          {tutor.subjects?.slice(0, 3).map((s: string) => (
            <span
              key={s}
              className="flex items-center gap-1 text-[10px] font-medium px-2.5 py-1 rounded-full"
              style={{
                background: "rgba(139,92,246,0.1)",
                border: "1px solid rgba(139,92,246,0.2)",
                color: "#a78bfa",
              }}
            >
              <BookOpen size={9} />
              {s}
            </span>
          ))}
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleCardClick}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isLoading}
          className="mt-1 w-full py-3 rounded-2xl text-xs font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
          style={{
            background: isLoading || hovered
              ? "linear-gradient(135deg, #f5b43c 0%, #e8920a 100%)"
              : "linear-gradient(135deg, rgba(245,180,60,0.15) 0%, rgba(232,146,10,0.1) 100%)",
            color: isLoading || hovered ? "#0a0a10" : "#f5b43c",
            border: isLoading || hovered ? "none" : "1px solid rgba(245,180,60,0.25)",
            boxShadow: isLoading || hovered ? "0 8px 30px rgba(245,180,60,0.4)" : "none",
            transition: "all 0.3s ease",
          }}
        >
          {isLoading ? (
            <span className="flex items-center gap-2 text-[#0a0a10] font-extrabold animate-pulse">
              <Loader2 size={15} className="animate-spin text-[#0a0a10]" />
              Opening Profile...
            </span>
          ) : (
            <>
              View Profile
              <ArrowUpRight size={13} />
            </>
          )}
        </motion.button>
      </div>
    </motion.article>
  );
}

/* ─────────────────────────────────────────────
   SKELETON CARD
───────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div
      className="w-full max-w-[340px] rounded-3xl overflow-hidden"
      style={{
        background: "linear-gradient(165deg, #17171f 0%, #0f0f16 100%)",
        border: "1px solid rgba(255,255,255,0.05)",
        height: 420,
      }}
    >
      <div className="flex flex-col items-center pt-14 px-5 gap-4">
        <div className="w-20 h-20 rounded-full bg-white/5 animate-pulse" />
        <div className="w-32 h-4 rounded-full bg-white/5 animate-pulse" />
        <div className="w-24 h-3 rounded-full bg-white/5 animate-pulse" />
        <div className="w-full h-px bg-white/5 my-1" />
        <div className="w-20 h-6 rounded-full bg-white/5 animate-pulse" />
        <div className="flex gap-2">
          <div className="w-16 h-6 rounded-full bg-white/5 animate-pulse" />
          <div className="w-16 h-6 rounded-full bg-white/5 animate-pulse" />
        </div>
        <div className="w-full h-10 rounded-2xl bg-white/5 animate-pulse mt-2" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function TutorsPage() {
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  // Parallax for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -60]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  /* ── STATE (same as original) ── */
  const [tutors, setTutors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recommended");
  const [loadingProfileId, setLoadingProfileId] = useState<string | null>(null);

  const [filters, setFilters] = useState<TutorFilters>(DEFAULT_FILTERS);

  const handleNavigateToProfile = (tutorId: string) => {
    setLoadingProfileId(tutorId);
    router.push(`/tutors/${tutorId}`);
  };

  useEffect(() => {
    const handleComplete = () => setLoadingProfileId(null);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const handleFiltersChange = (newFilters: TutorFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const filteredTutors = useMemo(() => filterTutors(tutors, filters), [tutors, filters]);

  /* ── FETCH (Real Tutors from DB) ── */
  useEffect(() => {
    setLoading(true);
    const queryParams: Record<string, string> = {
      page: String(page),
      limit: String(ITEMS_PER_PAGE),
    };
    if (filters.q) queryParams.q = filters.q;
    if (filters.subject) queryParams.subject = filters.subject;
    if (filters.city) queryParams.city = filters.city;
    if (filters.area) queryParams.area = filters.area;
    if (filters.gender && filters.gender !== "any") queryParams.gender = filters.gender;

    const queryString = new URLSearchParams(queryParams).toString();

    apiClient
      .get(`/tutors?${queryString}`)
      .then((res) => {
        const rawData = res.data.data || [];
        const data = rawData.map((tutor: any, index: number) => ({
          ...tutor,
          rating:
            tutor.rating && tutor.rating > 0
              ? tutor.rating
              : STATIC_RATINGS[index % STATIC_RATINGS.length],
        }));
        setTutors(data);
        const backendTotal = res.data.pagination?.total ?? data.length;
        setTotal(backendTotal);
      })
      .catch(() => {
        setTutors([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  }, [page, filters]);

  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
  const displayTotal = total > 0 ? total : filteredTutors.length;
  const totalTutorsFormatted = displayTotal;

  return (
    <>
      <NavBar />

      {/* ════════════════════════════════════════
          ROOT WRAPPER
      ════════════════════════════════════════ */}
      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: "#080810",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        {/* ── Ambient lighting layer ── */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <FloatingOrb color="rgba(245,180,60,0.4)" size={700} style={{ top: "-15%", left: "-10%" }} />
          <FloatingOrb color="rgba(109,40,217,0.3)" size={600} style={{ top: "40%", right: "-15%" }} />
          <FloatingOrb color="rgba(245,100,40,0.2)" size={400} style={{ bottom: "10%", left: "30%" }} />

          {/* Fine grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          {/* Radial vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, transparent 0%, rgba(8,8,16,0.7) 100%)",
            }}
          />
        </div>

        {/* ════════════════════════════════════════
            HERO
        ════════════════════════════════════════ */}
        <TutorSearchHero
          filters={filters}
          onChange={handleFiltersChange}
          totalResults={total}
          tutorsList={tutors}
        />

        {/* ════════════════════════════════════════
            FILTER + CONTENT (2-Column Layout)
        ════════════════════════════════════════ */}
        <div className="relative z-10 max-w-[1650px] mx-auto px-3 sm:px-6 lg:px-8 pb-24">
          
          {/* Header Row: Count + Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pt-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {loading ? '...' : totalTutorsFormatted} Tutors Found
                </h2>
                <span className="px-3 py-1 bg-indigo-900/60 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-full">
                  Across India
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Based on your current search preferences &amp; verified educator credentials.
              </p>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <span className="text-xs text-gray-400 font-medium">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#121638] border border-indigo-500/30 text-amber-400 text-xs font-bold px-4 py-2 rounded-xl outline-none cursor-pointer focus:border-amber-400 appearance-none pr-8 shadow-md"
                >
                  <option value="recommended">⭐ Recommended</option>
                  <option value="rating">High Rating</option>
                  <option value="experience">Experience</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <span className="absolute right-2.5 top-2.5 text-amber-400 pointer-events-none text-xs">▼</span>
              </div>
            </div>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR: FILTER TUTORS */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-3 lg:sticky lg:top-24 z-20"
            >
              <TutorFilterPanel filters={filters} onChange={handleFiltersChange} />
            </motion.div>

            {/* RIGHT MAIN CONTENT */}
            <div className="lg:col-span-9 space-y-8">
              
              {/* ✨ TOP TUTORS FOR YOU SECTION */}
              {!loading && filteredTutors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0c0f2b]/90 border border-indigo-500/30 rounded-2xl p-5 shadow-xl backdrop-blur-md relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="text-amber-400 animate-pulse" size={18} />
                      <h3 className="text-white font-bold text-sm sm:text-base tracking-wide uppercase">
                        TOP TUTORS FOR YOU
                      </h3>
                    </div>
                    <span className="text-indigo-400 text-xs font-semibold tracking-wider bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                      Highest Verified Match
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {filteredTutors.slice(0, 3).map((tutor) => {
                      const isCardLoading = loadingProfileId === tutor._id;
                      return (
                        <div
                          key={tutor._id}
                          onMouseEnter={() => router.prefetch(`/tutors/${tutor._id}`)}
                          onClick={() => handleNavigateToProfile(tutor._id)}
                          className="bg-[#13173d]/90 border border-indigo-500/20 rounded-xl p-4 text-center hover:border-amber-400/50 transition cursor-pointer flex flex-col items-center justify-between group shadow-md relative overflow-hidden"
                        >
                          <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-amber-400 to-yellow-200 mb-2.5 shadow-md overflow-hidden group-hover:scale-105 transition">
                            <img
                              src={resolveImage(tutor.profileImage)}
                              alt={tutor.fullName || tutor.name}
                              className="w-full h-full object-cover rounded-full"
                            />
                            {isCardLoading && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                                <Loader2 size={20} className="animate-spin text-amber-400" />
                              </div>
                            )}
                          </div>
                          <h4 className="text-white font-bold text-sm truncate max-w-full group-hover:text-amber-300 transition">
                            {tutor.fullName || tutor.name}
                          </h4>
                          <p className="text-gray-400 text-[11px] mt-0.5 line-clamp-2 leading-relaxed">
                            {tutor.headline || tutor.qualification || "Expert Educator"}
                          </p>
                          <div className="mt-2.5 flex items-center justify-center gap-1 text-xs text-amber-400 font-bold bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 w-full">
                            {isCardLoading ? (
                              <span className="flex items-center justify-center gap-1.5 text-amber-300 font-extrabold animate-pulse py-0.5">
                                <Loader2 size={12} className="animate-spin text-amber-300" />
                                Opening Profile...
                              </span>
                            ) : (
                              `★ ${tutor.rating ? Number(tutor.rating).toFixed(1) : "4.9"}`
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* ── Skeleton Grid ── */}
              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              )}

              {/* ── Cards Grid ── */}
              {!loading && (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={page}
                    variants={cardContainerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {filteredTutors.length === 0 ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-3 text-center py-20 bg-[#0e1130]/50 rounded-2xl border border-white/5"
                      >
                        <GraduationCap size={48} className="text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-base font-medium">No tutors match your filters</p>
                        <p className="text-gray-600 text-xs mt-1">Try adjusting your search criteria</p>
                      </motion.div>
                    ) : (
                      filteredTutors.map((tutor, i) => (
                        <TutorCard
                          key={tutor._id}
                          tutor={tutor}
                          i={i}
                          isLoading={loadingProfileId === tutor._id}
                          onNavigate={() => handleNavigateToProfile(tutor._id)}
                          onPrefetch={() => router.prefetch(`/tutors/${tutor._id}`)}
                        />
                      ))
                    )}
                  </motion.div>
                </AnimatePresence>
              )}

              {/* ── Pagination ── */}
              {total > 12 && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-center items-center gap-3 mt-12"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </motion.button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                      const p = idx + 1;
                      const isActive = p === page;
                      return (
                        <motion.button
                          key={p}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setPage(p)}
                          className="w-9 h-9 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: isActive
                              ? "linear-gradient(135deg, #f5b43c, #e8920a)"
                              : "rgba(255,255,255,0.04)",
                            color: isActive ? "#080810" : "rgba(255,255,255,0.4)",
                            border: isActive ? "none" : "1px solid rgba(255,255,255,0.07)",
                            boxShadow: isActive ? "0 4px 16px rgba(245,180,60,0.35)" : "none",
                          }}
                        >
                          {p}
                        </motion.button>
                      );
                    })}
                    {totalPages > 5 && (
                      <span className="text-gray-600 text-sm px-1">…{totalPages}</span>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={page * ITEMS_PER_PAGE >= total}
                    onClick={() => setPage((p) => p + 1)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold disabled:opacity-25 disabled:cursor-not-allowed transition-all"
                    style={{
                      background: "linear-gradient(135deg, #f5b43c, #e8920a)",
                      color: "#080810",
                      border: "none",
                      boxShadow: "0 4px 20px rgba(245,180,60,0.35)",
                    }}
                  >
                    Next
                    <ChevronRight size={15} />
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}