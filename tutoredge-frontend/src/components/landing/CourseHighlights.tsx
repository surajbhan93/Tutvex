"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import type { Variants } from "framer-motion";
import { Lora, DM_Sans } from "next/font/google";

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});
/*
 * ═══════════════════════════════════════════════════════
 *  TUTVEX — COURSE HIGHLIGHTS
 *  Aesthetic: Elite School / Chalkboard Premium
 *  Palette:
 *    Chalkboard Green  → #1e3d2f  (dark section bg)
 *    Chalk White       → #f5f0e8  (cream base)
 *    Ink Navy          → #1a2744  (text)
 *    Amber Gold        → #c8922a  (accent)
 *    Ruled Blue        → #d6e4f7  (notebook line tint)
 *  Fonts: Lora (display) + DM Sans (body)
 * ═══════════════════════════════════════════════════════
 */

/* ─── DATA ─── */
const mathsCourses = [
  { title: "Abacus",       imageUrl: "/images/abacusImage.png"    },
  { title: "Vedic Maths",  imageUrl: "/images/VedicMathsImage.png" },
];

const tutoringCards = [
  {
    title: "CBSE",
    description: "Personalised tutoring aligned with CBSE curriculum.",
    imageUrl: "/images/cbseImage.png",
    subject: "Board Exam",
    cta: "Get CBSE Tutor Now",
    icon: "📘",
    accent: "#3b6fd4",
    stamp: "bg-blue-100 text-blue-700 border-blue-200",
  },
  {
    title: "ICSE",
    description: "Concept-focused ICSE learning support.",
    imageUrl: "/images/icseImage.png",
    subject: "Board Exam",
    cta: "Find ICSE Expert",
    icon: "📗",
    accent: "#7c3aed",
    stamp: "bg-violet-100 text-violet-700 border-violet-200",
  },
  {
    title: "JEE",
    description: "Focused preparation for competitive exams.",
    imageUrl: "/images/jeeImage.png",
    subject: "Competitive",
    cta: "Start JEE Prep Today",
    icon: "🔬",
    accent: "#d97706",
    stamp: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    title: "Coding",
    description: "Personalised coding lessons for all levels.",
    imageUrl: "/images/codingImage.png",
    subject: "Tech Skills",
    cta: "Learn Coding 1-to-1",
    icon: "💻",
    accent: "#047857",
    stamp: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
];

/* ─── ANIMATION VARIANTS ─── */

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const, // ⭐ FIX
    },
  },
};

const stagger: Variants = {
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};
/* ─── RULED LINE BACKGROUND (notebook texture) ─── */
const ruledBg = {
  backgroundImage: `
    repeating-linear-gradient(
      to bottom,
      transparent,
      transparent 27px,
      #d6e4f7 27px,
      #d6e4f7 28px
    )
  `,
  backgroundSize: "100% 28px",
};

