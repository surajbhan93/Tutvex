import {
  BellRing,
  LayoutDashboard,
  Mail,
  Receipt,
  UserCheck,
  Users,
  Users2,
  LogOut,
  PlusCircle,
  MessageCircle,
  Target,
  List,
  Menu,
  X,
  Shield,
  Sparkles,
  Crown,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

// Data for admin navigation links
const navLinks = [
  { 
    href: '/admin/dashboard', 
    label: 'Dashboard', 
    icon: LayoutDashboard,
    gradient: 'from-blue-500 to-indigo-600'
  },
  { 
    href: '/admin/applications', 
    label: 'Tutor Applications', 
    icon: UserCheck,
    gradient: 'from-green-500 to-emerald-600'
  },
  { 
    href: '/admin/requests', 
    label: 'Parent Requests', 
    icon: BellRing,
    gradient: 'from-orange-500 to-amber-600'
  },
  {
    href: "/admin/parent-demo-requests",
    label: "Parent Demo Requests",
    icon: BellRing,
    gradient: 'from-yellow-500 to-orange-600'
  },
  {
    href: "/admin/tutor-demo-requests",
    label: "Tutor Demo Requests",
    icon: BellRing,
    gradient: 'from-amber-500 to-yellow-600'
  },
  {
    href: "/admin/demo-leads",
    label: "Demo Leads",
    icon: Target,
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    href: "/admin/leads",
    label: "Student Leads",
    icon: Target,
    gradient: 'from-emerald-500 to-teal-600'
  },
  {
    href: "/admin/leads/contact-access-requests",
    label: "Contact Access",
    icon: Shield,
    gradient: 'from-indigo-500 to-purple-600',
    badge: 'Requests'
  },
  {
    href: "/admin/create-lead",
    label: "Create Lead",
    icon: PlusCircle,
    gradient: 'from-violet-500 to-purple-600',
    badge: 'New'
  },
  {
    href: "/admin/monetization",
    label: "Monetization",
    icon: Crown,
    gradient: 'from-amber-500 to-orange-600',
    badge: 'Analytics'
  },
  { 
    href: '/admin/users', 
    label: 'User Management', 
    icon: Users,
    gradient: 'from-purple-500 to-pink-600'
  },
  { 
    href: '/admin/payments', 
    label: 'Payment Logs', 
    icon: Receipt,
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    href: "/admin/contacts",
    label: "Contact Messages",
    icon: Mail,
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    href: "/admin/team",
    label: "Team",
    icon: Users2,
    gradient: 'from-indigo-500 to-blue-600'
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: Users2,
    gradient: 'from-fuchsia-500 to-pink-600'
  },
  {
    href: "/admin/chatbot",
    label: "Chatbot",
    icon: MessageCircle,
    gradient: 'from-teal-500 to-cyan-600'
  },
];

const AdminSidebar = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

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

  return (
    <>
      {/* ======================
         MOBILE TOP BAR
      ====================== */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50
        flex items-center justify-between px-4 py-3 border-b bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 shadow-lg">
        <button onClick={() => setOpen(true)} className="text-white">
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-yellow-300 animate-pulse" />
          <span className="text-white font-bold text-sm">Admin Panel</span>
        </div>
        
        <div className="w-6" /> {/* Spacer */}
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
          z-40 
          bg-slate-50 border-r border-slate-200 shadow-xl
          transition-all duration-300 ease-in-out
          overflow-y-auto

          w-72
          ${collapsed ? "md:w-20" : "md:w-72"}

          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* DESKTOP collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute -right-4 top-8
          h-9 w-9 items-center justify-center
          rounded-full border-2 border-purple-400 
          bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 
          text-white shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/70 
          hover:scale-110 transition-all duration-200 font-bold"
        >
          {collapsed ? "➤" : "◀"}
        </button>

        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-6 border-b border-purple-400/30 overflow-hidden shadow-lg">
            {/* Animated decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-300/20 to-pink-400/20 rounded-full blur-2xl -mr-20 -mt-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-xl -ml-16 -mb-16"></div>
            <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-full blur-lg animate-pulse"></div>
            
            {/* Sparkle effects */}
            <div className="absolute top-4 right-8 w-2 h-2 bg-yellow-300 rounded-full animate-ping"></div>
            <div className="absolute top-8 right-16 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
            <div className="absolute top-6 right-24 w-1 h-1 bg-cyan-300 rounded-full animate-ping"></div>
            
            {!collapsed && (
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2.5 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-xl shadow-xl shadow-yellow-500/50 animate-pulse">
                    <Crown className="h-7 w-7 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-white hidden md:block drop-shadow-lg">
                      Admin Panel
                    </h1>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mb-2 bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
                  <Image
                    src="/images/logo.png"
                    alt="Tutvex Logo"
                    width={120}
                    height={120}
                    className="drop-shadow-lg"
                  />
                </div>
                <p className="text-sm text-purple-100 hidden md:block font-bold text-center drop-shadow-md">
                  ✨ Complete Control & Management ✨
                </p>
              </div>
            )}

            <button 
              onClick={() => setOpen(false)} 
              className="md:hidden absolute top-4 right-4 p-2 hover:bg-white/20 rounded-xl transition-all hover:rotate-90 duration-300"
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>

          {/* ADMIN BADGE */}
          {!collapsed && (
            <div className="px-4 pt-4">
              <div className="relative flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl 
              bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 
              border-2 border-yellow-300 shadow-lg shadow-yellow-500/50 overflow-hidden group">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <Shield className="h-5 w-5 text-white drop-shadow-lg relative z-10" />
                <span className="text-sm font-black text-white drop-shadow-md relative z-10">ADMIN ACCESS</span>
                <Sparkles className="h-4 w-4 text-yellow-200 animate-pulse relative z-10" />
              </div>
            </div>
          )}

          <div className="flex flex-1 flex-col p-4 overflow-y-auto">
            {/* NAV */}
            <nav className="mt-2 flex-1 space-y-2">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = router.pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-3.5
                    text-sm transition-all duration-200 overflow-hidden
                    ${
                      isActive
                        ? `bg-gradient-to-r ${link.gradient} text-white font-black shadow-xl shadow-${link.gradient.split('-')[1]}-500/50 scale-[1.03] border border-white/30`
                        : "bg-white text-slate-900 font-black hover:bg-slate-100 hover:text-black hover:scale-[1.02] border border-slate-200/80 hover:border-purple-300 shadow-sm"
                    }`}
                  >
                    {/* Shine effect for active */}
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
                      -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    )}

                    {/* Icon with gradient background */}
                    <div className={`p-2.5 rounded-xl transition-all relative z-10 ${
                      isActive 
                        ? "bg-white/25 shadow-inner backdrop-blur-sm text-white" 
                        : `bg-gradient-to-br ${link.gradient} text-white shadow-md group-hover:scale-110 group-hover:rotate-6`
                    }`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    
                    <span className={`relative z-10 text-slate-900 font-black tracking-wide group-hover:text-black ${collapsed ? "hidden md:block md:hidden" : "inline flex-1"}`}>
                      {link.label}
                    </span>

                    {/* Badge */}
                    {link.badge && !collapsed && (
                      <span className="relative z-10 px-2.5 py-1 text-[10px] font-black 
                      bg-gradient-to-r from-yellow-300 to-orange-400 text-slate-900 
                      rounded-full animate-pulse shadow-lg">
                        {link.badge}
                      </span>
                    )}

                    {/* Active glow indicator */}
                    {isActive && (
                      <>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-10 bg-white rounded-r-full shadow-lg shadow-white/50"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent rounded-xl"></div>
                      </>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* LOGOUT */}
            <Link
              href="/admin/logout"
              onClick={() => setOpen(false)}
              className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3.5
              text-sm font-bold text-white
              bg-gradient-to-r from-red-600 via-pink-600 to-red-700
              border-2 border-red-400/50 hover:border-red-300 
              transition-all duration-200 hover:shadow-xl hover:shadow-red-500/50 hover:scale-[1.03]
              group relative overflow-hidden"
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
              -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

              <div className="p-2.5 rounded-xl bg-white/20 text-white shadow-inner backdrop-blur-sm
              group-hover:scale-110 group-hover:rotate-12 transition-all relative z-10">
                <LogOut className="h-5 w-5" />
              </div>
              <span className={`relative z-10 ${collapsed ? "hidden md:block md:hidden" : "inline"}`}>
                Logout
              </span>
            </Link>

            {/* Decorative bottom gradient */}
            <div className="mt-4 h-1 rounded-full bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500"></div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
