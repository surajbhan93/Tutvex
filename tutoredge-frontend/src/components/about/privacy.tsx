"use client";

import React from "react";
import { ShieldCheck, Lock, Eye, Users, Mail } from "lucide-react";

export default function PrivacyPolicyPage() {
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
        <ShieldCheck size={48} className="mx-auto text-indigo-600 mb-6" />
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          Privacy Policy
        </h1>
        <p className="mt-6 text-lg text-gray-700 max-w-3xl mx-auto">
          At <strong>Tutvex (TutorEdge)</strong>, your privacy is not an
          afterthought — it is a core responsibility. This policy explains how
          we collect, use, and protect your personal information.
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
          icon={<Eye />}
          title="1. Information We Collect"
        >
          <ul className="list-disc pl-6 space-y-2">
            <li>Basic profile information (name, email, phone number)</li>
            <li>Student academic preferences and learning goals</li>
            <li>Tutor qualifications, subjects, and availability</li>
            <li>Usage data such as page visits and interactions</li>
          </ul>
        </PolicyCard>

        <PolicyCard
          icon={<Users />}
          title="2. How We Use Your Information"
        >
          <p>
            We use your information strictly to improve learning outcomes and
            platform experience, including:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Matching students with suitable tutors using AI systems</li>
            <li>Personalizing learning paths and recommendations</li>
            <li>Improving platform security and performance</li>
            <li>Communicating important updates and support messages</li>
          </ul>
        </PolicyCard>

        <PolicyCard
          icon={<Lock />}
          title="3. Data Protection & Security"
        >
          <p>
            We implement industry-standard technical and organizational
            safeguards to protect your data:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Secure servers and encrypted data storage</li>
            <li>Restricted internal access on a need-to-know basis</li>
            <li>Regular security audits and monitoring</li>
          </ul>
          <p className="mt-4">
            While no system is 100% secure, we continuously improve our defenses
            to minimize risks.
          </p>
        </PolicyCard>

        <PolicyCard
          icon={<Users />}
          title="4. Tutors, Parents & Students"
        >
          <p>
            Tutevex is designed to protect all stakeholders:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Student academic data is never sold or publicly shared</li>
            <li>Parents retain visibility and control over student profiles</li>
            <li>Tutor data is used only for matching and job opportunities</li>
          </ul>
        </PolicyCard>

        <PolicyCard
          icon={<Eye />}
          title="5. Cookies & Analytics"
        >
          <p>
            We use cookies and similar technologies to understand how users
            interact with our platform. This helps us improve usability and
            performance.
          </p>
          <p className="mt-3">
            You may control cookies through your browser settings.
          </p>
        </PolicyCard>

        <PolicyCard
          icon={<ShieldCheck />}
          title="6. Your Rights"
        >
          <p>
            Depending on your location, you may have rights under data protection
            laws (including GDPR):
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            <li>Access the personal data we hold about you</li>
            <li>Request correction or deletion of your data</li>
            <li>Withdraw consent where applicable</li>
          </ul>
        </PolicyCard>

        <PolicyCard
          icon={<Mail />}
          title="7. Contact Us"
        >
          <p>
            If you have any questions, concerns, or requests regarding privacy,
            please contact us:
          </p>
          <p className="mt-4 font-medium">
            📧 Email: <span className="text-indigo-600">privacy@tutevex.com</span>
          </p>
        </PolicyCard>

        {/* FOOTNOTE */}
        <div className="text-center text-sm text-gray-500 pt-12">
          By using Tutevex, you agree to this Privacy Policy.
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
