import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import leadService, { StudentLead } from "@/services/leadService";
import { ArrowLeft, Save, Loader, MapPin, BookOpen, DollarSign, Clock } from "lucide-react";
import toast from "react-hot-toast";

const EditLeadPage = () => {
  const router = useRouter();
  const { id } = router.query;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lead, setLead] = useState<StudentLead | null>(null);
  const [formData, setFormData] = useState({
    studentName: "",
    studentClass: "",
    board: "",
    schoolName: "",
    subject: "",
    teachingMode: "online",
    city: "",
    area: "",
    state: "",
    pincode: "",
    budget: "",
    budgetType: "per_month",
    preferredTime: "",
    additionalRequirements: "",
    urgency: "flexible",
    status: "new",
    availability: "active",
    creditsRequired: "3",
    maxUnlocks: "10",
    expiryDate: "",
  });

  useEffect(() => {
    if (id && typeof id === "string") {
      fetchLead(id);
    }
  }, [id]);

  const fetchLead = async (leadId: string) => {
    try {
      setLoading(true);
      const response = await leadService.getLeadById(leadId);
      const leadData = response.data;
      setLead(leadData);

      // Populate form with existing data
      setFormData({
        studentName: leadData.studentName || "",
        studentClass: leadData.studentClass || "",
        board: leadData.board || "",
        schoolName: leadData.schoolName || "",
        subject: leadData.subject || "",
        teachingMode: leadData.teachingMode || "online",
        city: leadData.location?.city || "",
        area: leadData.location?.area || "",
        state: leadData.location?.state || "",
        pincode: leadData.location?.pincode || "",
        budget: leadData.budget?.toString() || "",
        budgetType: leadData.budgetType || "per_month",
        preferredTime: leadData.preferredTime || "",
        additionalRequirements: leadData.additionalRequirements || "",
        urgency: leadData.urgency || "flexible",
        status: leadData.status || "new",
        availability: leadData.availability || "active",
        creditsRequired: leadData.creditsRequired?.toString() || "3",
        maxUnlocks: leadData.maxUnlocks?.toString() || "10",
        expiryDate: (leadData.expiryDate 
          ? new Date(leadData.expiryDate).toISOString().split('T')[0] 
          : "") || "",
      });
    } catch (error: any) {
      console.error("Failed to fetch lead:", error);
      toast.error("Failed to load lead details");
      router.push("/admin/leads");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.studentClass || !formData.subject || !formData.budget) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);

      // Prepare payload
      const payload = {
        studentName: formData.studentName || undefined,
        studentClass: formData.studentClass,
        board: formData.board || undefined,
        schoolName: formData.schoolName || undefined,
        subject: formData.subject,
        teachingMode: formData.teachingMode,
        location: {
          city: formData.city || undefined,
          area: formData.area || undefined,
          state: formData.state || undefined,
          pincode: formData.pincode || undefined,
        },
        budget: parseInt(formData.budget),
        budgetType: formData.budgetType,
        preferredTime: formData.preferredTime || undefined,
        additionalRequirements: formData.additionalRequirements || undefined,
        urgency: formData.urgency,
        status: formData.status,
        availability: formData.availability,
        creditsRequired: parseInt(formData.creditsRequired),
        maxUnlocks: parseInt(formData.maxUnlocks),
        expiryDate: formData.expiryDate || undefined,
      };

      // Update the lead using admin API
      await leadService.adminUpdateLead(id as string, payload);

      toast.success("Lead updated successfully!");
      router.push(`/admin/leads/${id}`);
    } catch (error: any) {
      console.error("Failed to update lead:", error);
      toast.error(error.response?.data?.message || "Failed to update lead");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      </AdminDashboardLayout>
    );
  }

  if (!lead) {
    return (
      <AdminDashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Lead not found</p>
        </div>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Edit Lead</h1>
            <p className="text-gray-600 mt-1">Update student lead details</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Student Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-600" />
              Student Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name (Optional)
                </label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="Enter student name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class/Grade <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentClass"
                  value={formData.studentClass}
                  onChange={handleChange}
                  placeholder="e.g., Class 10, Grade 5"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board (Optional)
                </label>
                <select
                  name="board"
                  value={formData.board}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Board</option>
                  <option value="CBSE">CBSE</option>
                  <option value="ICSE">ICSE</option>
                  <option value="ISC">ISC</option>
                  <option value="State Board">State Board</option>
                  <option value="IB (International Baccalaureate)">IB (International Baccalaureate)</option>
                  <option value="IGCSE">IGCSE</option>
                  <option value="Cambridge">Cambridge</option>
                  <option value="NIOS">NIOS (National Institute of Open Schooling)</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name (Optional)
                </label>
                <input
                  type="text"
                  name="schoolName"
                  value={formData.schoolName}
                  onChange={handleChange}
                  placeholder="Enter school name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Mathematics, Physics"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teaching Mode <span className="text-red-500">*</span>
                </label>
                <select
                  name="teachingMode"
                  value={formData.teachingMode}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="online">Online</option>
                  <option value="home">Home Tuition</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Location
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area/Locality
                </label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Enter area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="Enter pincode"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Budget & Requirements */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-indigo-600" />
              Budget & Requirements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter budget"
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget Type
                </label>
                <select
                  name="budgetType"
                  value={formData.budgetType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="per_hour">Per Hour</option>
                  <option value="per_month">Per Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <input
                  type="text"
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  placeholder="e.g., Weekdays 6-8 PM"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency
                </label>
                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="immediate">Immediate</option>
                  <option value="within_week">Within a Week</option>
                  <option value="within_month">Within a Month</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Requirements
                </label>
                <textarea
                  name="additionalRequirements"
                  value={formData.additionalRequirements}
                  onChange={handleChange}
                  placeholder="Any specific requirements or preferences..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Lead Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-indigo-600" />
              Lead Settings
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Availability <span className="text-red-500">*</span>
                </label>
                <select
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="active">✅ Active (Tutors can unlock)</option>
                  <option value="already_filled">✓ Already Filled (Display only)</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  {formData.availability === "active" 
                    ? "Tutors can spend credits to unlock this lead" 
                    : "Display only - tutors cannot unlock (for old leads)"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="new">New</option>
                  <option value="active">Active</option>
                  <option value="assigned">Assigned</option>
                  <option value="closed">Closed</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credits Required
                </label>
                <input
                  type="number"
                  name="creditsRequired"
                  value={formData.creditsRequired}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Unlocks
                </label>
                <input
                  type="number"
                  name="maxUnlocks"
                  value={formData.maxUnlocks}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminDashboardLayout>
  );
};

export default EditLeadPage;
