"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import toast from "react-hot-toast";

/* ======================
   TYPES
====================== */
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";
const assignmentActivity = [
  { day: "Mon", assigned: 5 },
  { day: "Tue", assigned: 8 },
  { day: "Wed", assigned: 6 },
  { day: "Thu", assigned: 10 },
  { day: "Fri", assigned: 7 },
  { day: "Sat", assigned: 4 },
  { day: "Sun", assigned: 9 },
];

import { ClipboardCheck } from "lucide-react";

interface Assignment {
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

export default function AssignAssignmentPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  /* ======================
     LOAD DATA
  ====================== */
  useEffect(() => {
    fetchAssignments();
    fetchStudents();
  }, []);

  const fetchAssignments = async () => {
    const res = await apiClient.get("/tutor/assignments");
    setAssignments(res.data?.data || []);
  };

  const fetchStudents = async () => {
    const res = await apiClient.get("/auth/tutor/my-student");
    const list =
      res.data?.data?.map((item: any) => ({
        id: item.studentId,
        fullName: item.student.full_name,
        classGrade: item.student.class,
      })) || [];
    setStudents(list);
  };

  /* ======================
     HANDLERS
  ====================== */
  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const assignAssignment = async () => {
    if (!selectedAssignment || selectedStudents.length === 0) {
      toast.error("Please select assignment and students");
      return;
    }

    const count = selectedStudents.length;

    const loadingToast = toast.loading(
      `Assigning assignment to ${count} student${count > 1 ? "s" : ""}...`
    );

    try {
      setLoading(true);

      await apiClient.post("/tutor/assignments/assign", {
        assignmentId: selectedAssignment,
        studentIds: selectedStudents,
      });

      toast.success(
        `Assignment successfully assigned to ${count} student${count > 1 ? "s" : ""} 🎯`,
        { id: loadingToast }
      );

      setSelectedStudents([]);
    } catch (err) {
      toast.error("Failed to assign assignment ❌", { id: loadingToast });
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
        className="w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600"
      >
        <div className="max-w-6xl mx-auto px-6 py-10 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">
            Smart Assignment Management 🎓
          </h1>
          <p className="mt-2 text-sm md:text-base text-indigo-100">
            Empowering teachers • Organized classrooms • Seamless assignment distribution
          </p>
          <p className="mt-1 text-xs md:text-sm text-indigo-200">
            Company Dashboard · Teacher Panel · Assignments
          </p>
        </div>
      </motion.div>

      {/* Teacher-style soft background */}
      <div className="bg-[#f4f7fb] min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto px-4 py-8 space-y-8"
        >
          {/* Page Title */}
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl font-bold text-slate-800"
          >
            Assign Assignments 📘
            <span className="block text-base font-normal text-slate-500 mt-1">
              Select assignment and students to continue
            </span>
          </motion.h2>

          {/* Assignment Card */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <label className="block mb-2 font-semibold text-slate-700">
              Select Assignment
            </label>
            <select
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              className="w-full border border-slate-300 rounded-xl px-4 py-3
              focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Select Assignment --</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.subject} - Class {a.class_grade})
                </option>
              ))}
            </select>
          </motion.div>

          {/* Students Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <h2 className="text-xl font-semibold mb-4 text-slate-800">
              Select Students 👨‍🎓
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

          {/* Action Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex justify-end"
          >
            <button
              disabled={loading}
              onClick={assignAssignment}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-medium
              hover:bg-indigo-700 active:scale-95 transition disabled:opacity-60"
            >
              {loading ? "Assigning..." : "Assign Assignment"}
            </button>
          </motion.div>
        </motion.div>
{/* ================= ASSIGN ASSIGNMENTS CHART ================= */}
<div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border">
  <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
    <ClipboardCheck className="text-indigo-600" />
    Assignment Assignment Activity
  </h2>

  <p className="mb-4 text-sm text-gray-500">
    Overview of assignments assigned during the week.
  </p>

  <div className="h-64">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={assignmentActivity}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Bar
          dataKey="assigned"
          fill="#4f46e5"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>


      </div>
      
    </TutorDashboardLayout>
  );
}
