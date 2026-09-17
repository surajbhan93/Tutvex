"use client";

import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/* ================= DATA ================= */
const materials = [
  { id: 1, name: "Algebra Basics - PDF", type: "PDF", status: "Available" },
  { id: 2, name: "Triangles Lecture", type: "Video", status: "New" },
  {
    id: 3,
    name: "Weekly Practice Sheet",
    type: "Worksheet",
    status: "Available",
  },
];

const chartData = [
  { name: "PDF", value: 1 },
  { name: "Video", value: 1 },
  { name: "Worksheet", value: 1 },
];

const COLORS = ["#2563eb", "#9333ea", "#16a34a"];

/* ================= PAGE ================= */
export default function StudentMaterialsPage() {
  return (
    <ParentDashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6 px-3 pb-6 sm:px-4 lg:px-6">
        {/* HEADER */}
      {/* ================= PARENT STUDY MATERIALS HEADER ================= */}
          <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
            <h1 className="text-xl font-bold">
              📂 Study Materials
            </h1>
            <p className="mt-1 text-sm text-indigo-100">
              Access and download study materials shared by tutors.
              Help your child learn better with organized resources.
            </p>
          </div>


        {/* CHART + STATS */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* PIE CHART */}
          <div className="rounded-xl border bg-white p-4">
            <h3 className="mb-3 text-sm font-semibold sm:text-base">
              Materials by Type
            </h3>

            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={80}
                >
                  {chartData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-3 flex justify-center gap-4 text-xs sm:text-sm">
              {chartData.map((c, i) => (
                <div key={i} className="flex items-center gap-1">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  {c.name}
                </div>
              ))}
            </div>
          </div>

          {/* QUICK INFO */}
          <div className="rounded-xl border bg-white p-4 md:col-span-2">
            <h3 className="mb-2 text-sm font-semibold sm:text-base">
              Materials Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <InfoCard label="Total Materials" value={materials.length} />
              <InfoCard label="New" value={1} />
              <InfoCard label="Available" value={2} />
            </div>
          </div>
        </div>

        {/* TABLE (Desktop) */}
        <div className="hidden overflow-hidden rounded-xl border bg-white md:block">
          <div className="grid grid-cols-4 border-b bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
            <div>Name</div>
            <div>Type</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          {materials.map((m) => (
            <div
              key={m.id}
              className="grid grid-cols-4 items-center px-4 py-3 text-sm text-gray-700"
            >
              <div className="font-medium">{m.name}</div>
              <div>{m.type}</div>
              <div>
                <span
                  className={`rounded-md px-2 py-1 text-xs font-medium ${
                    m.status === "New"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {m.status}
                </span>
              </div>
              <div className="text-right">
                <button className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white">
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* MOBILE CARDS */}
        <div className="space-y-3 md:hidden">
          {materials.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border bg-white p-4"
            >
              <h4 className="font-medium">{m.name}</h4>
              <p className="mt-1 text-sm text-gray-500">
                Type: {m.type}
              </p>
              <span
                className={`mt-2 inline-block rounded-md px-2 py-1 text-xs font-medium ${
                  m.status === "New"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {m.status}
              </span>

              <div className="mt-3">
                <button className="w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white">
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ParentDashboardLayout>
  );
}

/* ================= INFO CARD ================= */
function InfoCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg bg-gray-50 p-3 text-center">
      
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}
