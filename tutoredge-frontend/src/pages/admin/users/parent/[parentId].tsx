import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import adminApi from "@/lib/adminApi";
import {
  User,
  Users,
  ClipboardList,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

/* ======================
   TYPES
====================== */
interface ParentDashboard {
  parent: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
     // ✅ ADD LOCATION
    location?: {
      city?: string;
      area?: string;
      state?: string;
      country?: string;
      pincode?: string;
    };
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
      } catch {
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
        <div className="p-6 text-gray-500">Loading dashboard...</div>
      </AdminDashboardLayout>
    );
  }

  if (!data) {
    return (
      <AdminDashboardLayout>
        <div className="p-6 text-gray-500">No data found</div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold">Parent Dashboard</h1>
            <p className="text-sm text-gray-500">
              {data.parent.fullName}
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:underline"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* PARENT INFO CARD */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-indigo-600" />
            <h2 className="font-semibold text-lg">
              Parent Information
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <p>
              <span className="font-medium">Name:</span>{" "}
              {data.parent.fullName}
            </p>
            <p>
              <span className="font-medium">Email:</span>{" "}
              {data.parent.email}
            </p>
            {data.parent.phone && (
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {data.parent.phone}
              </p>
            )}

             {/* ✅ LOCATION */}
        {data.parent.location && (
          <p>
            <span className="font-medium">Location:</span>{" "}
            {[data.parent.location.area, data.parent.location.city]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Students"
            value={data.students.total}
            icon={Users}
          />
          <StatCard
            title="Demo Requests"
            value={data.demoRequests.total}
            icon={ClipboardList}
          />
          <StatCard
            title="Assigned Tutors"
            value={
              data.studentTutorMap.filter(i => i.tutor).length
            }
            icon={GraduationCap}
          />
        </div>

        {/* BREAKDOWN */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* STUDENTS CLASSWISE */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-3">
              Students (Class-wise)
            </h3>

            <div className="space-y-2 text-sm">
              {Object.entries(data.students.classWise).map(
                ([cls, count]) => (
                  <div
                    key={cls}
                    className="flex justify-between border rounded-lg px-3 py-2"
                  >
                    <span>Class {cls}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>

          {/* DEMO STATUS */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-semibold text-lg mb-3">
              Demo Requests (Status)
            </h3>

            <div className="space-y-2 text-sm">
              {Object.entries(data.demoRequests.statusWise).map(
                ([status, count]) => (
                  <div
                    key={status}
                    className="flex justify-between border rounded-lg px-3 py-2"
                  >
                    <span className="capitalize">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* STUDENT → TUTOR MAP */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="font-semibold text-lg mb-4">
            Student – Tutor Mapping
          </h3>

          {data.studentTutorMap.length === 0 ? (
            <p className="text-sm text-gray-500">
              No tutor assigned yet
            </p>
          ) : (
            <div className="space-y-3">
              {data.studentTutorMap.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center border rounded-xl p-4 hover:bg-gray-50"
                >
                  <div>
                    <p className="font-medium">
                      {item.student.full_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Class {item.student.class_grade}
                    </p>
                  </div>

                  <div className="text-right text-sm">
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
                      <span className="text-gray-400">
                        Not Assigned
                      </span>
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

/* ======================
   COMPONENTS
====================== */

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: any;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
        <Icon size={22} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
