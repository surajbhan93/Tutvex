
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
import { resolveImage } from "@/lib/resolveImage";
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  BookOpen,
  Languages,
  GraduationCap,
  Users,
  IndianRupee,
  CalendarDays,
  Clock,
  MapPin,
  Monitor,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function TutorViewPage() {
  const router = useRouter();
  const { id } = router.query;

  const [tutor, setTutor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchTutor();
  }, [id]);

  const fetchTutor = async () => {
    try {
      const res = await apiClient.get(`/admin/tutors/${id}`);
      setTutor(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tutor", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status: "approved" | "rejected") => {
    await apiClient.patch(`/admin/tutors/${id}`, { status });
    fetchTutor();
  };

  if (loading)
    return (
      <AdminDashboardLayout>
        <div className="p-6 text-gray-500">Loading tutor...</div>
      </AdminDashboardLayout>
    );

  if (!tutor)
    return (
      <AdminDashboardLayout>
        <div className="p-6 text-red-500">Tutor not found</div>
      </AdminDashboardLayout>
    );

  const InfoRow = ({ icon: Icon, label, value }: any) => (
    <div className="flex items-start gap-3 text-sm text-gray-700">
      <Icon size={18} className="text-indigo-600 mt-0.5" />
      <div>
        <span className="font-medium">{label}</span>
        <div className="text-gray-600">{value || "N/A"}</div>
      </div>
    </div>
  );

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col lg:flex-row gap-6 items-start lg:items-center">
          <div className="w-32 h-40 rounded-xl overflow-hidden border bg-gray-100">
              <img
                src={resolveImage(tutor.profileImage)}
                alt={tutor.fullName}
                className="w-full h-full object-cover object-center"
              />
            </div>


          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <User className="text-indigo-600" /> {tutor.fullName}
            </h1>

            <div className="flex flex-wrap gap-3 mt-3">
              <span
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  tutor.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : tutor.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {tutor.status.toUpperCase()}
              </span>

              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                Profile {tutor.isProfileComplete ? "Complete" : "Incomplete"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => updateStatus("approved")}
              className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
            >
              <CheckCircle size={18} /> Approve
            </button>

            <button
              onClick={() => updateStatus("rejected")}
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
            >
              <XCircle size={18} /> Reject
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">Contact Information</h3>
            <InfoRow icon={Mail} label="Email" value={tutor.email} />
            <InfoRow icon={Phone} label="Phone" value={tutor.phone} />
            <InfoRow icon={ShieldCheck} label="Gender" value={tutor.gender} />
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">Pricing</h3>
            <InfoRow
              icon={IndianRupee}
              label="Price"
              value={`₹${tutor.price} (${tutor.priceType})`}
            />
            <InfoRow
              icon={CheckCircle}
              label="Demo Available"
              value={tutor.demoAvailable ? "Yes" : "No"}
            />
          </div>

          {/* Teaching */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">Teaching Details</h3>
            <InfoRow
              icon={BookOpen}
              label="Subjects"
              value={tutor.subjects?.join(", ")}
            />
            <InfoRow
              icon={Languages}
              label="Languages"
              value={tutor.languages?.join(", ")}
            />
            <InfoRow
              icon={Users}
              label="Classes"
              value={tutor.classesTaught?.join(", ")}
            />
            <InfoRow
              icon={Monitor}
              label="Mode"
              value={
                Array.isArray(tutor.teachingMode)
                  ? tutor.teachingMode.join(", ")
                  : tutor.teachingMode
              }
            />
            <InfoRow
              icon={CalendarDays}
              label="Availability"
              value={
                Array.isArray(tutor.availability)
                  ? tutor.availability.join(", ")
                  : tutor.availability
              }
            />
          </div>

          {/* Qualification */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
            <h3 className="font-semibold text-lg">
              Qualification & Experience
            </h3>
            <InfoRow
              icon={GraduationCap}
              label="Qualification"
              value={tutor.qualification}
            />
            <InfoRow
              icon={GraduationCap}
              label="College"
              value={tutor.college}
            />
            <InfoRow
              icon={Clock}
              label="Experience"
              value={`${tutor.yearsOfExperience} years`}
            />
            <p className="text-sm text-gray-600">
              {tutor.experienceDescription}
            </p>
          </div>

          {/* Documents */}
<div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 lg:col-span-2">
  <h3 className="font-semibold text-lg">Documents</h3>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    <InfoRow
      icon={CheckCircle}
      label="Identity Proof"
      value={
        tutor.documents?.identityProof ? (
          <a
            href={tutor.documents.identityProof}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        ) : "Not Uploaded"
      }
    />

    <InfoRow
      icon={CheckCircle}
      label="Education Proof"
      value={
        tutor.documents?.educationProof ? (
          <a
            href={tutor.documents.educationProof}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        ) : "Not Uploaded"
      }
    />

    <InfoRow
      icon={CheckCircle}
      label="Annexure B"
      value={
        tutor.documents?.annexureB ? (
          <a
            href={tutor.documents.annexureB}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        ) : "Not Uploaded"
      }
    />

    <InfoRow
      icon={CheckCircle}
      label="Bank Details"
      value={
        tutor.documents?.bankDetails ? (
          <a
            href={tutor.documents.bankDetails}
            target="_blank"
            className="text-blue-600 underline"
          >
            View Document
          </a>
        ) : "Not Uploaded"
      }
    />

  </div>

  {/* Verification Status */}
  <div className="mt-4">
    <span className="text-sm font-medium">
      Verification Status:{" "}
      {tutor.isDocumentsVerified ? (
        <span className="text-green-600">Approved ✅</span>
      ) : (
        <span className="text-yellow-600">Pending ⏳</span>
      )}
    </span>
  </div>
</div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 lg:col-span-2">
            <h3 className="font-semibold text-lg">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoRow icon={MapPin} label="City" value={tutor.location?.city} />
              <InfoRow icon={MapPin} label="Area" value={tutor.location?.area} />
              <InfoRow icon={MapPin} label="State" value={tutor.location?.state} />
              <InfoRow
                icon={MapPin}
                label="Country"
                value={tutor.location?.country}
              />
              <InfoRow
                icon={MapPin}
                label="Pincode"
                value={tutor.location?.pincode}
              />
            </div>
          </div>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
