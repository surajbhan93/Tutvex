"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
// import NavBar from "@/components/navbar/NavBar";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
export default function TutorApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTutor = async (tutorId: string) => {
    try {
      const res = await apiClient.get(`/auth/admin/tutor/${tutorId}`);
      setTutor(res.data);
    } catch (err) {
      console.error("Failed to fetch tutor", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: "approved" | "rejected") => {
  if (!id) return;

  try {
    setUpdating(true);

    await apiClient.put(
      `/auth/admin/tutor/${id}/status`,   // ✅ correct URL
      { status }                          // ✅ body
    );

    alert(`Tutor ${status} successfully`);
    router.push("/admin/applications");
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  } finally {
    setUpdating(false);
  }
};


  useEffect(() => {
    if (!router.isReady) return;
    if (typeof id !== "string") return;

    fetchTutor(id);
  }, [router.isReady, id]);

  if (loading) return <p className="p-6">Loading tutor details...</p>;
  if (!tutor) return <p className="p-6">Tutor not found</p>;

const isFinalized = tutor.status !== "pending";

  return (
    <div className="min-h-screen bg-gray-100">
     <AdminDashboardLayout>

      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tutor Verification</h1>
            <p>
          <strong>Phone Verified:</strong>{" "}
          {tutor.phone_verified ? "✅ Yes" : "❌ No"}
        </p>

        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          {/* BASIC INFO */}
          <h2 className="text-lg font-semibold border-b pb-2">Basic Info</h2>
          <p><strong>Name:</strong> {tutor.fullName}</p>
          <p><strong>Email:</strong> {tutor.email}</p>
          <p><strong>Phone:</strong> {tutor.phone}</p>
          <p><strong>Role:</strong> {tutor.role}</p>
          <p><strong>Status:</strong> {tutor.status}</p>

          {/* ACADEMIC INFO */}
          <h2 className="text-lg font-semibold border-b pb-2 mt-4">Academic Info</h2>
          <p><strong>Qualification:</strong> {tutor.qualification}</p>
          <p><strong>College:</strong> {tutor.college}</p>
          <p><strong>Experience:</strong> {tutor.yearsOfExperience} years</p>

          {/* TEACHING INFO */}
          <h2 className="text-lg font-semibold border-b pb-2 mt-4">Teaching Details</h2>
          <p>
            <strong>Subjects:</strong>{" "}
            {tutor.subjects?.length ? tutor.subjects.join(", ") : "N/A"}
          </p>
          <p>
            <strong>Languages:</strong>{" "}
            {tutor.languages?.length ? tutor.languages.join(", ") : "N/A"}
          </p>
          <p>
            <strong>Classes Taught:</strong>{" "}
            {tutor.classesTaught?.length ? tutor.classesTaught.join(", ") : "N/A"}
          </p>

          {/* META INFO */}
          <h2 className="text-lg font-semibold border-b pb-2 mt-4">Meta Info</h2>
          <p><strong>Price:</strong> ₹{tutor.price}</p>
          <p><strong>Rating:</strong> {tutor.rating}</p>
          <p><strong>Testimonial:</strong> {tutor.testimonial || "—"}</p>
          <p>
            <strong>Applied On:</strong>{" "}
            {new Date(tutor.createdAt).toLocaleString()}
          </p>

          {/* ACTION BUTTONS */}
          <div className="flex gap-4 pt-6">
            {/* <button
              disabled={updating}
              onClick={() => updateStatus("approved")}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Approve
            </button>

            <button
              disabled={updating}
              onClick={() => updateStatus("rejected")}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Reject
            </button> */}

            <button
            disabled={updating || isFinalized}
            onClick={() => updateStatus("approved")}
            className={`px-4 py-2 rounded text-white ${
              isFinalized ? "bg-gray-400" : "bg-green-600"
            }`}
                >
                  Approve
                </button>

                <button
                  disabled={updating || isFinalized}
                  onClick={() => updateStatus("rejected")}
                  className={`px-4 py-2 rounded text-white ${
                    isFinalized ? "bg-gray-400" : "bg-red-600"
                  }`}
                >
                  Reject
                </button>

          </div>
        </div>
      </div>
    </AdminDashboardLayout>
    </div>
  );
}
