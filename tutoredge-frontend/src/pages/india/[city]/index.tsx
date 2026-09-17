import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import { Loader2, Phone, Star, MapPin, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";

// 👇 city configs
import { city as agra } from "@/components/seoIndia/locations/up/agra";
import { city as banaras } from "@/components/seoIndia/locations/up/banaras";
// import { city as meerut } from "@/components/seoIndia/locations/up/meerut";
import { city as noida } from "@/components/seoIndia/locations/up/noida";
import LocationsSection from "./Locationssection";

/* =========================
   CITY REGISTRY
========================= */
const CITY_MAP: Record<string, any> = {
  agra,
  banaras,
  // meerut,
  noida,
};

/* =========================
   GOOGLE BUSINESS PROFILES
========================= */
const GOOGLE_BUSINESS: Record<string, string> = {
  noida: "https://share.google/cxxuZwe8K4llKWiHt",
  banaras: "https://share.google/cxxuZwe8K4llKWiHewrt",
  // meerut: "https://share.google/cxxuZwe8K4llKWiHasdfg",
  agra: "https://share.google/cxxuZwe8K4llKWadsfg",
};

const CONTACT_NUMBER = "+91-9305275932";
const PLATFORM_RATING = 4.9;
const TOTAL_REVIEWS = 1240;

/* =========================
   FAQ DATA
========================= */
const FAQS = [
  {
    q: "How do I find a verified home tutor in my city?",
    a: "Simply select your city and area from our platform, browse verified tutors, and connect instantly. Every tutor on Tutvex is background-verified and reviewed by real students.",
  },
  {
    q: "What subjects and classes do tutors cover?",
    a: "Our tutors cover Class 1–12 (CBSE, ICSE, State Board), competitive exams like JEE, NEET, UPSC, SSC, along with spoken English, coding, music, and more.",
  },
  {
    q: "How are tutors verified on Tutvex?",
    a: "Each tutor undergoes document verification, a teaching demo, and community ratings. Only tutors with a consistent track record appear on the platform.",
  },
  {
    q: "What is the fee structure for home tutors?",
    a: "Fees vary by subject, class, and location. On average, tutors charge ₹800–₹3000/month for school subjects and ₹2000–₹8000/month for competitive exam prep. You can negotiate directly with tutors.",
  },
  {
    q: "Can I get a free demo class before committing?",
    a: "Yes! Most tutors on Tutvex offer a free first demo session. You can evaluate the tutor's teaching style before making any payment.",
  },
  {
    q: "How quickly can I get a tutor assigned?",
    a: "In most major cities, we match you with a suitable tutor within 24–48 hours of submitting your request. Call us at " + CONTACT_NUMBER + " for urgent requirements.",
  },
];

/* =========================
   UX SIGNAL HELPERS
========================= */

/* =========================
   STAR RATING COMPONENT
========================= */
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : star - 0.5 <= rating
              ? "fill-yellow-200 text-yellow-400"
              : "fill-gray-200 text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

/* =========================
   FAQ ITEM COMPONENT
========================= */
function FaqItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border transition-all duration-300 ${
        open
          ? "border-indigo-200 bg-indigo-50 shadow-md"
          : "border-gray-200 bg-white hover:border-indigo-200 hover:shadow-sm"
      }`}
    >
      <button
        className="flex w-full items-center justify-between px-6 py-5 text-left"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
            {index + 1}
          </span>
          <span className="font-semibold text-gray-900">{q}</span>
        </span>
        {open ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-indigo-600" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-gray-400" />
        )}
      </button>
      {open && (
        <div className="px-6 pb-5 pt-0">
          <p className="text-gray-600 leading-relaxed border-t border-indigo-100 pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

/* =========================
   HERO BACKGROUND PATTERN
========================= */
const HeroBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    {/* Radial gradient mesh */}
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900" />

    {/* Animated floating orbs */}
    <div
      className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full opacity-30"
      style={{
        background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
        animation: "float1 8s ease-in-out infinite",
      }}
    />
    <div
      className="absolute top-10 right-0 h-[400px] w-[400px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, #f472b6 0%, transparent 70%)",
        animation: "float2 10s ease-in-out infinite",
      }}
    />
    <div
      className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full opacity-20"
      style={{
        background: "radial-gradient(circle, #a78bfa 0%, transparent 70%)",
        animation: "float3 12s ease-in-out infinite",
      }}
    />

    {/* Grid pattern overlay */}
    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />

    {/* Bokeh dots */}
    {[
      { top: "15%", left: "10%", size: 6, opacity: 0.6, delay: "0s" },
      { top: "60%", left: "5%", size: 4, opacity: 0.4, delay: "1s" },
      { top: "25%", left: "80%", size: 8, opacity: 0.5, delay: "0.5s" },
      { top: "70%", left: "75%", size: 5, opacity: 0.3, delay: "1.5s" },
      { top: "45%", left: "50%", size: 3, opacity: 0.4, delay: "2s" },
      { top: "85%", left: "30%", size: 7, opacity: 0.3, delay: "0.8s" },
      { top: "10%", left: "60%", size: 5, opacity: 0.5, delay: "1.2s" },
    ].map((dot, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-white"
        style={{
          top: dot.top,
          left: dot.left,
          width: dot.size * 2,
          height: dot.size * 2,
          opacity: dot.opacity,
          animation: `pulse ${2 + i * 0.3}s ease-in-out infinite`,
          animationDelay: dot.delay,
        }}
      />
    ))}

    {/* Diagonal light streak */}
    <div
      className="absolute inset-0 opacity-5"
      style={{
        background:
          "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%)",
        backgroundSize: "300% 300%",
        animation: "shimmer 6s ease-in-out infinite",
      }}
    />

    <style>{`
      @keyframes float1 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(40px, 30px) scale(1.05); }
      }
      @keyframes float2 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(-30px, 40px) scale(0.95); }
      }
      @keyframes float3 {
        0%, 100% { transform: translate(0, 0) scale(1); }
        50% { transform: translate(20px, -30px) scale(1.08); }
      }
      @keyframes shimmer {
        0% { background-position: 200% 200%; }
        100% { background-position: -200% -200%; }
      }
    `}</style>
  </div>
);

/* =========================
   STATS BAR
========================= */
const stats = [
  { label: "Cities Covered", value: 50, suffix: "+" },
  { label: "Verified Tutors", value: 12000, suffix: "+" },
  { label: "Happy Students", value: 48000, suffix: "+" },
  { label: "Avg. Rating", value: 4.9, suffix: "/5", decimals: 1 },
];

interface Props {
  cityKey: string;
}

export default function IndiaCityHub({ cityKey }: Props) {
  const city = CITY_MAP[cityKey];
  const [redirecting, setRedirecting] = useState(false);
  const googleBizUrl = GOOGLE_BUSINESS[cityKey];

  if (!city) return null;

  const redirectWithLoader = (url: string) => {
    setRedirecting(true);
    setTimeout(() => {
      window.location.href = url;
    }, 700);
  };

  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>
          Home Tutors in {city.name}, {city.state} | Verified Tutors – Tutvex
        </title>
        <meta
          name="description"
          content={`Find verified home tutors in ${city.name}, ${city.state} across ${city.locations
            .slice(0, 5)
            .join(", ")} and more. Rated ${PLATFORM_RATING}/5 by ${TOTAL_REVIEWS}+ students.`}
        />
        <link rel="canonical" href={`https://tutvex.com/india/${city.slug}`} />
      </Head>

      <NavBar />
