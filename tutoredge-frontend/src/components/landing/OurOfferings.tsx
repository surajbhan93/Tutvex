import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";

const offeringsData = [
  {
    title: "Class 9th",
    description:
      "Strong fundamentals with concept-based learning, revision tests, and personalised doubt support.",
    imageUrl: "/images/offerings/class-09.jpg",
  },
  {
    title: "Class 10th",
    description:
      "Board-oriented preparation with NCERT mastery, numericals practice, and exam-focused strategy.",
    imageUrl: "/images/offerings/class-010.jpg",
  },
  {
    title: "Class 11th",
    description:
      "Advanced foundation for JEE/NEET & Boards with topic-wise tests and in-depth conceptual clarity.",
    imageUrl: "/images/offerings/class-011.jpg",
  },
  {
    title: "Class 12th",
    description:
      "Complete syllabus coverage, PYQs, revision marathons, and full-length mock tests.",
    imageUrl: "/images/offerings/class-012.jpg",
  },
  {
    title: "Competitive Exams",
    description:
      "Expert-led preparation for JEE, NEET, NDA, CUET, and other competitive exams.",
    imageUrl: "/images/offerings/jee-neet0.jpg",
  },
  {
    title: "Coding Classes",
    description:
      "Beginner to advanced coding – Python, C++, Web Dev, DSA, and project-based learning.",
    imageUrl: "/images/offerings/coding.jpg",
  },
  {
    title: "Skill Development",
    description:
      "Personality development, communication mastery, public speaking, and writing skills.",
    imageUrl: "/images/offerings/skills0.jpg",
  },
  {
    title: "Language Learning",
    description:
      "English, Hindi, and foreign languages taught through interactive speaking-focused sessions.",
    imageUrl: "/images/offerings/language0.jpg",
  },
];

const OurOfferings = () => {
  return (
    <div className="relative mx-auto max-w-7xl rounded-3xl bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center text-4xl font-extrabold text-gray-800"
      >
        Explore Our <span className="text-primary">Offerings</span>
      </motion.h2>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {offeringsData.map((offering, index) => (
          <motion.div
            key={offering.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -4 }}
            className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition duration-300 hover:shadow-2xl"
          >
            {/* Image */}
            <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl">
              <Image
                src={offering.imageUrl}
                alt={offering.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary">
                {offering.title}
              </h3>

              <p className="mb-4 text-sm leading-relaxed text-gray-600">
                {offering.description}
              </p>

              {/* 🔥 SUBJECT LINK */}
              <Link
                href={{
                  pathname: "/subjects",
                  query: {
                    subject: offering.title,
                    source: "OFFERINGS_CARD",
                    fromPage: "/",
                  },
                }}
                className="inline-block"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-dark"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OurOfferings;
