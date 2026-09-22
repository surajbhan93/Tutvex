
import { useEffect, useRef, useState } from "react";
import api from "@/lib/apiClient";
import { resolveImage } from "@/lib/resolveImage";
import { 
  Upload, FileText, CheckCircle, XCircle, 
  User, Mail, Phone, MapPin, Book, Award,
  DollarSign, Calendar, Clock, Eye
} from "lucide-react";
import MembershipBadge from "@/components/badges/MembershipBadge";

/* ================= TYPES ================= */

type Gender = "male" | "female" | "other" | "prefer_not_to_say";
type TutorLocation = {
  city?: string;
  area?: string;
  state?: string;
  country?: string;
  pincode?: string;
};

type TutorProfile = {
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  headline?: string;
  bio?: string;
  gender?: Gender;
  subjects: string[];
  languages: string[];
  classesTaught: string[];
  qualification: string;
  college: string;
  yearsOfExperience: number;
  price?: number;
  priceType?: "per_hour" | "per_month";
  teachingMode?: "online" | "offline" | "hybrid";
  availability?: "weekdays" | "weekends" | "flexible";
  demoAvailable?: boolean;
  location?: TutorLocation;
  membershipType?: string;
  currentPlanSlug?: string;
  revenueSharePercentage?: number;
  documents?: {
    identityProof?: string;
    educationProof?: string;
    annexureB?: string;
    bankDetails?: string;
  };
  isDocumentsSubmitted?: boolean;
  isDocumentsVerified?: boolean;
};

type DocField =
  | "identityProof"
  | "educationProof"
  | "annexureB"
  | "bankDetails";

const DOC_LABELS = {
  identityProof: "Identity Proof",
  educationProof: "Education Certificate",
  annexureB: "Annexure B Form",
  bankDetails: "Bank Details"
};

