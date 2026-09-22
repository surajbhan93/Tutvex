import { useEffect, useState } from "react";
import Link from "next/link";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import { 
  Search, Check, X, User, Mail, Phone, MapPin, Calendar, 
  Filter, Eye, CheckCircle, XCircle, Clock, AlertCircle, 
  Loader, Users, TrendingUp
} from "lucide-react";
import toast from "react-hot-toast";

/* ---------------- TYPES ---------------- */
interface Parent {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  location?: {
    city?: string;
    area?: string;
  } | null;
}

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    pending: { 
      bg: 'bg-amber-50 border-amber-200', 
      text: 'text-amber-700',
      icon: Clock,
      dot: 'bg-amber-500'
    },
    approved: { 
      bg: 'bg-emerald-50 border-emerald-200', 
      text: 'text-emerald-700',
      icon: CheckCircle,
      dot: 'bg-emerald-500'
    },
    rejected: { 
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

/* ---------------- PAGE ---------------- */
export default function AdminParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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
    if (!confirm(`Are you sure you want to ${status} this parent?`)) return;

    try {
      setUpdatingId(parentId);
      await apiClient.patch(`/auth/admin/parent/${parentId}/status`, { status });
      toast.success(`Parent ${status} successfully!`);
      
      setParents((prev) =>
        prev.map((p) => (p._id === parentId ? { ...p, status } : p))
      );
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  /* ---------------- FILTER ---------------- */
  const filtered = parents.filter((p) => {
    const matchesSearch =
      p.fullName.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  /* ---------------- STATS ---------------- */
  const stats = {
    total: parents.length,
    pending: parents.filter(p => p.status === 'pending').length,
    approved: parents.filter(p => p.status === 'approved').length,
    rejected: parents.filter(p => p.status === 'rejected').length,
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-4">
            <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
            <p className="text-slate-600 font-medium text-lg">Loading parents...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <AdminDashboardLayout>
      <div className="space-y-6 p-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Parent Registrations
            </h1>
            <p className="mt-2 text-slate-600 text-lg">
              Manage and approve parent accounts
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
            <Users className="text-rose-600" size={20} />
            <span className="font-semibold text-slate-700">{stats.total} Total Parents</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Total" value={stats.total} color="indigo" icon={Users} />
          <StatCard label="Pending" value={stats.pending} color="amber" icon={Clock} />
          <StatCard label="Approved" value={stats.approved} color="emerald" icon={CheckCircle} />
          <StatCard label="Rejected" value={stats.rejected} color="rose" icon={XCircle} />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Parent Cards */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-16 text-center">
            <AlertCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Parents Found</h3>
            <p className="text-slate-500">
              {parents.length === 0 
                ? "No parent registrations yet." 
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((parent) => {
              const isPending = parent.status === 'pending';
              
              return (
                <div key={parent._id} className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:scale-[1.01] group">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Parent Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Avatar */}
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white text-2xl font-black shadow-md flex-shrink-0">
                        {parent.fullName.charAt(0).toUpperCase()}
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{parent.fullName}</h3>
                            <div className="flex flex-wrap items-center gap-4 mt-2">
                              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Mail size={14} className="text-indigo-500" />
                                <span>{parent.email}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                <Phone size={14} className="text-emerald-500" />
                                <span>{parent.phone}</span>
                              </div>
                              {parent.location?.city && (
                                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                  <MapPin size={14} className="text-rose-500" />
                                  <span>{parent.location.area ? `${parent.location.area}, ` : ''}{parent.location.city}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <StatusBadge status={parent.status} />
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={12} />
                          <span>Joined on {new Date(parent.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {isPending ? (
                        <>
                          <button
                            disabled={updatingId === parent._id}
                            onClick={() => updateStatus(parent._id, "approved")}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
                          >
                            {updatingId === parent._id ? (
                              <Loader className="animate-spin" size={18} />
                            ) : (
                              <CheckCircle size={18} />
                            )}
                            <span>Approve</span>
                          </button>

                          <button
                            disabled={updatingId === parent._id}
                            onClick={() => updateStatus(parent._id, "rejected")}
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
                          >
                            {updatingId === parent._id ? (
                              <Loader className="animate-spin" size={18} />
                            ) : (
                              <XCircle size={18} />
                            )}
                            <span>Reject</span>
                          </button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-slate-500 text-sm font-medium">
                          <AlertCircle size={16} />
                          <span>No actions available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

/* ---------------- STAT CARD ---------------- */
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
