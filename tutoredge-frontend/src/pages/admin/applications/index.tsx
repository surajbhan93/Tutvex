"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
// import NavBar from "@/components/navbar/NavBar";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
// interface TutorApplication {
//   _id: string;
//   name: string;
//   email: string;
//   status: "pending" | "approved" | "rejected";
//   appliedDate: string;
// }

interface TutorApplication {
  _id: string;
  id?: string;
  name: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}


export default function TutorApplicationsPage() {
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiClient.get<TutorApplication[]>(
        "/auth/tutor-applications?status=pending&limit=20"
      );

      // 🛡️ Safety: filter out invalid records
      const safeData = (res.data || []).filter(
        (app) => app && app._id
      );

      setApplications(safeData);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      setError("Failed to load tutor applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return <p className="p-6">Loading tutor applications...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
       <AdminDashboardLayout>

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Tutor Applications</h1>

        {applications.length === 0 ? (
          <p className="text-gray-600">
  No phone-verified tutor applications pending approval.
</p>

        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-200">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Applied On</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {applications.map((app) => (
                  <tr key={app._id} className="border-t">
                    <td className="p-3">{app.name}</td>
                    <td className="p-3">{app.email}</td>
                    <td className="p-3">
                      {new Date(app.appliedDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/admin/applications/${app._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View & Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
       </AdminDashboardLayout>
    </div>
  );
}
