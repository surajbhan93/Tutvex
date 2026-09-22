import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import leadService, { StudentLead } from "@/services/leadService";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, BookOpen, 
  DollarSign, Clock, Calendar, Target, Users, 
  Eye, Edit, AlertCircle, Loader, CheckCircle
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const AdminLeadDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [lead, setLead] = useState<StudentLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocks, setUnlocks] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchLeadDetails();
    }
  }, [id]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id as string);
      setLead(response.data);
      
      // Fetch unlock history
      try {
        const unlocksResponse = await leadService.adminGetLeadUnlocks(id as string);
        setUnlocks(unlocksResponse.data || []);
      } catch (error) {
        console.log("Could not fetch unlock history:", error);
        setUnlocks([]);
      }
    } catch (error: any) {
      console.error("Failed to fetch lead:", error);
      toast.error(error.response?.data?.message || "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string }> = {
      new: { bg: "bg-blue-100", text: "text-blue-700" },
      active: { bg: "bg-green-100", text: "text-green-700" },
      assigned: { bg: "bg-purple-100", text: "text-purple-700" },
      closed: { bg: "bg-gray-100", text: "text-gray-700" },
      expired: { bg: "bg-red-100", text: "text-red-700" },
    };

    const config = statusConfig[status] || statusConfig.new || { bg: "bg-blue-100", text: "text-blue-700" };

    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text} capitalize`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading lead details...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!lead) {
    return (
      <AdminDashboardLayout>
        <div className="p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead not found</h2>
            <p className="text-gray-600 mb-6">This lead may have been removed</p>
            <Link href="/admin/leads">
              <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all">
                Back to Leads
              </button>
            </Link>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6">
        {/* Back Button */}
        <Link href="/admin/leads">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Leads</span>
          </button>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-3xl font-bold text-gray-900">
                  {lead.studentClass} {lead.subject}
                </h1>
                {getStatusBadge(lead.status)}
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Created {new Date(lead.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{lead.totalUnlocks} Unlocks</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>Quality: {lead.qualityScore}/100</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link href={`/admin/leads/${lead._id}/edit`}>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all">
                  <Edit className="h-4 w-4" />
                  Edit
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirement Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirement Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Teaching Mode</div>
                    <div className="text-base font-semibold text-gray-900 capitalize">{lead.teachingMode}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-green-50">
                    <DollarSign className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="text-base font-semibold text-gray-900">
                      ₹{lead.budget.toLocaleString()}/{lead.budgetType.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-base font-semibold text-gray-900">
                      {lead.location.area}, {lead.location.city}
                    </div>
                    {lead.location.pincode && (
                      <div className="text-sm text-gray-500">PIN: {lead.location.pincode}</div>
                    )}
                  </div>
                </div>

                {lead.preferredTime && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Preferred Time</div>
                      <div className="text-base font-semibold text-gray-900">{lead.preferredTime}</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Target className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Urgency</div>
                    <div className="text-base font-semibold text-gray-900 capitalize">
                      {lead.urgency.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-50">
                    <CheckCircle className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Credits Required</div>
                    <div className="text-base font-semibold text-gray-900">{lead.creditsRequired}</div>
                  </div>
                </div>
              </div>

              {lead.additionalRequirements && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Additional Requirements</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{lead.additionalRequirements}</p>
                </div>
              )}
            </div>

            {/* Parent Contact */}
            {(lead.parentName || lead.parentPhone) && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Parent/Student Contact Information</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {lead.parentName && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-600">Parent Name</div>
                        <div className="text-base font-semibold text-gray-900">{lead.parentName}</div>
                      </div>
                    </div>
                  )}

                  {lead.parentPhone && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                      <Phone className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-600">Phone</div>
                        <a 
                          href={`tel:${lead.parentPhone}`}
                          className="text-base font-semibold text-green-700 hover:text-green-900"
                        >
                          {lead.parentPhone}
                        </a>
                      </div>
                    </div>
                  )}

                  {lead.parentEmail && (
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200">
                      <Mail className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="text-xs text-gray-600">Email</div>
                        <a 
                          href={`mailto:${lead.parentEmail}`}
                          className="text-base font-semibold text-purple-700 hover:text-purple-900 break-all"
                        >
                          {lead.parentEmail}
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    ℹ️ This contact information is visible to admin only. Tutors can see it after unlocking the lead.
                  </p>
                </div>
              </div>
            )}

            {/* Unlock History */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Unlock History</h2>
              
              {unlocks.length > 0 ? (
                <div className="space-y-3">
                  {unlocks.map((unlock: any) => (
                    <div key={unlock._id} className="p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {unlock.tutorId?.profilePicture ? (
                            <img 
                              src={unlock.tutorId.profilePicture} 
                              alt={unlock.tutorId.fullName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-gray-900">{unlock.tutorId?.fullName || 'Unknown Tutor'}</h3>
                            <p className="text-sm text-gray-600">{unlock.tutorId?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">
                            {new Date(unlock.unlockedAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(unlock.unlockedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 text-sm">
                        <div className="flex items-center gap-4">
                          {unlock.tutorId?.phone && (
                            <a 
                              href={`tel:${unlock.tutorId.phone}`}
                              className="flex items-center gap-1 text-green-600 hover:text-green-700"
                            >
                              <Phone className="h-3 w-3" />
                              {unlock.tutorId.phone}
                            </a>
                          )}
                          <span className="text-gray-600">
                            {unlock.creditsUsed} credit{unlock.creditsUsed !== 1 ? 's' : ''} used
                          </span>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          unlock.status === 'converted' ? 'bg-green-100 text-green-700' :
                          unlock.status === 'contacted' ? 'bg-blue-100 text-blue-700' :
                          unlock.status === 'demo_scheduled' ? 'bg-purple-100 text-purple-700' :
                          unlock.status === 'lost' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {unlock.status.replace('_', ' ')}
                        </span>
                      </div>

                      {unlock.notes && (
                        <div className="mt-2 text-sm text-gray-600 italic">
                          "{unlock.notes}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Eye className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">No tutors have unlocked this lead yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Information</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Lead ID</span>
                  <span className="font-mono text-gray-900">{lead._id.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Student Name</span>
                  <span className="font-semibold text-gray-900">{lead.studentName || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Unlocks</span>
                  <span className="font-semibold text-gray-900">{lead.totalUnlocks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Max Unlocks</span>
                  <span className="font-semibold text-gray-900">{lead.maxUnlocks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quality Score</span>
                  <span className="font-semibold text-gray-900">{lead.qualityScore}/100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Expires</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(lead.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm">
                  Publish Lead
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all text-sm">
                  Pause Lead
                </button>
                <button className="w-full px-4 py-2 rounded-lg bg-white border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-all text-sm">
                  Archive Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminLeadDetailPage;