const DOC_DESCRIPTIONS = {
  identityProof: "Aadhaar, PAN, Passport or Driving License",
  educationProof: "Latest degree, marksheet or certificate",
  annexureB: "Download, fill and upload signed form",
  bankDetails: "Cancelled cheque or passbook front page"
}; 
/* ================= DOCUMENT CARD COMPONENT ================= */
const DocumentCard = ({
  fieldName,
  docUrl,
  onUpload,
  uploading,
  file
}: {
  fieldName: DocField;
  docUrl?: string;
  onUpload: () => void;
  uploading: boolean;
  file: File | null;
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  return (
    <div className="group relative overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
      {/* Document Icon & Title */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-800">
              {DOC_LABELS[fieldName]}
            </h3>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {DOC_DESCRIPTIONS[fieldName]}
          </p>
        </div>
        
        {/* Status Badge */}
        {docUrl && (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
            <CheckCircle className="h-3 w-3" />
            Uploaded
          </span>
        )}
      </div>

      {/* Annexure B Download Link */}
      {fieldName === "annexureB" && (
        <a
          href="https://drive.google.com/uc?export=download&id=1PplRgO45WcSHzEEgAuHaM36tNH08QRlH"
          target="_blank"
          rel="noopener noreferrer"
          className="mb-3 flex items-center gap-2 text-sm text-blue-600 hover:underline"
        >
          <Upload className="h-4 w-4" />
          Download Annexure B Template
        </a>
      )}

      {/* File Input & Upload Button */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label className="flex-1 cursor-pointer">
            <div className="flex items-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-3 text-sm transition-colors hover:border-blue-400 hover:bg-blue-50">
              <Upload className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">
                {file ? file.name : "Choose PDF file..."}
              </span>
            </div>
            {/* Hidden file input is handled by parent handleDocChange */}
          </label>

          <button
            onClick={onUpload}
            disabled={uploading || !file}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:from-blue-700 hover:to-blue-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload
              </>
            )}
          </button>
        </div>

        {/* Preview Document Button */}
        {docUrl && (
          <button
            onClick={() => setIsPreviewOpen(true)}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100"
          >
            <Eye className="h-4 w-4" />
            View Uploaded Document
          </button>
        )}
      </div>

      {/* Preview Modal */}
      {isPreviewOpen && docUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-4xl rounded-xl bg-white p-4">
            <button
              onClick={() => setIsPreviewOpen(false)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white hover:bg-red-600"
            >
              <XCircle className="h-5 w-5" />
            </button>
            <iframe
              src={resolveImage(docUrl)}
              className="h-[80vh] w-full rounded-lg"
              title={DOC_LABELS[fieldName]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= PROFILE PREVIEW COMPONENT ================= */
const ProfilePreview = ({ 
  profile, 
  onEdit 
}: { 
  profile: TutorProfile; 
  onEdit: () => void;
}) => {
  return (
    <div className="space-y-6">
      {/* Preview Header */}
      <div className="rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Profile Preview</h2>
            <p className="mt-1 text-sm text-green-100">
              This is how your profile looks to students and parents
            </p>
          </div>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
          >
            <User className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
      </div>

      {/* Profile Card - As Students See It */}
      <div className="overflow-hidden rounded-2xl border-2 border-gray-200 bg-white shadow-xl">
        {/* Header Section */}
        <div className="relative h-32 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600">
          <div className="absolute -bottom-16 left-8">
            <img
              src={resolveImage(profile.profileImage)}
              alt={profile.fullName}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8 pt-20">
          {/* Name & Headline */}
          <div className="mb-6">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-900">{profile.fullName}</h1>
              <MembershipBadge
                membershipType={(profile.membershipType as any) || "free"}
                currentPlanSlug={(profile.currentPlanSlug as any) || "free"}
                revenueSharePercentage={profile.revenueSharePercentage}
                size="md"
                showLabel={true}
              />
            </div>
            {profile.headline && (
              <p className="mt-2 text-lg text-gray-600">{profile.headline}</p>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {profile.yearsOfExperience > 0 && (
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-gray-600">Experience</p>
                <p className="text-xl font-bold text-blue-600">
                  {profile.yearsOfExperience} Years
                </p>
              </div>
            )}
            {profile.price && (
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-sm text-gray-600">Fees</p>
                <p className="text-xl font-bold text-green-600">
                  ₹{profile.price}/{profile.priceType === "per_hour" ? "hr" : "mo"}
                </p>
              </div>
            )}
            {profile.teachingMode && (
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-gray-600">Mode</p>
                <p className="text-xl font-bold text-purple-600 capitalize">
                  {profile.teachingMode}
                </p>
              </div>
            )}
            {profile.demoAvailable && (
              <div className="rounded-lg bg-orange-50 p-4">
                <p className="text-sm text-gray-600">Demo</p>
                <p className="text-xl font-bold text-orange-600">Available</p>
              </div>
            )}
          </div>

          {/* About/Bio */}
          {profile.bio && (
            <div className="mb-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">About Me</h3>
              <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
            </div>
          )}

          {/* Education */}
          <div className="mb-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Education</h3>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="font-semibold text-gray-900">{profile.qualification}</p>
              <p className="text-gray-600">{profile.college}</p>
            </div>
          </div>

          {/* Subjects */}
          {profile.subjects.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {profile.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Classes Taught */}
          {profile.classesTaught.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Classes Taught</h3>
              <div className="flex flex-wrap gap-2">
                {profile.classesTaught.map((cls, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {profile.languages.length > 0 && (
            <div className="mb-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {profile.languages.map((lang, idx) => (
                  <span
                    key={idx}
                    className="rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          {profile.location && (
            <div className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold text-gray-900">
                <MapPin className="h-5 w-5 text-red-500" />
                Location
              </h3>
              <p className="text-gray-700">
                {[
                  profile.location.area,
                  profile.location.city,
                  profile.location.state,
                  profile.location.pincode
                ]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}

          {/* Contact Info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">Contact</h3>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-gray-700">
                <Mail className="h-4 w-4 text-gray-500" />
                {profile.email}
              </p>
              {profile.phone && (
                <p className="flex items-center gap-2 text-gray-700">
                  <Phone className="h-4 w-4 text-gray-500" />
                  {profile.phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onEdit}
          className="flex items-center gap-2 rounded-lg border-2 border-blue-600 bg-white px-6 py-3 font-semibold text-blue-600 transition-all hover:bg-blue-50"
        >
          <User className="h-5 w-5" />
          Edit Profile
        </button>
        <button
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-green-800"
        >
          <CheckCircle className="h-5 w-5" />
          Profile Looks Good!
        </button>
      </div>
    </div>
  );
};

const EditProfileTab = () => {
  const [formData, setFormData] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState(false); // Preview mode toggle
  const fileRef = useRef<HTMLInputElement>(null);
  
  const [docFiles, setDocFiles] = useState<Record<DocField, File | null>>({
    identityProof: null,
    educationProof: null,
    annexureB: null,
    bankDetails: null,
  });

  const [uploadingDocs, setUploadingDocs] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false); 
  /* FETCH PROFILE */
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await api.get("/tutor/me");
      setFormData(res.data.data);
      setLoading(false);
    };
    fetchProfile();
  }, []);

  if (loading || !formData) return <p>Loading profile...</p>;

  /* ARRAY HANDLER */
  const updateArrayField = (key: keyof TutorProfile, value: string) => {
    setFormData({
      ...formData,
      [key]: value.split(",").map(v => v.trim())
    });
  };

  /* SAVE PROFILE */
  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put("/tutor/me", {
        fullName: formData.fullName,
        phone: formData.phone,
        headline: formData.headline,
        bio: formData.bio,
        gender: formData.gender,
        subjects: formData.subjects,
        languages: formData.languages,
        classesTaught: formData.classesTaught,
        qualification: formData.qualification,
        college: formData.college,
        yearsOfExperience: formData.yearsOfExperience,
        price: formData.price,
        priceType: formData.priceType,
        teachingMode: formData.teachingMode,
        availability: formData.availability,
        demoAvailable: formData.demoAvailable,
        location:
          formData.location &&
          (formData.location.city ||
           formData.location.area ||
           formData.location.state ||
           formData.location.pincode)
            ? formData.location
            : undefined
      });

      // Switch to preview mode after successful save
      setViewMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  /* IMAGE UPLOAD */
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true);
    try {
      const fd = new FormData();
      fd.append("photo", file);

      const res = await api.post("/tutor/upload-photo", fd, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setFormData(prev => ({
        ...prev!,
        profileImage: res.data.url
      }));
      
      alert("✅ Profile photo updated!");
    } catch (err) {
      console.error("Image upload failed", err);
      alert("❌ Image upload failed");
    } finally {
      setUploadingImage(false);
    }
  };

  /* DOCUMENT HANDLERS */
  const handleDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name as DocField;
    setDocFiles((prev) => ({
      ...prev,
      [name]: e.target.files?.[0] || null,
    }));
  };

  const uploadSingleDoc = async (fieldName: DocField) => {
    try {
      const file = docFiles[fieldName];

      if (!file) {
        alert("❌ Please select a file first");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        alert("❌ File size must be less than 2MB");
        return;
      }

      if (file.type !== "application/pdf") {
        alert("❌ Only PDF files are allowed");
        return;
      }

      const fd = new FormData();
      fd.append(fieldName, file);

      setUploadingDocs(true);

      const res = await api.post("/tutor/upload-documents", fd);

      setFormData((prev: any) => ({
        ...prev,
        documents: {
          ...prev.documents,
          ...res.data.data,
        },
      }));

      // Clear the file selection
      setDocFiles(prev => ({ ...prev, [fieldName]: null }));

      alert(`✅ ${DOC_LABELS[fieldName]} uploaded successfully!`);
    } catch (err) {
      console.error(err);
      alert("❌ Upload failed");
    } finally {
      setUploadingDocs(false);
    }
  };

  return (
    <>
      {/* Show Preview Mode or Edit Mode */}
      {viewMode ? (
        <ProfilePreview 
          profile={formData} 
          onEdit={() => setViewMode(false)}
        />
      ) : (
        <div className="flex flex-col gap-8">
    {/* ================= MY PROFILE HEADER ================= */}

      {/* PROFILE HEADER - Modern UI */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 p-8 shadow-xl">
        <div className="relative z-10 flex items-center gap-6">
          {/* Profile Photo with Upload Overlay */}
          <div className="relative group">
            <img
              src={resolveImage(formData.profileImage)}
              className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg"
              alt="Profile"
            />
            {uploadingImage && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Upload className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-3xl font-bold">{formData.fullName}</h2>
              <MembershipBadge
                membershipType={(formData.membershipType as any) || "free"}
                currentPlanSlug={(formData.currentPlanSlug as any) || "free"}
                revenueSharePercentage={formData.revenueSharePercentage}
                size="md"
                showLabel={true}
              />
            </div>
            <p className="mt-1 flex items-center gap-2 text-blue-100">
              <Mail className="h-4 w-4" />
              {formData.email}
            </p>
            {formData.phone && (
              <p className="mt-1 flex items-center gap-2 text-blue-100">
                <Phone className="h-4 w-4" />
                {formData.phone}
              </p>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-3 flex items-center gap-2 rounded-lg bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-all hover:bg-white/30"
            >
              <Upload className="h-4 w-4" />
              Change Photo
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-white/10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-purple-400/20 blur-2xl"></div>

        <input
          type="file"
          hidden
          ref={fileRef}
          accept="image/*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
              handleImageUpload(e.target.files[0]);
            }
          }}
        />
      </div>

      {/* BASIC INFO - Modern Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
          <User className="h-5 w-5 text-blue-600" />
          Basic Information
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Professional Headline
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. IIT Graduate - Maths & Science Tutor"
              value={formData.headline || ""}
              onChange={e =>
                setFormData({ ...formData, headline: e.target.value })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Bio / About Me
            </label>
            <textarea
              rows={4}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Write something about yourself, your teaching style, experience..."
              value={formData.bio || ""}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Gender
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              value={formData.gender || ""}
              onChange={e =>
                setFormData({ ...formData, gender: e.target.value as Gender })
              }
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      {/* TEACHING DETAILS - Modern Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
          <Book className="h-5 w-5 text-green-600" />
          Teaching Details
        </h3>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Subjects (comma separated)
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. Mathematics, Physics, Chemistry"
              value={formData.subjects.join(", ")}
              onChange={e => updateArrayField("subjects", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Languages
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. English, Hindi, Urdu"
              value={formData.languages.join(", ")}
              onChange={e => updateArrayField("languages", e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Classes Taught
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. Class 6, 7, 8, 9, 10, 11, 12"
              value={formData.classesTaught.join(", ")}
              onChange={e => updateArrayField("classesTaught", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* PROFESSIONAL & LOCATION - Two Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Professional Credentials */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <Award className="h-5 w-5 text-purple-600" />
            Professional Credentials
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Highest Qualification
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="e.g. B.Tech, M.Sc, PhD"
                value={formData.qualification}
                onChange={e =>
                  setFormData({ ...formData, qualification: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                College/University
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="e.g. IIT Delhi, Delhi University"
                value={formData.college}
                onChange={e =>
                  setFormData({ ...formData, college: e.target.value })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Years of Experience
              </label>
              <input
                type="number"
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="e.g. 5"
                value={formData.yearsOfExperience}
                onChange={e =>
                  setFormData({
                    ...formData,
                    yearsOfExperience: Number(e.target.value)
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
            <MapPin className="h-5 w-5 text-red-600" />
            Location
          </h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="e.g. Delhi, Mumbai, Bangalore"
                value={formData.location?.city || ""}
                onChange={e =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      city: e.target.value
                    }
                  })
                }
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Area / Locality
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                placeholder="e.g. Civil Lines, Sector 62"
                value={formData.location?.area || ""}
                onChange={e =>
                  setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      area: e.target.value
                    }
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  State
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="e.g. UP, Delhi"
                  value={formData.location?.state || ""}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        state: e.target.value
                      }
                    })
                  }
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Pincode
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
                  placeholder="e.g. 110001"
                  value={formData.location?.pincode || ""}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        pincode: String(e.target.value)
                      }
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>


{/* ─── Document Upload Section - Modern UI ─── */}

<div className="space-y-4">
  <div className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white shadow-lg">
    <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
      <FileText className="h-6 w-6" />
      Document Verification
    </h2>
    <p className="text-sm text-blue-100">
      ⚠️ All documents must be less than 2MB and in PDF format only.
    </p>
  </div>

  {/* Hidden file inputs for DocumentCard components */}
  <input
    type="file"
    name="identityProof"
    accept="application/pdf"
    className="hidden"
    id="identityProof-input"
    onChange={handleDocChange}
  />
  <input
    type="file"
    name="educationProof"
    accept="application/pdf"
    className="hidden"
    id="educationProof-input"
    onChange={handleDocChange}
  />
  <input
    type="file"
    name="annexureB"
    accept="application/pdf"
    className="hidden"
    id="annexureB-input"
    onChange={handleDocChange}
  />
  <input
    type="file"
    name="bankDetails"
    accept="application/pdf"
    className="hidden"
    id="bankDetails-input"
    onChange={handleDocChange}
  />

  {/* Document Cards Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Identity Proof Card */}
    <label htmlFor="identityProof-input" className="cursor-pointer">
      <DocumentCard
        fieldName="identityProof"
        docUrl={formData.documents?.identityProof}
        onUpload={() => uploadSingleDoc("identityProof")}
        uploading={uploadingDocs}
        file={docFiles.identityProof}
      />
    </label>

    {/* Education Proof Card */}
    <label htmlFor="educationProof-input" className="cursor-pointer">
      <DocumentCard
        fieldName="educationProof"
        docUrl={formData.documents?.educationProof}
        onUpload={() => uploadSingleDoc("educationProof")}
        uploading={uploadingDocs}
        file={docFiles.educationProof}
      />
    </label>

    {/* Annexure B Card */}
    <label htmlFor="annexureB-input" className="cursor-pointer">
      <DocumentCard
        fieldName="annexureB"
        docUrl={formData.documents?.annexureB}
        onUpload={() => uploadSingleDoc("annexureB")}
        uploading={uploadingDocs}
        file={docFiles.annexureB}
      />
    </label>

    {/* Bank Details Card */}
    <label htmlFor="bankDetails-input" className="cursor-pointer">
      <DocumentCard
        fieldName="bankDetails"
        docUrl={formData.documents?.bankDetails}
        onUpload={() => uploadSingleDoc("bankDetails")}
        uploading={uploadingDocs}
        file={docFiles.bankDetails}
      />
    </label>
  </div>

  {/* Document Upload Status Summary */}
  <div className="rounded-xl border-2 border-green-200 bg-green-50 p-4">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-semibold text-green-800">Upload Status</h3>
        <p className="text-sm text-green-600">
          {[
            formData.documents?.identityProof,
            formData.documents?.educationProof,
            formData.documents?.annexureB,
            formData.documents?.bankDetails,
          ].filter(Boolean).length}{" "}
          of 4 documents uploaded
        </p>
      </div>
      <div className="text-3xl">
        {[
          formData.documents?.identityProof,
          formData.documents?.educationProof,
          formData.documents?.annexureB,
          formData.documents?.bankDetails,
        ].filter(Boolean).length === 4 ? "✅" : "📤"}
      </div>
    </div>
  </div>
</div>

{/* Document Verification end */}
     
      {/* PRICING & AVAILABILITY - Modern Card */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-800">
          <DollarSign className="h-5 w-5 text-green-600" />
          Pricing & Availability
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Fees (₹)
            </label>
            <input
              type="number"
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              placeholder="e.g. 500"
              value={formData.price || ""}
              onChange={e =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Price Type
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              value={formData.priceType || "per_hour"}
              onChange={e =>
                setFormData({
                  ...formData,
                  priceType: e.target.value as any
                })
              }
            >
              <option value="per_hour">Per Hour</option>
              <option value="per_month">Per Month</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Teaching Mode
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
              value={formData.teachingMode || ""}
              onChange={e =>
                setFormData({
                  ...formData,
                  teachingMode: e.target.value as any
                })
              }
            >
              <option value="">Select Mode</option>
              <option value="online">Online Only</option>
              <option value="offline">Offline Only</option>
              <option value="hybrid">Both (Hybrid)</option>
            </select>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.demoAvailable || false}
                onChange={e =>
                  setFormData({
                    ...formData,
                    demoAvailable: e.target.checked
                  })
                }
                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-200"
              />
              <span className="text-sm font-medium text-gray-700">
                Demo class available
              </span>
            </label>
          </div>
        </div>
      </div>
   

      {/* SAVE BUTTON - Sticky Bottom */}
      <div className="sticky bottom-0 z-10 flex justify-end gap-4 rounded-xl border-t-4 border-green-500 bg-white p-6 shadow-lg">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 px-8 py-3 font-semibold text-white shadow-md transition-all hover:from-green-700 hover:to-green-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Saving Changes...
            </>
          ) : (
            <>
              <CheckCircle className="h-5 w-5" />
              Save & Preview
            </>
          )}
        </button>
      </div>
        </div>
      )}
    </>
  );
};

/* ================= PAGE ================= */

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* Modern Gradient Header with Animation */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-8 shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -left-4 -top-4 h-24 w-24 animate-pulse rounded-full bg-white/10 blur-xl"></div>
          <div className="absolute -right-4 top-1/2 h-32 w-32 animate-pulse rounded-full bg-white/10 blur-2xl" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-0 left-1/2 h-28 w-28 animate-pulse rounded-full bg-white/10 blur-xl" style={{ animationDelay: '2s' }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white">
                My Profile
              </h1>
              <p className="mt-2 text-lg text-indigo-100">
                Complete your profile to build trust and become visible to students and parents
              </p>
            </div>
            <div className="hidden md:block">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <User className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>

          {/* Progress Bar (if you want to add) */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-white/90">
              <span>Profile Completion</span>
              <span className="font-semibold">85%</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-white/20">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
                style={{ width: '85%' }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Instructions Card */}
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-lg">
        {/* Decorative Corner */}
        <div className="absolute right-0 top-0 h-24 w-24 bg-gradient-to-br from-blue-100 to-purple-100 opacity-50 blur-2xl"></div>

        <div className="relative z-10">
          {/* Title */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Profile Completion Guide
            </h2>
          </div>

          {/* Instructions List */}
          <div className="space-y-3">
            <div className="flex items-start gap-3 group">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <span className="text-xs font-bold">1</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Fill in all required details such as your <span className="font-semibold text-gray-900">name, subjects, class levels, experience, pricing,</span> and <span className="font-semibold text-gray-900">profile photo</span>
              </p>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors group-hover:bg-green-500 group-hover:text-white">
                <span className="text-xs font-bold">2</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Ensure your information is <span className="font-semibold text-gray-900">accurate and up to date</span> to attract the right students
              </p>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 transition-colors group-hover:bg-purple-500 group-hover:text-white">
                <span className="text-xs font-bold">3</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Once your profile reaches <span className="font-semibold text-gray-900">100% completion</span>, click on the <span className="font-semibold text-gray-900">Save & Preview</span> button
              </p>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors group-hover:bg-orange-500 group-hover:text-white">
                <span className="text-xs font-bold">4</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                After saving, your profile will become <span className="font-semibold text-gray-900">publicly available</span> and visible to students and parents
              </p>
            </div>

            <div className="flex items-start gap-3 group">
              <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-pink-100 text-pink-600 transition-colors group-hover:bg-pink-500 group-hover:text-white">
                <span className="text-xs font-bold">5</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                You can <span className="font-semibold text-gray-900">update your profile anytime</span> — changes will be reflected after saving again
              </p>
            </div>
          </div>

          {/* Warning Alert */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4">
            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
              <svg className="h-4 w-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900">
                Important Notice
              </p>
              <p className="mt-1 text-sm text-amber-800">
                Profiles that are incomplete or not saved will not be visible publicly. Make sure to complete all sections for maximum visibility.
              </p>
            </div>
          </div>
        </div>
      </div>

      <EditProfileTab />
    </div>
  );
};

export default ProfilePage;
