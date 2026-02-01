import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import Button from "../ui/Button";

// --- Data ---
const mathsCourses = [
  { title: "Abacus", imageUrl: "/images/abacusImage.png" },
  { title: "Vedic Maths", imageUrl: "/images/VedicMathsImage.png" },
];

const tutoringCards = [
  {
    title: "CBSE",
    description: "Personalised tutoring for CBSE curriculum.",
    imageUrl: "/images/cbseImage.png",
  },
  {
    title: "ICSE",
    description: "Personalised tutoring for ICSE curriculum.",
    imageUrl: "/images/icseImage.png",
  },
  {
    title: "JEE",
    description: "Personalised tutoring for JEE preparation.",
    imageUrl: "/images/jeeImage.png",
  },
  {
    title: "Coding",
    description: "Personalised coding lessons for all levels.",
    imageUrl: "/images/codingImage.png",
  },
];

// --- Component ---
const CourseHighlights = () => {
  return (
    <div className="mx-auto max-w-6xl p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900"
      >
        Course <span className="text-primary">Highlights</span>
      </motion.h1>

      <div className="relative">
        {/* Banner */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-teal-500 to-green-500 p-12 pb-24 text-white shadow-2xl"
        >
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="z-10">
              <h2 className="mb-2 text-4xl font-bold drop-shadow-lg">
                Explore our
              </h2>
              <h2 className="mb-6 text-4xl font-bold drop-shadow-lg">
                Maths courses
              </h2>

              <Link
                href={{
                  pathname: "/tutor-flow/tutor-registration",
                  query: {
                    catName: "Class I-V Tuition",
                    locName: "null",
                    fromPage: "/",
                    source: "NEW_REFERRAL",
                  },
                }}
                className="inline-flex w-fit"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button variant="dark">Join Now</Button>
                </motion.button>
              </Link>
            </div>

            <div className="flex gap-6">
              {mathsCourses.map((course, index) => (
                <motion.div
                  key={course.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="rounded-2xl bg-white p-6 text-center shadow-xl transition-all duration-300 hover:shadow-2xl"
                >
                  <h3 className="mb-4 text-xl font-semibold text-gray-800">
                    {course.title}
                  </h3>
                  <div className="relative h-24 w-40 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Tutoring Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto -mt-20 w-11/12 rounded-3xl bg-white p-10 shadow-2xl"
        >
          <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <h2 className="text-3xl font-semibold text-gray-900">
              Personalized{" "}
              <span className="font-bold text-primary">One-to-One</span>{" "}
              Tutoring
            </h2>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative h-32 w-48"
            >
              <Image
                src="/images/courseHighlightIllustration.png"
                alt="Tutoring"
                fill
                style={{ objectFit: "contain" }}
              />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {tutoringCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.05 }}
                className="overflow-hidden rounded-2xl bg-gray-50 p-5 shadow-lg transition-all duration-300 hover:shadow-2xl"
              >
                <div className="relative mx-auto h-44 w-full overflow-hidden rounded-lg">
                  <Image
                    src={card.imageUrl}
                    alt={card.title}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>

                <div className="pt-4 text-center">
                  <h3 className="mb-2 text-xl font-bold text-gray-800">
                    {card.title}
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {card.description}
                  </p>

                  {/* 🔥 SUBJECT LINK BUTTON */}
                  <Link
                    href={{
                      pathname: "/subjects",
                      query: {
                        subject: card.title,
                        source: "HOME_CARD",
                        fromPage: "/",
                      },
                    }}
                    className="block w-full"
                  >
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <Button className="w-full">
                        Find Personal Tutor
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CourseHighlights;
