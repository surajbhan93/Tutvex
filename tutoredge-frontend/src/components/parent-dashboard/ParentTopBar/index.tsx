import React from "react";
import { Bell, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown } from "flowbite-react";

interface ParentTopBarProps {
  parentName: string;
  studentName: string;
  notificationsCount: number;
}

const ParentTopBar: React.FC<ParentTopBarProps> = ({
  parentName,
  studentName,
  notificationsCount,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b">
      <div className="h-16 px-4 md:px-6 flex items-center justify-between">

        {/* Left: Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src="/images/logo1.png"
            width={36}
            height={36}
            alt="Tutvex Logo"
          />
          <span className="text-lg font-semibold text-gray-800">
            Tutvex
          </span>
        </div>

        {/* Center: Parent Name (Desktop only) */}
        <div className="hidden md:flex">
          <div
            className="
              px-5 py-1.5 rounded-full
              bg-gradient-to-r from-blue-500 to-indigo-500
              text-white font-semibold text-sm
              shadow-md
              animate-fade-slide
            "
          >
            👋 Welcome, {parentName || "Parent"}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button
            onClick={() => router.push("/parent/notifications")}
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
          >
            <Bell size={22} />
            {notificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1 animate-pulse">
                {notificationsCount}
              </span>
            )}
          </button>

          {/* Profile Dropdown */}
          <Dropdown
            inline
            label={
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {parentName?.charAt(0) ?? "P"}
              </div>
            }
          >
            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold">
                {parentName || "Parent"}
              </p>
              <p className="text-xs text-gray-500">
                Student: {studentName || "Student"}
              </p>
            </div>

            <button
              onClick={() => router.push("/parent/profile")}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <User size={16} className="mr-2" />
              Profile
            </button>

            <button
              onClick={() => router.push("/parent/notifications")}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Bell size={16} className="mr-2" />
              Notifications
            </button>

            <div className="border-t my-1" />

            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default ParentTopBar;
