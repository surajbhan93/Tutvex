import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { FormEvent, ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import OnboardingStepper from '@/components/tutor-flow/OnboardingStepper';
import apiClient from '../../lib/apiClient';
import TutorIntroVideo from '@/components/tutor-flow/TutorIntroVideo';

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
  MapPin,
  ChevronRight,
  Star,
  Users,
  TrendingUp,
  Shield,
  Upload,
  Camera,
  CheckCircle2,
  Sparkles,
  Award,
  BookCheck,
  Building,
} from 'lucide-react';
import toast from 'react-hot-toast';

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
  city: string;
  area: string;
  state: string;
  profileImage: string;
};

const defaultForm: TutorForm = {
  fullName: '',
  email: '',
  password: '',
  phone: '',
  subjects: '',
  classesTaught: '',
  languages: 'Hindi, English',
  qualification: '',
  college: '',
  yearsOfExperience: '1',
  city: 'Prayagraj',
  area: '',
  state: 'Uttar Pradesh',
  profileImage: '',
};

const POPULAR_CITIES = [
  'Prayagraj',
  'Varanasi',
  'Lucknow',
  'Kanpur',
  'Delhi',
  'Noida',
  'Gorakhpur',
  'Agra',
  'Patna',
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

const fieldGroups = [
  {
    title: '1. Account & Personal Info',
    color: 'from-indigo-600 to-blue-600',
    icon: <User size={18} />,
    fields: [
      { key: 'fullName', label: 'Full Name', icon: <User size={16} />, placeholder: 'e.g. Rajesh Kumar' },
      { key: 'email', label: 'Email Address', icon: <Mail size={16} />, placeholder: 'e.g. rajesh@gmail.com' },
      { key: 'password', label: 'Password', icon: <Lock size={16} />, placeholder: 'Create strong password' },
      { key: 'phone', label: '10-Digit Mobile Number', icon: <Phone size={16} />, placeholder: 'e.g. 9876543210' },
    ],
  },
  {
    title: '2. Location & Address',
    color: 'from-violet-600 to-purple-600',
    icon: <MapPin size={18} />,
    fields: [
      { key: 'city', label: 'City', icon: <Building size={16} />, placeholder: 'Select or type City' },
      { key: 'area', label: 'Area / Locality / Street Address', icon: <MapPin size={16} />, placeholder: 'e.g. Civil Lines, Salori, Katra' },
      { key: 'state', label: 'State', icon: <MapPin size={16} />, placeholder: 'Uttar Pradesh' },
    ],
  },
  {
    title: '3. Teaching & Subjects Expertise',
    color: 'from-amber-600 to-orange-600',
    icon: <BookOpen size={18} />,
    fields: [
      { key: 'subjects', label: 'Subjects Taught (comma-separated)', icon: <BookOpen size={16} />, placeholder: 'e.g. Mathematics, Physics, Chemistry' },
      { key: 'classesTaught', label: 'Classes Taught (comma-separated)', icon: <BookCheck size={16} />, placeholder: 'e.g. Class 9, Class 10, Class 11, Class 12' },
      { key: 'languages', label: 'Languages Spoken', icon: <Languages size={16} />, placeholder: 'e.g. Hindi, English' },
    ],
  },
  {
    title: '4. Qualifications & Experience',
    color: 'from-emerald-600 to-teal-600',
    icon: <GraduationCap size={18} />,
    fields: [
      { key: 'qualification', label: 'Highest Qualification', icon: <GraduationCap size={16} />, placeholder: 'e.g. M.Sc Mathematics / B.Tech / B.Ed' },
      { key: 'college', label: 'College / University', icon: <School size={16} />, placeholder: 'e.g. University of Allahabad' },
      { key: 'yearsOfExperience', label: 'Teaching Experience (Years)', icon: <Clock size={16} />, placeholder: 'e.g. 3' },
    ],
  },
];

const benefits = [
  { icon: <Users size={22} />, title: 'Connect with Local Students', desc: 'Get parent & student leads directly in Prayagraj & nearby regions.' },
  { icon: <TrendingUp size={22} />, title: 'Earn Up To ₹60,000/Month', desc: 'Set your own hourly or monthly tuition fee rates without commission penalty.' },
  { icon: <Award size={22} />, title: 'Tutvex Educator Verification', desc: 'Get verified badge, SEO landing page, and student reviews boost.' },
  { icon: <Shield size={22} />, title: 'Safe & Trustworthy Platform', desc: 'Strict phone OTP & identity verification for parent security.' },
];

const TutorRegistration: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TutorForm>(defaultForm);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInputType = (key: keyof TutorForm): string => {
    if (key === 'password') return 'password';
    if (key === 'email') return 'email';
    if (key === 'yearsOfExperience') return 'number';
    return 'text';
  };

  // Handle Photo File Upload & Conversion to Base64
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, profileImage: base64String }));
        toast.success('Profile photo uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const selectPresetAvatar = (url: string) => {
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, profileImage: url }));
    toast.success('Avatar selected!');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.fullName.trim()) {
      toast.error('Please enter your full name');
      setIsLoading(false);
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      setIsLoading(false);
      return;
    }

    const apiPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: formData.phone.trim(),
      qualification: formData.qualification.trim(),
      college: formData.college.trim(),
      subjects: formData.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
      classesTaught: formData.classesTaught.split(',').map((s) => s.trim()).filter(Boolean),
      yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || 0,
      profileImage: formData.profileImage || undefined,
      location: {
        city: formData.city.trim() || 'Prayagraj',
        area: formData.area.trim() || 'Civil Lines',
        state: formData.state.trim() || 'Uttar Pradesh',
        country: 'India',
        coordinates: {
          type: 'Point',
          coordinates: [78.9629, 20.5937],
        },
      },
    };

    try {
      await apiClient.post('/auth/tutor/signup', apiPayload);
      const otpRes = await apiClient.post('/otp/send', { phone: formData.phone });
      const otp = otpRes.data.otp;
      toast.success('Registration successful! Sending OTP...');
      router.push(`/tutor-flow/verify-phone?phone=${formData.phone}&otp=${otp}`);
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Registration failed. Please check your details and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <NavBar />

      <div className="min-h-screen bg-[#faf8ff] text-gray-900 font-['Outfit',sans-serif]">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:ital,wght@0,300;0,700;1,300&display=swap');

          .tutvex-hero-gradient {
            background-color: #0b0726;
            background-image: radial-gradient(circle, rgba(255, 255, 255, 0.08) 1px, transparent 1px), linear-gradient(135deg, #0b0726 0%, #1c154c 50%, #2a1b6d 100%);
            background-size: 28px 28px, 100% 100%;
            position: relative;
            overflow: hidden;
          }
          .input-field {
            width: 100%;
            padding: 0.75rem 1rem 0.75rem 2.8rem;
            background: #ffffff;
            border: 1.5px solid #e2e0f0;
            border-radius: 12px;
            font-size: 0.92rem;
            color: #1a1730;
            transition: all 0.2s ease-in-out;
            outline: none;
          }
          .input-field:focus {
            border-color: #6366f1;
            box-shadow: 0 0 0 4px rgba(99,102,241,0.12);
          }
          .input-field::placeholder { color: #a19dbf; }
          .section-card {
            background: #ffffff;
            border-radius: 18px;
            border: 1.5px solid #eef0fa;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            overflow: hidden;
          }
          .section-header {
            padding: 0.9rem 1.25rem;
            display: flex;
            align-items: center;
            gap: 0.65rem;
            font-weight: 700;
            font-size: 0.85rem;
            letter-spacing: 0.03em;
            color: white;
          }
          .submit-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            border: none;
            border-radius: 14px;
            font-size: 1.05rem;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.6rem;
            transition: all 0.25s ease;
            box-shadow: 0 8px 25px rgba(99,102,241,0.35);
          }
          .submit-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 12px 32px rgba(99,102,241,0.45);
          }
          .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        `}</style>

        {/* ─── HERO HEADER ─── */}
        <div className="tutvex-hero-gradient border-b border-indigo-950/50">
          <div className="relative z-10 mx-auto max-w-6xl px-4 py-14 md:py-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 backdrop-blur-md">
                <Sparkles size={14} className="text-amber-400" />
                Tutvex Education Partner Network
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Become a Verified{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-300">
                  Tutvex Tutor
                </span>
              </h1>

              <p className="mt-4 text-base md:text-lg text-indigo-200/90 font-light max-w-2xl mx-auto leading-relaxed">
                Connect with thousands of active students & parents in Prayagraj & across India. Build your verified profile, set your rates, and grow your career.
              </p>

              {/* Stats */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  { value: '10,000+', label: 'Active Students' },
                  { value: '₹50,000+', label: 'Avg Monthly Income' },
                  { value: '4.9★', label: 'Platform Rating' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-center"
                  >
                    <div className="text-lg font-bold text-white">{s.value}</div>
                    <div className="text-[11px] text-indigo-200 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Stepper Bar */}
        <div className="bg-white border-b border-gray-200/70 px-4 py-4 shadow-sm sticky top-0 z-30">
          <div className="mx-auto max-w-5xl">
            <OnboardingStepper currentStep={1} />
          </div>
        </div>

        {/* ─── MAIN FORM SECTION ─── */}
        <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">

            {/* LEFT SIDEBAR: Video + Benefits */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Tutvex Registration Video */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-2xl overflow-hidden shadow-lg border border-indigo-100 bg-white"
              >
                <TutorIntroVideo />
              </motion.div>

              {/* Why Join Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl p-6 border border-indigo-100/80 shadow-sm space-y-4"
              >
                <div className="flex items-center gap-2 border-b pb-3">
                  <Award className="text-indigo-600" size={20} />
                  <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                    Why Tutors Choose Tutvex
                  </h3>
                </div>

                <div className="space-y-4">
                  {benefits.map((b) => (
                    <div key={b.title} className="flex gap-3 items-start">
                      <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0 mt-0.5">
                        {b.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-800">{b.title}</h4>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <div className="mb-6 bg-white p-6 rounded-2xl border border-indigo-100 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Create Your Tutor Account
                    </h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">
                      Complete your profile to get parent lead calls & student bookings
                    </p>
                  </div>
                  <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                    Step 1 of 3
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* 📸 PROFILE / PORTFOLIO PHOTO UPLOAD SECTION */}
                <div className="section-card p-6">
                  <div className="flex items-center gap-2 mb-4 border-b pb-3">
                    <Camera size={20} className="text-indigo-600" />
                    <h3 className="font-bold text-gray-800 text-sm uppercase tracking-wide">
                      Tutor Profile & Portfolio Photo
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar Preview */}
                    <div className="relative group flex-shrink-0">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-indigo-100 bg-gray-100 flex items-center justify-center shadow-md">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Profile Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User size={40} className="text-gray-400" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg transition-transform hover:scale-110"
                        title="Upload Photo"
                      >
                        <Camera size={14} />
                      </button>
                    </div>

                    {/* Upload Controls */}
                    <div className="flex-1 space-y-3 text-center sm:text-left">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Upload Professional Photo</p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Tutors with real photos receive 3x more parent demo requests (Max 5MB).
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-semibold text-xs rounded-xl border border-indigo-200 transition-colors"
                        >
                          <Upload size={14} /> Choose Photo File
                        </button>
                      </div>

                      {/* Preset Avatar Selection */}
                      <div className="pt-2">
                        <p className="text-[11px] font-medium text-gray-400 mb-1.5">Or choose a quick avatar:</p>
                        <div className="flex gap-2 justify-center sm:justify-start">
                          {PRESET_AVATARS.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`Preset ${i}`}
                              onClick={() => selectPresetAvatar(url)}
                              className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition-all hover:scale-110 ${
                                imagePreview === url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* FORM SECTIONS */}
                {fieldGroups.map((group, gi) => (
                  <div key={group.title} className="section-card">
                    {/* Section Header */}
                    <div
                      className="section-header"
                      style={{
                        background: `linear-gradient(135deg, ${group.color
                          .replace('from-', '')
                          .replace(' to-', ', ')})`,
                      }}
                    >
                      {group.icon}
                      <span>{group.title}</span>
                    </div>

                    {/* Form Input Grid */}
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {group.fields.map(({ key, label, icon, placeholder }) => (
                        <div
                          key={key}
                          className={
                            key === 'subjects' || key === 'classesTaught' || key === 'languages' || key === 'area'
                              ? 'sm:col-span-2'
                              : ''
                          }
                        >
                          <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                            {label} <span className="text-red-500">*</span>
                          </label>

                          {/* CITY QUICK SELECTION */}
                          {key === 'city' ? (
                            <div className="space-y-2">
                              <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-400">
                                  {icon}
                                </span>
                                <input
                                  name="city"
                                  type="text"
                                  value={formData.city}
                                  placeholder={placeholder}
                                  onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, city: e.target.value }))
                                  }
                                  className="input-field"
                                  required
                                />
                              </div>
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                <span className="text-[11px] text-gray-400 self-center mr-1 font-medium">Quick Select:</span>
                                {POPULAR_CITIES.map((c) => (
                                  <button
                                    key={c}
                                    type="button"
                                    onClick={() => setFormData((prev) => ({ ...prev, city: c }))}
                                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border transition-all ${
                                      formData.city.toLowerCase() === c.toLowerCase()
                                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                        : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                                    }`}
                                  >
                                    {c}
                                  </button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="relative">
                              <span className="absolute left-3 top-3 text-gray-400 pointer-events-none">
                                {icon}
                              </span>
                              <input
                                name={key}
                                type={getInputType(key as keyof TutorForm)}
                                value={formData[key as keyof TutorForm]}
                                placeholder={placeholder}
                                onFocus={() => setFocusedField(key)}
                                onBlur={() => setFocusedField(null)}
                                onChange={(e) => {
                                  let value = e.target.value;
                                  if (key === 'phone') {
                                    value = value.replace(/\D/g, '').slice(0, 10);
                                  }
                                  setFormData((prev) => ({
                                    ...prev,
                                    [key as keyof TutorForm]: value,
                                  }));
                                }}
                                className="input-field"
                                required
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Terms Note */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    By submitting this form, you agree to Tutvex Education&apos;s{' '}
                    <a href="/terms" target="_blank" className="text-indigo-600 font-semibold hover:underline">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-indigo-600 font-semibold hover:underline">
                      Privacy Policy
                    </a>
                    .
                  </p>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="submit-btn"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account & Sending OTP...
                    </>
                  ) : (
                    <>
                      <span>Continue to Verify Phone (OTP)</span>
                      <ChevronRight size={18} />
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TutorRegistration;