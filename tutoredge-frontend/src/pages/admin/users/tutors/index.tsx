import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MapPin,
  Filter,
  RotateCcw,
  BookOpen,
  Phone,
  UserCheck,
} from "lucide-react";

/* -------------------- COMPREHENSIVE CITY NORMALIZER -------------------- */
const normalizeCity = (c: any): string => {
  if (!c || typeof c !== "string") return "";
  const str = c.toLowerCase().trim();

  // All variations and misspellings of Prayagraj / Allahabad
  if (
    str.includes("allahabad") ||
    str.includes("allhabad") ||
    str.includes("allahabaad") ||
    str.includes("prayagraj") ||
    str.includes("prayag") ||
    str.includes("prayagaraj") ||
    str.includes("paraygraj") ||
    str.includes("pragraaj") ||
    str.includes("pragraj") ||
    str.includes("pragyraj") ||
    str.includes("prayaraaj") ||
    str.includes("praygraj") ||
    str.includes("pryagraj")
  ) {
    return "prayagraj";
  }

  if (str.includes("delhi")) return "delhi";
  if (str.includes("noida")) return "noida";
  if (str.includes("varanasi") || str.includes("banaras")) return "varanasi";
  if (str.includes("lucknow")) return "lucknow";
  if (str.includes("kanpur")) return "kanpur";
  if (str.includes("pune")) return "pune";
  if (str.includes("mumbai")) return "mumbai";
  if (str.includes("bangalore") || str.includes("bengaluru")) return "bengaluru";

  return str.replace(/[^a-z0-9\s]/gi, "").trim();
};

