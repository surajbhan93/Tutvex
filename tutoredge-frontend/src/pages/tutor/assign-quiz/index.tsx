"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Users,
  CheckCircle,
} from "lucide-react";
import apiClient from "@/lib/apiClient";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import toast from "react-hot-toast";

/* ======================
   TYPES
====================== */
interface Quiz {
  id: string;
  title: string;
  subject: string;
  class_grade: string;
}

interface Student {
  id: string;
  fullName: string;
  classGrade: string;
}

export default function AssignQuizPage() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD DATA
  ====================== */
  useEffect(() => {
    fetchQuizzes();
    fetchStudents();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await apiClient.get("/tutor/quizzes");
      setQuizzes(res.data?.data || []);
    } catch {
      toast.error("Failed to load quizzes");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await apiClient.get("/auth/tutor/my-student");
      const list =
        res.data?.data?.map((item: any) => ({
          id: item.studentId,
          fullName: item.student.full_name,
          classGrade: item.student.class,
        })) || [];
      setStudents(list);
    } catch {
      toast.error("Failed to load students");
    }
  };

  /* ======================
     HANDLERS
  ====================== */
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id)
        ? prev.filter((s) => s !== id)
        : [...prev, id]
    );
  };

  const assignQuiz = async () => {
    if (!selectedQuiz || selectedStudents.length === 0) {
      toast.error("Please select quiz and students");
      return;
    }

    const count = selectedStudents.length;
    const loadingToast = toast.loading(
      `Assigning quiz to ${count} student${count > 1 ? "s" : ""}...`
    );

    try {
      setLoading(true);
      await apiClient.post("/tutor/quizzes/assign", {
        quizId: selectedQuiz,
        studentIds: selectedStudents,
      });

      toast.success(
        `Quiz assigned to ${count} student${count > 1 ? "s" : ""} 📝`,
        { id: loadingToast }
      );
      setSelectedStudents([]);
    } catch {
      toast.error("Failed to assign quiz ❌", { id: loadingToast });
    } finally {
      setLoading(false);
    }
  };

  /* ======================
     UI
  ====================== */
  return (
    <TutorDashboardLayout>
      {/* 🌈 GRADIENT HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"
      >
        <div className="max-w-6xl mx-auto px-6 py-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
            Smart Quiz Assignment <ClipboardList />
          </h1>
          <p className="mt-2 text-sm md:text-base text-indigo-100">
            Evaluate students • Track performance • Boost learning
          </p>
          <p className="mt-1 text-xs md:text-sm text-indigo-200">
            Teacher Panel · Quiz Management · Classrooms
          </p>
        </div>
      </motion.div>

      {/* CONTENT */}
      <div className="bg-[#f4f7fb] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-4 py-8 space-y-8"
        >
          {/* SELECT QUIZ */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
              <ClipboardList className="text-indigo-600" />
              Select Quiz
            </h2>
            <select
              value={selectedQuiz}
              onChange={(e) => setSelectedQuiz(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select Quiz --</option>
              {quizzes.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.title} ({q.subject} - Class {q.class_grade})
                </option>
              ))}
            </select>
          </motion.div>

          {/* STUDENTS */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="flex items-center gap-2 text-xl font-semibold mb-4 text-slate-800">
              <Users className="text-indigo-600" />
              Select Students
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((s) => (
                <motion.label
                  whileHover={{ scale: 1.03 }}
                  key={s.id}
                  className={`flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition
                  ${
                    selectedStudents.includes(s.id)
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1 accent-indigo-600"
                    checked={selectedStudents.includes(s.id)}
                    onChange={() => toggleStudent(s.id)}
                  />
                  <div>
                    <p className="font-medium text-slate-800">
                      {s.fullName}
                    </p>
                    <p className="text-sm text-slate-500">
                      Class {s.classGrade}
                    </p>
                  </div>
                </motion.label>
              ))}
            </div>
          </motion.div>

          {/* ACTION */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-end"
          >
            <button
              disabled={loading}
              onClick={assignQuiz}
              className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium
              hover:bg-indigo-700 active:scale-95 transition disabled:opacity-60"
            >
              <CheckCircle className="h-5 w-5" />
              {loading ? "Assigning..." : "Assign Quiz"}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </TutorDashboardLayout>
  );
}
