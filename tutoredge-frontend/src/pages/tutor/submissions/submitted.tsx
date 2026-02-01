"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import { motion } from "framer-motion";
import {
  FileText,
  User,
  BookOpen,
  CalendarDays,
  CheckCircle,
} from "lucide-react";

interface Submission {
  studentAssignmentId: string;
  assignment: {
    title: string;
    subject: string;
    class_grade: string;
  };
  studentName: string;
  submittedAt: string;
  files: {
    filename: string;
    url: string;
  }[];
  status: string;
}

export default function SubmittedAssignmentsPage() {
  const [data, setData] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await apiClient.get(
        "/tutor/assignments/submitted"
      );
      setData(res.data.data || []);
    } catch (err) {
      console.error("Failed to load submissions", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="p-6 text-gray-500">
          Loading submissions...
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow"
        >
          <h1 className="text-xl font-bold">
            Submitted Assignments
          </h1>
          <p className="mt-1 text-sm text-indigo-100">
            Review student submissions, download files, and
            update assignment status.
          </p>
        </motion.div>

        {/* ================= CONTENT ================= */}
        {data.length === 0 ? (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            No assignments submitted yet.
          </div>
        ) : (
          <div className="space-y-5">
            {data.map((item) => (
              <motion.div
                key={item.studentAssignmentId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-white p-5 shadow-sm"
              >
                {/* TOP */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {item.assignment.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {item.assignment.subject} • Class{" "}
                      {item.assignment.class_grade}
                    </p>
                  </div>

                  <span className="flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    <CheckCircle className="h-4 w-4" />
                    {item.status}
                  </span>
                </div>

                {/* META */}
                <div className="mt-3 grid gap-3 text-sm text-gray-700 md:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {item.studentName}
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(
                      item.submittedAt
                    ).toLocaleString()}
                  </div>

                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Assignment
                  </div>
                </div>

                {/* FILES */}
                <div className="mt-4">
                  <p className="mb-1 font-semibold text-sm">
                    Submitted Files
                  </p>
                  <ul className="space-y-1">
                    {item.files.map((f) => (
                      <li key={f.url}>
                        <a
                          href={f.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                        >
                          <FileText className="h-4 w-4" />
                          {f.filename}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </TutorDashboardLayout>
  );
}
