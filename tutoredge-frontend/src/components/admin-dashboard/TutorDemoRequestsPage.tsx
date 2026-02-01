"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";
// import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
/* ---------------- TYPES ---------------- */

interface TutorDemoRequest {
  _id: string;
  academicNeeds: string[];
  urgency: string;
  location: string;
  status: "pending" | "contacted" | "assigned" | "completed" | "cancelled";

  adminNote?: string;

  parent: {
    name: string;
    phone: string;
    email: string;
  };

 tutor: {
  _id: string;
  fullName: string; // 🔥 name → fullName
  phone: string;
  email: string;
  subjects?: string[];
};

interestedTutor: {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  subjects?: string[];
};


  student?: {
    name: string;
    class_grade: string;
  };
}


/* ---------------- HELPERS ---------------- */
const statusStyles: Record<string, string> = {
  contacted: "bg-purple-100 text-purple-800",
  assigned: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};



/* ---------------- PAGE ---------------- */
export default function TutorDemoRequestsPage() {
  const [requests, setRequests] = useState<TutorDemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/admin/tutor-demo-requests");
      setRequests(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load demo requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  /* -------- UPDATE STATUS -------- */
  const updateStatus = async (
    request: TutorDemoRequest,
    status: "assigned" | "completed" | "cancelled"
  ) => {
    const toastId = toast.loading("Updating request...");

    try {
      await apiClient.put(`/admin/tutor-demo-requests/${request._id}`, {
        status,
        tutorId: request.tutor._id, // (this is interestedTutor)

        adminNote:
          status === "assigned"
            ? "Tutor assigned by admin"
            : status === "completed"
            ? "Demo completed successfully"
            : "Request cancelled by admin",
      });

      toast.success("Request updated successfully", { id: toastId });
      fetchRequests();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Action failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Tutor Demo Requests
        </h1>
        <p className="mt-1 text-gray-500">
          Tutors interested in taking demo classes.
        </p>
      </div>

      {/* STATES */}
      {loading ? (
        <p className="text-center text-gray-500">
          Loading tutor demo requests...
        </p>
      ) : requests.length === 0 ? (
        <div className="rounded-lg border bg-white py-12 text-center text-gray-500">
          No tutor demo requests found.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {requests.map((r) => (
            <div
              key={r._id}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md space-y-4"
            >
              {/* HEADER */}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  Tutor Interested
                </h3>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[r.status]}`}
                >
                  {r.status.toUpperCase()}
                </span>
              </div>

              {/* REQUEST INFO */}
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <b>Subjects:</b> {r.academicNeeds.join(", ")}
                </p>
                <p>
                  <b>Location:</b> {r.location} • <b>Urgency:</b> {r.urgency}
                </p>
              </div>

              <hr />

              {/* TUTOR */}
            {/* TUTOR */}
{/* TUTOR */}
<div className="text-sm space-y-1">
  <p className="font-medium">Tutor (Interested)</p>

  {r.interestedTutor ? (
    <>
      {/* 🔥 YAHI LINE TUM PUCH RAHE THE */}
      <p>{r.interestedTutor.fullName}</p>

      <p className="text-gray-600">
        📞 {r.interestedTutor.phone} | ✉️ {r.interestedTutor.email}
      </p>

      {r.interestedTutor.subjects && (
        <p className="text-gray-600">
          <b>Subjects:</b> {r.interestedTutor.subjects.join(", ")}
        </p>
      )}
    </>
  ) : (
    <p className="italic text-gray-400">
      No tutor has shown interest yet
    </p>
  )}
</div>



              {/* PARENT */}
              <div className="text-sm space-y-1">
                <p className="font-medium">Parent</p>
                <p>{r.parent.name}</p>
                <p className="text-gray-600">
                  📞 {r.parent.phone} | ✉️ {r.parent.email}
                </p>
              </div>

              {/* STUDENT */}
              {r.student && (
                <div className="text-sm">
                  <b>Student:</b> {r.student.name} ({r.student.class_grade})
                </div>
              )}

              {/* NOTE */}
              {r.adminNote && (
                <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
                  📝 {r.adminNote}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-2 pt-2">
                <button
                  disabled={r.status !== "contacted"}
                  onClick={() => updateStatus(r, "assigned")}
                  className="rounded bg-blue-600 px-4 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-blue-700"
                >
                  Assign
                </button>

                <button
                  disabled={r.status !== "assigned"}
                  onClick={() => updateStatus(r, "completed")}
                  className="rounded bg-green-600 px-4 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-green-700"
                >
                  Complete
                </button>

                <button
                  disabled={r.status === "completed"}
                  onClick={() => updateStatus(r, "cancelled")}
                  className="rounded bg-red-600 px-4 py-1.5 text-sm text-white disabled:opacity-50 hover:bg-red-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
