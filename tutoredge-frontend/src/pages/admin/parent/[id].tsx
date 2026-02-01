import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import adminApi from "@/lib/adminApi";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";

export default function ParentProfilePage() {
  const router = useRouter();
  const { id } = router.query;
  const [parent, setParent] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    adminApi.get(`/users/${id}`).then((res) => {
      setParent(res.data);
    });
  }, [id]);

  if (!parent) return <p>Loading...</p>;

  return (
    <AdminDashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Parent Profile</h1>

      <div className="bg-white rounded-xl p-6 shadow space-y-3">
        <p><b>Name:</b> {parent.fullName}</p>
        <p><b>Email:</b> {parent.email}</p>
        <p><b>Phone:</b> {parent.phone}</p>
        <p><b>Role:</b> {parent.role}</p>
        <p><b>Joined:</b> {new Date(parent.createdAt).toLocaleDateString()}</p>
      </div>
    </AdminDashboardLayout>
  );
}
