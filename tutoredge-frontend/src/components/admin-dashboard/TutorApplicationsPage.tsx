import { Search, Filter, UserCheck, Clock, CheckCircle, XCircle, Eye, MoreVertical, Download, Mail, Phone, MapPin } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/navbar/NavBar';
import apiClient from '@/lib/apiClient';
import Link from "next/link";

interface TutorApplication {
  id: string;
  _id?: string;
  name: string;
  email: string;
  phone?: string;
  city?: string;
  state?: string;
  profileImage?: string; // ✅ Added
  appliedDate: string;
  status: string;
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

const TutorApplicationsPage = () => {
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiClient.get('/auth/tutor-applications');
        setApplications(response.data || []);
      } catch (err: any) {
        setError('Failed to fetch tutor applications. Please check your connection.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleApprove = async (appId: string) => {
    if (!confirm('Are you sure you want to approve this tutor application?')) return;
    
    try {
      await apiClient.patch(`/auth/tutor-applications/${appId}`, { status: 'approved' });
      setApplications(prevApps => 
        prevApps.map(app => 
          (app.id === appId || app._id === appId) 
            ? { ...app, status: 'approved' } 
            : app
        )
      );
    } catch (err: any) {
      alert('Failed to approve application. Please try again.');
      console.error(err);
    }
  };

  const filteredApplications = useMemo(() => {
    return applications
      .filter((app) => statusFilter === 'All' || app.status === statusFilter)
      .filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.phone && app.phone.includes(searchQuery)) ||
          (app.city && app.city.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [searchQuery, statusFilter, applications]);

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <NavBar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto" />
            <p className="text-slate-600 font-medium">Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <NavBar />
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <NavBar />
      
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
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
          <button className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
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
            <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bg} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, phone, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              />
            </div>
            <div className="flex items-center gap-3">
              <Filter size={20} className="text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applications Cards (Mobile-friendly) */}
        <div className="space-y-4">
          {filteredApplications.map((app) => {
            const appId = app.id || (app as any)._id;
            const address = [app.city, app.state].filter(Boolean).join(', ') || 'Not provided';
            const isPending = app.status.toLowerCase() === 'pending';
            
            return (
              <div key={appId} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Tutor Info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start gap-4">
                      {/* Profile Image */}
                      <div className="flex-shrink-0">
                        {app.profileImage ? (
                          <img 
                            src={app.profileImage} 
                            alt={app.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                            onError={(e) => {
                              // Fallback to default avatar if image fails to load
                              (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(app.name) + '&background=6366f1&color=fff';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                            {app.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{app.name}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-2">
                              <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                <Mail size={14} />
                                <span>{app.email}</span>
                              </div>
                              {app.phone && (
                                <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                  <Phone size={14} />
                                  <span>{app.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                                <MapPin size={14} />
                                <span>{address}</span>
                              </div>
                            </div>
                          </div>
                          <StatusBadge status={app.status} />
                        </div>
                      </div>
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

                  {/* Right: Actions */}
                  <div className="flex items-center gap-3">
                    {isPending && (
                      <button
                        onClick={() => handleApprove(appId)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                      >
                        <CheckCircle size={18} />
                        <span>Approve</span>
                      </button>
                    )}
                    <Link
                      href={`/admin/applications/${appId}`}
                      className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                    >
                      <Eye size={18} />
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
          
          {filteredApplications.length === 0 && (
            <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-12 text-center">
              <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium text-lg">No applications found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your filters or search query</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorApplicationsPage;
