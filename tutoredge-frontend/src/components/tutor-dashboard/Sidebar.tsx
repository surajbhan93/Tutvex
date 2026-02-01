"use client";

import {
  Calendar,
  DollarSign,
  Home,
  Library,
  Search,
  Users,
  LogOut,
  ClipboardCheck,
  ClipboardList,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/lib/apiClient";

/* ======================
   NAV LINKS
====================== */
const navLinks = [
  { href: "/tutor/dashboard", label: "Dashboard", icon: Home },
  { href: "/tutor/students", label: "My Students", icon: Users },
  {
    href: "/tutor/schedule",
    label: "Schedule & Availability",
    icon: Calendar,
  },
  { href: "/tutor/library", label: "Content Library", icon: Library },
 
  {
    href: "/tutor/assign-assignments",
    label: "Assign Assignment",
    icon: ClipboardCheck,
  },
  {
    href: "/tutor/assign-quiz",
    label: "Assign Quiz",
    icon: ClipboardCheck,
  },
  {
  href: "/tutor/submissions",
  label: "submissions",
  icon: ClipboardList,
},
   { href: "/tutor/find-student", label: "Find a Student", icon: Search },
  { href: "/tutor/earnings", label: "Earnings", icon: DollarSign },
];

type TutorMiniProfile = {
  fullName: string;
  profileImage?: string;
};

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const resolveImage = (path?: string) => {
  if (!path) return "/images/default-avatar.png";
  if (path.startsWith("http")) return path;
  return `${BACKEND_URL}${path}`;
};

export default function Sidebar() {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorMiniProfile | null>(null);

  useEffect(() => {
    const fetchTutor = async () => {
      const res = await api.get("/tutor/me");
      setTutor(res.data.data);
    };
    fetchTutor();
  }, []);

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white shadow-sm">
      {/* 🌈 HEADER */}
      <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-5 text-white">
        <h1 className="text-lg font-bold">Tutor Dashboard</h1>
        <p className="text-xs text-indigo-100">
          Teaching • Assignments • Quizzes
        </p>
      </div>

      <div className="flex flex-1 flex-col p-4">
        {/* 👤 PROFILE (PLAIN) */}
        <Link
          href="/tutor/profile"
          className="flex items-center gap-3 rounded-xl border p-3 hover:bg-slate-50 transition"
        >
          <Image
            src={resolveImage(tutor?.profileImage)}
            width={44}
            height={44}
            className="rounded-full border"
            alt="Tutor"
          />
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {tutor?.fullName || "Loading..."}
            </p>
            <p className="text-xs text-slate-500">
              View Profile
            </p>
          </div>
        </Link>

        {/* 🧭 NAVIGATION */}
        <nav className="mt-6 flex-1 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = router.pathname.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition
                ${
                  active
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {/* ACTIVE BAR */}
                {active && (
                  <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r bg-indigo-600" />
                )}

                <Icon
                  className={`h-5 w-5 ${
                    active ? "text-indigo-600" : "text-slate-400"
                  }`}
                />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* 🚪 LOGOUT */}
        <Link
          href="/tutor/logout"
          className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
          text-red-600 hover:bg-red-50 transition"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </Link>
      </div>
    </aside>
  );
}
