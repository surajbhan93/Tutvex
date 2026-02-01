import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import LogoutConfirm from "@/components/admin-dashboard/LogoutConfirm";
import AdminSidebar from "@/components/admin-dashboard/AdminSidebar";
import NavBar from "@/components/navbar/NavBar";
import toast from "react-hot-toast";

export default function AdminLogoutPage() {
  const router = useRouter();

const handleLogout = async () => {
  try {
    // Try backend logout (optional for JWT)
    await apiClient.post("/admin/logout");

    toast.success("Logout successful");
  } catch (err) {
    console.warn("Backend logout failed, forcing frontend logout");

    // ❗ Backend fail ho tab bhi logout allow
    toast.success("Logged out");
  } finally {
    // 🔥 REAL LOGOUT (THIS IS THE KEY)
    localStorage.removeItem("auth-storage");

    // optional safety cleanup
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    // ❗ VERY IMPORTANT: remove token from axios
    delete apiClient.defaults.headers.Authorization;

    // redirect
    setTimeout(() => {
      router.replace("/login");
    }, 600);
  }
};



  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <div className="flex flex-1 flex-col">
        <NavBar />

        <div className="flex flex-1 items-center justify-center">
          <LogoutConfirm
            onConfirm={handleLogout}
            onCancel={() => router.back()}
          />
        </div>
      </div>
    </div>
  );
}
