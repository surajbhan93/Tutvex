import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import {
  FileText,
  ShieldCheck,
  Award,
  AlertTriangle,
  CheckCircle2,
  Lock,
  DollarSign,
  Users,
  Sparkles,
  ChevronRight,
  Zap,
  PhoneCall,
  Check,
  X,
  Building2,
  Gift,
  HelpCircle,
  Clock,
} from "lucide-react";

export default function TutorPolicyAgreementPage() {
  const [tutorName, setTutorName] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [panNo, setPanNo] = useState("");
  const [signatureDate, setSignatureDate] = useState(new Date().toISOString().split("T")[0]);
  const [signed, setSigned] = useState(false);

  const handleDigitalSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorName.trim() || !panNo.trim()) {
      alert("Please fill in your Full Name and PAN Number.");
      return;
    }
    setSigned(true);
  };

  return (
    <>
      <Head>
        <title>Tutvex Tutor Agreement, Operational Policies &amp; Pricing Terms</title>
        <meta
          name="description"
          content="Unified Tutvex Tutor Agreement (Annexure A & B), Revenue Sharing Models (30% 1st month with Subscription / 50% without Subscription), Policies, and Digital Consent."
        />
      </Head>

      <NavBar />

      <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
        {/* ================= HERO HEADER ================= */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white py-14 md:py-20 px-4 border-b border-indigo-900/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              Unified Tutvex Tutor Agreement &amp; Terms
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
              Tutvex Tutor Agreement,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-emerald-300">
                Annexure A, B &amp; Pricing Policies
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Complete operational guidelines, revenue sharing models (30% 1st Month for Subscription Tutors / 50% for Revenue-Share Tutors), non-circumvention rules, and tutor benefits.
            </p>

            {/* QUICK JUMP LINKS */}
            <div className="pt-4 flex flex-wrap justify-center gap-3 text-xs font-bold">
              <a href="#revenue-sharing" className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 transition border border-white/10">
                1. Revenue Share &amp; Payments
              </a>
              <a href="#operational-policies" className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 transition border border-white/10">
                2. Operational &amp; Non-Circumvention Rules
              </a>
              <a href="#membership-plans" className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 transition border border-white/10">
                3. Membership Plans
              </a>
              <a href="#tutor-benefits" className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-indigo-200 transition border border-white/10">
                4. Tutor Benefits
              </a>
              <a href="#digital-signature" className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 transition font-black">
                5. Digital Consent &amp; Sign
              </a>
            </div>
          </div>
        </div>

        {/* ================= MAIN UNIFIED DOCUMENT CONTAINER ================= */}
        <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

          {/* ================= SECTION 1: REVENUE SHARING & PAYMENT HANDLING ================= */}
          <section id="revenue-sharing" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-indigo-600 text-white font-black text-sm">
                01
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Revenue Sharing Models &amp; Payment Handling Policy
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Tutvex operates on two clear tutor engagement models (Subscription vs 50% Revenue Share)
                </p>
              </div>
            </div>

            {/* 2 MODELS BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* MODEL 1: SUBSCRIPTION MODEL */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-indigo-900 to-purple-950 text-white space-y-4 border border-indigo-500/30 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Recommended Model
                  </span>
                  <Sparkles className="h-5 w-5 text-amber-300" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  Subscription Model (Priority Access)
                </h3>
                <div className="space-y-2 text-xs text-indigo-100 leading-relaxed">
                  <p>
                    <strong className="text-amber-300 text-sm">30% Revenue Share (1st Month Only)</strong>: Subscription tutors get priority student lead matching and pay only <strong>30% revenue share for the first month</strong>.
                  </p>
                  <p>
                    <strong>Includes Lead Credits</strong>: Access direct parent contact details, featured profile promotion, analytics, and priority placement.
                  </p>
                  <p className="text-[11px] text-indigo-300 pt-1">
                    Subscription plans range from ₹299/mo (10 credits), ₹699/mo (30 credits), to ₹1499/mo (75 credits).
                  </p>
                </div>
              </div>

              {/* MODEL 2: 50% REVENUE SHARE MODEL */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                    No Upfront Fee
                  </span>
                  <DollarSign className="h-5 w-5 text-emerald-400" />
                </div>
                <h3 className="text-lg font-bold text-white">
                  50% Revenue-Share Model (No Subscription)
                </h3>
                <div className="space-y-2 text-xs text-slate-300 leading-relaxed">
                  <p>
                    <strong className="text-emerald-400 text-sm">50% Revenue Share</strong>: Don&apos;t want to purchase a subscription? Work with Tutvex on a <strong>50% revenue-sharing model</strong> without any upfront investment.
                  </p>
                  <p>
                    Opportunities are provided based on lead availability and student-tutor matching criteria.
                  </p>
                  <p className="text-[11px] text-slate-400 pt-1">
                    Interested? WhatsApp us directly at <a href="https://wa.me/919335999333" target="_blank" rel="noreferrer" className="text-emerald-400 font-bold underline">+91 93359 99333</a>.
                  </p>
                </div>
              </div>
            </div>

            {/* MANDATORY PAYMENT RULES */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
                <Lock className="h-4 w-4 text-indigo-600" />
                Mandatory Payment Handling Rules:
              </div>
              <ul className="space-y-2 list-disc pl-5 font-medium leading-relaxed text-slate-600">
                <li>
                  <strong className="text-slate-900">All Payments Through Tutvex Only:</strong> All tuition payments from parents or students shall be made only to Tutvex. Tutors shall not accept cash, UPI, bank transfers, or any direct payment from parents/students.
                </li>
                <li>
                  <strong className="text-slate-900">Fee Discussion Routing:</strong> Any discussion related to fees, discounts, demo classes, or payment schedules must be routed strictly through the Tutvex team only.
                </li>
                <li>
                  <strong className="text-slate-900">Platform Usage:</strong> Tutors must strictly follow the schedule, subject, class format, and duration assigned by Tutvex. Tutors cannot independently alter fees or terms with parents/students.
                </li>
              </ul>
            </div>
          </section>


          {/* ================= SECTION 2: OPERATIONAL & NON-CIRCUMVENTION POLICIES ================= */}
          <section id="operational-policies" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-purple-600 text-white font-black text-sm">
                02
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Operational Guidelines, Confidentiality &amp; Non-Circumvention
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Rules regarding lead protection, student interaction, and post-assignment lock
                </p>
              </div>
            </div>

            {/* CRITICAL NON-CIRCUMVENTION CLAUSE */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-bold text-amber-900 text-base">
                <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
                Restriction on Direct Coaching &amp; Independent Dealings (Annexure A &amp; B)
              </div>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                Tutors are free to teach independently or be associated with any school or institute of their choice. However, Tutors are <strong>strictly prohibited from providing any direct coaching, tuition, or educational services (online or offline) to any parent or student introduced through Tutvex</strong>, except through Tutvex.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-amber-950 pt-2">
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" /> No private coaching to Tutvex parents/students
                </div>
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" /> No inviting students to personal batches
                </div>
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" /> No bypassing through friends or 3rd parties
                </div>
                <div className="p-3 bg-white/90 rounded-xl border border-amber-200 flex items-center gap-2">
                  <X className="h-4 w-4 text-red-500 shrink-0" /> 12-Month post-assignment restriction
                </div>
              </div>
            </div>

            {/* CORE POLICY CLAUSES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs text-slate-700">
              {/* Confidentiality */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Lock className="h-4 w-4 text-indigo-600" />
                  Data Protection &amp; Confidentiality
                </div>
                <p className="leading-relaxed text-slate-600">
                  Tutors shall not share, forward, sell, or misuse parent contact details, student info, or Tutvex internal records with any individual, coaching institute, or third-party organization. This obligation remains valid even after agreement termination.
                </p>
              </div>

              {/* Referral & Lead Disclosure */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-indigo-600" />
                  Immediate Lead Disclosure
                </div>
                <p className="leading-relaxed text-slate-600">
                  If a Tutor receives any inquiry, referral, or request from a Tutvex-associated parent or student, it must be immediately reported to Tutvex. Non-disclosure of referrals shall be treated as intentional misconduct.
                </p>
              </div>

              {/* Tutor Conduct */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  Professional Conduct &amp; Discipline
                </div>
                <p className="leading-relaxed text-slate-600">
                  Tutors must maintain professional language, discipline, punctuality, and commitment. Any form of misbehavior or unprofessional conduct may result in immediate disciplinary action.
                </p>
              </div>

              {/* 12-Month Restriction */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  12-Month Post-Assignment Lock
                </div>
                <p className="leading-relaxed text-slate-600">
                  Even after completion or termination of a Tutvex assignment, the Tutor shall not contact or teach the same parent/student independently for a minimum period of 12 months.
                </p>
              </div>
            </div>

            {/* CONSEQUENCES OF VIOLATION */}
            <div className="p-5 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <div className="font-bold text-red-900 text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                Consequences of Policy Violations:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs font-bold text-red-700">
                <div className="p-3 bg-white rounded-xl border border-red-200 text-center">
                  Permanent Removal from Platform
                </div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-center">
                  Forfeiture of 5% Security Deposit
                </div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-center">
                  Financial Penalty Up To ₹10,000
                </div>
                <div className="p-3 bg-white rounded-xl border border-red-200 text-center">
                  Legal Action As Required
                </div>
              </div>
            </div>
          </section>


          {/* ================= SECTION 3: TUTOR MEMBERSHIP PLANS & PRICING ================= */}
          <section id="membership-plans" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-8">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-amber-500 text-white font-black text-sm">
                03
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Tutor Membership Plans &amp; Credit Bundles
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Choose the plan that fits your tutoring goals and lead requirements
                </p>
              </div>
            </div>

            {/* PRICING CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* FREE */}
              <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg text-slate-900">Free</h3>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600">Current</span>
                  </div>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-slate-900">₹0</span>
                    <span className="text-xs text-slate-500 font-medium">/mo</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">0 lead credits</p>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-600">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400 shrink-0" /> Basic Tutor Profile</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400 shrink-0" /> Standard Lead Search</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-slate-400 shrink-0" /> 50% Revenue Share Model</li>
                  </ul>
                </div>
                <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs cursor-default">
                  Active Free Plan
                </button>
              </div>

              {/* STARTER */}
              <div className="bg-white rounded-3xl p-6 border-2 border-indigo-100 hover:border-indigo-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-indigo-900">Starter</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-indigo-950">₹299</span>
                    <span className="text-xs text-slate-500 font-medium">/mo</span>
                  </div>
                  <p className="text-xs font-bold text-indigo-600 mt-1">10 credits included</p>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> 30% 1st Month Share</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> Featured Profile</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> Direct Contact Access</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-600 shrink-0" /> Priority Matching</li>
                  </ul>
                </div>
                <Link
                  href="/tutor-flow/tutor-registration"
                  className="w-full block text-center py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
                >
                  Get Started
                </Link>
              </div>

              {/* PRO */}
              <div className="bg-gradient-to-b from-indigo-900 to-purple-950 text-white rounded-3xl p-6 border-2 border-purple-400 shadow-xl flex flex-col justify-between space-y-6 relative transform lg:-translate-y-2">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                  MOST POPULAR
                </span>
                <div>
                  <h3 className="font-bold text-lg text-white">Pro</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-white">₹699</span>
                    <span className="text-xs text-indigo-200 font-medium">/mo</span>
                  </div>
                  <p className="text-xs font-bold text-amber-300 mt-1">30 credits included</p>

                  <ul className="mt-6 space-y-2.5 text-xs text-indigo-100">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> 30% 1st Month Share</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> High-Rank Featured Profile</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> High Priority Matching</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-amber-400 shrink-0" /> Verified Gold Badge &amp; Support</li>
                  </ul>
                </div>
                <Link
                  href="/tutor-flow/tutor-registration"
                  className="w-full block text-center py-3 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg transition"
                >
                  Get Started
                </Link>
              </div>

              {/* PREMIUM */}
              <div className="bg-white rounded-3xl p-6 border-2 border-purple-200 hover:border-purple-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="font-bold text-lg text-purple-900">Premium</h3>
                  <div className="mt-4">
                    <span className="text-3xl font-black text-purple-950">₹1499</span>
                    <span className="text-xs text-slate-500 font-medium">/mo</span>
                  </div>
                  <p className="text-xs font-bold text-purple-600 mt-1">75 credits included</p>

                  <ul className="mt-6 space-y-2.5 text-xs text-slate-700">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-600 shrink-0" /> 30% 1st Month Share</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-600 shrink-0" /> VIP Featured Profile</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-600 shrink-0" /> Top Lead Priority</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-purple-600 shrink-0" /> Dedicated 24/7 Support</li>
                  </ul>
                </div>
                <Link
                  href="/tutor-flow/tutor-registration"
                  className="w-full block text-center py-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </section>


          {/* ================= SECTION 4: TUTOR BENEFITS ================= */}
          <section id="tutor-benefits" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-600 text-white font-black text-sm">
                04
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Tutvex Educator Benefits &amp; Growth Assurance
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  We protect your income and support your long-term teaching career
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  1. Payment Protection
                </div>
                <p className="text-slate-600 leading-relaxed">
                  If you complete one full month of tutoring and the parent defaults on payment, Tutvex will ensure your payment subject to verification, protecting you from non-paying parents.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-100 space-y-2">
                <div className="flex items-center gap-2 text-indigo-800 font-bold text-sm">
                  <Award className="h-5 w-5 text-indigo-600" />
                  2. Verified Experience Certificate
                </div>
                <p className="text-slate-600 leading-relaxed">
                  After receiving 3 genuine student reviews, tutors become eligible for an official Experience Certificate verified by Tutvex, building professional credibility.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <div className="flex items-center gap-2 text-purple-800 font-bold text-sm">
                  <Gift className="h-5 w-5 text-purple-600" />
                  3. Referral Cashback &amp; Growth
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Refer another qualified tutor to receive ₹100 cashback after onboarding, plus profile promotion and priority access to higher-paying tuitions.
                </p>
              </div>
            </div>
          </section>


          {/* ================= SECTION 5: DIGITAL CONSENT & SIGNATURE ================= */}
          <section id="digital-signature" className="bg-white rounded-3xl p-6 md:p-8 border-2 border-emerald-200 shadow-sm space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="p-3 rounded-2xl bg-emerald-500 text-slate-950 font-black text-sm">
                05
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">
                  Digital Consent &amp; Tutor Signature
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Record your voluntary acceptance of the Tutvex Tutor Agreement (Annexure A, B &amp; Pricing)
                </p>
              </div>
            </div>

            {signed ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-3">
                <CheckCircle2 className="h-12 w-12 text-emerald-600 mx-auto" />
                <h3 className="text-lg font-bold text-emerald-900">
                  Consent Recorded &amp; Signed Successfully!
                </h3>
                <div className="text-xs text-emerald-800 space-y-1">
                  <p><strong>Tutor Name:</strong> {tutorName}</p>
                  <p><strong>PAN Number:</strong> {panNo}</p>
                  <p><strong>Date:</strong> {signatureDate}</p>
                  <p><strong>Status:</strong> Legally Binding Tutvex Agreement Accepted</p>
                </div>
                <Link
                  href="/tutor-flow/tutor-registration"
                  className="inline-block mt-4 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition"
                >
                  Proceed to Tutor Registration →
                </Link>
              </div>
            ) : (
              <form onSubmit={handleDigitalSign} className="space-y-4 text-xs max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Full Name (Tutor) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={tutorName}
                      onChange={(e) => setTutorName(e.target.value)}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full p-3 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      S/o / D/o Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full p-3 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      PAN Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={panNo}
                      onChange={(e) => setPanNo(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full p-3 rounded-xl border border-slate-300 font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-800 block mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={signatureDate}
                      onChange={(e) => setSignatureDate(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 leading-relaxed text-slate-600">
                  By clicking &quot;Accept &amp; Digital Sign&quot;, I voluntarily agree to follow all Tutvex rules, policies, revenue sharing terms (30% 1st Month Subscription / 50% Non-Subscription), and guidelines (Annexure A &amp; B) and understand that my association with Tutvex is based on trust, transparency, and professional conduct.
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg transition"
                >
                  Accept &amp; Digital Sign Tutvex Agreement →
                </button>
              </form>
            )}
          </section>

        </div>
      </div>

      <Footer />
    </>
  );
}
