import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import api from "@/lib/apiClient";
import { 
  Phone, Mail, User, MapPin, BookOpen, Clock, CheckCircle, 
  XCircle, Loader, AlertCircle, Eye, Shield, ChevronRight
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

type ContactAccessRequest = {
  unlockId: string;
  lead: {
    _id: string;
    studentName?: string;
    studentClass: string;
    subject: string;
    location?: {
      city?: string;
      area?: string;
    };
    parentName?: string;
    parentPhone?: string;
    parentEmail?: string;
  };
  tutor: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  requestedAt: string;
  notes?: string;
};

const ContactAccessRequestsPage = () => {
  const router = useRouter();
  const [requests, setRequests] = useState<ContactAccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await api.get("/leads/admin/contact-access-requests");
      setRequests(response.data.data || []);
    } catch (error: any) {
      console.error("Failed to fetch contact access requests:", error);
      toast.error(error.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (request: ContactAccessRequest) => {
    if (!confirm(`Approve contact access for ${request.tutor.fullName}?`)) {
      return;
    }

    try {
      setProcessing(request.unlockId);
      
      console.log('[Frontend] Approving contact access:', {
        leadId: request.lead._id,
        tutorId: request.tutor._id,
        url: `/leads/admin/${request.lead._id}/contact-access/${request.tutor._id}`
      });
      
      await api.patch(
        `/leads/admin/${request.lead._id}/contact-access/${request.tutor._id}`,
        {
          granted: true,
          notes: "Approved by admin"
        }
      );

      toast.success("Contact access approved!");
      fetchRequests(); // Refresh list
    } catch (error: any) {
      console.error("Failed to approve:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to approve request");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (request: ContactAccessRequest) => {
    const reason = prompt("Enter rejection reason (optional):");
    
    try {
      setProcessing(request.unlockId);
      await api.patch(
        `/leads/admin/${request.lead._id}/contact-access/${request.tutor._id}`,
        {
          granted: false,
          notes: reason || "Rejected by admin"
        }
      );

      toast.success("Contact access rejected");
      fetchRequests(); // Refresh list
    } catch (error: any) {
      console.error("Failed to reject:", error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Loader className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading contact access requests...</p>
          </div>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="mb-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900">
                    Contact Access Requests
                  </h1>
                </div>
                <p className="text-slate-600">
                  Review and approve tutor requests to view parent contact details
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 border-2 border-indigo-200 rounded-xl">
                <Clock className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-xs text-indigo-600 font-semibold">Pending Requests</p>
                  <p className="text-2xl font-bold text-indigo-700">{requests.length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Requests List */}
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                All Caught Up!
              </h3>
              <p className="text-slate-600">
                No pending contact access requests at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.unlockId}
                  className="bg-white rounded-2xl border-2 border-slate-200 p-6 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    
                    {/* Left: Lead Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                            <h3 className="text-xl font-bold text-slate-900">
                              {request.lead.subject} - {request.lead.studentClass}
                            </h3>
                          </div>
                          {request.lead.studentName && (
                            <p className="text-sm text-slate-600 mb-2">
                              Student: {request.lead.studentName}
                            </p>
                          )}
                          {request.lead.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4" />
                              <span>
                                {request.lead.location.area}, {request.lead.location.city}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="px-3 py-1.5 bg-yellow-100 border border-yellow-300 rounded-full flex items-center gap-2">
                          <Clock className="h-4 w-4 text-yellow-700" />
                          <span className="text-xs font-semibold text-yellow-700">Pending</span>
                        </div>
                      </div>

                      {/* Parent Contact (Hidden from Tutor) */}
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-indigo-200">
                        <p className="text-xs font-semibold text-indigo-700 mb-2 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Parent Contact (Hidden from Tutor)
                        </p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-indigo-600" />
                            <span className="font-medium text-slate-800">
                              {request.lead.parentName || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-indigo-600" />
                            <a
                              href={`tel:${request.lead.parentPhone}`}
                              className="font-medium text-indigo-700 hover:underline"
                            >
                              {request.lead.parentPhone || "N/A"}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-indigo-600" />
                            <a
                              href={`mailto:${request.lead.parentEmail}`}
                              className="font-medium text-indigo-700 hover:underline"
                            >
                              {request.lead.parentEmail || "N/A"}
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Request Info */}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          Requested on {new Date(request.requestedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Right: Tutor Info & Actions */}
                    <div className="lg:w-80 space-y-4">
                      {/* Tutor Info */}
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                        <p className="text-xs font-semibold text-slate-600 mb-3">REQUESTING TUTOR</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-600" />
                            <span className="font-semibold text-slate-900">
                              {request.tutor.fullName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-700">{request.tutor.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-600" />
                            <span className="text-slate-700">{request.tutor.email}</span>
                          </div>
                        </div>
                        <Link
                          href={`/admin/users/tutors/${request.tutor._id}`}
                          className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2 bg-white border-2 border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          <Eye className="h-4 w-4" />
                          View Profile
                        </Link>
                      </div>

                      {/* Actions */}
                      <div className="space-y-2">
                        <button
                          onClick={() => handleApprove(request)}
                          disabled={processing === request.unlockId}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {processing === request.unlockId ? (
                            <>
                              <Loader className="h-5 w-5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              <span>Approve Access</span>
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleReject(request)}
                          disabled={processing === request.unlockId}
                          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 text-red-600 rounded-xl font-semibold hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="h-5 w-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default ContactAccessRequestsPage;
