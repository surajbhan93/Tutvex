import { motion } from "framer-motion";
import { Star, Users, IndianRupee } from "lucide-react";

interface Props {
  tutor: any;
  onOpenProfile: () => void;
}

export default function TutorPremiumCard({ tutor, onOpenProfile }: Props) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="
        relative rounded-3xl overflow-hidden
        bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-cyan-500/10
        backdrop-blur-xl border border-white/20
        shadow-[0_20px_50px_rgba(99,102,241,0.15)]
        transition-all
      "
    >
      {/* Gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 opacity-0 hover:opacity-100 transition" />

      <div className="relative p-6 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <img
            src={`https://avatar.vercel.sh/${tutor.email}`}
            className="h-16 w-16 rounded-2xl ring-2 ring-indigo-400 object-cover"
          />

          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {tutor.fullName}
            </h3>
            <p className="text-sm text-gray-500">
              {tutor.subjects?.join(", ")}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Star className="text-yellow-500 fill-yellow-400" size={16} />
            {tutor.rating || 4.8}
          </span>

          <span className="flex items-center gap-1">
            <Users size={16} />
            {tutor.totalStudents || 0} students
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-1 text-xl font-bold text-indigo-600">
          <IndianRupee size={18} />
          {tutor.price}/month
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onOpenProfile}
          className="
            w-full py-3 rounded-xl font-semibold text-white
            bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-600
            hover:opacity-90 transition
            shadow-lg
          "
        >
          Check Complete Tutor Profile
        </motion.button>
      </div>
    </motion.div>
  );
}
