import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { 
  Search, Filter, Calendar, User, Mail, Phone, BookOpen, 
  Clock, CheckCircle, XCircle, Eye, AlertCircle, TrendingUp,
  Users, Bell, MessageSquare, Loader, ArrowUpRight, Target
} from "lucide-react";

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

  // Parent requested this tutor
  requestedTutor: {
    _id: string;
    fullName: string;
    subjects?: string[];
  };

  // Admin assigned tutor (optional)
  tutor?: {
    _id: string;
    fullName: string;
    subjects?: string[];
  } | null;

  urgency?: string;
  location?: {
    city?: string;
    area?: string;
  };
}

/* ======================
   STATUS BADGE
====================== */
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    pending: { 
      bg: 'bg-amber-50 border-amber-200', 
      text: 'text-amber-700',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    contacted: { 
      bg: 'bg-blue-50 border-blue-200', 
      text: 'text-blue-700',
      icon: MessageSquare,
      dot: 'bg-blue-500'
    },
    assigned: { 
      bg: 'bg-indigo-50 border-indigo-200', 
      text: 'text-indigo-700',
      icon: Users,
      dot: 'bg-indigo-500'
    },
    completed: { 
      bg: 'bg-emerald-50 border-emerald-200', 
      text: 'text-emerald-700',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    },
    cancelled: { 
      bg: 'bg-rose-50 border-rose-200', 
      text: 'text-rose-700',
      icon: XCircle,
      dot: 'bg-rose-500'
    },
  };

  const config = configs[status as keyof typeof configs] || configs.pending;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon size={14} />
      <span className="text-xs font-bold capitalize">{status}</span>
    </div>
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
    .filter((r) => r.parent && r.requestedTutor) // ← skip null records
    .filter((r) => statusFilter === "all" || r.status === statusFilter)
    .filter((r) => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return (
        r.parent?.fullName?.toLowerCase().includes(q) ||
        r.tutor?.fullName?.toLowerCase().includes(q) ||
        r.requestedTutor?.fullName?.toLowerCase().includes(q)
      );
    });
}, [requests, searchQuery, statusFilter]);
  /* ======================
     UI
  ====================== */
  
  // Calculate stats
  const stats = useMemo(() => ({
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    contacted: requests.filter(r => r.status === 'contacted').length,
    assigned: requests.filter(r => r.status === 'assigned').length,
    completed: requests.filter(r => r.status === 'completed').length,
    cancelled: requests.filter(r => r.status === 'cancelled').length,
  }), [requests]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-4">
            <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
            <p className="text-slate-600 font-medium text-lg">Loading demo requests...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Demo Requests
            </h1>
            <p className="mt-2 text-slate-600 text-lg">
              Manage parent demo class requests and assignments
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
            <Calendar className="text-indigo-600" size={20} />
            <span className="font-semibold text-slate-700">{stats.total} Total Requests</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard label="Total" value={stats.total} color="indigo" icon={Target} />
          <StatCard label="Pending" value={stats.pending} color="amber" icon={Clock} />
          <StatCard label="Contacted" value={stats.contacted} color="blue" icon={MessageSquare} />
          <StatCard label="Assigned" value={stats.assigned} color="purple" icon={Users} />
          <StatCard label="Completed" value={stats.completed} color="emerald" icon={CheckCircle} />
          <StatCard label="Cancelled" value={stats.cancelled} color="rose" icon={XCircle} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by parent, tutor, or subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium cursor-pointer bg-white min-w-[160px]"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="contacted">Contacted</option>
                <option value="assigned">Assigned</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Demo Requests Cards */}
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-16 text-center">
            <AlertCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Demo Requests Found</h3>
            <p className="text-slate-500">
              {requests.length === 0 
                ? "No demo requests have been submitted yet." 
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((req) => (
              <div key={req._id} className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:scale-[1.01] group">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Request Info */}
                  <div className="flex-1 space-y-4">
                    
                    {/* Parent & Tutor Row */}
                    <div className="flex flex-wrap items-start gap-6">
                      
                      {/* Parent Info */}
                      <div className="flex items-start gap-3 min-w-[200px]">
                        <div className="p-2 bg-rose-100 rounded-lg flex-shrink-0">
                          <User className="text-rose-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">Parent</p>
                          <button
                            onClick={() => router.push(`/admin/parent/${req.parent._id}`)}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block text-left"
                          >
                            {req.parent.fullName}
                          </button>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                            <Mail size={12} />
                            <span className="truncate">{req.parent.email}</span>
                          </div>
                          {req.parent.phone && (
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                              <Phone size={12} />
                              <span>{req.parent.phone}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden lg:block">
                        <ArrowUpRight className="text-slate-300" size={24} />
                      </div>

                      {/* Tutor Info */}
                      <div className="flex items-start gap-3 min-w-[200px]">
                        <div className="p-2 bg-indigo-100 rounded-lg flex-shrink-0">
                          <Users className="text-indigo-600" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">
                            {req.tutor ? 'Assigned Tutor' : 'Requested Tutor'}
                          </p>
                          <button
                            onClick={() => {
                              const tutorId = req.tutor?._id || req.requestedTutor?._id;
                              if (tutorId) router.push(`/admin/tutor/${tutorId}`);
                            }}
                            className="font-bold text-slate-900 hover:text-indigo-600 transition-colors truncate block text-left"
                          >
                            {req.tutor?.fullName || req.requestedTutor?.fullName || "—"}
                          </button>
                          {(req.tutor?.subjects || req.requestedTutor?.subjects) && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(req.tutor?.subjects || req.requestedTutor?.subjects)?.slice(0, 2).map((subject, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-xs font-medium">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Subjects & Details */}
                    <div className="flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="text-slate-400" size={16} />
                        <div className="flex flex-wrap gap-1">
                          {req.academicNeeds.map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      {req.location?.city && (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <div className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="font-medium">{req.location.city}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock size={12} />
                        <span>{new Date(req.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3">
                    <StatusBadge status={req.status} />
                    <button
                      onClick={() => router.push(`/admin/parent-demo-requests/${req._id}`)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105 group-hover:scale-105"
                    >
                      <Eye size={18} />
                      <span>View Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

/* ======================
   STAT CARD
====================== */
function StatCard({ 
  label, 
  value, 
  color,
  icon: Icon
}: { 
  label: string; 
  value: number; 
  color: string;
  icon: any;
}) {
  const colors = {
    indigo: 'from-indigo-500 to-purple-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-pink-500',
  };

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</p>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[color as keyof typeof colors]}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
      </div>
      <p className="text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}
