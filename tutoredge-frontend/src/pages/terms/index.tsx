"use client";

import React from "react";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import {
  FileText,
  ShieldCheck,
  AlertTriangle,
  Users,
  Clock,
  Mail,
  Scale,
} from "lucide-react";

export default function TermsConditionsPage() {
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
          <FileText size={56} className="mx-auto mb-6 opacity-90" />

          <h1 className="text-4xl md:text-5xl font-extrabold">
            Terms & Conditions
          </h1>

          <p className="mt-6 text-lg text-indigo-100 max-w-3xl mx-auto">
            These Terms govern your access to and use of{" "}
            <strong>Tutevex (Tutvex)</strong>. Please read them carefully
            before using our services.
          </p>

          <p className="mt-4 text-sm text-indigo-200">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        {/* ======================
            CONTENT
        ====================== */}
        <section className="max-w-5xl mx-auto px-6 py-32 space-y-16">

          <PolicyCard icon={<Users />} title="1. Acceptance of Terms">
            <p>
              By accessing or using Tutevex, you agree to be bound by these
              Terms and all applicable laws and regulations. If you do not
              agree, you must discontinue use of the platform.
            </p>
          </PolicyCard>

          <PolicyCard icon={<ShieldCheck />} title="2. Services Offered">
            <ul className="list-disc pl-6 space-y-2">
              <li>One-to-one and group tutoring services</li>
              <li>AI-assisted tutor matching</li>
              <li>Academic progress tracking tools</li>
              <li>Educational content and materials</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<AlertTriangle />} title="3. User Responsibilities">
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide accurate and up-to-date information</li>
              <li>Use the platform lawfully and respectfully</li>
              <li>Do not misuse content, systems, or tutor services</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Scale />} title="4. Payments, Fees & Refunds">
            <p>
              All payments are subject to our pricing structure and{" "}
              <strong>Refund & Cancellation Policy</strong>.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Fees for completed sessions are non-refundable unless stated
              otherwise.
            </p>
          </PolicyCard>

          <PolicyCard icon={<Clock />} title="5. Scheduling & Cancellations">
            <ul className="list-disc pl-6 space-y-2">
              <li>Sessions must be scheduled in advance</li>
              <li>Late cancellations may not be eligible</li>
              <li>Tutevex may reschedule sessions when necessary</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<ShieldCheck />} title="6. Intellectual Property">
            <p>
              All platform content, branding, and materials are the intellectual
              property of Tutevex and may not be copied, reproduced, or
              distributed without permission.
            </p>
          </PolicyCard>

          <PolicyCard icon={<AlertTriangle />} title="7. Limitation of Liability">
            <p>
              Tutevex is not liable for indirect, incidental, or consequential
              damages arising from use of the platform or tutoring services.
            </p>
          </PolicyCard>

          <PolicyCard icon={<Mail />} title="8. Contact Information">
            <p>
              For questions regarding these Terms, please contact:
            </p>
            <p className="mt-4 font-semibold text-indigo-600">
              📧 support@tutevex.com
            </p>
          </PolicyCard>

          <div className="text-center text-sm text-gray-500 pt-12">
            By using Tutevex, you acknowledge that you have read, understood,
            and agree to these Terms & Conditions.
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
