import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import {
  Loader2, Star, Phone, MapPin, ShieldCheck, Clock,
  ArrowRight, Users, ChevronDown, BookOpen,
  GraduationCap, Award, Zap, TrendingUp, Heart,
} from "lucide-react";

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { KANPUR_LOCATIONS, LUCKNOW_LOCATIONS } from "@/components/seo/seo.config";

/* =========================
   CITY CONFIG
========================= */
const CITY_CONFIG: Record<
  string,
  {
    title: string;
    description: string;
    locations: string[];
    tutorCount: number;
    googleBusinessUrl: string;
  }
> = {
  kanpur: {
    title: "Home Tutors in Kanpur | Verified Tutors – Tutvex",
    description:
      "Find verified home tutors in Kanpur across Civil Lines, Kalyanpur, Kakadeo, Govind Nagar and more.",
    locations: KANPUR_LOCATIONS,
    tutorCount: 950,
    googleBusinessUrl: "https://share.google/9srzoEeknq8tpchsp",
  },
  lucknow: {
    title: "Home Tutors in Lucknow | Verified Tutors – Tutvex",
    description:
      "Find verified home tutors in Lucknow across Gomti Nagar, Alambagh, Hazratganj, Indira Nagar and more.",
    locations: LUCKNOW_LOCATIONS,
    tutorCount: 1200,
    googleBusinessUrl: "https://share.google/9srzoEeknq8tpchYM",
    
  },
};

const CONTACT_NUMBER = "+91-9305275932";
const CONTACT_TEL = "tel:+919305275932";

const FALLBACK_DEMAND = [
  20, 34, 40, 56, 10, 28, 45, 62,
  30, 25, 23, 56, 9, 10, 32, 42,
];

const AREA_RATINGS: Record<string, number> = {
  "Civil Lines": 4.8,
  Kalyanpur: 4.5,
  Kakadeo: 4.2,
  "Govind Nagar": 4.6,
  "Gomti Nagar": 4.9,
  Alambagh: 4.4,
  Hazratganj: 4.8,
  "Indira Nagar": 4.7,
};

/* =========================
   FAQ DATA
========================= */
const FAQS = [
  {
    q: "How do I find a home tutor in my area?",
    a: "Simply click on your locality in the 'Popular Areas' section or tap 'Find Tutors Near You'. You'll be connected with verified tutors available in your exact neighborhood within minutes.",
    icon: <MapPin className="h-5 w-5 text-violet-400" />,
  },
  {
    q: "Are the tutors on Tutvex background verified?",
    a: "Yes, absolutely. Every tutor on Tutvex goes through a multi-step verification — ID proof, qualification check, and reference verification. We also collect parent feedback continuously to maintain quality.",
    icon: <ShieldCheck className="h-5 w-5 text-green-400" />,
  },
  {
    q: "What subjects and classes do your tutors cover?",
    a: "Our tutors cover all subjects from Class 1 to Class 12 (CBSE & ICSE), plus JEE, NEET, UPSC, and state board syllabi. We also have specialists for Spoken English, Coding, Music, and more.",
    icon: <BookOpen className="h-5 w-5 text-blue-400" />,
  },
  {
    q: "Can I get a free demo class before committing?",
    a: "Yes! We offer a completely free demo class with your selected tutor. Evaluate their teaching style, communication, and subject expertise before making any payment. No strings attached.",
    icon: <GraduationCap className="h-5 w-5 text-amber-400" />,
  },
  {
    q: "What are the fees for home tutoring?",
    a: "Fees vary based on experience, subject, class level, and location. Typically ₹500–₹2000 per month depending on frequency and subject. Contact us for a customized quote tailored to your needs.",
    icon: <Award className="h-5 w-5 text-pink-400" />,
  },
];

/* =========================
   HELPERS
========================= */
const getHeatmapClass = (count: number) =>
  count >= 60
    ? "bg-red-50 border-red-200 hover:border-red-400 hover:bg-red-100"
    : count >= 40
    ? "bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100"
    : "bg-indigo-50 border-indigo-200 hover:border-indigo-400 hover:bg-indigo-100";

const getTrend = (count: number) =>
  count >= 50 ? "↑" : count >= 30 ? "→" : "↓";

