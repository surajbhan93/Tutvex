import { useRouter } from "next/router";
import apiClient from "@/lib/apiClient";
import LogoutConfirm from "@/components/common/LogoutConfirm";
import TutorSidebar from "@/components/tutor-dashboard/Sidebar";
// import NavBar from "@/components/navbar/NavBar";
import toast from "react-hot-toast";

export default function TutorLogoutPage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await apiClient.post("/tutor/logout");
      toast.success("Logout successful");
    } catch (err) {
      console.warn("Backend logout failed, forcing frontend logout");
      toast.success("Logged out");
    } finally {
      // 🔥 REAL LOGOUT
      localStorage.removeItem("auth-storage");
      delete apiClient.defaults.headers.Authorization;

      setTimeout(() => {
        router.replace("/login");
      }, 700);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <TutorSidebar />

      {/* RIGHT CONTENT */}
      <div className="flex flex-1 flex-col">
        {/* <NavBar /> */}

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
