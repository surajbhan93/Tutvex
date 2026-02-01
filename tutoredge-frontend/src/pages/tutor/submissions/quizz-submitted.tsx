"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import { motion } from "framer-motion";
import {
  ClipboardList,
  User,
  CalendarDays,
  Trophy,
  CheckCircle,
} from "lucide-react";

interface SubmittedQuiz {
  studentQuizId: string;
  status: "Submitted" | "Checked";
  submittedAt: string | null;
  score: number | null;

  quiz: {
    title: string;
    subject: string;
    class_grade: string;
  };

  student: {
    full_name: string;
    class_grade: string;
  };
}

export default function SubmittedQuizzesPage() {
  const [quizzes, setQuizzes] = useState<SubmittedQuiz[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSubmittedQuizzes();
  }, []);

  const fetchSubmittedQuizzes = async () => {
    try {
      const res = await apiClient.get("/tutor/quizzes/submitted");
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch submitted quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  const statusBadge = (status: string) => {
    if (status === "Checked")
      return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow"
        >
          <div className="flex items-center gap-3">
            <ClipboardList className="h-6 w-6" />
            <div>
              <h1 className="text-xl font-bold">
                Submitted Quizzes
              </h1>
              <p className="text-sm text-indigo-100">
                Review student quiz submissions, scores, and
                evaluation status.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            Loading submitted quizzes...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            No submitted quizzes yet.
          </div>
        ) : (
          <div className="space-y-4">
            {quizzes.map((q) => (
              <motion.div
                key={q.studentQuizId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                onClick={() =>
                  router.push(
                    `/tutor/submissions/${q.studentQuizId}`
                  )
                }
                className="cursor-pointer rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                {/* TOP */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {q.quiz.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {q.quiz.subject} • Class{" "}
                      {q.quiz.class_grade}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadge(
                      q.status
                    )}`}
                  >
                    {q.status}
                  </span>
                </div>

                {/* DETAILS */}
                <div className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {q.student.full_name} (Class{" "}
                    {q.student.class_grade})
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {q.submittedAt
                      ? new Date(
                          q.submittedAt
                        ).toLocaleString()
                      : "—"}
                  </div>

                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Score:{" "}
                    {q.score !== null ? q.score : "—"}
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {q.status === "Checked"
                      ? "Evaluated"
                      : "Pending Review"}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </TutorDashboardLayout>
  );
}
