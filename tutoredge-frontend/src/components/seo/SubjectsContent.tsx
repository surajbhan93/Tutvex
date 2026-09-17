"use client";

import React from "react";
import Head from "next/head";
import { motion, Variants } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  Star,
  ShieldCheck,
  Search,
  ArrowRight,
} from "lucide-react";
import { Card, Badge, Alert, Button } from "flowbite-react";

/* ======================
   FAQ DATA
====================== */
const FAQS = [
  {
    question: "Do you provide tutors for all school subjects?",
    answer:
      "Yes, Tutvex offers tutors for Maths, Science, Commerce, Languages, and Computer subjects.",
  },
  {
    question: "Are tutors available for CBSE, ICSE, and State Boards?",
    answer:
      "Yes, we provide tutors for CBSE, ICSE, and multiple State Boards.",
  },
  {
    question: "Is teaching available in English medium?",
    answer:
      "Yes, all tutors on Tutvex teach in English medium.",
  },
  {
    question: "Can I choose tutors subject-wise?",
    answer:
      "Absolutely. Tutvex allows parents and students to select tutors based on specific subjects.",
  },
];

/* ======================
   FAQ SCHEMA
====================== */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

/* ======================
   ANIMATION (TYPED)
====================== */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

/* ======================
   COMPONENT
====================== */
export default function SubjectsContent() {
  return (
    <>
      {/* SEO FAQ JSON-LD */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      </Head>

      <section className="relative mt-20 space-y-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-white to-white" />

        {/* INTRO */}
        <motion.header
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center space-y-6"
        >
          <Badge color="indigo" size="lg">
            Trusted School Tutors Platform
          </Badge>

          <h1 className="text-4xl font-extrabold text-gray-900">
            Best Subject Tutors for CBSE, ICSE & State Board Students
          </h1>

          <p className="text-lg text-gray-600">
            Tutvex helps parents and students find verified,
            English-medium subject tutors for Classes 6 to 12.
          </p>

          <Button color="indigo">
            Find Tutors <ArrowRight className="ml-2" size={16} />
          </Button>
        </motion.header>

        {/* TRUST STRIP */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {(
            [
              ["Verified Tutors", ShieldCheck],
              ["Board Experts", GraduationCap],
              ["Subject Specialists", BookOpen],
              ["Top Rated", Star],
            ] as [string, React.ElementType][]
          ).map(([text, Icon], i) => (
            <Card key={i} className="text-center">
              <Icon className="mx-auto mb-3 text-indigo-600" size={28} />
              <p className="font-semibold">{text}</p>
            </Card>
          ))}
        </motion.section>

        {/* SEARCH INTENT */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Alert color="info" icon={Search}>
            Popular searches include{" "}
            <strong>
              Maths tutor for CBSE, Physics tutor for Class 12,
              English medium school tutor
            </strong>
            .
          </Alert>
        </motion.section>

        {/* FAQ */}
        <motion.section
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          {FAQS.map((faq) => (
            <Card key={faq.question}>
              <p className="font-semibold">{faq.question}</p>
              <p className="text-gray-600 mt-1">{faq.answer}</p>
            </Card>
          ))}
        </motion.section>

        {/* FINAL CTA */}
        <motion.footer
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl font-extrabold text-gray-900">
            Start Learning with the Right Tutor Today
          </h2>

          <Button
            size="xl"
            className="
              bg-gradient-to-r from-indigo-600 to-purple-600
              hover:from-indigo-700 hover:to-purple-700
              text-white font-semibold
              px-8 py-3
              rounded-xl
              shadow-lg hover:shadow-xl
            "
          >
            Find Your Tutor Now
          </Button>
        </motion.footer>
      </section>
    </>
  );
}
