import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import leadService, { StudentLead } from "@/services/leadService";
import { 
  MapPin, BookOpen, DollarSign, Clock, Star, Zap, 
  AlertCircle, Phone, Mail, User, ArrowLeft, CheckCircle2,
  Loader, Calendar, Target, Info
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import Link from "next/link";

const LeadDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isLoggedIn, user } = useAuthStore();
  
  const [lead, setLead] = useState<StudentLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "tutor") {
      router.push("/find-students");
      return;
    }

    if (id) {
      fetchLeadDetails();
    }
  }, [id, isLoggedIn, user, router]);

  const fetchLeadDetails = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(id as string);
      setLead(response.data);
      
      // Check if already unlocked (parent info will be present)
      setIsUnlocked(!!response.data.parent);
    } catch (error: any) {
      console.error("Failed to fetch lead:", error);
      toast.error(error.response?.data?.message || "Failed to load lead details");
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async () => {
    if (!lead) return;

    // Confirmation dialog
    const confirmed = window.confirm(
      `This will cost ${lead.creditsRequired} credit${lead.creditsRequired !== 1 ? 's' : ''}. Do you want to proceed?`
    );

    if (!confirmed) return;

    try {
      setUnlocking(true);
      const response = await leadService.unlockLead(lead._id);
      
      toast.success(response.message || "Lead unlocked successfully!");
      
      // ✅ Redirect to My Leads page as per requirement
      if (response.redirectUrl) {
        router.push(response.redirectUrl);
      } else {
        router.push("/tutor/leads/my-leads");
      }
    } catch (error: any) {
      console.error("Failed to unlock lead:", error);
      toast.error(error.response?.data?.message || "Failed to unlock lead");
      setUnlocking(false);
    }
  };

  const calculateMatchScore = (lead: StudentLead) => {
    return lead.qualityScore || 85;
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="h-12 w-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading lead details...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  if (!lead) {
    return (
      <TutorDashboardLayout>
        <div className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Lead not found</h2>
          <p className="text-gray-600 mb-6">This lead may have been removed or expired</p>
          <Link href="/tutor/leads">
            <button className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all">
              Back to Leads
            </button>
          </Link>
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/tutor/leads">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Leads</span>
          </button>
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              {/* Match Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-3">
                <Star className="h-4 w-4" />
                {calculateMatchScore(lead)}% Match
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {lead.studentClass} {lead.subject} Tutor Required
              </h1>

              {/* Urgency */}
              {lead.urgency === "immediate" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold">
                  <AlertCircle className="h-4 w-4" />
                  Urgent Requirement
                </div>
              )}
            </div>

            {/* Credit Cost */}
            <div className="ml-6">
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-50 border-2 border-amber-200">
                <Zap className="h-5 w-5 text-amber-600" />
                <span className="text-lg font-bold text-amber-900">{lead.creditsRequired} Credit{lead.creditsRequired !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Requirement Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Requirement Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Teaching Mode</div>
                    <div className="text-base font-semibold text-gray-900 capitalize">{lead.teachingMode} Tuition</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-emerald-50">
                    <DollarSign className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Budget</div>
                    <div className="text-base font-semibold text-gray-900">
                      ₹{lead.budget ? lead.budget.toLocaleString() : '0'}/{lead.budgetType ? lead.budgetType.replace('_', ' ') : 'month'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-50">
                    <MapPin className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-base font-semibold text-gray-900">{lead.location?.area || 'N/A'}, {lead.location?.city || 'N/A'}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-50">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Posted</div>
                    <div className="text-base font-semibold text-gray-900">
                      {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                    </div>
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
                  <div className="p-2 rounded-lg bg-pink-50">
                    <Target className="h-5 w-5 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Urgency</div>
                    <div className="text-base font-semibold text-gray-900 capitalize">{lead.urgency.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>

              {/* Additional Requirements */}
              {lead.additionalRequirements && (
                <div className="mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Additional Requirements</h3>
                  <p className="text-sm text-gray-700 leading-relaxed">{lead.additionalRequirements}</p>
                </div>
              )}
            </div>

            {/* Parent Contact (Locked/Unlocked) */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Parent Contact Information</h2>

              {isUnlocked && (lead.parentName || lead.parentPhone || lead.parentEmail) ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm font-semibold text-emerald-700">Lead Unlocked</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                        <Phone className="h-5 w-5 text-emerald-600" />
                        <div>
                          <div className="text-xs text-gray-600">Phone</div>
                          <a 
                            href={`tel:${lead.parentPhone}`}
                            className="text-base font-semibold text-emerald-700 hover:text-emerald-900"
                          >
                            {lead.parentPhone}
                          </a>
                        </div>
                      </div>
                    )}

                    {lead.parentEmail && (
                      <div className="flex items-center gap-3 p-4 rounded-lg bg-purple-50 border border-purple-200 sm:col-span-2">
                        <Mail className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-xs text-gray-600">Email</div>
                          <a 
                            href={`mailto:${lead.parentEmail}`}
                            className="text-base font-semibold text-purple-700 hover:text-purple-900"
                          >
                            {lead.parentEmail}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Next Steps:</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>Contact the parent via phone or email</li>
                          <li>Understand their specific requirements</li>
                          <li>Schedule a demo class if interested</li>
                          <li>Update lead status from your dashboard</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <span className="text-3xl">🔒</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Contact Details Hidden</h3>
                  <p className="text-gray-600 mb-6">
                    Unlock this lead to view parent contact information
                  </p>
                  <button
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 mx-auto"
                  >
                    {unlocking ? (
                      <>
                        <Loader className="h-5 w-5 animate-spin" />
                        Unlocking...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Unlock for {lead.creditsRequired} Credit{lead.creditsRequired !== 1 ? 's' : ''}
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lead Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Lead Statistics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Views</span>
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
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold capitalize">
                    {lead.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Pro Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Contact parents within 24 hours of unlocking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Be clear about your teaching methodology</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Offer a free demo class to build trust</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Follow up if you don't hear back</span>
                </li>
              </ul>
            </div>

            {/* Buy Credits */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
              <div className="text-center">
                <Zap className="h-8 w-8 text-amber-600 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Need More Credits?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Get credits to unlock more student leads
                </p>
                <Link href="/tutor/subscription">
                  <button className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-semibold shadow-md hover:shadow-lg transition-all">
                    View Plans
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

export default LeadDetailPage;
