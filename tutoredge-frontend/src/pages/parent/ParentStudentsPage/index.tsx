"use client";

import React, { useEffect, useMemo, useState } from "react";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import apiClient from "@/lib/apiClient";

// Icons
import {
  Users,
  BookOpen,
  School,
  Calendar,
  Search,
} from "lucide-react";

// Recharts
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

/* ======================
   TYPES
====================== */
interface Student {
  id: string;
  full_name: string;
  class?: string;
  board?: string;
  institution_name?: string;
  subjects_required?: string[];
  additional_notes?: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  count: number;
  students: Student[];
}

/* ======================
   COLORS
====================== */
const COLORS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#8b5cf6",
];

/* ======================
   PAGE
====================== */
export default function ParentStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ======================
     FETCH API
  ====================== */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiClient.get<ApiResponse>(
          "/parent/students"
        );
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ======================
     SEARCH FILTER
  ====================== */
  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      s.full_name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [students, search]);

  /* ======================
     STATS
  ====================== */
  const totalStudents = students.length;

  const boardStats = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      if (!s.board) return;
      map[s.board] = (map[s.board] || 0) + 1;
    });

    return Object.entries(map).map(
      ([name, value]) => ({
        name,
        value,
      })
    );
  }, [students]);

  const classStats = useMemo(() => {
    const map: Record<string, number> = {};
    students.forEach((s) => {
      if (!s.class) return;
      map[s.class] = (map[s.class] || 0) + 1;
    });

    return Object.entries(map).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
  }, [students]);

  /* ======================
     UI
  ====================== */
  return (
    <ParentDashboardLayout>
      <div className="space-y-8">

        {/* ===== HEADER ===== */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
          <h1 className="text-2xl font-bold">
            My Students
          </h1>
          <p className="mt-1 text-sm text-indigo-100">
            Manage all students added to your account and
            track academic distribution.
          </p>
        </div>

        {/* ===== STATS ===== */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Students"
            value={totalStudents}
            icon={Users}
          />
          <StatCard
            title="Boards"
            value={boardStats.length}
            icon={School}
          />
          <StatCard
            title="Classes"
            value={classStats.length}
            icon={BookOpen}
          />
          <StatCard
            title="Recently Added"
            value={
              students.filter((s) => {
                const days =
                  (Date.now() -
                    new Date(s.createdAt).getTime()) /
                  (1000 * 60 * 60 * 24);
                return days <= 7;
              }).length
            }
            icon={Calendar}
          />
        </div>

        {/* ===== CHARTS ===== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Board Distribution */}
          <div className="rounded-xl border bg-white p-5 shadow">
            <h3 className="mb-2 font-semibold">
              Board Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={boardStats}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
                    {boardStats.map((_, i) => (
                      <Cell
                        key={i}
                        fill={
                          COLORS[i % COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Class Distribution */}
          <div className="rounded-xl border bg-white p-5 shadow">
            <h3 className="mb-2 font-semibold">
              Class Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="#6366f1"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ===== SEARCH ===== */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search student by name..."
            className="w-full rounded-lg border px-10 py-2 text-sm"
          />
        </div>

        {/* ===== STUDENT LIST ===== */}
        {loading ? (
          <p>Loading students...</p>
        ) : filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredStudents.map((s) => (
              <StudentCard key={s.id} student={s} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed bg-gray-50 py-12 text-center text-gray-500">
            No students found.
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
}

/* ======================
   STAT CARD
====================== */
function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {title}
        </p>
        <Icon className="text-indigo-600" />
      </div>
      <p className="mt-3 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}

/* ======================
   STUDENT CARD
====================== */
function StudentCard({ student }: { student: Student }) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow transition hover:shadow-md">
      <h3 className="text-lg font-semibold">
        {student.full_name}
      </h3>

      <p className="mt-1 text-sm text-gray-600">
        Class: {student.class || "—"} |{" "}
        {student.board || "—"}
      </p>

      <p className="mt-1 text-sm text-gray-600">
        Institute:{" "}
        {student.institution_name || "—"}
      </p>

      {student.subjects_required?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {student.subjects_required.map((sub, i) => (
            <span
              key={i}
              className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
            >
              {sub}
            </span>
          ))}
        </div>
      ) : null}

      {student.additional_notes && (
        <p className="mt-2 text-xs text-gray-500">
          {student.additional_notes}
        </p>
      )}

      <p className="mt-3 text-xs text-gray-400">
        Added on{" "}
        {new Date(
          student.createdAt
        ).toLocaleDateString()}
      </p>
    </div>
  );
}
