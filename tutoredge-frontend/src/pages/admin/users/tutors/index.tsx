"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";

export default function TutorsPage() {
  const router = useRouter();
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const resolveImage = (path?: string) => {
    if (!path) return "/images/default-avatar.png";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  /* =========================
     Fetch Tutors
  ========================= */
  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/tutors?page=1&limit=50")
      .then(res => setTutors(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  /* =========================
     Search Logic (same as UserManagement)
  ========================= */
  const filteredTutors = useMemo(() => {
    return tutors.filter(tutor =>
      tutor.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tutors, searchQuery]);

  return (
    <AdminDashboardLayout>
      <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-6">

        {/* ================= Header ================= */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Tutor Management
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Manage all registered tutors, view profiles, subjects, pricing,
            and availability.
          </p>
        </div>

        {/* ================= Search ================= */}
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search tutors by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* ================= Table ================= */}
        <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
          <table className="w-full min-w-[900px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-600">Tutor</th>
                <th className="p-4 font-medium text-gray-600">Subjects</th>
                <th className="p-4 font-medium text-gray-600">Price</th>
                <th className="p-4 font-medium text-gray-600">Experience</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>

            <tbody>
              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    Loading tutors...
                  </td>
                </tr>
              )}

              {/* No Data */}
              {!loading && filteredTutors.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-500">
                    No tutors found
                  </td>
                </tr>
              )}

              {/* Data */}
              {!loading &&
                filteredTutors.map(tutor => (
                  <tr
                    key={tutor._id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    {/* Tutor */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={resolveImage(tutor.profileImage)}
                          alt={tutor.fullName}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {tutor.fullName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {tutor.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Subjects */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {tutor.subjects?.slice(0, 3).map((s: string) => (
                          <span
                            key={s}
                            className="rounded-full bg-indigo-50 px-3 py-1 text-xs text-indigo-700"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Price */}
                    <td className="p-4 font-medium text-gray-700">
                      ₹{tutor.price}
                      <span className="text-xs text-gray-500">
                        /{tutor.priceType === "per_hour" ? "hr" : "month"}
                      </span>
                    </td>

                    {/* Experience */}
                    <td className="p-4 text-gray-600">
                      {tutor.yearsOfExperience}+ yrs
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex gap-3 text-sm font-medium">
                        {/* ✅ FIXED VIEW ROUTE */}
                        <button
                          onClick={() =>
                            router.push(`/tutors/${tutor._id}`)
                          }
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-red-600 hover:underline">
                          Suspend
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminDashboardLayout>
  );
}
