"use client";

import { Globe, Video, TrendingUp, Users, MapPin } from "lucide-react";
import Image from "next/image";
import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { Variants } from "framer-motion";
type StatItem = {
  value: number;
  unit: string;
  description: string;
  highlight?: boolean;
  iconName: "MapPin" | "Globe" | "Users" | "TrendingUp";
  color: string;
  bg: string;
  iconBg: string;
  iconColor: string;
};

const statsData: StatItem[] = [
  {
    value: 2800, unit: "tutors", description: "in Allahabad",
    iconName: "MapPin", color: "from-violet-500 to-purple-600",
    bg: "bg-violet-50", iconBg: "bg-violet-100", iconColor: "text-violet-600",
  },
  {
    value: 1000, unit: "tutors", description: "in Lucknow",
    iconName: "MapPin", color: "from-blue-500 to-cyan-600",
    bg: "bg-blue-50", iconBg: "bg-blue-100", iconColor: "text-blue-600",
  },
  {
    value: 11500, unit: "tutors", description: "across other regions",
    iconName: "Globe", color: "from-sky-500 to-blue-600",
    bg: "bg-sky-50", iconBg: "bg-sky-100", iconColor: "text-sky-600",
  },
  {
    value: 4000, unit: "students", description: "taught in last 2 years",
    iconName: "Users", color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50", iconBg: "bg-emerald-100", iconColor: "text-emerald-600",
  },
  {
    value: 2800, unit: "students", description: "scored 99% & above",
    highlight: true, iconName: "TrendingUp", color: "from-orange-500 to-amber-500",
    bg: "bg-orange-50", iconBg: "bg-orange-100", iconColor: "text-orange-600",
  },
  {
    value: 2300, unit: "students", description: "scored 98% & above",
    highlight: true, iconName: "TrendingUp", color: "from-rose-500 to-pink-600",
    bg: "bg-rose-50", iconBg: "bg-rose-100", iconColor: "text-rose-600",
  },
  {
    value: 1500, unit: "students", description: "scored 90% & above",
    iconName: "TrendingUp", color: "from-indigo-500 to-violet-600",
    bg: "bg-indigo-50", iconBg: "bg-indigo-100", iconColor: "text-indigo-600",
  },
];

const IconComponent = ({ name }: { name: StatItem["iconName"] }) => {
  const icons = {
    MapPin: <MapPin className="h-4 w-4" />,
    Globe: <Globe className="h-4 w-4" />,
    Users: <Users className="h-4 w-4" />,
    TrendingUp: <TrendingUp className="h-4 w-4" />,
  };
  return <>{icons[name]}</>;
};

const avatarsData = [
  { src: "/images/avatars/avatar-1.jpg", className: "top-8 left-10 h-12 w-12" },
  { src: "/images/avatars/avatar-2.jpg", className: "top-1/3 right-10 h-16 w-16" },
  { src: "/images/avatars/avatar-3.jpg", className: "bottom-20 left-1/3 h-10 w-10" },
  { src: "/images/avatars/avatar-4.jpg", className: "bottom-10 right-1/4 h-14 w-14" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const itemVariant: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
    scale: 0.95,
  },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: "easeOut",
    },
  },
};

const OurImpact = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="relative overflow-hidden py-12">
      {/* ── Background ── */}
      <div className="absolute inset-0 bg-[#f8f9ff]" />
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#4f46e5 1px,transparent 1px),linear-gradient(90deg,#4f46e5 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none absolute -top-32 right-0 h-[500px] w-[500px] rounded-full bg-indigo-400/20 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 left-0 h-[500px] w-[500px] rounded-full bg-purple-400/20 blur-[100px]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          className="mb-14 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-4 py-1.5 text-sm font-semibold text-indigo-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
            Trusted Across India
          </span>

          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
            Our{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
                Impact
              </span>
              <span className="absolute -bottom-1 left-0 h-3 w-full rounded-full bg-indigo-100 opacity-60" />
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            Making education affordable, accessible, and effective across every corner of India
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-14 lg:grid-cols-2">
          {/* ── LEFT: Stats ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              variants={container}
              initial="hidden"
              animate={inView ? "show" : "hidden"}
              className="grid grid-cols-1 gap-4 sm:grid-cols-2"
            >
              {statsData.map((stat) => (
                <motion.div
                  key={stat.description}
                  variants={itemVariant}
                  whileHover={{ y: -4, scale: 1.02 }}
                  className={`group relative overflow-hidden rounded-2xl border border-white/80 ${stat.bg} p-5 shadow-md shadow-gray-200/60 transition-shadow hover:shadow-xl`}
                >
                  {/* Top accent bar */}
                  <div className={`absolute left-0 top-0 h-1 w-full rounded-t-2xl bg-gradient-to-r ${stat.color}`} />

                  {/* Icon */}
                  <div className={`mb-3 inline-flex items-center justify-center rounded-xl p-2 ${stat.iconBg} ${stat.iconColor}`}>
                    <IconComponent name={stat.iconName} />
                  </div>

                  {/* Count */}
                  <p className="text-3xl font-black tracking-tight text-gray-900">
                    {inView ? (
                      <>
                        <CountUp end={stat.value} duration={2.2} separator="," />
                        <span className="ml-1 text-lg font-semibold text-gray-400">{stat.unit}</span>
                      </>
                    ) : (
                      <Skeleton width={130} height={34} />
                    )}
                  </p>

                  {/* Description */}
                  <p
                    className={`mt-1 text-sm font-medium ${
                      stat.highlight
                        ? `bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`
                        : "text-gray-500"
                    }`}
                  >
                    {stat.description}
                  </p>

                  {/* Decorative blob */}
                  <div className={`pointer-events-none absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br ${stat.color} opacity-10 blur-lg`} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Map + Floaters ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="relative hidden min-h-[480px] lg:block"
          >
            {/* Frosted card */}
            <div className="absolute inset-6 rounded-3xl border border-white/60 bg-white/50 shadow-2xl backdrop-blur-sm" />

            {/* Map */}
            <div className="absolute inset-0">
              <Image
                src="/images/india-map-dotted-blue.png"
                alt="India Map"
                fill
                className="object-contain opacity-25 saturate-[1.3]"
              />
            </div>

            {/* Floating: Videos */}
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="absolute left-[15%] top-[18%] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-blue-100/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-200">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Short animated</p>
                <p className="text-xs text-gray-500">videos for concepts</p>
              </div>
            </motion.div>

            {/* Floating: Tutvex */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-[28%] right-[15%] flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-xl shadow-indigo-100/60"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-200">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">Tutvex</p>
                <p className="text-xs text-gray-500">Pan India Network</p>
              </div>
            </motion.div>

            {/* Floating: Students pill */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-[15%] left-[18%] rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 px-4 py-2 shadow-lg shadow-emerald-200/60"
            >
              <p className="text-xs font-bold text-white">4000+ Students Taught</p>
            </motion.div>

            {/* Avatars */}
            {avatarsData.map((avatar, i) => (
              <motion.div
                key={avatar.src}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 5 + i, ease: "easeInOut", delay: i * 0.4 }}
                className={`absolute ${avatar.className}`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-full border-[3px] border-white shadow-lg">
                  <Image src={avatar.src} alt="Student" fill className="rounded-full object-cover" />
                </div>
              </motion.div>
            ))}

            {/* Dot grids */}
            <div className="absolute right-6 top-6 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-indigo-200" />
              ))}
            </div>
            <div className="absolute bottom-6 left-6 grid grid-cols-4 gap-1.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-1.5 w-1.5 rounded-full bg-purple-200" />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurImpact;