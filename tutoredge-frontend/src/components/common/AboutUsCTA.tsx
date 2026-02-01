import Link from "next/link";
import { motion } from "framer-motion";

const AboutUsCTA = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl
                 bg-gradient-to-br from-indigo-100 via-blue-100 to-violet-100
                 p-6 md:p-10 shadow-xl"
    >
      {/* 🌈 Animated gradient overlay */}
      <motion.div
        animate={{ x: ["0%", "20%", "0%"], y: ["0%", "-10%", "0%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0
                   bg-gradient-to-br from-indigo-200/40 via-blue-200/40 to-violet-200/40"
      />

      {/* 🫧 Floating blur orbs */}
      <motion.div
        animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-300/30 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0], x: [0, -10, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-16 -left-16 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl"
      />

      {/* 🧊 CONTENT */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Text */}
        <div className="text-center md:text-left">
          <h3
            className="text-xl md:text-3xl font-extrabold mb-2
                       bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600
                       bg-clip-text text-transparent"
          >
            Curious about Tutvex?
          </h3>

          <p className="text-sm md:text-base text-gray-700 max-w-md">
            Discover how Tutvex is reshaping personalized education by connecting
            students with trusted, verified tutors across India.
          </p>
        </div>

        {/* 🚀 CTA BUTTON */}
        <Link href="/about" className="group relative">
          <span
            className="absolute inset-0 rounded-xl blur-lg
                       bg-gradient-to-r from-indigo-600 to-blue-600
                       opacity-60 group-hover:opacity-90 transition"
          />
          <span
            className="relative inline-flex items-center gap-2
                       px-7 py-3 rounded-xl font-semibold
                       bg-gradient-to-r from-indigo-600 to-blue-600
                       text-white shadow-lg
                       group-hover:scale-105 transition"
          >
            About Us
            <span className="group-hover:translate-x-1 transition">→</span>
          </span>
        </Link>
      </div>
    </motion.section>
  );
};

export default AboutUsCTA;