/* =========================
   COMPONENTS
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

function FAQItem({ q, a, icon }: { q: string; a: string; icon: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className={`rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
        open
          ? "border-violet-300 bg-violet-50 shadow-md shadow-violet-100"
          : "border-gray-100 bg-white hover:border-violet-200 hover:shadow-sm"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 flex items-center justify-center">
            {icon}
          </span>
          <span className="font-semibold text-gray-800 text-base">{q}</span>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-violet-500 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="px-6 pb-5">
          <p className="text-gray-600 leading-relaxed ml-12">{a}</p>
        </div>
      )}
    </div>
  );
}

function StatsRow({ tutorCount }: { tutorCount: number }) {
  const stats = [
    { end: tutorCount, suffix: "+", label: "Verified Tutors", icon: <Users className="h-5 w-5" /> },
    { end: 10000, suffix: "+", label: "Happy Families", icon: <Heart className="h-5 w-5" /> },
    { end: 5, suffix: "/5", label: "Google Rating", icon: <Star className="h-5 w-5" /> },
    { end: 24, suffix: "hr", label: "Match Guarantee", icon: <Zap className="h-5 w-5" /> },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-2xl bg-white/8 backdrop-blur-md border border-white/15 p-5 text-center group hover:bg-white/15 transition-all"
        >
          <div className="flex justify-center mb-2 text-violet-300 group-hover:text-white transition-colors">
            {s.icon}
          </div>
          <div className="text-3xl font-black text-white tracking-tight">
            <CountUp end={s.end} duration={2} />
            {s.suffix}
          </div>
          <div className="text-xs text-purple-200/70 mt-1 font-medium uppercase tracking-wider">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* =========================
   PAGE
========================= */
interface Props {
  city: string;
}

export default function CityHubPage({ city }: Props) {
  const cityKey = city.toLowerCase();
  const cityData = CITY_CONFIG[cityKey];
  const [redirecting] = useState(false);

  if (!cityData) return null;

  const { googleBusinessUrl } = cityData;



  return (
    <>
      <Head>
        <title>{cityData.title}</title>
        <meta name="description" content={cityData.description} />
        <link rel="canonical" href={`https://tutvex.com/${cityKey}`} />
      </Head>

      <div className="min-h-screen bg-white">
        <NavBar />

        {/* ========== HERO — with background image ========== */}
        <section className="relative overflow-hidden min-h-[90vh] flex items-center text-white">
          {/* Unsplash studying/tutoring background */}
         <div
  className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-sm"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&q=80')",
  }}
