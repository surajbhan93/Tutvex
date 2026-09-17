import { Home, Bell, BookOpen, User } from "lucide-react";
import { useRouter } from "next/router";

const navItems = [
  {
    label: "Home",
    icon: Home,
    path: "/parent/dashboard",
  },
  {
    label: "Classes",
    icon: BookOpen,
    path: "/parent/classes",
  },
  {
    label: "Alerts",
    icon: Bell,
    path: "/parent/notifications",
  },
  {
    label: "Profile",
    icon: User,
    path: "/parent/profile",
  },
];

export default function ParentMobileNavbar() {
  const router = useRouter();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow md:hidden">
      <div className="flex justify-around items-center h-14">
        {navItems.map((item) => {
          const isActive = router.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center text-xs transition
                ${isActive ? "text-blue-600" : "text-gray-500"}
              `}
            >
              <Icon size={22} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
