import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";

interface Parent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
}

export default function ParentListPage() {
  const router = useRouter();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await adminApi.get("/admin/parents");
        setParents(res.data.data);
      } catch {
        alert("Failed to load parents");
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold">Parents</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border bg-white shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Phone</th>
                  <th className="p-4 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {parents.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="p-4 font-medium">{p.fullName}</td>
                    <td className="p-4">{p.email}</td>
                    <td className="p-4">{p.phone || "—"}</td>
                    <td className="p-4">
                      <button
                        onClick={() =>
                          router.push(`/admin/users/parent/${p._id}`)
                        }
                        className="text-indigo-600 hover:underline"
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
