import { CircleUserRound, Menu, X, ChevronDown, MapPin, Globe, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import DarkToggle from "@/components/ui/DarkToggle";
import { trackEvent } from "@/components/analytics/trackers";
import { useAuthStore } from "@/stores/useAuthStore";

const navLinks = [
  {
    href: {
      pathname: "/subjects",
      query: { source: "NAVBAR", campaign: "SUBJECTS_NAV", medium: "website" },
    },
    label: "Subjects",
  },
  {
    href: {
      pathname: "/how-it-works",
      query: { source: "NAVBAR", campaign: "HOW_IT_WORKS_NAV", medium: "website" },
    },
    label: "How it Works",
  },
  {
    href: {
      pathname: "/pricing",
      query: { source: "NAVBAR", campaign: "PRICING_NAV", medium: "website" },
    },
    label: "Pricing",
  },
];

const offlineCenters = [
  {
    city: "Allahabad",
    href: "/allahabad",
    links: [
      { label: "Home Tutor", href: "/allahabad" },
      { label: "Maths Tutor", href: "/allahabad/allahabad/maths-tutor" },
      { label: "JEE Tutor", href: "/allahabad/allahabad/jee-tutor" },
      { label: "NEET Tutor", href: "/allahabad/allahabad/neet-tutor" },
    ],
  },
  {
    city: "Varanasi",
    href: "/india/banaras",
    links: [
      { label: "Home Tutor", href: "/india/banaras" },
      { label: "Maths Tutor", href: "/india/banaras/mahmoorganj/math-tutor" },
      { label: "JEE Tutor", href: "/india/banaras/mahmoorganj/jee-tuto" },
      { label: "NEET Tutor", href: "/india/banaras/mahmoorganj/neet-tutor" },
    ],
  },
  {
    city: "Lucknow",
    href: "/lucknow",
    links: [
      { label: "Home Tutor", href: "/lucknow" },
      { label: "ICSE Tutor", href: "/lucknow/Hasanganj/icse-tutor" },
      { label: "JEE Tutor", href: "/lucknow/Gomti%20Nagar/jee-tutor" },
      { label: "NEET Tutor", href: "/lucknow/Vibhuti%20Khand/neet-tutor" },
    ],
  },
  {
    city: "Kanpur",
    href: "/kanpur",
    links: [
      { label: "Home Tutor", href: "/kanpur" },
      { label: "Private Tutor", href: "/kanpur/Civil%20Lines/private-tutor" },
      { label: "JEE Tutor", href: "/kanpur/Yashoda%20Nagar/jee-tutor" },
      { label: "NEET Tutor", href: "/kanpur/Karachi%20Khana/neet-tutor" },
    ],
  },
  {
    city: "Noida",
    href: "/india/noida",
    links: [
      { label: "Home Tutor", href: "/india/noida" },
      { label: "Private Tutor", href: "/india/noida/Sector%2063/private-tutor" },
      { label: "JEE Tutor", href: "/india/noida/Greater%20Noida%20West/jee-tutor" },
      { label: "NEET Tutor", href: "/india/noida/Techzone%204/neet-tutor" },
    ],
  },
  {
    city: "Agra",
    href: "/india/agra",
    links: [
      { label: "Home Tutor", href: "/india/agra" },
      { label: "Private Tutor", href: "/india/agra/Civil%20Lines/private-tutor" },
      { label: "JEE Tutor", href: "/india/agra/Mantola/jee-tutor" },
      { label: "NEET Tutor", href: "/india/agra/Kamla%20Nagar/neet-tutor" },
    ],
  },
  {
    city: "Meerut",
    href: "/india/meerut",
    links: [
      { label: "Home Tutor", href: "/india/meerut" },
      { label: "Private Tutor", href: "/india/meerut/Begum%20Bridge/private-tutor" },
      { label: "JEE Tutor", href: "/india/meerut/Jagriti%20Vihar/jee-tutor" },
      { label: "NEET Tutor", href: "/india/meerut/Shradhapuri/neet-tutor" },
    ],
  },
];

const onlineGlobal = [
  {
    region: "🌐 Online India",
    links: [
      { label: "Online Tuition", href: "/country/india/online-tuition" },
      { label: "Maths Online", href: "/country/india/maths-online" },
      { label: "Science Online", href: "/country/india/science-online" },
      { label: "JEE Online Coaching", href: "/country/india/jee-online-coaching" },
      { label: "NEET Online Coaching", href: "/country/india/neet-online-coaching" },
      { label: "CBSE Online Tutor", href: "/country/india/cbse-online-tutor" },
    ],
  },
  {
    region: "🇬🇧 United Kingdom",
    links: [
      { label: "UK Tutoring", href: "/country/uk/uk-tutoring" },
      { label: "Home Tutor UK", href: "/country/uk/home-tutor-uk" },
      { label: "Online Tutor UK", href: "/country/uk/online-tutor-uk" },
      { label: "GCSE Tutor UK", href: "/country/uk/gcse-tutor-uk" },
      { label: "A-Level Tutor UK", href: "/country/uk/a-level-tutor-uk" },
      { label: "Tutor Job UK", href: "/country/uk/tutor-job-uk" },
    ],
  },
  {
    region: "🇨🇦 Canada",
    links: [
      { label: "Canada Tutoring", href: "/country/canada/canada-tutoring" },
      { label: "Home Tutor Canada", href: "/country/canada/home-tutor-canada" },
      { label: "Online Tutor Canada", href: "/country/canada/online-tutor-canada" },
      { label: "Toronto Tutor", href: "/country/canada/toronto-tutor" },
      { label: "Maths Tutor Canada", href: "/country/canada/maths-tutor-canada" },
      { label: "Tutor Job Canada", href: "/country/canada/tutor-job-canada" },
    ],
  },
  {
    region: "🇦🇪 UAE",
    links: [
      { label: "Home Tutor UAE", href: "/country/uae/home-tutor-uae" },
      { label: "Online Tutor Dubai", href: "/country/uae/online-tutor-dubai" },
      { label: "Tutor Abu Dhabi", href: "/country/uae/tutor-abu-dhabi" },
      { label: "CBSE Tutor Dubai", href: "/country/uae/cbse-tutor-dubai" },
      { label: "Maths Tutor UAE", href: "/country/uae/maths-tutor-uae" },
      { label: "Tutor Job UAE", href: "/country/uae/tutor-job-uae" },
    ],
  },
  {
    region: "🇸🇬 Singapore",
    links: [
      { label: "Home Tutor SG", href: "/country/singapore/home-tutor-singapore" },
      { label: "Online Tutor SG", href: "/country/singapore/online-tutor-sg" },
      { label: "Maths Tutor SG", href: "/country/singapore/maths-tutor-sg" },
      { label: "Primary Tutor SG", href: "/country/singapore/primary-tutor-sg" },
      { label: "Tutor Job Singapore", href: "/country/singapore/tutor-job-singapore" },
    ],
  },
  {
    region: "🇦🇺 Australia",
    links: [
      { label: "Home Tutor AU", href: "/country/australia/home-tutor-australia" },
      { label: "Online Tutor AU", href: "/country/australia/online-tutor-au" },
      { label: "Sydney Tutor", href: "/country/australia/sydney-tutor" },
      { label: "Melbourne Tutor", href: "/country/australia/melbourne-tutor" },
      { label: "Maths Tutor AU", href: "/country/australia/maths-tutor-au" },
      { label: "Tutor Job Australia", href: "/country/australia/tutor-job-australia" },
    ],
  },
];
// ─── Mega Dropdown Component ─────────────────────────────────────────────────
const MegaDropdown = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"offline" | "online">("offline");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onMouseEnter={() => setOpen(true)}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 relative text-sm font-semibold text-gray-700 hover:text-blue-600 transition-all duration-200 group px-2 py-1"
      >
        <GraduationCap size={17} className="text-blue-600 group-hover:scale-110 transition-transform" />
        <span>Locations</span>
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${open ? "rotate-180 text-blue-600" : "text-gray-400 group-hover:text-blue-600"}`}
        />
        <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 rounded-full transition-all group-hover:w-full" />
      </button>

      {open && (
        <div
          onMouseLeave={() => setOpen(false)}
          className="absolute left-1/2 -translate-x-1/2 top-[calc(100%+14px)] w-[820px] rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-blue-100/60 z-50 overflow-hidden"
          style={{ animation: "megaFadeIn 0.18s ease-out" }}
        >
          {/* Arrow pointer */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-white border-l border-t border-gray-100" />

          {/* Tab bar */}
          <div className="flex border-b border-gray-100 bg-gray-50/80">
            <button
              onClick={() => setActiveTab("offline")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === "offline"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin size={14} />
              Offline Centers — India
            </button>
            <button
              onClick={() => setActiveTab("online")}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors ${
                activeTab === "online"
                  ? "border-b-2 border-blue-600 text-blue-600 bg-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Globe size={14} />
              Online &amp; Global
            </button>
          </div>

          {/* Content */}
          <div className="p-5 max-h-[460px] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-100">
            {activeTab === "offline" ? (
              <div className="grid grid-cols-4 gap-4">
                {offlineCenters.map((center) => (
                  <div key={center.city} className="rounded-xl bg-blue-50/50 p-3 hover:bg-blue-50 transition-colors">
                    <a
                      href={center.href}
                      className="flex items-center gap-1.5 text-sm font-bold text-blue-700 mb-2 hover:text-blue-900"
                    >
                      <MapPin size={12} className="text-blue-400" />
                      {center.city}
                    </a>
                    <ul className="space-y-1">
                      {center.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="block text-xs text-gray-600 hover:text-blue-600 hover:translate-x-0.5 transition-all py-0.5"
                          >
                            → {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                {onlineGlobal.map((section) => (
                  <div key={section.region} className="rounded-xl bg-indigo-50/50 p-3 hover:bg-indigo-50 transition-colors">
                    <p className="text-sm font-bold text-indigo-700 mb-2">{section.region}</p>
                    <ul className="space-y-1">
                      {section.links.map((link) => (
                        <li key={link.label}>
                          <a
                            href={link.href}
                            className="block text-xs text-gray-600 hover:text-indigo-600 hover:translate-x-0.5 transition-all py-0.5"
                          >
                            → {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer CTA */}
          <div className="border-t border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-3 flex items-center justify-between">
            <span className="text-xs text-gray-500">Explore all tutor listings across India &amp; globally</span>
            <a
              href="/sitemap"
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              View Full Sitemap →
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Main NavBar ─────────────────────────────────────────────────────────────
const NavBar = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const userRole = user ? user.role : null;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileTutorsOpen, setMobileTutorsOpen] = useState(false);
  const [mobileTutorsTab, setMobileTutorsTab] = useState<"offline" | "online">("offline");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getDashboardUrl = () => {
    switch (userRole) {
      case "tutor": return "/tutor/dashboard";
      case "parent": return "/parent/dashboard";
      case "admin": return "/admin/dashboard";
      default: return "/";
    }
  };

  const handleLogout = () => {
    logout();
    // Clear all cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // Redirect to home
    window.location.href = "/";
  };

  return (
    <>
      <style jsx global>{`
        @keyframes megaFadeIn {
          from { opacity: 0; transform: translateX(-50%) translateY(8px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideDown {
          from { transform: translateY(-16px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .animate-slide-down { animation: slideDown 0.25s ease-out forwards; }

        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #bfdbfe; border-radius: 4px; }

        /* Gradient border on scroll — optional progressive enhancement */
        .nav-glow {
          box-shadow: 0 1px 0 0 rgba(59,130,246,.1), 0 4px 24px -4px rgba(59,130,246,.08);
        }
      `}</style>

      <header className="nav-glow sticky top-0 z-50 w-full bg-white/95 backdrop-blur-xl border-b border-blue-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-2.5 sm:px-10">

          {/* ── Logo ── */}
          <Link
            href={{ pathname: "/", query: { source: "NAVBAR_LOGO", medium: "website" } }}
            className="flex items-center gap-2.5 group flex-shrink-0 mr-4 lg:mr-8"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-blue-400/20 blur-md group-hover:blur-lg transition-all duration-300" />
              <Image
                src="/images/logo.png"
                alt="Tutvex Logo"
                width={48}
                height={48}
                priority
                className="relative rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <span className="text-xl font-black tracking-widest bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 bg-clip-text text-transparent transition-all duration-300 group-hover:from-indigo-600 group-hover:to-cyan-500">
              TUTVEX
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors group py-1"
              >
                {link.label}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 rounded-full transition-all group-hover:w-full" />
              </Link>
            ))}

            {/* Mega dropdown trigger */}
            <MegaDropdown />
          </nav>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {isLoggedIn ? (
              <div ref={userMenuRef} className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-md transition-all"
                >
                  <CircleUserRound size={22} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 top-12 w-56 rounded-xl bg-white shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                      <p className="mt-1 text-xs font-medium text-blue-600 capitalize">{user?.role}</p>
                    </div>
                    
                    <Link href={getDashboardUrl()}>
                      <button
                        onClick={() => setUserMenuOpen(false)}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Dashboard
                      </button>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 mt-1"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href={{ pathname: "/tutors", query: { source: "NAVBAR_CTA", campaign: "FIND_TUTOR", medium: "website" } }}>
                  <button
                    onClick={() => trackEvent("find_tutor_click", { event_category: "NAVBAR", event_label: "Find a Tutor" })}
                    className="h-10 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    Find a Tutor
                  </button>
                </Link>

                <Link href={{ pathname: "/tutor-flow/tutor-registration", query: { role: "tutor", source: "NAVBAR_CTA", campaign: "BECOME_TUTOR", medium: "website" } }}>
                  <button
                    onClick={() => trackEvent("become_tutor_click", { event_category: "NAVBAR", event_label: "Become a Tutor" })}
                    className="hidden h-10 rounded-xl bg-blue-50/80 border border-blue-200/70 px-4 text-sm font-semibold text-blue-700 hover:bg-blue-100/90 hover:border-blue-300 hover:shadow-sm transition-all sm:block"
                  >
                    Become a Tutor
                  </button>
                </Link>

                <Link href={{ pathname: "/login", query: { source: "NAVBAR_LOGIN", medium: "website" } }}>
                  <button
                    onClick={() => trackEvent("login_click", { event_category: "NAVBAR", event_label: "Login" })}
                    className="hidden h-10 rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white hover:bg-slate-800 hover:shadow-md transition-all sm:block"
                  >
                    Login
                  </button>
                </Link>

                <DarkToggle />
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 border-t border-gray-100 shadow-xl animate-slide-down">
            <nav className="flex flex-col gap-0 px-5 pt-4 pb-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-3 text-base font-medium text-gray-700 hover:text-blue-600 border-b border-gray-50 last:border-0 transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile "Find Tutors" accordion */}
              <button
                onClick={() => setMobileTutorsOpen((v) => !v)}
                className="flex items-center justify-between py-3 text-base font-medium text-gray-700 hover:text-blue-600 border-b border-gray-50 transition-colors w-full"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-blue-500" />
                  Locations ▼
                </span>
                <ChevronDown size={16} className={`transition-transform ${mobileTutorsOpen ? "rotate-180" : ""}`} />
              </button>

              {mobileTutorsOpen && (
                <div className="pb-2 animate-slide-down">
                  {/* Tab switcher */}
                  <div className="flex rounded-lg bg-gray-100 p-1 mb-3 mt-1">
                    <button
                      onClick={() => setMobileTutorsTab("offline")}
                      className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                        mobileTutorsTab === "offline" ? "bg-white shadow text-blue-600" : "text-gray-500"
                      }`}
                    >
                      📍 Offline India
                    </button>
                    <button
                      onClick={() => setMobileTutorsTab("online")}
                      className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition-all ${
                        mobileTutorsTab === "online" ? "bg-white shadow text-indigo-600" : "text-gray-500"
                      }`}
                    >
                      🌐 Online / Global
                    </button>
                  </div>

                  {/* Offline cities */}
                  {mobileTutorsTab === "offline" && (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {offlineCenters.map((center) => (
                        <div key={center.city} className="rounded-xl bg-blue-50/60 p-3">
                          <a href={center.href} className="text-sm font-bold text-blue-700 flex items-center gap-1 mb-1.5">
                            <MapPin size={11} /> {center.city}
                          </a>
                          <div className="flex flex-wrap gap-1.5">
                            {center.links.map((l) => (
                              <a
                                key={l.label}
                                href={l.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full bg-white border border-blue-100 px-2.5 py-0.5 text-xs text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                              >
                                {l.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Online/global */}
                  {mobileTutorsTab === "online" && (
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {onlineGlobal.map((section) => (
                        <div key={section.region} className="rounded-xl bg-indigo-50/60 p-3">
                          <p className="text-sm font-bold text-indigo-700 mb-1.5">{section.region}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {section.links.map((l) => (
                              <a
                                key={l.label}
                                href={l.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="rounded-full bg-white border border-indigo-100 px-2.5 py-0.5 text-xs text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
                              >
                                {l.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </nav>

            {/* Mobile CTA buttons */}
            <div className="flex flex-col items-center gap-3 px-5 py-5">
              {isLoggedIn ? (
                <>
                  <div className="w-full rounded-xl bg-blue-50 p-4 mb-2">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="mt-1 text-xs font-medium text-blue-600 capitalize">{user?.role}</p>
                  </div>

                  <Link href={getDashboardUrl()} className="w-full">
                    <button
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full h-11 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
                    >
                      Go to Dashboard
                    </button>
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full h-11 rounded-xl bg-red-50 text-red-600 font-semibold shadow hover:bg-red-100 transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={{ pathname: "/tutors", query: { source: "MOBILE_NAV", campaign: "FIND_TUTOR" } }}
                    className="w-full"
                  >
                    <button
                      onClick={() => trackEvent("find_tutor_click", { event_category: "MOBILE_NAV", event_label: "Find a Tutor" })}
                      className="w-full h-11 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition-all"
                    >
                      Find a Tutor
                    </button>
                  </Link>

                  <Link
                    href={{ pathname: "/tutor-flow/tutor-registration", query: { role: "tutor", source: "MOBILE_NAV", campaign: "BECOME_TUTOR" } }}
                    className="w-full"
                  >
                    <button
                      onClick={() => trackEvent("become_tutor_click", { event_category: "MOBILE_NAV", event_label: "Become a Tutor" })}
                      className="w-full h-11 rounded-xl bg-gray-100 text-gray-800 font-semibold shadow hover:bg-gray-200 transition-all"
                    >
                      Become a Tutor
                    </button>
                  </Link>

                  <Link href="/login" className="w-full">
                    <button
                      onClick={() => trackEvent("login_click", { event_category: "MOBILE_NAV", event_label: "Login" })}
                      className="w-full h-11 rounded-xl bg-gray-900 text-white font-semibold shadow hover:bg-gray-700 transition-all"
                    >
                      Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default NavBar;