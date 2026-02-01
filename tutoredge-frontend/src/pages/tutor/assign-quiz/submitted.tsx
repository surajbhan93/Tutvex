"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";

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
      return "bg-green-100 text-green-800";
    return "bg-blue-100 text-blue-800";
  };

  return (
    <TutorDashboardLayout>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold">Submitted Quizzes</h1>

        {loading ? (
          <p>Loading submitted quizzes...</p>
        ) : quizzes.length === 0 ? (
          <p className="text-gray-500">
            No submitted quizzes yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">Quiz</th>
                  <th className="p-3 text-left">Student</th>
                  <th className="p-3 text-left">Submitted At</th>
                  <th className="p-3 text-left">Score</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>

              <tbody>
                {quizzes.map((q) => (
                  <tr
                    key={q.studentQuizId}
                    onClick={() =>
                      router.push(
                        `/tutor/quizzes/${q.studentQuizId}`
                      )
                    }
                    className="border-t cursor-pointer hover:bg-gray-50"
                  >
                    <td className="p-3">
                      <p className="font-medium">
                        {q.quiz.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {q.quiz.subject} • Class{" "}
                        {q.quiz.class_grade}
                      </p>
                    </td>

                    <td className="p-3">
                      <p>{q.student.full_name}</p>
                      <p className="text-sm text-gray-500">
                        Class {q.student.class_grade}
                      </p>
                    </td>

                    <td className="p-3">
                      {q.submittedAt
                        ? new Date(
                            q.submittedAt
                          ).toLocaleString()
                        : "—"}
                    </td>

                    <td className="p-3">
                      {q.score !== null ? q.score : "—"}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${statusBadge(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </TutorDashboardLayout>
  );
}
