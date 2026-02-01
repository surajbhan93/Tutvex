"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import {
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";

const QUIZ_DURATION_SECONDS = 60 * 60; // ⏱ 10 minutes

export default function AttemptQuizPage() {
  const router = useRouter();
  const { studentQuizId } = router.query;

  const [quiz, setQuiz] = useState<any>(null);
  const [answers, setAnswers] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [submitting, setSubmitting] = useState(false);

  /* ================= FETCH QUIZ ================= */
  useEffect(() => {
    if (!studentQuizId) return;

    apiClient
      .get(`/parent/quizzes/${studentQuizId}/attempt`)
      .then((res) => setQuiz(res.data.data));
  }, [studentQuizId]);

  /* ================= TIMER ================= */
  useEffect(() => {
    if (!quiz) return;

    if (timeLeft <= 0) {
      autoSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [quiz, timeLeft]);

  /* ================= SUBMIT ================= */
  const autoSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    await apiClient.post(
      `/parent/quizzes/${studentQuizId}/submit`,
      { answers }
    );

    alert("Time over! Quiz auto-submitted ⏱");
    router.push("/parent/quizzes");
  };

  const manualSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
    await apiClient.post(
      `/parent/quizzes/${studentQuizId}/submit`,
      { answers }
    );

    alert("Quiz submitted successfully ✅");
    router.push("/parent/quizzes");
  };

  /* ================= HELPERS ================= */
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!quiz)
    return (
      <div className="p-6 text-gray-500">
        Loading quiz...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
          <div>
            <h1 className="text-lg font-bold">
              {quiz.title}
            </h1>
            <p className="text-sm text-gray-500">
              Do not refresh or switch tabs
            </p>
          </div>

          {/* TIMER */}
          <div
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold ${
              timeLeft <= 60
                ? "bg-red-100 text-red-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            <Clock className="h-4 w-4" />
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
        </div>

        {/* ================= QUESTIONS ================= */}
        {quiz.questions.map((q: any, idx: number) => {
          const selected = answers[idx]?.selected_option;

          return (
            <div
              key={q._id}
              className="rounded-xl bg-white p-5 shadow-sm"
            >
              <p className="mb-4 font-semibold">
                {idx + 1}. {q.question}
              </p>

              <div className="space-y-2">
                {q.options.map((opt: string) => {
                  const isSelected = selected === opt;

                  return (
                    <label
                      key={opt}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`q-${idx}`}
                        className="hidden"
                        onChange={() => {
                          const copy = [...answers];
                          copy[idx] = {
                            question_id: q._id,
                            selected_option: opt,
                          };
                          setAnswers(copy);
                        }}
                      />

                      {isSelected ? (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Circle className="h-5 w-5 text-gray-400" />
                      )}

                      <span className="text-sm">
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ================= SUBMIT ================= */}
        <button
          disabled={submitting}
          onClick={manualSubmit}
          className={`w-full rounded-xl py-3 text-sm font-semibold text-white ${
            submitting
              ? "cursor-not-allowed bg-gray-400"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