const formatCityName = (c: string): string => {
  if (!c) return "";
  if (c === "prayagraj") return "Prayagraj";
  if (c === "delhi") return "Delhi";
  if (c === "noida") return "Noida";
  if (c === "varanasi") return "Varanasi";
  if (c === "lucknow") return "Lucknow";
  if (c === "kanpur") return "Kanpur";
  return c
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [classFilter, setClassFilter] = useState("");
  const [profileFilter, setProfileFilter] = useState("all");

  const router = useRouter();

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get("/admin_dashboard/tutors?page=1&limit=1500");
      setTutors(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch tutors", err);
    } finally {
      setLoading(false);
    }
  };

  /* -------------------- DYNAMIC CITIES -------------------- */
  const cities = useMemo(() => {
    const cleaned = tutors
      .map((t) =>
        normalizeCity(
          t.location?.city || t.city || t.location?.area || ""
        )
      )
      .filter((c): c is string => Boolean(c));

    return Array.from(new Set(cleaned)).sort((a, b) => a.localeCompare(b));
  }, [tutors]);

  /* -------------------- CITY COUNTS -------------------- */
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    tutors.forEach((t) => {
      const c = normalizeCity(
        t.location?.city || t.city || t.location?.area || ""
      );
      if (c) {
        counts[c] = (counts[c] || 0) + 1;
      }
    });
    return counts;
  }, [tutors]);

  /* -------------------- COUNTS (CITY & FILTER AWARE) -------------------- */
  const stats = useMemo(() => {
    // Filter base tutors by city if selected
    const baseTutors = city
      ? tutors.filter((t) => {
          const tutorCity = normalizeCity(
            t.location?.city || t.city || t.location?.area || ""
          );
          return tutorCity === city;
        })
      : tutors;

    return {
      total: baseTutors.length,
      approved: baseTutors.filter((t) => t.status === "approved").length,
      rejected: baseTutors.filter((t) => t.status === "rejected").length,
      pending: baseTutors.filter(
        (t) => t.status !== "approved" && t.status !== "rejected"
      ).length,
    };
  }, [tutors, city]);

  const uniqueClasses = useMemo(() => {
    const classSet = new Set<string>();
    tutors.forEach((t) => {
      if (Array.isArray(t.classesTaught)) {
        t.classesTaught.forEach((c: string) => {
          if (c && typeof c === "string") classSet.add(c.trim());
        });
      } else if (typeof t.classesTaught === "string" && t.classesTaught) {
        t.classesTaught.split(",").forEach((c: string) => {
          if (c) classSet.add(c.trim());
        });
      }
    });
    return Array.from(classSet).sort();
  }, [tutors]);

  /* -------------------- ADVANCED FILTER -------------------- */
  const filteredTutors = useMemo(() => {
    const q = search.toLowerCase().trim();

    return tutors.filter((t) => {
      // 1. Status Filter
      if (statusFilter !== "all") {
        if (statusFilter === "pending") {
          if (t.status === "approved" || t.status === "rejected") return false;
        } else if (t.status !== statusFilter) {
          return false;
        }
      }

      // 2. Profile Completion Filter
      if (profileFilter !== "all") {
        const isComplete = Boolean(t.isProfileComplete);
        if (profileFilter === "complete" && !isComplete) return false;
        if (profileFilter === "incomplete" && isComplete) return false;
      }

      // 3. Location / City Filter
      const tutorCity = normalizeCity(
        t.location?.city || t.city || t.location?.area || ""
      );
      if (city && tutorCity !== city) {
        return false;
      }

      // 4. Class Level Filter
      if (classFilter) {
        let matchesClass = false;
        if (Array.isArray(t.classesTaught)) {
          matchesClass = t.classesTaught.some(
            (c: string) => c.toLowerCase().trim() === classFilter.toLowerCase().trim()
          );
        } else if (typeof t.classesTaught === "string") {
          matchesClass = t.classesTaught
            .toLowerCase()
            .includes(classFilter.toLowerCase());
        }
        if (!matchesClass) return false;
      }

      // 5. Global Search (Name, Email, Phone, Location Area/City/State, Classes, Subjects)
      if (q) {
        const fullName = (t.fullName || "").toLowerCase();
        const email = (t.email || "").toLowerCase();
        const phone = (t.phone || t.mobileNumber || t.phoneNumber || "").toLowerCase();
        const area = (t.location?.area || "").toLowerCase();
        const state = (t.location?.state || "").toLowerCase();
        const tutorCityStr = (t.location?.city || t.city || "").toLowerCase();
        const classesStr = Array.isArray(t.classesTaught)
          ? t.classesTaught.join(" ").toLowerCase()
          : (t.classesTaught || "").toLowerCase();
        const subjectsStr = Array.isArray(t.subjects)
          ? t.subjects.join(" ").toLowerCase()
          : (t.subjects || "").toLowerCase();

        const matchesSearch =
          fullName.includes(q) ||
          email.includes(q) ||
          phone.includes(q) ||
          area.includes(q) ||
          tutorCityStr.includes(q) ||
          state.includes(q) ||
          classesStr.includes(q) ||
          subjectsStr.includes(q);

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [search, tutors, city, statusFilter, classFilter, profileFilter]);

  const resetFilters = () => {
    setSearch("");
    setCity("");
    setStatusFilter("all");
    setClassFilter("");
    setProfileFilter("all");
  };

  const isFiltered = Boolean(
    search || city || statusFilter !== "all" || classFilter || profileFilter !== "all"
  );

  const selectedCityName = city ? formatCityName(city) : null;

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6 text-gray-500 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-600">Loading tutors management...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Tutors Management
              {selectedCityName && (
                <span className="text-indigo-600 font-medium text-lg ml-2">
                  ({selectedCityName})
                </span>
              )}
            </h1>
            <p className="text-gray-600 text-sm">
              {selectedCityName
                ? `Showing statistics and tutors in ${selectedCityName}`
                : "View, search, and manage all registered tutors and their applications"}
            </p>
          </div>
        </div>

        {/* Stats Cards (City-Aware & Clickable Filters) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={selectedCityName ? `Total in ${selectedCityName}` : "Total Tutors"}
            value={stats.total}
            subtext={selectedCityName ? `In ${selectedCityName}` : "All Cities"}
            active={statusFilter === "all"}
            onClick={() => setStatusFilter("all")}
          />
          <StatCard
            title="Approved"
            value={stats.approved}
            subtext={selectedCityName ? `Approved in ${selectedCityName}` : "All Cities"}
            icon={CheckCircle}
            color="green"
            active={statusFilter === "approved"}
            onClick={() => setStatusFilter("approved")}
          />
          <StatCard
            title="Pending"
            value={stats.pending}
            subtext={selectedCityName ? `Pending in ${selectedCityName}` : "All Cities"}
            icon={Clock}
            color="yellow"
            active={statusFilter === "pending"}
            onClick={() => setStatusFilter("pending")}
          />
          <StatCard
            title="Rejected"
            value={stats.rejected}
            subtext={selectedCityName ? `Rejected in ${selectedCityName}` : "All Cities"}
            icon={XCircle}
            color="red"
            active={statusFilter === "rejected"}
            onClick={() => setStatusFilter("rejected")}
          />
        </div>

        {/* Advanced Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-4 border border-gray-100">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm">
              <Filter size={18} className="text-indigo-600" />
              <span>Advance Filters</span>
              {selectedCityName && (
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                  City: {selectedCityName} ({stats.total} Tutors)
                </span>
              )}
            </div>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium hover:underline transition-colors"
              >
                <RotateCcw size={14} />
                Reset Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, phone, location, subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50/50"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50 font-medium"
              >
                <option value="">All Cities ({tutors.length})</option>
                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {formatCityName(c)} ({cityCounts[c] ?? 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Class Filter Dropdown */}
            <div className="relative">
              <BookOpen className="absolute left-3 top-2.5 text-gray-400 pointer-events-none" size={16} />
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50/50"
              >
                <option value="">All Classes</option>
                {uniqueClasses.map((cls, i) => (
                  <option key={i} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tutors Data Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/50 border-b flex items-center justify-between text-xs text-gray-500 font-medium">
            <span>
              Showing {filteredTutors.length} of {stats.total}{" "}
              {selectedCityName ? `tutors in ${selectedCityName}` : "total tutors"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100/70 text-gray-700 font-semibold border-b text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3.5">Name</th>
                  <th className="px-4 py-3.5">Email</th>
                  <th className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <Phone size={14} className="text-gray-500" />
                      <span>Mobile Number</span>
                    </div>
                  </th>
                  <th className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <MapPin size={14} className="text-gray-500" />
                      <span>Location</span>
                    </div>
                  </th>
                  <th className="px-4 py-3.5">
                    <div className="flex items-center gap-1">
                      <BookOpen size={14} className="text-gray-500" />
                      <span>Classes Taught</span>
                    </div>
                  </th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Profile</th>
                  <th className="px-4 py-3.5 text-center">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredTutors.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="text-gray-300" size={32} />
                        <p className="font-medium text-gray-600">
                          No tutors match the selected criteria
                          {selectedCityName ? ` in ${selectedCityName}` : ""}
                        </p>
                        {isFiltered && (
                          <button
                            onClick={resetFilters}
                            className="text-xs text-indigo-600 hover:underline font-medium mt-1"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTutors.map((tutor) => {
                    const locationStr =
                      [tutor.location?.area, tutor.location?.city, tutor.location?.state]
                        .filter(Boolean)
                        .join(", ") ||
                      tutor.city ||
                      "Not provided";

                    const classesStr = Array.isArray(tutor.classesTaught)
                      ? tutor.classesTaught.join(", ")
                      : tutor.classesTaught || "Not specified";

                    const phoneNum =
                      tutor.phone || tutor.mobileNumber || tutor.phoneNumber || "Not provided";

                    return (
                      <tr
                        key={tutor._id}
                        className="hover:bg-gray-50/80 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-4 py-3 font-semibold text-gray-800">
                          {tutor.fullName || "N/A"}
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 text-gray-600">
                          {tutor.email || "N/A"}
                        </td>

                        {/* Mobile Number */}
                        <td className="px-4 py-3 font-medium text-gray-700">
                          {phoneNum !== "Not provided" ? (
                            <a
                              href={`tel:${phoneNum}`}
                              className="text-gray-800 hover:text-indigo-600 transition-colors"
                            >
                              {phoneNum}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">Not provided</span>
                          )}
                        </td>

                        {/* Location */}
                        <td
                          className="px-4 py-3 text-gray-600 max-w-[200px] truncate"
                          title={locationStr}
                        >
                          {locationStr}
                        </td>

                        {/* Classes Taught */}
                        <td
                          className="px-4 py-3 text-gray-600 max-w-[180px] truncate"
                          title={classesStr}
                        >
                          <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-xs font-medium">
                            {classesStr}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={tutor.status} />
                        </td>

                        {/* Profile Completion */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              tutor.isProfileComplete
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {tutor.isProfileComplete ? "COMPLETE" : "INCOMPLETE"}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() =>
                              router.push(`/admin/users/tutors/${tutor._id}`)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-medium text-xs transition-colors"
                          >
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}

/* -------------------- COMPONENTS -------------------- */

function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  color = "blue",
  active = false,
  onClick,
}: any) {
  const colorStyles: any = {
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-200",
    red: "bg-red-50 text-red-600 border-red-200",
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-4 flex items-center gap-4 border cursor-pointer transition-all shadow-sm hover:shadow-md ${
        active
          ? "ring-2 ring-indigo-500 border-transparent bg-indigo-50/20"
          : "border-gray-100"
      }`}
    >
      {Icon ? (
        <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.blue}`}>
          <Icon size={22} />
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
          <UserCheck size={22} />
        </div>
      )}
      <div>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{typeof value === "number" ? value : (value ?? 0)}</p>
        {subtext && <p className="text-[11px] text-gray-400 font-medium mt-0.5">{subtext}</p>}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: any = {
    approved: "bg-green-100 text-green-800 border-green-200",
    rejected: "bg-red-100 text-red-800 border-red-200",
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  const statusLabel = status ? status.toUpperCase() : "PENDING";

  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
        map[status] || "bg-yellow-100 text-yellow-800 border-yellow-200"
      }`}
    >
      {statusLabel}
    </span>
  );
}
