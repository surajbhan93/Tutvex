import { Users, GraduationCap, ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section
      aria-label="Tutvex Platform Introduction"
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl px-2 sm:px-8 py-16 sm:py-16"
      style={{
        background: "linear-gradient(135deg, #0f2e27 0%, #1a4a3a 45%, #0d3d30 100%)",
      }}
    >
      {/* ── Grid texture overlay ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.035]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" />
      </svg>

      {/* ── Radial glows ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 65%)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-32 h-[420px] w-[420px] rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(20,120,100,0.18) 0%, transparent 65%)" }}
      />

      {/* ── Decorative SVG doodles ── */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-[6%] opacity-25"
        width="44" height="44" viewBox="0 0 44 44" fill="none"
        style={{ animation: "heroSpin 22s linear infinite" }}
      >
        <path d="M22 3l3.5 13H39l-11 8 4 13-10-7.5L12 37l4-13-11-8h13.5z"
          stroke="#c9a84c" strokeWidth="1.2" fill="none" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-[5%] opacity-20"
        width="64" height="22" viewBox="0 0 64 22" fill="none"
      >
        <path d="M2 17 L13 5 L24 17 L35 5 L46 17 L57 5"
          stroke="#c9a84c" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      </svg>
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 right-[8%] opacity-15"
        width="52" height="52" viewBox="0 0 52 52" fill="none"
        style={{ animation: "heroFloat 6s ease-in-out infinite" }}
      >
        <circle cx="26" cy="26" r="22" stroke="#a0ddd0" strokeWidth="1" strokeDasharray="5 4" />
      </svg>

      {/* ── Content ── */}
      <div className="relative z-10 mx-auto max-w-7xl text-center">

        {/* Badge */}
        <div className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold tracking-widest uppercase"
          style={{
            background: "rgba(201,168,76,0.12)",
            border: "1px solid rgba(201,168,76,0.3)",
            color: "#c9a84c",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Trusted Learning Platform
        </div>

        {/* H1 — SEO: one clear h1 per page */}
        <h1
          className="mb-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl md:text-5xl lg:text-6xl"
          style={{
            fontFamily: "'Instrument Serif', 'Georgia', serif",
            color: "#f0ebe3",
          }}
        >
          How{" "}
          <span
            className="italic"
            style={{ color: "#c9a84c" }}
          >
            Tutvex
          </span>{" "}
          Works
        </h1>

        {/* Subtitle */}
        <p
          className="mx-auto mb-9 max-w-xl text-sm leading-relaxed sm:text-base md:text-lg"
          style={{ color: "#8aada5" }}
        >
          Tutvex connects parents, students, and verified tutors on one secure
          platform. Find the right tutor, track learning, and achieve better
          academic results — step by step.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <a
            href="/how-it-works?type=parent"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 sm:w-auto"
            style={{
              background: "linear-gradient(135deg, #c9a84c, #a07828)",
              color: "#fff",
              boxShadow: "0 6px 20px rgba(201,168,76,0.3), 0 2px 0 #7a5a10",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 28px rgba(201,168,76,0.38), 0 2px 0 #7a5a10";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(201,168,76,0.3), 0 2px 0 #7a5a10";
            }}
          >
            <Users size={17} />
            For Parents
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href="/how-it-works?type=tutor"
            className="group inline-flex w-full items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold tracking-wide transition-all duration-300 sm:w-auto"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1.5px solid rgba(255,255,255,0.18)",
              color: "#c8dbd8",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.3)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#f0ebe3";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.18)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#c8dbd8";
            }}
          >
            <GraduationCap size={17} />
            For Tutors
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </div>

        {/* Divider */}
        <div
          className="mx-auto my-8 h-px w-24 rounded-full opacity-20"
          style={{ background: "#c9a84c" }}
        />

        {/* Trust indicators — semantic list for SEO */}
        <ul
          aria-label="Platform trust indicators"
          className="flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-xs sm:text-sm"
          style={{ color: "#8aada5", listStyle: "none", padding: 0, margin: 0 }}
        >
          {[
            "Verified Tutors",
            "Parent Dashboard",
            "Secure Payments",
            "Replacement Support",
          ].map((item) => (
            <li
              key={item}
              className="flex items-center gap-1.5 font-medium"
            >
              <span
                className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full text-[0.55rem] font-black"
                style={{ background: "rgba(20,120,100,0.25)", color: "#4dd9bf" }}
              >
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes heroSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes heroFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
      `}</style>
    </section>
  );
}