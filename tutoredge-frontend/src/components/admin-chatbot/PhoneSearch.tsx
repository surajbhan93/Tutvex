"use client";

import { useState } from "react";

export default function PhoneSearch({
  onSearch,
}: {
  onSearch: (phone: string) => void;
}) {
  const [phone, setPhone] = useState("");

  return (
    <div className="flex gap-2">
      <input
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Search by phone"
        className="border rounded px-3 py-2 text-sm w-48"
      />
      <button
        onClick={() => onSearch(phone)}
        className="bg-green-500 text-white px-4 py-2 rounded text-sm"
      >
        Search
      </button>
    </div>
  );
}
