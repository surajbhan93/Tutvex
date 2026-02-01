import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Custom404() {
  const router = useRouter();
  const [seconds, setSeconds] = useState(10);

  /* =====================================
     🔁 AUTO REDIRECT AFTER 10 SECONDS
  ===================================== */
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds === 0) {
      router.push("/");
    }

    return () => clearInterval(timer);
  }, [seconds, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 px-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full text-center bg-white rounded-3xl shadow-xl p-10"
      >
        {/* FUN EMOJI */}
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl mb-4"
        >
          😵‍💫📚
        </motion.div>

        {/* 404 */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="text-7xl font-extrabold text-indigo-600"
        >
          404
        </motion.h1>

        <p className="mt-4 text-2xl font-semibold text-gray-800">
          Oops! This page skipped class 😅
        </p>

        <p className="mt-2 text-gray-600 leading-relaxed">
          The page you’re looking for doesn’t exist or has gone for tuition.
        </p>

        {/* CTA */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
          >
            Go to Home
          </Link>

          <Link
            href="/find-tutor-flow/create-account/?source=404&campaign=FIND_TUTOR"
            className="px-6 py-3 rounded-lg border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
          >
            Find a Tutor
          </Link>
        </div>

        {/* AUTO REDIRECT MESSAGE */}
        <p className="mt-8 text-sm text-gray-400">
          Redirecting you to home in{" "}
          <span className="font-semibold text-indigo-600">
            {seconds}s
          </span>{" "}
          ⏳
        </p>
      </motion.div>
    </div>
  );
}
