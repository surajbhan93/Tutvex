import apiClient from "@/lib/apiClient";

// 🔹 Get all tutors (Admin dashboard list)
export const getAllTutors = async () => {
  const res = await apiClient.get("/admin_dashboard/tutors");
  return res.data;
};

// 🔹 Get single tutor by ID (View page)
export const getTutorById = async (tutorId: string) => {
  const res = await apiClient.get(`/admin/tutors/${tutorId}`);
  return res.data;
};

// 🔹 Update tutor status (approve / reject)
export const updateTutorStatus = async (
  tutorId: string,
  status: "approved" | "rejected" | "pending"
) => {
  const res = await apiClient.patch(`/admin/tutors/${tutorId}`, {
    status,
  });
  return res.data;
};

// 🔹 Tutor dashboard stats
export const getTutorStats = async () => {
  const res = await apiClient.get("/admin/tutors/dashboard/stats");
  return res.data;
};