/* ──────────────────────────────────────────────────
   COMPONENT
────────────────────────────────────────────────── */
const CourseHighlights = () => {
  return (
    <>
      {/* Google Fonts */}
      <style>{`
   
        // .font-lora   { font-family: 'Lora', Georgia, serif; }
        // .font-dmsans { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Chalk underline for headings */
        .chalk-underline {
          position: relative;
          display: inline-block;
        }
        .chalk-underline::after {
          content: '';
          position: absolute;
          left: 0; bottom: -3px;
          width: 100%; height: 3px;
          background: #c8922a;
          border-radius: 2px;
          opacity: 0.85;
        }

        /* Stamp badge */
        .stamp-badge {
          font-family: 'DM Sans', system-ui, sans-serif;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          font-size: 10px;
          font-weight: 600;
          border-radius: 4px;
          padding: 3px 9px;
          border-width: 1px;
          border-style: solid;
        }

        /* Card ruled texture */
        .card-ruled {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent, transparent 23px,
            rgba(214,228,247,0.5) 23px, rgba(214,228,247,0.5) 24px
          );
        }

        /* Chalkboard texture */
        .chalk-board {
          background-color: #1e3d2f;
          background-image:
            url("data:image/svg+xml,%3Csvg viewBox='0 0 300 300' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.06'/%3E%3C/svg%3E");
        }

        /* Notebook binding left strip */
        .notebook-binding::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 36px;
          background: #e8d5b7;
          border-right: 2px solid #d4ba95;
          z-index: 1;
        }
        /* Red margin line */
        .notebook-binding::after {
          content: '';
          position: absolute;
          left: 44px; top: 0; bottom: 0;
          width: 1.5px;
          background: rgba(220,50,50,0.25);
          z-index: 1;
        }

        /* Tutoring card hover shine */
        .card-shine::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
          border-radius: inherit;
          pointer-events: none;
        }
        .card-shine:hover::before { opacity: 1; }

        /* Apple decoration pulse */
        @keyframes apple-bob { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-5px) rotate(2deg)} }
        .apple-bob { animation: apple-bob 3.5s ease-in-out infinite; }

        /* Chalk dust float */
        @keyframes dust-float { 0%,100%{opacity:.5;transform:translateY(0) scaleX(1)} 50%{opacity:.9;transform:translateY(-3px) scaleX(1.03)} }
        .dust-float { animation: dust-float 4s ease-in-out infinite; }
      `}</style>

      <section className= {`${dmSans.className} "font-dmsans relative overflow-hidden bg-[#f5f0e8] py-16 sm:py-24`} >

        {/* ── Subtle paper noise overlay ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* ── Decorative ruled lines top strip ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-2"
          style={{ background: "linear-gradient(90deg, #1e3d2f, #2d5c42, #1e3d2f)" }}
        />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">

          {/* ════════════════════════════════
              SECTION HEADING
          ════════════════════════════════ */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={fadeUp}
            className="mb-12 sm:mb-16 flex flex-col items-center sm:items-start gap-3"
          >
            {/* School label */}
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1e3d2f]/20 bg-[#1e3d2f]/[.06] px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[#1e3d2f]">
              <span className="text-base">🍎</span>
              Tutvex Learning Programs
            </span>

            <h2 className={`${lora.className} text-3xl font-bold text-[#1a2744] sm:text-4xl lg:text-5xl text-center sm:text-left leading-tight`} >
              Course{" "}
              <span className="chalk-underline text-[#1e3d2f]">Highlights</span>
            </h2>

            <p className="max-w-xl text-center sm:text-left text-[15px] leading-relaxed text-[#4a5568]">
              Expert-designed programs for every learner — from foundational maths to competitive exam prep.
            </p>
          </motion.div>

          {/* ════════════════════════════════
              MATHS SECTION — Chalkboard Panel
          ════════════════════════════════ */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="chalk-board relative overflow-hidden rounded-3xl p-8 sm:p-12 shadow-[0_24px_60px_rgba(30,61,47,0.3)]"
          >
            {/* Chalk board wooden frame border */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-3xl"
              style={{
                boxShadow: "inset 0 0 0 6px rgba(139,90,43,0.45), inset 0 0 0 8px rgba(101,67,33,0.25)",
              }}
            />

            {/* Chalk tray line bottom */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 inset-x-0 h-[10px] rounded-b-3xl"
              style={{ background: "rgba(139,90,43,0.5)" }}
            />

            {/* Faint chalk grid lines */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-[.04]"
              style={{
                backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                backgroundSize: "44px 44px",
              }}
            />

            {/* Decorative apple */}
            <div aria-hidden="true" className="apple-bob absolute right-8 top-6 text-3xl opacity-60 hidden sm:block">🍎</div>

            {/* Chalk dust squiggle */}
            <div
              aria-hidden="true"
              className="dust-float absolute bottom-3 left-12 h-[3px] w-16 rounded-full opacity-30"
              style={{ background: "rgba(255,255,255,0.7)" }}
            />

            <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
              {/* Left: text */}
              <div>
                {/* Chalk-written label */}
                <span
                  className={`${lora.className} mb-4 inline-block  text-[11px] uppercase tracking-[0.15em] opacity-60`}  
                  style={{ color: "#e8e0c8" }}
                >
                  ✦ Maths Mastery Programs
                </span>

                <h3 className= {`${lora.className}  text-2xl font-bold leading-tight text-white sm:text-3xl`}  >
                  Maths Home Tuition that
                  <br />
                  <em className="not-italic" style={{ color: "#f5c842" }}>
                    Builds Strong Academic Basics
                  </em>
                </h3>

                <p className="mt-3 text-[15px] leading-relaxed" style={{ color: "rgba(245,240,232,0.7)" }}>
                  Smart techniques designed to improve speed, accuracy &amp; confidence.
                </p>

                <p className="mt-4 max-w-md text-sm leading-relaxed" style={{ color: "rgba(245,240,232,0.55)" }}>
                  Our maths home tutoring programs include Abacus and Vedic Maths, designed
                  for school students to improve calculation speed, logical thinking and
                  confidence through personalised 1-on-1 learning.
                </p>

                {/* Feature chips */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {["1-on-1 Sessions", "All Age Groups", "Free Demo Class", "Expert Tutors"].map((f) => (
                    <span
                      key={f}
                      className="rounded-full px-3 py-1 text-[11px] font-medium"
                      style={{ background: "rgba(255,255,255,0.1)", color: "rgba(245,240,232,0.8)", border: "1px solid rgba(255,255,255,0.15)" }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <Link href="/tutor-flow/tutor-registration" className="mt-8 inline-block">
                  <button
                    className="group inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-[15px] font-semibold text-[#1a2744] transition-all duration-300
                               hover:scale-[1.04] hover:shadow-[0_12px_30px_rgba(200,146,42,0.5)]"
                    style={{
                      background: "linear-gradient(110deg, #f5c842 0%, #c8922a 50%, #f5c842 100%)",
                      backgroundSize: "200% auto",
                    }}
                  >
                    Join Maths Program
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                  </button>
                </Link>
              </div>

              {/* Right: course cards */}
              <div className="flex gap-5 overflow-x-auto pb-2 sm:justify-center lg:justify-end">
                {mathsCourses.map((course, i) => (
                  <motion.div
                    key={course.title}
                    whileHover={{ y: -6, scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="min-w-[160px] sm:min-w-[180px] flex-shrink-0 rounded-2xl p-5 text-center shadow-lg"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {/* Chalk number */}
                    <div
                      className={`${lora.className} mb-3  text-[11px] font-bold opacity-40`} 
                      style={{ color: "#f5c842" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>

                    <div className="relative mx-auto mb-4 h-24 w-36">
                      <Image
                        src={course.imageUrl}
                        alt={`${course.title} home tuition program by Tutvex`}
                        fill
                        sizes="(max-width: 640px) 160px, 180px"
                        className="object-contain drop-shadow-lg"
                      />
                    </div>

                    <h3 className= {`${lora.className} font-semibold text-white`}>{course.title}</h3>
                    <p className="mt-1 text-[11px]" style={{ color: "rgba(245,240,232,0.5)" }}>
                      Home Tuition
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ════════════════════════════════
              1-ON-1 TUTORING — Notebook Panel
          ════════════════════════════════ */}
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            className="notebook-binding relative mt-10 overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_rgba(26,39,68,0.1)]"
            style={{ border: "1px solid #e8d5b7" }}
          >
            {/* Ruled lines on the notebook body */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={ruledBg}
            />

            {/* Content — offset from binding */}
            <div className="relative z-10 p-8 pl-14 sm:pl-16 lg:p-12 lg:pl-16">

              {/* Notebook header strip */}
              <div
                className="mb-8 -mx-8 -mt-8 sm:-mx-16 lg:-mx-12 lg:-mt-12 px-8 sm:px-16 lg:px-16 py-5 flex items-center justify-between flex-wrap gap-4"
                style={{
                  background: "linear-gradient(90deg, #1e3d2f 0%, #2d5c42 100%)",
                  marginLeft: "calc(-32px - 1px)",
                  paddingLeft: "52px",
                }}
              >
                <div>
                  <p className="font-dmsans text-[11px] uppercase tracking-[0.14em] text-white/50">
                    Tutvex Tutoring Programs
                  </p>
                  <h2 className={`${lora.className}  text-xl font-bold text-white sm:text-2xl lg:text-3xl mt-0.5`}  >
                    Personalised{" "}
                    <span style={{ color: "#f5c842" }}>1-to-1 Tutoring</span>
                  </h2>
                </div>

                {/* Subject count badge */}
                <div
                  className="hidden sm:flex items-center gap-2 rounded-full px-4 py-2"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <span className="text-white/60 text-[12px] font-medium">4 Subjects</span>
                  <span className={`${lora.className}  text-[#f5c842] font-bold text-sm`} >Available</span>
                </div>
              </div>

              {/* Cards grid */}
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-40px" }}
                className="grid grid-cols-1 gap-6 min-[480px]:grid-cols-2 lg:grid-cols-4"
              >
                {tutoringCards.map((card) => (
                  <motion.div
                    key={card.title}
                    variants={fadeUp}
                    whileHover={{ y: -8 }}
                    transition={{ type: "spring", stiffness: 280 }}
                    className="card-shine group relative rounded-2xl overflow-hidden bg-[#fafaf8] shadow-md"
                    style={{ border: "1px solid #e8e0d0" }}
                  >
                    {/* Colored top bar */}
                    <div
                      className="h-1.5 w-full"
                      style={{ background: card.accent }}
                    />

                    {/* Subject image */}
                    <div className="relative h-36 w-full overflow-hidden">
                      <Image
                        src={card.imageUrl}
                        alt={`${card.title} home tutor program`}
                        fill
                        sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {/* Soft gradient overlay */}
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, rgba(250,250,248,0.9) 0%, transparent 55%)" }}
                      />

                      {/* Icon */}
                      <span
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full text-base shadow-md"
                        style={{ background: "rgba(255,255,255,0.92)", border: "1px solid rgba(0,0,0,0.06)" }}
                      >
                        {card.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 pt-3">
                      {/* Stamp badge + subject label */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`stamp-badge ${card.stamp}`}>{card.title}</span>
                        <span className="text-[10px] font-medium text-[#9da8b5] uppercase tracking-wider">{card.subject}</span>
                      </div>

                      <p className="text-[13px] leading-relaxed text-[#4a5568]">
                        {card.description}
                      </p>

                      {/* Ruled separator */}
                      <div
                        className="my-3 h-px"
                        style={{ background: "rgba(214,228,247,0.7)" }}
                      />

                      <Link
                        href={{
                          pathname: "/subjects",
                          query: { subject: card.title, source: "HOME_CARD", fromPage: "/" },
                        }}
                        aria-label={`${card.cta} — Tutvex`}
                        className="block"
                      >
                        <button
                          className="group/btn w-full rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all duration-300
                                     hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] hover:-translate-y-[1px] active:scale-[.98]"
                          style={{ background: card.accent }}
                        >
                          {card.cta}
                          <span className="ml-1.5 inline-block transition-transform duration-300 group-hover/btn:translate-x-1">→</span>
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Bottom note — notebook style */}
              <div className="mt-8 flex items-start gap-3 rounded-xl p-4" style={{ background: "#fef9ec", border: "1px dashed #e8c96a" }}>
                <span className="text-xl flex-shrink-0">✏️</span>
                <p className="text-[13px] leading-relaxed text-[#6b5c3e]">
                  <strong className="font-semibold">Not sure which program to pick?</strong>{" "}
                  Book a free 30-minute consultation with our academic advisor — we'll help you choose the right tutor for your child's unique learning style.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Bottom decorative ruled band ── */}
          <div
            aria-hidden="true"
            className="mt-12 flex items-center gap-3 opacity-40"
          >
            <div className="h-px flex-1" style={{ background: "#1e3d2f" }} />
            <span className={`${lora.className} text-[#1e3d2f] text-sm  italic`}  >Est. in India, for India</span>
            <div className="h-px flex-1" style={{ background: "#1e3d2f" }} />
          </div>
        </div>

        {/* Bottom decorative bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2"
          style={{ background: "linear-gradient(90deg, #1e3d2f, #2d5c42, #1e3d2f)" }}
        />
      </section>
    </>
  );
};

export default CourseHighlights;