// src/components/tutor-flow/CompleteProfile.tsx
import type { NextPage } from 'next';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
// import Image from 'next/image';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import { UserCircle } from 'lucide-react';

type CompleteProfileForm = {
  bio: string;
  subject: string;
  method: 'Online' | 'Offline' | 'Hybrid' | '';
  certifications: string;
};

const initial: CompleteProfileForm = {
  bio: '',
  subject: '',
  method: '',
  certifications: '',
};

const CompleteProfile: NextPage = () => {
  const [form, setForm] = useState<CompleteProfileForm>(initial);
  const [image, setImage] = useState<File | null>(null);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    } else {
      setImage(null);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append('bio', form.bio);
    payload.append('subject', form.subject);
    payload.append('method', form.method);
    payload.append('certifications', form.certifications);
    if (image) payload.append('profilePicture', image);

    // Mock success
    alert('Profile saved successfully!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-purple-200 via-pink-100 to-yellow-50">
      {/* Navbar */}
      <NavBar />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <div className="w-full max-w-2xl rounded-3xl bg-white p-10 shadow-2xl relative">
          {/* Header / Title */}
          <div className="flex flex-col items-center mb-6">
            <UserCircle className="h-16 w-16 text-purple-500" />
            <h2 className="mt-4 text-3xl font-bold text-gray-800">
              Complete Your Profile
            </h2>
            <p className="mt-2 text-center text-gray-500 max-w-md">
              Fill in your details to help students know you better. Add your bio,
              subjects, teaching method, and certifications to create a strong profile.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Bio */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">Short Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Write a short professional bio..."
                className="w-full rounded-xl border border-gray-300 p-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={3}
              />
            </div>

            {/* Profile Picture */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Upload Profile Picture
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="w-full"
              />
              {image && (
                <p className="mt-2 text-sm text-gray-600">{image.name}</p>
              )}
            </div>

            {/* Subject */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Subject Specializations
              </label>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Add subject specializations"
                className="w-full rounded-xl border border-gray-300 p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Teaching Method */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Preferred Teaching Method
              </label>
              <select
                name="method"
                value={form.method}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              >
                <option value="">Select Method</option>
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Certifications */}
            <div>
              <label className="mb-1 block font-medium text-gray-700">
                Certifications & Awards
              </label>
              <textarea
                name="certifications"
                value={form.certifications}
                onChange={handleChange}
                placeholder="Certifications & Awards"
                className="w-full rounded-xl border border-gray-300 p-3 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={2}
              />
            </div>

            {/* Submit Button */}
            <button
              className="w-full rounded-xl bg-purple-600 py-3 text-white font-semibold hover:bg-purple-700 transition-colors duration-200"
              type="submit"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default CompleteProfile;
