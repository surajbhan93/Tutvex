import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import leadService, { StudentLead } from "@/services/leadService";
import { 
  Plus, Eye, Edit, Trash2, CheckCircle, XCircle, 
  Clock, MapPin, BookOpen, DollarSign, Users,
  Filter, Search, Download, MoreVertical, 
  AlertCircle, Loader
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const AdminLeadsPage = () => {
  const router = useRouter();
  
  const [leads, setLeads] = useState<StudentLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // Debug logging
    const authStorage = localStorage.getItem('auth-storage');
    console.log('Auth storage on mount:', authStorage);
    
    if (authStorage) {
      const authState = JSON.parse(authStorage);
      console.log('Auth state:', authState);
      console.log('Token:', authState?.state?.token);
      console.log('User:', authState?.state?.user);
    }
    
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Debug: Check if user is logged in
      const authStorage = localStorage.getItem('auth-storage');
      if (!authStorage) {
        console.error("No auth storage found");
        toast.error("Please login first");
        router.push('/login');
        return;
      }
      
      const authState = JSON.parse(authStorage);
      const token = authState?.state?.token;
      
      if (!token) {
        console.error("No token found in auth storage");
        toast.error("Session expired. Please login again");
        router.push('/login');
        return;
      }
      
      console.log("Fetching leads with auth token...");
      const response = await leadService.adminGetAllLeads();
      console.log("Leads response:", response);

      const leadsList: StudentLead[] = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.leads)
        ? response.leads
        : [];

      setLeads(leadsList);
      toast.success(`Loaded ${leadsList.length} leads`);
    } catch (error: any) {
      console.error("Failed to fetch leads:", error);
      console.error("Error response:", error.response);
      
      // Check if it's an auth error
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Authentication failed. Please login again");
        router.push('/login');
      } else {
        toast.error(error.response?.data?.message || error.message || "Failed to load leads");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await leadService.adminDeleteLead(leadId);
      toast.success("Lead deleted successfully");
      setShowDeleteConfirm(false);
      setSelectedLead(null);
      fetchLeads(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete lead");
      setShowDeleteConfirm(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
      new: { bg: "bg-blue-100", text: "text-blue-700", icon: Clock },
      active: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
      assigned: { bg: "bg-purple-100", text: "text-purple-700", icon: Users },
      closed: { bg: "bg-gray-100", text: "text-gray-700", icon: XCircle },
      expired: { bg: "bg-red-100", text: "text-red-700", icon: AlertCircle },
    };

    const config = statusConfig[status] || statusConfig.new || { bg: "bg-blue-100", text: "text-blue-700", icon: Clock };
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesStatus = statusFilter === "" || lead.status === statusFilter;
    const matchesSearch = 
      searchTerm === "" ||
      lead.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.studentClass.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.location.city?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    active: leads.filter(l => l.status === "active").length,
    closed: leads.filter(l => l.status === "closed").length,
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Student Leads</h1>
            <p className="text-gray-600 mt-1">Manage student requirements and tutoring opportunities</p>
          </div>
          <Link href="/admin/create-lead">
            <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all">
              <Plus className="h-5 w-5" />
              Add Lead
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Total Leads</span>
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">New</span>
              <Clock className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.new}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Active</span>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Closed</span>
              <XCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900">{stats.closed}</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by subject, class, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-gray-300"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border-gray-300"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="active">Active</option>
              <option value="assigned">Assigned</option>
              <option value="closed">Closed</option>
              <option value="expired">Expired</option>
            </select>

            <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
              <Download className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
            </div>
          ) : filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Lead ID</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Student</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Class & Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Budget</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Mode</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Unlocks</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Created</th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredLeads.map((lead) => (
                    <tr key={lead._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-900">
                          {lead._id.slice(-8)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {lead.studentName || "Not specified"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          <div className="font-semibold">{lead.studentClass}</div>
                          <div className="text-gray-600">{lead.subject}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span>{lead.location?.area || 'N/A'}, {lead.location?.city || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>₹{lead.budget ? lead.budget.toLocaleString() : '0'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-900">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span className="capitalize">{lead.teachingMode || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(lead.status)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          {lead.totalUnlocks || 0}/{lead.maxUnlocks || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">
                          {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <Link href={`/admin/leads/${lead._id}`}>
                            <button className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                              <Eye className="h-4 w-4" />
                            </button>
                          </Link>
                          <Link href={`/admin/leads/${lead._id}/edit`}>
                            <button className="p-2 rounded-lg hover:bg-indigo-50 text-indigo-600 transition-colors">
                              <Edit className="h-4 w-4" />
                            </button>
                          </Link>
                          <button 
                            onClick={() => {
                              setSelectedLead(lead._id);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600 mb-6">Create your first lead to get started</p>
              <Link href="/admin/create-lead">
                <button className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-all">
                  Create Lead
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-red-100 mb-4">
                  <AlertCircle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Delete Lead?</h2>
                <p className="text-gray-600 mb-6">
                  This action cannot be undone. The lead will be permanently deleted.
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => selectedLead && handleDeleteLead(selectedLead)}
                    className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminLeadsPage;
