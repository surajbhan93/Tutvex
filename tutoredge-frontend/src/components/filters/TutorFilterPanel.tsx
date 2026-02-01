import React, { useEffect, useRef, useState } from "react";
import { Search, ChevronDown, IndianRupee } from "lucide-react";

import {
  SUBJECTS,
  CLASSES,
  BOARDS,
} from "@/lib/TutorFilterPanel";

// ✅ SINGLE SOURCE OF TRUTH FOR TYPE
import type { TutorFilters } from "@/lib/filterTutor";

/* ---------------- PROPS ---------------- */
interface Props {
  filters: TutorFilters;
  onChange: (filters: TutorFilters) => void;
}

const TutorFilterPanel: React.FC<Props> = ({
  filters,
  onChange,
}) => {
  /* ---------------- SUBJECT DROPDOWN STATE ---------------- */
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [subjectSearch, setSubjectSearch] = useState("");
  const subjectRef = useRef<HTMLDivElement>(null);

  const filteredSubjects = SUBJECTS.filter((s) =>
    s.toLowerCase().includes(subjectSearch.toLowerCase())
  );

  /* ---------------- CLOSE ON OUTSIDE CLICK ---------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        subjectRef.current &&
        !subjectRef.current.contains(e.target as Node)
      ) {
        setSubjectOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div
      className="
        bg-white/80 backdrop-blur-xl
        rounded-3xl shadow-xl
        p-6
        grid grid-cols-1 md:grid-cols-3 gap-6
      "
    >
      {/* ---------------- SUBJECT (SEARCHABLE) ---------------- */}
      <div ref={subjectRef} className="relative">
        <label className="text-sm font-semibold block mb-1">
          Subject
        </label>

        <button
          type="button"
          onClick={() => setSubjectOpen((p) => !p)}
          className="
            w-full px-4 py-2 rounded-xl border
            flex items-center justify-between
            bg-white hover:bg-gray-50
          "
        >
          <span
            className={
              filters.subject
                ? "text-gray-900"
                : "text-gray-400"
            }
          >
            {filters.subject || "Select subject"}
          </span>
          <ChevronDown size={18} />
        </button>

        {subjectOpen && (
          <div
            className="
              absolute z-50 mt-2 w-full
              bg-white border rounded-xl shadow-xl
              overflow-hidden
            "
          >
            {/* Search */}
            <div className="p-3 border-b flex items-center gap-2">
              <Search size={16} className="text-gray-500" />
              <input
                value={subjectSearch}
                onChange={(e) =>
                  setSubjectSearch(e.target.value)
                }
                placeholder="Search subject"
                className="w-full text-sm outline-none"
              />
            </div>

            {/* Subject list */}
            <div className="max-h-52 overflow-y-auto">
              {filteredSubjects.length === 0 && (
                <p className="px-4 py-2 text-sm text-gray-500">
                  No subject found
                </p>
              )}

              {filteredSubjects.map((sub) => (
                <button
                  key={sub}
                  onClick={() => {
                    onChange({
                      ...filters,
                      subject: sub,
                    });
                    setSubjectOpen(false);
                    setSubjectSearch("");
                  }}
                  className="
                    w-full text-left px-4 py-2 text-sm
                    hover:bg-indigo-50
                  "
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- CLASS ---------------- */}
      <div>
        <label className="text-sm font-semibold block mb-1">
          Class
        </label>
        <select
          value={filters.classLevel}
          onChange={(e) =>
            onChange({
              ...filters,
              classLevel: e.target.value,
            })
          }
          className="w-full px-4 py-2 border rounded-xl"
        >
          <option value="">All Classes</option>
          {CLASSES.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- BOARD ---------------- */}
      <div>
        <label className="text-sm font-semibold block mb-1">
          Board
        </label>
        <select
          value={filters.board}
          onChange={(e) =>
            onChange({
              ...filters,
              board: e.target.value,
            })
          }
          className="w-full px-4 py-2 border rounded-xl"
        >
          <option value="">All Boards</option>
          {BOARDS.map((board) => (
            <option key={board} value={board}>
              {board}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- LOCATION ---------------- */}
      <div>
        <label className="text-sm font-semibold block mb-1">
          Location
        </label>
        <input
          value={filters.location}
          onChange={(e) =>
            onChange({
              ...filters,
              location: e.target.value,
            })
          }
          placeholder="City / Area"
          className="w-full px-4 py-2 border rounded-xl"
        />
      </div>

      {/* ---------------- PRICE ---------------- */}
      <div className="md:col-span-2">
        <label className="text-sm font-semibold block mb-1 flex items-center gap-1">
          <IndianRupee size={16} />
          Max Price: ₹{filters.price.toLocaleString()}
        </label>
        <input
          type="range"
          min={500}
          max={12000}
          step={500}
          value={filters.price}
          onChange={(e) =>
            onChange({
              ...filters,
              price: Number(e.target.value),
            })
          }
          className="w-full accent-indigo-600"
        />
      </div>
    </div>
  );
};

export default TutorFilterPanel;
