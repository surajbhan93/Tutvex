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
  ChevronLeft,
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
  FileText,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatPhoneInput, extractTenDigitPhone } from '@/lib/phoneUtils';

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
  board10th: string;
  board12th: string;
  twelfthCertificate: string;
  aadharCard: string;
  graduationCertificate: string;
  tenthCertificate: string;
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
  board10th: 'CBSE',
  board12th: 'CBSE',
  twelfthCertificate: '',
  aadharCard: '',
  graduationCertificate: '',
  tenthCertificate: '',
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

const SLIDES = [
  { id: 1, title: 'Personal & Photo', icon: User, color: 'from-indigo-600 to-blue-600' },
  { id: 2, title: 'Location Details', icon: MapPin, color: 'from-violet-600 to-purple-600' },
  { id: 3, title: 'Teaching Expertise', icon: BookOpen, color: 'from-amber-600 to-orange-600' },
  { id: 4, title: 'Qualifications', icon: GraduationCap, color: 'from-emerald-600 to-teal-600' },
  { id: 5, title: 'Document Uploads', icon: BookCheck, color: 'from-cyan-600 to-blue-700' },
  { id: 6, title: 'Agreement & Submit', icon: Shield, color: 'from-slate-900 to-indigo-900' },
];

const benefits = [
  { icon: <Users size={22} />, title: 'Connect with Local Students', desc: 'Get parent & student leads directly in Prayagraj & nearby regions.' },
  { icon: <TrendingUp size={22} />, title: 'Earn Up To ₹60,000/Month', desc: 'Set your own hourly or monthly tuition fee rates without commission penalty.' },
  { icon: <Award size={22} />, title: 'Tutvex Educator Verification', desc: 'Get verified badge, SEO landing page, and student reviews boost.' },
  { icon: <Shield size={22} />, title: 'Safe & Trustworthy Platform', desc: 'Strict phone OTP & identity verification for parent security.' },
];

/**
 * Client-Side Image Compression Helper
 * Resizes large photos to max 1200px width/height and compresses quality to 75% JPEG.
 * Prevents heavy 10MB+ payload strings when sending registration data.
 */
