import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
import Link from "next/link";
import {
  MapPin,
  BookOpen,
  IndianRupee,
  Phone,
  Mail,
  User,
  Calendar,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Lock,
  Hourglass,
  Send,
} from "lucide-react";

type Lead = {
  _id?: string;
  studentName?: string;
  studentClass: string;
  subject: string;
  teachingMode: string;
  location: {
    city?: string;
    area?: string;
  };
  budget: number;
  budgetType: string;
  additionalRequirements?: string;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  parentId?: {
    fullName: string;
    email: string;
    phone: string;
  };
};

type UnlockedLead = {
  _id: string;
  leadId: Lead;
  status: string;
  creditsUsed: number;
  unlockedAt: string;
  contactedAt?: string;
  demoScheduledAt?: string;
  notes?: string;
  // Contact access control
  contactAccessRequested?: boolean;
  contactAccessRequestedAt?: string;
  contactAccessGranted?: boolean;
  contactAccessGrantedAt?: string;
};

// Clean helper to format Class name (removing duplicate "Class: Class : 1st" strings)
const formatClassName = (rawClass?: string) => {
  if (!rawClass) return "Not specified";
  const cleaned = rawClass.replace(/^class\s*:?\s*/i, "").trim();
  return cleaned ? `Class ${cleaned}` : rawClass;
};

