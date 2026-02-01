"use client";

import React from "react";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import {
  RefreshCcw,
  ShieldCheck,
  AlertCircle,
  Clock,
  Mail,
  RotateCcw,
} from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <>
      {/* NAVBAR */}
      <NavBar />

      <div
        className="
          relative min-h-screen overflow-hidden text-gray-800
          bg-[radial-gradient(circle_at_top_left,#6366f180,transparent_45%),radial-gradient(circle_at_bottom_right,#9333ea80,transparent_45%),linear-gradient(to_br,#eef2ff,#ffffff,#f5f3ff)]
        "
      >
        {/* BACKGROUND GLOWS */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-250px] left-[-250px] w-[600px] h-[600px] bg-indigo-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-250px] right-[-250px] w-[600px] h-[600px] bg-violet-500/30 rounded-full blur-[120px]" />
        </div>

        {/* ======================
            HERO / BANNER
        ====================== */}
        <section
          className="
            relative
            -mt-[72px]
            pt-[160px]
            pb-28
            text-center
            text-white
            bg-gradient-to-br from-indigo-700 via-violet-700 to-fuchsia-700
          "
        >
          <RotateCcw size={56} className="mx-auto mb-6 opacity-90" />

          <h1 className="text-4xl md:text-5xl font-extrabold">
            Refund & Cancellation Policy
          </h1>

          <p className="mt-6 text-lg text-indigo-100 max-w-3xl mx-auto">
            At <strong>Tutevex (Tutvex)</strong>, we follow fair,
            transparent, and student-first refund and cancellation practices.
          </p>

          <p className="mt-4 text-sm text-indigo-200">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        {/* ======================
            CONTENT
        ====================== */}
        <section className="max-w-5xl mx-auto px-6 py-32 space-y-16">

          <PolicyCard icon={<Clock />} title="1. Trial & Initial Sessions">
            <ul className="list-disc pl-6 space-y-2">
              <li>Trial or demo sessions (if offered) are non-refundable</li>
              <li>
                Once regular tutoring sessions begin, refunds follow the terms
                below
              </li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<AlertCircle />} title="2. Refund Eligibility">
            <ul className="list-disc pl-6 space-y-2">
              <li>Tutor unavailability without replacement</li>
              <li>Operational or technical issues from our side</li>
              <li>Service not delivered as agreed</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Refunds are not applicable after multiple successful sessions.
            </p>
          </PolicyCard>

          <PolicyCard icon={<ShieldCheck />} title="3. Cancellation Policy">
            <ul className="list-disc pl-6 space-y-2">
              <li>Advance notice required for cancellations</li>
              <li>Completed sessions are non-refundable</li>
              <li>Late cancellations may not be eligible</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<RefreshCcw />} title="4. Refund Processing">
            <ul className="list-disc pl-6 space-y-2">
              <li>7–10 business days for online payments</li>
              <li>Processed via original payment method</li>
            </ul>
            <p className="mt-4 text-sm text-gray-600">
              Timelines depend on banks and payment gateways.
            </p>
          </PolicyCard>

          <PolicyCard icon={<Mail />} title="5. Requesting a Refund">
            <p>
              To request a refund or cancellation, contact:
            </p>
            <p className="mt-4 font-semibold text-indigo-600">
              📧 support@tutevex.com
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Include registered email, student name, and reason.
            </p>
          </PolicyCard>

          <div className="text-center text-sm text-gray-500 pt-12">
            By enrolling with Tutevex, you agree to this Refund & Cancellation
            Policy.
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

/* ======================
   POLICY CARD
====================== */

const PolicyCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-3xl shadow-xl p-10 space-y-4">
    <div className="flex items-center gap-3">
      <div className="text-indigo-600">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-900">
        {title}
      </h2>
    </div>
    <div className="text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);
