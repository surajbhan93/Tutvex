import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import { useState } from "react";
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

function FaqItem({ faq, index }:FaqItemProps) {
  const [open, setOpen] = useState(index === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition"
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <h4 className="font-semibold text-gray-900">
          {faq.name}
        </h4>
        <ChevronDown
          className={`h-5 w-5 text-gray-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <motion.div
        initial={false}
        animate={{
          height: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className="overflow-hidden px-6"
      >
        <p className="pb-5 text-sm text-gray-600 leading-relaxed">
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
        "text":
          "Yes. Tutvex allows parents to browse tutors, attend demo classes, and explore options completely free. You pay only after confirming a tutor."
      }
    },
    {
      "@type": "Question",
      "name": "Does Tutvex charge any registration fees?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "No. Tutvex does not charge any registration or platform fees for parents or students."
      }
    },
    {
      "@type": "Question",
      "name": "How much does a tutor cost on Tutvex?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Tutor fees vary based on class, subject, board, and experience. On average, fees range from ₹300 to ₹1200 per hour."
      }
    },
    {
      "@type": "Question",
      "name": "Do I need to subscribe to a monthly plan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "No subscription is mandatory. Tutvex follows a pay-after-confirmation model so parents can choose freely."
      }
    },
    {
      "@type": "Question",
      "name": "Are tutors verified on Tutvex?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text":
          "Yes. All tutors on Tutvex go through phone verification, document checks, subject evaluation, and interviews before approval."
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
  ChevronDown
} from "lucide-react"


const platformPlans = [
  {
    id: "free",
    name: "Free Discovery",
    price: "₹0",
    duration: "No charges",
    description:
      "Explore tutors, attend demo classes, and decide without any upfront cost.",
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
    description:
      "Get personalized support from Tutvex experts for the best learning outcome.",
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

// const tutorFeeRanges = [
//   {
//     title: "Primary Classes (1–5)",
//     price: "₹300 – ₹500 / hour",
//     note: "Foundation learning & concept clarity",
//   },
//   {
//     title: "Middle School (6–8)",
//     price: "₹400 – ₹600 / hour",
//     note: "CBSE / ICSE / State Boards",
//   },
//   {
//     title: "Secondary (9–10)",
//     price: "₹500 – ₹800 / hour",
//     note: "Board exam focused preparation",
//   },
//   {
//     title: "Senior Secondary (11–12)",
//     price: "₹700 – ₹1200 / hour",
//     note: "Science, Commerce & specialization",
//   },
// ];

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

         {/* 🔥 Pricing FAQ Schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pricingFaqSchema),
          }}
        />

      </Head>


      {/* ================= PAGE WRAPPER ================= */}
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

        {/* ================= HERO ================= */}
        <section className="relative mx-auto max-w-6xl px-4 py-14 text-center">

  {/* Subtle background */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute left-1/2 top-10 h-60 w-60 -translate-x-1/2 rounded-full bg-indigo-100 blur-3xl opacity-40" />
  </div>

  <motion.h1
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900"
  >
    Simple & Transparent{" "}
    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      Pricing
    </span>
  </motion.h1>

  <motion.p
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.15 }}
    className="mt-6 max-w-3xl mx-auto text-lg leading-relaxed text-gray-600"
  >
    Tutvex follows a transparent pricing model with no hidden charges
    or forced subscriptions. You pay only when you’re completely satisfied
    with your tutor.
  </motion.p>

  {/* Soft divider */}
  <motion.div
    initial={{ width: 0 }}
    animate={{ width: "80px" }}
    transition={{ delay: 0.3 }}
    className="mx-auto mt-10 h-1 rounded-full bg-indigo-600"
  />
</section>


        {/* ================= PLATFORM PLANS ================= */}
      <section className="mx-auto max-w-7xl px-4 pb-14">
 

  <div className="grid gap-10 md:grid-cols-2">
    {platformPlans.map((plan, idx) => (
      <motion.div
        key={plan.id}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.03, y: -6 }}
        transition={{ type: "spring", stiffness: 180, delay: idx * 0.1 }}
        viewport={{ once: true }}
        className={`relative rounded-3xl p-[1px]
          ${
            plan.highlighted
              ? "bg-gradient-to-br from-indigo-500 to-purple-600"
              : "bg-slate-200"
          }
        `}
      >
        <div className="h-full rounded-3xl bg-white p-8 shadow-lg">
          {/* Badge */}
          {plan.highlighted && (
            <span className="absolute -top-4 left-6 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white shadow">
              Most Popular
            </span>
          )}

          {/* Plan Name */}
          <h3 className="text-2xl font-bold text-gray-900">
            {plan.name}
          </h3>

          {/* Best For */}
          <p className="mt-1 text-sm text-gray-400">
            Best for{" "}
            {plan.id === "free"
              ? "parents exploring tutors risk-free"
              : "parents who want expert guidance"}
          </p>

          {/* Description */}
          <p className="mt-4 text-gray-600">
            {plan.description}
          </p>

          {/* Price */}
          <div className="mt-8 flex items-end gap-2">
            <span className="text-4xl font-extrabold text-gray-900">
              {plan.price}
            </span>
            <span className="text-gray-500 text-sm">
              {plan.duration}
            </span>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-slate-200" />

          {/* Features */}
          <ul className="space-y-4">
            {plan.features.map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-gray-700"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-sm font-bold">
                  ✓
                </span>
                <span className="text-sm leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <Link
            href={
              plan.id === "free"
                ? "/tutors"
                : "/contact"
            }
            className={`mt-10 block w-full rounded-xl px-6 py-3 text-center font-semibold transition-all duration-300
              ${
                plan.highlighted
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                  : "border border-slate-300 hover:bg-slate-50"
              }
            `}
          >
            {plan.cta}
          </Link>
        </div>
      </motion.div>
    ))}
  </div>
</section>

        {/* Why Tutvex Pricing Is Different */}
<section className="relative mx-auto max-w-7xl px-4 py-14 overflow-hidden">

  {/* Soft gradient background */}
  <div className="absolute inset-0 -z-10">
    <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-indigo-200 blur-3xl opacity-30" />
    <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-purple-200 blur-3xl opacity-30" />
  </div>

  {/* Heading */}
  <motion.h2
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-3xl md:text-4xl font-extrabold text-center text-gray-900"
  >
    Why Tutvex{" "}
    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
      Pricing Is Different
    </span>
  </motion.h2>

  {/* Subheading */}
  <motion.p
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.1 }}
    viewport={{ once: true }}
    className="mt-4 max-w-3xl mx-auto text-center text-gray-600 text-lg"
  >
    We believe pricing should feel fair, honest, and completely
    in your control — not confusing or sales-driven.
  </motion.p>

  {/* Cards */}
  <div className="mt-16 grid gap-8 md:grid-cols-3">
    {[
      {
        title: "No Commission Pressure",
        highlight: "No inflated fees",
        desc: "Tutors decide their own fees. We never push commissions or force subscriptions."
      },
      {
        title: "Pay After Satisfaction",
        highlight: "Risk-free learning",
        desc: "Attend demo classes, interact with tutors, and pay only after you’re confident."
      },
      {
        title: "Transparent Matching",
        highlight: "Nothing hidden",
        desc: "Pricing depends only on subject, experience, and teaching mode — no surprises."
      }
    ].map((item, i) => (
      <motion.div
        key={item.title}
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ y: -6, scale: 1.03 }}
        transition={{ type: "spring", stiffness: 160, delay: i * 0.1 }}
        viewport={{ once: true }}
        className="group relative rounded-3xl bg-white p-8 shadow-md hover:shadow-xl transition"
      >
        {/* Accent bar */}
        <div className="absolute left-0 top-6 h-12 w-1 rounded-full bg-gradient-to-b from-indigo-600 to-purple-600" />

        {/* Highlight badge */}
        <span className="inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
          {item.highlight}
        </span>

        {/* Title */}
        <h4 className="mt-4 text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition">
          {item.title}
        </h4>

        {/* Description */}
        <p className="mt-3 text-gray-600 text-sm leading-relaxed">
          {item.desc}
        </p>
      </motion.div>
    ))}
  </div>
</section>


        {/* ================= PRICING FACTORS ================= */}
       <section className="relative overflow-hidden py-14">

  {/* Gradient background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-800 via-white to-purple-500" />

  {/* Floating accents */}
  <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-indigo-400 blur-3xl opacity-30" />
  <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-purple-400 blur-3xl opacity-30" />

  <div className="mx-auto max-w-6xl px-2">

    {/* Heading */}
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-extrabold text-gray-800"
    >
      What Affects{" "}
      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Tutor Pricing?
      </span>
    </motion.h2>

    <p className="mt-4 max-w-2xl text-gray-600">
      Tutor fees are determined by multiple transparent factors that ensure
      fair pricing for both parents and tutors.
    </p>

    {/* Timeline */}
    <div className="relative mt-20 space-y-12 border-l-2 border-indigo-300 pl-10">

      {[
        {
          title: "Subject Difficulty",
          desc: "Advanced subjects or deeper syllabi require specialized expertise.",
          icon: BookOpen,
        },
        {
          title: "Class & Board",
          desc: "CBSE, ICSE, IB, or State boards vary in curriculum complexity.",
          icon: GraduationCap,
        },
        {
          title: "Mode of Teaching",
          desc: "Online classes are generally more affordable than home tuition.",
          icon: Laptop,
        },
        {
          title: "Tutor Experience",
          desc: "Highly experienced and certified tutors typically charge more.",
          icon: Award,
        },
        {
          title: "Location Demand",
          desc: "Pricing varies based on city demand and availability of tutors.",
          icon: MapPin,
        },
        {
          title: "Teaching Frequency",
          desc: "Longer duration and higher frequency sessions may reduce per-hour cost.",
          icon: Clock,
        },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="group relative"
          >
            {/* Timeline dot */}
            <div className="absolute -left-[52px] top-1 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg">
              <Icon size={18} />
            </div>

            {/* Card */}
            <div className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-300 group-hover:shadow-xl">
              <h4 className="font-semibold text-lg text-gray-900">
                {item.title}
              </h4>

              {/* Tooltip-trigger text */}
              <p className="mt-2 text-gray-700 text-sm relative">
                {item.desc}

                {/* Tooltip */}
                <span className="absolute left-0 top-full mt-2 w-64 scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 rounded-lg bg-gray-900 px-4 py-2 text-xs text-white shadow-lg">
                  This factor directly impacts tutor availability and pricing
                  flexibility.
                </span>
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  </div>
</section>


        {/* ================= PARENTS vs TUTORS ================= */}
        <section className="relative py-14 overflow-hidden">

  {/* Gradient background */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />

  {/* Glow accents */}
  <div className="absolute left-10 top-20 h-64 w-64 rounded-full bg-indigo-200 blur-3xl opacity-30" />
  <div className="absolute right-10 bottom-20 h-64 w-64 rounded-full bg-purple-200 blur-3xl opacity-30" />

  <div className="mx-auto max-w-7xl px-4">

    {/* Section Heading */}
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-extrabold text-center text-gray-900"
    >
      Built for{" "}
      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Parents & Tutors
      </span>
    </motion.h2>

    <p className="mt-4 max-w-3xl mx-auto text-center text-gray-600">
      Tutvex creates a fair ecosystem where parents get quality education
      and tutors grow with confidence.
    </p>

    {/* Cards */}
    <div className="mt-20 grid gap-10 md:grid-cols-2">

      {/* Parents Card */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 160 }}
        viewport={{ once: true }}
        className="relative rounded-3xl bg-white p-10 shadow-md hover:shadow-xl"
      >
        {/* Accent */}
        <div className="absolute left-0 top-8 h-16 w-1 rounded-full bg-indigo-600" />

        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          For Parents
        </h3>

        <ul className="space-y-4">
          {[
            "No registration fees",
            "Free demo classes",
            "Verified & trained tutors",
            "Replacement guarantee",
            "Dedicated dashboard & progress reports",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle className="text-indigo-600 mt-1" size={20} />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Tutors Card */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 160 }}
        viewport={{ once: true }}
        className="relative rounded-3xl bg-white p-10 shadow-md hover:shadow-xl"
      >
        {/* Accent */}
        <div className="absolute left-0 top-8 h-16 w-1 rounded-full bg-purple-600" />

        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          For Tutors
        </h3>

        <ul className="space-y-4">
          {[
            "No upfront joining fee",
            "More students, less marketing",
            "Transparent payout system",
            "Tutor dashboard & analytics",
            "Long-term teaching opportunities",
          ].map((item) => (
            <li key={item} className="flex items-start gap-3">
              <CheckCircle className="text-purple-600 mt-1" size={20} />
              <span className="text-gray-700">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

    </div>
  </div>
</section>

{/* Add “Frequently Asked Pricing Doubts” */}
      <section className="relative py-28 overflow-hidden">

  {/* Background gradient */}
  <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-50 via-white to-indigo-50" />

  <div className="mx-auto max-w-4xl px-4">

    {/* Heading */}
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-3xl md:text-4xl font-extrabold text-center text-gray-900"
    >
      Common{" "}
      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        Pricing Questions
      </span>
    </motion.h2>

    <p className="mt-4 text-center text-gray-600 max-w-2xl mx-auto">
      Everything you need to know about Tutvex pricing, demos, and payments.
    </p>

    {/* FAQ Items */}
    <div className="mt-16 space-y-4">
      {pricingFaqSchema.mainEntity.map((faq, idx) => (
        <FaqItem key={faq.name} faq={faq} index={idx} />
      ))}
    </div>
  </div>
</section>

        {/* ================= FINAL CTA ================= */}
        <section className="py-28 text-center">
          <h2 className="text-4xl font-extrabold">
              Education Should Be a Decision, Not a Risk
            </h2>

            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              With Tutvex, you explore tutors freely, attend demo classes,
              and move forward only when you're confident and satisfied.
            </p>


          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/tutors"
              className="rounded-xl bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700"
            >
              Find a Tutor
            </Link>
            <Link
              href="/tutor-flow/tutor-registration/"
              className="rounded-xl border px-8 py-3 font-semibold hover:bg-slate-50"
            >
              Become a Tutor
            </Link>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
