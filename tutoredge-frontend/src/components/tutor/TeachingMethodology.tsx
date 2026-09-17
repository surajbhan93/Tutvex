import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  BarChart,
  Award,
  Clock,
} from "lucide-react";

interface MethodologyItem {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

interface TeachingMethodologyProps {
  customMethodology?: MethodologyItem[];
  tutorName?: string;
}

const defaultMethodology: MethodologyItem[] = [
  {
    icon: <Target size={24} />,
    title: "Concept-Based Learning",
    description: "Focus on building strong fundamentals with clear concept explanations and practical examples.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: <BarChart size={24} />,
    title: "Weekly Tests & Assessments",
    description: "Regular evaluations to track progress and identify areas needing improvement.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: <MessageSquare size={24} />,
    title: "Doubt Solving Sessions",
    description: "Dedicated time for clearing doubts and ensuring complete understanding of topics.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: <Lightbulb size={24} />,
    title: "Personalized Study Plan",
    description: "Customized learning paths based on student's strengths, weaknesses, and goals.",
    color: "from-amber-500 to-orange-600",
  },
  {
    icon: <BookOpen size={24} />,
    title: "Practice & Revision",
    description: "Comprehensive practice materials and structured revision sessions for better retention.",
    color: "from-rose-500 to-red-600",
  },
  {
    icon: <TrendingUp size={24} />,
    title: "Performance Tracking",
    description: "Regular progress reports and feedback to parents about student's academic growth.",
    color: "from-cyan-500 to-blue-600",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function TeachingMethodology({
  customMethodology,
  tutorName = "Our tutor",
}: TeachingMethodologyProps) {
  const methodology = customMethodology || defaultMethodology;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Award size={16} />
            <span>Proven Teaching Approach</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Teaching Methodology
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {tutorName} follows a structured and student-centric approach to ensure effective learning and academic excellence.
          </p>
        </motion.div>

        {/* Methodology Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {methodology.map((method, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="relative h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${method.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                {/* Icon */}
                <div className="relative mb-4">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${method.color} text-white shadow-lg transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    {method.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-300">
                    {method.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {method.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full transform translate-x-16 -translate-y-16 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                <CheckCircle size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">
                  Proven Results
                </p>
                <p className="text-lg font-bold text-gray-900">
                  95% Student Satisfaction Rate
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-12 bg-gray-300" />

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                <Clock size={24} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 font-medium">
                  Flexible Schedule
                </p>
                <p className="text-lg font-bold text-gray-900">
                  Classes At Your Convenience
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