/>

          {/* Rich dark overlays */}
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

      

          <div className="relative w-full max-w-7xl mx-auto px-4 py-6 lg:py-6">
            {/* Google Rating strip */}
            <a
              href={googleBusinessUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-2xl bg-white/8 backdrop-blur-md border border-white/15 px-5 py-3 mb-10 hover:bg-white/15 transition-all group"
            >
              <div className="h-8 w-8 rounded-full bg-yellow-400/20 flex items-center justify-center shrink-0">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] text-purple-300 font-semibold uppercase tracking-widest">
                  Google Business
                </span>
                <div className="flex items-center gap-2">
                  <StarRating rating={5} />
                  <span className="text-sm font-bold text-white">5.0 / 5</span>
                  <span className="text-xs text-purple-300/80">· Trusted by parents</span>
                </div>
              </div>
              <span className="ml-2 text-xs bg-white/12 rounded-lg px-2.5 py-1 group-hover:bg-white/22 transition flex items-center gap-1 shrink-0">
                Reviews <ArrowRight className="h-3 w-3" />
              </span>
            </a>

            <div className="flex flex-col lg:flex-row lg:items-start gap-16">
              {/* Left content */}
              <div className="flex-1">
              

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
                  <span className="text-white">Best Home</span>
                  <br />
                  <span className="text-white">Tutors in</span>
                  <br />
                  <span
                    className="bg-clip-text text-transparent"
                    style={{
                      backgroundImage:
                        "linear-gradient(135deg, #c084fc 0%, #f472b6 50%, #fbbf24 100%)",
                    }}
                  >
                    {city}
                  </span>
                </h1>

                <p className="mt-7 text-lg text-purple-200/75 max-w-xl leading-relaxed">
                  Background-checked, parent-approved tutors for{" "}
                  <span className="text-white font-semibold">CBSE, ICSE, NEET & JEE</span>. Free
                  demo class, no commitment. Start learning in{" "}
                  <span className="text-white font-semibold">24 hours</span>.
                </p>

                {/* Trust pills */}
                <div className="flex flex-wrap gap-2.5 mt-8">
                  {[
                    { icon: <ShieldCheck className="h-3.5 w-3.5" />, label: "Verified Tutors" },
                    { icon: <Star className="h-3.5 w-3.5 fill-yellow-300 text-yellow-300" />, label: "5/5 Google" },
                    { icon: <Clock className="h-3.5 w-3.5" />, label: "Quick Response" },
                    { icon: <TrendingUp className="h-3.5 w-3.5" />, label: "Result Oriented" },
                  ].map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 px-3.5 py-1.5 text-xs font-semibold text-white"
                    >
                      {b.icon}
                      {b.label}
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    href="/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-bold text-base shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-1 transition-all duration-200"
                  >
                    <MapPin className="h-4 w-4" />
                    Find Tutors Near You
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <a
                    href={CONTACT_TEL}
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border-2 border-white/25 text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-white/18 hover:-translate-y-1 transition-all duration-200"
                  >
                    <Phone className="h-4 w-4" />
                    {CONTACT_NUMBER}
                  </a>
                </div>
              </div>

              {/* Right: Why Tutvex card */}
              <div className="lg:w-[340px] shrink-0">
                  {/* Live badge */}
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/15 border border-green-500/30 px-4 py-1.5 mb-7">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                  </span>
                  <span className="text-xs font-semibold text-green-300">
                    <CountUp end={cityData.tutorCount} duration={2} />+ tutors active right now
                  </span>
                </div>
                <div className="rounded-3xl bg-white/6 backdrop-blur-xl border border-white/12 overflow-hidden">
                  <div className="px-6 py-5 border-b border-white/10 bg-gradient-to-r from-violet-500/20 to-pink-500/15">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">
                      Why Tutvex?
                    </h3>
                    <p className="text-xs text-purple-200/60 mt-0.5">Parents love us for a reason</p>
                  </div>
                  <div className="p-6 space-y-3.5">
                    {[
                      { icon: "🎓", text: "Free demo class before commitment" },
                      { icon: "✅", text: "All tutors background verified" },
                      { icon: "📅", text: "Flexible scheduling & pricing" },
                      { icon: "📈", text: "Weekly progress tracking" },
                      { icon: "💰", text: "Instant refund if unsatisfied" },
                    ].map((f) => (
                      <div key={f.text} className="flex items-center gap-3">
                        <span className="text-base w-7 text-center shrink-0">{f.icon}</span>
                        <span className="text-sm text-purple-100/85 font-medium">{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 pb-6">
                    <a
                      href={googleBusinessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-400/25 to-orange-400/20 border border-yellow-400/35 px-4 py-3 text-sm font-bold text-yellow-300 hover:from-yellow-400/35 hover:to-orange-400/30 transition-all"
                    >
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      Read Google Reviews →
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <StatsRow tutorCount={cityData.tutorCount} />
          </div>
        </section>


        {/* for SEO  */}
        {/* SEO-only section — visually hidden, fully crawlable */}
<section className="sr-only" aria-hidden="false">
  <div className="max-w-7xl mx-auto px-6">
    <h2>Home Tutors in Lucknow – Complete Guide</h2>
    <h3>Best Home Tutors in Lucknow for CBSE, ICSE, NEET & JEE</h3>
    <p>
      Tutvex provides verified home tutors in Lucknow for all classes from Class 1 to Class 12.
      Our tutors cover CBSE, ICSE, ISC, and UP Board syllabus across all major subjects including
      Mathematics, Physics, Chemistry, Biology, English, Hindi, and Social Science.
    </p>

    <h3>Home Tutors in Lucknow by Area</h3>
    <ul>
      <li>Home tutor in Gomti Nagar Lucknow</li>
      <li>Home tutor in Hazratganj Lucknow</li>
      <li>Home tutor in Indira Nagar Lucknow</li>
      <li>Home tutor in Alambagh Lucknow</li>
      <li>Home tutor in Aliganj Lucknow</li>
      <li>Home tutor in Rajajipuram Lucknow</li>
      <li>Home tutor in Vikas Nagar Lucknow</li>
      <li>Home tutor in Chinhat Lucknow</li>
      <li>Home tutor in Mahanagar Lucknow</li>
      <li>Home tutor in Kalyanpur Lucknow</li>
    </ul>

    <h3>Home Tutors by Subject in Lucknow</h3>
    <ul>
      <li>Mathematics home tutor in Lucknow</li>
      <li>Physics home tutor in Lucknow</li>
      <li>Chemistry home tutor in Lucknow</li>
      <li>Biology home tutor in Lucknow</li>
      <li>English home tutor in Lucknow</li>
      <li>Hindi home tutor in Lucknow</li>
      <li>Science home tutor in Lucknow for Class 8, 9, 10</li>
      <li>Accountancy and Commerce tutor in Lucknow</li>
      <li>Computer Science tutor in Lucknow</li>
    </ul>

    <h3>Competitive Exam Tutors in Lucknow</h3>
    <ul>
      <li>JEE Mains and Advanced home tutor in Lucknow</li>
      <li>NEET home tutor in Lucknow</li>
      <li>UPSC coaching and tutor in Lucknow</li>
      <li>NDA tutor in Lucknow</li>
      <li>CUET tutor in Lucknow</li>
    </ul>

    <h3>Home Tutors for Top Schools in Lucknow</h3>
    <ul>
      <li>Tutor for City Montessori School CMS Lucknow</li>
      <li>Tutor for Delhi Public School DPS Lucknow</li>
      <li>Tutor for La Martiniere College Lucknow</li>
      <li>Tutor for St. Francis College Lucknow</li>
      <li>Tutor for Spring Dale College Lucknow</li>
      <li>Tutor for Loreto Convent Lucknow</li>
      <li>Tutor for Colvin Taluqdars College Lucknow</li>
    </ul>

    <h3>Home Tutors for Colleges and Universities in Lucknow</h3>
    <ul>
      <li>Tutor for Lucknow University LU students</li>
      <li>Tutor for KGMU King George Medical University Lucknow</li>
      <li>Tutor for BBAU Babasaheb Bhimrao Ambedkar University Lucknow</li>
      <li>Tutor for Integral University Lucknow</li>
      <li>Tutor for IIIT Lucknow students</li>
      <li>Tutor for IIM Lucknow preparation</li>
    </ul>

    <h3>Why Choose Tutvex for Home Tutoring in Lucknow?</h3>
    <p>
      Tutvex is Lucknow's most trusted home tutoring platform with 1200+ verified tutors
      available across all localities. Every tutor is background checked, qualification verified,
      and parent approved. We offer a free demo class before any commitment, flexible scheduling,
      and weekly progress tracking for every student.
    </p>

    <h3>Frequently Asked Questions – Home Tutors in Lucknow</h3>
    <dl>
      <dt>How much does a home tutor cost in Lucknow?</dt>
      <dd>
        Home tutor fees in Lucknow range from ₹500 to ₹2000 per month depending on the subject,
        class level, and tutor experience. Contact Tutvex for a free customized quote.
      </dd>
      <dt>How do I find a verified home tutor in Lucknow?</dt>
      <dd>
        Visit Tutvex and select your area or subject. We match you with 2 to 3 verified tutors
        within 24 hours. You can take a free demo class before confirming.
      </dd>
      <dt>Are Tutvex tutors available for home visits in Gomti Nagar and Hazratganj?</dt>
      <dd>
        Yes. Tutvex has verified home tutors available in Gomti Nagar, Hazratganj, Indira Nagar,
        Alambagh, Aliganj, and all other major localities of Lucknow.
      </dd>
    </dl>
  </div>
</section>

        {/* ========== SUBJECT TAGS STRIP ========== */}
        <section className="bg-gradient-to-r from-violet-700 via-purple-700 to-indigo-800 py-4 overflow-hidden">
          <div className="flex flex-wrap gap-3 justify-center max-w-7xl mx-auto px-6">
            {[
              "Mathematics", "Physics", "Chemistry", "Biology", "English",
              "Hindi", "Science", "Computer", "JEE Prep", "NEET Prep",
              "CBSE Class 10", "CBSE Class 12", "ICSE", "Spoken English",
            ].map((sub) => (
              <span
                key={sub}
                className="rounded-full bg-white/15 border border-white/20 px-4 py-1.5 text-sm font-semibold text-white"
              >
                {sub}
              </span>
            ))}
          </div>
        </section>

        {/* Tutors for Top */}
 
 {/* ============================================================
    INSTITUTION SECTION — Schools & Colleges
    Drop-in replacement for the existing <section> block
    ============================================================ */}

<section className="py-10 bg-white-800">
  <div className="max-w-7xl mx-auto px-4">

    {/* ── Section Header ── */}
    <div className="mb-12">
      <div className="inline-flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-violet-700 bg-violet-50 border border-violet-200 px-3.5 py-1.5 rounded-full mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
        📍 Lucknow
      </div>

      <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3 leading-tight">
        Find Tutors for{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
          Your Institution
        </span>
      </h2>

      <p className="text-gray-500 text-base max-w-lg leading-relaxed">
        Expert home tutors for top schools, colleges &amp; universities in Lucknow
      </p>
    </div>

    {/* ══════════════════════════════════════════
        SCHOOLS SEGMENT
    ══════════════════════════════════════════ */}
    <div className="relative flex items-center gap-3 mb-5 pb-3 border-b-0">
      {/* Left accent line */}
      <div className="h-px flex-1 bg-gradient-to-r from-indigo-400 to-transparent hidden sm:block" />

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
          <BookOpen className="h-4 w-4 text-blue-600" />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-blue-700">
          Schools &amp; Junior Colleges
        </span>
        <span className="text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-1 rounded-full">
          12 institutions
        </span>
      </div>

      <div className="h-px flex-1 bg-gradient-to-l from-indigo-200 to-transparent hidden sm:block" />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
      {[
        { name: "City Montessori School (CMS)", tag: "ICSE",  emoji: "📖" },
        { name: "Delhi Public School (DPS)",    tag: "CBSE",  emoji: "🏫" },
        { name: "La Martiniere College",         tag: "ISC",   emoji: "✏️" },
        { name: "St. Francis College",           tag: "ISC",   emoji: "📚" },
        { name: "Spring Dale College",           tag: "CBSE",  emoji: "🎓" },
        { name: "Colvin Taluqdars' College",     tag: "CBSE",  emoji: "📐" },
        { name: "Loreto Convent",                tag: "ISC",   emoji: "🔬" },
        { name: "St. Fidelis College",           tag: "ISC",   emoji: "🧮" },
        { name: "Army Public School",            tag: "CBSE",  emoji: "🏅" },
        { name: "Kendriya Vidyalaya (KV)",       tag: "CBSE",  emoji: "📝" },
        { name: "Jaipuria School",               tag: "CBSE",  emoji: "🌟" },
        { name: "Ryan International School",     tag: "CBSE",  emoji: "🎒" },
      ].map(({ name, tag, emoji }) => (
        <Link
          key={name}
          href={`/tutors?school=${encodeURIComponent(name)}`}
          className="
            group relative flex flex-col gap-2.5 rounded-2xl p-4
            bg-white border-[1.5px] border-gray-100
            hover:border-transparent hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)]
            hover:-translate-y-1 transition-all duration-200 overflow-hidden
          "
        >
          {/* Top gradient bar — shown on hover */}
          <span className="
            absolute top-0 inset-x-0 h-[3px] rounded-t-2xl
            bg-gradient-to-r from-indigo-500 to-blue-500
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
          " />

          {/* Icon row */}
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-base shrink-0">
              {emoji}
            </div>
            <span className="
              text-[11px] font-extrabold text-indigo-600
              opacity-0 group-hover:opacity-100 group-hover:translate-x-0
              -translate-x-1 transition-all duration-200
            ">
              Find →
            </span>
          </div>

          {/* Name */}
          <p className="text-[12px] font-extrabold text-gray-800 leading-snug group-hover:text-indigo-700 transition-colors">
            {name}
          </p>

          {/* Board tag */}
          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-100 w-fit">
            {tag}
          </span>
        </Link>
      ))}
    </div>

    {/* ══════════════════════════════════════════
        COLLEGES SEGMENT
    ══════════════════════════════════════════ */}
    <div className="relative flex items-center gap-3 mb-5 pb-3">
      <div className="h-px flex-1 bg-gradient-to-r from-violet-200 to-transparent hidden sm:block" />

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center">
          <GraduationCap className="h-4 w-4 text-violet-600" />
        </div>
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-violet-700">
          Colleges &amp; Universities
        </span>
        <span className="text-[10px] font-bold bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full">
          12 institutions
        </span>
      </div>

      <div className="h-px flex-1 bg-gradient-to-l from-violet-200 to-transparent hidden sm:block" />
    </div>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-12">
      {[
        { name: "Lucknow University",           tag: "Arts / Science",   emoji: "🏛️" },
        { name: "BBAU",                          tag: "Central Uni",      emoji: "⚗️" },
        { name: "Integral University",           tag: "Engineering",      emoji: "💻" },
        { name: "Amity University",              tag: "Private Uni",      emoji: "🎓" },
        { name: "IIM Lucknow",                   tag: "Management",       emoji: "📊" },
        { name: "KGMU",                          tag: "Medical",          emoji: "🏥" },
        { name: "Ram Manohar Lohia Institute",   tag: "Medical",          emoji: "🩺" },
        { name: "SGPGI",                         tag: "PG Medical",       emoji: "🔬" },
        { name: "CSJMU",                         tag: "University",       emoji: "📜" },
        { name: "Era University",                tag: "Medical & Dental", emoji: "🦷" },
        { name: "IIIT Lucknow",                  tag: "Engineering",      emoji: "⚙️" },
        { name: "SRMU",                          tag: "Engineering",      emoji: "🏗️" },
      ].map(({ name, tag, emoji }) => (
        <Link
          key={name}
          href={`/tutors?college=${encodeURIComponent(name)}`}
          className="
            group relative flex flex-col gap-2.5 rounded-2xl p-4
            bg-white border-[1.5px] border-gray-100
            hover:border-transparent hover:shadow-[0_8px_24px_rgba(139,92,246,0.15)]
            hover:-translate-y-1 transition-all duration-200 overflow-hidden
          "
        >
          {/* Top gradient bar */}
          <span className="
            absolute top-0 inset-x-0 h-[3px] rounded-t-2xl
            bg-gradient-to-r from-violet-500 to-pink-500
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
          " />

          {/* Icon row */}
          <div className="flex items-start justify-between">
            <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center text-base shrink-0">
              {emoji}
            </div>
            <span className="
              text-[11px] font-extrabold text-violet-600
              opacity-0 group-hover:opacity-100 group-hover:translate-x-0
              -translate-x-1 transition-all duration-200
            ">
              Find →
            </span>
          </div>

          {/* Name */}
          <p className="text-[12px] font-extrabold text-gray-800 leading-snug group-hover:text-violet-700 transition-colors">
            {name}
          </p>

          {/* Type tag */}
          <span className="inline-flex items-center text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-50 text-violet-800 border border-violet-100 w-fit">
            {tag}
          </span>
        </Link>
      ))}
    </div>

    {/* ══════════════════════════════════════════
        BOTTOM CTA — dark premium banner
    ══════════════════════════════════════════ */}
    <div className="relative overflow-hidden rounded-2xl bg-[#0f0a2e] px-8 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 via-violet-600/35 to-pink-600/25 pointer-events-none" />

      {/* Dot texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,1) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Left text */}
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 text-[9px] font-extrabold uppercase tracking-[0.14em] text-violet-300 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
          200+ Institutions Covered
        </div>
        <p className="text-lg font-black text-white mb-1">
          Don't see your institution?
        </p>
        <p className="text-sm text-white/50">
          We cover schools &amp; colleges across all of Lucknow
        </p>
      </div>

      {/* CTA button */}
      <Link
        href="/subjects/?source=INST_SECTION"
        className="
          relative shrink-0 inline-flex items-center gap-2.5
          bg-white text-indigo-700 px-6 py-3.5 rounded-xl
          font-extrabold text-sm shadow-lg
          hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200
        "
      >
        <span className="w-5 h-5 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-black">
          →
        </span>
        Find Tutor Anyway
      </Link>
    </div>

  </div>
</section>

        {/* ========== LOCATIONS ========== */}
      
{/* Header Section */}
<main className="max-w-7xl mx-auto px-4 py-10">
  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
    <div>
      <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-violet-600 mb-4 bg-violet-50 border border-violet-200 px-3.5 py-1.5 rounded-full shadow-sm">
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
        Explore by Area
      </span>

      <h2 className="text-[2.75rem] font-black text-gray-950 tracking-tight leading-[1.1]">
        Popular Areas in{" "}
        <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
          {city}
        </span>
      </h2>

      <p className="mt-3 text-gray-500 text-lg font-medium">
        Click any area to connect with local tutors instantly
      </p>
    </div>

    {/* ✅ FIX: anchor tag properly added */}
    {googleBusinessUrl && (
      <a
        href={googleBusinessUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 text-sm text-gray-700 hover:text-violet-700 transition-all shrink-0 bg-white border border-gray-200 hover:border-violet-300 rounded-2xl px-5 py-3 shadow-sm hover:shadow-md"
      >
        <StarRating rating={5} />
        <div className="flex flex-col leading-none">
          <span className="font-black text-base text-gray-900">5.0</span>
          <span className="text-[11px] text-gray-400 font-medium mt-0.5">
            on Google
          </span>
        </div>
      </a>
    )}
  </div>

  {/* Grid */}
  <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
    {cityData?.locations?.map((area: string, index: number) => {
      const demand = FALLBACK_DEMAND[index % FALLBACK_DEMAND.length] ?? 20;
      const rating = AREA_RATINGS[area] ?? 4.3;
      const isHot = demand >= 50;

      return (
        <Link
          key={area}
          href={`/tutors?source=MOBILE_NAV&campaign=FIND_TUTOR&area=${encodeURIComponent(area)}`}
          className={`
            group relative flex flex-col text-left rounded-3xl p-5 overflow-hidden
            bg-white border border-gray-100
            shadow-[0_2px_12px_rgba(0,0,0,0.06)]
            hover:shadow-[0_8px_30px_rgba(109,40,217,0.15)]
            hover:-translate-y-2 hover:border-violet-200
            transition-all duration-300 ease-out
            ${getHeatmapClass(demand)}
          `}
        >
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50/0 to-purple-50/0 group-hover:from-violet-50/60 group-hover:to-purple-50/40 transition-all duration-300 rounded-3xl" />

          {/* Hot badge */}
          {isHot && (
            <span className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[10px] px-2.5 py-1 rounded-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-bold shadow-lg shadow-red-200 z-10">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              Hot
            </span>
          )}

          {/* Rating */}
          <div className="relative flex items-center justify-between mb-5 z-10">
            <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 rounded-full px-2.5 py-1">
              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              <span className="text-[11px] font-bold text-amber-700">
                {rating}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-violet-50 border border-violet-100 rounded-full px-2.5 py-1">
              <span className="text-[11px] font-bold text-violet-700">
                <CountUp end={demand} duration={1.5} />+ tutors
              </span>
            </div>
          </div>

          {/* Area */}
          <div className="relative z-10 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-1">
              Home Tutor in
            </span>
            <span className="block text-lg font-black text-gray-900 group-hover:text-violet-700 transition-colors duration-200 leading-tight">
              {area}
            </span>
          </div>

          {/* Footer */}
          <div className="relative z-10 mt-4 pt-4 border-t border-gray-100 group-hover:border-violet-100 transition-colors flex items-center justify-between">
            <span className="text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
              <Users className="h-3.5 w-3.5" />
              Tap to connect
            </span>
            <span className="text-lg group-hover:translate-x-0.5 transition-transform duration-200">
              {getTrend(demand)}
            </span>
          </div>
        </Link>
      );
    })}
  </div>
</main>


        {/* ========== HOW IT WORKS ========== */}
        <section className="bg-gradient-to-br from-slate-50 to-violet-50 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 mb-4 bg-violet-100 px-4 py-1.5 rounded-full">
                Simple Process
              </span>
              <h2 className="text-4xl font-black text-gray-900">How It Works</h2>
              <p className="mt-3 text-gray-500 text-lg max-w-xl mx-auto">
                Get your child a perfect tutor in 3 simple steps
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-16 left-[34%] right-[34%] h-0.5 bg-gradient-to-r from-violet-200 via-purple-200 to-pink-200" />
              {[
                {
                  step: "01",
                  icon: <MapPin className="h-8 w-8" />,
                  title: "Select Your Area",
                  desc: "Choose your locality from our extensive list of covered areas in the city.",
                  color: "from-violet-500 to-purple-600",
                  bg: "bg-violet-50 border-violet-200",
                },
                {
                  step: "02",
                  icon: <Users className="h-8 w-8" />,
                  title: "Meet Your Tutor",
                  desc: "We match you with 2-3 verified tutors. Take a free demo class with each.",
                  color: "from-pink-500 to-rose-600",
                  bg: "bg-pink-50 border-pink-200",
                },
                {
                  step: "03",
                  icon: <GraduationCap className="h-8 w-8" />,
                  title: "Start Learning",
                  desc: "Confirm your tutor, set a schedule, and start achieving great results.",
                  color: "from-amber-500 to-orange-600",
                  bg: "bg-amber-50 border-amber-200",
                },
              ].map((item) => (
                <div key={item.step} className={`relative rounded-3xl border-2 ${item.bg} p-8 text-center`}>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-black text-white bg-gradient-to-r from-gray-800 to-gray-900 rounded-full w-8 h-8 flex items-center justify-center shadow-lg">
                    {item.step}
                  </div>
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white mx-auto mb-5 shadow-lg`}
                  >
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      
        {/* ========== TESTIMONIALS ========== */}
        <section className="py-20 bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-900 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #f472b6 0%, transparent 50%), radial-gradient(circle at 80% 50%, #818cf8 0%, transparent 50%)",
            }}
          />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-purple-300 mb-4 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full">
                Parent Stories
              </span>
              <h2 className="text-4xl font-black text-white">What Parents Say</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Priya Sharma",
                  area: "Gomti Nagar, Lucknow",
                  text: "Found an amazing NEET tutor within 24 hours. My daughter's score improved by 80 marks in just 3 months. Highly recommend!",
                  rating: 5,
                },
                {
                  name: "Rakesh Gupta",
                  area: "Civil Lines, Kanpur",
                  text: "The verification process gives so much confidence. The Maths tutor Tutvex assigned is absolutely wonderful and patient.",
                  rating: 5,
                },
                {
                  name: "Sunita Agarwal",
                  area: "Indira Nagar, Lucknow",
                  text: "Free demo class before committing is a game changer. My son finally enjoys studying now. Best decision we made!",
                  rating: 5,
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="rounded-3xl bg-white/8 backdrop-blur-md border border-white/12 p-6 hover:bg-white/12 transition-all"
                >
                  <StarRating rating={t.rating} />
                  <p className="mt-4 text-purple-100/80 leading-relaxed italic">"{t.text}"</p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white font-black text-sm shrink-0">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{t.name}</p>
                      <p className="text-purple-300/70 text-xs">{t.area}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
          {/* ========== FAQ ========== */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-14">
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-violet-600 mb-4 bg-violet-50 border border-violet-100 px-4 py-1.5 rounded-full">
                Got Questions?
              </span>
              <h2 className="text-4xl font-black text-gray-900">
                Frequently Asked Questions
              </h2>
              <p className="mt-3 text-gray-500 text-lg">
                Everything parents want to know about Tutvex
              </p>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq) => (
                <FAQItem key={faq.q} q={faq.q} a={faq.a} icon={faq.icon} />
              ))}
            </div>

            {/* Still have questions */}
            <div className="mt-12 rounded-3xl bg-gradient-to-br from-violet-50 to-purple-50 border-2 border-violet-100 p-8 text-center">
              <h3 className="text-xl font-black text-gray-900 mb-2">Still have questions?</h3>
              <p className="text-gray-500 mb-6">
                Our team is available 7 days a week to help you find the perfect tutor
              </p>
              <a
                href={CONTACT_TEL}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-purple-200 hover:shadow-purple-300 hover:-translate-y-0.5 transition-all"
              >
                <Phone className="h-4 w-4" />
                Call Us: {CONTACT_NUMBER}
              </a>
            </div>
          </div>
        </section>


        {/* ========== FINAL CTA BANNER ========== */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <div
              className="rounded-3xl overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #0f0824 0%, #1e0e4a 40%, #0c1a3a 100%)",
              }}
            >
              {/* Secondary bg image */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-15"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1513258496099-48168024aec0?w=1200&q=60')",
                }}
              />
              <div className="pointer-events-none absolute top-0 left-0 h-64 w-64 rounded-full bg-violet-500/20 blur-[80px]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-pink-500/20 blur-[80px]" />

              <div className="relative px-8 py-16 md:px-16">
                <div className="flex flex-col md:flex-row justify-between gap-10 items-start md:items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <StarRating rating={5} />
                      <span className="text-sm text-purple-300 font-semibold">
                        5/5 on Google · 10000+ families trust us
                      </span>
                    </div>
                    <h3 className="text-4xl font-black text-white leading-tight">
                      Ready to Find Your
                      <br />
                      <span
                        className="bg-clip-text text-transparent"
                        style={{ backgroundImage: "linear-gradient(90deg, #c084fc, #f472b6)" }}
                      >
                        Perfect Tutor?
                      </span>
                    </h3>
                    <p className="mt-4 text-purple-200/70 max-w-lg text-lg">
                      Free demo class · No commitment · Start within 24 hours
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    <a
                      href={CONTACT_TEL}
                      className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-500 to-pink-500 px-8 py-4 text-white font-bold shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-1 transition-all"
                    >
                      <Phone className="h-4 w-4" />
                      Call Now
                    </a>
                    <a
                      href={googleBusinessUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-2xl bg-white/10 border-2 border-white/20 backdrop-blur-md px-8 py-4 text-white font-bold hover:bg-white/18 hover:-translate-y-1 transition-all"
                    >
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      Google Reviews
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {redirecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-2xl bg-white px-8 py-5 shadow-2xl">
            <Loader2 className="h-6 w-6 animate-spin text-violet-600" />
            <span className="font-semibold text-gray-800">Connecting you with tutors…</span>
          </div>
        </div>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: [
    { params: { city: "kanpur" } },
    { params: { city: "lucknow" } },
  ],
  fallback: false,
});

export const getStaticProps: GetStaticProps = async ({ params }) => ({
  props: { city: params?.city as string },
  revalidate: 86400,
});