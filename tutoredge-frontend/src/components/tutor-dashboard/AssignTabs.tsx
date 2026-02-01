"use client";

import { useRouter } from "next/navigation";

/* ======================
   TYPES
====================== */
interface TabItem {
  key: "assign" | "assigned" | "submitted";
  label: string;
  path: string;
}

interface Props {
  active: "assign" | "assigned" | "submitted";
}

/* ======================
   COMPONENT
====================== */
export default function AssignTabs({ active }: Props) {
  const router = useRouter();

  const tabs: TabItem[] = [
    {
      key: "assign",
      label: "Assign Assignment",
      path: "/tutor/assignments/assign",
    },
    {
      key: "assigned",
      label: "Assigned",
      path: "/tutor/assign-assignments/assigned",
    },
    {
      key: "submitted",
      label: "Submitted",
      path: "/tutor/assign-assignments/submitted",
    },
  ];

  return (
    <div className="flex gap-6 border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => router.push(tab.path)}
          className={`pb-2 text-sm font-medium transition ${
            active === tab.key
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
