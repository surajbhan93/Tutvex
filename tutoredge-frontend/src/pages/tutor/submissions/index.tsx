"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileCheck,
  ClipboardList,
  ArrowRight,
  CalendarCheck,
  Timer,
  Info,
  TrendingUp,
} from "lucide-react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/* ===== Mock Trend Data (later API se aa sakta hai) ===== */
const submissionTrendData = [
  { day: "Mon", assignments: 5, quizzes: 3 },
  { day: "Tue", assignments: 8, quizzes: 4 },
  { day: "Wed", assignments: 6, quizzes: 6 },
  { day: "Thu", assignments: 10, quizzes: 5 },
  { day: "Fri", assignments: 7, quizzes: 8 },
  { day: "Sat", assignments: 4, quizzes: 3 },
  { day: "Sun", assignments: 9, quizzes: 6 },
];

export default function SubmissionsIndexPage() {
  /* ===== Teacher Tips Carousel ===== */
  const tips = [
    "Review submissions daily to keep students motivated.",
    "Short feedback improves learning outcomes.",
    "Use rubrics for faster and fair grading.",
  ];
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <TutorDashboardLayout>
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600">
        <div className="max-w-6xl mx-auto px-6 py-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">
            Student Submissions 📥
          </h1>
          <p className="mt-2 text-indigo-100">
            Review assignments and quizzes submitted by students
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-[#f4f7fb] min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">

          {/* 🔼 TOP ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assignment Submissions */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="relative bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <span className="absolute top-4 right-4 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                3 Pending
              </span>

              <ClipboardList className="h-10 w-10 text-indigo-600 mb-4" />
              <h2 className="text-xl font-semibold text-slate-800">
                Assignment Submissions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                View, review and manage submitted assignments
              </p>

              <Link
                href="/tutor/submissions/submitted"
                className="inline-flex items-center gap-2 mt-4 text-indigo-600 font-medium hover:underline"
              >
                View Submissions <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            {/* Quiz Submissions */}
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
            >
              <FileCheck className="h-10 w-10 text-purple-600 mb-4" />
              <h2 className="text-xl font-semibold text-slate-800">
                Quiz Submissions
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Check quiz attempts and student performance
              </p>

              <Link
                href="/tutor/submissions/quizz-submitted"
                className="inline-flex items-center gap-2 mt-4 text-purple-600 font-medium hover:underline"
              >
                View Submissions <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>

          {/* 📈 SUBMISSION TREND CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800 mb-4">
              <TrendingUp className="text-indigo-600" />
              Submission Trend (Last 7 Days)
            </h2>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={submissionTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="assignments"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="quizzes"
                    stroke="#9333ea"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Shows daily assignment & quiz submission activity.
            </p>
          </motion.div>

          {/* 🔽 BOTTOM ROW */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Today */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl border p-6">
              <CalendarCheck className="h-10 w-10 text-green-600 mb-4" />
              <h2 className="font-semibold text-slate-800">Today’s Submissions</h2>
              <p className="text-sm text-slate-500 mt-1">8 new submissions today</p>
            </motion.div>

            {/* Avg Time */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl border p-6">
              <Timer className="h-10 w-10 text-sky-600 mb-4" />
              <h2 className="font-semibold text-slate-800">Average Grading Time</h2>
              <p className="text-sm text-slate-500 mt-1">~12 min / submission</p>
            </motion.div>

            {/* Tips */}
            <motion.div whileHover={{ scale: 1.02 }} className="bg-white rounded-2xl border p-6">
              <Info className="h-10 w-10 text-orange-500 mb-4" />
              <h2 className="font-semibold text-slate-800">Teacher Tips</h2>
              <motion.p
                key={tipIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-slate-600 mt-2"
              >
                {tips[tipIndex]}
              </motion.p>
            </motion.div>
          </div>

        </div>
      </div>
    </TutorDashboardLayout>
  );
}
