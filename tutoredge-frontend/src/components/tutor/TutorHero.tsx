import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  CheckCircle,
  GraduationCap,
  Phone,
  Calendar,
  MessageCircle,
  Sparkles,
  Star,
  Clock,
} from "lucide-react";
import { resolveImage } from "@/lib/resolveImage";

interface TutorHeroProps {
  name: string;
  profileImage?: string;
  headline?: string;
  subjects?: string[];
  classesTaught?: string[];
  qualification?: string;
  college?: string;
  bio?: string;
  city?: string;
  area?: string;
  state?: string;
  experience?: number;
  rating?: number;
  totalStudents?: number;
  isVerified?: boolean;
  onBookDemo: () => void;
  onWhatsApp?: () => void;
  onRequestCallback?: () => void;
}

export default function TutorHero({
  name,
  profileImage,
  headline,
  subjects = [],
  classesTaught = [],
  qualification,
  college,
  bio,
  city,
  area,
  experience,
  rating = 4.5,
  totalStudents = 0,
  isVerified = true,
  onBookDemo,
  onWhatsApp,
  onRequestCallback,
}: TutorHeroProps) {
  const location = [area, city].filter(Boolean).join(", ");
  const primarySubject = subjects[0] || "Academic";
  const isTopRated = rating >= 4.0;
  const hasExperience = typeof experience === "number" && experience > 0;

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/70 py-10 px-4 sm:px-6 lg:px-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left side - Tutor Info, About & Education (lg:col-span-8) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-8 text-left space-y-5"
          >
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {isVerified && (
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>Verified Tutor</span>
                </span>
              )}
              {isTopRated && (
                <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                  <Star size={13} fill="white" />
                  <span>Top Rated {rating}★</span>
                </span>
              )}
              <span className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">
                <Sparkles size={13} className="text-indigo-500" />
                <span>Tutvex Certified</span>
              </span>
            </div>

            {/* Name and Verification */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight flex items-center gap-2.5 flex-wrap">
                {name}
                {isVerified && (
                  <span
                    className="inline-flex items-center justify-center p-1 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md"
                    title="Verified Tutor"
                  >
                    <CheckCircle size={18} className="text-white" />
                  </span>
                )}
              </h1>

              {/* Headline / Subject & Location */}
              <h2 className="text-lg sm:text-xl text-indigo-600 font-bold mt-1">
                {headline || `${primarySubject} Tutor`}
                {location && ` in ${location}`}
              </h2>
            </div>

            {/* 🎓 EDUCATION & ABOUT SUMMARY BOX (LEFT SIDE) */}
            <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                
                {/* Qualification & College */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <GraduationCap size={20} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Education / Degree</span>
                    <p className="font-bold text-gray-900 leading-snug">{qualification || "Graduate Degree"}</p>
                    {college && <p className="text-xs text-indigo-600 font-medium mt-0.5">{college}</p>}
                  </div>
                </div>

                {/* Experience */}
                <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Experience</span>
                    <p className="font-bold text-gray-900 leading-snug">{hasExperience ? `${experience}+ Years Teaching` : "3+ Years Teaching"}</p>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5">Verified Experience</p>
                  </div>
                </div>

              </div>

              {/* About Excerpt */}
              {bio && (
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1">About Tutor</span>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {bio}
                  </p>
                </div>
              )}

              {/* Subjects & Classes Pills */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                {subjects.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-500">Subjects:</span>
                    {subjects.map((sub, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-semibold text-xs border border-indigo-100">
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
                {classesTaught.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-gray-500">Classes:</span>
                    {classesTaught.map((cls, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-700 font-semibold text-xs border border-purple-100">
                        {cls}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trust Signals Row */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle size={15} className="text-emerald-500" />
                <span>Verified Background</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Calendar size={15} className="text-indigo-500" />
                <span>Free Demo Available</span>
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <Clock size={15} className="text-blue-500" />
                <span>Fast Response</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onBookDemo}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-xl transition-all"
              >
                <Sparkles size={18} />
                Book Free Demo Class
              </motion.button>

              {onWhatsApp && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onWhatsApp}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all"
                >
                  <MessageCircle size={18} />
                  WhatsApp Tutor
                </motion.button>
              )}
            </div>

            {onRequestCallback && (
              <button
                onClick={onRequestCallback}
                className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 font-semibold text-xs transition-colors"
              >
                <Phone size={14} />
                Or request an instant callback
              </button>
            )}
          </motion.div>

          {/* Right side - COMPACT PROFILE IMAGE (lg:col-span-4) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-4 flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-[260px] sm:max-w-[280px]">
              {/* Decorative background glow */}
              <div className="absolute -top-3 -left-3 w-20 h-20 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-3xl opacity-20 transform rotate-6 pointer-events-none" />
              <div className="absolute -bottom-3 -right-3 w-24 h-24 bg-gradient-to-br from-pink-400 to-orange-500 rounded-3xl opacity-20 transform -rotate-12 pointer-events-none" />

              {/* Main Compact Image Container */}
              <div className="relative bg-gradient-to-br from-indigo-500 via-blue-600 to-purple-600 p-1 rounded-3xl shadow-xl">
                <div className="bg-white p-1.5 rounded-[22px] overflow-hidden">
                  <img
                    src={resolveImage(profileImage)}
                    alt={`${name} - ${primarySubject} Tutor`}
                    className="w-full h-[280px] sm:h-[300px] rounded-2xl object-cover object-center"
                  />
                </div>

                {/* Floating Verified Badge */}
                {isVerified && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-indigo-100 flex items-center gap-2 whitespace-nowrap"
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-sm">
                      <Award size={15} className="text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] text-gray-400 font-medium leading-none">Verified Tutor</p>
                      <p className="text-xs font-bold text-gray-900 leading-tight">Tutvex Partner</p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}
