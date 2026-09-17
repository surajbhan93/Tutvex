import React from "react";
import Head from "next/head";
import { city } from "@/components/seoIndia/locations/up/agra";

// Import modular subcomponents from the same folder
import Schema from "./Schema";
import Hero from "./Hero";
import WhyTutvex from "./WhyTutvex";
import Subjects from "./Subjects";
import Fees from "./Fees";
import ServiceAreas from "./ServiceAreas";
import GoogleBusiness from "./GoogleBusiness";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import InternalLinks from "./InternalLinks";
import CTA from "./CTA";

export default function AgraHomeTutorPage() {
  const pageTitle = `Home Tutor in ${city.name} | Best Verified Home Tuition | Tutvex`;
  const metaDescription = `Looking for the best Home Tutor in ${city.name}? Tutvex provides 100% background-verified 1-on-1 private home tutors for CBSE, ICSE, UP Board, Class 1-12, Math, Science, JEE & NEET across ${city.name} (Kamla Nagar, Dayalbagh, Sadar Bazaar & more). Book a free demo today!`;
  const canonicalUrl = `https://tutvex.com/india/${city.slug}`;
  const ogImageUrl = `https://tutvex.com/images/og-home-tutor-agra.jpg`;

  const metaKeywords = [
    "Home Tutor in Agra",
    "Best Home Tuition in Agra",
    "Home Tuition Agra",
    "Home Tuition in Agra",
    "Home Tutor Agra",
    "Verified Home Tutor in Agra",
    "Private Tutor in Agra",
    "Female Home Tutor in Agra",
    "Math Tutor Agra",
    "Science Tutor Agra",
    "CBSE Home Tutor Agra",
    "Class 10 Tuition Agra",
    "JEE Tutor Agra",
    "NEET Tutor Agra",
    "Tutor Near Me",
    "Home Tutor Kamla Nagar Agra",
    "Home Tuition Dayalbagh Agra",
    "Private Tuition Sadar Bazaar Agra",
  ].join(", ");

  return (
    <>
      <Head>
        {/* Basic SEO Tags */}
        <title>{pageTitle}</title>
        <meta name="description" content={metaDescription} />
        <meta name="keywords" content={metaKeywords} />
        <meta name="author" content="Tutvex Learning Systems India Pvt. Ltd." />
        <meta name="language" content="en-IN" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="theme-color" content="#0f172a" />

        {/* Geo-Targeting SEO Tags */}
        <meta name="geo.region" content={city.geo.region} />
        <meta name="geo.placename" content={city.geo.placename} />
        <meta name="geo.position" content={`${city.geo.latitude};${city.geo.longitude}`} />
        <meta name="ICBM" content={`${city.geo.latitude}, ${city.geo.longitude}`} />

        {/* OpenGraph / Facebook Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tutvex Home Tutors" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:alt" content={`Best Home Tutor Service in ${city.name} - Tutvex`} />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tutvex" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={metaDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content={`Home Tutor in ${city.name}`} />

        {/* Mobile Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* JSON-LD Rich Results Schemas */}
      <Schema />

      <main className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        {/* Navigation Bar Header */}
        <nav className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <span className="text-2xl font-black tracking-tight text-white">
                TUT<span className="text-cyan-400">VEX</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                {city.name} Center
              </span>
            </a>

            <div className="flex items-center gap-4">
              <a
                href="#service-areas"
                className="hidden md:inline-block text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors"
              >
                Localities in {city.name}
              </a>
              <a
                href={`tel:${city.contact.phone}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.27c1.12.45 2.33.69 3.58.69.55 0 1 .45 1 1V20a1 1 0 01-1 1C10.5 21 3 13.5 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.24 2.46.69 3.57.11.35.03.74-.27 1.02l-2.3 2.2z" />
                </svg>
                <span>{city.contact.phone}</span>
              </a>
            </div>
          </div>
        </nav>

        {/* 1. Hero Section */}
        <Hero />

        {/* 2. EEAT & Why Tutvex Section */}
        <WhyTutvex />

        {/* 3. Subject Matrix & Boards */}
        <Subjects />

        {/* 4. Deep Informational GEO Content Article Section (Entity-Rich, High Semantic Relevance for Agra) */}
        <section className="py-16 sm:py-24 bg-slate-900 text-slate-200 border-b border-slate-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                Comprehensive Educational Guide for {city.name} Parents
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Navigating School Education & Home Tuition in {city.name}: A Complete Parent Handbook
              </h2>
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                As one of Uttar Pradesh’s most iconic educational destinations, {city.name} boasts historic institutions like St. John's College, Dr. Bhimrao Ambedkar University, Dayalbagh Educational Institute (DEI), and top schools affiliated with CBSE, ICSE, and the UP State Board. However, as competitive exam standards rise for CBSE Class 10/12 boards, JEE Main, and NEET, classroom instruction alone often leaves students with gaps in conceptual understanding. Personal 1-on-1 home tuition provides tailored mentorship directly at your residence.
              </p>
            </div>

            {/* Subsection 1: Why 1-on-1 Tuition beats Coaching Institutes */}
            <div className="space-y-4 bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white">
                Why 1-on-1 Home Tuition Beats Group Coaching Centers in {city.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                In crowded coaching institutes across commercial hubs like <em>Sadar Bazaar, Sanjay Place, or Raja Ki Mandi</em>, a single teacher often lectures 80 to 100 students simultaneously. Hiring a verified private home tutor in {city.name} guarantees 100% focused attention on your child. Tutors adapt to the student's unique learning velocity—spending extra sessions on complex topics like Class 10 Trigonometry or Class 12 Electrostatics—while progressing quickly through familiar concepts.
              </p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Zero commuting stress or wasted travel time across Agra traffic
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Customized study schedule aligned with school unit tests & term exams
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Safe learning environment under direct parental supervision
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">✓</span> Regular weekly test reports and direct parent feedback
                </li>
              </ul>
            </div>

            {/* Subsection 2: Locality Coverage & Localized Learning */}
            <div className="space-y-4 bg-slate-950 border border-slate-800 p-6 sm:p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-white">
                Serving All {city.locations.length}+ Residential Localities Across {city.name}
              </h3>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Tutvex operates a dense network of background-verified teachers across every sector of {city.name}. Whether you live in <strong>Kamla Nagar, Dayalbagh, Sadar Bazaar, Civil Lines, Shahganj, Bodla, Khandari, Sikandra, Taj Ganj, or Trans Yamuna Colony</strong>, our local assignment system connects you with qualified educators residing nearby. This ensures punctual sessions, minimal cancellations, and flexible timings even during board examination season.
              </p>
            </div>
          </div>
        </section>

        {/* 5. Tuition Fees Structure Section */}
        <Fees />

        {/* 6. Dynamic Service Areas (Locality Cards looping over city.locations) */}
        <ServiceAreas />

        {/* 7. Google Business Profile Card */}
        <GoogleBusiness />

        {/* 8. Parent Reviews & Ratings */}
        <Reviews />

        {/* 9. AEO-Optimized FAQ Section */}
        <FAQ />

        {/* 10. Internal Links Grid */}
        <InternalLinks />

        {/* 11. Final CTA Banner */}
        <CTA />

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xl font-black text-white">
                  TUT<span className="text-cyan-400">VEX</span>
                </span>
                <p className="text-slate-400 mt-1">
                  India's premier verified home tutor network for {city.name}, {city.state}.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a href="/" className="hover:text-cyan-400">Home</a>
                <a href="/india" className="hover:text-cyan-400">India Locations</a>
                <a href={`/india/${city.slug}`} className="text-cyan-400 font-semibold">Home Tutor in {city.name}</a>
                <a href="#book-tutor-form" className="hover:text-cyan-400">Book Demo</a>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
              <p>© {new Date().getFullYear()} Tutvex Learning Systems India Pvt. Ltd. All rights reserved.</p>
              <p>Designed for Google Top 3, AI Overview, Perplexity & Gemini Search.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
