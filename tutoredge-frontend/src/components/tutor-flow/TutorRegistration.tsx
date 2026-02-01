

// src/components/tutor-flow/TutorRegistration.tsx
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type {FormEvent } from 'react';
import { useState } from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import { motion } from "framer-motion";
import OnboardingStepper from "@/components/tutor-flow/OnboardingStepper";
import apiClient from '../../lib/apiClient';
import TutorIntroVideo from "@/components/tutor-flow/TutorIntroVideo";

import {
  User,
  Mail,
  Lock,
  Phone,
  BookOpen,
  Languages,
  GraduationCap,
  School,
  Clock,
} from 'lucide-react';
import toast from 'react-hot-toast';

// ------------ FORM TYPE ------------
type TutorForm = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  subjects: string;
  classesTaught: string;
  languages: string;
  qualification: string;
  college: string;
  yearsOfExperience: string;
};

const defaultForm: TutorForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  subjects: '',
  classesTaught: '',
  languages: '',
  qualification: '',
  college: '',
  yearsOfExperience: '0',
};

const TutorRegistration: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TutorForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getInputType = (key: keyof TutorForm): string => {
    if (key === 'password') return 'password';
    if (key === 'email') return 'email';
    if (key === 'yearsOfExperience') return 'number';
    return 'text';
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const apiPayload = {
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      qualification: formData.qualification,
      college: formData.college,
      subjects: formData.subjects.split(',').map(s => s.trim()),
      languages: formData.languages.split(',').map(s => s.trim()),
      classesTaught: formData.classesTaught.split(',').map(s => s.trim()),
      yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || 0,
    };

    try {
      await apiClient.post('/auth/tutor/signup', apiPayload);
      await apiClient.post('/otp/send', { phone: formData.phone });
      toast.success('OTP sent to your phone 📱');
      router.push(`/tutor-flow/verify-phone?phone=${formData.phone}`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />
 
      {/* 🌈 BACKGROUND */}
      <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <img
          src="/images/teacher.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
          alt="Background"
        />

        {/* HERO */}
        {/* 🌈 GRADIENT HERO SECTION */}
<div className="relative overflow-hidden">
  {/* Gradient Background */}
  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

  {/* Content */}
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="relative z-10 mx-auto max-w-5xl px-4 py-20 text-center text-white"
  >
    <motion.h1
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="text-4xl font-extrabold md:text-5xl"
    >
      Become a Part of Tutvex
    </motion.h1>

    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      className="mt-4 text-lg text-blue-100"
    >
      Join thousands of tutors shaping the future of education.
    </motion.p>
  </motion.div>

  
  {/* Soft Glow */}
  <div className="absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-white/20 blur-3xl" />
</div>
     <div className="px-4 pt-6">
        <OnboardingStepper currentStep={1} />
      </div>

        {/* 🔥 LEFT–RIGHT SECTION */}
        <div className="relative z-10 mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-10 px-4 md:grid-cols-2">

          {/* LEFT */}
          <TutorIntroVideo />

          {/* RIGHT */}
          <div className="rounded-2xl bg-white/90 p-10 shadow-xl backdrop-blur-md">
            <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
              Tutor Registration Form
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {[
                ['fullName', 'Full Name', <User size={18} />],
                ['email', 'Email Address', <Mail size={18} />],
                ['password', 'Password', <Lock size={18} />],
                ['phone', 'Phone Number', <Phone size={18} />],
                ['subjects', 'Subjects (comma-separated)', <BookOpen size={18} />],
                ['languages', 'Languages (comma-separated)', <Languages size={18} />],
                ['classesTaught', 'Classes Taught', <BookOpen size={18} />],
                ['qualification', 'Qualification', <GraduationCap size={18} />],
                ['college', 'College / University', <School size={18} />],
                ['yearsOfExperience', 'Years of Experience', <Clock size={18} />],
              ].map(([key, label, icon]) => (
                <div key={key as string}>
                  <label className="block text-sm font-medium text-gray-700">
                    {label}
                  </label>

                  <div className="relative mt-1">
                    <span className="absolute left-3 top-3 text-gray-400">
                      {icon}
                    </span>

                    <input
                      name={key as string}
                      type={getInputType(key as keyof TutorForm)}
                      value={formData[key as keyof TutorForm]}
                      onChange={(e) => {
                        let value = e.target.value;
                        if (key === 'phone') {
                          value = value.replace(/\D/g, '').slice(0, 10);
                        }
                        setFormData(prev => ({
                          ...prev,
                          [key as keyof TutorForm]: value
                        }));
                      }}
                      className="w-full rounded-lg border border-gray-300 px-10 py-2.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-300"
                      required
                    />
                  </div>
                </div>
              ))}

              {error && <p className="text-center text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-600 py-3 text-white hover:bg-blue-700"
              >
                {isLoading ? 'Submitting…' : 'Next'}
              </button>
            </form>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="relative z-10 mx-auto mt-16 max-w-4xl pb-20">
          <h3 className="text-center text-xl font-semibold text-gray-800">
            Why Teach at Tutvex?
          </h3>

          <div className="mt-6 grid grid-cols-1 gap-6 text-center md:grid-cols-3">
            <div className="rounded-xl bg-white p-6 shadow-md">
              📚 Teach Anywhere
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md">
              💼 Grow Professionally
            </div>
            <div className="rounded-xl bg-white p-6 shadow-md">
              💰 Earn More
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TutorRegistration;
