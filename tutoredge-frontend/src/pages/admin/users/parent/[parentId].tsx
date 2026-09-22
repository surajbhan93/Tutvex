import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import apiClient from "@/lib/apiClient";
import {
  User,
  Users,
  ClipboardList,
  GraduationCap,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  UserCircle2,
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
        const res = await apiClient.get(
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
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!data) {
    return (
      <AdminDashboardLayout>
        <div className="p-6 text-center">
          <p className="text-gray-500">No data found</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  const locationStr = data.parent.location
    ? [data.parent.location.area, data.parent.location.city, data.parent.location.state]
        .filter(Boolean)
        .join(", ")
    : "Not provided";

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* HEADER with Back Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Parent Dashboard
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Complete overview of {data.parent.fullName}'s account
            </p>
          </div>

          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-indigo-500 transition-all shadow-sm"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* PARENT INFO CARD - Premium Design */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <div className="flex items-center gap-3 text-white">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <UserCircle2 size={24} />
              </div>
              <h2 className="font-bold text-xl">Parent Information</h2>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="flex items-start gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {data.parent.fullName?.charAt(0).toUpperCase() || "P"}
                </div>
              </div>

              {/* Info Grid */}
              <div className="flex-1 grid sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg mt-0.5">
                    <User size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Full Name</p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">{data.parent.fullName}</p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg mt-0.5">
                    <Mail size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Email</p>
                    <a 
                      href={`mailto:${data.parent.email}`}
                      className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 hover:underline mt-0.5 block"
                    >
                      {data.parent.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                {data.parent.phone && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-green-50 rounded-lg mt-0.5">
                      <Phone size={18} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase">Phone</p>
                      <a 
                        href={`tel:${data.parent.phone}`}
                        className="text-sm font-semibold text-green-600 hover:text-green-800 hover:underline mt-0.5 block"
                      >
                        {data.parent.phone}
                      </a>
                    </div>
                  </div>
                )}

                {/* Location */}
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg mt-0.5">
                    <MapPin size={18} className="text-orange-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Location</p>
                    <p className="text-sm font-semibold text-gray-900 mt-0.5">{locationStr}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS - Enhanced Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Students"
            value={data.students.total}
            icon={Users}
            gradient="from-blue-500 to-blue-600"
            subtext="Registered"
          />
          <StatCard
            title="Demo Requests"
            value={data.demoRequests.total}
            icon={ClipboardList}
            gradient="from-purple-500 to-purple-600"
            subtext="All Time"
          />
          <StatCard
            title="Assigned Tutors"
            value={data.studentTutorMap.filter(i => i.tutor).length}
            icon={GraduationCap}
            gradient="from-green-500 to-green-600"
            subtext="Active"
          />
        </div>

        {/* BREAKDOWN - Side by Side */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* STUDENTS CLASSWISE */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <TrendingUp size={20} />
                Students by Class
              </h3>
            </div>
            <div className="p-6">
              {Object.keys(data.students.classWise).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No students yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(data.students.classWise).map(([cls, count]) => (
                    <div
                      key={cls}
                      className="flex justify-between items-center border-2 border-gray-200 rounded-xl px-4 py-3 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <span className="font-semibold text-gray-700">Class {cls}</span>
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-md">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* DEMO STATUS */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-6 py-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <ClipboardList size={20} />
                Demo Request Status
              </h3>
            </div>
            <div className="p-6">
              {Object.keys(data.demoRequests.statusWise).length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">No demo requests</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(data.demoRequests.statusWise).map(([status, count]) => {
                    const statusConfig: any = {
                      completed: { icon: CheckCircle2, color: "from-green-500 to-green-600", border: "border-green-500", bg: "bg-green-50" },
                      pending: { icon: Clock, color: "from-yellow-500 to-yellow-600", border: "border-yellow-500", bg: "bg-yellow-50" },
                      cancelled: { icon: XCircle, color: "from-red-500 to-red-600", border: "border-red-500", bg: "bg-red-50" },
                    };
                    const config = statusConfig[status] || { icon: Clock, color: "from-gray-500 to-gray-600", border: "border-gray-500", bg: "bg-gray-50" };
                    const StatusIcon = config.icon;

                    return (
                      <div
                        key={status}
                        className={`flex justify-between items-center border-2 ${config.border} rounded-xl px-4 py-3 hover:${config.bg} transition-all`}
                      >
                        <div className="flex items-center gap-2">
                          <StatusIcon size={18} className="text-gray-700" />
                          <span className="font-semibold text-gray-700 capitalize">{status}</span>
                        </div>
                        <span className={`px-3 py-1 bg-gradient-to-r ${config.color} text-white font-bold rounded-lg shadow-md`}>
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* STUDENT → TUTOR MAP - Enhanced Table */}
        <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Users size={20} />
              Student – Tutor Assignments
            </h3>
          </div>

          <div className="p-6">
            {data.studentTutorMap.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-3">
                  <Users size={32} className="text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">No tutor assignments yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data.studentTutorMap.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-2 border-gray-200 rounded-xl p-4 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                  >
                    {/* Student Info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-md">
                        {item.student.full_name?.charAt(0).toUpperCase() || "S"}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.student.full_name}</p>
                        <p className="text-xs text-gray-500 font-medium">
                          Class {item.student.class_grade}
                        </p>
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:block">
                      <div className="px-3 py-1 bg-gray-100 rounded-lg">
                        <span className="text-gray-400 font-bold">→</span>
                      </div>
                    </div>

                    {/* Tutor Info */}
                    <div className="text-left sm:text-right">
                      {item.tutor ? (
                        <div className="flex items-center gap-3 sm:flex-row-reverse">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white font-bold shadow-md">
                            {item.tutor.fullName?.charAt(0).toUpperCase() || "T"}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{item.tutor.fullName}</p>
                            <p className="text-xs text-gray-500 font-medium">
                              {item.tutor.subjects.join(", ")}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="px-4 py-2 bg-gray-100 text-gray-500 rounded-lg font-semibold text-sm">
                          Not Assigned
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
  gradient = "from-blue-500 to-blue-600",
  subtext,
}: {
  title: string;
  value: number;
  icon: any;
  gradient?: string;
  subtext?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 font-medium mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
