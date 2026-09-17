import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Variants } from "framer-motion";
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
// import Button from '@/components/find-tutor-flow/Button';
import InputField from '@/components/find-tutor-flow/InputField';
import apiClient from '@/lib/apiClient';
import OnboardingStepper from '@/pages/find-tutor-flow/OnboardingStepper';

/* ═══════════════════════════════════════════════
   ALL LOGIC & API UNTOUCHED — DESIGN ONLY CHANGE
   Aesthetic: Premium Ivory × Deep Forest × Gold
   Fonts: Lora (display) + DM Sans (body)
═══════════════════════════════════════════════ */

/* ------------------ Animations ------------------ */
const pageVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};
const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as const, // ⭐ THIS LINE FIXES ERROR
    },
  },
};

const cardHover = { hover: { scale: 1.02 } };

/* ------------------ Steps data (extracted for cleanliness) ------------------ */
const journeySteps = [
  { num: "01", text: "Create your Tutvex account"        },
  { num: "02", text: "Tell us your preferences"           },
  { num: "03", text: "Get matched with verified tutors"   },
  { num: "04", text: "Send your learning requirements"    },
  { num: "05", text: "Track sessions & progress"          },
];

/* ------------------ Component ------------------ */
const CreateAccount: React.FC = () => {
  const router = useRouter();

  /* ── STATE — UNTOUCHED ── */
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    location: {
      city: 'Unknown',
      area: 'Unknown',
      coordinates: {
        type: 'Point',
        coordinates: [78.9629, 20.5937],
      },
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  /* ── HANDLERS — UNTOUCHED ── */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const res = await apiClient.post('/auth/parent/signup', form);
      if (res.data?.token) {
        localStorage.setItem('token', res.data.token);
      }
      // router.push('/find-tutor-flow/preferences');
      const redirect = router.query.redirect as string;
    const action = router.query.action as string;

if (redirect) {
  let finalUrl = redirect;

  if (action) {
    finalUrl = `${redirect}?action=${action}`;
  }

  router.push(finalUrl);
} else {
  router.push('/find-tutor-flow/preferences');
}
    } catch (err: any) {
      const backendMessage = err.response?.data?.error || err.response?.data?.message;
      setError(backendMessage || 'This email is already registered. Please login instead.');
    } finally {
      setIsLoading(false);
    }
  };

  /* ────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────── */
  return (
    <>
      {/* ── Fonts ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');
        .font-lora   { font-family: 'Lora', Georgia, serif; }
        .font-dmsans { font-family: 'DM Sans', system-ui, sans-serif; }

        /* Gold shimmer CTA */
        @keyframes shimmer-cta {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .btn-shimmer {
          background: linear-gradient(110deg, #c8922a 0%, #f5c842 30%, #c8922a 55%, #8B6914 80%, #c8922a 100%);
          background-size: 300% auto;
          animation: shimmer-cta 4s linear infinite;
        }
        .btn-shimmer:hover {
          box-shadow: 0 14px 36px rgba(200,146,42,0.45);
          transform: translateY(-2px) scale(1.02);
        }
        .btn-shimmer:active { transform: scale(0.98); }
        .btn-shimmer:disabled {
          animation: none;
          background: #d4c8a8;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        /* Input focus ring */
        .tutvex-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 12px;
          border: 1.5px solid #e2d9c8;
          background: #fdfaf4;
          font-family: 'DM Sans', system-ui, sans-serif;
          font-size: 14px;
          color: #1a2744;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .tutvex-input::placeholder { color: #a09880; }
        .tutvex-input:focus {
          border-color: #1e3d2f;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(30,61,47,0.08);
        }
        .tutvex-input:disabled { opacity: 0.55; cursor: not-allowed; }

        /* Step connector line */
        .step-connector::before {
          content: '';
          position: absolute;
          left: 18px;
          top: 36px;
          bottom: -12px;
          width: 2px;
          background: linear-gradient(to bottom, #1e3d2f40, transparent);
        }

        /* Video iframe shimmer loading */
        .video-wrap { position: relative; padding-top: 56.25%; }
        .video-wrap iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; }

        /* Noise overlay */
        .paper-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
        }

        /* Ruled lines behind form */
        .ruled-bg {
          background-image: repeating-linear-gradient(
            to bottom, transparent, transparent 27px, #e8d5b730 27px, #e8d5b730 28px
          );
          background-size: 100% 28px;
        }
      `}</style>

      <motion.div
        variants={pageVariant}
        initial="hidden"
        animate="visible"
        className="font-dmsans flex min-h-screen flex-col overflow-hidden"
        style={{ background: "#f5f0e8" }}
      >
        {/* ── Paper noise overlay ── */}
        <div aria-hidden="true" className="paper-noise pointer-events-none fixed inset-0 z-0" />

        {/* ── Top accent bar ── */}
        <div
          aria-hidden="true"
          className="relative z-20 h-[3px] w-full"
          style={{ background: "linear-gradient(90deg, #1e3d2f, #2d5c42, #c8922a, #2d5c42, #1e3d2f)" }}
        />

        <div className="relative z-10">
          <NavBar />
        </div>

        {/* ════════════════════════════════════════
            HERO HEADER
        ════════════════════════════════════════ */}
        <div
          className="relative z-10 overflow-hidden py-12 sm:py-16"
          style={{ background: "linear-gradient(135deg, #1e3d2f 0%, #2d5c42 60%, #1a3528 100%)" }}
        >
          {/* Chalk grid lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[.045]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
              backgroundSize: "44px 44px",
            }}
          />

          {/* Decorative circles */}
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #f5c842, transparent)" }} />
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full opacity-[.07]" style={{ background: "radial-gradient(circle, #f5c842, transparent)" }} />

          <motion.div variants={fadeUp} className="relative z-10 mx-auto max-w-3xl px-4 text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-white/70">
              <span className="h-[5px] w-[5px] rounded-full bg-green-400" />
              Step 1 of 5 — Account Setup
            </span>

            <h1 className="font-lora text-3xl font-bold text-white sm:text-4xl md:text-5xl leading-tight mt-3">
              Start Your{" "}
              <em className="not-italic" style={{ color: "#f5c842" }}>Tutvex</em>{" "}
              Journey 🚀
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed" style={{ color: "rgba(245,240,232,0.65)" }}>
              Create your account and get matched with trusted tutors, tailored exactly to your learning needs.
            </p>
          </motion.div>
        </div>

        {/* ════════════════════════════════════════
            STEPPER
        ════════════════════════════════════════ */}
        <div className="relative z-10 bg-white/60 backdrop-blur-sm border-b border-[#e8d5b7] px-4 py-3">
          <div className="mx-auto max-w-7xl">
            <OnboardingStepper currentStep={1} />
          </div>
        </div>

        {/* ════════════════════════════════════════
            MAIN CONTENT
        ════════════════════════════════════════ */}
        <div className="relative z-10 flex flex-1 items-start justify-center px-4 py-10 sm:py-14">
          <div className="w-full max-w-7xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 items-start">

              {/* ══════════════════════════════
                  LEFT PANEL
              ══════════════════════════════ */}
              <motion.div variants={fadeUp} className="space-y-6">

                {/* Video Card */}
                <motion.div
                  whileHover="hover"
                  variants={cardHover}
                  className="overflow-hidden rounded-3xl shadow-xl"
                  style={{ border: "1px solid #e8d5b7" }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-center gap-3 px-6 py-4"
                    style={{ background: "#1e3d2f" }}
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-lg">🎥</span>
                    <div>
                      <h3 className="font-lora font-semibold text-white text-[15px]">
                        Watch How Tutvex Works
                      </h3>
                      <p className="text-[11px]" style={{ color: "rgba(245,240,232,0.55)" }}>
                        Quick walkthrough — 2 min
                      </p>
                    </div>
                  </div>

                  <div className="bg-black">
                    <div className="video-wrap">
                      <iframe
                        src="https://www.youtube.com/embed/kTWv-R_D3fo?si=sVR5_1zmmUXTSfgJ"
                        title="Tutvex Signup Guide"
                        allowFullScreen
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Journey Steps Card */}
                <motion.div
                  whileHover="hover"
                  variants={cardHover}
                  className="rounded-3xl bg-white p-6 shadow-xl"
                  style={{ border: "1px solid #e8d5b7" }}
                >
                  {/* Header */}
                  <div className="mb-5 flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <h3 className="font-lora font-semibold text-[#1a2744] text-[16px]">
                      Your Learning Journey
                    </h3>
                  </div>

                  <ul className="space-y-0 list-none p-0">
                    {journeySteps.map((step, i) => (
                      <li
                        key={step.num}
                        className="relative flex items-start gap-4 pb-5 last:pb-0"
                      >
                        {/* Vertical connector */}
                        {i < journeySteps.length - 1 && (
                          <div
                            aria-hidden="true"
                            className="absolute left-[18px] top-[36px] bottom-0 w-[2px]"
                            style={{ background: "linear-gradient(to bottom, #1e3d2f30, transparent)" }}
                          />
                        )}

                        {/* Step circle */}
                        <div
                          className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full font-lora text-xs font-bold"
                          style={{
                            background: i === 0 ? "#1e3d2f" : "#f0ede4",
                            color: i === 0 ? "#f5c842" : "#9da8b5",
                            border: i === 0 ? "none" : "1.5px solid #e2d9c8",
                          }}
                        >
                          {step.num}
                        </div>

                        {/* Text */}
                        <div className="pt-1.5">
                          <p
                            className="text-[14px] font-medium leading-tight"
                            style={{ color: i === 0 ? "#1a2744" : "#6b7280" }}
                          >
                            {step.text}
                          </p>
                          {i === 0 && (
                            <span
                              className="mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
                              style={{ background: "#dcfce7", color: "#15803d" }}
                            >
                              You are here
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>

                  {/* Bottom note */}
                  <div
                    className="mt-5 flex items-center gap-3 rounded-xl p-3"
                    style={{ background: "#fef9ec", border: "1px dashed #e8c96a" }}
                  >
                    <span className="text-base flex-shrink-0">✏️</span>
                    <p className="text-[12px] leading-relaxed" style={{ color: "#6b5c3e" }}>
                      The entire setup takes less than <strong>3 minutes</strong>. Free demo session included.
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* ══════════════════════════════
                  RIGHT PANEL — FORM
              ══════════════════════════════ */}
              <motion.div variants={fadeUp}>
                <div
                  className="relative overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_rgba(26,39,68,0.12)]"
                  style={{ border: "1px solid #e8d5b7" }}
                >
                  {/* Ruled lines texture */}
                  <div aria-hidden="true" className="ruled-bg pointer-events-none absolute inset-0 opacity-50" />

                  {/* Left binding strip */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute left-0 inset-y-0 w-8"
                    style={{ background: "#e8d5b7", borderRight: "1.5px solid #d4ba95" }}
                  />
                  {/* Red margin line */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0"
                    style={{ left: 38, width: 1.5, background: "rgba(220,50,50,0.18)" }}
                  />

                  {/* Form content — offset from binding */}
                  <div className="relative z-10 px-6 py-8 pl-12 sm:px-10 sm:pl-14">

                    {/* Logo + title */}
                    <div className="mb-6 flex flex-col items-center gap-1">
                      <img
                        src="/images/logo1.png"
                        alt="Tutvex logo"
                        className="mb-2 h-10 w-auto object-contain"
                      />
                      <h2 className="font-lora text-2xl font-bold text-[#1a2744] sm:text-3xl text-center">
                        Create Your Account
                      </h2>
                      <p className="text-center text-[13px] text-[#6b7280] mt-1">
                        Join thousands of learners finding the right tutors on Tutvex.
                      </p>
                    </div>

                    {/* Gold divider */}
                    <div
                      aria-hidden="true"
                      className="mb-6 h-px"
                      style={{ background: "linear-gradient(90deg, transparent, #c8922a60, transparent)" }}
                    />

                    {/* ── FORM — ALL LOGIC UNTOUCHED ── */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">

                      {/* Full Name */}
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">Full Name</label>
                        <InputField
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Rahul Sharma"
                          type="text"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">Email Address</label>
                        <InputField
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          type="email"
                          disabled={isLoading}
                        />
                      </div>

                      {/* City + Area — 2-col grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">City</label>
                          <InputField
                            name="city"
                            placeholder="e.g. Delhi"
                            onChange={(e) =>
                              setForm({ ...form, location: { ...form.location, city: e.target.value } })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">Area</label>
                          <InputField
                            name="area"
                            placeholder="e.g. Lajpat Nagar"
                            onChange={(e) =>
                              setForm({ ...form, location: { ...form.location, area: e.target.value } })
                            }
                          />
                        </div>
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">Password</label>
                        <InputField
                          name="password"
                          value={form.password}
                          onChange={handleChange}
                          placeholder="Create a strong password"
                          type="password"
                          disabled={isLoading}
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label className="text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">Mobile Number</label>
                        <InputField
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+91 98765 43210"
                          type="tel"
                          disabled={isLoading}
                        />
                      </div>

                      {/* CTA Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="btn-shimmer mt-2 w-full rounded-xl py-3.5 text-[15px] font-bold text-[#1a2744] transition-all duration-300"
                      >
                        {isLoading ? (
                          <span className="inline-flex items-center justify-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                            </svg>
                            Creating Account…
                          </span>
                        ) : (
                          "Continue →"
                        )}
                      </button>

                      {/* Error message */}
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-start gap-3 rounded-xl p-3"
                          style={{ background: "#fef2f2", border: "1px solid #fecaca" }}
                        >
                          <span className="mt-0.5 flex-shrink-0 text-red-500">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
                              <circle cx="12" cy="12" r="10" /><path strokeLinecap="round" d="M12 8v4M12 16h.01" />
                            </svg>
                          </span>
                          <p className="text-[13px] text-red-700">{error}</p>
                        </motion.div>
                      )}
                    </form>

                    {/* Gold divider */}
                    <div
                      aria-hidden="true"
                      className="my-6 h-px"
                      style={{ background: "linear-gradient(90deg, transparent, #c8922a40, transparent)" }}
                    />

                    {/* Trust micro-badges */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {[
                        { icon: "🔒", text: "Secure" },
                        { icon: "✅", text: "Verified Tutors" },
                        { icon: "🎓", text: "Free Demo" },
                      ].map((b) => (
                        <span
                          key={b.text}
                          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium"
                          style={{ background: "#f0ede4", color: "#6b5c3e", border: "1px solid #e2d9c8" }}
                        >
                          <span>{b.icon}</span>{b.text}
                        </span>
                      ))}
                    </div>

                    {/* Login link */}
                    <p className="mt-5 text-center text-[13px] text-[#9da8b5]">
                      Already registered?{" "}
                      <Link
                          href={`/login?redirect=${router.query.redirect}&action=${router.query.action}`}
                        >
                        <span
                          className="cursor-pointer font-semibold transition-colors duration-200"
                          style={{ color: "#1e3d2f" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#c8922a")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "#1e3d2f")}
                        >
                          Login here →
                        </span>
                      </Link>
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <Footer />
        </div>

        {/* Bottom accent bar */}
        <div
          aria-hidden="true"
          className="relative z-20 h-[3px] w-full"
          style={{ background: "linear-gradient(90deg, #1e3d2f, #2d5c42, #c8922a, #2d5c42, #1e3d2f)" }}
        />
      </motion.div>
    </>
  );
};

export default CreateAccount;