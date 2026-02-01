"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  BookOpen,
  GraduationCap,
  HelpCircle,
  PlayCircle,
} from "lucide-react";

export default function QuizDetailsPage() {
  const router = useRouter();
  const { studentQuizId } = router.query;

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Countdown states
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!studentQuizId) return;

    apiClient
      .get(`/parent/quizzes/${studentQuizId}`)
      .then((res) => setQuiz(res.data.data))
      .finally(() => setLoading(false));
  }, [studentQuizId]);

  // ⏱ Countdown effect
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      router.push(`/parent/quizzes/${studentQuizId}/attempt`);
      return;
    }

    const timer = setTimeout(
      () => setCountdown((c) => (c as number) - 1),
      1000
    );

    return () => clearTimeout(timer);
  }, [countdown, router, studentQuizId]);

  if (loading)
    return (
      <ParentDashboardLayout>
        <div className="p-6 text-gray-500">
          Loading quiz details...
        </div>
      </ParentDashboardLayout>
    );

  if (!quiz)
    return (
      <ParentDashboardLayout>
        <div className="p-6 text-gray-500">
          Quiz not found
        </div>
      </ParentDashboardLayout>
    );

  const statusStyle =
    quiz.status === "Checked"
      ? "bg-green-100 text-green-700"
      : quiz.status === "Submitted"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <ParentDashboardLayout>
      <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6 relative">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white shadow"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">Quiz Details</h1>
              <p className="text-sm text-purple-100">
                Review quiz information before starting.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= CONTENT CARD ================= */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl space-y-6 rounded-xl bg-white p-6 shadow-sm"
        >
          {/* TITLE */}
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold">{quiz.title}</h2>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
            >
              {quiz.status}
            </span>
          </div>

          {/* META */}
          <div className="grid gap-4 text-sm text-gray-700 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {quiz.subject}
            </div>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              Class {quiz.class_grade}
            </div>
            <div className="flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              {quiz.total_questions} Questions
            </div>
          </div>

          {/* INSTRUCTIONS */}
          <div className="rounded-lg bg-indigo-50 p-4 text-sm text-gray-700">
            <p className="mb-1 font-semibold text-indigo-700">
              Important Instructions
            </p>
            <p>
              Attempt the quiz honestly. Do not refresh or switch
              tabs. Once started, the quiz must be completed.
            </p>
          </div>

          {/* ACTION */}
          {quiz.status === "assigned" && (
            <button
              disabled={countdown !== null}
              onClick={() => setCountdown(3)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 py-3 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              <PlayCircle className="h-5 w-5" />
              {countdown ? "Starting..." : "Start Quiz"}
            </button>
          )}

          {quiz.status !== "assigned" && (
            <div className="rounded-lg bg-gray-50 p-4 text-sm text-gray-600">
              This quiz has already been {quiz.status.toLowerCase()}.
            </div>
          )}
        </motion.div>

        {/* ================= COUNTDOWN OVERLAY ================= */}
        <AnimatePresence>
          {countdown !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60"
            >
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-6xl font-bold text-white"
              >
                {countdown}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ParentDashboardLayout>
  );
}
