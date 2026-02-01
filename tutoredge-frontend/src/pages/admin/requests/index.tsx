"use client";

import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import { Search, Check, X } from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- TYPES ---------------- */
interface Parent {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

/* ---------------- PAGE ---------------- */
export default function AdminParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */
  const fetchParents = async () => {
    try {
      const res = await apiClient.get("/auth/admin/parents");
      setParents(res.data);
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to load parents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  /* ---------------- UPDATE STATUS ---------------- */
  const updateStatus = async (
    parentId: string,
    status: "approved" | "rejected"
  ) => {
    try {
      setUpdatingId(parentId);

      await apiClient.patch(`/auth/admin/parent/${parentId}/status`, {
        status
      });

      toast.success(`Parent ${status}`);

      // update UI instantly
      setParents((prev) =>
        prev.map((p) =>
          p._id === parentId ? { ...p, status } : p
        )
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filtered = parents.filter(
    (p) =>
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <AdminDashboardLayout title="Parents">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parents</h1>

        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <input
            className="pl-9 pr-3 py-2 border rounded-md text-sm w-72"
            placeholder="Search by name / phone / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center">
                  No parents found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3 font-medium">{p.fullName}</td>
                  <td className="p-3">{p.email}</td>
                  <td className="p-3">{p.phone}</td>

                  {/* Status */}
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          p.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : p.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    {p.status === "pending" ? (
                      <div className="flex gap-2">
                        <button
                          disabled={updatingId === p._id}
                          onClick={() => updateStatus(p._id, "approved")}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                        >
                          <Check size={14} /> Approve
                        </button>

                        <button
                          disabled={updatingId === p._id}
                          onClick={() => updateStatus(p._id, "rejected")}
                          className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                        >
                          <X size={14} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No actions
                      </span>
                    )}
                  </td>

                  <td className="p-3 text-xs text-gray-500">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminDashboardLayout>
  );
}
