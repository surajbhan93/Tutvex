import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";

// ✅ Proper login check (Zustand persist compatible)
const isUserLoggedIn = () => {
  if (typeof window === "undefined") return false;

  try {
    const raw = localStorage.getItem("auth-storage");
    if (!raw) return false;

    const parsed = JSON.parse(raw);
    return Boolean(parsed?.state?.isLoggedIn && parsed?.state?.token);
  } catch {
    return false;
  }
};

export default function AddTestimonialForm() {
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 🔒 LOGIN CHECK
    if (!isUserLoggedIn()) {
      setShowLoginModal(true);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await apiClient.post("/testimonials", {
        rating,
        message,
      });

      setSuccess(
        "✨ Thank you! Your testimonial has been submitted for review."
      );
      setMessage("");
      setRating(5);
    } catch (err: any) {
      setError(
        err?.response?.data?.error || "Failed to submit testimonial"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FORM */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto mt-20"
      >
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
          <div className="rounded-2xl bg-white/80 backdrop-blur-lg p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-800 text-center">
              🌟 Share Your Experience
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-3xl transition-transform hover:scale-110 ${
                        star <= rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-600">
                  Your Feedback
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                  placeholder="Tell us about your experience..."
                  className="
                    w-full rounded-xl border border-gray-200
                    px-4 py-3 resize-none
                    focus:outline-none focus:ring-2 focus:ring-indigo-400
                  "
                />
              </div>

              {/* Messages */}
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
              {success && (
                <p className="text-sm text-green-600">{success}</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="
                  w-full py-3 rounded-xl
                  bg-gradient-to-r from-indigo-600 to-purple-600
                  text-white font-semibold
                  hover:from-indigo-700 hover:to-purple-700
                  transition-all
                  disabled:opacity-50
                "
              >
                {loading ? "Submitting..." : "Submit Testimonial"}
              </button>
            </form>
          </div>
        </div>
      </motion.div>

      {/* 🔔 LOGIN REQUIRED MODAL */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-sm text-center"
            >
              <h4 className="text-lg font-bold text-gray-800 mb-2">
                Login Required
              </h4>
              <p className="text-sm text-gray-600 mb-6">
                Please login to the platform first, then give a testimonial.
              </p>

              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  onClick={() => router.push("/login")}
                  className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
