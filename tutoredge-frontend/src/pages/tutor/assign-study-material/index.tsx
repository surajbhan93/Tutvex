"use client";

import { useEffect, useState } from "react";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import apiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";

/* ======================
   TYPES
====================== */
interface ParentAssignmentItem {
  _id: string; // student-assignment ID
  status: "Pending" | "Submitted" | "Checked";
  due_date: string;
  assigned_at: string;

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
   STATUS BADGE HELPER
====================== */
const getStatusBadge = (status: string) => {
  switch (status) {
    case "Submitted":
      return {
        label: "Submitted",
        className: "bg-blue-50 text-blue-700",
      };
    case "Checked":
      return {
        label: "Checked",
        className: "bg-green-50 text-green-700",
      };
    case "Pending":
    default:
      return {
        label: "Pending",
        className: "bg-yellow-50 text-yellow-700",
      };
  }
};

export default function ParentAssignmentsPage() {
  const [assignments, setAssignments] =
    useState<ParentAssignmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  /* ======================
     FETCH PARENT ASSIGNMENTS
  ====================== */
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get("/parent/assignments");
        setAssignments(res.data.data || []);
      } catch (err) {
        console.error("Failed to load assignments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  return (
    <ParentDashboardLayout>
      <br />

      <h1 className="mb-4 text-2xl font-bold">Assignments</h1>

      <div className="overflow-hidden rounded-xl border bg-white">
        {/* HEADER */}
        <div className="grid grid-cols-6 border-b bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700">
          <div>Title</div>
          <div>Student</div>
          <div>Tutor</div>
          <div>Due</div>
          <div>Status</div>
          <div className="text-right">Action</div>
        </div>

        {/* BODY */}
        {loading ? (
          <div className="px-4 py-6 text-sm text-gray-500">
            Loading assignments...
          </div>
        ) : assignments.length > 0 ? (
          assignments.map((a) => {
            const badge = getStatusBadge(a.status);

            return (
              <div
                key={a._id}
                className="grid grid-cols-6 items-center px-4 py-3 text-sm text-gray-700 border-b"
              >
                {/* Title */}
                <div className="font-medium">
                  {a.assignment.title}
                </div>

                {/* Student */}
                <div>
                  {a.student.full_name} ({a.student.class_grade})
                </div>

                {/* Tutor */}
                <div>{a.tutor.fullName}</div>

                {/* Due */}
                <div>
                  {a.due_date
                    ? new Date(a.due_date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })
                    : "—"}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`rounded-md px-2 py-1 text-xs font-medium ${badge.className}`}
                  >
                    {badge.label}
                  </span>
                </div>

                {/* Action */}
                <div className="text-right">
                  <button
                    onClick={() =>
                      router.push(`/parent/assignments/${a._id}`)
                    }
                    className="rounded-md bg-blue-600 px-3 py-1 text-sm font-semibold text-white"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-6 text-sm text-gray-500">
            No assignments found.
          </div>
        )}
      </div>
    </ParentDashboardLayout>
  );
}
