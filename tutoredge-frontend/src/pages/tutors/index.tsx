import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
// import { motion } from "framer-motion";
import { Star, Clock, BookOpen, IndianRupee } from "lucide-react";
import { motion, Variants } from "framer-motion";

import Footer from "@/components/landing/Footer";
import NavBar from "@/components/navbar/NavBar";
import TutorFilterPanel from "@/components/filters/TutorFilterPanel";
import { filterTutors } from "@/lib/filterTutor";

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.96,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.05,
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1], // ✅ correct easing
    },
  }),
};


export default function TutorsPage() {
  const router = useRouter();

  const [tutors, setTutors] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  /* 🔹 FILTER STATE (NEW) */
  const [filters, setFilters] = useState({
    subject: "",
    classLevel: "",
    board: "",
    location: "",
    price: 12000,
  });

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const resolveImage = (path?: string) => {
    if (!path) return "/images/default-avatar.png";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  /* 🔹 APPLY FILTER (NEW) */
  const filteredTutors = useMemo(() => {
    return filterTutors(tutors, filters);
  }, [tutors, filters]);

  /* 🔹 FETCH TUTORS */
  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/tutors?page=${page}&limit=12`)
      .then((res) => {
        setTutors(res.data.data || []);
        setTotal(res.data.pagination?.total || 0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <>
      <NavBar />

      <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-indigo-50 via-white to-sky-50">
        <div className="max-w-7xl mx-auto">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-bold mb-10 text-gray-800 text-center">
            Explore Expert Tutors
          </h1>

          {/* 🔹 FILTER PANEL (ADDED) */}
          <TutorFilterPanel filters={filters} onChange={setFilters} />

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse bg-white rounded-3xl h-[360px]"
                />
              ))}
            </div>
          )}

          {!loading && (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
            >
              {filteredTutors.map((tutor, i) => (
                <motion.div
                  key={tutor._id}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() =>
                    router.push(`/tutors/${tutor._id}`)
                  }
                  className="
                    cursor-pointer 
                    bg-white/80 backdrop-blur
                    border border-white/40
                    rounded-3xl 
                    shadow-md hover:shadow-2xl 
                    transition-all
                    overflow-hidden
                  "
                >
                  {/* Avatar */}
                  <div className="flex justify-center mt-6">
                    <div className="relative h-24 w-24 rounded-full ring-4 ring-indigo-100 overflow-hidden">
                      <Image
                        src={resolveImage(tutor.profileImage)}
                        alt={tutor.fullName}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center space-y-3">
                    <h3 className="font-bold text-lg text-gray-800">
                      {tutor.fullName}
                    </h3>

                    <p className="text-sm text-gray-500 line-clamp-2">
                      {tutor.headline || "Experienced Subject Expert"}
                    </p>

                    {/* Meta */}
                    <div className="flex justify-center gap-5 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Star
                          size={14}
                          className="text-yellow-500 fill-yellow-400"
                        />
                        {tutor.rating || 4.8}
                      </span>

                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {tutor.yearsOfExperience}+ yrs
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex justify-center items-center gap-1 text-indigo-600 font-semibold">
                      <IndianRupee size={16} />
                      {tutor.price}
                      <span className="text-xs text-gray-500">
                        /{tutor.priceType === "per_hour" ? "hr" : "month"}
                      </span>
                    </div>

                    {/* Subjects */}
                    <div className="flex flex-wrap justify-center gap-2 pt-2">
                      {tutor.subjects?.slice(0, 3).map((s: string) => (
                        <span
                          key={s}
                          className="
                            flex items-center gap-1 
                            text-xs 
                            bg-indigo-50 text-indigo-700 
                            px-3 py-1 rounded-full
                          "
                        >
                          <BookOpen size={12} />
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/tutors/${tutor._id}`);
                      }}
                      className="
                        mt-4 w-full py-2.5 rounded-xl
                        bg-indigo-600 text-white
                        font-medium text-sm
                        hover:bg-indigo-700
                        active:scale-95
                        transition
                      "
                    >
                      View Profile
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Pagination */}
          {total > 12 && (
            <div className="flex justify-center gap-6 mt-12">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="
                  px-6 py-2 rounded-full border bg-white
                  disabled:opacity-40 hover:bg-gray-50
                "
              >
                Prev
              </button>

              <button
                disabled={page * 12 >= total}
                onClick={() => setPage((p) => p + 1)}
                className="
                  px-6 py-2 rounded-full border bg-white
                  disabled:opacity-40 hover:bg-gray-50
                "
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
