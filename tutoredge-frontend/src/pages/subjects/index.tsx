import Head from "next/head";
import dynamic from "next/dynamic";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import FilterSidebar from "@/components/filters/FilterSidebar";
import MobileFilterDrawer from "@/components/filters/MobileFilterDrawer";
import SubjectsGrid from "@/components/subjects/SubjectsGrid";
import { GraduationCap, ShieldCheck, Sparkles, ArrowRight, BookOpen, Users, Star } from "lucide-react";

/* ======================
   LAZY LOAD SEO CONTENT
====================== */
const SubjectsContent = dynamic(
  () => import("@/components/seo/SubjectsContent"),
  {
    ssr: false,
    loading: () => (
      <div className="mt-16 text-center text-gray-400 animate-pulse">
        Loading detailed information...
      </div>
    ),
  }
);

/* ======================
   STATS DATA
====================== */
const STATS = [
  { icon: Users, value: "12,000+", label: "Active Students" },
  { icon: GraduationCap, value: "800+", label: "Verified Tutors" },
  { icon: BookOpen, value: "40+", label: "Subjects Covered" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
];

/* ======================
   BOARD TAGS
====================== */
const BOARDS = ["CBSE", "ICSE", "Maharashtra Board", "UP Board", "Karnataka Board", "Tamil Nadu Board"];

export default function SubjectsPage() {
  return (
    <>
      <NavBar />

      {/* ======================
          SEO HEAD
      ====================== */}
      <Head>
        <title>School Subject Tutors | CBSE, ICSE & State Board | Tutvex</title>
        <meta
          name="description"
          content="Find expert Maths, Science, Commerce & Language tutors for CBSE, ICSE and State Board students. English medium, verified tutors available on Tutvex."
        />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#4f46e5" />
        <link rel="canonical" href="https://www.tutvex.com/subjects" />

        {/* Open Graph */}
        <meta property="og:title" content="School Subject Tutors | Tutvex" />
        <meta property="og:description" content="Verified subject-wise tutors for CBSE, ICSE & State Board students." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tutvex.com/subjects" />
        <meta property="og:site_name" content="Tutvex" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="School Subject Tutors | Tutvex" />
        <meta name="twitter:description" content="Verified subject-wise tutors for CBSE, ICSE & State Board students." />

        {/* Breadcrumb Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://www.tutvex.com" },
                { "@type": "ListItem", position: 2, name: "Subjects", item: "https://www.tutvex.com/subjects" },
              ],
            }),
          }}
        />

        {/* FAQ Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Are Tutvex tutors verified?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, all tutors on Tutvex undergo thorough background verification before being listed on the platform.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Which boards do Tutvex tutors cover?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Tutvex tutors cover CBSE, ICSE, and various State Boards including Maharashtra, UP, Karnataka, and Tamil Nadu boards.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              name: "Tutvex",
              url: "https://www.tutvex.com",
              description: "India's leading platform for finding verified school subject tutors for CBSE, ICSE, and State Board students.",
            }),
          }}
        />
      </Head>

      {/* ======================
          PAGE WRAPPER
      ====================== */}
      <div className="relative min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(160deg, #f8f7ff 0%, #eef2ff 30%, #f0fdf4 60%, #fafafa 100%)" }}>

        {/* Decorative blobs */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "480px", height: "480px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", top: "40%", left: "-100px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)" }} />
          <div style={{ position: "absolute", bottom: "10%", right: "5%", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">

          {/* ======================
              BREADCRUMB
          ====================== */}
          <nav aria-label="breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-gray-500">
            <a href="/" className="hover:text-indigo-600 transition-colors font-medium">Home</a>
            <span className="text-gray-300">/</span>
            <span className="text-indigo-700 font-semibold">Subjects</span>
          </nav>

          {/* ======================
              HERO HEADER
          ====================== */}
          <header
            className="relative mb-10 rounded-3xl overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e40af 75%, #0f766e 100%)",
              boxShadow: "0 32px 64px -12px rgba(79,70,229,0.35)",
            }}
          >
            {/* Grid texture overlay */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute", inset: 0,
                backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />

            {/* Glow orbs */}
            <div aria-hidden="true" style={{ position: "absolute", top: "-60px", right: "10%", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(99,102,241,0.25)", filter: "blur(60px)" }} />
            <div aria-hidden="true" style={{ position: "absolute", bottom: "-40px", left: "15%", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(16,185,129,0.20)", filter: "blur(50px)" }} />

            <div className="relative z-10 px-6 sm:px-10 py-12 sm:py-16 lg:py-20">

              {/* Badge */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
                <ShieldCheck size={15} className="text-emerald-400" />
                <span>India's Most Trusted Tutors Platform</span>
                <Sparkles size={13} className="text-yellow-300" />
              </div>

              {/* H1 */}
              <h1
                className="text-3xl sm:text-4xl lg:text-6xl font-black text-white leading-tight tracking-tight"
                style={{ fontFamily: "'Sora', 'DM Sans', sans-serif", letterSpacing: "-0.02em" }}
              >
                Find the Perfect
                <br />
                <span style={{ background: "linear-gradient(90deg, #a5f3fc, #818cf8, #6ee7b7)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                  Subject Tutor
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 max-w-2xl text-white/75 text-base sm:text-lg leading-relaxed" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Expert tutors for{" "}
                <span className="font-bold text-white">CBSE, ICSE & State Board</span>{" "}
                students — all teaching in <span className="font-bold text-white">English medium</span>, background verified &amp; results-driven.
              </p>

              {/* CTA Row */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#subjects-grid"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-bold text-indigo-700 shadow-lg hover:shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Browse All Subjects <ArrowRight size={16} />
                </a>
                <a
                  href="/tutors"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/20 transition-all duration-200"
                >
                  View All Tutors
                </a>
              </div>

              {/* Board Tags */}
              <div className="mt-8 flex flex-wrap gap-2" aria-label="Supported boards">
                {BOARDS.map((board) => (
                  <span
                    key={board}
                    className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm"
                  >
                    {board}
                  </span>
                ))}
              </div>
            </div>
          </header>

          {/* ======================
              STATS STRIP
          ====================== */}
          <section aria-label="Platform statistics" className="mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center justify-center rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 px-4 py-5 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
                  style={{ boxShadow: "0 1px 3px rgba(79,70,229,0.06), 0 8px 24px rgba(79,70,229,0.04)" }}
                >
                  <div className="mb-2 flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50">
                    <Icon size={20} className="text-indigo-600" />
                  </div>
                  <span
                    className="text-2xl font-black text-gray-900"
                    style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.03em" }}
                  >
                    {value}
                  </span>
                  <span className="mt-0.5 text-xs text-gray-500 font-medium">{label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ======================
              MOBILE FILTER
          ====================== */}
          <div className="lg:hidden mb-4">
            <MobileFilterDrawer />
          </div>

          {/* ======================
              MAIN LAYOUT
          ====================== */}
          <div id="subjects-grid" className="flex gap-8 items-start">

            {/* Sidebar — hidden on mobile */}
            <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24">
              <div
                className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 overflow-hidden"
                style={{ boxShadow: "0 4px 24px rgba(79,70,229,0.07)" }}
              >
                {/* Sidebar header accent */}
                <div className="h-1 w-full" style={{ background: "linear-gradient(90deg, #6366f1, #10b981)" }} />
                <div className="p-5">
                  <h2 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 inline-block" />
                    Filter Tutors
                  </h2>
                  <FilterSidebar />
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">

              {/* Section label */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2
                    className="text-xl sm:text-2xl font-extrabold text-gray-900"
                    style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
                  >
                    All Subjects
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">Explore tutors by subject &amp; board</p>
                </div>

                {/* Trust badges */}
                <div className="hidden sm:flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <ShieldCheck size={12} /> Verified
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-semibold text-indigo-700">
                    <GraduationCap size={12} /> Board Expert
                  </span>
                </div>
              </div>

              {/* Subjects Grid Component */}
              <SubjectsGrid />

              {/* Value Props — below grid */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  {
                    icon: ShieldCheck,
                    title: "Background Verified",
                    desc: "Every tutor goes through a strict ID & credential verification process before being listed.",
                    color: "emerald",
                  },
                  {
                    icon: GraduationCap,
                    title: "Board-Specialist Tutors",
                    desc: "Tutors specialize in CBSE, ICSE, and specific State Boards — no generalists.",
                    color: "indigo",
                  },
                  {
                    icon: Star,
                    title: "Rated & Reviewed",
                    desc: "Real ratings from real parents and students. Transparent, honest reviews only.",
                    color: "amber",
                  },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div
                    key={title}
                    className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
                    style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                  >
                    <div
                      className={`mb-4 inline-flex items-center justify-center w-11 h-11 rounded-xl`}
                      style={{
                        background: color === "emerald" ? "#ecfdf5" : color === "indigo" ? "#eef2ff" : "#fffbeb",
                      }}
                    >
                      <Icon
                        size={20}
                        style={{
                          color: color === "emerald" ? "#059669" : color === "indigo" ? "#4f46e5" : "#d97706",
                        }}
                      />
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                  </div>
                ))}
              </div>
            </main>
          </div>

          {/* ======================
              SEO CONTENT (LAZY)
          ====================== */}
          <section aria-label="Detailed subject information" className="mt-16">
            <SubjectsContent />
          </section>

          {/* ======================
              BOTTOM CTA BANNER
          ====================== */}
          <section
            aria-label="Call to action"
            className="mt-16 mb-4 rounded-3xl overflow-hidden relative text-center px-6 py-14"
            style={{
              background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #065f46 100%)",
              boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
            }}
          >
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(99,102,241,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,185,129,0.15) 0%, transparent 50%)" }} />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1 text-xs font-semibold text-white/80 mb-5">
                <Sparkles size={12} className="text-yellow-300" /> Join 12,000+ Students
              </span>
              <h2
                className="text-2xl sm:text-4xl font-black text-white leading-tight"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: "-0.02em" }}
              >
                Ready to find your perfect tutor?
              </h2>
              <p className="mt-3 text-white/60 text-sm sm:text-base max-w-xl mx-auto">
                Book a free demo class today. No commitments, no hidden fees.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="/tutors"
                  className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-bold text-indigo-700 shadow-xl hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                >
                  Find a Tutor Now <ArrowRight size={16} />
                </a>
                <a
                  href="/how-it-works"
                  className="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all duration-200"
                >
                  How It Works
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>

      <Footer />

      {/* ======================
          GLOBAL FONT IMPORT
          (Add to _document.js or globals.css for production)
      ====================== */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

        html {
          scroll-behavior: smooth;
        }

        /* Scrollbar polish */
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #c7d2fe;
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #818cf8;
        }

        /* Focus ring polish */
        *:focus-visible {
          outline: 2px solid #6366f1;
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Smooth hover for all interactive elements */
        a, button {
          transition: all 0.18s ease;
        }
      `}</style>
    </>
  );
}