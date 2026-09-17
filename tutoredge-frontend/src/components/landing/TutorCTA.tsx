"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../ui/Button";

// ---------------- DATA ----------------
const bigImage = "/images/tutors/collage-main.jpg";

const floatingImages = [
  { src: "/images/tutors/collage-1.jpg", className: "top-6 left-6 delay-0" },
  { src: "/images/tutors/collage-2.jpg", className: "top-1/3 right-4 delay-200" },
  { src: "/images/tutors/collage-3.jpg", className: "bottom-6 left-12 delay-500" },
  { src: "/images/tutors/collage-4.jpg", className: "top-10 right-20 delay-700" },
];

// ---------------- COMPONENT ----------------
const TutorCTA = () => {
  const ctaVariants = [
    "Start Teaching & Earn Monthly",
    "Join 5,000+ Verified Tutors on Tutvex",
  ];

  const [ctaText, setCtaText] = useState(ctaVariants[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCtaText((prev) =>
        prev === ctaVariants[0] ? ctaVariants[1] : ctaVariants[0]
      );
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="become-a-tutor"
      className="relative overflow-hidden py-20"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-300/30 blur-3xl" />
      <div className="absolute bottom-0 -left-24 h-96 w-96 rounded-full bg-purple-300/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
          {/* LEFT CONTENT */}
          <div className="flex flex-col gap-6 text-center md:text-left">
            {/* SEO-Optimized Heading */}
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Become a <span className="text-primary">Home Tutor</span> with Tutvex
            </h2>

            {/* SEO Supporting Text */}
            <p className="mx-auto max-w-lg text-base text-gray-600 md:mx-0 sm:text-lg">
              Tutvex helps teachers, subject experts, and professionals find
              nearby home tutoring jobs. Teach students one-to-one, earn a
              stable monthly income, and grow your teaching career with
              verified students across India.
            </p>

            {/* Trust Signals */}
            <div className="mx-auto flex items-center justify-center gap-3 text-sm font-medium text-gray-700 md:mx-0">
              <span>✅ 5,000+ active tutors</span>
              <span className="text-gray-400">•</span>
              <span>🔒 Secure monthly payouts</span>
            </div>

            {/* CTA */}
            <Link
              href={{
                pathname: "/tutor-flow/tutor-registration/",
                query: {
                  role: "tutor",
                  source: "HOME_TUTOR_CTA",
                  campaign: "BECOME_TUTOR",
                },
              }}
              className="mx-auto w-fit md:mx-0"
            >
              <Button className="mt-3 rounded-xl px-8 py-3 text-base shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl">
                {ctaText}
              </Button>
            </Link>

            {/* Urgency */}
            <p className="text-xs text-gray-500">
              ⏳ Limited tutor onboarding slots available in your area
            </p>
          </div>

          {/* RIGHT IMAGE AREA */}
          <div className="relative mx-auto flex w-full max-w-sm items-center justify-center md:max-w-none">
            {/* Mobile Image */}
            <div className="relative z-10 h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-xl md:hidden">
              <Image
                src={bigImage}
                alt="Home tutor teaching a student"
                fill
                className="object-cover"
              />
            </div>

            {/* Desktop Collage */}
            <div className="relative hidden min-h-[360px] w-full md:block">
              {/* Main Image */}
              <div className="absolute left-1/2 top-1/2 z-20 h-56 w-56 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-white shadow-xl">
                <Image
                  src={bigImage}
                  alt="Verified home tutor on Tutvex"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating Images */}
              {floatingImages.map((img, i) => (
                <div
                  key={i}
                  className={`absolute h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg animate-float ${img.className}`}
                >
                  <Image
                    src={img.src}
                    alt="Tutvex tutor profile"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Animation */}
      <style jsx>{`
        @keyframes float {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-12px);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 7s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default TutorCTA;