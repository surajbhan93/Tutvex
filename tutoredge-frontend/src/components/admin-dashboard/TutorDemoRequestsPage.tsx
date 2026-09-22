"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import toast from "react-hot-toast";
import { 
  Search, Filter, Calendar, User, Mail, Phone, BookOpen, 
  Clock, CheckCircle, XCircle, Eye, AlertCircle, TrendingUp,
  Users, Bell, MessageSquare, Loader, ArrowUpRight, Target, MapPin,
  Zap, DollarSign, Award, ExternalLink, Edit
} from "lucide-react";
import Link from "next/link";

/* ---------------- TYPES ---------------- */
interface LeadUnlock {
  _id: string;
  leadId: {
    _id: string;
    subject: string;
    studentClass: string;
    location: {
      city: string;
      area: string;
    };
    budget: number;
    budgetType: string;
    teachingMode: string;
    status: string;
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
  };
  tutorId: {
    _id: string;
    fullName: string;
    phone: string;
    email: string;
    subjects?: string[];
    profilePicture?: string;
  };
  creditsUsed: number;
  status: "new" | "contacted" | "response_received" | "demo_scheduled" | "demo_completed" | "converted" | "lost";
  unlockedAt: string;
  contactedAt?: string;
  demoScheduledAt?: string;
  demoCompletedAt?: string;
  convertedAt?: string;
  notes?: string;
  lostReason?: string;
}

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }: { status: string }) => {
  const configs = {
    new: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', icon: Bell, dot: 'bg-blue-500' },
    contacted: { bg: 'bg-purple-50 border-purple-200', text: 'text-purple-700', icon: MessageSquare, dot: 'bg-purple-500' },
    response_received: { bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', icon: Mail, dot: 'bg-indigo-500' },
    demo_scheduled: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Calendar, dot: 'bg-amber-500' },
    demo_completed: { bg: 'bg-teal-50 border-teal-200', text: 'text-teal-700', icon: CheckCircle, dot: 'bg-teal-500' },
    converted: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: Award, dot: 'bg-emerald-500' },
    lost: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', icon: XCircle, dot: 'bg-rose-500' },
  };

  const config = configs[status as keyof typeof configs] || configs.new;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon size={14} />
      <span className="text-xs font-bold capitalize">{status.replace('_', ' ')}</span>
    </div>
  );
};

/* ---------------- PAGE ---------------- */
export default function TutorDemoRequestsPage() {
  const router = useRouter();
  const [unlocks, setUnlocks] = useState<LeadUnlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUnlocks = async () => {
    try {
      setLoading(true);
      // Fetch all lead unlocks
      const res = await apiClient.get("/leads/admin/all-unlocks");
      setUnlocks(res.data.data || []);
    } catch (err) {
      console.error("Failed to load unlocks:", err);
      toast.error("Failed to load lead unlock requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnlocks();
  }, []);

  /* -------- UPDATE STATUS -------- */
  const updateUnlockStatus = async (
    unlockId: string,
    status: string,
    notes?: string
  ) => {
    try {
      setUpdating(unlockId);
      await apiClient.put("/leads/update-unlock-status", {
        unlockId,
        status,
        notes: notes || `Status updated to ${status} by admin`,
      });
      toast.success(`Status updated to ${status.replace('_', ' ')}!`);
      fetchUnlocks();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  /* -------- FILTER -------- */
  const filtered = unlocks.filter(unlock => {
    const matchesStatus = statusFilter === "all" || unlock.status === statusFilter;
    const matchesSearch = 
      searchTerm === "" ||
      unlock.tutorId?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unlock.leadId?.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      unlock.leadId?.studentClass.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  /* -------- STATS -------- */
  const stats = {
    total: unlocks.length,
    new: unlocks.filter(u => u.status === 'new').length,
    contacted: unlocks.filter(u => u.status === 'contacted').length,
    demo_scheduled: unlocks.filter(u => u.status === 'demo_scheduled').length,
    converted: unlocks.filter(u => u.status === 'converted').length,
    lost: unlocks.filter(u => u.status === 'lost').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[80vh]">
        <div className="text-center space-y-4">
          <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
          <p className="text-slate-600 font-medium text-lg">Loading lead unlocks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">
            Lead Unlock Requests
          </h1>
          <p className="mt-2 text-slate-600 text-lg">
            Track tutors who unlocked leads and their progress
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl shadow-sm">
          <Zap className="text-purple-600" size={20} />
          <span className="font-semibold text-slate-700">{stats.total} Total Unlocks</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total" value={stats.total} color="indigo" icon={Target} />
        <StatCard label="New" value={stats.new} color="blue" icon={Bell} />
        <StatCard label="Contacted" value={stats.contacted} color="purple" icon={MessageSquare} />
        <StatCard label="Demo Scheduled" value={stats.demo_scheduled} color="amber" icon={Calendar} />
        <StatCard label="Converted" value={stats.converted} color="emerald" icon={Award} />
        <StatCard label="Lost" value={stats.lost} color="rose" icon=  {XCircle} />
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl border-2 border-slate-200 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by tutor name, subject, or class..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium cursor-pointer bg-white min-w-[200px]"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="response_received">Response Received</option>
            <option value="demo_scheduled">Demo Scheduled</option>
            <option value="demo_completed">Demo Completed</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Unlocks Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-slate-300 p-16 text-center">
          <AlertCircle className="w-20 h-20 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-700 mb-2">No Unlocks Found</h3>
          <p className="text-slate-500">
            {unlocks.length === 0 
              ? "No tutors have unlocked any leads yet." 
              : "Try adjusting your search or filter."}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((unlock) => {
            const isUpdating = updating === unlock._id;

            return (
              <div
                key={unlock._id}
                className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-lg transition-all space-y-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900">
                      {unlock.leadId?.subject} - {unlock.leadId?.studentClass}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1">
                      <MapPin className="inline w-3 h-3 mr-1" />
                      {unlock.leadId?.location?.area}, {unlock.leadId?.location?.city}
                    </p>
                  </div>
                  <StatusBadge status={unlock.status} />
                </div>

                {/* Lead Details */}
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <DollarSign size={14} className="text-emerald-500" />
                    <span>₹{unlock.leadId?.budget?.toLocaleString()}/{unlock.leadId?.budgetType === 'per_hour' ? 'hr' : 'month'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <BookOpen size={14} className="text-blue-500" />
                    <span className="capitalize">{unlock.leadId?.teachingMode}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Zap size={14} className="text-amber-500" />
                    <span>{unlock.creditsUsed} credits</span>
                  </div>
                </div>

                <hr />

                {/* Tutor Info */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-indigo-600 uppercase">Tutor</p>
                  <div className="flex items-start gap-3">
                    {unlock.tutorId?.profilePicture ? (
                      <img 
                        src={unlock.tutorId.profilePicture} 
                        alt={unlock.tutorId.fullName}
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black flex-shrink-0">
                        {unlock.tutorId?.fullName?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-slate-900">{unlock.tutorId?.fullName}</p>
                      <div className="flex flex-col gap-1 mt-1">
                        {unlock.tutorId?.phone && (
                          <a 
                            href={`tel:${unlock.tutorId.phone}`}
                            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600"
                          >
                            <Phone size={12} />
                            <span>{unlock.tutorId.phone}</span>
                          </a>
                        )}
                        {unlock.tutorId?.email && (
                          <a 
                            href={`mailto:${unlock.tutorId.email}`}
                            className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600"
                          >
                            <Mail size={12} />
                            <span>{unlock.tutorId.email}</span>
                          </a>
                        )}
                      </div>
                    </div>
                    <Link href={`/admin/users/tutors/${unlock.tutorId?._id}`}>
                      <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <ExternalLink size={16} className="text-slate-400" />
                      </button>
                    </Link>
                  </div>
                </div>

                {/* Parent Contact (if available) */}
                {unlock.leadId?.parentName && (
                  <>
                    <hr />
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-rose-600 uppercase">Parent Contact</p>
                      <div className="bg-rose-50 rounded-lg p-3 space-y-1">
                        <p className="font-semibold text-slate-900">{unlock.leadId.parentName}</p>
                        {unlock.leadId.parentPhone && (
                          <a 
                            href={`tel:${unlock.leadId.parentPhone}`}
                            className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-rose-600"
                          >
                            <Phone size={14} />
                            {unlock.leadId.parentPhone}
                          </a>
                        )}
                        {unlock.leadId.parentEmail && (
                          <a 
                            href={`mailto:${unlock.leadId.parentEmail}`}
                            className="flex items-center gap-1.5 text-sm text-slate-700 hover:text-rose-600"
                          >
                            <Mail size={14} />
                            {unlock.leadId.parentEmail}
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* Timeline */}
                <div className="text-xs text-slate-500 space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock size={12} />
                    <span>Unlocked: {new Date(unlock.unlockedAt).toLocaleString()}</span>
                  </div>
                  {unlock.contactedAt && (
                    <div className="flex items-center gap-2">
                      <MessageSquare size={12} />
                      <span>Contacted: {new Date(unlock.contactedAt).toLocaleString()}</span>
                    </div>
                  )}
                  {unlock.demoScheduledAt && (
                    <div className="flex items-center gap-2">
                      <Calendar size={12} />
                      <span>Demo: {new Date(unlock.demoScheduledAt).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {unlock.notes && (
                  <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-900">
                    📝 {unlock.notes}
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {unlock.status === 'new' && (
                    <button
                      disabled={isUpdating}
                      onClick={() => updateUnlockStatus(unlock._id, "contacted")}
                      className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white rounded-lg font-semibold text-xs transition-all"
                    >
                      {isUpdating ? <Loader className="animate-spin" size={12} /> : <MessageSquare size={12} />}
                      Mark Contacted
                    </button>
                  )}

                  {unlock.status === 'contacted' && (
                    <button
                      disabled={isUpdating}
                      onClick={() => updateUnlockStatus(unlock._id, "demo_scheduled")}
                      className="flex items-center gap-2 px-3 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 text-white rounded-lg font-semibold text-xs transition-all"
                    >
                      {isUpdating ? <Loader className="animate-spin" size={12} /> : <Calendar size={12} />}
                      Demo Scheduled
                    </button>
                  )}

                  {(unlock.status === 'demo_scheduled' || unlock.status === 'demo_completed') && (
                    <button
                      disabled={isUpdating}
                      onClick={() => updateUnlockStatus(unlock._id, "converted")}
                      className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg font-semibold text-xs transition-all"
                    >
                      {isUpdating ? <Loader className="animate-spin" size={12} /> : <Award size={12} />}
                      Mark Converted
                    </button>
                  )}

                  {unlock.status !== 'lost' && unlock.status !== 'converted' && (
                    <button
                      disabled={isUpdating}
                      onClick={() => updateUnlockStatus(unlock._id, "lost", "Lead marked as lost by admin")}
                      className="flex items-center gap-2 px-3 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-300 text-white rounded-lg font-semibold text-xs transition-all"
                    >
                      {isUpdating ? <Loader className="animate-spin" size={12} /> : <XCircle size={12} />}
                      Mark Lost
                    </button>
                  )}

                  <Link href={`/admin/leads/${unlock.leadId?._id}`}>
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-all">
                      <Eye size={12} />
                      View Lead
                    </button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- STAT CARD ---------------- */
function StatCard({ label, value, color, icon: Icon }: { label: string; value: number; color: string; icon: any; }) {
  const colors = {
    indigo: 'from-indigo-500 to-purple-500',
    amber: 'from-amber-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
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

