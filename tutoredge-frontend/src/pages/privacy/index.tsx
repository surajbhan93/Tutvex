"use client";

import React from "react";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import {
  ShieldCheck,
  Lock,
  Eye,
  Users,
  Mail,
  FileLock2,
} from "lucide-react";

export default function PrivacyPolicyPage() {
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
          <FileLock2 size={56} className="mx-auto mb-6 opacity-90" />

          <h1 className="text-4xl md:text-5xl font-extrabold">
            Privacy Policy
          </h1>

          <p className="mt-6 text-lg text-indigo-100 max-w-3xl mx-auto">
            Your trust matters. Learn how{" "}
            <strong>Tutvex (Tutvex)</strong> responsibly collects,
            uses, and safeguards your personal data.
          </p>

          <p className="mt-4 text-sm text-indigo-200">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </section>

        {/* ======================
            CONTENT
        ====================== */}
        <section className="max-w-5xl mx-auto px-6 py-32 space-y-16">

          <PolicyCard icon={<Eye />} title="1. Information We Collect">
            <ul className="list-disc pl-6 space-y-2">
              <li>Basic profile details (name, email, phone number)</li>
              <li>Student learning preferences and academic goals</li>
              <li>Tutor qualifications, subjects, and availability</li>
              <li>Platform usage data for analytics and improvements</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Users />} title="2. How We Use Your Information">
            <ul className="list-disc pl-6 space-y-2">
              <li>AI-based student–tutor matching</li>
              <li>Personalized learning recommendations</li>
              <li>Platform communication and notifications</li>
              <li>Security, fraud prevention, and monitoring</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Lock />} title="3. Data Protection & Security">
            <ul className="list-disc pl-6 space-y-2">
              <li>Encrypted storage and secure servers</li>
              <li>Restricted internal access</li>
              <li>Continuous security audits</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<ShieldCheck />} title="4. Tutors, Parents & Students">
            <ul className="list-disc pl-6 space-y-2">
              <li>Student data is never sold</li>
              <li>Parents have full control</li>
              <li>Tutor data used only for matching</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Eye />} title="5. Cookies & Analytics">
            <p>
              Cookies help us improve platform performance and usability.
            </p>
          </PolicyCard>

          <PolicyCard icon={<ShieldCheck />} title="6. Your Rights">
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your data</li>
              <li>Request correction or deletion</li>
              <li>Withdraw consent</li>
            </ul>
          </PolicyCard>

          <PolicyCard icon={<Mail />} title="7. Contact Us">
            <p className="font-semibold text-indigo-600">
              📧 privacy@tutevex.com
            </p>
          </PolicyCard>

          <div className="text-center text-sm text-gray-500 pt-12">
            By using Tutevex, you agree to this Privacy Policy.
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
      <h2 className="text-2xl font-bold">{title}</h2>
    </div>
    <div className="leading-relaxed text-gray-700">
      {children}
    </div>
  </div>
);
