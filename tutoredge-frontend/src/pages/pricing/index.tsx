import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import { useState } from "react";
import WhatsappFloat from '@/components/common/WhatsappFloat';
import FloatingChatButton from "@/components/common/FloatingChatButton";
/* =========================
   DATA (Dynamic-ready)
========================= */

/* =========================
   PRICING FAQ SCHEMA
========================= */
interface Faq {
  name: string;
  acceptedAnswer: {
    text: string;
  };
}
interface FaqItemProps {
  faq: Faq;
  index: number;
}

function FaqItem({ faq, index }: FaqItemProps) {
  const [open, setOpen] = useState(index === 0);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-2xl border border-[#e6dfd4] bg-white overflow-hidden transition-all duration-300"
      style={{ boxShadow: open ? "0 8px 32px rgba(20,83,72,0.08)" : "0 2px 8px rgba(0,0,0,0.04)" }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left"
      >
        <h4 className="font-bold text-[#1a2e2b] text-[0.97rem] tracking-[-0.01em]">
          {faq.name}
        </h4>
        <span
          className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full border border-[#c9a84c] text-[#c9a84c] transition-transform duration-300"
          style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)", background: open ? "#fffbf0" : "transparent" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </span>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.28, ease: "easeInOut" }}
        className="overflow-hidden"
      >
        <p className="pb-5 px-7 text-sm text-[#5a6a67] leading-relaxed border-t border-[#f0ebe3] pt-4">
          {faq.acceptedAnswer.text}
        </p>
      </motion.div>
    </motion.div>
  );
}

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is Tutvex free to use?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. Tutvex allows parents to browse tutors, attend demo classes, and explore options completely free. You pay only after confirming a tutor."
      }
    },
    {
      "@type": "Question",
      "name": "Does Tutvex charge any registration fees?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. Tutvex does not charge any registration or platform fees for parents or students."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a tutor cost on Tutvex?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tutor fees vary based on class, subject, board, and experience. On average, fees range from ₹300 to ₹1200 per hour."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to subscribe to a monthly plan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No subscription is mandatory. Tutvex follows a pay-after-confirmation model so parents can choose freely."
      }
    },
    {
      "@type": "Question",
      "name": "Are tutors verified on Tutvex?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. All tutors on Tutvex go through phone verification, document checks, subject evaluation, and interviews before approval."
      }
    }
  ]
};

import {
  BookOpen,
  GraduationCap,
  Laptop,
  Award,
  MapPin,
  CheckCircle,
  Clock,
  
} from "lucide-react";

const platformPlans = [
  {
    id: "free",
    name: "Free Discovery",
    price: "₹0",
    duration: "No charges",
    description: "Explore tutors, attend demo classes, and decide without any upfront cost.",
    features: [
      "Browse verified tutors",
      "Free demo classes",
      "Unlimited tutor discovery",
      "Pay only after confirmation",
      "No platform registration fee",
    ],
    cta: "Find Tutors",
    highlighted: false,
  },
  {
    id: "assisted",
    name: "Assisted Learning",
    price: "Custom",
    duration: "Based on needs",
    description: "Get personalized support from Tutvex experts for the best learning outcome.",
    features: [
      "Dedicated academic counselor",
      "Tutor matching & coordination",
      "Replacement guarantee",
      "Priority parent support",
      "Progress & performance tracking",
    ],
    cta: "Talk to Expert",
    highlighted: true,
  },
];

