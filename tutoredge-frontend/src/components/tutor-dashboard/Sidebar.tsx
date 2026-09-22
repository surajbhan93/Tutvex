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
  Target,
  Zap,
  FileCheck,
  Sparkles,
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
  { 
    href: "/tutor/dashboard", 
    label: "Dashboard", 
    icon: Home,
  },
    { 
    href: "/tutor/profile", 
    label: "Edit or complete profile", 
    icon: Home,
  },
  { 
    href: "/tutor/leads/my-leads", 
    label: "My Leads", 
    icon: Users,
  },
  { 
    href: "/tutor/leads", 
    label: "Leads MarketPlace", 
    icon: Search,
    badge: "New"
  },
  { 
    href: "/tutor/schedule", 
    label: "Schedule & Availability", 
    icon: Calendar,
  },
  { 
    href: "/tutor/library", 
    label: "Content Library", 
    icon: Library,
  },
  { 
    href: "/tutor/assign-assignments", 
    label: "Assign Assignment", 
    icon: FileCheck,
  },
  { 
    href: "/tutor/assign-quiz", 
    label: "Assign Quiz", 
    icon: ClipboardCheck,
  },
  { 
    href: "/tutor/submissions", 
    label: "Submissions", 
    icon: ClipboardList,
  },
  { 
    href: "/tutor/subscription", 
    label: "Credits & Plans", 
    icon: Zap,
  },
  { 
    href: "/tutor/earnings", 
    label: "Earnings", 
    icon: DollarSign,
  },
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
        flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 shadow-lg">
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-yellow-300" />
          <span className="text-white font-bold text-sm">Tutor Dashboard</span>
        </div>
        
        <div className="w-6" /> {/* Spacer for centering */}
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
          z-40 bg-gradient-to-br from-slate-50 via-white to-indigo-50 border-r border-indigo-100 shadow-xl
          transition-all duration-300 ease-in-out

          w-72
          ${collapsed ? "md:w-20" : "md:w-72"}

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* DESKTOP collapse toggle ONLY */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-4 top-8
          h-8 w-8 items-center justify-center
          rounded-full border-2 border-indigo-200 bg-gradient-to-br from-indigo-500 to-purple-600 
          text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200"
        >
          {collapsed ? "➤" : "◀"}
        </button>

        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-6 text-white overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
            
            {!collapsed && (
              <>
                <div className="flex items-center gap-2 mb-1 relative z-10">
                  <Sparkles className="h-6 w-6 text-yellow-300 animate-pulse" />
                  <h1 className="text-xl font-bold hidden md:block">
                    Tutor Dashboard
                  </h1>
                </div>
                <p className="text-sm text-indigo-100 hidden md:block relative z-10 font-medium">
                  Teaching • Assignments • Quizzes
                </p>
              </>
            )}

            <button 
              onClick={() => setOpen(false)} 
              className="md:hidden absolute top-4 right-4 p-1 hover:bg-white/20 rounded-lg transition"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-1 flex-col p-4 overflow-y-auto">
            {/* PROFILE */}
            <Link
              href="/tutor/profile"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-2xl border-2 border-indigo-100 p-3 
              hover:border-indigo-300 hover:shadow-lg bg-gradient-to-br from-white to-indigo-50 
              transition-all duration-200 hover:scale-[1.02] relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
              -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              <div className="relative">
                {tutor?.profileImage && tutor.profileImage.startsWith('data:') ? (
                  // Base64 image - use regular img tag
                  <img
                    src={tutor.profileImage}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-indigo-200 shadow-md"
                    alt="Tutor"
                  />
                ) : (
                  // URL image - use Next.js Image component
                  <Image
                    src={resolveImage(tutor?.profileImage)}
                    width={48}
                    height={48}
                    className="rounded-full border-2 border-indigo-200 shadow-md"
                    alt="Tutor"
                  />
                )}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              <div className={collapsed ? "hidden md:block md:hidden" : "block"}>
                <p className="text-sm font-bold text-gray-800">
                  {tutor?.fullName || "Loading..."}
                </p>
                <p className="text-xs text-indigo-600 font-medium">View Profile →</p>
              </div>
            </Link>

            {/* NAV */}
            <nav className="mt-4 flex-1 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = router.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5
                    text-sm font-bold transition-all duration-150
                    ${
                      active
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                        : "text-slate-800 hover:bg-slate-100 hover:text-indigo-600"
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${active ? "text-white" : "text-slate-500 group-hover:text-indigo-600"}`} />
                    
                    <span className={collapsed ? "hidden md:block md:hidden" : "inline flex-1"}>
                      {link.label}
                    </span>

                    {/* Badge */}
                    {link.badge && !collapsed && (
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-400 text-slate-900 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* LOGOUT */}
            <Link
              href="/tutor/logout"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5
              text-sm font-bold text-red-600 hover:bg-red-50 transition-all duration-150 group"
            >
              <LogOut className="h-4 w-4 text-red-500 shrink-0" />
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
