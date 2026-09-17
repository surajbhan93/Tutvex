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
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import api from "@/lib/apiClient";
import { resolveImage } from "@/lib/resolveImage";

/* ======================
   NAV LINKS
====================== */
const navLinks = [
  { href: "/tutor/dashboard", label: "Dashboard", icon: Home },
  { href: "/tutor/students", label: "My Students", icon: Users },
  { href: "/tutor/schedule", label: "Schedule & Availability", icon: Calendar },
  { href: "/tutor/library", label: "Content Library", icon: Library },
  { href: "/tutor/assign-assignments", label: "Assign Assignment", icon: ClipboardCheck },
  { href: "/tutor/assign-quiz", label: "Assign Quiz", icon: ClipboardCheck },
  { href: "/tutor/submissions", label: "Submissions", icon: ClipboardList },
  { href: "/tutor/find-student", label: "Find a Student", icon: Search },
  { href: "/tutor/earnings", label: "Earnings", icon: DollarSign },
];

type TutorMiniProfile = {
  fullName: string;
  profileImage?: string;
};

// const BACKEND_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// const resolveImage = (path?: string) => {
//   if (!path) return "/images/default-avatar.png";
//   if (path.startsWith("http")) return path;
//   return `${BACKEND_URL}${path}`;
// };

export default function Sidebar() {
  const router = useRouter();

  const [tutor, setTutor] = useState<TutorMiniProfile | null>(null);
  const [open, setOpen] = useState(false);        // mobile drawer
  const [collapsed, setCollapsed] = useState(false); // desktop mini mode

  /* ======================
     FETCH PROFILE
  ====================== */
  useEffect(() => {
    const fetchTutor = async () => {
      const res = await api.get("/tutor/me");
      setTutor(res.data.data);
    };
    fetchTutor();
  }, []);

  
  /* ======================
     SWIPE (MOBILE ONLY)
  ====================== */
  useEffect(() => {
    let startX = 0;

    const onTouchStart = (e: any) => {
      startX = e.touches[0].clientX;
    };

    const onTouchEnd = (e: any) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (diff > 80) setOpen(true);
      if (diff < -80) setOpen(false);
    };

    document.addEventListener("touchstart", onTouchStart);
    document.addEventListener("touchend", onTouchEnd);

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
    };
  }, []);




// DEBUG (temporary)

  return (
    <>
      {/* ======================
         MOBILE TOP BAR
      ====================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50
        flex items-center justify-between px-4 py-3 border-b bg-white">
        <button onClick={() => setOpen(true)}>
          <Menu className="h-6 w-6 text-slate-700" />
        </button>

        {/* only indicator line */}
        <div className="h-1 w-10 rounded bg-indigo-600 mx-auto" />
      </div>

      {/* ======================
         MOBILE OVERLAY
      ====================== */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
        />
      )}

      {/* ======================
         SIDEBAR
      ====================== */}
      <aside
        className={`
          fixed md:static
          left-0 top-12 bottom-0 md:top-0
          z-40 bg-white border-r shadow-sm
          transition-all duration-300 ease-in-out

          w-64
          ${collapsed ? "md:w-20" : "md:w-64"}

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* DESKTOP collapse toggle ONLY */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-3 top-6
          h-6 w-6 items-center justify-center
          rounded-full border bg-white shadow"
        >
          {collapsed ? "➤" : "◀"}
        </button>

        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-600 p-5 text-white">
            {!collapsed && (
              <>
                <h1 className="text-lg font-bold hidden md:block">
                  Tutor Dashboard
                </h1>
                <p className="text-xs text-indigo-100 hidden md:block">
                  Teaching • Assignments • Quizzes
                </p>
              </>
            )}

            <button onClick={() => setOpen(false)} className="md:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-1 flex-col p-4">
            {/* PROFILE */}
            <Link
              href="/tutor/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl border p-3 hover:bg-slate-50"
            >
              {/* <Image
                src={resolveImage(tutor?.profileImage)}
                width={44}
                height={44}
                className="rounded-full border"
                alt="Tutor"
              /> */}
                <Image
                src={resolveImage(tutor?.profileImage)}
                width={44}
                height={44}
                className="rounded-full border"
                alt="Tutor"
              />
              <div className={collapsed ? "hidden md:block md:hidden" : "block"}>
                <p className="text-sm font-semibold">
                  {tutor?.fullName || "Loading..."}
                </p>
                <p className="text-xs text-slate-500">View Profile</p>
              </div>
            </Link>

            {/* NAV */}
            <nav className="mt-6 flex-1 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = router.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5
                    text-sm font-medium transition
                    ${
                      active
                        ? "bg-indigo-50 text-indigo-600"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className={collapsed ? "hidden md:block md:hidden" : "inline"}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* LOGOUT */}
            <Link
              href="/tutor/logout"
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2.5
              text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="h-5 w-5" />
              <span className={collapsed ? "hidden md:block md:hidden" : "inline"}>
                Logout
              </span>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
