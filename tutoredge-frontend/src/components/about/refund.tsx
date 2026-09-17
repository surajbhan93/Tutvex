"use client";

import React from "react";
import {
  RefreshCcw,
  ShieldCheck,
  AlertCircle,
  Clock,
  Mail,
} from "lucide-react";

export default function RefundPolicyPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 text-gray-700 overflow-hidden">

      {/* BACKGROUND GLOWS */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-200px] left-[-200px] w-[500px] h-[500px] bg-indigo-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] w-[500px] h-[500px] bg-violet-300/30 rounded-full blur-3xl" />
      </div>

      {/* ======================
         HERO
      ====================== */}
      <section className="max-w-5xl mx-auto px-6 py-28 text-center">
        <RefreshCcw size={48} className="mx-auto text-indigo-600 mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Refund & Cancellation Policy
        </h1>
        <p className="mt-6 text-lg max-w-3xl mx-auto">
          At <strong>Tutvex (Tutvex)</strong>, we aim to keep our refund and
          cancellation process fair, transparent, and simple for parents,
          students, and tutors.
        </p>
        <p className="mt-4 text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </p>
      </section>

      {/* ======================
         CONTENT
      ====================== */}
      <section className="max-w-5xl mx-auto px-6 pb-32 space-y-16">

        <PolicyCard
          icon={<Clock />}
          title="1. Trial & Initial Sessions"
        >
          <p>
            Refund eligibility depends on the stage of service usage:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>
              Trial or demo sessions (if offered) are non-refundable.
            </li>
            <li>
              Once regular tutoring sessions begin, refunds are governed by the
              conditions below.
            </li>
          </ul>
        </PolicyCard>

        <PolicyCard
          icon={<AlertCircle />}
          title="2. Refund Eligibility"
        >
          <p>
            Refund requests may be considered under the following conditions:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>Tutor unavailability without a suitable replacement</li>
            <li>Technical or operational issues from our side</li>
            <li>Service not delivered as agreed</li>
          </ul>
          <p className="mt-4">
            Refunds are not applicable once multiple sessions have been
            successfully completed.
          </p>
        </PolicyCard>

        <PolicyCard
          icon={<ShieldCheck />}
          title="3. Cancellation Policy"
        >
          <ul className="list-disc pl-6 space-y-2">
            <li>
              Parents may cancel future sessions with prior notice.
            </li>
            <li>
              Fees for already completed sessions are non-refundable.
            </li>
            <li>
              Last-minute cancellations may not be eligible for refunds.
            </li>
          </ul>
        </PolicyCard>

        <PolicyCard
          icon={<RefreshCcw />}
          title="4. Refund Processing Timeline"
        >
          <p>
            Approved refunds are processed within:
          </p>
          <ul className="list-disc pl-6 mt-4 space-y-2">
            <li>7–10 business days for online payments</li>
            <li>Original payment method whenever possible</li>
          </ul>
          <p className="mt-4">
            Processing time may vary depending on banks or payment gateways.
          </p>
        </PolicyCard>

        <PolicyCard
          icon={<Mail />}
          title="5. How to Request a Refund"
        >
          <p>
            To request a refund or cancellation, please contact our support team:
          </p>
          <p className="mt-4 font-medium">
            📧 Email:{" "}
            <span className="text-indigo-600">
              support@tutevex.com
            </span>
          </p>
          <p className="mt-2">
            Include your registered email, student name, and reason for request
            for faster resolution.
          </p>
        </PolicyCard>

        {/* FOOTNOTE */}
        <div className="text-center text-sm text-gray-500 pt-12">
          By enrolling with Tutevex, you acknowledge and agree to this Refund &
          Cancellation Policy.
        </div>

      </section>
    </div>
  );
}

/* ======================
   REUSABLE POLICY CARD
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
