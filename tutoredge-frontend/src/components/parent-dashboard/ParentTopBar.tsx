"use client";

import React from "react";
import { Bell, Menu, LogOut, User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dropdown } from "flowbite-react";

interface ParentTopBarProps {
  parentName: string;
  studentName: string;
  notificationsCount: number;
  onMenuClick: () => void;
}

const ParentTopBar: React.FC<ParentTopBarProps> = ({
  parentName,
  studentName,
  notificationsCount,
  onMenuClick,
}) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <header
      className="
        sticky top-0 z-50 w-full
        bg-white/30 backdrop-blur-lg
        border-b border-white/30
        relative
      "
    >
      {/* MAIN NAV BAR */}
      <div className="h-16 px-4 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-md hover:bg-black/10"
          >
            <Menu size={22} />
          </button>

          <Image
            src="/images/logo1.png"
            width={32}
            height={32}
            alt="Tutvex"
            priority
          />

          <span className="hidden sm:block text-lg font-semibold">
            Tutvex
          </span>
        </div>

        {/* CENTER (Desktop Welcome) */}
        <div className="hidden md:block">
          <div className="
            px-5 py-1.5 rounded-full
            bg-gradient-to-r from-blue-500/80 to-indigo-500/80
            backdrop-blur-md
            text-white text-sm font-semibold
          ">
            👋 Welcome, {parentName}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* Notifications (optional) */}
          {notificationsCount > 0 && (
            <button
              onClick={() => router.push("/parent/notifications")}
              className="relative p-2 rounded-md hover:bg-black/10"
            >
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1 rounded-full">
                {notificationsCount}
              </span>
            </button>
          )}

          {/* Avatar Dropdown */}
          <Dropdown
            inline
            placement="bottom-end"
            label={
              <Image
                src="https://ui-avatars.com/api/?name=Parent&background=6366f1&color=fff&size=128"
                alt="Parent"
                width={36}
                height={36}
                className="rounded-full border border-white/50"
              />
            }
          >

            <div className="px-4 py-2 border-b">
              <p className="text-sm font-semibold">{parentName}</p>
              <p className="text-xs text-gray-500">
                Student: {studentName}
              </p>
            </div>

            <button
              onClick={() => router.push("/parent/profile")}
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <User size={16} className="mr-2" />
              Profile
            </button>

            <button
              onClick={() => router.push("/parent/notifications")}
              className="flex w-full items-center px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Bell size={16} className="mr-2" />
              Notifications
            </button>

            <div className="border-t my-1" />

            <button
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </Dropdown>
        </div>
      </div>

      {/* MOBILE WELCOME — INSIDE NAVBAR */}
     {/* MOBILE WELCOME — CENTERED */}
<div
  className="
    md:hidden
    absolute bottom-0 left-1/2 -translate-x-1/2
    px-4 py-1.5
    bg-gradient-to-r from-blue-500/20 to-indigo-500/20
    backdrop-blur-md
    text-white text-sm font-semibold
    rounded-full
    whitespace-nowrap
    pointer-events-none
    text-center
  "
>
  👋 Welcome, {parentName}
</div>

    </header>
  );
};

export default ParentTopBar;
