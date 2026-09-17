import { useState } from "react";
import apiClient from "@/lib/apiClient";
import { motion } from "framer-motion";

export default function AddTutorReview({ tutorId }: { tutorId: string }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!comment.trim()) {
      setMsg("❗ Please write a review");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post(`/tutors/${tutorId}/reviews`, {
        tutorId,
        rating,
        comment,
      });
      setMsg("✅ Review submitted successfully");
      setComment("");
      setRating(5);
    } catch (e: any) {
      setMsg(e?.response?.data?.error || "❌ Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="max-w-xl"
    >
      {/* Gradient Border */}
      <div className="p-[1px] rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        {/* Glass Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            ⭐ Rate this Tutor
          </h3>

          {/* Star Rating */}
          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                className={`
                  text-3xl transition-transform hover:scale-110
                  ${s <= rating ? "text-yellow-400" : "text-gray-300"}
                `}
              >
                ★
              </button>
            ))}
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            placeholder="Share your experience with this tutor..."
            className="
              w-full rounded-xl border border-gray-200
              px-4 py-3 resize-none
              focus:outline-none focus:ring-2 focus:ring-indigo-400
            "
          />

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="
              mt-4 w-full py-2.5 rounded-xl
              bg-gradient-to-r from-indigo-600 to-purple-600
              text-white font-semibold
              hover:from-indigo-700 hover:to-purple-700
              transition-all
              disabled:opacity-50
            "
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>

          {/* Message */}
          {msg && (
            <p className="text-sm mt-3 text-center text-gray-600">
              {msg}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
