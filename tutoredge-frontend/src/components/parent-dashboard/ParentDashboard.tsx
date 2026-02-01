"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import apiClient from "@/lib/apiClient";

import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import ParentTopBar from "@/components/parent-dashboard/ParentTopBar";

// Recharts
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

/* ================= ANIMATIONS ================= */
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ================= STATIC DATA ================= */
const attendanceData = [
  { name: "Present", value: 92 },
  { name: "Absent", value: 8 },
];

const marksData = [
  { subject: "Math", marks: 88 },
  { subject: "Science", marks: 76 },
  { subject: "English", marks: 91 },
  { subject: "History", marks: 72 },
  { subject: "Geography", marks: 84 },
];

const testLineData = [
  { test: "T1", previous: 72, current: 78 },
  { test: "T2", previous: 65, current: 74 },
  { test: "T3", previous: 80, current: 83 },
  { test: "T4", previous: 77, current: 79 },
  { test: "T5", previous: 70, current: 86 },
];

const COLORS = ["#2563eb", "#e5e7eb"];

/* ================= COMPONENT ================= */
export default function ParentDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [parent, setParent] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [activeStudent, setActiveStudent] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get("/auth/parent/profile"),
      apiClient.get("/auth/parent/students"),
    ])
      .then(([profileRes, studentsRes]) => {
        setParent(profileRes.data.parent);
        setStudents(studentsRes.data.students || []);
        setActiveStudent(studentsRes.data.students?.[0] || null);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4 text-sm">Loading dashboard…</div>;
  if (!parent) return null;

  return (
    <ParentDashboardLayout>
      <div className="mx-auto max-w-7xl space-y-5 px-3 pb-6 sm:px-4 lg:px-6">
        {/* TOP BAR */}
        <ParentTopBar
          parentName={parent.fullName}
          studentName={activeStudent?.full_name || "No student"}
          notificationsCount={0}
        />

        {/* HEADER */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-lg font-bold sm:text-xl lg:text-2xl">
            Welcome back, {parent.fullName} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base">
            Overview of {activeStudent?.full_name || "your child"}’s learning
          </p>
        </motion.div>

        {/* STUDENT SELECTOR (horizontal scroll on mobile) */}
        {students.length > 1 && (
          <div className="overflow-x-auto pb-1">
            <motion.div className="inline-flex gap-2 rounded-full bg-slate-100 p-1">
              {students.map((s) => {
                const isActive = activeStudent?._id === s._id;
                return (
                  <motion.button
                    key={s._id}
                    onClick={() => setActiveStudent(s)}
                    whileTap={{ scale: 0.96 }}
                    className={`relative whitespace-nowrap px-4 py-2 text-xs font-medium rounded-full sm:text-sm ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeStudent"
                        className="absolute inset-0 rounded-full bg-blue-600"
                      />
                    )}
                    <span className="relative z-10">{s.full_name}</span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        )}

        {/* TOP CARDS */}
        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
          variants={stagger}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: "Upcoming Session", value: "Math • Today 6:00 PM" },
            { label: "Pending Assignments", value: "2", bold: true },
            { label: "Payments", value: "Next due on 10 Oct" },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={fadeUp}
              className="rounded-xl border bg-white p-4"
            >
              <p className="text-xs font-semibold text-gray-500 sm:text-sm">
                {item.label}
              </p>
              <p
                className={`mt-1 ${
                  item.bold
                    ? "text-2xl font-bold"
                    : "text-sm font-medium sm:text-base"
                }`}
              >
                {item.value}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* CHARTS ROW */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* ATTENDANCE */}
          <div className="rounded-xl border bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold sm:text-base">
              Attendance
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={attendanceData}
                  dataKey="value"
                  innerRadius={55}
                  outerRadius={75}
                >
                  {attendanceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <p className="mt-1 text-center text-lg font-bold text-blue-600">
              92%
            </p>
          </div>

          {/* MARKS */}
          <div className="rounded-xl border bg-white p-4 lg:col-span-2">
            <h3 className="mb-2 text-sm font-semibold sm:text-base">
              Subject-wise Marks
            </h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={marksData}>
                <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="marks" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LINE CHART */}
        <div className="rounded-xl border bg-white p-4">
          <h3 className="mb-2 text-sm font-semibold sm:text-base">
            Test Performance (Previous vs Current)
          </h3>

          <div className="h-64 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={testLineData}>
                <CartesianGrid strokeDasharray="4 4" />
                <XAxis dataKey="test" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#a855f7"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
