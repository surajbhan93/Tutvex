import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import apiClient from "@/lib/apiClient";
import { Search, Users, Eye, MapPin, Phone, Mail, Filter, RotateCcw, UserCircle2, Calendar, ArrowUpRight, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface Parent {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  createdAt?: string;
  location?: {
    city?: string;
    area?: string;
    state?: string;
    country?: string;
    pincode?: string;
  };
}

// City normalizer for filtering
const normalizeCity = (c: any): string => {
  if (!c || typeof c !== "string") return "";
  const str = c.toLowerCase().trim();
  
  if (str.includes("prayagraj") || str.includes("allahabad")) return "prayagraj";
  if (str.includes("delhi")) return "delhi";
  if (str.includes("noida")) return "noida";
  if (str.includes("varanasi")) return "varanasi";
  if (str.includes("lucknow")) return "lucknow";
  if (str.includes("kanpur")) return "kanpur";
  
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
  return c.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default function ParentListPage() {
  const router = useRouter();
  const [parents, setParents] = useState<Parent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const res = await apiClient.get("/admin/parents");
        setParents(res.data.data || []);
      } catch (err) {
        console.error("Failed to load parents", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, []);

  // Extract unique cities
  const cities = useMemo(() => {
    const cleaned = parents
      .map(p => normalizeCity(p.location?.city || ""))
      .filter(c => Boolean(c));
    return Array.from(new Set(cleaned)).sort();
  }, [parents]);

  // City counts
  const cityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    parents.forEach(p => {
      const c = normalizeCity(p.location?.city || "");
      if (c) counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [parents]);

  // Filtered parents
  const filteredParents = useMemo(() => {
    const q = search.toLowerCase().trim();
    
    return parents.filter(p => {
      // City filter
      if (cityFilter) {
        const parentCity = normalizeCity(p.location?.city || "");
        if (parentCity !== cityFilter) return false;
      }
      
      // Search filter
      if (q) {
        const name = (p.fullName || "").toLowerCase();
        const email = (p.email || "").toLowerCase();
        const phone = (p.phone || "").toLowerCase();
        const area = (p.location?.area || "").toLowerCase();
        const city = (p.location?.city || "").toLowerCase();
        
        return name.includes(q) || email.includes(q) || phone.includes(q) || 
               area.includes(q) || city.includes(q);
      }
      
      return true;
    });
  }, [parents, search, cityFilter]);

  const resetFilters = () => {
    setSearch("");
    setCityFilter("");
  };

  const isFiltered = Boolean(search || cityFilter);
  const selectedCityName = cityFilter ? formatCityName(cityFilter) : null;

  // Export to Excel function
  const exportToExcel = () => {
    const exportData = filteredParents.map((parent) => {
      const locationStr = [
        parent.location?.area,
        parent.location?.city,
        parent.location?.state,
        parent.location?.country
      ].filter(Boolean).join(", ") || "Not provided";

      return {
        "Name": parent.fullName || "N/A",
        "Email": parent.email || "N/A",
        "Phone": parent.phone || "Not provided",
        "City": parent.location?.city || "N/A",
        "Area": parent.location?.area || "N/A",
        "State": parent.location?.state || "N/A",
        "Country": parent.location?.country || "N/A",
        "Pincode": parent.location?.pincode || "N/A",
        "Full Location": locationStr,
        "Registration Date": parent.createdAt ? new Date(parent.createdAt).toLocaleDateString() : "N/A",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet["!cols"] = [
      { wch: 25 }, // Name
      { wch: 30 }, // Email
      { wch: 15 }, // Phone
      { wch: 15 }, // City
      { wch: 20 }, // Area
      { wch: 15 }, // State
      { wch: 15 }, // Country
      { wch: 10 }, // Pincode
      { wch: 50 }, // Full Location
      { wch: 15 }, // Registration Date
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Parents");

    const dateStr = new Date().toISOString().split("T")[0];
    const cityStr = selectedCityName ? `_${selectedCityName}` : "_AllCities";
    const filename = `Parents_Data${cityStr}_${dateStr}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium text-gray-600">Loading parents...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="p-4 sm:p-6 space-y-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Parents Management
              {selectedCityName && (
                <span className="text-2xl ml-2">
                  • {selectedCityName}
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedCityName 
                ? `Showing ${filteredParents.length} parents in ${selectedCityName}` 
                : `Manage ${parents.length} registered parents across all locations`}
            </p>
          </div>
          
          {/* Export Button */}
          <button
            onClick={exportToExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <Download size={18} />
            Export to Excel ({filteredParents.length})
          </button>
        </div>

        {/* Stats Cards with Gradient */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard 
            title={selectedCityName ? `In ${selectedCityName}` : "Total Parents"} 
            value={filteredParents.length}
            subtext={selectedCityName ? `Filtered Results` : "Registered"}
            gradient="from-blue-500 to-blue-600"
            icon={Users}
          />
          <StatCard 
            title="Unique Cities" 
            value={cities.length}
            subtext="Locations Covered"
            gradient="from-purple-500 to-purple-600"
            icon={MapPin}
          />
          <StatCard 
            title="Platform Total" 
            value={parents.length}
            subtext="All Parents"
            gradient="from-green-500 to-green-600"
            icon={UserCircle2}
          />
        </div>

        {/* Filter Bar with Modern Design */}
        <div className="bg-white rounded-2xl shadow-lg p-5 space-y-4 border border-gray-200">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Filter size={16} className="text-indigo-600" />
              </div>
              <span>Advanced Filters</span>
              {selectedCityName && (
                <span className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-sm">
                  {selectedCityName} • {filteredParents.length}
                </span>
              )}
            </div>
            {isFiltered && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold hover:underline transition-colors"
              >
                <RotateCcw size={14} />
                Reset All
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="lg:col-span-2 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name, email, phone, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50 transition-all"
              />
            </div>

            {/* City Dropdown */}
            <div className="relative">
              <MapPin className="absolute left-3 top-3 text-gray-400 pointer-events-none" size={16} />
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 font-medium cursor-pointer transition-all"
              >
                <option value="">All Cities ({parents.length})</option>
                {cities.map((c, i) => (
                  <option key={i} value={c}>
                    {formatCityName(c)} ({cityCounts[c] ?? 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between px-1">
          <p className="text-sm font-medium text-gray-600">
            Showing <span className="font-bold text-gray-800">{filteredParents.length}</span> of <span className="font-bold text-gray-800">{parents.length}</span> parents
          </p>
        </div>

        {/* Parents Table with Borders */}
        {filteredParents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
            <div className="flex flex-col items-center justify-center gap-3">
              <div className="p-4 bg-gray-100 rounded-full">
                <Filter className="text-gray-400" size={40} />
              </div>
              <p className="font-semibold text-gray-800 text-lg">
                No parents found
              </p>
              <p className="text-sm text-gray-500">
                {selectedCityName 
                  ? `No parents match your criteria in ${selectedCityName}`
                  : "Try adjusting your search or filters"}
              </p>
              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-gray-300">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r-2 border-indigo-500">
                      #
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r-2 border-indigo-500">
                      <div className="flex items-center gap-2">
                        <UserCircle2 size={16} />
                        <span>Name</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r-2 border-indigo-500">
                      <div className="flex items-center gap-2">
                        <Mail size={16} />
                        <span>Email</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r-2 border-indigo-500">
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>Phone</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r-2 border-indigo-500">
                      <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span>Location</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-bold uppercase tracking-wider border-r-2 border-indigo-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Joined</span>
                      </div>
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-bold uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredParents.map((parent, idx) => {
                    const locationStr = 
                      [parent.location?.area, parent.location?.city, parent.location?.state]
                        .filter(Boolean)
                        .join(", ") || "Not provided";

                    return (
                      <tr 
                        key={parent._id} 
                        className={`border-b-2 border-gray-200 hover:bg-indigo-50 transition-colors ${
                          idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        }`}
                      >
                        <td className="px-4 py-4 border-r-2 border-gray-200">
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-md">
                            {idx + 1}
                          </span>
                        </td>
                        <td className="px-4 py-4 border-r-2 border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                              {parent.fullName?.charAt(0).toUpperCase() || "P"}
                            </div>
                            <span className="font-bold text-gray-900">
                              {parent.fullName || "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-r-2 border-gray-200">
                          {parent.email ? (
                            <a 
                              href={`mailto:${parent.email}`} 
                              className="text-indigo-600 hover:text-indigo-800 font-medium hover:underline transition-colors"
                              title={parent.email}
                            >
                              {parent.email}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic text-sm">Not provided</span>
                          )}
                        </td>
                        <td className="px-4 py-4 border-r-2 border-gray-200">
                          {parent.phone ? (
                            <a 
                              href={`tel:${parent.phone}`}
                              className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-colors"
                            >
                              {parent.phone}
                            </a>
                          ) : (
                            <span className="text-gray-400 italic text-sm">Not provided</span>
                          )}
                        </td>
                        <td className="px-4 py-4 border-r-2 border-gray-200">
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-purple-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700 font-medium text-sm line-clamp-2" title={locationStr}>
                              {locationStr}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4 border-r-2 border-gray-200">
                          {parent.createdAt ? (
                            <span className="text-gray-600 text-sm font-medium">
                              {new Date(parent.createdAt).toLocaleDateString('en-IN', { 
                                day: '2-digit', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-sm">N/A</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => router.push(`/admin/users/parent/${parent._id}`)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
                          >
                            <Eye size={14} />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
}

/* ---------------- COMPONENTS ---------------- */

function StatCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  gradient = "from-blue-500 to-blue-600" 
}: { 
  title: string; 
  value: number;
  subtext?: string;
  icon?: any;
  gradient?: string;
}) {
  const DisplayIcon = Icon || Users;

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-500 font-medium mt-1">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}>
          <DisplayIcon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
}
