

import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  PhoneCall,
  BookOpen,
  GraduationCap,
  Star,
  Users,
  MapPin,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  
  Building2,
  Navigation,
 
  Search,
  UserPlus,
 
} from "lucide-react";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { ALLAHABAD_LOCATION_SNIPPETS } from "@/components/seo/content/allahabadLocationSnippets";
import { ALLAHABAD_LOCATIONS } from "@/components/seo/seo.config";
import AllahabadFAQSchema from "@/components/seo/Allahabad_FAQ";

/* =========================
   CONTACT & GBP CONFIG
========================= */
const PHONE_NUMBER = "+919305275932";
const WHATSAPP_NUMBER = "919305275932";
const WHATSAPP_DEFAULT_MSG = "Hello%2C%20I%20need%20a%20tutor%20in%20Allahabad";
const GOOGLE_BUSINESS_LINK = "https://share.google/S33LPeNKRG5whFEke";
const GOOGLE_CID_LINK = "https://www.google.com/maps?cid=7024959596788940233";
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d230660.86914568208!2d81.66150881640627!3d25.4022638!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x862286d3776211db%3A0x617dab8890137dc9!2sTutvex%20%E2%80%93%20Home%20Tuition%20Provider%2C%20Prayagraj!5e0!3m2!1sen!2sin!4v1784877450430!5m2!1sen!2sin";

/* =========================
   OPTIMIZED UNSPLASH IMAGES
========================= */
const IMAGES = {
  hero: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
  tutor: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80",
  student: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  online: "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=800&q=80",
  parent: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80",
  books: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
  education: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
};

/* =========================
   FALLBACK COUNTS
========================= */
const FALLBACK_COUNTS = [
  20, 34, 40, 56, 10, 28, 45, 62, 30, 25, 23, 56, 9, 10, 32, 42,
];

const getFallbackNumeric = (index: number): number =>
  FALLBACK_COUNTS[index % FALLBACK_COUNTS.length] ?? 20;

/* =========================
   AREA RATINGS
========================= */
const AREA_RATINGS: Record<string, number> = {
  "Civil Lines": 4.8,
  Katra: 4.6,
  Naini: 4.2,
  Jhusi: 4.1,
  GeorgeTown: 4.7,
  Prayagraj: 4.9,
};

/* =========================
   COUNT UP HOOK
========================= */
const useCountUp = (value: number) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const step = Math.max(1, Math.ceil(value / 15));
    const interval = setInterval(() => {
      current += step;
      if (current >= value) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(current);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [value]);

  return count;
};

