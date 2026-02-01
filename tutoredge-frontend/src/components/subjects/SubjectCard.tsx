import { useRouter } from "next/router";
import { useCallback, useMemo } from "react";
import { motion,Variants } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card } from "flowbite-react";

/* ======================
   UTILS
====================== */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\s+/g, "-");

/* ======================
   TYPES
====================== */
interface Props {
  subject: string;
  highlight?: boolean;
}

/* ======================
   ANIMATIONS
====================== */
const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
    },
  },
};

/* ======================
   COMPONENT
====================== */
export default function SubjectCard({ subject, highlight }: Props) {
  const router = useRouter();

  const subjectSlug = useMemo(() => slugify(subject), [subject]);

  const handleNavigation = useCallback(() => {
    router.push({
      pathname: "/find-tutor-flow",
      query: {
        subject: subjectSlug,
        board: "cbse",
        medium: "english",
      },
    });
  }, [router, subjectSlug]);

  return (
    <motion.article
      variants={cardVariants} 
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true }}
      onClick={handleNavigation}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleNavigation()}
      className="
        relative
        cursor-pointer
        rounded-3xl
        overflow-hidden
        focus:outline-none
        focus:ring-2
        focus:ring-indigo-500
      "
    >
      {/* Gradient Glow */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-indigo-500/20
          via-purple-500/20
          to-pink-500/20
          blur-2xl
          opacity-70
        "
      />

      {/* Card Body */}
      <Card
        className="
          relative
          h-full
          bg-white/80
          backdrop-blur-xl
          border-0
          shadow-xl
          rounded-3xl
        "
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="
                flex
                h-12
                w-12
                items-center
                justify-center
                rounded-xl
                bg-indigo-600
                text-white
                shadow-lg
              "
            >
              <BookOpen size={22} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {subject} Tutor
              </h3>
              <p className="text-sm text-gray-600">
                Expert & Verified
              </p>
            </div>
          </div>

          {highlight && (
            <span
              className="
                rounded-full
                bg-green-100
                px-3
                py-1
                text-xs
                font-semibold
                text-green-700
              "
            >
              Popular
            </span>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-4" />

        {/* Meta Info */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <GraduationCap size={16} className="text-indigo-600" />
            CBSE • ICSE • State Board
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 size={16} className="text-green-600" />
            English Medium • Background Verified
          </div>
        </div>

        {/* CTA */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="
            group
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-indigo-600
            to-purple-600
            px-5
            py-3
            text-sm
            font-semibold
            text-white
            shadow-md
            transition-all
            hover:shadow-lg
          "
        >
          View Tutors
          <ArrowRight
            size={16}
            className="
              transition-transform
              group-hover:translate-x-1
            "
          />
        </motion.button>
      </Card>
    </motion.article>
  );
}
