import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
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
} from "lucide-react";

type Lead = {
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
  parentId: {
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
      alert("Status updated successfully!");
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
      alert("Lead marked as converted! 🎉");
      fetchLeads();
      setSelectedLead(null);
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to mark as converted");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading your leads...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

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
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Leads</h1>
            <p className="mt-2 text-slate-600">
              Manage and track your unlocked student enquiries
            </p>
          </div>

          {/* Status Filters */}
          <div className="mb-6 flex flex-wrap gap-3">
            {[
              { key: "all", label: "All" },
              { key: "new", label: "New" },
              { key: "contacted", label: "Contacted" },
              { key: "demo_scheduled", label: "Demo Scheduled" },
              { key: "converted", label: "Converted" },
              { key: "lost", label: "Lost" },
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setStatusFilter(filter.key)}
                className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                  statusFilter === filter.key
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`}
              >
                {filter.label} ({(statusCounts as any)[filter.key]})
              </button>
            ))}
          </div>

          {/* Leads List */}
          {leads.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <MessageSquare className="mx-auto h-16 w-16 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold text-slate-700">
                No leads found
              </h2>
              <p className="mt-2 text-slate-500">
                Go to marketplace to unlock new leads
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {leads.map((unlock) => (
                <LeadCard
                  key={unlock._id}
                  unlock={unlock}
                  onSelect={() => setSelectedLead(unlock)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lead Details Modal */}
      {selectedLead && (
        <LeadDetailsModal
          unlock={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusUpdate={handleStatusUpdate}
          onMarkConverted={handleMarkConverted}
          updating={updating}
        />
      )}
    </TutorDashboardLayout>
  );
};

const LeadCard = ({
  unlock,
  onSelect,
}: {
  unlock: UnlockedLead;
  onSelect: () => void;
}) => {
  const statusColors: any = {
    new: "bg-blue-100 text-blue-700",
    contacted: "bg-yellow-100 text-yellow-700",
    response_received: "bg-purple-100 text-purple-700",
    demo_scheduled: "bg-orange-100 text-orange-700",
    demo_completed: "bg-teal-100 text-teal-700",
    converted: "bg-green-100 text-green-700",
    lost: "bg-red-100 text-red-700",
  };

  const lead = unlock.leadId;

  return (
    <div
      onClick={onSelect}
      className="cursor-pointer rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl"
    >
      <div className="mb-4 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">{lead.subject}</h3>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            statusColors[unlock.status]
          }`}
        >
          {unlock.status.replace("_", " ")}
        </span>
      </div>

      <div className="space-y-2 text-sm text-slate-600">
        <p>
          <strong>Class:</strong> {lead.studentClass}
        </p>
        <p className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {lead.location.city}
        </p>
        <p className="flex items-center gap-1">
          <IndianRupee className="h-4 w-4" />₹{lead.budget}/
          {lead.budgetType === "per_hour" ? "hr" : "month"}
        </p>
        <p className="flex items-center gap-1">
          <User className="h-4 w-4" />
          {lead.parentId?.fullName || "Parent"}
        </p>
      </div>

      <div className="mt-4 text-xs text-slate-400">
        Unlocked: {new Date(unlock.unlockedAt).toLocaleDateString()}
      </div>

      <button className="mt-4 w-full rounded-xl bg-indigo-50 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition">
        View Details & Update
      </button>
    </div>
  );
};

const LeadDetailsModal = ({
  unlock,
  onClose,
  onStatusUpdate,
  onMarkConverted,
  updating,
}: {
  unlock: UnlockedLead;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, notes?: string) => void;
  onMarkConverted: (id: string, fee: number) => void;
  updating: boolean;
}) => {
  const [selectedStatus, setSelectedStatus] = useState(unlock.status);
  const [notes, setNotes] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");

  const lead = unlock.leadId;
  const parent = lead.parentId;

  const statusOptions = [
    { value: "new", label: "New", icon: Clock },
    { value: "contacted", label: "Contacted", icon: Phone },
    { value: "response_received", label: "Response Received", icon: MessageSquare },
    { value: "demo_scheduled", label: "Demo Scheduled", icon: Calendar },
    { value: "demo_completed", label: "Demo Completed", icon: CheckCircle },
    { value: "converted", label: "Converted", icon: CheckCircle },
    { value: "lost", label: "Lost", icon: XCircle },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Lead Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              Unlocked on {new Date(unlock.unlockedAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Lead Info */}
        <div className="mb-6 space-y-4 rounded-xl bg-slate-50 p-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">
              {lead.subject} - {lead.studentClass}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Location</p>
              <p className="font-medium text-slate-800">
                {lead.location.area}, {lead.location.city}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Budget</p>
              <p className="font-medium text-slate-800">
                ₹{lead.budget}/{lead.budgetType === "per_hour" ? "hr" : "month"}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Teaching Mode</p>
              <p className="font-medium text-slate-800 capitalize">
                {lead.teachingMode}
              </p>
            </div>
            <div>
              <p className="text-slate-500">Credits Used</p>
              <p className="font-medium text-slate-800">{unlock.creditsUsed}</p>
            </div>
          </div>
          {lead.additionalRequirements && (
            <div>
              <p className="text-slate-500">Additional Requirements</p>
              <p className="mt-1 text-sm text-slate-700">
                {lead.additionalRequirements}
              </p>
            </div>
          )}
        </div>

        {/* Parent Contact */}
        <div className="mb-6 rounded-xl bg-indigo-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-slate-800">
            Parent Contact
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-indigo-600" />
              <span className="font-medium">{parent?.fullName || "N/A"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-600" />
              <a
                href={`tel:${parent?.phone}`}
                className="font-medium text-indigo-700 hover:underline"
              >
                {parent?.phone || "N/A"}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-600" />
              <a
                href={`mailto:${parent?.email}`}
                className="font-medium text-indigo-700 hover:underline"
              >
                {parent?.email || "N/A"}
              </a>
            </div>
          </div>
        </div>

        {/* Status Update */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Update Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about this lead..."
            className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            rows={3}
          />
        </div>

        {/* Monthly Fee (if converting) */}
        {selectedStatus === "converted" && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Monthly Fee (₹)
            </label>
            <input
              type="number"
              value={monthlyFee}
              onChange={(e) => setMonthlyFee(e.target.value)}
              placeholder="Enter monthly fee amount"
              className="w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-indigo-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              Platform commission: 10% (You'll receive 90%)
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-300 py-3 font-semibold text-slate-700 hover:bg-slate-50 transition"
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
              (selectedStatus === "converted" && !monthlyFee)
            }
            className="flex-1 rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyLeadsPage;
