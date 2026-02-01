import Head from "next/head";

import HeroSection from "@/components/how-it-works/HeroSection";
import HowItWorksToggle from "@/components/how-it-works/HowItWorksToggle";
import WhyTutvex from "@/components/how-it-works/WhyTutorEdge";
import FAQ from "@/components/how-it-works/FAQ";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
export default function HowItWorksPage() {
  return (
    <>
    <NavBar />
      {/* ======================
          SEO
      ====================== */}
      <Head>
        <title>How Tutvex Works | For Parents & Tutors</title>
        <meta
          name="description"
          content="Learn how Tutvex works for parents and tutors. Find verified tutors, book classes, or start teaching with a simple and trusted process."
        />
      </Head>

      {/* ======================
          PAGE WRAPPER
      ====================== */}
      <div className="relative bg-gradient-to-b from-indigo-50 via-white to-white">
        
        {/* Decorative blur */}
        <div className="absolute -top-32 -left-32 h-96 w-96 bg-indigo-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />

        {/* ======================
            CONTENT
        ====================== */}
        <div className="relative max-w-7xl mx-auto px-4 py-16 space-y-24">

          {/* HERO */}
          <HeroSection />

          {/* HOW IT WORKS */}
          <section className="bg-white rounded-3xl shadow-sm px-6 py-16">
            <HowItWorksToggle />
          </section>

          {/* WHY Tutvex */}
          <WhyTutvex />

          {/* DIVIDER */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {/* FAQ */}
          <FAQ />

          {/* ======================
              FINAL CTA
          ====================== */}
          <section className="text-center bg-indigo-600 text-white rounded-3xl px-6 py-16">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Ready to Get Started with Tutvex?
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-indigo-100">
              Whether you’re a parent searching for a reliable tutor
              or a teacher looking to grow your career — Tutvex
              is built for you.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="/find-tutor-flow"
                className="
                  inline-flex justify-center items-center
                  rounded-xl bg-white text-indigo-600
                  px-6 py-3 font-semibold
                  hover:bg-indigo-50 transition
                "
              >
                Find a Tutor
              </a>

              <a
                href="/tutor-flow/tutor-registration"
                className="
                  inline-flex justify-center items-center
                  rounded-xl border border-white
                  px-6 py-3 font-semibold
                  hover:bg-white hover:text-indigo-600 transition
                "
              >
                Become a Tutor
              </a>
            </div>
          </section>
        </div>
      </div>
      <Footer />s
    </>
  );
}
