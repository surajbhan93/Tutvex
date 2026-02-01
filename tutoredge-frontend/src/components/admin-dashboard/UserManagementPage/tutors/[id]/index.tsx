import Head from "next/head";
import { motion } from "framer-motion";
import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import {  useEffect, useState } from "react";
import { useRouter } from "next/router";
import DemoRequestModal from "@/components/tutor-flow/DemoRequestModal";
// import AddTutorReview from "./AddTutorReview";
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
} from "lucide-react";
import publicApi from "@/lib/publicApi";
import apiClient from "@/lib/apiClient";
// import axios from "axios";
const BACKEND_URL = "http://localhost:3001";

export async function getServerSideProps(ctx: any) {
  const id = ctx.params?.id;

  try {
    const res = await publicApi.get(`/tutors/${id}`);
    return { props: { tutor: res.data.data } };
  } catch {
    return { notFound: true };
  }
}

export default function TutorProfile({ tutor }:any) {
  if (!tutor) return null;

  const imageUrl = tutor.profileImage
    ? `${BACKEND_URL}${tutor.profileImage}`
    : "/images/default-avatar.png";

          const [showDemoModal, setShowDemoModal] = useState(false);
      const router = useRouter();
      const [reviews, setReviews] = useState<any[]>([]);
      const [reviewsLoading, setReviewsLoading] = useState(true);


  const resolveUserImage = (path?: string) => {
  if (!path) return "/images/default-avatar.png"; // ✅ correct
  if (path.startsWith("http")) return path;
  return `http://localhost:3001${path}`;
};

useEffect(() => {
  if (!tutor?._id) return;

  apiClient
    .get(`/tutors/${tutor._id}/reviews`)
    .then((res) => {
      setReviews(res.data.data || []);
    })
    .catch(() => {})
    .finally(() => setReviewsLoading(false));
}, [tutor?._id]);


const handleDemoClick = () => {
  if (typeof window === "undefined") return;

  const token = localStorage.getItem("parentToken");

  if (!token) {
    router.push(`/login?redirect=/tutors/${tutor._id}`);
    return;
  }

  setShowDemoModal(true);
};


  const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <>
    <NavBar />
      <Head>
        <title>{tutor.fullName} | Tutor Profile</title>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-sky-50 px-4 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-6 text-center"
          >
            <img
              src={imageUrl}
              className="h-32 w-32 mx-auto rounded-full ring-4 ring-indigo-100 object-cover"
            />

            <h1 className="mt-4 text-2xl font-bold">{tutor.fullName}</h1>
            <p className="text-gray-500">{tutor.headline}</p>

            <div className="flex justify-center gap-4 mt-3 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Star size={16} className="text-yellow-500 fill-yellow-400" />
                {tutor.rating || 4.8}
              </span>
              <span className="flex items-center gap-1">
                <Users size={16} />
                {tutor.totalStudents || 0} students
              </span>
            </div>

            <div className="mt-4 flex justify-center items-center gap-1 text-indigo-600 font-semibold text-lg">
              <IndianRupee size={18} />
              {tutor.price}/{tutor.priceType === "per_hour" ? "hr" : "month"}
            </div>

            <button
              onClick={handleDemoClick}
              className="mt-6 w-full py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Book Demo Class
            </button>


            {/* FIXED TRUST TEXT */}
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p className="flex items-center justify-center gap-2">
                <ShieldCheck size={16} className="text-green-600" />
                Verified Tutor & Secure Platform
              </p>
              <p className="flex items-center justify-center gap-2">
                <CheckCircle size={16} className="text-green-600" />
                Demo Class Support Available
              </p>
              <p className="flex items-center justify-center gap-2">
                <Headphones size={16} className="text-green-600" />
                Parent Support Team Assistance
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}
          <div className="lg:col-span-2 space-y-8">

            {/* ABOUT */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-md p-6"
            >
              <h2 className="text-xl font-semibold mb-2">About Tutor</h2>
              <p className="text-gray-700 leading-relaxed">{tutor.bio}</p>
            </motion.section>

            {/* DETAILS */}
           {/* DETAILS */}
<section className="bg-white rounded-3xl shadow-md p-6">
  <h2 className="text-xl font-semibold mb-6">Tutor Details</h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-gray-700">

    <div className="flex items-center gap-2">
      <BookOpen size={16} className="text-indigo-600" />
      <span className="font-medium">Subjects:</span>
      <span>{tutor.subjects?.join(", ") || "Not specified"}</span>
    </div>

    <div className="flex items-center gap-2">
      <Languages size={16} className="text-indigo-600" />
      <span className="font-medium">Languages:</span>
      <span>{tutor.languages?.join(", ") || "Not specified"}</span>
    </div>

    <div className="flex items-center gap-2">
      <Clock size={16} className="text-indigo-600" />
      <span className="font-medium">Experience:</span>
      <span>{tutor.yearsOfExperience}+ years</span>
    </div>

    <div className="flex items-center gap-2">
      <GraduationCap size={16} className="text-indigo-600" />
      <span className="font-medium">Qualification:</span>
      <span>{tutor.qualification || "Not specified"}</span>
    </div>

    <div className="flex items-center gap-2">
      <GraduationCap size={16} className="text-indigo-600" />
      <span className="font-medium">College:</span>
      <span>{tutor.college || "Not specified"}</span>
    </div>

    <div className="flex items-center gap-2">
      <Users size={16} className="text-indigo-600" />
      <span className="font-medium">Classes:</span>
      <span>{tutor.classesTaught?.join(", ") || "Not specified"}</span>
    </div>

    <div className="flex items-center gap-2">
      <Monitor size={16} className="text-indigo-600" />
      <span className="font-medium">Teaching Mode:</span>
      <span>{tutor.teachingMode || "Not specified"}</span>
    </div>

    <div className="flex items-center gap-2">
      <CalendarDays size={16} className="text-indigo-600" />
      <span className="font-medium">Availability:</span>
      <span>
        {Array.isArray(tutor.availability)
          ? tutor.availability.join(", ")
          : tutor.availability || "Not specified"}
      </span>
    </div>

  </div>
</section>


            {/* 📅 AVAILABILITY CALENDAR */}
            <section className="bg-white rounded-3xl shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CalendarDays /> Weekly Availability
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {weekDays.map(day => {
                  const isAvailable =
                    tutor.availability?.includes(day);

                  return (
                    <div
                      key={day}
                      className={`p-3 rounded-xl text-center text-sm font-medium
                        ${
                          isAvailable
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-gray-100 text-gray-400"
                        }`}
                    >
                      {day}
                      <div className="text-xs mt-1">
                        {isAvailable ? "Available" : "Not Available"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Availability is subject to change. Please book a demo to confirm
                preferred time slots.
              </p>
            </section>
          </div>
        </div>
      </main>
      {showDemoModal && (
  <DemoRequestModal
    tutorId={tutor._id}
    subjects={tutor.subjects || []}
    onClose={() => setShowDemoModal(false)}
  />
)}

{/* ⭐ REVIEWS SECTION */}
<section className="bg-white rounded-3xl shadow-md p-6 space-y-6">
  <h2 className="text-xl font-semibold flex items-center gap-2">
    <Star className="text-yellow-500 fill-yellow-400" />
    Parent Reviews
  </h2>

  {/* ADD REVIEW FORM (Parent only – backend guard bhi hai) */}
  {/* <AddTutorReview tutorId={tutor._id} /> */}

  {/* Reviews List */}
  {reviewsLoading ? (
    <p className="text-sm text-gray-500">Loading reviews...</p>
  ) : reviews.length === 0 ? (
    <p className="text-sm text-gray-500">
      No reviews yet. Be the first to review this tutor.
    </p>
  ) : (
  <div className="space-y-4">
  {reviews.map((r) => (
    <div
      key={r._id}
      className="border rounded-xl p-4 bg-gray-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* 👤 Parent Image */}
          <img
            src={resolveUserImage(r.parent?.profileImage)}
            alt={r.parent?.fullName || "Parent"}
            className="w-10 h-10 rounded-full object-cover border"
          />

          <div>
            <p className="font-semibold text-sm">
              {r.parent?.fullName || "Parent"}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(r.createdAt).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>

        {/* ⭐ Rating */}
        <div className="text-yellow-500 text-sm">
          {"★".repeat(r.rating)}
          {"☆".repeat(5 - r.rating)}
        </div>
      </div>

      <p className="mt-2 text-gray-700 italic">
        “{r.comment}”
      </p>
    </div>
  ))}
</div>

  )}
</section>


      <Footer />
    </>
  );
}

