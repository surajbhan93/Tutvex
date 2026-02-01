import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  LayoutDashboard,
  UserCheck,
  BookOpen,
  FolderOpen,
  CreditCard,
  Wallet,
  User,
  ClipboardList,
  LogOut,
  Users, // ✅ Logout icon
} from "lucide-react";

type ParentDashboardLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  {
    href: "/parent/dashboard",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    href: "/parent/tutors",
    label: "My Tutors",
    icon: UserCheck,
  },
  // 🔥 NEW: My Students
  {
    href: "/parent/ParentStudentsPage",
    label: "My Students",
    icon: Users,
  },
  {
    href: "/parent/assignments",
    label: "Assignments",
    icon: BookOpen,
  },
  {
    href: "/parent/quizzes",
    label: "Quizzes",
    icon: ClipboardList,
  },
  {
    href: "/parent/materials",
    label: "Study Materials",
    icon: FolderOpen,
  },
  {
    href: "/parent/payments",
    label: "Payments",
    icon: CreditCard,
  },
  {
    href: "/parent/payment-methods",
    label: "Payment Methods",
    icon: Wallet,
  },
  {
    href: "/parent/profile",
    label: "Profile",
    icon: User,
  },
];

export default function ParentDashboardLayout({
  children,
}: ParentDashboardLayoutProps) {
  const router = useRouter();

  const handleLogout = () => {
    // ✅ Clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Agar cookies use kar rahe ho to yahan clear karo

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="flex min-h-screen">
        {/* ================= SIDEBAR ================= */}
        <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r bg-gradient-to-b from-blue-600 via-indigo-600 to-purple-700 text-white shadow-lg">
          
          {/* LOGO */}
          <div className="px-6 py-6 text-xl font-bold tracking-wide">
            🎓 Parent Panel
            <p className="mt-1 text-xs font-normal text-blue-100">
              Learning Dashboard
            </p>
          </div>

          {/* NAV */}
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-white text-blue-700 shadow"
                      : "text-blue-100 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* LOGOUT */}
          <div className="px-3 pb-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium text-red-100 transition hover:bg-red-500/20 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>

          {/* FOOTER */}
          <div className="px-4 py-3 text-xs text-blue-100">
            © {new Date().getFullYear()} Smart LMS
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1 p-4 md:p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
