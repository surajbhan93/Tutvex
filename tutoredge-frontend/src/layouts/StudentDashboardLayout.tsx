import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

type StudentDashboardLayoutProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: '/student/dashboard', label: 'Overview' },
  { href: '/student/tutors', label: 'My Tutors' },
  { href: '/student/assignments', label: 'Assignments' },
  { href: '/student/materials', label: 'Study Materials' },
  { href: '/student/payments', label: 'Payments' },
  { href: '/student/payment-methods', label: 'Payment Methods' },
  { href: '/student/profile', label: 'Profile' },
];

export default function StudentDashboardLayout({
  children,
}: StudentDashboardLayoutProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        <aside className="w-64 shrink-0 border-r bg-white">
          <div className="px-6 py-5 text-xl font-bold">Student Dashboard</div>
          <nav className="px-2">
            {navItems.map((item) => {
              const active = router.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-4 py-2 text-sm font-medium hover:bg-blue-50 hover:text-blue-700 ${
                    active ? 'bg-blue-100 text-blue-700' : 'text-gray-700'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
