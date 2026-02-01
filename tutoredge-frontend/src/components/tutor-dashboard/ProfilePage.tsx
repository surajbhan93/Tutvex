// import { Star, Upload } from 'lucide-react';
// import Image from 'next/image';
// // import React, { useEffect, useEffect, useRef, useState } from 'react';

// import Button from '../ui/Button';
// import { useState, useEffect } from 'react';

// --- Mock Data (to be replaced by API data) ---


// const mockTutorData = {
//   fullName: 'Dr. Amelia Carter',
//   email: 'amelia.carter@email.com',
//   imageUrl: '/images/tutors/tutor-4.jpg',
//   bio: 'Passionate and experienced educator with a PhD in Physics specializing in quantum mechanics. I believe in making complex topics accessible and engaging for all students.',
//   subjects: 'Physics, Calculus I, Organic Chemistry',
//   languages: 'English, Spanish',
//   classesTaught: 'Grade 9 to 12, University Level',
//   experience: '10+',
//   qualifications: 'PhD in Physics',
//   college: 'Massachusetts Institute of Technology (MIT)',
// };

// const mockReviews = [
//   {
//     id: 1,
//     studentName: 'Ethan Carter',
//     rating: 5,
//     date: 'July 21, 2024',
//     comment:
//       "Dr. Carter is an amazing calculus tutor! My son's grades have improved dramatically.",
//   },
//   {
//     id: 2,
//     studentName: 'Olivia Bennett',
//     rating: 5,
//     date: 'July 19, 2024',
//     comment: 'Excellent at explaining complex topics in organic chemistry.',
//   },
// ];

// // --- Sub-Component for the "Edit Profile" Tab ---
// const EditProfileTab = () => {
//   // State for all form fields
//   const [formData, setFormData] = useState(mockTutorData);
//   // State for image uploading
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Generic handler for all text inputs, textareas, and selects
//   const handleChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >,
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   // Handler for when a user selects a new profile picture
//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setPreviewUrl(URL.createObjectURL(file));
//     }
//   };

//   // Handler for the main "Save Changes" button
//   const handleSaveChanges = async (e: React.FormEvent) => {
//     e.preventDefault();
//     // --- FOR THE BACKEND TEAM ---
//     // This is where you'll send the data to the API
//     // console.log("Submitting form data:", formData);
//     if (selectedFile) {
//       // console.log("Uploading new profile picture:", selectedFile.name);
//       // const uploadData = new FormData();
//       // uploadData.append('profilePhoto', selectedFile);
//       // await fetch('/api/tutor/profile/photo', { method: 'POST', body: uploadData });
//     }
//     // await fetch('/api/tutor/profile', { method: 'PUT', body: JSON.stringify(formData) });
//     alert('Profile changes saved! (Simulated)');
//   };

//   return (
//     <form onSubmit={handleSaveChanges} className="flex flex-col gap-8">
//       <div className="rounded-xl bg-white p-6 shadow-sm">
//         <div className="flex flex-col items-center gap-6 sm:flex-row">
//           <div className="relative size-24 shrink-0">
//             <Image
//               src={previewUrl || formData.imageUrl}
//               alt="Profile Photo"
//               layout="fill"
//               className="rounded-full object-cover"
//             />
//           </div>
//           <div className="grow text-center sm:text-left">
//             <h2 className="text-xl font-bold text-gray-800">
//               {formData.fullName}
//             </h2>
//             <p className="text-sm text-gray-500">{formData.email}</p>
//             <div className="mt-3 flex justify-center gap-2 sm:justify-start">
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 onChange={handleFileChange}
//                 className="hidden"
//                 accept="image/*"
//               />
//               <Button
//                 type="button"
//                 onClick={() => fileInputRef.current?.click()}
//                 variant="primary"
//                 className="h-9 px-4 text-sm"
//               >
//                 <Upload className="mr-2 size-4" /> Change Photo
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="rounded-xl bg-white p-6 shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-800">
//           Teaching Expertise
//         </h3>
//         <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <label
//               htmlFor="subjects"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               Subjects you teach
//             </label>
//             <input
//               id="subjects"
//               name="subjects"
//               type="text"
//               value={formData.subjects}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="languages"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               Languages
//             </label>
//             <input
//               id="languages"
//               name="languages"
//               type="text"
//               value={formData.languages}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="classesTaught"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               Classes/Grades Taught
//             </label>
//             <input
//               id="classesTaught"
//               name="classesTaught"
//               type="text"
//               value={formData.classesTaught}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="experience"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               Years of Experience
//             </label>
//             <select
//               id="experience"
//               name="experience"
//               value={formData.experience}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300"
//             >
//               <option>0-1 years</option>
//               <option>1-3 years</option>
//               <option>3-5 years</option>
//               <option>5-10 years</option>
//               <option>10+</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="rounded-xl bg-white p-6 shadow-sm">
//         <h3 className="text-lg font-semibold text-gray-800">
//           Professional Background
//         </h3>
//         <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
//           <div>
//             <label
//               htmlFor="qualifications"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               Qualifications
//             </label>
//             <input
//               id="qualifications"
//               name="qualifications"
//               type="text"
//               value={formData.qualifications}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300"
//             />
//           </div>
//           <div>
//             <label
//               htmlFor="college"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               College/University
//             </label>
//             <input
//               id="college"
//               name="college"
//               type="text"
//               value={formData.college}
//               onChange={handleChange}
//               className="w-full rounded-lg border-gray-300"
//             />
//           </div>
//           <div className="md:col-span-2">
//             <label
//               htmlFor="bio"
//               className="mb-1 block text-sm font-medium text-gray-700"
//             >
//               Public Bio
//             </label>
//             <textarea
//               id="bio"
//               name="bio"
//               rows={5}
//               className="w-full rounded-lg border-gray-300"
//               value={formData.bio}
//               onChange={handleChange}
//             ></textarea>
//           </div>
//         </div>
//       </div>

