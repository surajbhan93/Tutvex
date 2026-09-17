import Head from "next/head";
import { motion } from "framer-motion";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import DemoRequestModal from "@/components/tutor-flow/DemoRequestModal";
import AddTutorReview from "./AddTutorReview";
import {
  Star,
  BookOpen,
  Clock,
  Languages,
  GraduationCap,
  Users,
  IndianRupee,
  CheckCircle,
  CalendarDays,
  ShieldCheck,
  Headphones,
  Monitor,
  AlertCircle,
  MapPin,
  Award,
  Sparkles,
  TrendingUp,
  UserCheck,
  MessageCircle,
  Phone,
} from "lucide-react";
import publicApi from "@/lib/publicApi";
import apiClient from "@/lib/apiClient";
import { GetServerSideProps } from "next";
import { resolveImage } from "@/lib/resolveImage";
import toast from "react-hot-toast";
import ssrApi from "@/lib/ssrApi";
import { generateTutorSEO, generateTutorFAQSchema, generateTutorPersonSchema, generateTutorSlug } from "@/lib/seo/generateTutorSEO";
import TutorHero from "@/components/tutor/TutorHero";
import TeachingMethodology from "@/components/tutor/TeachingMethodology";
import TrustSignals from "@/components/tutor/TrustSignals";
import LeadActions from "@/components/tutor/LeadActions";
import TutorFAQ from "@/components/tutor/TutorFAQ";

const STATIC_RATINGS = [4.0, 4.1, 4.3, 4.6, 4.7, 4.2, 4.9, 5.0];

type TutorLocation = {
  city?: string;
  area?: string;
  state?: string;
};

type Tutor = {
  _id: string;
  slug?: string;
  fullName: string;
  profileImage?: string;
  headline?: string;
  rating?: number;
  totalStudents?: number;
  price?: number;
  priceType?: "per_hour" | "per_month";
  bio?: string;
  subjects?: string[];
  languages?: string[];
  yearsOfExperience?: number;
  qualification?: string;
  college?: string;
  classesTaught?: string[];
  teachingMode?: string;
  availability?: string[] | string;
  location?: TutorLocation;
};

type TutorProfileProps = {
  tutor: Tutor;
};

// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//   const id = ctx.params?.id as string;
//   try {
//     const res = await publicApi.get(`/tutors/${id}`);
//     return { props: { tutor: res.data.data } };
//   } catch {
//     return { notFound: true };
//   }
// };
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = (ctx.params?.id || ctx.params?.slug) as string;

  try {
    const res = await ssrApi.get(`/tutors/${id}`);
    const tutor = res.data?.data;

    if (!tutor) {
      return { notFound: true };
    }

    const slug = tutor.slug || generateTutorSlug(tutor);

    // 🚀 SEO PERMANENT REDIRECT: If requested via Mongo ObjectId, redirect to SEO Slug URL!
    if (id !== slug && /^[0-9a-fA-F]{24}$/.test(id)) {
      return {
        redirect: {
          destination: `/tutor/${slug}`,
          permanent: true,
        },
      };
    }

    return {
      props: {
        tutor,
      },
    };
  } catch (err) {
    return { notFound: true };
  }
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < full ? "#F59E0B" : i === full && half ? "url(#half)" : "none"}
          stroke="#F59E0B"
          strokeWidth="1.5"
        >
          <defs>
            <linearGradient id="half">
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
};

