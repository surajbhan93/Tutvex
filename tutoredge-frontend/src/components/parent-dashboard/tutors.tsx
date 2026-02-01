"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import apiClient from "@/lib/apiClient";
import { motion } from "framer-motion";
import {
  User,
  BookOpen,
  GraduationCap,
  CreditCard,
} from "lucide-react";

export default function StudentTutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await apiClient.get("/auth/parent/my-tutors");
        setTutors(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch tutors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutors();
  }, []);

  return (
    <ParentDashboardLayout>
      <div className="min-h-screen rounded-xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        {/* ================= HEADER ================= */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow"
        >
          <h1 className="text-xl font-bold">My Tutors</h1>
          <p className="mt-1 text-sm text-blue-100">
            View assigned tutors, linked students, and payment status
            at one place.
          </p>
        </motion.div>

        {/* ================= CONTENT ================= */}
        {loading && (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            Loading tutors...
          </div>
        )}

        {!loading && tutors.length === 0 && (
          <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
            No tutors assigned yet.
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((item) => (
            <motion.div
              key={item.requestId}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white p-5 shadow-sm transition"
            >
              {/* ================= TUTOR PROFILE ================= */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                  <User className="h-6 w-6" />
                </div>

                <div>
                  <p className="text-lg font-semibold">
                    {item.tutor?.fullName ??
                      "Tutor not available"}
                  </p>
                  <p className="text-xs text-gray-500">
                    Tutor
                  </p>
                </div>
              </div>

              {/* SUBJECTS */}
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                <BookOpen className="mt-0.5 h-4 w-4" />
                <span>
                  <b>Subjects:</b>{" "}
                  {item.tutor?.subjects?.join(", ") ??
                    "N/A"}
                </span>
              </div>

              {/* STUDENT */}
              <div className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                <GraduationCap className="mt-0.5 h-4 w-4" />
                {item.student ? (
                  <span>
                    <b>Student:</b>{" "}
                    {item.student.full_name} (Class{" "}
                    {item.student.class_grade})
                  </span>
                ) : (
                  <span className="italic text-gray-500">
                    Student not linked
                  </span>
                )}
              </div>

              {/* ================= ACTIONS ================= */}
              <div className="mt-5 flex items-center justify-between">
                {item.tutor?._id ? (
                  <Link
                    href={`/tutors/${item.tutor._id}`}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    View Tutor
                  </Link>
                ) : (
                  <span className="text-sm italic text-gray-400">
                    Tutor unavailable
                  </span>
                )}

                {item.paymentStatus === "paid" ? (
                  <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                    <CreditCard className="h-4 w-4" />
                    Paid
                  </span>
                ) : (
                  <Link
                    href={`/parent/payments?requestId=${item.requestId}`}
                    className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Pay Now
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
