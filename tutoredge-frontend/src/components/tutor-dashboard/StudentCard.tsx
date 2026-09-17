"use client";

import { CircleUserRound, MapPin, Clock } from "lucide-react";
import React from "react";

/* ======================
   TYPES
====================== */
export interface StudentCardData {
  id: string;
  studentName: string;
  classGrade: string;
  board?: string;
  institution_name?: string;
  parentName: string;
  location: string;
  urgency: string;
  assignedAt: string;
  // 🔥 ADD THIS
  isActive: boolean;
}

/* ======================
   HELPERS
====================== */
const urgencyLabel = (urgency?: string) => {
  switch (urgency) {
    case "within_24_hours":
      return "Urgent (24h)";
    case "within_3_days":
      return "Within 3 Days";
    case "within_a_week":
      return "Within a Week";
    default:
      return "Not specified";
  }
};

/* ======================
   COMPONENT
====================== */
const StudentCard: React.FC<{ student: StudentCardData }> = ({
  student,
}) => {
  return (
    <div className="flex h-full flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <CircleUserRound className="size-12 text-gray-300" />
        <div>
          <p className="font-semibold text-gray-800">
            {student.studentName}
          </p>
          <p className="text-sm text-gray-500">
            Class {student.classGrade}
            {student.board && ` • ${student.board}`}
          </p>
        </div>
      </div>

      {/* SCHOOL */}
      {student.institution_name && (
        <p className="text-sm text-gray-600">
          🏫 {student.institution_name}
        </p>
      )}

      {/* META */}
      <div className="flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="size-4" />
          {student.location}
        </div>

        <div className="flex items-center gap-2">
          <Clock className="size-4" />
          {urgencyLabel(student.urgency)}
        </div>
      </div>

      {/* PARENT */}
      <div className="rounded-md bg-gray-50 px-3 py-2 text-sm">
        <b>Parent:</b> {student.parentName}
      </div>

      {/* FOOTER */}
      <div className="mt-auto text-xs text-gray-400">
        Assigned on{" "}
        {new Date(student.assignedAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default StudentCard;