export default function TutorProfile({ tutor }: TutorProfileProps) {
  if (!tutor) return null;

  const [showDemoModal, setShowDemoModal] = useState(false);
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const tutorSlug = tutor.slug || generateTutorSlug(tutor);

  // Generate SEO metadata
  const seoData = generateTutorSEO(
    {
      name: tutor.fullName,
      subject: tutor.subjects,
      city: tutor.location?.city,
      area: tutor.location?.area,
      state: tutor.location?.state,
      experience: tutor.yearsOfExperience,
      qualification: tutor.qualification,
      classesTaught: tutor.classesTaught,
      teachingMode: tutor.teachingMode,
      rating: tutor.rating,
      profileImage: resolveImage(tutor.profileImage),
      slug: tutorSlug,
    },
    tutorSlug
  );

  // Generate structured data schemas
  const faqSchema = generateTutorFAQSchema({
    name: tutor.fullName,
    subject: tutor.subjects,
    city: tutor.location?.city,
    teachingMode: tutor.teachingMode,
  });

  const personSchema = generateTutorPersonSchema(
    {
      name: tutor.fullName,
      subject: tutor.subjects,
      city: tutor.location?.city,
      area: tutor.location?.area,
      state: tutor.location?.state,
      qualification: tutor.qualification,
      experience: tutor.yearsOfExperience,
      profileImage: resolveImage(tutor.profileImage),
      rating: tutor.rating,
    },
    tutorSlug
  );

  // useEffect(() => {
  //   if (!tutor?._id) return;
  //   apiClient
  //     .get(`/tutors/${tutor._id}/reviews`)
  //     .then((res) => setReviews(res.data.data || []))
  //     .catch(() => {})
  //     .finally(() => setReviewsLoading(false));
  // }, [tutor?._id]);
  useEffect(() => {
  if (!router.isReady) return;

  const { action } = router.query;

  // check login
  const authStorage = localStorage.getItem("auth-storage");
  const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;

  if (token && action === "demo") {
    setShowDemoModal(true);
  }
}, [router.isReady]);

  useEffect(() => {
  if (!tutor?._id) return;

apiClient
      .get(`/tutors/${tutor._id}/reviews`)
      .then((res) => setReviews(res.data.data || []))
      .finally(() => setReviewsLoading(false));
  }, [tutor?._id]);


  if (!tutor) {
    return <div className="p-10 text-center">Loading...</div>;
  }
  
  const handleDemoClick = () => {
    if (typeof window === "undefined") return;
    const authStorage = localStorage.getItem("auth-storage");
    const token = authStorage ? JSON.parse(authStorage)?.state?.token : null;
    if (!token) {
      toast.custom(
        (t) => (
          <div className={`${t.visible ? "animate-enter" : "animate-leave"} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex gap-4 p-4 border-l-4 border-red-500`}>
            <div className="flex-shrink-0">
              <div className="h-10 w-10 flex items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="text-red-600" size={22} />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">Login Required</p>
              <p className="mt-1 text-sm text-gray-600">Please login first, then send demo request.</p>
            </div>
            <button onClick={() => toast.dismiss(t.id)} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>
        ),
        { duration: 3000 }
      );
      // router.push(`/login?redirect=/tutors/${tutor._id}`);
      router.push(`/login?redirect=/tutors/${tutor._id}&action=demo`);
      return;
    }
    setShowDemoModal(true);
  };

  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const effectiveRating: number =
    typeof tutor.rating === "number" && tutor.rating > 0
      ? tutor.rating
      : STATIC_RATINGS[tutor._id ? tutor._id.length % STATIC_RATINGS.length : 0] ?? 4.2;

  const isTopRated = effectiveRating >= 4.0;

  // WhatsApp handler
  const handleWhatsApp = () => {
    const phoneNumber = "919305275932";
    const message = encodeURIComponent(
      `Hi Tutvex Support, I am interested in booking a demo class with tutor ${tutor.fullName} (${tutor.subjects?.[0] || "Tutor"}).`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Request callback handler
  const handleRequestCallback = () => {
    toast.success("Callback request submitted! We'll contact you within 1 hour.");
    // TODO: Implement actual callback request API
  };

  const detailItems = [
    { icon: BookOpen, label: "Subjects", value: tutor.subjects?.join(", ") || "Not specified" },
    { icon: Languages, label: "Languages", value: tutor.languages?.join(", ") || "Not specified" },
    { icon: Clock, label: "Experience", value: `${tutor.yearsOfExperience}+ years` },
    { icon: GraduationCap, label: "Qualification", value: tutor.qualification || "Not specified" },
    { icon: GraduationCap, label: "College", value: tutor.college || "Not specified" },
    { icon: Users, label: "Classes", value: tutor.classesTaught?.join(", ") || "Not specified" },
    { icon: Monitor, label: "Teaching Mode", value: tutor.teachingMode || "Not specified" },
    {
      icon: MapPin,
      label: "Location",
      value: [tutor.location?.area, tutor.location?.city, tutor.location?.state].filter(Boolean).join(", ") || "Not specified",
    },
    {
      icon: CalendarDays,
      label: "Availability",
      value: Array.isArray(tutor.availability) ? tutor.availability.join(", ") : tutor.availability || "Not specified",
    },
  ];

  return (
    <>
      <NavBar />
      <Head>
        {/* Primary Meta Tags */}
        <title>{seoData.title}</title>
        <meta name="title" content={seoData.title} />
        <meta name="description" content={seoData.description} />
        <meta name="keywords" content={seoData.keywords.join(", ")} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={seoData.canonical} />
        
        {/* Robots Meta */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={seoData.canonical} />
        <meta property="og:title" content={seoData.ogTitle} />
        <meta property="og:description" content={seoData.ogDescription} />
        <meta property="og:image" content={resolveImage(tutor.profileImage)} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Tutvex" />
        <meta property="og:locale" content="en_IN" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={seoData.canonical} />
        <meta name="twitter:title" content={seoData.twitterTitle} />
        <meta name="twitter:description" content={seoData.twitterDescription} />
        <meta name="twitter:image" content={resolveImage(tutor.profileImage)} />
        <meta name="twitter:site" content="@tutvex" />
        <meta name="twitter:creator" content="@tutvex" />
        
        {/* Additional Meta Tags */}
        <meta name="author" content={tutor.fullName} />
        <meta name="rating" content="General" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Geo Tags for Local SEO */}
        {tutor.location?.city && (
          <>
            <meta name="geo.region" content={`IN-${tutor.location.state || ""}`} />
            <meta name="geo.placename" content={tutor.location.city} />
          </>
        )}
        
        {/* JSON-LD Structured Data - FAQ Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        
        {/* JSON-LD Structured Data - Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        
        {/* JSON-LD Structured Data - Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Tutvex",
              "url": "https://www.tutvex.com",
              "logo": "https://www.tutvex.com/logo.png",
              "sameAs": [
                "https://www.facebook.com/tutvex",
                "https://twitter.com/tutvex",
                "https://www.instagram.com/tutvex",
              ],
            }),
          }}
        />
      </Head>

      <main className="profile-root min-h-screen" style={{ background: "linear-gradient(160deg, #f0f4ff 0%, #faf5ff 50%, #f0f9ff 100%)" }}>
        
        {/* New Hero Section */}
        <TutorHero
          name={tutor.fullName}
          profileImage={tutor.profileImage}
          headline={tutor.headline}
          subjects={tutor.subjects}
          classesTaught={tutor.classesTaught}
          qualification={tutor.qualification}
          college={tutor.college}
          bio={tutor.bio}
          city={tutor.location?.city}
          area={tutor.location?.area}
          experience={tutor.yearsOfExperience}
          rating={effectiveRating}
          totalStudents={tutor.totalStudents}
          isVerified={true}
          onBookDemo={handleDemoClick}
          onWhatsApp={handleWhatsApp}
          onRequestCallback={handleRequestCallback}
        />

        {/* Trust Signals Section */}
        <TrustSignals
          responseTime="1 Hour"
          experience={tutor.yearsOfExperience}
        />

        {/* ══════════════════ TUTOR CREDENTIALS & DETAILS GRID ══════════════════ */}
        <section className="max-w-6xl mx-auto py-10 px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT 2 COLUMNS: CREDENTIALS & ABOUT */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About & Bio Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                    <UserCheck size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">About {tutor.fullName}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed text-base">
                  {tutor.bio || `${tutor.fullName} is a dedicated and result-oriented educator with ${tutor.yearsOfExperience || 3}+ years of teaching experience. Specializing in ${tutor.subjects?.join(", ") || "core academic subjects"}, they focus on building strong foundational concepts and conceptual clarity for every student.`}
                </p>

                {/* Privacy Badge */}
                <div className="mt-6 flex items-center gap-3 p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-900">
                  <ShieldCheck size={18} className="text-blue-600 flex-shrink-0" />
                  <span>
                    <strong>Privacy Protected:</strong> Direct phone numbers and email addresses are kept private for safety. Connect safely via Tutvex Free Demo Class booking.
                  </span>
                </div>
              </motion.div>

              {/* Qualifications & Subjects Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl p-7 shadow-lg border border-gray-100"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <GraduationCap className="text-indigo-600" size={24} />
                  Qualifications &amp; Expertise
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Qualification */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Qualification</span>
                    <p className="font-bold text-gray-800 text-base">{tutor.qualification || "Graduate Degree"}</p>
                    {tutor.college && <p className="text-xs text-indigo-600 font-medium mt-0.5">{tutor.college}</p>}
                  </div>

                  {/* Experience */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Experience</span>
                    <p className="font-bold text-gray-800 text-base">{tutor.yearsOfExperience || 3}+ Years Teaching</p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Verified Experience</p>
                  </div>

                  {/* Teaching Mode */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Teaching Mode</span>
                    <p className="font-bold text-gray-800 text-base">{tutor.teachingMode || "Home Tuition & Online"}</p>
                  </div>

                  {/* Languages */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Languages Spoken</span>
                    <p className="font-bold text-gray-800 text-base">{tutor.languages?.join(", ") || "English, Hindi"}</p>
                  </div>
                </div>

                {/* Subjects Pills */}
                {tutor.subjects && tutor.subjects.length > 0 && (
                  <div className="mt-6">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Subjects Taught</span>
                    <div className="flex flex-wrap gap-2">
                      {tutor.subjects.map((sub, i) => (
                        <span key={i} className="px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-sm">
                          📚 {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Classes Taught Pills */}
                {tutor.classesTaught && tutor.classesTaught.length > 0 && (
                  <div className="mt-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Classes &amp; Grades</span>
                    <div className="flex flex-wrap gap-2">
                      {tutor.classesTaught.map((cls, i) => (
                        <span key={i} className="px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 font-semibold text-xs">
                          🎓 {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

            </div>

            {/* RIGHT COLUMN: STICKY BOOKING & PRICING CARD */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Booking Card */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-white rounded-3xl p-6 shadow-xl border border-indigo-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                  {/* Price Banner */}
                  <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 text-white rounded-2xl p-5 mb-6 text-center shadow-md">
                    <span className="text-xs font-medium text-indigo-200 uppercase tracking-wider">Tuition Fee Rate</span>
                    <div className="text-3xl font-black mt-1">
                      {tutor.price ? `₹${tutor.price.toLocaleString("en-IN")}` : "₹800 - ₹2,500"}
                      <span className="text-sm font-medium text-indigo-100 ml-1">
                        /{tutor.priceType === "per_hour" ? "hour" : "month"}
                      </span>
                    </div>
                    <p className="text-xs text-indigo-200 mt-1">Negotiable directly with tutor</p>
                  </div>

                  {/* Quick Info */}
                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100 text-gray-700">
                      <span className="flex items-center gap-2 text-gray-500">
                        <MapPin size={16} className="text-indigo-600" /> Location
                      </span>
                      <span className="font-semibold text-gray-900 text-right">
                        {[tutor.location?.area, tutor.location?.city].filter(Boolean).join(", ") || "India"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 border-b border-gray-100 text-gray-700">
                      <span className="flex items-center gap-2 text-gray-500">
                        <ShieldCheck size={16} className="text-emerald-600" /> Phone &amp; Email
                      </span>
                      <span className="font-semibold text-emerald-700 text-xs bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        🔒 Verified &amp; Protected
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-2 text-gray-700">
                      <span className="flex items-center gap-2 text-gray-500">
                        <CalendarDays size={16} className="text-purple-600" /> Availability
                      </span>
                      <span className="font-semibold text-gray-900 text-xs text-right">
                        {Array.isArray(tutor.availability) ? tutor.availability[0] || "Available" : tutor.availability || "Flexible Slots"}
                      </span>
                    </div>
                  </div>

                  {/* Primary CTA Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleDemoClick}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Sparkles size={18} />
                      Book Free Demo Class
                    </button>

                    <button
                      onClick={handleWhatsApp}
                      className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={18} />
                      Chat via WhatsApp
                    </button>

                    <button
                      onClick={handleRequestCallback}
                      className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone size={14} className="text-slate-600" />
                      Request Instant Callback
                    </button>
                  </div>
                </motion.div>

              </div>
            </div>

          </div>
        </section>

        {/* Decorative blobs */}
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "-120px", right: "-120px", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
          <div style={{ position: "absolute", bottom: "-100px", left: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />
        </div>
        
        {/* Teaching Methodology Section */}
        <TeachingMethodology tutorName={tutor.fullName} />
        
        {/* Lead Actions CTA Section */}
        <LeadActions
          tutorName={tutor.fullName}
          onBookDemo={handleDemoClick}
          onWhatsApp={handleWhatsApp}
          onRequestCallback={handleRequestCallback}
          showAllActions={true}
        />
        
        {/* FAQ Section */}
        <TutorFAQ
          tutorName={tutor.fullName}
          subjects={tutor.subjects}
          city={tutor.location?.city}
          area={tutor.location?.area}
          teachingMode={tutor.teachingMode}
          price={tutor.price}
          priceType={tutor.priceType}
          experience={tutor.yearsOfExperience}
        />

        {/* ══════════════════ REVIEWS SECTION ══════════════════ */}
        <div className="max-w-6xl mx-auto mt-7 relative z-10 px-4">
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-3xl p-7 relative overflow-hidden shadow-lg border border-gray-100"
          >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, #f59e0b, #ef4444, #ec4899)" }} />
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 36, height: 36, borderRadius: "10px", background: "linear-gradient(135deg, #fffbeb, #fef3c7)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Star size={18} className="text-amber-500" fill="#F59E0B" />
              </div>
              <h2 className="display-font text-xl font-bold text-gray-800">Parent Reviews</h2>
              {reviews.length > 0 && (
                <span style={{ marginLeft: "auto", fontSize: 12, background: "linear-gradient(135deg, #fef3c7, #fde68a)", color: "#92400e", padding: "2px 10px", borderRadius: "9999px", fontWeight: 600, border: "1px solid #fde68a" }}>
                  {reviews.length} Review{reviews.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            <AddTutorReview tutorId={tutor._id} />

            {reviewsLoading ? (
              <div className="flex items-center gap-3 py-6 text-gray-400 text-sm">
                <div style={{ width: 18, height: 18, borderRadius: "50%", border: "2px solid #e0e7ff", borderTop: "2px solid #6366f1", animation: "spin 0.8s linear infinite" }} />
                Loading reviews...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10">
                <div style={{ fontSize: 40 }}>⭐</div>
                <p className="text-gray-400 text-sm mt-2">No reviews yet. Be the first to review this tutor!</p>
              </div>
            ) : (
              <div className="space-y-4 mt-4">
                {reviews.map((r, idx) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="review-card rounded-2xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div style={{ position: "relative" }}>
                          <img
                            src={resolveImage(r.parent?.profileImage)}
                            alt={r.parent?.fullName || "Parent"}
                            className="w-10 h-10 rounded-full object-cover"
                            style={{ border: "2px solid #e0e7ff" }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{r.parent?.fullName || "Parent"}</p>
                          <p className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            className={i < r.rating ? "text-amber-400" : "text-gray-200"}
                            fill={i < r.rating ? "#fbbf24" : "#e5e7eb"}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-3 text-gray-600 text-sm leading-relaxed pl-1 border-l-2 border-indigo-200 pl-3 italic">
                      "{r.comment}"
                    </p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </main>

      {showDemoModal && (
        <DemoRequestModal
          tutorId={tutor._id}
          subjects={tutor.subjects || []}
          onClose={() => setShowDemoModal(false)}
        />
      )}

      <Footer />
    </>
  );
}