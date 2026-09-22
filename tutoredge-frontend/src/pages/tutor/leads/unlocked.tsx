import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import leadService, { LeadUnlock } from "@/services/leadService";
import { 
  Phone, Mail, User, MapPin, BookOpen, DollarSign, 
  Clock, CheckCircle2, AlertCircle, Calendar, MessageCircle,
  Loader, ArrowLeft, Edit
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import Link from "next/link";

const UnlockedLeadsPage = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  
  const [unlockedLeads, setUnlockedLeads] = useState<LeadUnlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isLoggedIn || user?.role !== "tutor") {
      router.push("/find-students");
      return;
    }

    fetchUnlockedLeads();
  }, [isLoggedIn, user, router, statusFilter]);

  const fetchUnlockedLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getMyLeads(statusFilter);
      setUnlockedLeads(response.data || []);
    } catch (error: any) {
      console.error("Failed to fetch unlocked leads:", error);
      toast.error(error.response?.data?.message || "Failed to load unlocked leads");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedLead || !newStatus) {
      toast.error("Please select a status");
      return;
    }

    try {
      setUpdatingStatus(true);
      await leadService.updateLeadStatus(selectedLead, newStatus, notes);
      toast.success("Status updated successfully!");
      setSelectedLead(null);
      setNewStatus("");
      setNotes("");
      fetchUnlockedLeads();
    } catch (error: any) {
      console.error("Failed to update status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      new: { bg: "bg-blue-100", text: "text-blue-700", label: "New" },
      contacted: { bg: "bg-purple-100", text: "text-purple-700", label: "Contacted" },
      response_received: { bg: "bg-indigo-100", text: "text-indigo-700", label: "Response Received" },
      demo_scheduled: { bg: "bg-amber-100", text: "text-amber-700", label: "Demo Scheduled" },
      demo_completed: { bg: "bg-cyan-100", text: "text-cyan-700", label: "Demo Completed" },
      converted: { bg: "bg-green-100", text: "text-green-700", label: "Converted" },
      lost: { bg: "bg-red-100", text: "text-red-700", label: "Lost" },
    };

    const config = statusConfig[status] || statusConfig.new || { bg: "bg-blue-100", text: "text-blue-700", label: "New" };

    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const filteredLeads = unlockedLeads;

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        {/* Back Button */}
        <Link href="/tutor/leads">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to Browse Leads</span>
          </button>
        </Link>

        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">My Unlocked Leads</h1>
          <p className="text-purple-50">
            Manage and track your unlocked student requirements
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border-gray-300 text-sm"
              >
                <option value="">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="response_received">Response Received</option>
                <option value="demo_scheduled">Demo Scheduled</option>
                <option value="demo_completed">Demo Completed</option>
                <option value="converted">Converted</option>
                <option value="lost">Lost</option>
              </select>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-600">Total Unlocked</div>
              <div className="text-3xl font-bold text-gray-900">{unlockedLeads.length}</div>
            </div>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-purple-600 animate-spin" />
            </div>
          ) : filteredLeads.length > 0 ? (
            filteredLeads.map((unlock) => (
              <div key={unlock._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Status Badge */}
                    {getStatusBadge(unlock.status)}

                    {/* Lead Title */}
                    <h3 className="text-xl font-bold text-gray-900 mt-3 mb-2">
                      {unlock.leadId.studentClass} {unlock.leadId.subject} Tutor
                    </h3>

                    {/* Unlock Info */}
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Unlocked {new Date(unlock.unlockedAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <span className="text-green-700 font-medium">{unlock.creditsUsed} Credit{unlock.creditsUsed !== 1 ? 's' : ''} Used</span>
                      </div>
                    </div>

                    {/* Lead Details Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span>{unlock.leadId.location.area}, {unlock.leadId.location.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4 text-gray-400" />
                        <span className="capitalize">{unlock.leadId.teachingMode} Tuition</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                        <span>₹{unlock.leadId.budget.toLocaleString()}/{unlock.leadId.budgetType.replace('_', ' ')}</span>
                      </div>
                      {unlock.leadId.preferredTime && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>{unlock.leadId.preferredTime}</span>
                        </div>
                      )}
                    </div>

                    {/* Parent Contact */}
                    {unlock.leadId.parent && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-blue-600" />
                            <div>
                              <div className="text-xs text-gray-600">Parent</div>
                              <div className="text-sm font-semibold text-gray-900">{unlock.leadId.parent.fullName}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-emerald-600" />
                            <div>
                              <div className="text-xs text-gray-600">Phone</div>
                              <a 
                                href={`tel:${unlock.leadId.parent.phone}`}
                                className="text-sm font-semibold text-emerald-700 hover:text-emerald-900"
                              >
                                {unlock.leadId.parent.phone}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-purple-600" />
                            <div>
                              <div className="text-xs text-gray-600">Email</div>
                              <a 
                                href={`mailto:${unlock.leadId.parent.email}`}
                                className="text-sm font-semibold text-purple-700 hover:text-purple-900 truncate"
                              >
                                {unlock.leadId.parent.email}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {unlock.notes && (
                      <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                        <div className="flex items-start gap-2">
                          <MessageCircle className="h-4 w-4 text-gray-600 mt-0.5" />
                          <div>
                            <div className="text-xs font-semibold text-gray-700 mb-1">Notes</div>
                            <p className="text-sm text-gray-700">{unlock.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="ml-6">
                    <button
                      onClick={() => {
                        setSelectedLead(unlock._id);
                        setNewStatus(unlock.status);
                        setNotes(unlock.notes || "");
                      }}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No unlocked leads yet</h3>
              <p className="text-gray-600 mb-6">Browse the marketplace and unlock leads to get started</p>
              <Link href="/tutor/leads">
                <button className="px-6 py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 transition-all">
                  Browse Leads
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Update Status Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Lead Status</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full rounded-lg border-gray-300"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="response_received">Response Received</option>
                    <option value="demo_scheduled">Demo Scheduled</option>
                    <option value="demo_completed">Demo Completed</option>
                    <option value="converted">Converted</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Add any notes about this lead..."
                    className="w-full rounded-lg border-gray-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="flex-1 px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                  {updatingStatus ? (
                    <>
                      <Loader className="inline h-5 w-5 animate-spin mr-2" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setNewStatus("");
                    setNotes("");
                  }}
                  disabled={updatingStatus}
                  className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 disabled:opacity-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </TutorDashboardLayout>
  );
};

export default UnlockedLeadsPage;
