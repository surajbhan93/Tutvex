import { useEffect, useState } from "react";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import api from "@/lib/apiClient";
import {
  MapPin,
  BookOpen,
  IndianRupee,
  Clock,
  Star,
  Zap,
  Lock,
  TrendingUp,
  Home,
  Video,
} from "lucide-react";

type Lead = {
  _id: string;
  studentName?: string;
  studentClass: string;
  subject: string;
  teachingMode: "online" | "home" | "hybrid";
  location: {
    city?: string;
    area?: string;
  };
  budget: number;
  budgetType: string;
  urgency: string;
  qualityScore: number;
  creditsRequired: number;
  totalUnlocks: number;
  maxUnlocks: number;
  createdAt: string;
};

type MatchedLead = {
  lead: Lead;
  matchScore: number;
  reasons: string[];
};

const LeadsMarketplace = () => {
  const [leads, setLeads] = useState<MatchedLead[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsRes, creditsRes] = await Promise.all([
        api.get("/leads/marketplace"),
        api.get("/wallet/credits"),
      ]);

      setLeads(leadsRes.data.data || []);
      setCreditBalance(creditsRes.data.data?.availableCredits || 0);
    } catch (error) {
      console.error("Failed to fetch marketplace data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlock = async (leadId: string) => {
    if (
      !confirm(
        "This will deduct credits from your wallet. Do you want to proceed?"
      )
    ) {
      return;
    }

    try {
      setUnlocking(leadId);
      await api.post("/leads/unlock", { leadId });
      alert("Lead unlocked successfully! Check 'My Leads' to contact them.");
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to unlock lead");
    } finally {
      setUnlocking(null);
    }
  };

  if (loading) {
    return (
      <TutorDashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            <p className="mt-4 text-slate-600">Loading leads...</p>
          </div>
        </div>
      </TutorDashboardLayout>
    );
  }

  return (
    <TutorDashboardLayout>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Lead Marketplace
              </h1>
              <p className="mt-2 text-slate-600">
                Browse and unlock student enquiries matched to your profile
              </p>
            </div>
            <div className="rounded-xl bg-white p-4 shadow-md">
              <p className="text-sm text-slate-500">Available Credits</p>
              <p className="text-3xl font-bold text-indigo-600">
                {creditBalance}
              </p>
            </div>
          </div>

          {/* No Leads */}
          {leads.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
              <Zap className="mx-auto h-16 w-16 text-slate-300" />
              <h2 className="mt-4 text-xl font-semibold text-slate-700">
                No leads available right now
              </h2>
              <p className="mt-2 text-slate-500">
                Check back later or improve your profile for better matching
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {leads.map(({ lead, matchScore, reasons }) => (
                <LeadCard
                  key={lead._id}
                  lead={lead}
                  matchScore={matchScore}
                  reasons={reasons}
                  onUnlock={handleUnlock}
                  unlocking={unlocking === lead._id}
                  canAfford={creditBalance >= lead.creditsRequired}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

const LeadCard = ({
  lead,
  matchScore,
  reasons,
  onUnlock,
  unlocking,
  canAfford,
}: {
  lead: Lead;
  matchScore: number;
  reasons: string[];
  onUnlock: (id: string) => void;
  unlocking: boolean;
  canAfford: boolean;
}) => {
  const urgencyColors: any = {
    immediate: "bg-red-100 text-red-700",
    within_week: "bg-orange-100 text-orange-700",
    within_month: "bg-yellow-100 text-yellow-700",
    flexible: "bg-green-100 text-green-700",
  };

  const matchScoreColor =
    matchScore >= 90
      ? "bg-green-100 text-green-700"
      : matchScore >= 75
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  const modeIcons: any = {
    online: Video,
    home: Home,
    hybrid: TrendingUp,
  };

  const ModeIcon = modeIcons[lead.teachingMode] || Video;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-md transition-all hover:shadow-xl">
      {/* Match Score Badge */}
      <div
        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${matchScoreColor}`}
      >
        {matchScore}% Match
      </div>

      {/* Quality Score */}
      <div className="mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        <span className="text-sm font-medium text-slate-700">
          Quality: {lead.qualityScore}/100
        </span>
      </div>

      {/* Subject & Class */}
      <div className="mb-3">
        <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          {lead.subject}
        </div>
        <p className="mt-1 text-sm text-slate-600">
          Class: {lead.studentClass}
        </p>
      </div>

      {/* Location */}
      {lead.location.city && (
        <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
          <MapPin className="h-4 w-4" />
          {lead.location.area}, {lead.location.city}
        </div>
      )}

      {/* Budget */}
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
        <IndianRupee className="h-4 w-4" />
        ₹{lead.budget} {lead.budgetType === "per_hour" ? "/hr" : "/month"}
      </div>

      {/* Teaching Mode */}
      <div className="mb-3 flex items-center gap-2 text-sm text-slate-600">
        <ModeIcon className="h-4 w-4" />
        <span className="capitalize">{lead.teachingMode}</span>
      </div>

      {/* Urgency */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
            urgencyColors[lead.urgency]
          }`}
        >
          <Clock className="h-3 w-3" />
          {lead.urgency.replace("_", " ")}
        </span>
      </div>

      {/* Match Reasons */}
      {reasons.length > 0 && (
        <div className="mb-4 rounded-lg bg-indigo-50 p-3">
          <p className="mb-1 text-xs font-semibold text-indigo-700">
            Why this matches:
          </p>
          <ul className="space-y-1">
            {reasons.slice(0, 3).map((reason, idx) => (
              <li key={idx} className="text-xs text-indigo-600">
                • {reason}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Unlock Stats */}
      <div className="mb-4 text-xs text-slate-500">
        {lead.totalUnlocks}/{lead.maxUnlocks} tutors unlocked
      </div>

      {/* Unlock Button */}
      <button
        onClick={() => onUnlock(lead._id)}
        disabled={unlocking || !canAfford}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold transition ${
          !canAfford
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
        }`}
      >
        <Lock className="h-4 w-4" />
        {unlocking
          ? "Unlocking..."
          : !canAfford
          ? "Insufficient Credits"
          : `Unlock (${lead.creditsRequired} credits)`}
      </button>
    </div>
  );
};

export default LeadsMarketplace;
