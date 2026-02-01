"use client";

import { usePathname, useRouter } from "next/navigation";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";

export default function UsersTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const active = pathname.includes("/tutors") ? "tutors" : "parent";

  const title =
    active === "tutors" ? "Tutors" : "Parents";

  const description =
    active === "tutors"
      ? "View and manage all registered tutors, including their subjects, experience, pricing, and availability."
      : "Manage registered parents, review their contact details, and monitor tutoring requests and assignments.";

  return (
    <AdminDashboardLayout>
      <div className="p-6 space-y-6">

        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {title} Management
          </h1>
          <p className="mt-1 text-sm text-gray-600 max-w-2xl">
            {description}
          </p>
        </div>

        {/* Tabs */}
        <div className="relative w-fit rounded-xl bg-gray-100 p-1 flex shadow-inner">
          
          {/* Slider */}
          <span
            className={`absolute top-1 h-[calc(100%-8px)] w-1/2 rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out ${
              active === "parent" ? "left-1" : "left-1/2"
            }`}
          />

          {/* Parents Tab */}
          <button
            onClick={() => router.push("/admin/users/parent")}
            className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors ${
              active === "parent"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Parents
          </button>

          {/* Tutors Tab */}
          <button
            onClick={() => router.push("/admin/users/tutors")}
            className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors ${
              active === "tutors"
                ? "text-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            Tutors
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
