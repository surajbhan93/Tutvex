import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import dynamic from "next/dynamic";
import { 
  Users, Target, Zap, TrendingUp, Shield, CheckCircle2, 
  MapPin, BookOpen, Clock, DollarSign, ArrowRight, Loader, User, Phone, Filter, X,
  Eye, ChevronDown, Search, Sparkles, SlidersHorizontal, ArrowUpDown
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import api from "@/lib/apiClient";
import Head from "next/head";
import NavBar from "@/components/navbar/NavBar";

// Dynamically import 3D Hero Background to prevent SSR window issues
const ThreeDHeroBackground = dynamic(
  () => import("@/components/common/ThreeDHeroBackground"),
  { ssr: false }
);

type Lead = {
  _id: string;
  studentName?: string;
  studentClass: string;
  board?: string;
  schoolName?: string;
  subject: string;
  teachingMode: "online" | "home" | "hybrid";
  location: {
    city?: string;
    area?: string;
    state?: string;
  };
  budget: number;
  budgetType: string;
  urgency: string;
  availability: "active" | "already_filled";
  qualityScore: number;
  creditsRequired: number;
  totalUnlocks: number;
  maxUnlocks: number;
  createdAt: string;
  additionalRequirements?: string;
};

type MatchedLead = {
  lead: Lead;
  matchScore: number;
  reasons: string[];
};

type Filters = {
  search: string;
  subject: string;
  studentClass: string;
  city: string;
  state: string;
  teachingMode: string;
  budgetRange: string;
  urgency: string;
  board: string;
  sortBy: string;
};

const initialFilters: Filters = {
  search: "",
  subject: "",
  studentClass: "",
  city: "",
  state: "",
  teachingMode: "",
  budgetRange: "",
  urgency: "",
  board: "",
  sortBy: "newest",
};

const FindStudentsLanding = () => {
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();
  const [allLeads, setAllLeads] = useState<MatchedLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<MatchedLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState<Filters>(initialFilters);

  useEffect(() => {
    // Redirect authenticated tutors to leads dashboard
    if (isLoggedIn && user?.role === "tutor") {
      router.push("/tutor/leads");
      return;
    }

    // Fetch all leads for public preview (without authentication)
    const fetchAllLeads = async () => {
      try {
        const response = await api.get("/leads/public/preview");
        const rawArray = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.data)
          ? response.data.data
          : Array.isArray(response.data?.leads)
          ? response.data.leads
          : [];

        const normalizedLeads: MatchedLead[] = rawArray
          .map((item: any) => {
            if (item && item.lead) {
              return {
                lead: item.lead,
                matchScore: item.matchScore || 85,
                reasons: item.reasons || [],
              };
            }
            return {
              lead: item,
              matchScore: 85,
              reasons: [],
            };
          })
          .filter((item: any) => item && item.lead && (item.lead._id || item.lead.subject));

        setAllLeads(normalizedLeads);
        setFilteredLeads(normalizedLeads);
      } catch (error) {
        console.log("Could not fetch public leads:", error);
        setAllLeads([]);
        setFilteredLeads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllLeads();
  }, [isLoggedIn, user, router]);

  // Apply Advanced Filters
  useEffect(() => {
    let result = [...allLeads];

    // Keyword Search (Subject, Class, City, Area)
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      result = result.filter(({ lead }) =>
        (lead?.subject && lead.subject.toLowerCase().includes(q)) ||
        (lead?.studentClass && lead.studentClass.toLowerCase().includes(q)) ||
        (lead?.location?.city && lead.location.city.toLowerCase().includes(q)) ||
        (lead?.location?.area && lead.location.area.toLowerCase().includes(q)) ||
        (lead?.additionalRequirements && lead.additionalRequirements.toLowerCase().includes(q))
      );
    }

    // Subject filter
    if (filters.subject) {
      result = result.filter(({ lead }) => 
        lead?.subject && lead.subject.toLowerCase().includes(filters.subject.toLowerCase())
      );
    }

    // Class filter
    if (filters.studentClass) {
      result = result.filter(({ lead }) => 
        lead?.studentClass && lead.studentClass.toLowerCase().includes(filters.studentClass.toLowerCase())
      );
    }

    // City filter
    if (filters.city) {
      const selectedCity = filters.city.toLowerCase();
      result = result.filter(({ lead }) => {
        const leadCity = lead?.location?.city?.toLowerCase() || "";
        const leadArea = lead?.location?.area?.toLowerCase() || "";
        const leadState = lead?.location?.state?.toLowerCase() || "";
        
        if (selectedCity === "prayagraj" || selectedCity === "allahabad") {
          return leadCity.includes("prayagraj") || leadCity.includes("allahabad") || leadArea.includes("prayagraj") || leadArea.includes("allahabad");
        }
        return leadCity.includes(selectedCity) || leadArea.includes(selectedCity) || leadState.includes(selectedCity);
      });
    }

    // Teaching mode filter
    if (filters.teachingMode) {
      result = result.filter(({ lead }) => 
        lead?.teachingMode === filters.teachingMode
      );
    }

    // Board filter
    if (filters.board) {
      result = result.filter(({ lead }) => 
        lead?.board && lead.board.toLowerCase().includes(filters.board.toLowerCase())
      );
    }

    // Budget Preset Ranges
    if (filters.budgetRange) {
      if (filters.budgetRange === "under2k") {
        result = result.filter(({ lead }) => (lead?.budget || 0) <= 2000);
      } else if (filters.budgetRange === "2k-5k") {
        result = result.filter(({ lead }) => (lead?.budget || 0) >= 2000 && (lead?.budget || 0) <= 5000);
      } else if (filters.budgetRange === "5k-10k") {
        result = result.filter(({ lead }) => (lead?.budget || 0) >= 5000 && (lead?.budget || 0) <= 10000);
      } else if (filters.budgetRange === "above10k") {
        result = result.filter(({ lead }) => (lead?.budget || 0) >= 10000);
      }
    }

    // Urgency filter
    if (filters.urgency) {
      result = result.filter(({ lead }) => 
        lead?.urgency === filters.urgency
      );
    }

    // Sort By
    if (filters.sortBy === "budget_high") {
      result.sort((a, b) => (b.lead?.budget || 0) - (a.lead?.budget || 0));
    } else if (filters.sortBy === "quality") {
      result.sort((a, b) => (b.lead?.qualityScore || 0) - (a.lead?.qualityScore || 0));
    } else {
      // Default: newest
      result.sort((a, b) => new Date(b.lead?.createdAt || 0).getTime() - new Date(a.lead?.createdAt || 0).getTime());
    }

    setFilteredLeads(result);
  }, [filters, allLeads]);

  const handleFilterChange = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters(initialFilters);
  };

  const activeFilterCount = Object.entries(filters).filter(([k, v]) => k !== 'sortBy' && Boolean(v)).length;

  return (
    <>
      <Head>
        <title>Find Students - Live Tutor Requirements | Tutvex</title>
        <meta 
          name="description" 
          content="Discover live student requirements matched to your subjects, location, and teaching mode. Join 1000+ tutors growing their business with Tutvex." 
        />
      </Head>

      {/* Navbar */}
      <NavBar />

      <div className="min-h-screen bg-[#f8fafc]">
        {/* ======================================================== */}
        {/* HERO SECTION WITH 3D BACKGROUND ANIMATION */}
        {/* ======================================================== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 pt-32 pb-24 min-h-[560px] flex items-center">
          {/* 3D Interactive Background Component */}
          <ThreeDHeroBackground />

          {/* Foreground Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 shadow-lg">
              <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs sm:text-sm font-bold text-white tracking-wide">1000+ Active Tutors &amp; Live Student Leads</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-md">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Students Today
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
              Verified student enquiries · Instant matching · Flexible pricing
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/tutor-flow/tutor-registration">
                <button className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-indigo-950 font-extrabold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:bg-indigo-50 transition-all duration-300">
                  <span className="flex items-center justify-center gap-2">
                    Create Profile Free
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform text-indigo-600" />
                  </span>
                </button>
              </Link>

              <Link href="/login">
                <button className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 backdrop-blur-md border border-white/30 text-white font-bold text-base sm:text-lg hover:bg-white/20 transition-all duration-300">
                  Login
                </button>
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-xs sm:text-sm text-slate-300 font-semibold">
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>No Hidden Fees</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Shield className="h-4 w-4 text-indigo-400" />
                <span>100% Verified Enquiries</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>Instant Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* ADVANCED FILTER SECTION & LEADS GRID */}
        {/* ======================================================== */}
        <div className="py-12 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-1">Live Requirements</p>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Recent Student Requirements Available
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Contact details unlocked after tutor login · Pay per lead or subscribe
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold">
                  <Sparkles className="h-4 w-4" />
                  Showing {filteredLeads.length} Lead{filteredLeads.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* ADVANCED FILTER CONTAINER */}
            <div className="bg-white border border-slate-200/90 rounded-2xl mb-8 shadow-xs overflow-hidden">
              {/* Search Bar Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/70">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search by subject, class, city, locality, or requirement..."
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-slate-300/80 rounded-xl focus:outline-none focus:border-indigo-500 bg-white shadow-2xs font-medium"
                    />
                    {filters.search && (
                      <button
                        onClick={() => handleFilterChange('search', '')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Toggle & Clear */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-2">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition bg-white"
                    >
                      <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                      <span>{showFilters ? 'Hide Advanced Filters' : 'Show Advanced Filters'}</span>
                      {activeFilterCount > 0 && (
                        <span className="ml-1 text-[10px] font-extrabold text-white bg-indigo-600 px-2 py-0.5 rounded-full">
                          {activeFilterCount}
                        </span>
                      )}
                    </button>

                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearFilters}
                        className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 px-3 py-2.5 rounded-xl hover:bg-rose-50 border border-rose-200 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear All
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick Preset Filter Chips */}
                <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Quick Presets:</span>
                  {[
                    { label: "🔥 Urgent Needs", key: "urgency", val: "immediate" },
                    { label: "💰 High Budget (>₹5k)", key: "budgetRange", val: "5k-10k" },
                    { label: "📍 Prayagraj", key: "city", val: "Prayagraj" },
                    { label: "💻 Online Tuition", key: "teachingMode", val: "online" },
                    { label: "🏠 Home Tuition", key: "teachingMode", val: "home" },
                    { label: "📐 Mathematics", key: "subject", val: "Mathematics" },
                    { label: "🔬 Physics", key: "subject", val: "Physics" },
                  ].map((preset) => {
                    const isSelected = (filters as any)[preset.key] === preset.val;
                    return (
                      <button
                        key={preset.label}
                        onClick={() => handleFilterChange(preset.key as keyof Filters, isSelected ? "" : preset.val)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition shrink-0 ${
                          isSelected
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Advanced Filters Expandable Panel */}
              {showFilters && (
                <div className="p-5 border-t border-slate-100 bg-white">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Subject Filter */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Subject</label>
                      <select
                        value={filters.subject}
                        onChange={(e) => handleFilterChange('subject', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Subjects</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Biology">Biology</option>
                        <option value="English">English / Spoken English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Computer Science">Computer Science / Coding</option>
                        <option value="Accounts">Accounts / Commerce</option>
                        <option value="Economics">Economics</option>
                        <option value="All Subject">All Subjects (All-in-one)</option>
                      </select>
                    </div>

                    {/* Class / Course Filter */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Class / Exam</label>
                      <select
                        value={filters.studentClass}
                        onChange={(e) => handleFilterChange('studentClass', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Classes &amp; Exams</option>
                        <option value="Class 1">Class 1</option><option value="Class 2">Class 2</option>
                        <option value="Class 3">Class 3</option><option value="Class 4">Class 4</option>
                        <option value="Class 5">Class 5</option><option value="Class 6">Class 6</option>
                        <option value="Class 7">Class 7</option><option value="Class 8">Class 8</option>
                        <option value="Class 9">Class 9</option><option value="Class 10">Class 10</option>
                        <option value="Class 11">Class 11</option><option value="Class 12">Class 12</option>
                        <option value="JEE">IIT-JEE Prep</option>
                        <option value="NEET">NEET UG Prep</option>
                        <option value="NDA">NDA Exam</option>
                      </select>
                    </div>

                    {/* City Filter */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                      <select
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Cities</option>
                        <option value="Prayagraj">Prayagraj (Allahabad)</option>
                        <option value="Varanasi">Varanasi</option>
                        <option value="Lucknow">Lucknow</option>
                        <option value="Kanpur">Kanpur</option>
                        <option value="Noida">Noida</option>
                        <option value="Agra">Agra</option>
                        <option value="Meerut">Meerut</option>
                        <option value="Delhi">Delhi</option>
                        <option value="Gurugram">Gurugram</option>
                        <option value="Faridabad">Faridabad</option>
                        <option value="Jaipur">Jaipur</option>
                        <option value="Jodhpur">Jodhpur</option>
                        <option value="Udaipur">Udaipur</option>
                        <option value="Kota">Kota</option>
                        <option value="Patna">Patna</option>
                        <option value="Ranchi">Ranchi</option>
                        <option value="Bhopal">Bhopal</option>
                        <option value="Indore">Indore</option>
                        <option value="Nagpur">Nagpur</option>
                      </select>
                    </div>

                    {/* Teaching Mode */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Teaching Mode</label>
                      <select
                        value={filters.teachingMode}
                        onChange={(e) => handleFilterChange('teachingMode', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Modes</option>
                        <option value="home">Home Tuition (At Student's Home)</option>
                        <option value="online">Online Tuition</option>
                        <option value="hybrid">Hybrid Mode</option>
                      </select>
                    </div>

                    {/* Budget Range */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Budget Range</label>
                      <select
                        value={filters.budgetRange}
                        onChange={(e) => handleFilterChange('budgetRange', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Budgets</option>
                        <option value="under2k">Under ₹2,000 / month</option>
                        <option value="2k-5k">₹2,000 - ₹5,000 / month</option>
                        <option value="5k-10k">₹5,000 - ₹10,000 / month</option>
                        <option value="above10k">Above ₹10,000 / month</option>
                      </select>
                    </div>

                    {/* Urgency */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Urgency</label>
                      <select
                        value={filters.urgency}
                        onChange={(e) => handleFilterChange('urgency', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Urgencies</option>
                        <option value="immediate">Immediate Requirement</option>
                        <option value="within_week">Within a Week</option>
                        <option value="flexible">Flexible Timing</option>
                      </select>
                    </div>

                    {/* Board */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Board</label>
                      <select
                        value={filters.board}
                        onChange={(e) => handleFilterChange('board', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-medium"
                      >
                        <option value="">All Educational Boards</option>
                        <option value="CBSE">CBSE Board</option>
                        <option value="ICSE">ICSE / ISC Board</option>
                        <option value="State">UP State Board</option>
                        <option value="IB">IB / International Board</option>
                      </select>
                    </div>

                    {/* Sort By */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                        <ArrowUpDown className="h-3 w-3 text-indigo-600" /> Sort By
                      </label>
                      <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-indigo-500 bg-white font-bold text-indigo-900"
                      >
                        <option value="newest">Newest Leads First</option>
                        <option value="budget_high">Highest Budget First</option>
                        <option value="quality">Highest Quality Score</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* LEADS GRID */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200">
                <Loader className="h-10 w-10 text-indigo-600 animate-spin mb-3" />
                <p className="text-sm text-gray-500 font-medium">Fetching live student requirements...</p>
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-800 mb-1">No matching student leads found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mb-5">
                  Try adjusting your search keywords, city, or filter options to explore available tutoring enquiries.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition shadow-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLeads.map(({ lead, matchScore }) => (
                  <LeadCard key={lead._id} lead={lead} matchScore={matchScore} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

/* ======================================================== */
/* LEAD CARD COMPONENT — EDUCATIONAL & PROFESSIONAL UI */
/* ======================================================== */
const LeadCard = ({ lead, matchScore }: { lead: Lead; matchScore: number }) => {
  const isFilled = lead.availability === "already_filled";

  return (
    <div className={`bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex flex-col justify-between overflow-hidden ${isFilled ? 'opacity-80 bg-gray-50/60' : ''}`}>
      {/* Top Header */}
      <div className="p-5 pb-4 border-b border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-gray-900 truncate">{lead.subject}</h3>
            <p className="text-xs font-semibold text-gray-500 mt-0.5">
              {lead.studentClass} {lead.board ? `· ${lead.board}` : ''}
            </p>
            {lead.schoolName && (
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{lead.schoolName}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            {isFilled ? (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-gray-100 text-gray-400">Filled</span>
            ) : (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Active
              </span>
            )}
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {matchScore}% Match
            </span>
          </div>
        </div>
      </div>

      {/* Info Rows */}
      <div className="p-5 space-y-2 text-xs flex-1">
        <div className="flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-400 w-16 shrink-0">Location</span>
          <span className="font-semibold text-gray-800 truncate">
            {lead.location?.area ? `${lead.location.area}, ${lead.location.city}` : lead.location?.city || "Not specified"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-400 w-16 shrink-0">Mode</span>
          <span className="font-semibold text-gray-800 capitalize">{lead.teachingMode} Tuition</span>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-400 w-16 shrink-0">Budget</span>
          <span className="font-bold text-gray-900">
            ₹{lead.budget?.toLocaleString()}{" "}
            <span className="font-normal text-gray-400">/{lead.budgetType === "per_hour" ? "hr" : "month"}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span className="text-gray-400 w-16 shrink-0">Urgency</span>
          <span className="font-medium text-gray-700 capitalize">{lead.urgency?.replace("_", " ")}</span>
        </div>

        {lead.additionalRequirements && (
          <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 italic truncate">
            "{lead.additionalRequirements}"
          </div>
        )}
      </div>

      {/* Locked Contact CTA Footer */}
      <div className="p-5 pt-0">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-700 mb-1">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span className="blur-[3px] select-none">Parent Name Hidden</span>
            <Phone className="h-3.5 w-3.5 text-slate-400 ml-2" />
            <span className="blur-[3px] select-none">+91 9876543210</span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{lead.totalUnlocks}/{lead.maxUnlocks} Unlocked</span>
            <span className="font-bold text-indigo-600">{lead.creditsRequired} Credits</span>
          </div>
        </div>

        <Link href={isFilled ? "#" : "/tutor-flow/tutor-registration"}>
          <button
            disabled={isFilled}
            className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
              isFilled
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100'
            }`}
          >
            <span>{isFilled ? 'Position Filled' : 'Unlock Parent Contact Details'}</span>
            {!isFilled && <ArrowRight className="h-3.5 w-3.5" />}
          </button>
        </Link>
      </div>
    </div>
  );
};

export default FindStudentsLanding;
