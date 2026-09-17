import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";

interface Testimonial {
  _id: string;
  name: string;
  role: string;
  rating: number;
  message: string;
  image?: string;
  isApproved: boolean;
  isFeatured: boolean;
  date: string;
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const resolveImage = (path?: string) => {
    if (!path) return "/images/default-avatar.png";
    if (path.startsWith("http")) return path;
    return `${BACKEND_URL}${path}`;
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    const res = await apiClient.get("/admin/testimonials");
    setTestimonials(res.data.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const approveTestimonial = async (id: string) => {
    await apiClient.patch(`/admin/testimonials/${id}/approve`);
    fetchTestimonials();
  };

  const featureTestimonial = async (id: string) => {
    await apiClient.patch(`/admin/testimonials/${id}/feature`);
    fetchTestimonials();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    await apiClient.delete(`/admin/testimonials/${id}`);
    fetchTestimonials();
  };

  return (
    <AdminDashboardLayout>
      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Testimonials
        </h1>
        <p className="text-sm text-gray-500">
          Manage user testimonials (approve, feature, delete)
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading testimonials...</p>
      ) : (
        <div className="space-y-6">
          {testimonials.map((t) => (
            <div
              key={t._id}
              className="bg-white rounded-xl p-5 border shadow-sm flex gap-4"
            >
              {/* Image */}
              <img
                src={resolveImage(t.image)}
                alt={t.name}
                className="w-12 h-12 rounded-full object-cover border"
              />

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {t.role}
                    </p>
                  </div>

                  <span className="text-xs text-gray-400">
                    {new Date(t.date).toLocaleDateString("en-IN")}
                  </span>
                </div>

                <p className="mt-2 italic text-gray-700">
                  “{t.message}”
                </p>

                <div className="mt-2 text-yellow-500 text-sm">
                  {"★".repeat(t.rating)}
                  {"☆".repeat(5 - t.rating)}
                </div>

                {/* Status */}
                <div className="mt-3 flex gap-2 text-xs">
                  {!t.isApproved && (
                    <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-700">
                      Pending
                    </span>
                  )}
                  {t.isApproved && (
                    <span className="px-2 py-1 rounded bg-green-100 text-green-700">
                      Approved
                    </span>
                  )}
                  {t.isFeatured && (
                    <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700">
                      Featured
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                  {!t.isApproved && (
                    <button
                      onClick={() => approveTestimonial(t._id)}
                      className="px-3 py-1 text-xs rounded bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                  )}

                  {t.isApproved && !t.isFeatured && (
                    <button
                      onClick={() => featureTestimonial(t._id)}
                      className="px-3 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Feature
                    </button>
                  )}

                  <button
                    onClick={() => deleteTestimonial(t._id)}
                    className="px-3 py-1 text-xs rounded bg-red-600 text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminDashboardLayout>
  );
}
