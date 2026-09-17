
import { useEffect, useRef, useState } from "react";
import api from "@/lib/apiClient";
import { resolveImage } from "@/lib/resolveImage";
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
  // ✅ ADD THIS
  location?: TutorLocation;

  //
  documents?: {
  identityProof?: string;
  educationProof?: string;
  annexureB?: string;
  bankDetails?: string;
};

isDocumentsSubmitted?: boolean;
isDocumentsVerified?: boolean;
};
// 1.
type DocField =
  | "identityProof"
  | "educationProof"
  | "annexureB"
  | "bankDetails";

// document end 
/* ================= EDIT PROFILE ================= */

const EditProfileTab = () => {
  const [formData, setFormData] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);
  //2.document ka 
  const [docFiles, setDocFiles] = useState<Record<DocField, File | null>>({
  identityProof: null,
  educationProof: null,
  annexureB: null,
  bankDetails: null,
});

const [uploadingDocs, setUploadingDocs] = useState(false);
// docs end 
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

        // ✅ ADD THIS
        location:
    formData.location &&
    (formData.location.city ||
     formData.location.area ||
     formData.location.state ||
     formData.location.pincode)
      ? formData.location
      : undefined
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ❌");
    }
  };

  // 3.docs 
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
      alert("Please select file first ❌");
      return;
    }

    const fd = new FormData();
    fd.append(fieldName, file);

    setUploadingDocs(true);

    const res = await api.post("/tutor/upload-documents", fd);

    // 🔥 UI update
    setFormData((prev: any) => ({
      ...prev,
      documents: {
        ...prev.documents,
        ...res.data.data,
      },
    }));

    alert(`${fieldName} uploaded ✅`);
   
  } catch (err) {
    console.error(err);
    alert("Upload failed ❌");
  } finally {
    setUploadingDocs(false);
  }
};
  // docs end 
  /* IMAGE UPLOAD */
