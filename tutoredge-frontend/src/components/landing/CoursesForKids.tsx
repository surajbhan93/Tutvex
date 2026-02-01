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
    description: "Unlock the Joy of Learning!",
    icon: BookText,
    colors: {
      bg: "bg-gradient-to-tr from-rose-50 to-rose-100",
      text: "text-rose-600",
      iconBg: "bg-rose-200",
    },
    justify: "md:justify-self-end",
    slug: "primary-section",
  },
  {
    id: 2,
    title: "Junior Section",
    classRange: "Class 6 - 8",
    description: "Build strong Academic Foundation!",
    icon: Languages,
    colors: {
      bg: "bg-gradient-to-tr from-yellow-50 to-yellow-100",
      text: "text-yellow-600",
      iconBg: "bg-yellow-200",
    },
    justify: "md:justify-self-start",
    slug: "junior-section",
  },
  {
    id: 3,
    title: "Computer Learning",
    classRange: "Class 1 to 8",
    description: "Learn computer in fun and Easy Way!",
    icon: Calculator,
    colors: {
      bg: "bg-gradient-to-tr from-blue-50 to-blue-100",
      text: "text-blue-600",
      iconBg: "bg-blue-200",
    },
    justify: "md:justify-self-end",
    slug: "computer-learning",
  },
  {
    id: 4,
    title: "Spoken English & Communication Skills",
    classRange: "Class 1 - 8",
    description: "Speak Confidently and Express Freely!",
    icon: Code2,
    colors: {
      bg: "bg-gradient-to-tr from-purple-50 to-purple-100",
      text: "text-purple-600",
      iconBg: "bg-purple-200",
    },
    justify: "md:justify-self-start",
    slug: "spoken-english",
  },
];

const CoursesForKids = () => {
  return (
    <div
      id="kids-courses"
      className="relative mx-auto max-w-6xl overflow-hidden bg-gradient-to-b from-white to-pink-50 p-6 py-16"
    >
      <h2 className="mb-12 text-center text-3xl font-bold text-gray-800 lg:text-left">
        Courses for <span className="text-primary">Kids</span>
      </h2>

      {/* Decorative shapes */}
      <div className="absolute left-10 top-10 size-24 animate-pulse rounded-full bg-pink-200 opacity-30" />
      <div className="absolute bottom-20 right-20 size-32 animate-pulse rounded-full bg-yellow-200 opacity-25" />

      <div className="relative">
        {/* Center image */}
        <div className="hidden lg:absolute lg:left-1/2 lg:top-1/2 lg:z-10 lg:block lg:-translate-x-1/2 lg:-translate-y-1/2">
          <div className="relative size-80 overflow-hidden rounded-full border-8 border-white shadow-2xl">
            <div className="absolute inset-0 -m-4 scale-110 animate-pulse rounded-full bg-pink-100/50" />
            <Image
              src="/images/kids-courses-center.png"
              alt="A happy child learning"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>

        <div className="relative z-20 grid grid-cols-1 gap-x-36 gap-y-16 md:grid-cols-2">
          {kidsCourses.map((course, index) => {
            const Icon = course.icon;

            return (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className={`w-full max-w-sm rounded-3xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${course.colors.bg} ${course.justify}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`mt-1 shrink-0 rounded-lg p-3 ${course.colors.iconBg} flex items-center justify-center`}
                  >
                    <Icon className={`size-8 ${course.colors.text}`} />
                  </div>

                  <div className="flex flex-col items-start">
                    <p className={`text-sm font-bold ${course.colors.text}`}>
                      {course.classRange}
                    </p>

                    <h3 className="my-1 text-xl font-bold text-gray-900">
                      {course.title}
                    </h3>

                    <p className="text-gray-700">{course.description}</p>

                    {/* 🔥 LONG & TRACKABLE LINK */}
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
                      className="inline-flex w-fit"
                    >
                      <Button
                        variant="dark"
                        className="mt-4 transition-transform duration-300 hover:scale-105"
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
  );
};

export default CoursesForKids;
