import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";
import { Search, Users, Eye } from "lucide-react";

interface Parent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  // ✅ ADD
  location?: {
    city?: string;
    area?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
}

export default function ParentListPage() {
  const router = useRouter();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await adminApi.get("/admin/parents");
        setParents(res.data.data || []);
      } catch {
        alert("Failed to load parents");
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  /* ---------------- SEARCH ---------------- */
  const filteredParents = useMemo(() => {
    if (!search) return parents;
    const q = search.toLowerCase();
    return parents.filter(
      p =>
        p.fullName?.toLowerCase().includes(q) ||
        p.email?.toLowerCase().includes(q) ||
        p.phone?.toLowerCase().includes(q)
    );
  }, [parents, search]);

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold">Parents Management</h1>
          <p className="text-sm text-gray-600">
            View and manage all registered parents
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Parents" value={parents.length} />
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-gray-500">Loading parents...</div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Phone</th>
                  <th className="px-4 py-3 text-left">Location</th> {/* ✅ */}
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredParents.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-gray-500"
                    >
                      No parents found
                    </td>
                  </tr>
                )}

                {filteredParents.map(p => (
                  <tr
                    key={p._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 font-medium">
                      {p.fullName}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.email}
                    </td>
                    <td className="px-4 py-3">
                      {p.phone || "—"}
                    </td>
                     {/* ✅ LOCATION */}
    <td className="px-4 py-3 text-sm text-gray-600">
      {p.location ? (
        [p.location.area, p.location.city]
          .filter(Boolean)
          .join(", ") || "—"
      ) : (
        "—"
      )}
    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          router.push(
                            `/admin/users/parent/${p._id}`
                          )
                        }
                        className="inline-flex items-center gap-2 text-indigo-600 hover:underline"
                      >
                        <Eye size={16} /> View
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

/* ---------------- COMPONENTS ---------------- */

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4">
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
        <Users size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
