import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Search } from "lucide-react";

import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";

/* ======================
   TYPES
====================== */
interface ParentDemoRequest {
  _id: string;
  academicNeeds: string[];
  status: string;
  createdAt: string;
  parent: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };


   // 🔥 Parent ne jis tutor ke liye request bheji
  requestedTutor: {
    _id: string;
    fullName: string;
    subjects?: string[];
  };

  // 🔥 Admin assigned tutor (optional)
  tutor?: {
    _id: string;
    fullName: string;
    subjects?: string[];
  } | null;
}

/* ======================
   STATUS PILL
====================== */
const StatusPill = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    contacted: "bg-blue-100 text-blue-800",
    assigned: "bg-indigo-100 text-indigo-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        colors[status] || "bg-gray-100 text-gray-800"
      }`}
    >
      {status}
    </span>
  );
};

/* ======================
   PAGE
====================== */
export default function ParentDemoRequestsPage() {
  const router = useRouter();

  const [requests, setRequests] = useState<ParentDemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  /* ======================
     FETCH
  ====================== */
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await adminApi.get("/admin/parent-requests");
        setRequests(res.data.data);
      } catch (err) {
        alert("Failed to load parent demo requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  /* ======================
     FILTER
  ====================== */
  const filteredRequests = useMemo(() => {
    return requests
      .filter(
        (r) => statusFilter === "all" || r.status === statusFilter
      )
     .filter(
  (r) =>
    r.parent.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    r.tutor?.fullName
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase()) ||
    r.requestedTutor.fullName
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
);

  }, [requests, searchQuery, statusFilter]);

  /* ======================
     UI
  ====================== */
  return (
    <AdminDashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">
            Parent Demo Requests
          </h1>
          <p className="text-sm text-gray-500">
            Manage demo class requests from parents
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow sm:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              placeholder="Search parent or tutor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border px-10 py-2"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="contacted">Contacted</option>
            <option value="assigned">Assigned</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <p>Loading...</p>
        ) : filteredRequests.length === 0 ? (
          <p className="text-gray-500">No demo requests found</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Parent</th>
                  <th className="p-4 text-left">Tutor</th>
                  <th className="p-4 text-left">Subjects</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Requested</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-t hover:bg-gray-50"
                  >
                    {/* Parent */}
                    <td
                      className="p-4 font-medium text-blue-600 cursor-pointer hover:underline"
                      onClick={() =>
                        router.push(
                          `/admin/parent/${req.parent._id}`
                        )
                      }
                    >
                      {req.parent.fullName}
                      <div className="text-xs text-gray-500">
                        {req.parent.email}
                      </div>
                    </td>

                    {/* Tutor */}
               <td
                  className={`p-4 ${
                    req.tutor || req.requestedTutor
                      ? "text-blue-600 cursor-pointer hover:underline"
                      : "text-gray-400"
                  }`}
                  onClick={() => {
                    const tutorId =
                      req.tutor?._id || req.requestedTutor?._id;

                    if (tutorId) {
                      router.push(`/admin/tutor/${tutorId}`);
                    }
                  }}
                >
                  {req.tutor
                    ? req.tutor.fullName
                    : req.requestedTutor?.fullName || "—"}
                </td>


                    {/* Subjects */}
                    <td className="p-4">
                      {req.academicNeeds.join(", ")}
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <StatusPill status={req.status} />
                    </td>

                    {/* Time */}
                    <td className="p-4">
                      {new Date(
                        req.createdAt
                      ).toLocaleString()}
                    </td>

                    {/* Action */}
                    <td className="p-4">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/parent-demo-requests/${req._id}`
                          )
                        }
                        className="text-sm text-indigo-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
