"use client";

import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import {
  Users,
  ClipboardList,
  FileCheck,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from "recharts";

/* =========================
   TYPES
========================= */
type Tutor = {
  fullName: string;
  email: string;
  subjects: string[];
  rating: number;
  price: number;
};

type DashboardSummary = {
  assignmentsCount: number;
  quizzesCount: number;
  totalEarnings: number;
  totalStudents: number;
};

/* =========================
   MOCK CHART DATA
========================= */
const submissionsTrend = [
  { day: "Mon", assignments: 5, quizzes: 3, students: 12 },
  { day: "Tue", assignments: 7, quizzes: 4, students: 15 },
  { day: "Wed", assignments: 6, quizzes: 5, students: 14 },
  { day: "Thu", assignments: 10, quizzes: 6, students: 18 },
  { day: "Fri", assignments: 8, quizzes: 7, students: 17 },
  { day: "Sat", assignments: 4, quizzes: 3, students: 10 },
  { day: "Sun", assignments: 9, quizzes: 6, students: 16 },
];
const monthlyEarnings = [
  { month: "Jan", earnings: 12000 },
  { month: "Feb", earnings: 15000 },
  { month: "Mar", earnings: 18000 },
  { month: "Apr", earnings: 22000 },
  { month: "May", earnings: 20000 },
  { month: "Jun", earnings: 26000 },
];


const DashboardHomePage = () => {
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH DATA (FINAL FIX)
  ========================= */
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          tutorRes,
          summaryRes,
          studentsRes,
          paymentsRes,
        ] = await Promise.all([
          api.get("/tutor/me"),
          api.get("/tutor/dashboard-summary"),
          api.get("/auth/tutor/my-student"),
          api.get("/payments/tutor/dashboard"), // 👈 ADD THIS
        ]);

        // 🔹 Safe students array
        const students =
          Array.isArray(studentsRes.data?.data)
            ? studentsRes.data.data
            : Array.isArray(studentsRes.data?.data?.students)
            ? studentsRes.data.data.students
            : [];

        // 🔹 Safe earnings
        const totalEarnings =
          paymentsRes.data?.data?.totalEarning ?? 0;

        setTutor(tutorRes.data.data);

        setSummary({
          ...summaryRes.data.data,
          totalStudents: students.length,   // ✅ FIXED
          totalEarnings: totalEarnings,     // ✅ FIXED
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-8">
      <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6 text-white shadow">
  <h1 className="text-3xl font-bold text-slate-800">
        Welcome, {tutor?.fullName || "Tutor"} 👋
      </h1>
  <p className="mt-1 text-sm text-indigo-100">
    Get a quick overview of your teaching activity, students,
    assignments, quizzes, and earnings — all in one place.
  </p>
</div>
      {/* WELCOME */}
      

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <StatCard
          title="Subjects"
          value={tutor?.subjects?.length ?? 0}
          icon={ClipboardList}
        />
        <StatCard
          title="Assignments"
          value={summary?.assignmentsCount ?? 0}
          icon={ClipboardList}
        />
        <StatCard
          title="Quizzes"
          value={summary?.quizzesCount ?? 0}
          icon={FileCheck}
        />
        <StatCard
          title="Price / Session"
          value={`₹${tutor?.price ?? 0}`}
          icon={IndianRupee}
        />
      </div>

      {/* TOTALS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <StatCard
          title="Total Students"
          value={summary?.totalStudents ?? 0}
          icon={Users}
        />
        <StatCard
          title="Total Earnings"
          value={`₹${summary?.totalEarnings ?? 0}`}
          icon={TrendingUp}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Line Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
            <TrendingUp className="text-indigo-600" />
            Students & Submissions Trend
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={submissionsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#0ea5e9" />
                <Line type="monotone" dataKey="assignments" stroke="#4f46e5" />
                <Line type="monotone" dataKey="quizzes" stroke="#9333ea" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="rounded-2xl bg-white p-6 shadow-sm border">
          <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
            <ClipboardList className="text-indigo-600" />
            Assignments vs Quizzes
          </h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionsTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assignments" fill="#4f46e5" />
                <Bar dataKey="quizzes" fill="#9333ea" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= EARNINGS MONTHLY BREAKDOWN ================= */}
<div className="rounded-2xl bg-white p-6 shadow-sm border">
  <h2 className="mb-4 flex items-center gap-2 font-semibold text-slate-800">
    <IndianRupee className="text-indigo-600" />
    Monthly Earnings Breakdown
  </h2>

  <div className="h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={monthlyEarnings}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          formatter={(value) => [`₹${value}`, "Earnings"]}
        />
        <Bar
          dataKey="earnings"
          fill="#4f46e5"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  </div>
</div>

    </div>
  );
};

/* =========================
   STAT CARD
========================= */
const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: any;
}) => (
  <div className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-sm border">
    <div className="rounded-xl bg-indigo-50 p-3">
      <Icon className="h-6 w-6 text-indigo-600" />
    </div>
    <div>
      <h3 className="text-sm text-slate-500">{title}</h3>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default DashboardHomePage;
