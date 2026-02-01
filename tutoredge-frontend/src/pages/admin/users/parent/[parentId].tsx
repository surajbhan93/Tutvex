import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";

/* ======================
   TYPES
====================== */
interface ParentDashboard {
  parent: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };

  students: {
    total: number;
    classWise: Record<string, number>;
  };

  demoRequests: {
    total: number;
    statusWise: Record<string, number>;
  };

  studentTutorMap: {
    student: {
      full_name: string;
      class_grade: string;
    };
    tutor: {
      fullName: string;
      subjects: string[];
    } | null;
  }[];
}

/* ======================
   PAGE
====================== */
export default function ParentDashboardPage() {
  const router = useRouter();
  const { parentId } = router.query;

  const [data, setData] = useState<ParentDashboard | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!parentId) return;

    const fetchDashboard = async () => {
      try {
        const res = await adminApi.get(
          `/admin/parent-dashboard/${parentId}`
        );
        setData(res.data.data);
      } catch (err) {
        alert("Failed to load parent dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [parentId]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <p>Loading dashboard...</p>
      </AdminDashboardLayout>
    );
  }

  if (!data) {
    return (
      <AdminDashboardLayout>
        <p>No data found</p>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">
              Parent Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              {data.parent.fullName}
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* PARENT INFO */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="font-semibold mb-2">Parent Info</h2>
          <p><b>Name:</b> {data.parent.fullName}</p>
          <p><b>Email:</b> {data.parent.email}</p>
          {data.parent.phone && <p><b>Phone:</b> {data.parent.phone}</p>}
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* STUDENTS */}
          <div className="rounded-xl border bg-white p-4 shadow">
            <h2 className="font-semibold mb-2">Students</h2>
            <p><b>Total:</b> {data.students.total}</p>

            <div className="mt-2 text-sm text-gray-600">
              {Object.entries(data.students.classWise).map(
                ([cls, count]) => (
                  <p key={cls}>
                    Class {cls}: {count}
                  </p>
                )
              )}
            </div>
          </div>

          {/* DEMO REQUESTS */}
          <div className="rounded-xl border bg-white p-4 shadow">
            <h2 className="font-semibold mb-2">
              Demo Requests
            </h2>
            <p><b>Total:</b> {data.demoRequests.total}</p>

            <div className="mt-2 text-sm text-gray-600">
              {Object.entries(data.demoRequests.statusWise).map(
                ([status, count]) => (
                  <p key={status}>
                    {status}: {count}
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        {/* STUDENT → TUTOR MAP */}
        <div className="rounded-xl border bg-white p-4 shadow">
          <h2 className="font-semibold mb-3">
            Student – Tutor Mapping
          </h2>

          {data.studentTutorMap.length === 0 ? (
            <p className="text-gray-500 text-sm">
              No tutor assigned yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.studentTutorMap.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center rounded-lg border p-3"
                >
                  <div>
                    <p className="font-medium">
                      {item.student.full_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Class {item.student.class_grade}
                    </p>
                  </div>

                  <div className="text-sm">
                    {item.tutor ? (
                      <>
                        <p className="font-medium">
                          {item.tutor.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.tutor.subjects.join(", ")}
                        </p>
                      </>
                    ) : (
                      <p className="text-gray-400">
                        Not Assigned
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminDashboardLayout>
  );
}