//       <div className="flex justify-end">
//         <Button type="submit">Save Changes</Button>
//       </div>
//     </form>
//   );
// };

// // --- Sub-Component for the "My Reviews" Tab ---
// const MyReviewsTab = () => (
//   <div className="space-y-6">
//     {mockReviews.map((review) => (
//       <div key={review.id} className="rounded-xl bg-white p-6 shadow-sm">
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="flex items-center">
//               {[...Array(5)].map((_, i) => (
//                 <Star
//                   key={i}
//                   className={`size-5 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
//                 />
//               ))}
//             </div>
//             <p className="mt-3 text-gray-700">{review.comment}</p>
//           </div>
//           <div className="text-right text-sm text-gray-500">
//             <p className="font-medium">{review.studentName}</p>
//             <p>{review.date}</p>
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// );

// // --- Main Page Component ---
// const ProfilePage = () => {
//   const [activeTab, setActiveTab] = useState('Edit Profile');
//   const tabs = ['Edit Profile', 'My Reviews'];

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
//         <p className="mt-1 text-gray-500">
//           Manage your public profile and view student reviews.
//         </p>
//       </div>

//       <div className="border-b border-gray-200">
//         <nav className="-mb-px flex space-x-6">
//           {tabs.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setActiveTab(tab)}
//               className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
//                 activeTab === tab
//                   ? 'border-blue-500 text-blue-600'
//                   : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//               }`}
//             >
//               {tab}
//             </button>
//           ))}
//         </nav>
//       </div>

//       <div>
//         {activeTab === 'Edit Profile' && <EditProfileTab />}
//         {activeTab === 'My Reviews' && <MyReviewsTab />}
//       </div>
//     </div>
//   );
// };

// export default ProfilePage;


// "use client";

import { useEffect, useRef, useState } from "react";
import api from "@/lib/apiClient";

/* ================= TYPES ================= */

type Gender = "male" | "female" | "other" | "prefer_not_to_say";

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
};

/* ================= EDIT PROFILE ================= */

const EditProfileTab = () => {
  const [formData, setFormData] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

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
        demoAvailable: formData.demoAvailable
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile ❌");
    }
  };

  /* IMAGE UPLOAD */
 const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const handleImageUpload = async (file: File) => {
  try {
    const fd = new FormData();
    fd.append("file", file);

    const res = await api.post("/tutor/profile-image", fd, {
      headers: { "Content-Type": "multipart/form-data" }
    });

    const imageUrl = `${BACKEND_URL}${res.data.imageUrl}?t=${Date.now()}`;

    setFormData(prev => ({
      ...prev!,
      profileImage: imageUrl
    }));
  } catch (err) {
    console.error("Image upload failed", err);
    alert("Image upload failed");
  }
};

  return (
    <div className="flex flex-col gap-8">
    {/* ================= MY PROFILE HEADER ================= */}

      {/* PROFILE HEADER */}
      <div className="flex items-center gap-4 rounded-xl bg-white p-6 shadow-sm">
        <img
          src={formData.profileImage || "/images/default-avatar.png"}
          className="h-16 w-16 rounded-full object-cover"
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
