import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import TutorDashboardLayout from "@/components/tutor-dashboard/TutorDashboardLayout";
import Breadcrumb from "@/components/ui/Breadcrumb";
import api from "@/lib/apiClient";
import { 
  Users, Zap, TrendingUp, MapPin, BookOpen, DollarSign, 
  Clock, Star, Filter, Search, ChevronRight, AlertCircle,
  Loader, Home, Video, LayoutDashboard, Target
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import toast from "react-hot-toast";
import Link from "next/link";

type Lead = {
  _id: string;
  studentName?: string;
  studentClass: string;
  subject: string;
  teachingMode: "online" | "home" | "hybrid";
  location: {
    city?: string;
    area?: string;
    state?: string;
    pincode?: string;
  };
  budget: number;
  budgetType: string;
  urgency: string;
  qualityScore: number;
  creditsRequired: number;
  totalUnlocks: number;
  maxUnlocks: number;
  createdAt: string;
  additionalRequirements?: string;
  preferredTime?: string;
};

type MatchedLead = {
  lead: Lead;
  matchScore: number;
  reasons: string[];
};

const TutorLeadsPage = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  
  const [leads, setLeads] = useState<MatchedLead[]>([]);
  const [creditBalance, setCreditBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: "",
    studentClass: "",
    city: "",
    teachingMode: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Check authentication
    if (!isLoggedIn || user?.role !== "tutor") {
      router.push("/find-students");
      return;
    }

    fetchData();
  }, [isLoggedIn, user, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch leads and credits from the working API endpoints
      const [leadsRes, creditsRes] = await Promise.all([
        api.get("/leads/marketplace"),
        api.get("/wallet/credits").catch(() => ({ data: { success: false, data: { availableCredits: 0 } } })),
      ]);
      
      console.log("Leads Response:", leadsRes.data);
      console.log("Credits Response:", creditsRes.data);
      
      const leadsList = Array.isArray(leadsRes.data)
        ? leadsRes.data
        : Array.isArray(leadsRes.data?.data)
        ? leadsRes.data.data
        : [];

      setLeads(leadsList);
      
      // ✅ Fix: Extract availableCredits from the correct response structure
      const creditData = creditsRes.data?.data || creditsRes.data;
      const availableCredits = creditData?.availableCredits ?? 0;
      
      console.log("Credit Data:", creditData);
      console.log("Available Credits:", availableCredits);
      
      setCreditBalance(availableCredits);
    } catch (error: any) {
      console.error("Failed to fetch marketplace data", error);
      toast.error(error.response?.data?.message || "Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async () => {
    await fetchData();
  };

  const filteredLeads = leads.filter(({ lead }) => {
    if (!lead) return false;
    
    const matchesSearch = 
      searchTerm === "" ||
      (lead.subject && lead.subject.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.studentClass && lead.studentClass.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.location?.city && lead.location.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.location?.area && lead.location.area.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSubject = !filters.subject || (lead.subject && lead.subject.toLowerCase().includes(filters.subject.toLowerCase()));
    const matchesClass = !filters.studentClass || (lead.studentClass && lead.studentClass.toLowerCase().includes(filters.studentClass.toLowerCase()));
    const matchesCity = !filters.city || (lead.location?.city && lead.location.city.toLowerCase().includes(filters.city.toLowerCase()));
    const matchesMode = !filters.teachingMode || (lead.teachingMode && lead.teachingMode.toLowerCase() === filters.teachingMode.toLowerCase());
    
    return matchesSearch && matchesSubject && matchesClass && matchesCity && matchesMode;
  });

  return (
    <TutorDashboardLayout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/tutor/dashboard", icon: LayoutDashboard },
            { label: "Find Students", icon: Target },
          ]}
        />

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Find Your Next Student</h1>
          <p className="text-emerald-50">
            Discover tutoring requirements matched to your profile
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available Leads</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : leads.length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Available Credits</span>
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : creditBalance}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">High Match</span>
              <Star className="h-5 w-5 text-amber-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : leads.filter(l => l.matchScore >= 80).length}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Quality Leads</span>
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">
              {loading ? "..." : leads.filter(l => l.lead.qualityScore >= 75).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                className="w-full rounded-lg border-gray-300 text-sm"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="English">English</option>
                <option value="Computer Science">Computer Science</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
              <select
                value={filters.studentClass}
                onChange={(e) => setFilters({ ...filters, studentClass: e.target.value })}
                className="w-full rounded-lg border-gray-300 text-sm"
              >
                <option value="">All Classes</option>
                {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                  <option key={num} value={`Grade ${num}`}>Class {num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full rounded-lg border-gray-300 text-sm"
              >
                <option value="">All Cities</option>
                <option value="Prayagraj">Prayagraj</option>
                <option value="Lucknow">Lucknow</option>
                <option value="Varanasi">Varanasi</option>
                <option value="Kanpur">Kanpur</option>
                <option value="Delhi">Delhi</option>
                <option value="Noida">Noida</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mode</label>
              <select
                value={filters.teachingMode}
                onChange={(e) => setFilters({ ...filters, teachingMode: e.target.value })}
                className="w-full rounded-lg border-gray-300 text-sm"
              >
                <option value="">All Modes</option>
                <option value="online">Online</option>
                <option value="home">Home</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search by subject, class, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border-2 border-gray-200 text-sm bg-gradient-to-r from-emerald-50 to-teal-50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all"
              />
            </div>
            <button
              onClick={handleFilterChange}
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              Apply
            </button>
          </div>
        </div>

        {/* Leads List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-emerald-600 animate-spin" />
            </div>
          ) : filteredLeads.length > 0 ? (
            filteredLeads.map(({ lead, matchScore, reasons }) => (
              <Link key={lead._id} href={`/tutor/leads/${lead._id}`}>
                <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-gray-100 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {/* Match Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold mb-3">
                        <Star className="h-4 w-4" />
                        {matchScore}% Match
                      </div>

                      {/* Quality Score */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold mb-3 ml-2">
                        Quality: {lead.qualityScore}/100
                      </div>

                      {/* Lead Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {lead.subject} - {lead.studentClass}
                      </h3>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{lead.location?.area || 'Area not specified'}, {lead.location?.city || 'City not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          {lead.teachingMode === 'online' ? <Video className="h-4 w-4 text-gray-400" /> : <Home className="h-4 w-4 text-gray-400" />}
                          <span className="capitalize">{lead.teachingMode || 'Not specified'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>₹{lead.budget?.toLocaleString() || '0'}/{lead.budgetType === 'per_hour' ? 'hr' : 'month'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{lead.urgency?.replace('_', ' ') || 'Flexible'}</span>
                        </div>
                      </div>

                      {/* Match Reasons */}
                      {reasons && reasons.length > 0 && (
                        <div className="bg-indigo-50 rounded-lg p-3 mb-3">
                          <p className="text-xs font-semibold text-indigo-700 mb-1">Why this matches:</p>
                          <ul className="space-y-1">
                            {reasons.slice(0, 2).map((reason, idx) => (
                              <li key={idx} className="text-xs text-indigo-600">
                                • {reason}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Additional Requirements */}
                      {lead.additionalRequirements && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          <span className="font-semibold">Requirements:</span> {lead.additionalRequirements}
                        </p>
                      )}
                    </div>

                    {/* Right Side */}
                    <div className="ml-6 text-right">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-50 border border-purple-200 mb-3">
                        <Zap className="h-4 w-4 text-purple-600" />
                        <span className="text-sm font-bold text-purple-900">{lead.creditsRequired || 1} Credits</span>
                      </div>
                      <div className="text-xs text-gray-500 mb-3">
                        {lead.totalUnlocks || 0}/{lead.maxUnlocks || 10} unlocked
                      </div>
                      <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm">
                        View Details
                        <ChevronRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Urgency Tag */}
                  {lead.urgency === "immediate" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                      <AlertCircle className="h-3 w-3" />
                      Urgent Requirement
                    </div>
                  )}
                </div>
              </Link>
            ))
          ) : (
            <div className="bg-white rounded-xl p-12 text-center shadow-sm border border-gray-100">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching leads found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your filters or check back later for new opportunities</p>
              <Link href="/tutor/dashboard">
                <button className="px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-all">
                  Go to Dashboard
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </TutorDashboardLayout>
  );
};

export default TutorLeadsPage;
