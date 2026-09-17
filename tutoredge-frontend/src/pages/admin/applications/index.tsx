import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";

interface TutorApplication {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
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
        "/auth/tutor-applications?status=pending&limit=2000"
      );

      console.log("📊 API Response:", res.data);
      console.log("📊 First application:", res.data[0]);

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

  const handleApprove = async (appId: string) => {
    if (!confirm("Are you sure you want to approve this tutor application?")) {
      return;
    }
    
    try {
      await apiClient.patch(`/auth/tutor-applications/${appId}`, {
        status: "approved"
      });
      
      // Remove from list or refresh
      setApplications(prev => prev.filter(app => app._id !== appId));
      alert("Tutor application approved successfully!");
    } catch (err: any) {
      alert("Failed to approve application. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <p className="text-gray-600">Loading tutor applications...</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <p className="text-red-600">{error}</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminDashboardLayout>
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Tutor Applications</h1>

          {applications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-600">
                No phone-verified tutor applications pending approval.
              </p>
            </div>
          ) : (
            <div className="bg-white shadow-lg rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Mobile Number</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Address</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Approve</th>
                      <th className="p-4 text-left font-semibold text-gray-700">View</th>
                    </tr>
                  </thead>

                  <tbody>
                    {applications.map((app) => {
                      const address = [app.city, app.state].filter(Boolean).join(", ") || "Not provided";
                      
                      return (
                        <tr key={app._id} className="border-t hover:bg-gray-50 transition-colors">
                          <td className="p-4 font-medium text-gray-800">{app.name}</td>
                          <td className="p-4 text-gray-600">{app.email}</td>
                          <td className="p-4 text-gray-600">{app.phone || "Not provided"}</td>
                          <td className="p-4 text-gray-600">{address}</td>
                          <td className="p-4 text-gray-600">
                            {new Date(app.appliedDate).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => handleApprove(app._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm hover:shadow-md"
                            >
                              Approve
                            </button>
                          </td>
                          <td className="p-4">
                            <Link
                              href={`/admin/applications/${app._id}`}
                              className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                            >
                              View & Verify
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </AdminDashboardLayout>
    </div>
  );
}
