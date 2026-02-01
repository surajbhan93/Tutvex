"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import toast from "react-hot-toast";

import { motion } from "framer-motion";
import {  Users, School } from "lucide-react";
import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  FileText,
  UploadCloud,
  CheckCircle,
  
} from "lucide-react";

export default function AssignmentDetailPage() {
  const router = useRouter();
  const { assignmentId } = router.query;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  /* ======================
     FETCH ASSIGNMENT DETAIL
  ====================== */
  useEffect(() => {
    if (!assignmentId) return;

    apiClient
      .get(`/parent/assignments/${assignmentId}`)
      .then((res) => setData(res.data.data))
      .catch(() => toast.error("Failed to load assignment"))
      .finally(() => setLoading(false));
  }, [assignmentId]);

  /* ======================
     SUBMIT ASSIGNMENT
  ====================== */
  const submitAssignment = async () => {
   if (!file) {
    toast.error("Please select a file");
    return;
  }
    if (!data?.assignment?._id) {
    toast.error("Assignment ID missing");
    return;
  }
    const formData = new FormData();
    formData.append("file", file);
    try {
      setSubmitting(true);
      await apiClient.post(
        `/student/assignments/${data.assignment._id}/submit`,
        formData
      );
      toast.success("Assignment submitted successfully");
    } catch (err: any) {
      toast.error(
        err.response?.data?.error || "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <ParentDashboardLayout>
        <div className="p-6 text-gray-500">Loading...</div>
      </ParentDashboardLayout>
    );

  if (!data)
    return (
      <ParentDashboardLayout>
        
        <div className="p-6 text-gray-500">
          Assignment not found
        </div>
      </ParentDashboardLayout>
    );

  const assignment = data.assignment;

  // 🔥 STATUS (UI only)
  const submissionStatus =
    data.status || data.studentAssignment?.status || "Pending";

  const isSubmitted =
    submissionStatus === "Submitted" ||
    submissionStatus === "Checked";

  const statusStyle =
    submissionStatus === "Checked"
      ? "bg-green-100 text-green-700"
      : submissionStatus === "Submitted"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <ParentDashboardLayout>
      {/* text content */}
        <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-md"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-lg font-bold tracking-wide">
            Assignment Submission Guidelines
          </h2>
          <p className="mt-1 max-w-xl text-sm text-blue-100">
            Complete your assignment honestly. Do not cheat. 
            Write the assignment properly, take clear screenshots or photos,
            convert them into a single PDF file, and upload it here.
          </p>
        </div>

        {/* RIGHT TAGS */}
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
            <School className="h-4 w-4" />
            Institution
          </span>

          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
            <GraduationCap className="h-4 w-4" />
            Student Responsibility
          </span>

          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
            <Users className="h-4 w-4" />
            Parent Supervision
          </span>
        </div>
      </div>
    </motion.div>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl space-y-6 rounded-xl bg-gradient-to-r from-white to-blue-50 p-6 shadow-sm"
        >
          {/* ================= HEADER ================= */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <h1 className="text-2xl font-bold">
                {assignment.title}
              </h1>
            </div>

            {/* STATUS BADGE */}
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle}`}
            >
              {submissionStatus}
            </span>
          </div>

          {/* ================= META ================= */}
          <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4" />
              {assignment.subject} — {assignment.class_grade}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {assignment.due_date || "No due date"}
            </div>
          </div>

          {/* ================= INSTRUCTIONS ================= */}
          {assignment.instructions && (
            <div className="rounded-lg bg-indigo-50 p-4 text-sm">
              <p className="mb-1 font-semibold text-indigo-700">
                Instructions
              </p>
              <p className="text-gray-700">
                {assignment.instructions}
              </p>
            </div>
          )}

          {/* ================= ATTACHMENTS ================= */}
          {assignment.attachments?.length > 0 && (
            <div>
              <p className="mb-2 font-semibold">
                Attachments
              </p>
              <ul className="space-y-2">
                {assignment.attachments.map((f: any) => (
                  <li key={f.url}>
                    <a
                      href={f.url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 text-sm text-blue-600 underline"
                    >
                      <FileText className="h-4 w-4" />
                      {f.filename}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ================= SUBMISSION ================= */}
          <div className="rounded-lg border bg-white p-4">
            <p className="mb-2 font-semibold">
              Submit Assignment
            </p>

            {isSubmitted ? (
              <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                <CheckCircle className="h-4 w-4" />
                Assignment already submitted. Waiting for review.
              </div>
            ) : (
              <>
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50 p-4 text-sm text-blue-700 hover:bg-blue-100">
                  <UploadCloud className="mb-1 h-6 w-6" />
                  {file ? file.name : "Click to upload file"}
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] || null)
                    }
                  />
                </label>

                <button
                  disabled={submitting}
                  onClick={submitAssignment}
                  className="mt-4 w-full rounded-md bg-blue-600 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting
                    ? "Submitting..."
                    : "Submit Assignment"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </ParentDashboardLayout>
  );
}
