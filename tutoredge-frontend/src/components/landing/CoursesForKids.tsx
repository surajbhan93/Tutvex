"use client";

import { motion } from "framer-motion";
import { BookText, Calculator, Code2, Languages } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Button from "../ui/Button";

const kidsCourses = [
  {
    id: 1,
    title: "Primary Section",
    classRange: "Class 1 - 5",
    description: "Unlock the joy of learning with fun & clarity.",
    icon: BookText,
    colors: {
      bg: "bg-gradient-to-br from-rose-50 to-rose-100",
      text: "text-rose-600",
      iconBg: "bg-rose-200",
    },
    slug: "primary-section",
  },
  {
    id: 2,
    title: "Junior Section",
    classRange: "Class 6 - 8",
    description: "Build a strong academic foundation early.",
    icon: Languages,
    colors: {
      bg: "bg-gradient-to-br from-yellow-50 to-yellow-100",
      text: "text-yellow-600",
      iconBg: "bg-yellow-200",
    },
    slug: "junior-section",
  },
  {
    id: 3,
    title: "Computer Learning",
    classRange: "Class 1 - 8",
    description: "Learn computers in a fun & easy way.",
    icon: Calculator,
    colors: {
      bg: "bg-gradient-to-br from-blue-50 to-blue-100",
      text: "text-blue-600",
      iconBg: "bg-blue-200",
    },
    slug: "computer-learning",
  },
  {
    id: 4,
    title: "Spoken English & Communication",
    classRange: "Class 1 - 8",
    description: "Speak confidently and express freely.",
    icon: Code2,
    colors: {
      bg: "bg-gradient-to-br from-purple-50 to-purple-100",
      text: "text-purple-600",
      iconBg: "bg-purple-200",
    },
    slug: "spoken-english",
  },
];

const CoursesForKids = () => {
  return (
    <section
      id="kids-courses"
      className="relative overflow-hidden bg-gradient-to-b from-white via-pink-50 to-white py-20"
    >
      {/* Decorative blobs */}
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />
      <div className="absolute bottom-0 -right-20 h-80 w-80 rounded-full bg-yellow-200/40 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4">
        {/* Heading */}
        <h2 className="mb-14 text-center text-3xl font-extrabold text-gray-900 sm:text-4xl lg:text-left">
          Courses for <span className="text-primary">Kids</span>
        </h2>

        <div className="relative">
          {/* Center Image (Desktop only) */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 lg:block">
            <div className="relative h-72 w-72 overflow-hidden rounded-full border-8 border-white shadow-2xl">
              <Image
                src="/images/kids-courses-center.png"
                alt="Happy child learning"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Cards */}
          <div className="relative z-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-y-16">
            {kidsCourses.map((course, index) => {
              const Icon = course.icon;

              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.15 }}
                  className={`mx-auto w-full max-w-md rounded-3xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${course.colors.bg}`}
                >
                  <div className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-xl ${course.colors.iconBg}`}
                    >
                      <Icon className={`h-7 w-7 ${course.colors.text}`} />
                    </div>

                    <div className="flex flex-col">
                      <span
                        className={`text-sm font-semibold ${course.colors.text}`}
                      >
                        {course.classRange}
                      </span>

                      <h3 className="mt-1 text-lg font-bold text-gray-900 sm:text-xl">
                        {course.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-700 sm:text-base">
                        {course.description}
                      </p>

                      <Link
                        href={{
                          pathname: `/kid-courses/${course.slug}`,
                          query: {
                            section: course.title,
                            classRange: course.classRange,
                            source: "KIDS_COURSE_CARD",
                            fromPage: "/",
                            campaign: "KIDS_LEARNING",
                            medium: "website",
                          },
                        }}
                        className="mt-4 w-fit"
                      >
                        <Button
                          variant="dark"
                          className="px-6 py-2 transition hover:scale-105"
                        >
                          Explore
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoursesForKids;