<HeroBackground /> 
      {/* ================= HERO ================= */}
     {/* ============================================================
    HERO SECTION — Two-column layout with background image
    Left: heading + badges + CTAs
    Right: stats panel + trust signals
    ============================================================ */}

{/* 
  BACKGROUND IMAGE OPTIONS — pick one and set in style below:

  Option A — Unsplash (free, no key needed):
  backgroundImage: "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80')"
  (classroom/tutoring photo)

  Option B — Your own image:
  backgroundImage: "url('/images/hero-bg.jpg')"

  Currently using Option A as fallback + CSS dark overlay.
*/}

<section
  className="relative min-h-[92vh] flex items-center overflow-hidden"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center top",
  }}
>
  {/* ── Dark overlay so text stays readable ── */}
  <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-purple-950/85 to-indigo-900/60" />

  {/* ── Subtle grid texture on top ── */}
  <div
    className="absolute inset-0 opacity-[0.06]"
    style={{
      backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
      backgroundSize: "64px 64px",
    }}
  />

  {/* ── Radial glow – left side ── */}
  <div
    className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full pointer-events-none"
    style={{
      background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)",
    }}
  />

  {/* ============================================================
      CONTENT — two-column grid
      Left col → heading, description, CTAs, active-count badge
      Right col → stats cards + trust panel
      ============================================================ */}
  <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 lg:py-8">
    <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

      {/* ══════════════ LEFT COLUMN ══════════════ */}
      <div>
        {/* ── Badge row ── */}
        <div className="flex flex-wrap gap-2 mb-7">
          {/* Star rating */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-3.5 py-1.5">
            <StarRating rating={PLATFORM_RATING} />
            <span className="text-white font-bold text-xs">{PLATFORM_RATING}/5</span>
            <span className="text-white/50 text-xs">({TOTAL_REVIEWS}+ reviews)</span>
          </div>

          {/* Google Business */}
          {googleBizUrl && (
            <a
              href={googleBizUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-3.5 py-1.5 hover:bg-white/20 transition group"
            >
              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              <span className="text-white text-xs font-semibold">Google Business</span>
              <ExternalLink className="h-2.5 w-2.5 text-white/50 group-hover:text-white transition" />
            </a>
          )}

          {/* City pill */}
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-3.5 py-1.5">
            <MapPin className="h-3 w-3 text-pink-300" />
            <span className="text-white text-xs font-semibold">{city.name}, {city.state}</span>
          </div>
        </div>

        {/* ── Main heading ── */}
        <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] tracking-tight">
          Verified Home Tutors{" "}
          <span className="relative inline-block mt-1">
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa)" }}
            >
              in {city.name}
            </span>
            {/* Underline bar */}
            <span
              className="absolute -bottom-1 left-0 w-full h-[3px] rounded-full"
              style={{ background: "linear-gradient(90deg, #f472b6, #a78bfa, #60a5fa)" }}
            />
          </span>
        </h1>

        {/* ── Description ── */}
        <p className="mt-6 text-base md:text-lg text-indigo-100/90 max-w-xl leading-relaxed">
          Connect with trusted, background‑verified tutors in{" "}
          <strong className="text-white font-semibold">{city.name}</strong> for CBSE, ICSE,
          NEET, JEE &amp; competitive exams — right from your neighbourhood.
        </p>

        {/* ── Live tutor badge ── */}
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md px-4 py-2">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
          </span>
          <span className="text-white font-semibold text-sm">
            <CountUp end={city.tutorCount ?? 800} duration={2} />+ Verified Tutors Active Now
          </span>
        </div>

        {/* ── CTA buttons ── */}
        <div className="mt-8 flex flex-wrap gap-3 items-center">
          <Link
            href="/tutors?source=noida&campaign=FIND_TUTOR"
            className="inline-flex items-center gap-2 bg-white text-indigo-700 px-6 py-3.5 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 text-sm"
          >
            Find My Tutor →
          </Link>

          <a
            href={`tel:${CONTACT_NUMBER.replace(/-/g, "")}`}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/30 backdrop-blur-md text-white px-6 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-all duration-200 text-sm"
          >
            <Phone className="h-4 w-4 text-pink-300" />
            {CONTACT_NUMBER}
          </a>

          <Link
            href="/subjects/?source=CITY_HUB&campaign=SUBJECTS"
            className="text-white/70 underline underline-offset-4 text-sm font-medium hover:text-white transition"
          >
            Browse Subjects
          </Link>
        </div>

        {/* ── Trust strip ── */}
        <div className="mt-10 flex flex-wrap gap-x-5 gap-y-2">
          {[
            "✅ Background Verified",
            "🎓 Qualified Teachers",
            "🆓 Free Demo Class",
            "📚 All Boards",
          ].map((item) => (
            <span key={item} className="text-xs text-white/60 font-medium">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════ RIGHT COLUMN ══════════════ */}
      <div className="flex flex-col gap-5">

        {/* ── Stats grid 2×2 ── */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-5 text-center"
            >
              <div className="text-3xl font-extrabold text-white">
                <CountUp end={stat.value} duration={2.5} decimals={stat.decimals ?? 0} />
                {stat.suffix}
              </div>
              <div className="text-xs text-white/55 mt-1.5 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* ── Google review card ── */}
        {googleBizUrl && (
          <a
            href={googleBizUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-4 hover:bg-white/15 transition"
          >
            {/* Google G */}
            <div className="shrink-0 flex items-center justify-center h-11 w-11 rounded-xl bg-white">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">Tutvex on Google</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <StarRating rating={PLATFORM_RATING} />
                <span className="text-white font-bold text-sm">{PLATFORM_RATING}</span>
                <span className="text-white/45 text-xs">· {TOTAL_REVIEWS}+ reviews</span>
              </div>
            </div>
            <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/70 transition shrink-0" />
          </a>
        )}

        {/* ── Quick subject pills ── */}
        <div className="rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-4">
          <p className="text-xs text-white/50 font-semibold uppercase tracking-widest mb-3">
            Popular Subjects
          </p>
          <div className="flex flex-wrap gap-2">
            {["CBSE Class 10", "JEE Maths", "NEET Biology", "ICSE English", "Class 12 Physics", "SSC GK"].map(
              (subj) => (
                <span
                  key={subj}
                  className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-white/80"
                >
                  {subj}
                </span>
              )
            )}
          </div>
        </div>

        {/* ── Contact card ── */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-500/30 to-pink-500/20 border border-white/20 backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs font-medium mb-0.5">Need help choosing?</p>
            <p className="text-white font-bold text-sm">Call us — we match in 24h</p>
          </div>
          <a
            href={`tel:${CONTACT_NUMBER.replace(/-/g, "")}`}
            className="shrink-0 inline-flex items-center gap-2 bg-white text-indigo-700 px-4 py-2.5 rounded-xl text-sm font-bold shadow hover:shadow-md transition"
          >
            <Phone className="h-3.5 w-3.5" />
            Call Now
          </a>
        </div>
      </div>

    </div>{/* end grid */}
  </div>

  {/* ── Scroll indicator ── */}
  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 opacity-50">
    <span className="text-white/60 text-[10px] tracking-widest uppercase">Explore</span>
    <div className="w-5 h-8 rounded-full border-2 border-white/30 flex items-start justify-center pt-1.5">
      <div
        className="w-1 h-2 rounded-full bg-white/60"
        style={{ animation: "scrollDot 1.5s ease-in-out infinite" }}
      />
    </div>
    <style>{`
      @keyframes scrollDot {
        0%   { transform: translateY(0);  opacity: 1; }
        100% { transform: translateY(8px); opacity: 0; }
      }
    `}</style>
  </div>
</section>

      {/* ================= TRUST BAR ================= */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-white text-sm font-medium flex-wrap">
            <span className="flex items-center gap-1.5">✅ Background Verified</span>
            <span className="flex items-center gap-1.5">🎓 Qualified Teachers</span>
            <span className="flex items-center gap-1.5">📚 All Boards &amp; Exams</span>
            <span className="flex items-center gap-1.5">🆓 Free Demo Class</span>
          </div>
          <a
            href={`tel:${CONTACT_NUMBER.replace(/-/g, "")}`}
            className="flex items-center gap-2 text-white font-bold text-sm"
          >
            <Phone className="h-4 w-4" />
            {CONTACT_NUMBER}
          </a>
        </div>
      </div>

      {/* ================= LOCATIONS ================= */}
    {/* // Replace your <main>...</main> block with: */}
<LocationsSection
  city={city}
  googleBizUrl={googleBizUrl}
  redirectWithLoader={redirectWithLoader}
/>

      {/* ================= GOOGLE BUSINESS PROFILE CARD ================= */}
      {googleBizUrl && (
        <section className="max-w-7xl mx-auto px-4 pb-16">
          <div className="rounded-3xl border border-gray-100 bg-white shadow-lg overflow-hidden">
            <div className="flex flex-col md:flex-row">
              {/* Left accent */}
              <div className="md:w-2 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shrink-0" />

              <div className="flex flex-col md:flex-row items-center gap-6 p-8 flex-1">
                {/* Google G logo large */}
                <div className="shrink-0 flex items-center justify-center h-16 w-16 rounded-2xl bg-gray-50 border border-gray-100">
                  <svg className="h-9 w-9" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                    Google Business Profile
                  </p>
                  <h3 className="text-xl font-bold text-gray-900">
                    Tutvex — Home Tutors in {city.name}
                  </h3>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <StarRating rating={PLATFORM_RATING} />
                    <span className="font-bold text-gray-800">{PLATFORM_RATING}</span>
                    <span className="text-gray-400 text-sm">({TOTAL_REVIEWS}+ reviews)</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href={googleBizUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow hover:shadow-md transition text-sm"
                  >
                    View on Google
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href={`tel:${CONTACT_NUMBER.replace(/-/g, "")}`}
                    className="inline-flex items-center justify-center gap-2 border border-gray-200 text-gray-700 px-5 py-2.5 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-700 transition text-sm"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ================= CTA ================= */}
      <section className="mx-6 mb-16">
        <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-4 py-10 text-white shadow-xl relative overflow-hidden">
          {/* Background pattern */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative flex flex-col md:flex-row justify-between gap-8 items-center">
            <div>
              <h3 className="text-3xl font-extrabold">
                Find a Verified Tutor Near You
              </h3>
              <p className="mt-3 text-indigo-100">
                Connect with trusted tutors within minutes.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <StarRating rating={PLATFORM_RATING} />
                <span className="text-white font-bold">{PLATFORM_RATING}/5</span>
                <span className="text-indigo-200 text-sm">from {TOTAL_REVIEWS}+ students</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/tutors?source=Main_page&campaign=FIND_TUTOR"
                className="bg-white text-indigo-700 px-7 py-3 rounded-xl font-semibold shadow hover:shadow-lg transition"
              >
                Find Tutor
              </Link>

              <a
                href={`tel:${CONTACT_NUMBER.replace(/-/g, "")}`}
                className="flex items-center gap-2 border border-white/60 px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                <Phone className="h-4 w-4" />
                {CONTACT_NUMBER}
              </a>

              <button
                onClick={() => redirectWithLoader("/tutors/")}
                className="border border-white/60 px-7 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
              >
                Check Tutors
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQS ================= */}
      <section className="max-w-6sxl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <p className="text-indigo-600 font-semibold text-sm uppercase tracking-widest mb-2">
            Got Questions?
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Everything you need to know about finding the right tutor in {city.name}.
            Can't find an answer?{" "}
            <a
              href={`tel:${CONTACT_NUMBER.replace(/-/g, "")}`}
              className="text-indigo-600 font-semibold hover:underline"
            >
              Call us at {CONTACT_NUMBER}
            </a>
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, index) => (
            <FaqItem key={index} q={faq.q} a={faq.a} index={index} />
          ))}
        </div>
      </section>

      <Footer />

      {/* ================= LOADER ================= */}
      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur">
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-4 shadow-xl">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
            <span className="font-medium text-gray-800">
              Finding best tutors for you…
            </span>
          </div>
        </div>
      )}
    </>
  );
}

/* =========================
   STATIC GENERATION
========================= */
export const getStaticPaths: GetStaticPaths = async () => ({
  paths: Object.keys(CITY_MAP)
    .filter((city) => city !== "agra" && city !== "meerut")
    .map((city) => ({
      params: { city },
    })),
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: {
    cityKey: params?.city,
  },
  revalidate: 86400,
});