//  const BACKEND_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const handleImageUpload = async (file: File) => {
  try {
    console.log("File selected:", file.name, file.size, file.type); // ← ADD
    const fd = new FormData();
    // fd.append("file", file);
    fd.append("photo", file); // ← "file" se "photo" kiya

    const res = await api.post("/tutor/upload-photo", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    // const imageUrl = `${BACKEND_URL}${res.data.imageUrl}?t=${Date.now()}`;

    // ✅ Store ONLY relative path from backend
    setFormData(prev => ({
      ...prev!,
      // profileImage: res.data.imageUrl
       profileImage: res.data.url // ← "imageUrl" se "url" kiya
    }));
  } catch (err) {
    console.error("Image upload failed", err);
    // alert("Image upload failed");
  }
};

  return (
    <div className="flex flex-col gap-8">
    {/* ================= MY PROFILE HEADER ================= */}

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
        <img
          src={resolveImage(formData.profileImage)}
          className="h-16 w-16 rounded-full object-cover"
          alt="Profile"
        />

        <div>
          <h2 className="text-xl font-bold">{formData.fullName}</h2>
          <p className="text-sm text-gray-500">{formData.email}</p>

          <button
            onClick={() => fileRef.current?.click()}
            className="mt-2 text-sm text-blue-600"
          >
            Change Photo
          </button>

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
      </div>

      {/* BASIC INFO */}
      <div className="rounded-xl bg-white p-6 shadow-sm space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Headline (e.g. IIT Maths Tutor)"
          value={formData.headline || ""}
          onChange={e =>
            setFormData({ ...formData, headline: e.target.value })
          }
        />

        <textarea
          rows={4}
          className="w-full rounded border p-2"
          placeholder="Write something about yourself..."
          value={formData.bio || ""}
          onChange={e => setFormData({ ...formData, bio: e.target.value })}
        />

        <select
          className="w-full rounded border p-2"
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

      {/* TEACHING */}
      <div className="rounded-xl bg-white p-6 shadow-sm space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Subjects (comma separated)"
          value={formData.subjects.join(", ")}
          onChange={e => updateArrayField("subjects", e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Languages"
          value={formData.languages.join(", ")}
          onChange={e => updateArrayField("languages", e.target.value)}
        />

        <input
          className="w-full rounded border p-2"
          placeholder="Classes taught"
          value={formData.classesTaught.join(", ")}
          onChange={e => updateArrayField("classesTaught", e.target.value)}
        />
      </div>

      {/* PROFESSIONAL */}
      <div className="rounded-xl bg-white p-6 shadow-sm space-y-3">
        <input
          className="w-full rounded border p-2"
          placeholder="Qualification"
          value={formData.qualification}
          onChange={e =>
            setFormData({ ...formData, qualification: e.target.value })
          }
        />

        {/* LOCATION */}
<div className="rounded-xl bg-white p-6 shadow-sm space-y-3">
  <h3 className="text-sm font-semibold text-gray-700">
    Location
  </h3>

  <input
    className="w-full rounded border p-2"
    placeholder="City"
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

  <input
    className="w-full rounded border p-2"
    placeholder="Area / Locality (e.g. Civil Lines)"
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

  <input
    className="w-full rounded border p-2"
    placeholder="State"
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

 <input
  className="w-full rounded border p-2"
  placeholder="Pincode"
  value={formData.location?.pincode || ""}
  onChange={e =>
    setFormData({
      ...formData,
      location: {
        ...formData.location,
        pincode: String(e.target.value)   // ✅ FIX
      }
    })
  }
/>

</div>


        <input
          className="w-full rounded border p-2"
          placeholder="College"
          value={formData.college}
          onChange={e =>
            setFormData({ ...formData, college: e.target.value })
          }
        />

        <input
          type="number"
          className="w-full rounded border p-2"
          placeholder="Years of experience"
          value={formData.yearsOfExperience}
          onChange={e =>
            setFormData({
              ...formData,
              yearsOfExperience: Number(e.target.value)
            })
          }
        />
      </div>


{/* ─── Document Upload Section ─── */}

<div className="space-y-4">
<p className="text-sm font-medium text-red-600">
    ⚠️ All documents must be less than 2MB and in PDF format only.
  </p>
  {/* Identity Proof */}

  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">

    <p className="text-sm font-semibold text-gray-700 mb-1">📄 Identity Proof</p>

    <p className="text-xs text-gray-500 mb-2">
      Upload a valid government-issued ID (Aadhaar, PAN, Passport, etc.)
    </p>

    <div className="flex gap-2 items-center">

      <input
        type="file"
        name="identityProof"
        onChange={handleDocChange}
        className="text-sm"
      />

      <button
      disabled={uploadingDocs}
        onClick={() => uploadSingleDoc("identityProof")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded"
      >
        Upload
      </button>

    </div>

  </div>

  {/* Education Proof */}

  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">

    <p className="text-sm font-semibold text-gray-700 mb-1">🎓 Education Proof</p>

    <p className="text-xs text-gray-500 mb-2">
      Upload your latest marksheet or degree certificate.
    </p>

    <div className="flex gap-2 items-center">

      <input
        type="file"
        name="educationProof"
        onChange={handleDocChange}
        className="text-sm"
      />

      <button
      disabled={uploadingDocs}
        onClick={() => uploadSingleDoc("educationProof")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded"
      >
        Upload
      </button>

    </div>

  </div>

  {/* Annexure B */}

  <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">

    <p className="text-sm font-semibold text-gray-700 mb-1">📋 Annexure B</p>

    <p className="text-xs text-gray-600 mb-1">
      ⬇️ <strong>Step 1:</strong>{" "}
      <a
        href="https://drive.google.com/uc?export=download&id=1PplRgO45WcSHzEEgAuHaM36tNH08QRlH"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline font-medium"
      >
        Download Annexure B form here
      </a>
    </p>

    <p className="text-xs text-gray-600 mb-2">
      ✍️ <strong>Step 2:</strong> Fill and sign the downloaded form, then upload it below.
    </p>

    <div className="flex gap-2 items-center">

      <input
        type="file"
        name="annexureB"
        onChange={handleDocChange}
        className="text-sm"
      />

      <button
      disabled={uploadingDocs}
        onClick={() => uploadSingleDoc("annexureB")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded"
      >
        Upload
      </button>

    </div>

  </div>

  {/* Bank Details */}

  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">

    <p className="text-sm font-semibold text-gray-700 mb-1">🏦 Bank Details</p>

    <p className="text-xs text-gray-500 mb-2">
      Upload a cancelled cheque or bank passbook front page.
    </p>

    <div className="flex gap-2 items-center">

      <input
        type="file"
        name="bankDetails"
        onChange={handleDocChange}
        className="text-sm"
      />

      <button
      disabled={uploadingDocs}
        onClick={() => uploadSingleDoc("bankDetails")}
        className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded"
      >
        Upload
      </button>

    </div>

  </div>

</div>

{/* Document Varification end */}
     
      {/* PRICING & MODE */}
      <div className="rounded-xl bg-white p-6 shadow-sm space-y-3">
        <input
          type="number"
          className="w-full rounded border p-2"
          placeholder="Price"
          value={formData.price || ""}
          onChange={e =>
            setFormData({ ...formData, price: Number(e.target.value) })
          }
        />

        <select
          className="w-full rounded border p-2"
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

        <select
          className="w-full rounded border p-2"
          value={formData.teachingMode || ""}
          onChange={e =>
            setFormData({
              ...formData,
              teachingMode: e.target.value as any
            })
          }
        >
          <option value="">Teaching Mode</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.demoAvailable || false}
            onChange={e =>
              setFormData({
                ...formData,
                demoAvailable: e.target.checked
              })
            }
          />
          Demo class available
        </label>
      </div>
   

      {/* SAVE */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ================= PAGE ================= */

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* <h1 className="text-3xl font-bold">My Profile</h1> */}
      <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 p-6 text-white shadow">
  <h1 className="text-2xl font-bold">
    My Profile
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    Complete your profile to build trust and become visible to
    students and parents.
  </p>
</div>

{/* ================= PROFILE INSTRUCTIONS ================= */}
<div className="mb-4 rounded-xl bg-white p-2 shadow-sm text-sm text-gray-700">
  <p className="mb-2 font-semibold text-gray-800">
    Profile Completion Instructions
  </p>

  <ul className="list-disc pl-5 space-y-2">
    <li>
      Fill in all required details such as your name, subjects,
      class levels, experience, pricing, and profile photo.
    </li>
    <li>
      Ensure your information is accurate and up to date to
      attract the right students.
    </li>
    <li>
      Once your profile reaches <b>100% completion</b>, click on
      the <b>Save Profile</b> button to apply the changes.
    </li>
    <li>
      After saving, your profile will become <b>publicly
      available</b> and visible to students and parents on the
      platform.
    </li>
    <li>
      You can update your profile anytime — changes will be
      reflected after saving again.
    </li>
  </ul>

  <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-700">
    ⚠️ Profiles that are incomplete or not saved will not be
    visible publicly.
  </div>
</div>

      <EditProfileTab />
    </div>
  );
};

export default ProfilePage;
