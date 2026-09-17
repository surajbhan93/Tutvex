"use client";

import React, { useEffect, useMemo, useState } from "react";
import apiClient from "@/lib/apiClient";
import StudentCard, { StudentCardData } from "./StudentCard";
import { Users, UserCheck, UserX, Search } from "lucide-react";

/* ======================
   API TYPE
====================== */
interface ApiItem {
  studentId: string;
  student: {
    full_name: string;
    class: string;
    board: string;
    institution_name: string;
    subjects: string[];
    isActive?: boolean; // 🔹 future proof
  };
  parent: {
    fullName: string;
  };
  location: string;
  urgency: string;
  assignedAt: string;
}

type StudentFilter = "total" | "active" | "inactive";

/* ======================
   STAT CARD
====================== */
const StatCard = ({
  title,
  value,
  icon: Icon,
  isActive,
  onClick,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`rounded-xl p-6 text-left shadow-sm transition-all
      ${
        isActive
          ? "border-2 border-blue-500 bg-blue-50"
          : "border bg-white hover:border-gray-300"
      }`}
  >
    <div className="flex items-center justify-between">
      <h3 className="text-gray-500">{title}</h3>
      <Icon
        className={`size-6 ${
          isActive ? "text-blue-600" : "text-gray-400"
        }`}
      />
    </div>
    <p className="mt-4 text-3xl font-bold text-gray-800">
      {value}
    </p>
  </button>
);

/* ======================
   PAGE
====================== */
const MyStudentsPage = () => {
  const [items, setItems] = useState<ApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<StudentFilter>("total");

  /* ======================
     FETCH API
  ====================== */
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await apiClient.get("/auth/tutor/my-student");
        setItems(res.data?.data || []);
      } catch (err) {
        console.error("Failed to fetch students", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  /* ======================
     MAP API → CARD DATA
  ====================== */
  const studentCards: StudentCardData[] = useMemo(() => {
    return items.map((item) => ({
      id: item.studentId,
      studentName: item.student.full_name,
      classGrade: item.student.class,
      board: item.student.board,
      institution_name: item.student.institution_name,
      parentName: item.parent.fullName,
      location: item.location,
      urgency: item.urgency,
      assignedAt: item.assignedAt,
      isActive: item.student.isActive ?? true, // default active
    }));
  }, [items]);

  /* ======================
     FILTER + SEARCH
  ====================== */
  const filteredStudents = useMemo(() => {
    return studentCards.filter((student) => {
      // 🔍 Search
      const matchSearch = student.studentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      // 🟢 Filter
      const matchFilter =
        activeFilter === "total"
          ? true
          : activeFilter === "active"
          ? student.isActive
          : !student.isActive;

      return matchSearch && matchFilter;
    });
  }, [studentCards, searchQuery, activeFilter]);

  /* ======================
     STATS
  ====================== */
  const totalCount = studentCards.length;
  const activeCount = studentCards.filter(
    (s) => s.isActive
  ).length;
  const inactiveCount = totalCount - activeCount;

  return (
    <div className="flex flex-col gap-8">
      
      <div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow">
  <h1 className="text-xl font-bold">
    My Students
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    View and manage your assigned students, track their progress,
    and stay connected for effective learning.
  </p>
  </div>
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          My Students
        </h1>
        <p className="mt-1 text-gray-500">
          Students assigned to you by admin.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="Total Students"
          value={totalCount}
          icon={Users}
          isActive={activeFilter === "total"}
          onClick={() => setActiveFilter("total")}
        />
        <StatCard
          title="Active"
          value={activeCount}
          icon={UserCheck}
          isActive={activeFilter === "active"}
          onClick={() => setActiveFilter("active")}
        />
        <StatCard
          title="Inactive"
          value={inactiveCount}
          icon={UserX}
          isActive={activeFilter === "inactive"}
          onClick={() => setActiveFilter("inactive")}
        />
      </div>

      {/* SEARCH */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by student name..."
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          className="w-full rounded-lg border bg-white py-2 pl-10 pr-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* GRID */}
      {loading ? (
        <p>Loading students...</p>
      ) : filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed bg-gray-50 py-12 text-center text-gray-500">
          No students found.
        </div>
      )}
    </div>
  );
};

export default MyStudentsPage;