/* =========================
   AREA CARD COMPONENT
========================= */
function AreaCard({
  area,
  index,
  count,
  onRedirect,
}: {
  area: string;
  index: number;
  count: number;
  onRedirect: (url: string) => void;
}) {
  const rating = AREA_RATINGS[area] ?? 4.5;
  const animated = useCountUp(count);
  const demand =
    count >= 60 ? "High Demand" : count >= 40 ? "Rising" : "Available";
  const demandColor =
    count >= 60
      ? "bg-red-100 text-red-700 border-red-200"
      : count >= 40
      ? "bg-amber-100 text-amber-700 border-amber-200"
      : "bg-emerald-100 text-emerald-700 border-emerald-200";

  const ringColor =
    count >= 60
      ? "ring-red-200"
      : count >= 40
      ? "ring-amber-200"
      : "ring-sky-200";

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35 }}
      onClick={() => onRedirect(`/tutors?city=allahabad&area=${area}`)}
      className={`group relative w-full text-left bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ring-1 ${ringColor} hover:ring-2`}
      aria-label={`View home tutors in ${area}`}
    >
      {/* Demand badge */}
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${demandColor} mb-3`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {demand}
      </span>

      {/* Area name */}
      <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-tight">
        <MapPin className="inline-block w-3.5 h-3.5 mr-1 text-indigo-400" />
        {area}
      </h3>

      <p className="text-xs text-gray-500 mt-0.5">Home Tutor Available</p>

      {/* Stats row */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold text-gray-700">{rating}</span>
        </div>

        <div className="flex items-center gap-1 text-indigo-600">
          <Users className="w-3.5 h-3.5" />
          <span className="text-xs font-bold">{animated}+ tutors</span>
        </div>
      </div>

      {/* Arrow */}
      <ChevronRight className="absolute top-5 right-4 w-4 h-4 text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
    </motion.button>
  );
}

/* =========================
   MAIN LANDING PAGE
========================= */
export default function AllahabadLandingPage() {
  const [loading, setLoading] = useState(false);
  const [areaTutorCount, setAreaTutorCount] = useState<Record<string, number>>({});
  const [totalTutors, setTotalTutors] = useState(800);

  useEffect(() => {
    fetch("/api/tutors/count?city=allahabad")
      .then((res) => res.json())
      .then((data) => {
        setTotalTutors(data.total || 800);
        setAreaTutorCount(data.areas || {});
      })
      .catch(() => {
        setTotalTutors(800);
        setAreaTutorCount({});
      });
  }, []);

  const sortedAreas = useMemo(() => {
    return [...ALLAHABAD_LOCATIONS].sort((a, b) => {
      const aCount =
        areaTutorCount[a] ?? getFallbackNumeric(ALLAHABAD_LOCATIONS.indexOf(a));
      const bCount =
        areaTutorCount[b] ?? getFallbackNumeric(ALLAHABAD_LOCATIONS.indexOf(b));
      if (bCount !== aCount) return bCount - aCount;
      const aRating = AREA_RATINGS[a] ?? 4.0;
      const bRating = AREA_RATINGS[b] ?? 4.0;
      return bRating - aRating;
    });
  }, [areaTutorCount]);

  const handleRedirect = (url: string) => {
    setLoading(true);
    setTimeout(() => (window.location.href = url), 600);
  };

  const animatedTotal = useCountUp(totalTutors);

  // Full Rich Schemas
  const pageCanonical = "https://tutvex.com/allahabad";
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
name: "Tutvex – Home Tuition Provider, Prayagraj",
url: pageCanonical,
    telephone: PHONE_NUMBER,
    logo: "https://tutvex.com/logo.png",
    image: IMAGES.hero,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Civil Lines, Near Subhash Chauraha",
      addressLocality: "Allahabad",
      addressRegion: "UP",
      postalCode: "211001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.4526,
      longitude: 81.8349,
    },
   areaServed: [
  {
    "@type": "City",
    name: "Prayagraj",
    alternateName: "Allahabad",
  },
  { "@type": "Place", name: "Civil Lines, Prayagraj" },
  { "@type": "Place", name: "Katra, Prayagraj" },
  { "@type": "Place", name: "George Town, Prayagraj" },
  { "@type": "Place", name: "Tagore Town, Prayagraj" },
  { "@type": "Place", name: "Teliarganj, Prayagraj" },
  { "@type": "Place", name: "Salori, Prayagraj" },
  { "@type": "Place", name: "Allapur, Prayagraj" },
  { "@type": "Place", name: "Bada Baghada, Prayagraj" },
  { "@type": "Place", name: "Chhota Baghada, Prayagraj" },
  { "@type": "Place", name: "Daraganj, Prayagraj" },
  { "@type": "Place", name: "Colonelganj, Prayagraj" },
  { "@type": "Place", name: "Mumfordganj, Prayagraj" },
  { "@type": "Place", name: "Ashok Nagar, Prayagraj" },
  { "@type": "Place", name: "Rajrooppur, Prayagraj" },
  { "@type": "Place", name: "Dhoomanganj, Prayagraj" },
  { "@type": "Place", name: "Preetam Nagar, Prayagraj" },
  { "@type": "Place", name: "Kalindipuram, Prayagraj" },
  { "@type": "Place", name: "Lukerganj, Prayagraj" },
  { "@type": "Place", name: "Naini, Prayagraj" },
  { "@type": "Place", name: "Jhusi, Prayagraj" },
  { "@type": "Place", name: "Phaphamau, Prayagraj" },
  { "@type": "Place", name: "Jhalwa, Prayagraj" },
  { "@type": "Place", name: "Bamrauli, Prayagraj" },
  { "@type": "Place", name: "Sulem Sarai, Prayagraj" },
  { "@type": "Place", name: "Leader Road, Prayagraj" },
  { "@type": "Place", name: "Chowk, Prayagraj" },
  { "@type": "Place", name: "Kareli, Prayagraj" },
  { "@type": "Place", name: "Allahpur, Prayagraj" }
],
serviceType: [
  "1-to-1 Home Tuition",
  "Home Tutoring for Classes 1 to 12",
  "CBSE Home Tuition",
  "ICSE Home Tuition",
  "ISC Home Tuition",
  "UP Board Home Tuition",
  "Mathematics Home Tuition",
  "Science Home Tuition",
  "Physics Home Tuition",
  "Chemistry Home Tuition",
  "Biology Home Tuition",
  "English Home Tuition",
  "JEE Home Tutoring",
  "NEET Home Tutoring",
],

knowsAbout: [
  "Home Tuition",
  "Home Tutoring",
  "Private Tutoring",
  "One-to-One Tutoring",
  "Primary School Education",
  "Secondary School Education",
  "Senior Secondary Education",
  "CBSE",
  "ICSE",
  "ISC",
  "UP Board",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "JEE",
  "NEET",
],

// hasMap: GOOGLE_BUSINESS_LINK,
    hasMap: GOOGLE_BUSINESS_LINK,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tutvex.com" },
      { "@type": "ListItem", position: 2, name: "Allahabad Tutors", item: pageCanonical },
    ],
  };

  return (
    <>
      <Head>
       <title>Home Tuition in Prayagraj (Allahabad) | Verified Home Tutors – Tutvex</title>
       <meta
            name="description"
            content="Find verified home tuition in Prayagraj (Allahabad) with experienced home tutors for CBSE, ICSE, ISC & UP Board. Classes 1–12, JEE & NEET tutors near you."
          />
       <meta
  name="description"
  content="Find verified home tuition in Prayagraj (Allahabad) with experienced home tutors for CBSE, ICSE, ISC & UP Board. Classes 1–12, JEE & NEET tutors near you."
/>

<meta name="robots" content="index, follow, max-image-preview:large" />
        {/* <meta name="robots" content="index, follow, max-image-preview:large" /> */}
        <link rel="canonical" href={pageCanonical} />

        {/* Local Geo Meta */}
        <meta name="geo.region" content="IN-UP" />
        <meta name="geo.placename" content="Allahabad, Prayagraj, Uttar Pradesh, India" />
        <meta name="geo.position" content="25.4358;81.8463" />
        <meta name="ICBM" content="25.4358, 81.8463" />

        {/* Open Graph */}
        {/* <meta property="og:title" content="Home Tutors in Allahabad (Prayagraj) | Verified Teachers – Tutvex" /> */}
        {/* <meta property="og:description" content="Find background-verified home tutors in Allahabad across Civil Lines, Katra, Naini, Jhusi & Prayagraj. Book a free demo class!" /> */}
        <meta
  property="og:title"
  content="Home Tuition in Prayagraj (Allahabad) | Verified Home Tutors – Tutvex"
/>

<meta
  property="og:description"
  content="Find verified home tutors and home tuition in Prayagraj (Allahabad) for Classes 1–12, CBSE, ICSE, ISC & UP Board, JEE and NEET."
/>
        <meta property="og:url" content={pageCanonical} />
        <meta property="og:image" content={IMAGES.hero} />

        {/* Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      </Head>

      <NavBar />

      {/* ── TOP CONTACT BAR ── */}
      <div className="w-full bg-indigo-950 text-indigo-100 text-sm py-2.5 px-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5 z-40">
        <a
          href={`tel:${PHONE_NUMBER}`}
          className="flex items-center gap-2 font-semibold hover:text-white transition whitespace-nowrap"
        >
          <span className="text-green-400">📞</span> Call Now: {PHONE_NUMBER}
        </a>
        <span className="hidden sm:inline opacity-30">|</span>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 font-semibold hover:text-white transition whitespace-nowrap"
        >
          <span className="text-green-400">💬</span> WhatsApp pe Chat Karo
        </a>
        <span className="hidden sm:inline opacity-30">|</span>
        <a
          href={GOOGLE_BUSINESS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-medium hover:text-white transition whitespace-nowrap"
        >
          ⭐ View Tutvex on Google Maps
        </a>
      </div>

      {/* ── HERO SECTION WITH OPTIMIZED NEXT/IMAGE ── */}
      <section className="relative overflow-hidden bg-[#0a0e2a] text-white py-16 md:py-24">
        {/* Optimized Background Image via next/image */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={IMAGES.hero}
            // alt="Verified Home Tutors in Allahabad Prayagraj"
            alt="Home tuition in Prayagraj with verified home tutors"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Soft Decorative Glow overlays */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-indigo-600/30 blur-3xl" />
          <div className="absolute top-1/2 -left-24 w-[320px] h-[320px] rounded-full bg-purple-600/20 blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            {/* Pill badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Prayagraj's Most Trusted Tutor Platform
            </motion.div>

            {/* H1 Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight"
            >
              <span className="bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
  Home Tuition in Prayagraj
</span>
<br />
<span className="text-white">(Allahabad)</span>{" "}
<span className="text-indigo-300 text-3xl md:text-4xl font-bold">
  – Verified Home Tutors
</span>
            </motion.h1>

          <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-6 text-lg text-slate-300 max-w-2xl leading-relaxed"
            >
              Find trusted <strong className="text-white">home tutors in Prayagraj</strong>{" "}
              for personalized 1-to-1{" "}
              <strong className="text-white">home tuition in Allahabad</strong>. Choose
              from{" "}
              <span className="font-bold text-white">{animatedTotal}+</span>{" "}
              background-verified tutors for CBSE, ICSE, ISC, UP Board, Classes 1–12,
              JEE &amp; NEET.
</motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <button
                onClick={() =>
                  handleRedirect("/subjects/?source=ALLAHABAD_HERO&campaign=SUBJECTS")
                }
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-indigo-900/50 hover:scale-105 transition-all duration-200 text-base"
              >
                <BookOpen className="w-4 h-4" />
                Browse Subjects in Your Area
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-bold px-8 py-4 rounded-2xl shadow-lg shadow-emerald-900/30 hover:scale-105 transition-all duration-200 text-base"
              >
                💬 WhatsApp Karo
              </a>
            </motion.div>

            {/* Trust Badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-10 flex flex-wrap items-center gap-3"
            >
              <a
                href={GOOGLE_BUSINESS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/20 hover:scale-105 transition-all duration-200 cursor-pointer"
              >
                ⭐⭐⭐⭐⭐
                <span className="text-slate-300">View Reviews on Google Maps</span>
                <ExternalLink size={16} className="opacity-80" />
              </a>

              <span className="inline-flex items-center gap-2 bg-white/8 border border-white/10 backdrop-blur px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200">
                ✅ Background Verified Tutors
              </span>

              <span className="inline-flex items-center gap-2 bg-white/8 border border-white/10 backdrop-blur px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200">
                🏠 Home + Online Classes
              </span>
            </motion.div>
          </div>

          {/* Right Hero Card with Image */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-indigo-400/20">
              <Image
                src={IMAGES.tutor}
                // alt="Expert Home Teacher in Prayagraj"
                alt="Verified home tutor in Prayagraj for Classes 1 to 12"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white">
                <p className="font-bold text-sm">1-on-1 Personalized Mentorship</p>
                <p className="text-xs text-slate-300">Available across all 30+ localities of Prayagraj</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <div className="bg-indigo-600">
        <div className="max-w-6xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
          {[
            { icon: "👨‍🏫", value: `${animatedTotal}+`, label: "Verified Tutors" },
            { icon: "📍", value: "30+", label: "Areas Covered" },
            { icon: "⭐", value: "4.9", label: "Avg Rating" },
            { icon: "📚", value: "100+", label: "Subjects" },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl mb-1">{s.icon}</div>
              <div className="text-3xl font-extrabold">{s.value}</div>
              <div className="text-indigo-200 text-sm mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI SEARCH & DIRECT OVERVIEW SECTION (Gemini / ChatGPT / Perplexity GEO) ── */}
      <section className="max-w-7xl mx-auto px-6 my-16">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6 sm:p-10 border border-indigo-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider">
              AI Search Overview & Direct Answer
            </span>
            <span className="text-xs text-gray-500 font-medium">Allahabad Home Tuition (2026)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
  Best Home Tutors in Prayagraj (Allahabad) for Classes 1–12
</h2>

        <p className="mt-3 text-gray-700 text-base sm:text-lg leading-relaxed">
  <strong>Tutvex</strong> is a trusted{" "}
  <strong>home tuition provider in Prayagraj</strong>, connecting students
  and parents with experienced{" "}
  <strong>home tutors in Allahabad</strong> for personalized 1-to-1
  learning. We provide <strong>home tuition in Prayagraj</strong> for
  Classes 1–12, CBSE, ICSE, ISC and UP Board, along with JEE and NEET
  preparation. Tutors are available across{" "}
  <span className="font-semibold text-indigo-900">
    Civil Lines, Katra, George Town, Naini, Jhusi, Teliarganj,
    Rajrooppur, Dhoomanganj, Preetam Nagar and Phaphamau
  </span>.
</p>

          {/* People Also Ask / FAQ Snippets for AI Overview */}
          <div className="mt-6 grid sm:grid-cols-3 gap-4 pt-4 border-t border-indigo-100">
            <div className="p-4 bg-white rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-indigo-600 uppercase">Average Fees</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">₹300 - ₹750 / hour (Free Demo)</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-purple-600 uppercase">Boards Covered</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">CBSE, ICSE, ISC & UP Board</p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-gray-100">
              <span className="text-xs font-bold text-emerald-600 uppercase">Tutor Verification</span>
              <p className="text-sm font-semibold text-gray-800 mt-1">100% ID & Academic Verified</p>
            </div>
          </div>
        </div>
      </section>

      
      {/* ── AREA-WISE HOME TUITION IN ALLAHABAD ── */}
      <section className="max-w-7xl mx-auto px-6 mt-24">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-10 rounded-full bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500 shadow-md" />
          <div>
           <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
  Home Tuition in Allahabad – Tutors Available in Your Area
</h2>

<p className="text-gray-500 text-sm mt-1">
  Find verified home tutors across major areas of Allahabad (Prayagraj),
  including Civil Lines, Katra, Naini, Jhusi, Teliarganj and Phaphamau.
</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(ALLAHABAD_LOCATION_SNIPPETS).map(([area, desc]) => (
            <div
              key={area}
              className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-indigo-200/40 via-purple-200/30 to-pink-200/40 hover:from-indigo-400/40 hover:to-purple-400/40 transition-all duration-300"
            >
              <div className="h-full bg-white/80 backdrop-blur-xl rounded-2xl p-5 flex flex-col gap-3 border border-white/40 shadow-sm group-hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 capitalize">
                      {area}
                    </h3>
                  </div>
                  <span className="text-[10px] px-2 py-1 rounded-full bg-green-100 text-green-600 font-medium">
                    Available
                  </span>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>

                <div className="mt-auto pt-2">
                  <Link href={`/tutors?city=allahabad&area=${area}`}>
                    <span className="text-xs font-medium text-indigo-600 group-hover:underline cursor-pointer">
                      Find Tutors →
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AREA GRID ── */}
      <section className="mt-20 bg-gradient-to-b from-slate-50 to-indigo-50/40">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-8 rounded-full bg-gradient-to-b from-purple-500 to-pink-500" />
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
  Find Home Tutors Near You in Prayagraj
</h2>

<p className="text-gray-500 text-sm mt-1">
  Looking for home tuition near you? Explore verified home tutors available
  across major areas of Prayagraj (Allahabad) for Classes 1–12, CBSE, ICSE,
  ISC and UP Board.
</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {sortedAreas.map((area, index) => {
              const count = areaTutorCount[area] ?? getFallbackNumeric(index);
              return (
                <AreaCard
                  key={area}
                  area={area}
                  index={index}
                  count={count}
                  onRedirect={handleRedirect}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
         <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
  How to Find Home Tuition in Prayagraj
</h2>

<p className="text-gray-500 mt-2 text-sm">
  Find a verified home tutor in Prayagraj (Allahabad) in 3 simple steps.
</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              emoji: "🔍",
              title: "Choose Your Area",
              // desc: "Select your locality in Allahabad from our verified tutor map.",
              desc: "Select your locality in Prayagraj (Allahabad) and explore home tutors available near your area.",
            },
            {
              step: "02",
              emoji: "👩‍🏫",
              title: "Pick Your Tutor",
              desc: "Browse profiles, ratings, and verified credentials.",
            },
            {
              step: "03",
              emoji: "📘",
              title: "Start Learning",
              desc: "Book your first class and start improving your grades!",
            },
          ].map((s) => (
            <div
              key={s.step}
              className="relative bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <span className="absolute top-5 right-5 text-4xl font-black text-indigo-50 select-none">
                {s.step}
              </span>
              <div className="text-3xl mb-4">{s.emoji}</div>
              <h3 className="font-bold text-gray-900 text-base">{s.title}</h3>
              <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
{/* ── HOME TUITION SERVICES IN PRAYAGRAJ ── */}
<section className="max-w-6xl mx-auto px-6 pb-16">
  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 md:p-8">
    
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      Home Tuition Services in Prayagraj
    </h2>

    <p className="mt-3 text-gray-600 leading-relaxed">
      Tutvex helps parents find verified home tutors in Prayagraj
      (Allahabad) for school subjects, board preparation and competitive
      exams. Explore tutors by subject or browse available teachers in
      your area.
    </p>

    <div className="mt-6 flex flex-wrap gap-3">

      <Link
        href="/tutors"
        className="text-indigo-600 font-semibold hover:underline"
      >
        Find Home Tutors in Prayagraj
      </Link>

      <span className="text-gray-300">•</span>

      <Link
        href="/subjects"
        className="text-indigo-600 font-semibold hover:underline"
      >
        Browse Tuition by Subject
      </Link>

    </div>
  </div>
</section>
{/* ── PRAYAGRAJ HOME TUITION FAQ ── */}
<section className="max-w-6xl mx-auto px-6 pb-20">
  <div className="mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      Home Tuition in Prayagraj – Frequently Asked Questions
    </h2>

    <p className="mt-2 text-gray-600">
      Common questions from parents and students looking for home tutors
      in Prayagraj (Allahabad).
    </p>
  </div>

  <div className="space-y-4">

    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900">
        How can I find a home tutor in Prayagraj?
      </h3>
      <p className="mt-2 text-gray-600 leading-relaxed">
        You can use Tutvex to find verified home tutors in Prayagraj
        based on your class, subject, board and locality.
      </p>
    </div>

    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900">
        Is home tuition available near me in Prayagraj?
      </h3>
      <p className="mt-2 text-gray-600 leading-relaxed">
        Home tutors are available across multiple areas of Prayagraj,
        including Civil Lines, Katra, Teliarganj, Salori, Allapur,
        Naini, Jhusi and Phaphamau, subject to tutor availability.
      </p>
    </div>

    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900">
        Do you provide CBSE and ICSE home tutors in Allahabad?
      </h3>
      <p className="mt-2 text-gray-600 leading-relaxed">
        Yes. Tutvex connects students with tutors for CBSE, ICSE, ISC
        and UP Board across different classes and subjects.
      </p>
    </div>

    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900">
        What are the home tuition fees in Prayagraj?
      </h3>
      <p className="mt-2 text-gray-600 leading-relaxed">
        Home tuition fees depend on the student's class, subjects,
        board, tutor experience, number of classes and location.
        Contact Tutvex to get options based on your requirements.
      </p>
    </div>

    <div className="border border-gray-200 rounded-xl p-5">
      <h3 className="font-bold text-gray-900">
        How do I choose the best home tutor in Prayagraj?
      </h3>
      <p className="mt-2 text-gray-600 leading-relaxed">
        Compare tutors based on subject expertise, teaching experience,
        verification, availability and compatibility with the student's
        learning requirements.
      </p>
    </div>

  </div>
</section>

{/* ── HOME TUITION BY BOARD & CLASS ── */}
<section className="max-w-6xl mx-auto px-6 pb-16">
  <div className="text-center mb-10">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
      Home Tutors for CBSE, ICSE, ISC & UP Board in Prayagraj
    </h2>

    <p className="mt-3 text-gray-600 max-w-3xl mx-auto leading-relaxed">
      Find experienced tutors for Classes 1–12 across major school boards
      in Prayagraj (Allahabad). Get personalized 1-to-1 support for regular
      studies, homework, exams and concept improvement.
    </p>
  </div>

  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
    {[
      {
        title: "CBSE Home Tuition",
        desc: "Home tutors for CBSE students from Classes 1–12.",
      },
      {
        title: "ICSE & ISC Home Tuition",
        desc: "Subject tutors for ICSE and ISC students in Prayagraj.",
      },
      {
        title: "UP Board Home Tuition",
        desc: "Personalized tuition for UP Board students across major subjects.",
      },
      {
        title: "JEE & NEET Preparation",
        desc: "Tutors for Physics, Chemistry, Maths and Biology preparation.",
      },
    ].map((item) => (
      <div
        key={item.title}
        className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm"
      >
        <h3 className="font-bold text-gray-900">
          {item.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 leading-relaxed">
          {item.desc}
        </p>
      </div>
    ))}
  </div>
</section>
        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() =>
              handleRedirect("/tutors/?source=ALLAHABAD_HOW&campaign=HOW_IT_WORKS")
            }
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-10 py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:scale-105 transition-all duration-200 text-base"
          >
            <GraduationCap className="w-5 h-5" />
            Find My Tutor Now
          </button>
        </div>
      </section>

      {/* ── ENHANCED INTERNAL LINKING HUB ── */}
      <section className="max-w-7xl mx-auto px-6 my-16 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 shadow-xs">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Explore Tutvex Educational Portal
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <Link
            href="/find-tutor-flow/create-account/?source=LANDING_INTERNAL"
            className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition flex flex-col items-center gap-2"
          >
            <Search className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-950">Find Tutor</span>
          </Link>

          <Link
            href="/tutor-flow/tutor-registration/?role=tutor&source=LANDING_INTERNAL"
            className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 transition flex flex-col items-center gap-2"
          >
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-950">Tutor Registration</span>
          </Link>

          <Link
            href="/subjects"
            className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition flex flex-col items-center gap-2"
          >
            <BookOpen className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-purple-950">Popular Subjects</span>
          </Link>

          <Link
            href="/about"
            className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition flex flex-col items-center gap-2"
          >
            <Building2 className="w-5 h-5 text-slate-700" />
            <span className="text-xs font-bold text-slate-900">About Tutvex</span>
          </Link>
        </div>
      </section>

      {/* ── FLOATING CTAs ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
        <motion.a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_DEFAULT_MSG}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 180 }}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 transition font-bold text-sm"
        >
          💬 WhatsApp
        </motion.a>

        <motion.a
          href={`tel:${PHONE_NUMBER}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.65, type: "spring", stiffness: 180 }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-6 py-3 rounded-full shadow-2xl hover:scale-105 transition font-bold text-sm"
        >
          <PhoneCall size={15} />
          Call Now
        </motion.a>
      </div>

      {/* ── LOADER MODAL ── */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-950/60 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-gray-700 font-medium text-sm">
              Finding best tutors for you…
            </p>
          </div>
        </div>
      )}

      <AllahabadFAQSchema area="Allahabad" intent="" />
      {/* ── GOOGLE BUSINESS PROFILE SECTION ── */}
      <section className="max-w-7xl mx-auto px-2 my-2">
        <div className="rounded-3xl bg-slate-950 text-white p-6 sm:p-10 shadow-2xl border border-slate-800 relative overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Verified Google Business Profile
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Tutvex Official Prayagraj HQ & Local Tutors
                </h2>
                <p className="mt-2 text-sm text-slate-300">
                  Headquartered in Civil Lines, Allahabad (Prayagraj). Serving students near Prayagraj Junction, Bus Stand, Sangam, and surrounding residential colonies.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-1.5">
                  <span className="text-2xl font-black text-amber-400">4.9</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-800 hidden sm:block" />
                <div className="text-xs sm:text-sm text-slate-300">
                  <strong className="text-white font-semibold">542+ Google Reviews</strong>
                  <div className="text-slate-400 text-xs">#1 Tutvex – Home Tuition Provider, Prayagraj</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <a
                  href={GOOGLE_BUSINESS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-3 rounded-xl text-xs font-bold transition text-center shadow-lg"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  View on Google Maps
                </a>

                <a
                  href={GOOGLE_CID_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 py-3 px-3 rounded-xl text-xs font-bold transition text-center"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  Get Directions
                </a>

                <a
                  href={`tel:${PHONE_NUMBER}`}
                  className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-3 rounded-xl text-xs font-bold transition text-center shadow-lg"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  Call Office
                </a>

                <a
                  href={GOOGLE_BUSINESS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 py-3 px-3 rounded-xl text-xs font-bold transition text-center shadow-lg"
                >
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  Read Reviews
                </a>
              </div>
            </div>

            {/* Lazy-Loaded Google Map Iframe */}
            <div className="lg:col-span-5 h-72 rounded-2xl overflow-hidden border border-slate-800 shadow-lg bg-slate-900">
              <iframe
                title="Tutvex Google Business Profile Map Allahabad"
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
