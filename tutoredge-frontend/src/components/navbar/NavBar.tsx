import { CircleUserRound, Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import DarkToggle from "@/components/ui/DarkToggle";

import { useAuthStore } from "@/stores/useAuthStore";

const navLinks = [
  {
    href: {
      pathname: "/subjects",
      query: {
        source: "NAVBAR",
        campaign: "SUBJECTS_NAV",
        medium: "website",
      },
    },
    label: "Subjects",
  },
  {
    href: {
      pathname: "/how-it-works",
      query: {
        source: "NAVBAR",
        campaign: "HOW_IT_WORKS_NAV",
        medium: "website",
      },
    },
    label: "How it Works",
  },
  {
    href: {
      pathname: "/pricing",
      query: {
        source: "NAVBAR",
        campaign: "PRICING_NAV",
        medium: "website",
      },
    },
    label: "Pricing",
  },
];

const NavBar = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const user = useAuthStore((state) => state.user);
  const userRole = user ? user.role : null;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardUrl = () => {
    switch (userRole) {
      case "tutor":
        return "/tutor/dashboard";
      case "parent":
        return "/parent/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/90 shadow-md backdrop-blur-lg border-none">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 sm:px-10">

        {/* Logo */}
        <Link
  href={{
    pathname: "/",
    query: {
      source: "NAVBAR_LOGO",
      medium: "website",
    },
  }}
  className="flex items-center gap-4 group"
>
  {/* LOGO IMAGE */}
  <div className="relative">
    <Image
      src="/images/logo.png"
      alt="Tutvex Logo"
      width={66}
      height={66}
      priority
      className="
        rounded-xl
        
        transition-all
        duration-300
        group-hover:scale-105
        group-hover:shadow-lg
      "
    />
  </div>

  {/* BRAND TEXT */}
  <span
    className="
      text-2xl
      font-extrabold
      tracking-wide
      bg-gradient-to-r
      from-blue-600
      via-cyan-500
      to-indigo-600
      bg-clip-text
      text-transparent
      transition-all
      duration-300
      group-hover:from-indigo-600
      group-hover:via-blue-500
      group-hover:to-cyan-500
    "
  >
    TUTVEX
  </span>
</Link>


        {/* Desktop Nav */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-12">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="relative text-lg font-medium text-gray-700 transition-colors hover:text-blue-600 group"
            >
              {link.label}
              <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-blue-600 transition-all group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* Desktop CTA / Profile */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href={{
                pathname: getDashboardUrl(),
                query: {
                  source: "NAVBAR_PROFILE",
                },
              }}
            >
              <button className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-lg">
                <CircleUserRound size={26} />
              </button>
            </Link>
          ) : (
            <>
              <Link
                href={{
                  pathname: "/find-tutor-flow/create-account",
                  query: {
                    source: "NAVBAR_CTA",
                    campaign: "FIND_TUTOR",
                    medium: "website",
                  },
                }}
              >
                <button className="h-10 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 hover:shadow-lg">
                  Find a Tutor
                </button>
              </Link>

              <Link
                href={{
                  pathname: "/tutor-flow/tutor-registration",
                  query: {
                    role: "tutor",
                    source: "NAVBAR_CTA",
                    campaign: "BECOME_TUTOR",
                    medium: "website",
                  },
                }}
              >
                <button className="hidden h-10 rounded-xl bg-gray-100 px-5 text-sm font-semibold text-gray-800 shadow-md hover:bg-gray-200 hover:shadow-lg sm:block">
                  Become a Tutor
                </button>
              </Link>

              <Link
                href={{
                  pathname: "/login",
                  query: {
                    source: "NAVBAR_LOGIN",
                    medium: "website",
                  },
                }}
              >
                <button className="hidden h-10 rounded-xl bg-black px-5 text-sm font-semibold text-white shadow-md hover:bg-gray-800 hover:shadow-lg sm:block">
                  Login
                </button>
              </Link>

              <Link
                href={{
                  pathname: "/sitemap",
                  query: {
                    source: "NAVBAR_FOOTER",
                  },
                }}
                className="inline-flex h-10 items-center rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 hover:shadow-lg"
              >
                Sitemap
              </Link>

              <DarkToggle />   {/* 👈 HERE */}
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 shadow-lg border-t animate-slide-down">
          <nav className="flex flex-col items-center gap-6 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-lg font-medium text-gray-700 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 pb-6">
            <Link
              href={{
                pathname: "/find-tutor-flow/create-account",
                query: {
                  source: "MOBILE_NAV",
                  campaign: "FIND_TUTOR",
                },
              }}
            >
              <button className="w-40 h-10 rounded-xl bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700">
                Find a Tutor
              </button>
            </Link>

            <Link
              href={{
                pathname: "/tutor-flow/tutor-registration",
                query: {
                  role: "tutor",
                  source: "MOBILE_NAV",
                  campaign: "BECOME_TUTOR",
                },
              }}
            >
              <button className="w-40 h-10 rounded-xl bg-gray-100 text-gray-800 font-semibold shadow-md hover:bg-gray-200">
                Become a Tutor
              </button>
            </Link>

            <Link href="/login">
              <button className="w-40 h-10 rounded-xl bg-black text-white font-semibold shadow-md hover:bg-gray-800">
                Login
              </button>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </header>
  );
};

export default NavBar;
