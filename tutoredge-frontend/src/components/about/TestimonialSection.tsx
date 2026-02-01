import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import AddTestimonialForm from "@/components/testimonials/AddTestimonialForm";
import { motion } from "framer-motion";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  image?: string;
  date: string;
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const resolveImage = (path?: string) => {
    if (!path) return "/images/default-avatar.png";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await apiClient.get("/testimonials");
        setTestimonials(res.data.data || []);
      } catch (err) {
        setError("Failed to load testimonials");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  return (
    <section
      id="testimonials"
      className="relative py-20 px-4 bg-gradient-to-br from-indigo-50 via-white to-purple-50"
    >
      {/* Section Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl font-extrabold text-center mb-12 text-gray-800"
      >
        💬 What Our Users Say
      </motion.h2>

      {loading && (
        <p className="text-center text-gray-500">
          Loading testimonials...
        </p>
      )}

      {!loading && error && (
        <p className="text-center text-red-500">{error}</p>
      )}

      {!loading && !error && testimonials.length === 0 && (
        <p className="text-center text-gray-500">
          No testimonials yet.
        </p>
      )}

      {/* Cards */}
      <div className="max-w-5xl mx-auto space-y-8">
        {testimonials.map((t, index) => (
          <motion.div
            key={t._id}
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative rounded-2xl p-[1px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            {/* Inner Card */}
            <div className="rounded-2xl bg-white/80 backdrop-blur-lg p-6 shadow-md hover:shadow-xl transition-shadow">
              {/* Header */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={resolveImage(t.image)}
                  alt={t.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-indigo-200"
                />

                <div>
                  <p className="font-semibold text-gray-800">
                    {t.name}
                  </p>
                  <p className="text-sm text-gray-500 capitalize">
                    {t.role}
                  </p>
                </div>

                <div className="ml-auto text-xs text-gray-400">
                  {new Date(t.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-700 italic leading-relaxed">
                “{t.message}”
              </p>

              {/* Rating */}
              <div className="mt-3 text-yellow-500 text-lg">
                {"★".repeat(t.rating)}
                <span className="text-gray-300">
                  {"☆".repeat(5 - t.rating)}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Form */}
      <div className="mt-16">
        <AddTestimonialForm />
      </div>
    </section>
  );
}