const compressImageToBase64 = (file: File, maxWidth = 1200, quality = 0.75): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const TutorRegistration: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<TutorForm>(defaultForm);
  const [currentSlide, setCurrentSlide] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert photo to lightweight Base64
  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }
      try {
        toast.loading('Processing photo...', { id: 'photo-upload' });
        const base64String = await compressImageToBase64(file, 1000, 0.75);
        setImagePreview(base64String);
        setFormData((prev) => ({ ...prev, profileImage: base64String }));
        toast.success('Profile photo processed successfully!', { id: 'photo-upload' });
      } catch (err) {
        toast.error('Failed to process image file', { id: 'photo-upload' });
      }
    }
  };

  const selectPresetAvatar = (url: string) => {
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, profileImage: url }));
    toast.success('Avatar selected!');
  };

  // Compress & convert document file to Base64
  const handleDocFileUpload = async (
    field: 'twelfthCertificate' | 'aadharCard' | 'graduationCertificate' | 'tenthCertificate',
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size must be less than 10MB');
        return;
      }
      try {
        toast.loading('Optimizing document file...', { id: 'doc-upload' });
        const base64 = await compressImageToBase64(file, 1400, 0.75);
        setFormData((prev) => ({ ...prev, [field]: base64 }));
        toast.success('Document attached successfully!', { id: 'doc-upload' });
      } catch (err) {
        toast.error('Failed to process document file', { id: 'doc-upload' });
      }
    }
  };

  // Slide navigation & validation
  const validateSlide = (slide: number): boolean => {
    if (slide === 1) {
      if (!formData.fullName.trim()) {
        toast.error('Please enter your full name');
        return false;
      }
      if (!formData.email.trim()) {
        toast.error('Please enter your email address');
        return false;
      }
      if (!formData.password) {
        toast.error('Please create a password');
        return false;
      }
      const cleanPhone = extractTenDigitPhone(formData.phone);
      if (!cleanPhone || cleanPhone.length < 10) {
        toast.error('Please enter a valid 10-digit mobile number');
        return false;
      }
    }
    if (slide === 2) {
      if (!formData.city.trim()) {
        toast.error('Please select or enter your city');
        return false;
      }
    }
    if (slide === 3) {
      if (!formData.subjects.trim()) {
        toast.error('Please specify the subjects you teach');
        return false;
      }
    }
    if (slide === 4) {
      if (!formData.qualification.trim()) {
        toast.error('Please enter your highest qualification');
        return false;
      }
    }
    return true;
  };

  const nextSlide = () => {
    if (validateSlide(currentSlide)) {
      if (currentSlide < SLIDES.length) {
        setCurrentSlide((prev) => prev + 1);
        window.scrollTo({ top: 300, behavior: 'smooth' });
      }
    }
  };

  const prevSlide = () => {
    if (currentSlide > 1) {
      setCurrentSlide((prev) => prev - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!validateSlide(1) || !validateSlide(2) || !validateSlide(3) || !validateSlide(4)) {
      setIsLoading(false);
      return;
    }

    const cleanPhone = extractTenDigitPhone(formData.phone);
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      setIsLoading(false);
      return;
    }

    if (!acceptedPolicy) {
      toast.error('Please accept Tutvex Tutor Agreement (Annexure A & B) to complete registration');
      setIsLoading(false);
      return;
    }

    const apiPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      phone: cleanPhone,
      qualification: formData.qualification.trim(),
      college: formData.college.trim(),
      board10th: formData.board10th || 'CBSE',
      board12th: formData.board12th || 'CBSE',
      subjects: formData.subjects.split(',').map((s) => s.trim()).filter(Boolean),
      languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
      classesTaught: formData.classesTaught.split(',').map((s) => s.trim()).filter(Boolean),
      yearsOfExperience: parseInt(formData.yearsOfExperience, 10) || 0,
      profileImage: formData.profileImage || undefined,
      documents: {
        twelfthCertificate: formData.twelfthCertificate || undefined,
        aadharCard: formData.aadharCard || undefined,
        graduationCertificate: formData.graduationCertificate || undefined,
        tenthCertificate: formData.tenthCertificate || undefined,
        identityProof: formData.aadharCard || undefined,
        educationProof: formData.graduationCertificate || undefined,
      },
      isDocumentsSubmitted: Boolean(
        formData.twelfthCertificate || formData.aadharCard || formData.graduationCertificate
      ),
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
      const otpRes = await apiClient.post('/otp/send', { phone: cleanPhone });
      const otp = otpRes.data.otp;
      toast.success('Registration successful! Sending OTP...');
      router.push(`/tutor-flow/verify-phone?phone=${cleanPhone}&otp=${otp}`);
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
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

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
          .submit-btn {
            padding: 1rem 2rem;
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
        <div className="tutvex-hero-gradient border-b border-indigo-950/50 relative">
          <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 mx-auto max-w-6xl px-4 py-12 md:py-16 text-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 backdrop-blur-md shadow-inner">
                <Sparkles size={14} className="text-amber-400 animate-pulse" />
                Tutvex Educator Partner Network
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                Become a Verified{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-indigo-300 to-cyan-300">
                  Tutvex Tutor
                </span>
              </h1>

              <p className="mt-3 text-sm md:text-base text-indigo-200/90 font-light max-w-2xl mx-auto leading-relaxed">
                Connect with thousands of active students &amp; parents in Prayagraj &amp; across India. Build your verified profile, set your rates, and grow your career.
              </p>

              {/* Stats */}
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {[
                  { value: '10,000+', label: 'Active Students' },
                  { value: '₹50,000+', label: 'Avg Monthly Income' },
                  { value: '4.9★', label: 'Platform Rating' },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-md text-center"
                  >
                    <div className="text-base font-bold text-white">{s.value}</div>
                    <div className="text-[11px] text-indigo-200 font-medium">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ─── MAIN FORM SECTION ─── */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          
          {/* Stepper Progress Bar */}
          <div className="mb-8">
            <OnboardingStepper currentStep={1} />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:gap-8 xl:grid-cols-12">

            {/* LEFT SIDEBAR: Video + Benefits */}
            <div className="xl:col-span-4 flex flex-col gap-6">
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
                className="bg-white rounded-2xl p-6 border border-indigo-100/80 shadow-sm space-y-5 sticky top-24"
              >
                <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600">
                    <Award className="text-white" size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    Why Tutors Choose Tutvex
                  </h3>
                </div>

                <div className="space-y-4">
                  {benefits.map((b) => (
                    <div key={b.title} className="flex gap-3.5 items-start group hover:bg-indigo-50/50 -mx-2 px-2 py-2 rounded-xl transition-colors">
                      <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0 mt-0.5 group-hover:bg-indigo-100 transition-colors">
                        {b.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-900 leading-snug">{b.title}</h4>
                        <p className="text-xs text-gray-600 mt-1 leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Multi-Step Slide Wizard */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="xl:col-span-8 flex flex-col gap-6"
            >
              {/* SLIDE STEPPER NAV HEADER */}
              <div className="bg-white rounded-2xl p-4 border border-indigo-100 shadow-sm overflow-x-auto">
                <div className="flex items-center justify-between min-w-[540px] gap-2">
                  {SLIDES.map((slide) => {
                    const isActive = currentSlide === slide.id;
                    const isPassed = currentSlide > slide.id;
                    const Icon = slide.icon;

                    return (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => {
                          if (slide.id < currentSlide || validateSlide(currentSlide)) {
                            setCurrentSlide(slide.id);
                          }
                        }}
                        className={`flex-1 flex flex-col items-center gap-1.5 py-2 px-2 rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'bg-indigo-600 text-white shadow-md scale-[1.02]'
                            : isPassed
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-white/20' : isPassed ? 'bg-emerald-200/60 text-emerald-800' : 'bg-gray-200/60'}`}>
                          {isPassed ? <CheckCircle2 size={16} /> : <Icon size={16} />}
                        </div>
                        <span className="text-[11px] font-bold whitespace-nowrap">
                          {slide.id}. {slide.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CURRENT SLIDE CONTENT FORM */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                {/* SLIDE 1: ACCOUNT & PERSONAL INFO + PROFILE PHOTO */}
                {currentSlide === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-6 rounded-2xl shadow-xl text-white">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <User size={24} /> Step 1: Account &amp; Personal Details
                      </h2>
                      <p className="text-xs text-indigo-100 mt-1">
                        Create your account credentials &amp; upload your tutor profile photo
                      </p>
                    </div>

                    {/* Profile Photo Section */}
                    <div className="section-card p-6 md:p-8">
                      <div className="flex items-center gap-2.5 mb-5 pb-4 border-b border-gray-100">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                          <Camera size={20} className="text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-base">Tutor Profile Photo</h3>
                          <p className="text-xs text-gray-500">Build trust with parent &amp; student leads</p>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative flex-shrink-0">
                          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-indigo-100 bg-indigo-50 flex items-center justify-center shadow-lg">
                            {imagePreview ? (
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                              <User size={48} className="text-gray-300" />
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-3 rounded-full shadow-xl hover:scale-110 transition border-4 border-white"
                          >
                            <Upload size={16} />
                          </button>
                        </div>

                        <div className="flex-1 space-y-3 text-center md:text-left">
                          <h4 className="text-sm font-bold text-gray-900">
                            Upload a photo (gets automatically compressed &amp; optimized)
                          </h4>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="px-4 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow hover:bg-indigo-700 transition"
                            >
                              <Upload size={14} className="inline mr-1" /> Select Photo File
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">Or choose a avatar preset:</p>
                          <div className="flex gap-2 justify-center md:justify-start">
                            {PRESET_AVATARS.map((url, i) => (
                              <button
                                key={i}
                                type="button"
                                onClick={() => selectPresetAvatar(url)}
                                className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition ${imagePreview === url ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-gray-200'}`}
                              >
                                <img src={url} alt={`Avatar ${i}`} className="w-full h-full object-cover" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Input Fields */}
                    <div className="section-card p-6 md:p-8 space-y-4">
                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Full Name *</label>
                        <div className="relative">
                          <User size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Rajesh Kumar"
                            value={formData.fullName}
                            onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Email Address *</label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="email"
                            placeholder="e.g. rajesh@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Password *</label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Mobile Number (10 Digits) *</label>
                        <div className="relative">
                          <Phone size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210 or 09876543210"
                            value={formData.phone}
                            onChange={(e) => setFormData((prev) => ({ ...prev, phone: formatPhoneInput(e.target.value) }))}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 2: LOCATION & ADDRESS */}
                {currentSlide === 2 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <MapPin size={24} /> Step 2: Location &amp; Address
                      </h2>
                      <p className="text-xs text-purple-100 mt-1">Specify your operating city and teaching locality</p>
                    </div>

                    <div className="section-card p-6 md:p-8 space-y-4">
                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">City *</label>
                        <div className="relative">
                          <Building size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Select or type City"
                            value={formData.city}
                            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                        <div className="flex flex-wrap gap-1.5 pt-2">
                          <span className="text-[11px] text-gray-400 self-center font-medium">Quick Select:</span>
                          {POPULAR_CITIES.map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, city: c }))}
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${formData.city.toLowerCase() === c.toLowerCase() ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-gray-50 text-gray-600 border-gray-200'}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Area / Locality / Street</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Civil Lines, Katra, Salori"
                            value={formData.area}
                            onChange={(e) => setFormData((prev) => ({ ...prev, area: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">State</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Uttar Pradesh"
                            value={formData.state}
                            onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 3: TEACHING EXPERTISE */}
                {currentSlide === 3 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 rounded-2xl shadow-xl text-white">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookOpen size={24} /> Step 3: Teaching &amp; Subjects Expertise
                      </h2>
                      <p className="text-xs text-amber-100 mt-1">List subjects and classes you want to teach</p>
                    </div>

                    <div className="section-card p-6 md:p-8 space-y-4">
                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Subjects Taught (comma-separated) *</label>
                        <div className="relative">
                          <BookOpen size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Mathematics, Physics, Chemistry"
                            value={formData.subjects}
                            onChange={(e) => setFormData((prev) => ({ ...prev, subjects: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Classes Taught (comma-separated)</label>
                        <div className="relative">
                          <BookCheck size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Class 9, Class 10, Class 11, Class 12"
                            value={formData.classesTaught}
                            onChange={(e) => setFormData((prev) => ({ ...prev, classesTaught: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Languages Spoken</label>
                        <div className="relative">
                          <Languages size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. Hindi, English"
                            value={formData.languages}
                            onChange={(e) => setFormData((prev) => ({ ...prev, languages: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 4: QUALIFICATIONS & BOARDS */}
                {currentSlide === 4 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl shadow-xl text-white">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <GraduationCap size={24} /> Step 4: Qualifications &amp; Educational Boards
                      </h2>
                      <p className="text-xs text-emerald-100 mt-1">Your academic background and board affiliations</p>
                    </div>

                    <div className="section-card p-6 md:p-8 space-y-4">
                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Highest Qualification *</label>
                        <div className="relative">
                          <GraduationCap size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. M.Sc Mathematics / B.Tech / B.Ed"
                            value={formData.qualification}
                            onChange={(e) => setFormData((prev) => ({ ...prev, qualification: e.target.value }))}
                            className="input-field"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">College / University</label>
                        <div className="relative">
                          <School size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="text"
                            placeholder="e.g. University of Allahabad"
                            value={formData.college}
                            onChange={(e) => setFormData((prev) => ({ ...prev, college: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-gray-800 block mb-1">Teaching Experience (Years)</label>
                        <div className="relative">
                          <Clock size={16} className="absolute left-3 top-3.5 text-gray-400" />
                          <input
                            type="number"
                            placeholder="e.g. 3"
                            value={formData.yearsOfExperience}
                            onChange={(e) => setFormData((prev) => ({ ...prev, yearsOfExperience: e.target.value }))}
                            className="input-field"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="text-sm font-bold text-gray-800 block mb-1">10th Class Board</label>
                          <select
                            value={formData.board10th}
                            onChange={(e) => setFormData((prev) => ({ ...prev, board10th: e.target.value }))}
                            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm"
                          >
                            <option value="CBSE">CBSE Board</option>
                            <option value="ICSE">ICSE / ISC Board</option>
                            <option value="UP Board">UP State Board</option>
                            <option value="State Board">Other State Board</option>
                            <option value="Other">Other Board</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-sm font-bold text-gray-800 block mb-1">12th Class Board</label>
                          <select
                            value={formData.board12th}
                            onChange={(e) => setFormData((prev) => ({ ...prev, board12th: e.target.value }))}
                            className="w-full p-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-semibold text-sm"
                          >
                            <option value="CBSE">CBSE Board</option>
                            <option value="ICSE">ICSE / ISC Board</option>
                            <option value="UP Board">UP State Board</option>
                            <option value="State Board">Other State Board</option>
                            <option value="Other">Other Board</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 5: VERIFICATION DOCUMENTS */}
                {currentSlide === 5 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <BookCheck size={24} /> Step 5: Verification Documents
                      </h2>
                      <p className="text-xs text-cyan-100 mt-1">Upload images or PDFs (files are compressed automatically)</p>
                    </div>

                    <div className="section-card p-6 md:p-8 space-y-4">
                      <p className="text-xs text-gray-500">
                        Upload certificates for quick admin approval. You can also upload or update these later from your Tutor Dashboard.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 12th Certificate */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                              <FileText size={15} className="text-indigo-600" />
                              12th Certificate / Marksheet
                            </span>
                            {formData.twelfthCertificate && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} /> Attached
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocFileUpload('twelfthCertificate', e)}
                            className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 cursor-pointer w-full"
                          />
                        </div>

                        {/* Aadhar Card */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                              <Shield size={15} className="text-purple-600" />
                              Aadhar Card (Identity Proof)
                            </span>
                            {formData.aadharCard && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} /> Attached
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocFileUpload('aadharCard', e)}
                            className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 cursor-pointer w-full"
                          />
                        </div>

                        {/* Graduation Certificate */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                              <GraduationCap size={15} className="text-teal-600" />
                              Graduation Certificate / Degree
                            </span>
                            {formData.graduationCertificate && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} /> Attached
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocFileUpload('graduationCertificate', e)}
                            className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 cursor-pointer w-full"
                          />
                        </div>

                        {/* 10th Certificate */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50 hover:bg-white transition">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                              <Award size={15} className="text-amber-600" />
                              10th Certificate (Optional)
                            </span>
                            {formData.tenthCertificate && (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <CheckCircle2 size={12} /> Attached
                              </span>
                            )}
                          </div>
                          <input
                            type="file"
                            accept="image/*,.pdf"
                            onChange={(e) => handleDocFileUpload('tenthCertificate', e)}
                            className="text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 cursor-pointer w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE 6: AGREEMENT & FINAL SUBMIT */}
                {currentSlide === 6 && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-gradient-to-r from-slate-900 to-indigo-900 p-6 rounded-2xl shadow-xl text-white">
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Shield size={24} /> Step 6: Tutor Agreement &amp; Submission
                      </h2>
                      <p className="text-xs text-indigo-200 mt-1">Accept platform policies and submit registration</p>
                    </div>

                    <div className="section-card p-6 md:p-8 space-y-4 border-2 border-indigo-200">
                      <div className="p-4 rounded-xl bg-white border border-indigo-100 space-y-2 text-xs text-gray-700 leading-relaxed">
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          <Sparkles size={15} className="text-amber-500" />
                          Summary of Mandatory Tutvex Policies (Annexure A &amp; B):
                        </div>
                        <ul className="list-disc pl-5 space-y-1 text-gray-600">
                          <li><strong>Revenue Sharing Models:</strong> 30% revenue share for 1st month (Subscription Tutors) or 50% revenue share (Non-Subscription Tutors).</li>
                          <li><strong>No Direct Payments:</strong> All fee payments from parents/students must be made through Tutvex only.</li>
                          <li><strong>Non-Circumvention (12 Months):</strong> Tutors cannot teach introduced Tutvex parents/students independently or outside the platform for 12 months.</li>
                          <li><strong>Payment Protection &amp; Benefits:</strong> Full payment protection, verified experience certificate after 3 reviews, and ₹100 referral rewards.</li>
                          <li><strong>Consequences:</strong> Violations result in permanent removal, forfeiture of deposit, and financial penalty up to ₹10,000.</li>
                        </ul>
                      </div>

                      <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-indigo-200 bg-white hover:border-indigo-500 transition cursor-pointer">
                        <input
                          type="checkbox"
                          checked={acceptedPolicy}
                          onChange={(e) => setAcceptedPolicy(e.target.checked)}
                          className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                          required
                        />
                        <div className="text-xs text-gray-800 leading-relaxed font-semibold">
                          I confirm that I have read, understood, and voluntarily agree to follow all terms of the{' '}
                          <a
                            href="/tutor-policy-agreement"
                            target="_blank"
                            className="text-indigo-600 font-bold underline hover:text-indigo-800"
                          >
                            Tutvex Tutor Agreement (Annexure A – Operational Policies, Annexure B – Declaration &amp; Benefits, and Membership Pricing)
                          </a>
                          . I understand these terms are legally binding.
                        </div>
                      </label>
                    </div>
                  </motion.div>
                )}

                {/* SLIDE NAVIGATION CONTROLS */}
                <div className="flex items-center justify-between gap-4 pt-2">
                  {currentSlide > 1 ? (
                    <button
                      type="button"
                      onClick={prevSlide}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-sm rounded-xl transition flex items-center gap-1.5"
                    >
                      <ChevronLeft size={18} /> Previous Step
                    </button>
                  ) : <div />}

                  {currentSlide < 6 ? (
                    <button
                      type="button"
                      onClick={nextSlide}
                      className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-xl transition flex items-center gap-1.5"
                    >
                      Next Step <ChevronRight size={18} />
                    </button>
                  ) : (
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="submit-btn py-4 text-base shadow-xl"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Submitting Registration...
                        </>
                      ) : (
                        <>
                          <span>Submit &amp; Verify Phone (OTP)</span>
                          <ChevronRight size={20} />
                        </>
                      )}
                    </motion.button>
                  )}
                </div>
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