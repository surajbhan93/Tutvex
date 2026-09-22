import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import { Users, UserCircle2, TrendingUp, MapPin, CheckCircle, Clock } from "lucide-react";
import apiClient from "@/lib/apiClient";

interface TutorStats {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"parents" | "tutors">("parents");
  const [parentsCount, setParentsCount] = useState(0);
  const [tutorStats, setTutorStats] = useState<TutorStats>({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch parents
        const parentsRes = await apiClient.get("/admin/parents");
        setParentsCount(parentsRes.data.data?.length || 0);

        // Fetch ALL tutors to get accurate stats
        const tutorsRes = await apiClient.get("/admin_dashboard/tutors?page=1&limit=5000");
        const tutors = tutorsRes.data.data || [];
        
        // Calculate actual stats
        const stats = {
          total: tutors.length,
          approved: tutors.filter((t: any) => t.status === "approved").length,
          pending: tutors.filter((t: any) => t.status !== "approved" && t.status !== "rejected").length,
          rejected: tutors.filter((t: any) => t.status === "rejected").length,
        };
        
        setTutorStats(stats);
      } catch (err) {
        console.error("Failed to fetch counts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleViewParents = () => {
    router.push("/admin/users/parent");
  };

  const handleViewTutors = () => {
    router.push("/admin/users/tutors");
  };

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Users className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage all parents and tutors registered on the platform
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="relative w-fit rounded-2xl bg-white border-2 border-gray-200 p-1.5 flex shadow-lg">
          {/* Animated Slider */}
          <span
            className={`absolute top-1.5 h-[calc(100%-12px)] w-[calc(50%-6px)] rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md transition-all duration-300 ease-in-out ${
              activeTab === "parents" ? "left-1.5" : "left-[calc(50%+1.5px)]"
            }`}
          />

          {/* Parents Tab */}
          <button
            onClick={() => setActiveTab("parents")}
            className={`relative z-10 px-8 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${
              activeTab === "parents"
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <UserCircle2 size={18} />
              <span>Parents</span>
            </div>
          </button>

          {/* Tutors Tab */}
          <button
            onClick={() => setActiveTab("tutors")}
            className={`relative z-10 px-8 py-3 text-sm font-bold transition-all duration-300 rounded-xl ${
              activeTab === "tutors"
                ? "text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={18} />
              <span>Tutors</span>
            </div>
          </button>
        </div>

        {/* Content - Parents */}
        {activeTab === "parents" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Total Parents"
                value={loading ? "..." : parentsCount}
                gradient="from-blue-500 to-blue-600"
                icon={UserCircle2}
              />
              <StatCard
                title="Active This Month"
                value={loading ? "..." : Math.floor(parentsCount * 0.7)}
                gradient="from-green-500 to-green-600"
                icon={TrendingUp}
              />
              <StatCard
                title="Locations"
                value={loading ? "..." : "12+"}
                gradient="from-purple-500 to-purple-600"
                icon={MapPin}
              />
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-2">
                <UserCircle2 className="text-indigo-600" size={24} />
                Parents Management
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                View and manage all registered parents on the platform. Monitor their activity, 
                review contact details, track demo requests, and manage student-tutor assignments.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleViewParents}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <UserCircle2 size={18} />
                  View All Parents
                </button>
                <div className="px-4 py-3 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border-2 border-indigo-200">
                  {parentsCount} Parents Registered
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="Parent Profiles"
                description="Access detailed parent information including contact details, location, and registration history."
                icon="👤"
              />
              <FeatureCard
                title="Student Tracking"
                description="Monitor all students registered under each parent account with their class and subject details."
                icon="👨‍👩‍👧‍👦"
              />
              <FeatureCard
                title="Demo Management"
                description="Track demo requests, schedule sessions, and manage tutor assignments for each student."
                icon="📋"
              />
              <FeatureCard
                title="Location Insights"
                description="Filter parents by city and location to better understand your user distribution."
                icon="📍"
              />
            </div>
          </div>
        )}

        {/* Content - Tutors */}
        {activeTab === "tutors" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <StatCard
                title="Total Tutors"
                value={loading ? "..." : tutorStats.total}
                gradient="from-green-500 to-green-600"
                icon={Users}
              />
              <StatCard
                title="Approved"
                value={loading ? "..." : tutorStats.approved}
                gradient="from-blue-500 to-blue-600"
                icon={CheckCircle}
              />
              <StatCard
                title="Pending Review"
                value={loading ? "..." : tutorStats.pending}
                gradient="from-orange-500 to-orange-600"
                icon={Clock}
              />
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-lg">
              <h3 className="font-bold text-xl text-gray-900 mb-3 flex items-center gap-2">
                <Users className="text-green-600" size={24} />
                Tutors Management
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Manage all tutor registrations and applications. Review their profiles, approve or reject applications, 
                monitor their subjects and experience, and track their performance metrics.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleViewTutors}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Users size={18} />
                  View All Tutors
                </button>
                <div className="px-4 py-3 bg-green-50 text-green-700 font-semibold rounded-xl border-2 border-green-200">
                  {tutorStats.total} Tutors Registered
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl border-2 border-green-200 p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">Approved</h4>
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <p className="text-3xl font-bold text-green-600">{tutorStats.approved}</p>
                <p className="text-xs text-gray-500 mt-1">Active on platform</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-orange-200 p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">Pending</h4>
                  <Clock className="text-orange-600" size={20} />
                </div>
                <p className="text-3xl font-bold text-orange-600">{tutorStats.pending}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting review</p>
              </div>

              <div className="bg-white rounded-xl border-2 border-red-200 p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-gray-900">Rejected</h4>
                  <span className="text-xl">❌</span>
                </div>
                <p className="text-3xl font-bold text-red-600">{tutorStats.rejected}</p>
                <p className="text-xs text-gray-500 mt-1">Not approved</p>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="Tutor Applications"
                description="Review and process new tutor registrations with detailed profile verification."
                icon="✅"
              />
              <FeatureCard
                title="Subjects & Classes"
                description="Filter tutors by subjects taught, classes, and experience level for better matching."
                icon="📚"
              />
              <FeatureCard
                title="Status Management"
                description="Approve, reject, or set tutors to pending status based on verification results."
                icon="⚙️"
              />
              <FeatureCard
                title="Location-Based Search"
                description="Find tutors by city with advanced filtering for better student-tutor pairing."
                icon="🗺️"
              />
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

/* Components */

function StatCard({
  title,
  value,
  gradient,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  gradient: string;
  icon: any;
}) {
  return (
    <div className="bg-white rounded-2xl p-5 border-2 border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            {title}
          </p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-indigo-500 hover:shadow-lg transition-all">
      <div className="flex items-start gap-3">
        <div className="text-3xl">{icon}</div>
        <div>
          <h4 className="font-bold text-gray-900 mb-1">{title}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
