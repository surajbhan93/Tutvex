"use client";

import { usePathname, useRouter } from "next/navigation";

export default function UsersTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const active =
    pathname.includes("/tutors") ? "tutors" : "parent";

  return (
    <div className="relative w-fit rounded-lg bg-gray-100 p-1 flex">
      <button
        onClick={() => router.push("/admin/users/parent")}
        className={`relative z-10 px-6 py-2 text-sm font-medium transition ${
          active === "parent"
            ? "text-blue-600"
            : "text-gray-600"
        }`}
      >
        Parents
      </button>

      <button
        onClick={() => router.push("/admin/users/tutors")}
        className={`relative z-10 px-6 py-2 text-sm font-medium transition ${
          active === "tutors"
            ? "text-blue-600"
            : "text-gray-600"
        }`}
      >
        Tutors
      </button>

      {/* Slider */}
      <span
        className={`absolute top-1 h-[calc(100%-8px)] w-1/2 rounded-md bg-white shadow transition-all duration-300 ${
          active === "parent" ? "left-1" : "left-1/2"
        }`}
      />
    </div>
  );
}
