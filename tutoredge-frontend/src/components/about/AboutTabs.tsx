"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Info,
  Users,
  MessageSquare,
  Briefcase,
  ShieldCheck,
  RefreshCcw,
  FileText,
  Map,
} from "lucide-react";

/* ======================
   TYPES
====================== */
interface Tab {
  key: string;
  label: string;
  icon: React.ElementType;
  count?: number;
  type: "section" | "route";
  href?: string;
}

/* ======================
   TABS CONFIG
====================== */
const tabs: Tab[] = [
  { key: "about", label: "About Us", icon: Info, type: "section" },
  { key: "team", label: "Team", icon: Users, count: 20, type: "section" },
  {
    key: "testimonials",
    label: "Testimonials",
    icon: MessageSquare,
    type: "section",
  },
  { key: "careers", label: "Careers", icon: Briefcase, count: 5, type: "section" },

  // Legal pages (routes)
  {
    key: "privacy",
    label: "Privacy Policy",
    icon: ShieldCheck,
    type: "route",
    href: "/privacy",
  },
  {
    key: "refund",
    label: "Refund & Cancellation",
    icon: RefreshCcw,
    type: "route",
    href: "/refund",
  },
  {
    key: "terms",
    label: "Terms & Conditions",
    icon: FileText,
    type: "route",
    href: "/terms",
  },
  {
    key: "sitemap",
    label: "Sitemap",
    icon: Map,
    type: "route",
    href: "/sitemap",
  },
];

interface Props {
  active: string;
  onChange: (key: string) => void;
}

/* ======================
   COMPONENT
====================== */
export default function AboutTabs({ active, onChange }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  /* ======================
     SCROLL SPY (ONLY SECTIONS)
  ====================== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onChange(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0.1,
      }
    );

    tabs
      .filter((tab) => tab.type === "section")
      .forEach((tab) => {
        const el = document.getElementById(tab.key);
        if (el) observer.observe(el);
      });

    return () => observer.disconnect();
  }, [onChange]);

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3">
        <div
          className="
            flex gap-2 overflow-x-auto py-4
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
          "
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;

            const isActive =
              active === tab.key ||
              (tab.type === "route" && pathname === tab.href);

            return (
              <button
                key={tab.key}
                onClick={() => {
                  if (tab.type === "route" && tab.href) {
                    router.push(tab.href);
                    return;
                  }

                  onChange(tab.key);
                  document
                    .getElementById(tab.key)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="relative px-4 py-2 rounded-full text-sm font-semibold text-gray-600 hover:text-indigo-600 flex items-center gap-2"
              >
                {isActive && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600"
                  />
                )}

                <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                  <Icon size={14} />
                  {tab.label}
                  {tab.count && (
                    <span
                      className={`px-2 py-0.5 text-xs rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
