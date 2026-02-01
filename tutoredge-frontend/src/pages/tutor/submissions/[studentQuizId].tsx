"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import { motion } from "framer-motion";
import {
  ClipboardList,
  User,
  BookOpen,
  CheckCircle,
  XCircle,
  Trophy,
} from "lucide-react";

export default function CheckQuizPage() {
  const router = useRouter();
  const { studentQuizId } = router.query;

  const [loading, setLoading] = useState(true);
  const [quizData, setQuizData] = useState<any>(null);
  const [score, setScore] = useState<number | "">("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!studentQuizId) return;
    fetchQuiz();
  }, [studentQuizId]);

  const fetchQuiz = async () => {
    try {
      const res = await apiClient.get(
        `/tutor/quizzes/${studentQuizId}`
      );
      setQuizData(res.data.data);
    } catch (err) {
      alert("Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckQuiz = async () => {
    if (score === "") {
      alert("Please enter score");
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post(
        `/tutor/assign-quiz/submitted/${studentQuizId}/check`,
        { score }
      );

      alert("Quiz checked successfully ✅");
      router.push("/tutor/assign-quiz/submitted");
    } catch (err) {
      alert("Failed to check quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="p-6 text-gray-500">Loading quiz...</div>
      </TutorDashboardLayout>
    );
  }

  if (!quizData) {
    return (
      <TutorDashboardLayout>
        <div className="p-6 text-red-500">
          Quiz data not found
        </div>
      </TutorDashboardLayout>
    );
  }

  const { quiz, student, submission } = quizData;

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
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
                Check Quiz Submission
              </h1>
              <p className="text-sm text-indigo-100">
                Review answers and evaluate the student
                performance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= INFO ================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-6 max-w-4xl rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="grid gap-4 text-sm text-gray-700 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {student.full_name} (Class{" "}
              {student.class_grade})
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {quiz.title}
            </div>
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              {quiz.subject}
            </div>
          </div>
        </motion.div>

        {/* ================= QUESTIONS ================= */}
        <div className="mx-auto max-w-4xl space-y-5">
          {quiz.questions.map(
            (q: any, index: number) => {
              const studentAnswer =
                submission?.answers?.find(
                  (a: any) =>
                    a.question_id === q._id
                )?.selected_option || "Not Answered";

              const isCorrect =
                studentAnswer === q.correct_answer;

              return (
                <motion.div
                  key={q._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl bg-white p-5 shadow-sm"
                >
                  <p className="mb-3 font-semibold">
                    {index + 1}. {q.question}
                  </p>

                  <ul className="space-y-1 text-sm">
                    {q.options.map((opt: string) => (
                      <li
                        key={opt}
                        className={`flex items-center gap-2 ${
                          opt === q.correct_answer
                            ? "text-green-700 font-semibold"
                            : "text-gray-700"
                        }`}
                      >
                        {opt === q.correct_answer ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-300" />
                        )}
                        {opt}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3 text-sm">
                    <b>Student Answer:</b>{" "}
                    <span
                      className={
                        isCorrect
                          ? "text-green-700 font-semibold"
                          : "text-red-600 font-semibold"
                      }
                    >
                      {studentAnswer}
                    </span>
                  </div>

                  {!isCorrect && (
                    <p className="mt-1 text-xs text-gray-500">
                      Correct Answer:{" "}
                      {q.correct_answer}
                    </p>
                  )}
                </motion.div>
              );
            }
          )}
        </div>

        {/* ================= SCORE ================= */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-6 max-w-4xl rounded-xl bg-white p-5 shadow-sm"
        >
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <input
                type="number"
                value={score}
                onChange={(e) =>
                  setScore(Number(e.target.value))
                }
                placeholder="Enter score"
                className="w-40 rounded border px-4 py-2 text-sm"
              />
            </div>

            <button
              disabled={submitting}
              onClick={handleCheckQuiz}
              className={`rounded-lg px-6 py-2 text-sm font-semibold text-white transition ${
                submitting
                  ? "cursor-not-allowed bg-gray-400"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting
                ? "Submitting..."
                : "Submit Score"}
            </button>
          </div>
        </motion.div>
      </div>
    </TutorDashboardLayout>
  );
}
