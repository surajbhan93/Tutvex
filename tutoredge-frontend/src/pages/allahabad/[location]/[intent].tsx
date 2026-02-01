import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import {
  CheckCircle,
  BookOpen,
  Laptop,
  ShieldCheck,
  Wallet,
  PhoneCall,
} from "lucide-react";

import {
  ALLAHABAD_LOCATIONS,
  INTENTS,
  SUBJECTS,
} from "@/components/seo/seo.config";

import AllahabadSEO from "@/components/seo/AllahabadSEO";
import LocalSchema from "@/components/seo/LocalSchema";
import { ALLAHABAD_INTENT_CONTENT } from "@/components/seo/content/allahabadIntentContent";
import { ALLAHABAD_LOCATION_SNIPPETS } from "@/components/seo/content/allahabadLocationSnippets";

import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { motion } from "framer-motion";

interface PageProps {
  location: string;
  intent: string;
}

export default function AllahabadAutoPage({
  location,
  intent,
}: PageProps) {
  const title = `${intent} in ${location}, Allahabad | Verified Tutors`;
  const description = `Looking for ${intent} in ${location}, Allahabad? Hire verified and experienced tutors for all subjects and classes.`;

  // 🔥 CTA ROUTING LOGIC
  const intentLower = intent.toLowerCase();

  const isFindTutor =
    intentLower.includes("home tutor") ||
    intentLower.includes("home tuition") ||
    intentLower.includes("private tutor") ||
    intentLower.includes("tutor near");

  const isBecomeTutor =
    intentLower.includes("become tutor") ||
    intentLower.includes("tutor job") ||
    intentLower.includes("teaching job");

  const primaryCTA = isFindTutor
    ? {
        text: "Find a Tutor",
        href: "/find-tutor-flow/create-account/?source=MOBILE_NAV&campaign=FIND_TUTOR",
      }
    : isBecomeTutor
    ? {
        text: "Become a Tutor",
        href: "/tutor-flow/tutor-registration/?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR",
      }
    : {
        text: "View Tutors",
        href: "/tutors/",
      };

  return (
    <>
      {/* 🔥 GLOBAL + ALLAHABAD SEO */}
      <AllahabadSEO pageType="home" />

      {/* 🔥 PAGE-SPECIFIC SEO */}
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          rel="canonical"
          href={`http://localhost:3000/allahabad/${location
            .toLowerCase()
            .replace(/\s+/g, "-")}/${intent
            .toLowerCase()
            .replace(/\s+/g, "-")}`}
        />
      </Head>

      {/* 🔥 LOCAL SCHEMA */}
      <LocalSchema />

      {/* 🔥 NAVBAR */}
      <NavBar />

      {/* 🔥 PAGE CONTENT */}
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 overflow-hidden">

  {/* ================= HERO ================= */}
  <section className="relative bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-600 text-white overflow-hidden">
    {/* Soft background glow */}
    <div className="absolute inset-0">
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-white/10 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 -right-32 w-[450px] h-[450px] bg-white/10 rounded-full blur-[120px]" />
    </div>

    <div className="relative max-w-6xl mx-auto px-6 py-20">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold leading-tight"
      >
        {intent} in {location}, Allahabad
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-6 text-lg md:text-xl text-indigo-100 max-w-3xl"
      >
        Students and parents in {location}, Allahabad trust Tutvex to find
        verified tutors for CBSE, ICSE, UP Board and competitive exams.
        Learn at home or online with flexible timings.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-10 flex flex-wrap gap-5"
      >
        <Link
          href={primaryCTA.href}
          className="bg-white text-indigo-700 px-8 py-4 rounded-2xl font-semibold shadow-xl hover:scale-105 transition"
        >
          {primaryCTA.text}
        </Link>

        <Link
          href="/tutors/"
          className="bg-white/10 backdrop-blur border border-white/30 px-8 py-4 rounded-2xl font-semibold hover:bg-white hover:text-indigo-700 transition"
        >
          Browse Tutors
        </Link>
      </motion.div>
    </div>
  </section>

  {/* ================= CONTENT ================= */}
  <section className="max-w-6xl mx-auto px-6 py-20">
    <motion.p className="text-gray-700 text-lg leading-relaxed max-w-4xl">
  {ALLAHABAD_INTENT_CONTENT[intent.toLowerCase()]?.intro
    ?.replace("{location}", location)}
</motion.p>

{ALLAHABAD_LOCATION_SNIPPETS[location.toLowerCase()] && (
  <p className="mt-4 text-gray-600 max-w-4xl">
    {ALLAHABAD_LOCATION_SNIPPETS[location.toLowerCase()]}
  </p>
)}


    {/* ================= SUBJECTS ================= */}
    <h2 className="mt-14 text-3xl font-bold text-gray-900">
      Subjects Available
    </h2>

    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
      {SUBJECTS.slice(0, 15).map((subject, i) => (
        <motion.div
          key={subject}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          viewport={{ once: true }}
          className="bg-white/70 backdrop-blur border rounded-2xl px-4 py-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition"
        >
          <BookOpen className="mb-2 text-indigo-600" size={20} />
          <div className="font-medium text-gray-800">
            {subject} tutor in {location}
          </div>
        </motion.div>
      ))}
    </div>

    {ALLAHABAD_INTENT_CONTENT[intent.toLowerCase()]?.benefits && (
  <>
    <h2 className="mt-16 text-2xl font-bold text-gray-900">
      Benefits of choosing Tutvex
    </h2>

    
  </>
  
)}

{/*  */}

{/* ================= RELATED SEARCHES ================= */}
<h2 className="mt-20 text-2xl font-bold text-gray-900">
  Related Searches in Allahabad
</h2>

<div className="mt-8 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
  {ALLAHABAD_LOCATIONS.slice(0, 6).map((area) => (
    <Link
      key={area}
      href={`/allahabad/${area.toLowerCase().replace(/\s+/g, "-")}/${intent
        .toLowerCase()
        .replace(/\s+/g, "-")}`}
      className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition"
    >
      {intent} in {area}, Allahabad
    </Link>
  ))}
</div>

    {/* ================= WHY US ================= */}
    <h2 className="mt-20 text-3xl font-bold text-gray-900">
      Why Choose Tutvex?
    </h2>

    <div className="mt-10 grid md:grid-cols-2 gap-6">
      {[
        {
          icon: ShieldCheck,
          text: "Verified & background-checked tutors",
        },
        {
          icon: Laptop,
          text: "Home & online tuition options",
        },
        {
          icon: CheckCircle,
          text: `Tutors available near ${location}`,
        },
        {
          icon: Wallet,
          text: "Affordable & flexible fees",
        },
      ].map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.12 }}
          viewport={{ once: true }}
          className="flex items-center gap-5 bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition"
        >
          <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center">
            <item.icon className="text-green-600" size={26} />
          </div>
          <span className="text-gray-800 font-semibold">
            {item.text}
          </span>
        </motion.div>
      ))}
    </div>
  </section>

  {/* ================= FLOATING CTA ================= */}
  <motion.div
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 0.6, type: "spring", stiffness: 180 }}
    className="fixed bottom-6 right-6 z-50"
  >
    <Link
      href={primaryCTA.href}
      className="flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-7 py-4 rounded-full shadow-2xl hover:scale-105 transition"
    >
      <PhoneCall />
      Talk to a Tutor
    </Link>
  </motion.div>
</main>

      {/* 🔥 FOOTER */}
      <Footer />
    </>
  );
}

/* ======================================================
   🔥 AUTO-GENERATE ALLAHABAD SEO PAGES
   ====================================================== */

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { location: string; intent: string } }[] = [];

  ALLAHABAD_LOCATIONS.forEach((location) => {
    Object.values(INTENTS).forEach((intentGroup) => {
      intentGroup.forEach((intent) => {
        paths.push({
          params: {
            location: location.toLowerCase().replace(/\s+/g, "-"),
            intent: intent.toLowerCase().replace(/\s+/g, "-"),
          },
        });
      });
    });
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  return {
    props: {
      location: params?.location?.toString().replace(/-/g, " "),
      intent: params?.intent?.toString().replace(/-/g, " "),
    },
    revalidate: 86400, // daily
  };
};
