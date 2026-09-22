import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { Search, Filter, UserCheck, Clock, CheckCircle, XCircle, Eye, Download, Mail, Phone, MapPin, AlertCircle, LayoutDashboard } from 'lucide-react';

interface TutorApplication {
  _id: string;
  id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  profileImage?: string;
}

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
  
  const config = configs[status.toLowerCase() as keyof typeof configs] || configs.pending;
  const Icon = config.icon;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon size={14} />
      <span className="text-xs font-semibold capitalize">{status}</span>
    </div>
  );
};

export default function TutorApplicationsPage() {
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiClient.get<TutorApplication[]>(
        "/auth/tutor-applications?status=pending&limit=2000"
      );

      const safeData = (res.data || []).filter((app) => app && app._id);
      setApplications(safeData);
    } catch (err) {
      console.error("Failed to fetch applications", err);
      setError("Failed to load tutor applications");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (appId: string) => {
    if (!confirm("Are you sure you want to approve this tutor application?")) {
      return;
    }
    
    try {
      await apiClient.patch(`/auth/tutor-applications/${appId}`, {
        status: "approved"
      });
      
      setApplications(prev => prev.filter(app => app._id !== appId));
      alert("Tutor application approved successfully!");
    } catch (err: any) {
      alert("Failed to approve application. Please try again.");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(
    (app) =>
      (statusFilter === 'All' || app.status === statusFilter) &&
      (app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (app.phone && app.phone.includes(searchQuery)))
  );

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 font-medium">Loading applications...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (error) {
    return (
      <AdminDashboardLayout>
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Error Loading Data</h3>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={fetchApplications}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 p-6">
        
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Admin", href: "/admin/dashboard", icon: LayoutDashboard },
            { label: "Tutor Applications", icon: UserCheck },
          ]}
        />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">
              Tutor Applications
            </h1>
            <p className="mt-2 text-slate-600 text-lg">
              Review and manage tutor registration requests
            </p>
          </div>
          <button className="inline-flex items-center gap-2 px-5 py-3 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm hover:shadow-md">
            <Download size={18} />
            <span className="font-semibold text-sm">Export CSV</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Applications', value: stats.total, icon: UserCheck, color: 'indigo', bg: 'bg-indigo-500' },
            { label: 'Pending Review', value: stats.pending, icon: Clock, color: 'amber', bg: 'bg-amber-500' },
            { label: 'Approved', value: stats.approved, icon: CheckCircle, color: 'emerald', bg: 'bg-emerald-500' },
            { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'rose', bg: 'bg-rose-500' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-xl p-6 border-2 border-slate-200 shadow-sm hover:shadow-lg transition-all hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
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
                className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium cursor-pointer bg-white"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Cards */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-16 text-center">
            <Search className="w-20 h-20 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">No Applications Found</h3>
            <p className="text-slate-500">
              {applications.length === 0 
                ? "No pending tutor applications at the moment." 
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => {
              const address = [app.city, app.state].filter(Boolean).join(', ') || 'Not provided';
              const isPending = app.status.toLowerCase() === 'pending';
              
              return (
                <div key={app._id} className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all hover:scale-[1.01]">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    
                    {/* Left: Tutor Info */}
                    <div className="flex items-start gap-4 flex-1">
                      {/* Profile Image/Avatar */}
                      <div className="flex-shrink-0">
                        {app.profileImage ? (
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md border-2 border-slate-200">
                            <Image 
                              src={app.profileImage}
                              alt={app.name}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-md">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Tutor Details */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                <Mail size={14} className="text-indigo-500" />
                                <span>{app.email}</span>
                              </div>
                              {app.phone && (
                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                  <Phone size={14} className="text-emerald-500" />
                                  <span>{app.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                <MapPin size={14} className="text-rose-500" />
                                <span>{address}</span>
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock size={14} />
                          <span>Applied on {new Date(app.appliedDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                      {isPending && (
                        <button
                          onClick={() => handleApprove(app._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105"
                        >
                          <CheckCircle size={18} />
                          <span>Approve</span>
                        </button>
                      )}
                      <Link
                        href={`/admin/applications/${app._id}`}
                        className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-xl hover:scale-105"
                      >
                        <Eye size={18} />
                        <span>View Details</span>
                      </Link>
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