const MyLeadsPage = () => {
  const [leads, setLeads] = useState<UnlockedLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<UnlockedLead | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    fetchLeads();
  }, [statusFilter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const params = statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await api.get(`/leads/my-leads${params}`);
      setLeads(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (
    unlockId: string,
    newStatus: string,
    notes?: string
  ) => {
    try {
      setUpdating(true);
      await api.put("/leads/update-status", {
        unlockId,
        status: newStatus,
        notes,
      });
      fetchLeads();
      setSelectedLead(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkConverted = async (unlockId: string, monthlyFee: number) => {
    if (!monthlyFee || monthlyFee <= 0) {
      alert("Please enter a valid monthly fee");
      return;
    }

    try {
      setUpdating(true);
      await api.post("/leads/mark-converted", {
        unlockId,
        monthlyFee,
        commissionPercentage: 10,
      });
      fetchLeads();
      setSelectedLead(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to mark as converted");
    } finally {
      setUpdating(false);
    }
  };

  const handleRequestContactAccess = async (unlock: UnlockedLead) => {
    try {
      setUpdating(true);
      const targetLead = unlock.leadId;
      const leadId = typeof targetLead === "object" && targetLead?._id ? targetLead._id : (targetLead as any);

      if (!leadId) {
        alert("Lead ID not found");
        return;
      }

      await api.post(`/leads/${leadId}/request-contact-access`);
      alert("✅ Contact access request sent to Admin! Contact details will be unlocked once approved by Admin.");
      fetchLeads();
      setSelectedLead(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to request contact access");
    } finally {
      setUpdating(false);
    }
  };

  const statusCounts = {
    all: leads.length,
    new: leads.filter((l) => l.status === "new").length,
    contacted: leads.filter((l) => l.status === "contacted").length,
    demo_scheduled: leads.filter((l) => l.status === "demo_scheduled").length,
    converted: leads.filter((l) => l.status === "converted").length,
    lost: leads.filter((l) => l.status === "lost").length,
  };

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-[#f8fafc] py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header Bar */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                <h1 className="text-2xl font-bold text-slate-900">My Unlocked Leads</h1>
              </div>
              <p className="text-sm text-slate-500">
                Track status and request Admin approval for parent contact access
              </p>
            </div>
            <Link
              href="/tutor/leads"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition shadow-sm hover:shadow shrink-0"
            >
              <span>Find More Students</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Filter Pill Tabs */}
          <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { key: "all", label: "All Leads" },
              { key: "new", label: "New" },
              { key: "contacted", label: "Contacted" },
              { key: "demo_scheduled", label: "Demo Scheduled" },
              { key: "converted", label: "Converted" },
              { key: "lost", label: "Lost" },
            ].map((filter) => {
              const isActive = statusFilter === filter.key;
              const count = (statusCounts as any)[filter.key] ?? 0;

              return (
                <button
                  key={filter.key}
                  onClick={() => setStatusFilter(filter.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80"
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive
                        ? "bg-slate-800 text-indigo-300"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200/80">
              <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent"></div>
              <p className="mt-4 text-sm font-medium text-slate-500">Loading your unlocked leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center border border-slate-200/80 shadow-sm">
              <MessageSquare className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <h2 className="text-lg font-bold text-slate-800">No leads found</h2>
              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto mb-6">
                You haven't unlocked any student enquiries matching this filter yet.
              </p>
              <Link
                href="/tutor/leads"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
              >
                Browse Leads Marketplace
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {leads.map((unlock) => (
                <LeadCard
                  key={unlock._id}
                  unlock={unlock}
                  onSelect={() => setSelectedLead(unlock)}
                  onRequestContactAccess={() => handleRequestContactAccess(unlock)}
                  updating={updating}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Details & Status Modal */}
      {selectedLead && (
        <LeadDetailsModal
          unlock={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusUpdate={handleStatusUpdate}
          onMarkConverted={handleMarkConverted}
          onRequestContactAccess={() => handleRequestContactAccess(selectedLead)}
          updating={updating}
        />
      )}
    </TutorDashboardLayout>
  );
};

/* ======================
   LEAD CARD COMPONENT
====================== */
const LeadCard = ({
  unlock,
  onSelect,
  onRequestContactAccess,
  updating,
}: {
  unlock: UnlockedLead;
  onSelect: () => void;
  onRequestContactAccess: () => void;
  updating: boolean;
}) => {
  const lead = unlock.leadId;

  const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
    new: { label: "New", bg: "bg-blue-50 border-blue-200", text: "text-blue-700" },
    contacted: { label: "Contacted", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" },
    response_received: { label: "Response", bg: "bg-purple-50 border-purple-200", text: "text-purple-700" },
    demo_scheduled: { label: "Demo Scheduled", bg: "bg-orange-50 border-orange-200", text: "text-orange-700" },
    demo_completed: { label: "Demo Done", bg: "bg-teal-50 border-teal-200", text: "text-teal-700" },
    converted: { label: "Converted", bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-700" },
    lost: { label: "Lost", bg: "bg-rose-50 border-rose-200", text: "text-rose-700" },
  };

  const status = statusConfig[unlock.status] || {
    label: unlock.status,
    bg: "bg-slate-50 border-slate-200",
    text: "text-slate-700",
  };

  const parentName = lead.parentName || lead.parentId?.fullName || "Parent";
  const parentPhone = lead.parentPhone || lead.parentId?.phone || "";
  const cleanedPhone = parentPhone.replace(/\D/g, "");

  const accessGranted = !!unlock.contactAccessGranted;
  const accessRequested = !!unlock.contactAccessRequested;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden">
      {/* Top Header */}
      <div className="p-5 pb-4 border-b border-slate-100">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-slate-900 truncate">{lead.subject}</h3>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">
              {formatClassName(lead.studentClass)}
            </p>
          </div>
          <span
            className={`px-2.5 py-1 text-[11px] font-bold rounded-md border shrink-0 ${status.bg} ${status.text}`}
          >
            {status.label}
          </span>
        </div>
      </div>

      {/* Info Rows */}
      <div className="p-5 space-y-2.5 text-xs flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 w-16 shrink-0">Location</span>
          <span className="font-semibold text-slate-800 truncate">
            {lead.location?.area ? `${lead.location.area}, ${lead.location.city}` : lead.location?.city || "Not specified"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 w-16 shrink-0">Budget</span>
          <span className="font-bold text-slate-900">
            ₹{lead.budget?.toLocaleString()}{" "}
            <span className="font-normal text-slate-400">/{lead.budgetType === "per_hour" ? "hr" : "month"}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 w-16 shrink-0">Parent</span>
          <span className="font-semibold text-slate-800 truncate">{parentName}</span>
        </div>

        {/* Contact Access Status Indicator */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <span className="text-slate-400 w-16 shrink-0">Contact</span>
          {accessGranted ? (
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Granted by Admin
            </span>
          ) : accessRequested ? (
            <span className="font-semibold text-amber-600 flex items-center gap-1">
              <Hourglass className="h-3.5 w-3.5 text-amber-500" /> Access Pending Admin
            </span>
          ) : (
            <span className="font-semibold text-slate-500 flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-slate-400" /> Admin Approval Required
            </span>
          )}
        </div>
      </div>

      {/* Quick Actions Footer */}
      <div className="px-5 pb-5 pt-2 flex items-center gap-2">
        {accessGranted && cleanedPhone ? (
          <>
            <a
              href={`tel:${cleanedPhone}`}
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition border border-emerald-200"
              title="Call Parent"
            >
              <Phone className="h-4 w-4" />
            </a>
            <a
              href={`https://wa.me/91${cleanedPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition border border-green-200"
              title="WhatsApp Parent"
            >
              <MessageSquare className="h-4 w-4" />
            </a>
          </>
        ) : !accessGranted && !accessRequested ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestContactAccess();
            }}
            disabled={updating}
            className="py-2.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Send className="h-3.5 w-3.5" />
            Request Contact Access
          </button>
        ) : !accessGranted && accessRequested ? (
          <div className="py-2.5 px-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold flex items-center justify-center gap-1 text-center">
            <Hourglass className="h-3.5 w-3.5 text-amber-600 animate-pulse" />
            Pending Approval
          </div>
        ) : null}

        <button
          onClick={onSelect}
          className="flex-1 py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <span>View Details</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

/* ======================
   MODAL COMPONENT
====================== */
const LeadDetailsModal = ({
  unlock,
  onClose,
  onStatusUpdate,
  onMarkConverted,
  onRequestContactAccess,
  updating,
}: {
  unlock: UnlockedLead;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
  onMarkConverted: (id: string, fee: number) => void;
  onRequestContactAccess: () => void;
  updating: boolean;
}) => {
  const [selectedStatus, setSelectedStatus] = useState(unlock.status);
  const [notes, setNotes] = useState(unlock.notes || "");
  const [monthlyFee, setMonthlyFee] = useState("");

  const lead = unlock.leadId;
  const parentName = lead.parentName || lead.parentId?.fullName || "Parent";
  const parentPhone = lead.parentPhone || lead.parentId?.phone || "N/A";
  const parentEmail = lead.parentEmail || lead.parentId?.email || "N/A";
  const cleanedPhone = parentPhone.replace(/\D/g, "");

  const accessGranted = !!unlock.contactAccessGranted;
  const accessRequested = !!unlock.contactAccessRequested;

  const statusOptions = [
    { value: "new", label: "New Lead", icon: Clock },
    { value: "contacted", label: "Contacted Parent", icon: Phone },
    { value: "response_received", label: "Response Received", icon: MessageSquare },
    { value: "demo_scheduled", label: "Demo Scheduled", icon: Calendar },
    { value: "demo_completed", label: "Demo Completed", icon: CheckCircle },
    { value: "converted", label: "Converted (Class Joined)", icon: CheckCircle },
    { value: "lost", label: "Lost / Closed", icon: XCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="mb-6 flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{lead.subject}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {formatClassName(lead.studentClass)} · Unlocked on{" "}
              {new Date(unlock.unlockedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Lead Summary */}
        <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/60 text-xs">
          <div>
            <span className="text-slate-400 block mb-0.5">Location</span>
            <span className="font-semibold text-slate-800 block truncate">
              {lead.location?.area ? `${lead.location.area}, ${lead.location.city}` : lead.location?.city || "N/A"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Budget</span>
            <span className="font-bold text-slate-900 block">
              ₹{lead.budget?.toLocaleString()}/{lead.budgetType === "per_hour" ? "hr" : "mo"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Teaching Mode</span>
            <span className="font-semibold text-slate-800 block capitalize">{lead.teachingMode}</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">Credits Used</span>
            <span className="font-bold text-indigo-600 block">{unlock.creditsUsed} credits</span>
          </div>
        </div>

        {/* Parent Contact Access Section */}
        {accessGranted ? (
          /* ✅ CASE 1: Contact Access Granted by Admin */
          <div className="mb-6 rounded-xl bg-emerald-50/70 p-5 border border-emerald-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle className="h-4 w-4 text-emerald-600" /> Parent Direct Contact Info (Access Granted)
              </h3>
              <span className="text-[10px] bg-emerald-200 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Approved by Admin
              </span>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-emerald-700 shrink-0" />
                <span className="font-bold text-slate-900">{parentName}</span>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-emerald-700 shrink-0" />
                  <span className="font-bold text-slate-900">{parentPhone}</span>
                </div>
                {cleanedPhone ? (
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${cleanedPhone}`}
                      className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition"
                    >
                      Call Now
                    </a>
                    <a
                      href={`https://wa.me/91${cleanedPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition"
                    >
                      WhatsApp
                    </a>
                  </div>
                ) : null}
              </div>

              {parentEmail !== "N/A" && (
                <div className="flex items-center gap-2.5 pt-1">
                  <Mail className="h-4 w-4 text-emerald-700 shrink-0" />
                  <a href={`mailto:${parentEmail}`} className="text-xs text-indigo-700 font-semibold hover:underline">
                    {parentEmail}
                  </a>
                </div>
              )}
            </div>
          </div>
        ) : accessRequested ? (
          /* ⏳ CASE 2: Contact Access Requested, Pending Admin Approval */
          <div className="mb-6 rounded-xl bg-amber-50 p-5 border border-amber-200 text-xs">
            <div className="flex items-center gap-2 text-amber-800 font-bold mb-2 text-sm">
              <Hourglass className="h-4 w-4 text-amber-600 animate-pulse" />
              Contact Access Request Pending Admin Approval
            </div>
            <p className="text-slate-600 mb-3 leading-relaxed">
              Your request for parent contact details has been submitted to Admin and is pending review.
              Contact details (Phone, Call, WhatsApp, Email) will be visible here automatically once approved by Admin.
            </p>
            <div className="p-3 bg-white/80 rounded-lg border border-amber-200 text-amber-900 font-semibold flex items-center justify-between">
              <span>Parent Name: <strong>{parentName}</strong></span>
              <span className="text-slate-400 blur-xs">Phone: +91 987******</span>
            </div>
          </div>
        ) : (
          /* 🔒 CASE 3: Contact Access Not Yet Requested */
          <div className="mb-6 rounded-xl bg-slate-50 p-5 border border-slate-200 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold mb-2 text-sm">
              <Lock className="h-4 w-4 text-indigo-600" />
              Parent Contact Details (Locked)
            </div>
            <p className="text-slate-600 mb-4 leading-relaxed">
              Parent contact information requires authorization from Admin. Click the button below to request contact access from Admin.
            </p>
            <button
              onClick={onRequestContactAccess}
              disabled={updating}
              className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="h-4 w-4" />
              Request Contact Access from Admin
            </button>
          </div>
        )}

        {/* Additional Requirements */}
        {lead.additionalRequirements && (
          <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200/60 text-xs">
            <span className="text-slate-400 block font-semibold mb-1">Additional Requirements</span>
            <p className="text-slate-700 italic">"{lead.additionalRequirements}"</p>
          </div>
        )}

        {/* Status Selection */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-slate-700">
            Update Lead Pipeline Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm font-medium focus:border-indigo-500 focus:outline-none bg-white"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="mb-2 block text-xs font-bold text-slate-700">
            Follow-up Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add follow-up notes or demo details..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-xs focus:border-indigo-500 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Converted Fee Input */}
        {selectedStatus === "converted" && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
            <label className="mb-1.5 block text-xs font-bold text-emerald-900">
              Agreed Monthly Fee (₹)
            </label>
            <input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="e.g. 3500"
              className="w-full rounded-xl border border-emerald-300 px-4 py-2.5 text-sm font-bold focus:border-emerald-500 focus:outline-none bg-white"
            />
            <p className="mt-1.5 text-[11px] text-emerald-700 font-medium">
              🎉 Platform commission: 10% (Tutor keeps 90%)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-300 font-bold text-slate-700 text-xs hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              selectedStatus === "converted"
                ? onMarkConverted(unlock._id, parseFloat(monthlyFee))
                : onStatusUpdate(unlock._id, selectedStatus, notes)
            }
            disabled={
              updating ||
              (selectedStatus === "converted" && (!monthlyFee || parseFloat(monthlyFee) <= 0))
            }
            className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs transition disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLeadsPage;
