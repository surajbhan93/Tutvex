import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Star,
} from "lucide-react";

/* ======================
   UTILS — untouched
====================== */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

/* ======================
   TYPES — untouched
====================== */
interface Props {
  subject: string;
  highlight?: boolean;
}

/* ======================
   ANIMATIONS — untouched logic,
   upgraded values for premium feel
====================== */
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    scale: 0.94,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  hover: {
    y: -10,
    scale: 1.025,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 18,
    },
  },
};

/* ======================
   SUBJECT → ACCENT COLOR MAP
   Gives each subject a unique identity
====================== */
const SUBJECT_COLORS: Record<string, { from: string; to: string; light: string; text: string }> = {
  mathematics:  { from: "#6366f1", to: "#8b5cf6", light: "#eef2ff", text: "#4338ca" },
  science:      { from: "#0ea5e9", to: "#06b6d4", light: "#e0f2fe", text: "#0369a1" },
  physics:      { from: "#f59e0b", to: "#f97316", light: "#fffbeb", text: "#b45309" },
  chemistry:    { from: "#10b981", to: "#059669", light: "#ecfdf5", text: "#065f46" },
  biology:      { from: "#22c55e", to: "#16a34a", light: "#f0fdf4", text: "#15803d" },
  english:      { from: "#ec4899", to: "#db2777", light: "#fdf2f8", text: "#9d174d" },
  history:      { from: "#f97316", to: "#ef4444", light: "#fff7ed", text: "#9a3412" },
  geography:    { from: "#14b8a6", to: "#0ea5e9", light: "#f0fdfa", text: "#0f766e" },
  hindi:        { from: "#f43f5e", to: "#e11d48", light: "#fff1f2", text: "#be123c" },
  economics:    { from: "#8b5cf6", to: "#6366f1", light: "#f5f3ff", text: "#5b21b6" },
  commerce:     { from: "#0891b2", to: "#0e7490", light: "#ecfeff", text: "#155e75" },
  accountancy:  { from: "#7c3aed", to: "#6d28d9", light: "#f5f3ff", text: "#4c1d95" },
};
type SubjectColorKey = keyof typeof SUBJECT_COLORS;
const getAccent = (subject: string) => {
  const firstWord = subject?.toLowerCase().split(" ")[0];

  if (!firstWord) {
    return {
      from: "#6366f1",
      to: "#4f46e5",
      light: "#eef2ff",
      text: "#4338ca",
    };
  }

  const key = firstWord as SubjectColorKey;

  return SUBJECT_COLORS[key] ?? {
    from: "#6366f1",
    to: "#4f46e5",
    light: "#eef2ff",
    text: "#4338ca",
  };
};

/* ======================
   COMPONENT — only design changed
====================== */
export default function SubjectCard({ subject, highlight }: Props) {
  const router = useRouter();

  /* ——— LOGIC UNTOUCHED ——— */
  const subjectSlug = useMemo(() => slugify(subject), [subject]);

  const handleNavigation = useCallback(() => {
    router.push({
      pathname: "/find-tutor-flow",
      query: {
        subject: subjectSlug,
        board: "cbse",
        medium: "english",
      },
    });
  }, [router, subjectSlug]);
  /* ——— END LOGIC ——— */

  const accent = getAccent(subject);

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-40px" }}
      onClick={handleNavigation}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleNavigation()}
      aria-label={`Find ${subject} tutor — CBSE, ICSE & State Board`}
      className="relative cursor-pointer rounded-3xl overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 group"
      style={{
        boxShadow: "0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      }}
    >

      {/* ── CARD SHELL ── */}
      <div
        className="relative h-full flex flex-col bg-white rounded-3xl overflow-hidden transition-shadow duration-300 group-hover:shadow-2xl"
        style={{
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >

        {/* Top accent bar — unique per subject */}
        <div
          className="h-1.5 w-full flex-shrink-0"
          style={{ background: `linear-gradient(90deg, ${accent.from}, ${accent.to})` }}
        />

        {/* Inner padding */}
        <div className="flex flex-col flex-1 p-5 sm:p-6">

          {/* ── HEADER ROW ── */}
          <div className="flex items-start justify-between mb-5">

            {/* Icon + Title */}
            <div className="flex items-center gap-3.5">

              {/* Glowing subject icon */}
              <div
                className="relative flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm"
                style={{
                  background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                  boxShadow: `0 8px 20px ${accent.from}40`,
                }}
              >
                {/* Subtle inner shine */}
                <div
                  className="absolute inset-0 rounded-2xl"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, transparent 60%)" }}
                />
                <BookOpen size={20} className="text-white relative z-10" />
              </div>

              <div>
                {/* SEO — h3 with keyword-rich text */}
                <h3
                  className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight"
                  style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
                >
                  {subject} Tutor
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Expert &amp; Verified
                </p>
              </div>
            </div>

            {/* Popular badge */}
            {highlight && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300 }}
                className="inline-flex items-center gap-1 flex-shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  background: "linear-gradient(135deg, #fef9c3, #fef08a)",
                  color: "#713f12",
                  border: "1px solid #fde047",
                }}
                aria-label="Popular subject"
              >
                <Star size={9} fill="#ca8a04" color="#ca8a04" />
                Popular
              </motion.span>
            )}
          </div>

          {/* ── DIVIDER ── */}
          <div
            className="mb-4 h-px w-full"
            style={{ background: `linear-gradient(90deg, transparent, ${accent.from}30, transparent)` }}
          />

          {/* ── META CHIPS (SEO-rich, aria-labeled) ── */}
          <div className="flex flex-col gap-2.5 mb-6">

            {/* Board info */}
            <div
              className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold w-full"
              style={{ background: accent.light, color: accent.text }}
            >
              <GraduationCap size={13} />
              <span>CBSE · ICSE · State Board</span>
            </div>

            {/* Verified badge */}
            <div className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 w-full border border-emerald-100">
              <CheckCircle2 size={13} className="text-emerald-500" />
              <span>English Medium · Background Verified</span>
            </div>
          </div>

          {/* ── CTA BUTTON ── */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            className="group/btn mt-auto flex w-full items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold text-white relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              boxShadow: `0 4px 16px ${accent.from}35`,
            }}
            aria-label={`View ${subject} tutors for CBSE, ICSE and State Board`}
          >
            {/* Shimmer sweep on hover */}
            <span
              className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                transform: "skewX(-12deg)",
              }}
            />

            <span className="relative z-10 flex items-center gap-2">
              <Sparkles size={14} className="opacity-80" />
              View Tutors
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover/btn:translate-x-1"
              />
            </span>
          </motion.button>

        </div>{/* end inner padding */}

        {/* ── HOVER GLOW UNDERLAY ── */}
        <div
          className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 110%, ${accent.from}12 0%, transparent 65%)`,
          }}
          aria-hidden="true"
        />

      </div>{/* end card shell */}

    </motion.article>
  );
}