import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  GraduationCap,
  Award,
  CheckCircle,
  Star,
  Users,
  Headphones,
  FileCheck,
  BadgeCheck,
} from "lucide-react";

interface TrustSignal {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconColor: string;
  bgColor: string;
}

interface TrustSignalsProps {
  responseTime?: string;
  experience?: number;
  customSignals?: TrustSignal[];
}

export default function TrustSignals({
  responseTime = "1 Hour",
  experience,
  customSignals,
}: TrustSignalsProps) {
  const defaultSignals: TrustSignal[] = [
    {
      icon: <ShieldCheck size={28} />,
      title: "Verified Tutor",
      description: "Background verified & platform certified",
      iconColor: "text-emerald-600",
      bgColor: "from-emerald-50 to-green-50",
    },
    {
      icon: <Clock size={28} />,
      title: `Responds Within ${responseTime}`,
      description: "Quick response to your queries & bookings",
      iconColor: "text-blue-600",
      bgColor: "from-blue-50 to-cyan-50",
    },
    {
      icon: <GraduationCap size={28} />,
      title: "Free Demo Class",
      description: "Try before you commit - no payment required",
      iconColor: "text-purple-600",
      bgColor: "from-purple-50 to-pink-50",
    },
    {
      icon: <Award size={28} />,
      title: `${experience || "5"}+ Years Experience`,
      description: "Proven track record of student success",
      iconColor: "text-amber-600",
      bgColor: "from-amber-50 to-orange-50",
    },
  ];

  const signals = customSignals || defaultSignals;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <BadgeCheck size={16} />
            <span>Trusted by Parents & Students</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Why Choose This Tutor?
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Quality assured with verified credentials and commitment to student success
          </p>
        </motion.div>

        {/* Trust Signals Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {signals.map((signal, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="group"
            >
              <div className={`relative h-full bg-gradient-to-br ${signal.bgColor} rounded-2xl p-6 border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden`}>
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />

                {/* Icon */}
                <div className="relative mb-4">
                  <div className={`${signal.iconColor} transform group-hover:scale-110 transition-transform duration-300`}>
                    {signal.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {signal.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {signal.description}
                  </p>
                </div>

                {/* Check mark indicator */}
                <div className="absolute top-4 right-4">
                  <CheckCircle
                    size={20}
                    className="text-emerald-500 opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Trust Elements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          {/* Parent Support */}
          <div className="flex items-center gap-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-5 border border-indigo-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <Headphones size={22} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Parent Support
              </h4>
              <p className="text-xs text-gray-600">
                24/7 assistance available
              </p>
            </div>
          </div>

          {/* Verified Documents */}
          <div className="flex items-center gap-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <FileCheck size={22} className="text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Verified Documents
              </h4>
              <p className="text-xs text-gray-600">
                Credentials verified
              </p>
            </div>
          </div>

          {/* Quality Assured */}
          <div className="flex items-center gap-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
              <Star size={22} className="text-white" fill="white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">
                Quality Assured
              </h4>
              <p className="text-xs text-gray-600">
                Tutvex certified tutor
              </p>
            </div>
          </div>
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-full px-8 py-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2">
              <Users size={20} className="text-indigo-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Trusted by</p>
                <p className="text-sm font-bold text-gray-900">1000+ Parents</p>
              </div>
            </div>

            <div className="w-px h-10 bg-gray-300" />

            <div className="flex items-center gap-2">
              <Star size={20} className="text-amber-500" fill="#F59E0B" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Average Rating</p>
                <p className="text-sm font-bold text-gray-900">4.8 / 5.0</p>
              </div>
            </div>

            <div className="w-px h-10 bg-gray-300" />

            <div className="flex items-center gap-2">
              <Award size={20} className="text-purple-600" />
              <div className="text-left">
                <p className="text-xs text-gray-500">Platform</p>
                <p className="text-sm font-bold text-gray-900">Top Rated</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