/* =========================
   PAGE
========================= */
export default function PricingPage() {
  return (
    <>
      <NavBar />

      {/* ================= SEO ================= */}
      <Head>
        <title>Pricing & Fees | Transparent Tutor Costs | Tutvex</title>
        <meta
          name="description"
          content="Understand Tutvex pricing. No registration fees, free demo classes, and transparent tutor costs for CBSE, ICSE & State Board students."
        />
        <link rel="canonical" href="https://www.Tutvex.com/pricing" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* ================= PAGE WRAPPER ================= */}
      <div
        className="min-h-screen overflow-x-hidden"
        style={{ background: "#f7f4ef", fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ================= HERO ================= */}
        <section className="relative mx-auto max-w-7xl px-4 pt-20 pb-14 text-center">

          {/* Decorative background shapes */}
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full"
              style={{ background: "radial-gradient(ellipse at center, rgba(20,120,100,0.07) 0%, transparent 65%)" }} />
            <svg className="absolute top-16 left-[8%] opacity-30 animate-spin-slow" width="48" height="48" viewBox="0 0 48 48" fill="none"
              style={{ animationDuration: "18s", animationTimingFunction: "linear", animationIterationCount: "infinite" }}>
              <path d="M24 4l4 14h14l-11 8 4 14-11-8-11 8 4-14-11-8h14z" stroke="#c9a84c" strokeWidth="1.2" fill="none"/>
            </svg>
            <svg className="absolute top-32 right-[7%] opacity-20" width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="26" stroke="#147864" strokeWidth="1.2" strokeDasharray="5 4"/>
            </svg>
            <svg className="absolute bottom-10 left-[12%] opacity-25" width="70" height="24" viewBox="0 0 70 24" fill="none">
              <path d="M2 18 L14 6 L26 18 L38 6 L50 18 L62 6" stroke="#c9a84c" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Eyebrow pill */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{ background: "#fff8ec", border: "1.5px solid #e8c96a", color: "#92600a" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Transparent Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.08]"
            style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}
          >
            Simple &amp; Transparent{" "}
            <span
              className="italic"
              style={{
                background: "linear-gradient(120deg, #147864 20%, #0d5c4c 80%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Pricing
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-6 max-w-2xl mx-auto text-lg leading-relaxed"
            style={{ color: "#5a6a67" }}
          >
            Tutvex follows a transparent pricing model with no hidden charges
            or forced subscriptions. You pay only when you're completely satisfied
            with your tutor.
          </motion.p>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            {["Zero Platform Fee", "Free Demo Classes", "10,000+ Verified Tutors", "All Boards Covered"].map((b) => (
              <span
                key={b}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
                style={{ background: "#fff", border: "1.5px solid #e6dfd4", color: "#3d5048", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {b}
              </span>
            ))}
          </motion.div>

          {/* Animated divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "72px" }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mx-auto mt-12 h-[3px] rounded-full"
            style={{ background: "linear-gradient(90deg, #147864, #c9a84c)" }}
          />
        </section>

        {/* ================= STATS STRIP ================= */}
        <section className="mx-auto max-w-5xl px-4 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#e6dfd4] rounded-2xl overflow-hidden"
            style={{ border: "1.5px solid #e6dfd4", background: "#fff", boxShadow: "0 4px 24px rgba(20,120,100,0.06)" }}
          >
            {[
              { num: "10K+", label: "Verified Tutors" },
              { num: "₹300", label: "Starting Per Hour" },
              { num: "15+", label: "Cities Covered" },
              { num: "98%", label: "Parent Satisfaction" },
            ].map(({ num, label }) => (
              <div key={label} className="py-8 text-center">
                <div
                  className="text-3xl font-bold tracking-tight"
                  style={{ fontFamily: "'Instrument Serif', serif", color: "#147864" }}
                >
                  {num}
                </div>
                <div className="mt-1 text-xs font-medium" style={{ color: "#8a9e99" }}>
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </section>

        {/* ================= PLATFORM PLANS ================= */}
        <section className="mx-auto max-w-5xl px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#c9a84c" }}>
              Plans &amp; Pricing
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}
            >
              Choose Your Path
            </h2>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2">
            {platformPlans.map((plan, idx) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="relative rounded-3xl overflow-hidden"
                style={{
                  background: plan.highlighted
                    ? "linear-gradient(145deg, #0f2e27, #1a4a3a)"
                    : "#fff",
                  border: plan.highlighted ? "1.5px solid #2d6b58" : "1.5px solid #e6dfd4",
                  boxShadow: plan.highlighted
                    ? "0 20px 60px rgba(20,120,100,0.2)"
                    : "0 4px 20px rgba(0,0,0,0.05)",
                }}
              >
                {/* Top gold line for featured */}
                {plan.highlighted && (
                  <div className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: "linear-gradient(90deg, transparent, #c9a84c, transparent)" }} />
                )}

                {/* Badge */}
                {plan.highlighted && (
                  <span
                    className="absolute top-0 right-6 text-[0.65rem] font-black tracking-widest uppercase px-4 py-1.5 rounded-b-lg"
                    style={{ background: "linear-gradient(135deg, #c9a84c, #a07828)", color: "#fff" }}
                  >
                    ★ Most Popular
                  </span>
                )}

                <div className="p-9">
                  {/* Plan name */}
                  <h3
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: "'Instrument Serif', serif", color: plan.highlighted ? "#f0ebe3" : "#1a2e2b" }}
                  >
                    {plan.name}
                  </h3>
                  <p className="mt-1 text-sm" style={{ color: plan.highlighted ? "#8aada5" : "#8a9e99" }}>
                    Best for{" "}
                    {plan.id === "free"
                      ? "parents exploring tutors risk-free"
                      : "parents who want expert guidance"}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed" style={{ color: plan.highlighted ? "#a0bdb8" : "#5a6a67" }}>
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="mt-8 flex items-end gap-2">
                    <span
                      className="text-5xl font-bold tracking-tighter"
                      style={{
                        fontFamily: "'Instrument Serif', serif",
                        color: plan.highlighted ? "#c9a84c" : "#1a2e2b",
                      }}
                    >
                      {plan.price}
                    </span>
                    <span className="text-sm mb-1" style={{ color: plan.highlighted ? "#8aada5" : "#8a9e99" }}>
                      {plan.duration}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="my-7 h-px" style={{ background: plan.highlighted ? "rgba(255,255,255,0.08)" : "#f0ebe3" }} />

                  {/* Features */}
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className="flex-shrink-0 flex h-5 w-5 items-center justify-center rounded-full text-[0.6rem] font-bold mt-0.5"
                          style={{
                            background: plan.highlighted ? "rgba(201,168,76,0.15)" : "rgba(20,120,100,0.1)",
                            border: plan.highlighted ? "1px solid rgba(201,168,76,0.35)" : "1px solid rgba(20,120,100,0.25)",
                            color: plan.highlighted ? "#c9a84c" : "#147864",
                          }}
                        >
                          ✓
                        </span>
                        <span className="text-sm" style={{ color: plan.highlighted ? "#c8dbd8" : "#374151" }}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    href={plan.id === "free" ? "/tutors" : "/contact"}
                    className="mt-9 block w-full rounded-xl px-6 py-3.5 text-center font-bold text-sm tracking-wide transition-all duration-300"
                    style={
                      plan.highlighted
                        ? {
                            background: "linear-gradient(135deg, #c9a84c, #a07828)",
                            color: "#fff",
                            boxShadow: "0 6px 20px rgba(201,168,76,0.3)",
                          }
                        : {
                            background: "#fff",
                            border: "1.5px solid #e6dfd4",
                            color: "#1a2e2b",
                          }
                    }
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= WHY DIFFERENT ================= */}
        <section className="relative py-20 overflow-hidden"
          style={{ background: "linear-gradient(180deg, #f7f4ef 0%, #eef7f4 100%)" }}
        >
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute left-0 top-0 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(20,120,100,0.06) 0%, transparent 70%)", transform: "translate(-30%, -30%)" }} />
            <div className="absolute right-0 bottom-0 w-[400px] h-[400px] rounded-full"
              style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 70%)", transform: "translate(30%, 30%)" }} />
          </div>

          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#147864" }}>
                Our Philosophy
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}
              >
                Why Tutvex{" "}
                <span
                  className="italic"
                  style={{
                    background: "linear-gradient(120deg,#147864,#0d5c4c)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Pricing Is Different
                </span>
              </h2>
              <p className="mt-4 max-w-xl mx-auto text-base" style={{ color: "#5a6a67" }}>
                We believe pricing should feel fair, honest, and completely
                in your control — not confusing or sales-driven.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  emoji: "🚫",
                  badge: "No inflated fees",
                  title: "No Commission Pressure",
                  desc: "Tutors decide their own fees. We never push commissions or force subscriptions.",
                  accent: "#147864",
                },
                {
                  emoji: "🎯",
                  badge: "Risk-free learning",
                  title: "Pay After Satisfaction",
                  desc: "Attend demo classes, interact with tutors, and pay only after you're confident.",
                  accent: "#c9a84c",
                },
                {
                  emoji: "🔍",
                  badge: "Nothing hidden",
                  title: "Transparent Matching",
                  desc: "Pricing depends only on subject, experience, and teaching mode — no surprises.",
                  accent: "#147864",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 180, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="relative rounded-2xl bg-white p-7 overflow-hidden"
                  style={{ border: "1.5px solid #e6dfd4", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
                >
                  {/* Left accent bar */}
                  <div
                    className="absolute left-0 top-7 w-[3px] h-10 rounded-full"
                    style={{ background: item.accent }}
                  />
                  <div
                    className="mb-4 w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                    style={{ background: "#f7f4ef", border: "1.5px solid #e6dfd4" }}
                  >
                    {item.emoji}
                  </div>
                  <span
                    className="inline-block px-3 py-1 rounded-full text-[0.7rem] font-bold tracking-wide mb-3"
                    style={{ background: `${item.accent}12`, color: item.accent, border: `1px solid ${item.accent}30` }}
                  >
                    {item.badge}
                  </span>
                  <h4
                    className="text-lg font-bold tracking-tight mb-2"
                    style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-sm leading-relaxed" style={{ color: "#5a6a67" }}>
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= PRICING FACTORS ================= */}
        <section className="relative overflow-hidden py-20"
          style={{ background: "#1a2e2b" }}
        >
          {/* Decorative mesh */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 top-0 w-[500px] h-[500px]"
              style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.06) 0%, transparent 60%)", transform: "translate(-30%, -30%)" }} />
            <div className="absolute right-0 bottom-0 w-[500px] h-[500px]"
              style={{ background: "radial-gradient(ellipse, rgba(20,120,100,0.1) 0%, transparent 60%)", transform: "translate(30%, 30%)" }} />
            {/* Grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-6xl px-4">
            <div className="grid gap-16 md:grid-cols-2 items-start">
              {/* Left: heading + intro */}
              <div className="sticky top-28">
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#c9a84c" }}>
                    Price Breakdown
                  </p>
                  <h2
                    className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
                    style={{ fontFamily: "'Instrument Serif', serif", color: "#f0ebe3" }}
                  >
                    What Affects{" "}
                    <span className="italic" style={{ color: "#c9a84c" }}>
                      Tutor Pricing?
                    </span>
                  </h2>
                  <p className="text-base leading-relaxed mb-8" style={{ color: "#8aada5" }}>
                    Tutor fees are determined by transparent, merit-based factors. Average fees range from{" "}
                    <span style={{ color: "#c9a84c", fontWeight: 600 }}>₹300 to ₹1,200 per hour</span> — always in your control.
                  </p>

                  {/* Callout card */}
                  <div
                    className="rounded-xl p-5"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
                  >
                    <p className="text-sm leading-relaxed" style={{ color: "#c9a84c" }}>
                      📌 <strong>Pro tip:</strong> Online classes cost less than home tuition — a great way to save while getting quality education.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right: Timeline */}
              <div className="relative pl-8"
                style={{ borderLeft: "1px solid rgba(255,255,255,0.08)" }}
              >
                {[
                  { title: "Subject Difficulty", desc: "Advanced subjects or deeper syllabi require specialized expertise.", icon: BookOpen },
                  { title: "Class & Board", desc: "CBSE, ICSE, IB, or State boards vary in curriculum complexity.", icon: GraduationCap },
                  { title: "Mode of Teaching", desc: "Online classes are generally more affordable than home tuition.", icon: Laptop },
                  { title: "Tutor Experience", desc: "Highly experienced and certified tutors typically charge more.", icon: Award },
                  { title: "Location Demand", desc: "Pricing varies based on city demand and availability of tutors.", icon: MapPin },
                  { title: "Teaching Frequency", desc: "Longer duration and higher frequency sessions may reduce per-hour cost.", icon: Clock },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className="group relative mb-5 last:mb-0"
                    >
                      {/* Timeline dot */}
                      <div
                        className="absolute -left-[2.15rem] top-4 flex h-9 w-9 items-center justify-center rounded-full"
                        style={{ background: "linear-gradient(135deg, #147864, #0d5c4c)", border: "2px solid #1a2e2b", boxShadow: "0 0 0 3px rgba(20,120,100,0.2)" }}
                      >
                        <Icon size={15} color="#a0ddd0" />
                      </div>

                      {/* Card */}
                      <div
                        className="rounded-xl p-5 transition-all duration-300 group-hover:translate-x-1"
                        style={{
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.07)",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.2)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                        }}
                      >
                        <h4 className="font-bold text-[0.95rem] mb-1" style={{ color: "#f0ebe3" }}>
                          {item.title}
                        </h4>
                        <p className="text-sm leading-relaxed" style={{ color: "#8aada5" }}>
                          {item.desc}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ================= PARENTS vs TUTORS ================= */}
        <section className="relative py-20 overflow-hidden" style={{ background: "#f7f4ef" }}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-0 bottom-0 w-[400px] h-[400px]"
              style={{ background: "radial-gradient(ellipse, rgba(20,120,100,0.05) 0%, transparent 65%)", transform: "translate(-20%, 20%)" }} />
            <div className="absolute right-0 top-0 w-[400px] h-[400px]"
              style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.05) 0%, transparent 65%)", transform: "translate(20%, -20%)" }} />
          </div>

          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-14"
            >
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#c9a84c" }}>
                Ecosystem
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}
              >
                Built for{" "}
                <span className="italic" style={{ color: "#147864" }}>
                  Parents &amp; Tutors
                </span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-base" style={{ color: "#5a6a67" }}>
                Tutvex creates a fair ecosystem where parents get quality education
                and tutors grow with confidence.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Parents */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 180 }}
                viewport={{ once: true }}
                className="relative rounded-2xl p-8 overflow-hidden"
                style={{ background: "#fff", border: "1.5px solid #e6dfd4", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
              >
                <div className="absolute top-0 left-0 w-full h-[3px]"
                  style={{ background: "linear-gradient(90deg, #147864, transparent)" }} />
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: "rgba(20,120,100,0.08)", border: "1.5px solid rgba(20,120,100,0.15)" }}>
                    👨‍👩‍👧
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}>
                    For Parents
                  </h3>
                </div>
                <ul className="space-y-3">
                  {["No registration fees", "Free demo classes", "Verified & trained tutors", "Replacement guarantee", "Dedicated dashboard & progress reports"].map((item) => (
                    <li key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                      style={{ background: "#f7f4ef", border: "1px solid #ede8de" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(20,120,100,0.25)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#ede8de"; }}
                    >
                      <CheckCircle size={17} style={{ color: "#147864", flexShrink: 0 }} />
                      <span className="text-sm font-medium" style={{ color: "#374151" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Tutors */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 180 }}
                viewport={{ once: true }}
                className="relative rounded-2xl p-8 overflow-hidden"
                style={{ background: "#fff", border: "1.5px solid #e6dfd4", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}
              >
                <div className="absolute top-0 left-0 w-full h-[3px]"
                  style={{ background: "linear-gradient(90deg, #c9a84c, transparent)" }} />
                <div className="flex items-center gap-3 mb-7">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: "rgba(201,168,76,0.08)", border: "1.5px solid rgba(201,168,76,0.2)" }}>
                    👩‍🏫
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight" style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}>
                    For Tutors
                  </h3>
                </div>
                <ul className="space-y-3">
                  {["No upfront joining fee", "More students, less marketing", "Transparent payout system", "Tutor dashboard & analytics", "Long-term teaching opportunities"].map((item) => (
                    <li key={item} className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
                      style={{ background: "#fffbf0", border: "1px solid #f0e8c8" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(201,168,76,0.4)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "#f0e8c8"; }}
                    >
                      <CheckCircle size={17} style={{ color: "#c9a84c", flexShrink: 0 }} />
                      <span className="text-sm font-medium" style={{ color: "#374151" }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================= FAQ ================= */}
        <section className="relative py-20 overflow-hidden" style={{ background: "#f0ede7" }}>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]"
              style={{ background: "radial-gradient(ellipse, rgba(20,120,100,0.05) 0%, transparent 65%)" }} />
          </div>

          <div className="mx-auto max-w-3xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-xs font-bold tracking-[0.18em] uppercase mb-3" style={{ color: "#147864" }}>
                FAQ
              </p>
              <h2
                className="text-4xl md:text-5xl font-bold tracking-tight"
                style={{ fontFamily: "'Instrument Serif', serif", color: "#1a2e2b" }}
              >
                Common{" "}
                <span className="italic" style={{ color: "#147864" }}>
                  Pricing Questions
                </span>
              </h2>
              <p className="mt-4 text-base" style={{ color: "#5a6a67" }}>
                Everything you need to know about Tutvex pricing, demos, and payments.
              </p>
            </motion.div>

            <div className="space-y-3">
              {pricingFaqSchema.mainEntity.map((faq, idx) => (
                <FaqItem key={faq.name} faq={faq} index={idx} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= FINAL CTA ================= */}
        <section
          className="relative py-28 text-center overflow-hidden"
          style={{ background: "linear-gradient(145deg, #0f2e27, #1a4a3a)" }}
        >
          {/* Decorative */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]"
              style={{ background: "radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 65%)" }} />
            <svg className="absolute top-12 left-[8%] opacity-20" width="50" height="50" viewBox="0 0 50 50" fill="none"
              style={{ animation: "spin 20s linear infinite" }}>
              <path d="M25 4l4 15h16l-13 9 5 15-12-9-12 9 5-15-13-9h16z" stroke="#c9a84c" strokeWidth="1" fill="none"/>
            </svg>
            <svg className="absolute bottom-12 right-[8%] opacity-15" width="70" height="24" viewBox="0 0 70 24" fill="none">
              <path d="M2 18 L14 6 L26 18 L38 6 L50 18 L62 6" stroke="#c9a84c" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
            </svg>
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.025]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="ctaGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#fff" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#ctaGrid)" />
            </svg>
          </div>

          <div className="relative mx-auto max-w-4xl px-4">
            {/* Quote chip */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block px-5 py-2 rounded-full text-sm mb-8"
              style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", color: "#c9a84c" }}
            >
              "Education should be a decision, not a gamble" 📖
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5"
              style={{ fontFamily: "'Instrument Serif', serif", color: "#f0ebe3" }}
            >
              Education Should Be a Decision,{" "}
              <span className="italic" style={{ color: "#c9a84c" }}>Not a Risk.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto text-base leading-relaxed mb-10"
              style={{ color: "#8aada5" }}
            >
              With Tutvex, you explore tutors freely, attend demo classes,
              and move forward only when you're confident and satisfied.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.28 }}
              className="flex justify-center gap-4 flex-wrap"
            >
              <Link
                href="/tutors"
                className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(135deg, #c9a84c, #a07828)",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(201,168,76,0.25)",
                }}
              >
                Find a Tutor
              </Link>
              <Link
                href="/tutor-flow/tutor-registration/"
                className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-300"
                style={{
                  background: "transparent",
                  border: "1.5px solid rgba(255,255,255,0.15)",
                  color: "#c8dbd8",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                Become a Tutor
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
 <FloatingChatButton />
      <WhatsappFloat />
      <Footer />

      <style jsx global>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}