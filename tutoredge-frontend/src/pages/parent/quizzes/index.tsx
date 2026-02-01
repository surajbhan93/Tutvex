"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import { motion } from "framer-motion";
import {
  ClipboardList,
  GraduationCap,
  User,
  CalendarDays,
} from "lucide-react";

interface QuizItem {
  _id: string;
  status: "Pending" | "Submitted" | "Checked";
  due_date?: string;
  assigned_at: string;
  quiz: {
    title: string;
    subject: string;
    class_grade: string;
  };
  student: {
    full_name: string;
    class_grade: string;
  };
  tutor: {
    fullName: string;
    email?: string;
  };
}

export default function ParentQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await apiClient.get("/parent/quizzes");
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (status: string) => {
    if (status === "Pending")
      return "bg-yellow-100 text-yellow-700";
    if (status === "Submitted")
      return "bg-blue-100 text-blue-700";
    if (status === "Checked")
      return "bg-green-100 text-green-700";
    return "bg-gray-100 text-gray-700";
  };

  return (
    <ParentDashboardLayout>
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
                Assigned Quizzes
              </h1>
              <p className="text-sm text-indigo-100">
                View quiz status, deadlines, and performance updates
                for your child. Ensure quizzes are attempted honestly
                and submitted on time.
              </p>
            </div>
          </div>
        </motion.div>

        {/* ================= CONTENT ================= */}
        {loading ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            Loading quizzes...
          </div>
        ) : quizzes.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            No quizzes assigned yet.
          </div>
        ) : (
          <>
            {/* ================= DESKTOP TABLE ================= */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full rounded-xl bg-white shadow-sm">
                <thead className="bg-gray-100 text-sm">
                  <tr>
                    <th className="p-3 text-left">Quiz</th>
                    <th className="p-3 text-left">Student</th>
                    <th className="p-3 text-left">Tutor</th>
                    <th className="p-3 text-left">Due</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((q) => (
                    <tr
                      key={q._id}
                      onClick={() =>
                        router.push(`/parent/quizzes/${q._id}`)
                      }
                      className="cursor-pointer border-t hover:bg-gray-50"
                    >
                      <td className="p-3">
                        <p className="font-medium">
                          {q.quiz.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {q.quiz.subject} • Class{" "}
                          {q.quiz.class_grade}
                        </p>
                      </td>

                      <td className="p-3 text-sm">
                        {q.student.full_name}
                        <p className="text-xs text-gray-500">
                          Class {q.student.class_grade}
                        </p>
                      </td>

                      <td className="p-3 text-sm">
                        {q.tutor.fullName}
                        {q.tutor.email && (
                          <p className="text-xs text-gray-500">
                            {q.tutor.email}
                          </p>
                        )}
                      </td>

                      <td className="p-3 text-sm">
                        {q.due_date
                          ? new Date(
                              q.due_date
                            ).toLocaleDateString()
                          : "—"}
                      </td>

                      <td className="p-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
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

            {/* ================= MOBILE CARDS ================= */}
            <div className="space-y-4 md:hidden">
              {quizzes.map((q) => (
                <motion.div
                  key={q._id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() =>
                    router.push(`/parent/quizzes/${q._id}`)
                  }
                  className="cursor-pointer rounded-xl bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">
                      {q.quiz.title}
                    </p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        q.status
                      )}`}
                    >
                      {q.status}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {q.quiz.subject} • Class{" "}
                    {q.quiz.class_grade}
                  </p>

                  <div className="mt-3 space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {q.student.full_name}
                    </div>

                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {q.tutor.fullName}
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {q.due_date
                        ? new Date(
                            q.due_date
                          ).toLocaleDateString()
                        : "No due date"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </ParentDashboardLayout>
  );
}
