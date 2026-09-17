import { useRouter } from "next/router";
import LogoutConfirm from "@/components/common/LogoutConfirm";
import TutorSidebar from "@/components/tutor-dashboard/Sidebar";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TutorLogoutPage() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    try {
      // Clear Zustand auth store (localStorage)
      logout();
      
      // Clear all cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      toast.success("Logged out successfully");
      
      setTimeout(() => {
        router.replace("/login");
      }, 500);
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* LEFT SIDEBAR */}
      <TutorSidebar />

      {/* RIGHT CONTENT */}
      <div className="flex flex-1 flex-col">
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
