"use client";

import React from "react";
import Image from "next/image";
import {
  Gem,
  History,
  Target,
  MapPin,
  CheckCircle,
} from "lucide-react";

import InvestorSection from "./InvestorSection";
import PublicStudentCharts from "./PublicStudentCharts";
import { PageMode } from "./types";

/* ======================
   PAGE MODE
====================== */
const pageMode: PageMode =
  process.env.NEXT_PUBLIC_INVESTOR_MODE === "true"
    ? "investor"
    : "public";

export default function AboutUsPage() {
  return (
    <div className="relative min-h-screen overflow-hidden text-gray-800
      bg-[radial-gradient(circle_at_top_left,#4f46e580,transparent_40%),radial-gradient(circle_at_bottom_right,#9333ea80,transparent_40%),linear-gradient(to_br,#eef2ff,#ffffff,#f5f3ff)]
    ">

      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] bg-violet-500/30 rounded-full blur-[120px]" />
      </div>

      {/* ======================
         HERO / TUTORIAL BANNER
      ====================== */}
      <section className="py-28 text-center text-white
        bg-gradient-to-br from-indigo-700 via-violet-700 to-pink-700">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold">
            Learn the Tutvex (Tutvex) Way
          </h1>
          <p className="max-w-3xl mx-auto text-indigo-100 text-lg">
            A structured tutoring ecosystem powered by AI, expert educators,
            and measurable learning outcomes.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge text="📚 Structured Curriculum" />
            <Badge text="🧠 AI Learning Paths" />
            <Badge text="👨‍🏫 Verified Tutors" />
            <Badge text="🎯 Measurable Progress" />
          </div>
        </div>
      </section>

      {/* ======================
         INTRO
      ====================== */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-6">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Professional Home Tutors Across India
            </h2>

            <p className="text-lg">
              At <strong>Tutvex</strong>, we design personalized learning
              journeys that build confidence and consistency.
            </p>

            <p>
              One-to-one tutoring ensures every student learns at their own pace
              while parents track real progress transparently.
            </p>

            <p className="font-semibold text-gray-900">
              “Together, we move closer to excellence.”
            </p>
          </div>

          <div className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl bg-white/70 backdrop-blur-xl">
            <Image
              src="/images/about/collage-main.jpg"
              alt="Tutvex learning"
              fill
              className="object-cover"
            />

            <div className="absolute -bottom-6 -left-6 h-40 w-40 rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <Image src="/images/about/collage-1.png" alt="" fill />
            </div>

            <div className="absolute -top-6 -right-6 h-36 w-36 rounded-xl overflow-hidden shadow-lg border-4 border-white">
              <Image src="/images/about/collage-2.png" alt="" fill />
            </div>
          </div>
        </div>
      </section>

      {/* ======================
         VALUES
      ====================== */}
      <section className="py-28 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-6 grid lg:grid-cols-2 gap-16">

          <div className="space-y-6">
            <InfoCard
              icon={<History />}
              title="Our Journey"
              text="Started with one goal — make quality tutoring structured and measurable."
            />
            <InfoCard
              icon={<Target />}
              title="Mission & Vision"
              text="To become India’s most trusted personalized tutoring platform."
            />
            <InfoCard
              icon={<Gem />}
              title="Core Values"
              text="Integrity, patience, accountability, and growth."
            />
          </div>

          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[360px] bg-gray-50">
                <Image
                  src="/images/about/mission.png"
                  alt="Mission"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-10">
                <h3 className="text-3xl font-bold mb-4">
                  Guiding Students to Their Finish Line
                </h3>
                <p className="text-lg">
                  Every student follows a visible, stress-free growth path.
                </p>
                <div className="mt-6 h-1 w-16 bg-indigo-600 rounded-full" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================
         HOW IT WORKS
      ====================== */}
      <section className="mx-auto max-w-6xl px-6 py-28">
        <h2 className="text-center text-4xl font-extrabold mb-16
          bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          How Tutvex Works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          <ProcessCard step="01" title="Assess the Student" text="Learning level & goals" />
          <ProcessCard step="02" title="AI Tutor Matching" text="Best tutor alignment" />
          <ProcessCard step="03" title="Track Progress" text="Clear milestones & reports" />
        </div>
      </section>

      {pageMode === "public" && <PublicStudentCharts />}
      {pageMode === "investor" && <InvestorSection />}

      {/* ======================
         WHY US
      ====================== */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="text-center text-3xl font-bold mb-12">
          Why Choose Tutvex
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <Feature text="Verified Expert Tutors" />
          <Feature text="Personalized Learning" />
          <Feature text="Flexible Scheduling" />
          <Feature text="Stress-Free Progress" />
        </div>
      </section>

      {/* ======================
         PAN INDIA
      ====================== */}
      <section className="py-24 text-white text-center
        bg-gradient-to-r from-indigo-700 to-violet-700">
        <MapPin size={36} className="mx-auto mb-4" />
        <h2 className="text-3xl font-bold">Pan-India Tutor Network</h2>
        <p className="max-w-3xl mx-auto text-indigo-100 mt-2">
          Students & tutors connected across India.
        </p>
      </section>

      {/* ======================
         STATS
      ====================== */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="grid sm:grid-cols-3 gap-10 text-center">
          <Stat number="10,000+" label="Students Guided" />
          <Stat number="2,000+" label="Verified Tutors" />
          <Stat number="20+" label="Cities Covered" />
        </div>
      </section>
    </div>
  );
}

/* ======================
   COMPONENTS
====================== */

const InfoCard = ({ icon, title, text }: any) => (
  <div className="bg-white/80 p-6 rounded-2xl shadow-lg flex gap-4">
    <div className="text-indigo-600">{icon}</div>
    <div>
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm mt-1">{text}</p>
    </div>
  </div>
);

const Feature = ({ text }: { text: string }) => (
  <div className="bg-white/80 p-5 rounded-xl shadow flex gap-3">
    <CheckCircle className="text-indigo-600" />
    <span className="font-medium">{text}</span>
  </div>
);

const Stat = ({ number, label }: any) => (
  <div>
    <p className="text-4xl font-extrabold text-indigo-600">{number}</p>
    <p className="mt-2 font-medium">{label}</p>
  </div>
);

const Badge = ({ text }: { text: string }) => (
  <span className="px-6 py-3 bg-white/20 rounded-full backdrop-blur-md">
    {text}
  </span>
);

const ProcessCard = ({ step, title, text }: any) => (
  <div className="bg-white/80 p-8 rounded-2xl shadow-xl">
    <span className="text-indigo-600 font-bold">{step}</span>
    <h3 className="text-xl font-bold mt-2">{title}</h3>
    <p className="mt-2">{text}</p>
  </div>
);
