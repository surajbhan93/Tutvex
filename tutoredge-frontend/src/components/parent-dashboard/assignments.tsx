"use client";

import { useEffect, useMemo, useState } from "react";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { motion } from "framer-motion";
import {
  BookOpen,
  User,
  GraduationCap,
  CalendarDays,
  ArrowRight,
  Search,
} from "lucide-react";

/* ======================
   TYPES
====================== */
interface ParentAssignmentItem {
  _id: string;
  status: "Pending" | "Submitted" | "Checked";
  due_date: string;

  assignment: {
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
  };
}

/* ======================
   STATUS STYLE
====================== */
const statusStyle = {
  Pending: "bg-yellow-100 text-yellow-700 ring-yellow-200",
  Submitted: "bg-blue-100 text-blue-700 ring-blue-200",
  Checked: "bg-green-100 text-green-700 ring-green-200",
};

const statusTabs = ["All", "Pending", "Submitted", "Checked"];

export default function ParentAssignmentsPage() {
  const [assignments, setAssignments] = useState<ParentAssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState("All");
  const [search, setSearch] = useState("");

  const router = useRouter();

  /* ======================
     FETCH DATA
  ====================== */
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await apiClient.get("/parent/assignments");
        setAssignments(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, []);

  /* ======================
     FILTER + SEARCH
  ====================== */
  const filteredAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchStatus =
        activeStatus === "All" || a.status === activeStatus;

      const keyword = search.toLowerCase();
      const matchSearch =
        a.assignment.title.toLowerCase().includes(keyword) ||
        a.assignment.subject.toLowerCase().includes(keyword) ||
        a.student.full_name.toLowerCase().includes(keyword);

      return matchStatus && matchSearch;
    });
  }, [assignments, activeStatus, search]);

  return (
    <>
      {/* ================= SEO ================= */}
      <Head>
        <title>Parent Assignments | Dashboard</title>
        <meta
          name="description"
          content="Track assignments, submission status, and tutor updates."
        />
      </Head>

      <ParentDashboardLayout>
        {/* ================= PAGE WRAPPER ================= */}
        <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
          {/* ================= HEADER ================= */}
         {/* ================= PARENT ASSIGNMENTS HEADER ================= */}
<div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
        <h1 className="text-xl font-bold">
          📘 Assignments
        </h1>
        <p className="mt-1 text-sm text-indigo-100">
          Search and track your child’s assignments easily.
          Stay updated with submission status and deadlines.
        </p>
      </div>


          {/* ================= FILTER BAR ================= */}
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* STATUS TABS */}
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveStatus(tab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    activeStatus === tab
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by title, subject, student"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* ================= CONTENT ================= */}
          {loading ? (
            <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
              Loading assignments...
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
              No matching assignments found.
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4"
            >
              {filteredAssignments.map((a) => (
                <motion.div
                  key={a._id}
                  whileHover={{ scale: 1.015 }}
                  className="rounded-xl border bg-gradient-to-r from-white to-blue-50 p-4 shadow-sm"
                >
                  {/* TOP */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 font-semibold">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      {a.assignment.title}
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                        statusStyle[a.status]
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>

                  {/* DETAILS */}
                  <div className="mt-3 grid gap-3 text-sm text-gray-700 md:grid-cols-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {a.student.full_name} ({a.student.class_grade})
                    </div>

                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      {a.tutor.fullName}
                    </div>

                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {a.due_date
                        ? new Date(a.due_date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                          })
                        : "No due date"}
                    </div>

                    <div className="text-right">
                      <button
                        onClick={() =>
                          router.push(`/parent/assignments/${a._id}`)
                        }
                        className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        View
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </ParentDashboardLayout>
    </>
  );
}
