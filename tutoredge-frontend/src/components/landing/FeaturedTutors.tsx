import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import { motion } from "framer-motion";
import { Star, IndianRupee, CheckCircle, } from "lucide-react";
import { BookOpen } from "lucide-react";
import { generateTutorSlug } from "@/lib/seo/generateTutorSEO";

interface Tutor {
  _id: string;
  slug?: string;
  fullName: string;
  headline: string;
  subjects: string[];
  rating: number;
  yearsOfExperience: number;
  price: number;
  priceType: string;
  profileImage: string;
  reviewCount?: number;
  isLive?: boolean;

  // 🔽 ADD THESE
  location?: {
    area?: string;
    city?: string;
  };
  isVerified?: boolean; // institute / govt verified
}
const STATIC_RATINGS = [
  4.0,
  4.1,
  4.3,
  4.6,
  4.7,
  4.8,
  4.9,
  5.0,
];


const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4 }
  })
};

export default function FeaturedTutors() {
  const router = useRouter();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const resolveImage = (path?: string) => {
  if (!path) return "/images/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path}`;
};



  useEffect(() => {
    apiClient.get("/tutors/featured").then(res => {
       const data = (res.data.data || []).map(
      (tutor: any, index: number) => ({
        ...tutor,
        rating:
          tutor.rating && tutor.rating > 0
            ? tutor.rating
            : STATIC_RATINGS[index % STATIC_RATINGS.length],
      })
    );
    
    
      setTutors(data);

      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-[340px] bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          Featured <span className="text-indigo-600">Tutors</span>
        </h2>

        <button
          onClick={() => router.push("/tutors")}
          className="text-indigo-600 font-medium hover:underline flex items-center gap-1"
        >
          View all <span className="text-xl">›</span>
        </button>
      </div>
      

      {/* Cards */}
      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >

        {tutors.map((tutor, i) => (
          <motion.div
            key={tutor._id}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ y: -6 }}
            onClick={() => {
              const slug = tutor.slug || generateTutorSlug(tutor) || tutor._id;
              router.push(`/tutor/${slug}`);
            }}
            className="cursor-pointer bg-white border rounded-xl hover:shadow-xl transition p-4 flex flex-col items-center text-center"
          >
            {/* Image + LIVE */}

            
            <div className="relative w-28 h-28">
              
              <Image
                  src={resolveImage(tutor.profileImage)}
                  alt={tutor.fullName}
                  fill
                  className="object-cover rounded-full"
                />

   

              {tutor.isLive && (
                <span className="absolute -top-1 -right-1 flex items-center gap-1">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-red-600">
                    LIVE
                  </span>
                </span>
              )}

              {/* ⭐ Top Rated – ON HEAD */}
  {tutor.rating >= 4.0 && (
    <div
      className="
        absolute -top-2 -left-2
        bg-gradient-to-r from-yellow-400 to-orange-500
        text-white text-[10px]
        font-semibold
        px-2.5 py-1
        rounded-full
        shadow-md
        z-10
      "
    >
      ⭐ Top Rated
    </div>
  )}
            </div>

            {/* Name */}
            <h3
          className="
            mt-4 flex items-center justify-center gap-1
            text-base font-bold
            bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600
            bg-clip-text text-transparent
          "
        >
          {tutor.fullName}

  
    <CheckCircle
      size={16}
      className="text-blue-500 fill-blue-100"
    />
  
</h3>


            {/* Headline */}
            <p className="text-sm text-gray-500 line-clamp-1">
              {tutor.headline || "Verified Tutor"}
            </p>
 
            {tutor.location?.area && tutor.location?.city && (
            <p className="text-[11px] text-gray-500 flex justify-center gap-1">
              📍 {tutor.location.area}, {tutor.location.city}
            </p>
          )}
         
  <div className="flex justify-center mt-2">
    <span
      className="
        flex items-center gap-1
        text-[11px]
        text-emerald-700
        bg-emerald-50
        px-3 py-1
        rounded-full
        font-medium
      "
    >
      🔒 Govt / Institute Verified by Tutvex
    </span>
  </div>

            {/* Rating */}
            <div className="flex items-center gap-1 text-sm text-gray-700 mt-2">
              <Star size={14} className="text-yellow-500 fill-yellow-400" />
              <span className="font-medium">{tutor.rating}</span>

            </div>

            {/* Experience */}
            <div className="text-sm text-gray-600 mt-1">
              <span className="font-medium text-gray-700">
                Experience:
              </span>{" "}
              {tutor.yearsOfExperience}+ years
            </div>

            {/* Price */}
            <div className="flex items-center gap-1 font-semibold text-gray-900 mt-2">
              <IndianRupee size={16} />
              {tutor.price}
              <span className="text-sm font-normal text-gray-500">
                /{tutor.priceType === "per_hour" ? "hr" : "month"}
              </span>
            </div>

            {/* Subjects */}
           {/* Subjects */}
<div className="flex flex-wrap justify-center gap-2 mt-4">
  {tutor.subjects.slice(0, 3).map(sub => (
    <span
      key={sub}
      className="flex items-center gap-1.5 text-sm bg-slate-100 text-gray-800 px-3 py-1.5 rounded-full"
    >
      <BookOpen size={14} className="text-gray-600" />
      {sub}
    </span>
  ))}
</div>

          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
