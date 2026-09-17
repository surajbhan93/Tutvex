"use client";

import { motion } from "framer-motion";
import { GraduationCap, Users, School } from "lucide-react";

export default function DashboardTopHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-5 text-white shadow-md"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-lg font-bold tracking-wide">
            Assignment Submission Guidelines
          </h2>
          <p className="mt-1 max-w-xl text-sm text-blue-100">
            Complete your assignment honestly. Do not cheat. 
            Write the assignment properly, take clear screenshots or photos,
            convert them into a single PDF file, and upload it here.
          </p>
        </div>

        {/* RIGHT TAGS */}
        <div className="flex flex-wrap gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
            <School className="h-4 w-4" />
            Institution
          </span>

          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
            <GraduationCap className="h-4 w-4" />
            Student Responsibility
          </span>

          <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1">
            <Users className="h-4 w-4" />
            Parent Supervision
          </span>
        </div>
      </div>
    </motion.div>
  );
}
