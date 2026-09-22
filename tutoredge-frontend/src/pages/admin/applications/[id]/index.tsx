import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import { 
  ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, BookOpen, 
  Languages, Award, DollarSign, Star, Clock, CheckCircle, XCircle,
  AlertCircle, Loader, Shield, Building, MapPinned, Calendar,
  Briefcase, Target, MessageSquare, Hash
} from 'lucide-react';
import Link from "next/link";
import Image from "next/image";

export default function TutorApplicationDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const fetchTutor = async (tutorId: string) => {
    try {
      const res = await apiClient.get(`/auth/admin/tutor/${tutorId}`);
      setTutor(res.data);
    } catch (err) {
      console.error("Failed to fetch tutor", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: "approved" | "rejected") => {
    if (!id) return;

    const confirmMsg = status === "approved" 
      ? "Are you sure you want to APPROVE this tutor application?"
      : "Are you sure you want to REJECT this tutor application?";
    
    if (!confirm(confirmMsg)) return;

    try {
      setUpdating(true);
      await apiClient.put(`/auth/admin/tutor/${id}/status`, { status });
      alert(`Tutor ${status} successfully!`);
      router.push("/admin/applications");
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (typeof id !== "string") return;
    fetchTutor(id);
  }, [router.isReady, id]);

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center space-y-4">
            <Loader className="w-16 h-16 text-indigo-600 animate-spin mx-auto" />
            <p className="text-slate-600 font-medium">Loading tutor details...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!tutor) {
    return (
      <AdminDashboardLayout>
        <div className="max-w-3xl mx-auto mt-12">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-red-700 mb-2">Tutor Not Found</h3>
            <p className="text-red-600 mb-4">The requested tutor application could not be found.</p>
            <Link href="/admin/applications" className="text-red-700 hover:underline font-semibold">
              ← Back to Applications
            </Link>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  const isFinalized = tutor.status !== "pending";
  const statusConfig = {
    pending: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', icon: Clock, label: 'Pending Review' },
    approved: { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', icon: CheckCircle, label: 'Approved' },
    rejected: { bg: 'bg-rose-50 border-rose-200', text: 'text-rose-700', icon: XCircle, label: 'Rejected' },
  };

  const currentStatus = statusConfig[tutor.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 p-6">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between">
          <Link 
            href="/admin/applications"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm font-semibold"
          >
            <ArrowLeft size={18} />
            <span>Back to Applications</span>
          </Link>
          
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 ${currentStatus.bg} ${currentStatus.text}`}>
            <StatusIcon size={20} />
            <span className="font-bold">{currentStatus.label}</span>
          </div>
        </div>

        {/* Main Title */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-black mb-2">Tutor Verification</h1>
              <p className="text-indigo-100 text-lg">Review all details before approval</p>
            </div>
            {tutor.phone_verified && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur px-4 py-2 rounded-xl">
                <Shield className="text-emerald-300" size={20} />
                <span className="font-semibold">Phone Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-sm">
          <div className="flex items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              {tutor.profileImage ? (
                <div className="relative w-32 h-32 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <Image 
                    src={tutor.profileImage}
                    alt={tutor.fullName || 'Tutor'}
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-xl">
                  {tutor.fullName?.charAt(0).toUpperCase() || 'T'}
                </div>
              )}
              {tutor.phone_verified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 shadow-lg">
                  <CheckCircle className="text-white" size={24} />
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-black text-slate-900 mb-2">{tutor.fullName}</h2>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-indigo-500" />
                  <span>{tutor.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-emerald-500" />
                  <span>{tutor.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-purple-500" />
                  <span className="capitalize">{tutor.role}</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-xl p-4 text-center border-2 border-indigo-200">
                <DollarSign className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <p className="text-2xl font-black text-indigo-900">₹{tutor.price}</p>
                <p className="text-xs text-indigo-600 font-semibold">Price</p>
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-center border-2 border-amber-200">
                <Star className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                <p className="text-2xl font-black text-amber-900">{tutor.rating || 'N/A'}</p>
                <p className="text-xs text-amber-600 font-semibold">Rating</p>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Location */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-rose-500 p-3 rounded-xl">
                <MapPin className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Location Details</h3>
            </div>
            <div className="space-y-3">
              <InfoRow icon={Building} label="City" value={tutor.location?.city || "—"} />
              <InfoRow icon={MapPinned} label="Area" value={tutor.location?.area || "—"} />
              {tutor.location?.pincode && (
                <InfoRow icon={Hash} label="Pincode" value={tutor.location.pincode} />
              )}
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-indigo-500 p-3 rounded-xl">
                <GraduationCap className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Academic Info</h3>
            </div>
            <div className="space-y-3">
              <InfoRow icon={Award} label="Qualification" value={tutor.qualification} />
              <InfoRow icon={Building} label="College" value={tutor.college} />
              <InfoRow icon={Briefcase} label="Experience" value={`${tutor.yearsOfExperience} years`} />
            </div>
          </div>

          {/* Teaching Details */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-emerald-500 p-3 rounded-xl">
                <BookOpen className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Teaching Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <Target size={16} />
                  <span>Subjects</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects?.length ? (
                    tutor.subjects.map((subject: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-sm font-semibold">
                        {subject}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <Languages size={16} />
                  <span>Languages</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.languages?.length ? (
                    tutor.languages.map((lang: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-semibold">
                        {lang}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-600 mb-2">
                  <BookOpen size={16} />
                  <span>Classes Taught</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tutor.classesTaught?.length ? (
                    tutor.classesTaught.map((cls: string, idx: number) => (
                      <span key={idx} className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-sm font-semibold">
                        {cls}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          {tutor.testimonial && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 shadow-sm lg:col-span-2">
              <div className="flex items-start gap-3">
                <MessageSquare className="text-amber-600 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">Testimonial</h3>
                  <p className="text-slate-700 italic">"{tutor.testimonial}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Meta Info */}
          <div className="bg-white rounded-xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-slate-500 p-3 rounded-xl">
                <Calendar className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Application Info</h3>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock size={16} />
              <span>Applied on {new Date(tutor.createdAt).toLocaleString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {!isFinalized && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              disabled={updating}
              onClick={() => updateStatus("approved")}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
            >
              {updating ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                <CheckCircle size={24} />
              )}
              <span>Approve Tutor</span>
            </button>

            <button
              disabled={updating}
              onClick={() => updateStatus("rejected")}
              className="flex items-center justify-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-700 disabled:bg-gray-400 text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105 disabled:cursor-not-allowed"
            >
              {updating ? (
                <Loader className="animate-spin" size={24} />
              ) : (
                <XCircle size={24} />
              )}
              <span>Reject Application</span>
            </button>
          </div>
        )}

        {isFinalized && (
          <div className={`${currentStatus.bg} border-2 ${currentStatus.text} rounded-xl p-6 text-center`}>
            <StatusIcon className="w-16 h-16 mx-auto mb-3" />
            <p className="text-lg font-bold">This application has been {tutor.status}</p>
            <p className="text-sm opacity-75 mt-1">No further action can be taken</p>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

// Helper Component
const InfoRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="flex items-start gap-3">
    <Icon size={18} className="text-slate-400 mt-0.5" />
    <div className="flex-1">
      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{label}</p>
      <p className="text-slate-900 font-semibold">{value}</p>
    </div>
  </div>
);
