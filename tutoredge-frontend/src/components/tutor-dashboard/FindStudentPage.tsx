import React, { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";
import TutorRequestStatusCard from "./TutorRequestStatusCard";
import toast from "react-hot-toast";
import { Filter, X, Search, MapPin, BookOpen, DollarSign, Clock, SlidersHorizontal } from "lucide-react";
import dynamic from "next/dynamic";

// Lazy load 3D background
const ThreeBackground = dynamic(() => import('@/components/ThreeBackground'), { ssr: false });

/* ---------------- TYPES ---------------- */
interface StudentRequest {
  _id: string; // ✅ FIX
  academicNeeds: string[];
  scheduling: string[];
  urgency: string;
  status: "pending" | "contacted" | "assigned" | "completed" | "cancelled";
  location: string;
  createdAt: string;
  budget?: {
    min: number;
    max: number;
  };
  mode?: "online" | "offline" | "both";

  student: {
    name: string;
    class_grade: string;
  } | null;

  parent: {
    name: string;
    phone: string;
  };
}

/* ---------------- CARD ---------------- */
const RequestCard = ({
  request,
  onRequestToTeach,
}: {
  request: StudentRequest;
  onRequestToTeach: (id: string) => void;
}) => {
  // ✅ Status badge configuration
  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { label: "🟢 Active", color: "bg-green-100 text-green-700 border-green-300" },
      contacted: { label: "📞 Contacted", color: "bg-blue-100 text-blue-700 border-blue-300" },
      assigned: { label: "✅ Filled", color: "bg-gray-100 text-gray-700 border-gray-300" },
      completed: { label: "✅ Completed", color: "bg-purple-100 text-purple-700 border-purple-300" },
      cancelled: { label: "❌ Cancelled", color: "bg-red-100 text-red-700 border-red-300" },
    };
    return badges[status as keyof typeof badges] || badges.pending;
  };

  const statusBadge = getStatusBadge(request.status);

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
      <div>
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-bold text-gray-800 flex-1">
          {request.student
            ? `${request.student.name} (Class ${request.student.class_grade})`
            : "Student details not available"}
        </h3>
        {/* ✅ Status Badge */}
        <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${statusBadge.color} ml-2`}>
          {statusBadge.label}
        </span>
      </div>

<p className="mt-1 text-sm text-gray-600">
  <b>Subjects:</b> {request.academicNeeds.join(", ")}
</p>

<p className="mt-1 text-sm text-gray-600">
  <b>Parent:</b> {request.parent.name} | <b>Urgency:</b> {request.urgency}
</p>

      </div>

      <div className="flex flex-wrap gap-2">
        {request.academicNeeds.map((sub, i) => (
          <span
            key={i}
            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800"
          >
            {sub}
          </span>
        ))}

        {request.student?.class_grade && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800">
            {request.student.class_grade}
          </span>
        )}

        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-800">
          {request.location}
        </span>
      </div>

      {/* 🔥 STATUS / ACTION */}
      <TutorRequestStatusCard
        request={request}
        onRequestToTeach={onRequestToTeach}
      />
    </div>
  );
};

/* ---------------- PAGE ---------------- */
const FindStudentPage = () => {
  const [requests, setRequests] = useState<StudentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(true);

  // Filter states
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modeFilter, setModeFilter] = useState("All");
  const [urgencyFilter, setUrgencyFilter] = useState("All");
  const [budgetFilter, setBudgetFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  /* -------- FETCH REQUESTS -------- */
 const fetchRequests = async () => {
  try {
    setLoading(true);
    const res = await apiClient.get("/tutor/dashboard/parent-requests");

    const normalized = (res.data.data || []).map((r: any) => ({
      ...r,
      _id: r._id || r.id, // 🔥 MAIN FIX
    }));

    setRequests(normalized);
  } catch (err) {
    console.error("Failed to fetch student requests", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchRequests();
  }, []);

  /* -------- REQUEST TO TEACH -------- */
  const handleRequestToTeach = async (requestId: string) => {
    const toastId = toast.loading("Sending request to admin...");
    try {
      await apiClient.post(
        `/tutor/parent-requests/${requestId}/request-to-teach`,
        {
          note: "I am available for demo this week in the evening",
        }
      );
        
      toast.success(
      "Request sent to admin successfully. If the assigned tutor rejects, you will be contacted for demo.",
      { id: toastId }
    );


      fetchRequests(); // 🔄 Refresh list so status becomes "contacted"
    } catch (err: any) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  /* -------- FILTER LOGIC -------- */
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Subject filter
      const subjectMatch =
        subjectFilter === "All" ||
        req.academicNeeds.some(need => need.toLowerCase().includes(subjectFilter.toLowerCase()));

      // Grade filter
      const gradeMatch =
        gradeFilter === "All" ||
        req.student?.class_grade === gradeFilter;

      // Location filter
      const locationMatch =
        locationFilter === "All" || 
        req.location.toLowerCase().includes(locationFilter.toLowerCase());

      // Status filter
      const statusMatch =
        statusFilter === "All" ||
        (statusFilter === "Active" && req.status === "pending") ||
        (statusFilter === "Filled" && (req.status === "assigned" || req.status === "completed"));

      // Mode filter
      const modeMatch =
        modeFilter === "All" ||
        req.mode === modeFilter ||
        req.mode === "both";

      // Urgency filter
      const urgencyMatch =
        urgencyFilter === "All" ||
        req.urgency === urgencyFilter;

      // Budget filter
      const budgetMatch =
        budgetFilter === "All" ||
        (budgetFilter === "Low" && req.budget && req.budget.max <= 5000) ||
        (budgetFilter === "Medium" && req.budget && req.budget.max > 5000 && req.budget.max <= 10000) ||
        (budgetFilter === "High" && req.budget && req.budget.max > 10000);

      // Search query
      const searchMatch =
        searchQuery === "" ||
        req.student?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.academicNeeds.some(need => need.toLowerCase().includes(searchQuery.toLowerCase())) ||
        req.location.toLowerCase().includes(searchQuery.toLowerCase());

      return subjectMatch && gradeMatch && locationMatch && statusMatch && 
             modeMatch && urgencyMatch && budgetMatch && searchMatch;
    });
  }, [requests, subjectFilter, gradeFilter, locationFilter, statusFilter, modeFilter, urgencyFilter, budgetFilter, searchQuery]);

  // Clear all filters
  const clearAllFilters = () => {
    setSubjectFilter("All");
    setGradeFilter("All");
    setLocationFilter("All");
    setStatusFilter("All");
    setModeFilter("All");
    setUrgencyFilter("All");
    setBudgetFilter("All");
    setSearchQuery("");
  };

  // Count active filters
  const activeFiltersCount = [subjectFilter, gradeFilter, locationFilter, statusFilter, modeFilter, urgencyFilter, budgetFilter]
    .filter(f => f !== "All").length + (searchQuery ? 1 : 0);

  return (
    <div className="flex flex-col gap-6">
 
      {/* ================= FIND STUDENT HEADER WITH 3D BACKGROUND ================= */}
      <div className="relative mb-6 rounded-xl overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 p-6 text-white shadow-lg min-h-[200px]">
        {/* 🎨 3D ANIMATED BACKGROUND */}
        <div className="absolute inset-0 opacity-40">
          <ThreeBackground />
        </div>
        
        {/* Content on top of 3D background */}
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Search className="h-6 w-6" />
              Find Your Perfect Student
            </h1>
            <p className="mt-2 text-sm text-indigo-100">
              Browse {requests.length} active requests • {filteredRequests.length} matching your filters
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all backdrop-blur-sm"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {showFilters ? 'Hide' : 'Show'} Filters
            {activeFiltersCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-white text-indigo-600 rounded-full text-xs font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-indigo-900/20 pointer-events-none"></div>
      </div>

      {/* ================= SEARCH BAR ================= */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by student name, subject, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* ================= ADVANCED FILTERS ================= */}
      {showFilters && (
        <div className="rounded-xl border-2 border-gray-200 bg-white p-6 shadow-sm space-y-4">
          {/* Filter Header */}
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-gray-800">Advanced Filters</h2>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
              >
                <X className="h-4 w-4" />
                Clear All ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Status Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-green-100 rounded">
                  <Filter className="h-4 w-4 text-green-600" />
                </div>
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Requests</option>
                <option value="Active">🟢 Active (Open)</option>
                <option value="Filled">✅ Already Filled</option>
              </select>
            </div>

            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-blue-100 rounded">
                  <BookOpen className="h-4 w-4 text-blue-600" />
                </div>
                Subject
              </label>
              <select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Subjects</option>
                <optgroup label="Core Sciences">
                  <option value="Mathematics">Mathematics</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                </optgroup>
                <optgroup label="Languages">
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Sanskrit">Sanskrit</option>
                </optgroup>
                <optgroup label="Social Sciences">
                  <option value="History">History</option>
                  <option value="Geography">Geography</option>
                  <option value="Political Science">Political Science</option>
                  <option value="Economics">Economics</option>
                  <option value="Civics">Civics</option>
                </optgroup>
                <optgroup label="Technology">
                  <option value="Computer Science">Computer Science</option>
                  <option value="Information Technology">IT</option>
                </optgroup>
                <optgroup label="Commerce">
                  <option value="Accountancy">Accountancy</option>
                  <option value="Business Studies">Business Studies</option>
                </optgroup>
              </select>
            </div>

            {/* Grade Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-purple-100 rounded">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                </div>
                Class/Grade
              </label>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Classes</option>
                <optgroup label="Primary (1-5)">
                  <option value="Grade 1">Grade 1</option>
                  <option value="Grade 2">Grade 2</option>
                  <option value="Grade 3">Grade 3</option>
                  <option value="Grade 4">Grade 4</option>
                  <option value="Grade 5">Grade 5</option>
                </optgroup>
                <optgroup label="Middle (6-8)">
                  <option value="Grade 6">Grade 6</option>
                  <option value="Grade 7">Grade 7</option>
                  <option value="Grade 8">Grade 8</option>
                </optgroup>
                <optgroup label="Secondary (9-10)">
                  <option value="Grade 9">Grade 9</option>
                  <option value="Grade 10">Grade 10</option>
                </optgroup>
                <optgroup label="Senior (11-12)">
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </optgroup>
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-red-100 rounded">
                  <MapPin className="h-4 w-4 text-red-600" />
                </div>
                City
              </label>
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Cities</option>
                <optgroup label="Uttar Pradesh">
                  <option value="Lucknow">Lucknow</option>
                  <option value="Kanpur">Kanpur</option>
                  <option value="Prayagraj">Prayagraj (Allahabad)</option>
                  <option value="Varanasi">Varanasi</option>
                  <option value="Noida">Noida</option>
                  <option value="Greater Noida">Greater Noida</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Agra">Agra</option>
                  <option value="Meerut">Meerut</option>
                </optgroup>
                <optgroup label="Delhi NCR">
                  <option value="Delhi">Delhi</option>
                  <option value="Gurugram">Gurugram</option>
                  <option value="Faridabad">Faridabad</option>
                </optgroup>
                <optgroup label="Other States">
                  <option value="Jaipur">Jaipur</option>
                  <option value="Kota">Kota</option>
                  <option value="Patna">Patna</option>
                  <option value="Indore">Indore</option>
                  <option value="Bhopal">Bhopal</option>
                </optgroup>
              </select>
            </div>

            {/* Mode Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-cyan-100 rounded">
                  <Clock className="h-4 w-4 text-cyan-600" />
                </div>
                Teaching Mode
              </label>
              <select
                value={modeFilter}
                onChange={(e) => setModeFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Modes</option>
                <option value="online">💻 Online</option>
                <option value="offline">🏠 Home Visit</option>
                <option value="both">🔄 Both</option>
              </select>
            </div>

            {/* Urgency Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-orange-100 rounded">
                  <Clock className="h-4 w-4 text-orange-600" />
                </div>
                Urgency
              </label>
              <select
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Urgency</option>
                <option value="Immediate">🔴 Immediate (Within 24h)</option>
                <option value="This Week">🟠 This Week</option>
                <option value="This Month">🟡 This Month</option>
                <option value="Flexible">🟢 Flexible</option>
              </select>
            </div>

            {/* Budget Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                <div className="p-1 bg-emerald-100 rounded">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                Budget Range
              </label>
              <select
                value={budgetFilter}
                onChange={(e) => setBudgetFilter(e.target.value)}
                className="w-full rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="All">All Budgets</option>
                <option value="Low">₹ Up to 5,000/month</option>
                <option value="Medium">₹₹ 5,000 - 10,000/month</option>
                <option value="High">₹₹₹ Above 10,000/month</option>
              </select>
            </div>

            {/* Placeholder for grid alignment */}
            <div></div>
          </div>

          {/* Active Filters Summary */}
          {activeFiltersCount > 0 && (
            <div className="pt-4 border-t">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                {subjectFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    Subject: {subjectFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSubjectFilter("All")} />
                  </span>
                )}
                {gradeFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                    Class: {gradeFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setGradeFilter("All")} />
                  </span>
                )}
                {locationFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    City: {locationFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setLocationFilter("All")} />
                  </span>
                )}
                {statusFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                    Status: {statusFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("All")} />
                  </span>
                )}
                {modeFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">
                    Mode: {modeFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setModeFilter("All")} />
                  </span>
                )}
                {urgencyFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                    Urgency: {urgencyFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setUrgencyFilter("All")} />
                  </span>
                )}
                {budgetFilter !== "All" && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                    Budget: {budgetFilter}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setBudgetFilter("All")} />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ---------------- LIST ---------------- */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center text-gray-500">
            Loading student requests...
          </p>
        ) : filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <RequestCard
              key={request._id}
              request={request}
              onRequestToTeach={handleRequestToTeach}
            />
          ))
        ) : (
          <div className="py-12 text-center text-gray-500">
            <p>No student requests found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindStudentPage;
