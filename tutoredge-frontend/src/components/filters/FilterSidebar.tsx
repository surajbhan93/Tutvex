import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { X, Search, Filter } from "lucide-react";

import FilterSection from "./FilterSection";
import { BOARDS, MEDIUMS, ALL_SUBJECTS } from "@/lib/constants";

/**
 * FilterSidebar
 * - URL based filtering
 * - Scalable for 300+ subjects
 * - Search inside subjects
 * - Reset filters
 * - Premium UI
 */
export default function FilterSidebar() {
  const router = useRouter();
  const { board, subject, medium } = router.query;

  const [subjectSearch, setSubjectSearch] = useState("");

  /* ======================
     UPDATE FILTER
  ====================== */
  const updateFilter = useCallback(
    (key: string, value: string) => {
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            [key]: value,
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  /* ======================
     RESET FILTERS
  ====================== */
  const resetFilters = () => {
    router.push(
      { pathname: router.pathname },
      undefined,
      { shallow: true }
    );
  };

  /* ======================
     SUBJECT SEARCH
  ====================== */
  const filteredSubjects = useMemo(() => {
    return ALL_SUBJECTS.filter((s) =>
      s.toLowerCase().includes(subjectSearch.toLowerCase())
    );
  }, [subjectSearch]);

  return (
    <aside className="hidden lg:block w-80 sticky top-24 h-[calc(100vh-120px)]">
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="
          h-full
          overflow-y-auto
          rounded-2xl
          bg-white
          p-6
          shadow-md
          space-y-8
        "
      >
        {/* ======================
            HEADER
        ====================== */}
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900">
            <Filter size={18} className="text-indigo-600" />
            Filters
          </h3>

          {(board || subject || medium) && (
            <button
              onClick={resetFilters}
              className="
                text-sm
                text-red-500
                hover:underline
                flex
                items-center
                gap-1
              "
            >
              <X size={14} />
              Clear
            </button>
          )}
        </div>

        {/* ======================
            BOARD FILTER
        ====================== */}
        <FilterSection
          title="Board"
          items={BOARDS.map((b) => b.label)}
          activeValue={board as string}
          onSelect={(val) =>
            updateFilter("board", val.toLowerCase())
          }
        />

        {/* ======================
            MEDIUM FILTER
        ====================== */}
        <FilterSection
          title="Medium"
          items={MEDIUMS.map((m) => m.label)}
          activeValue={medium as string}
          onSelect={(val) =>
            updateFilter("medium", val.toLowerCase())
          }
        />

        {/* ======================
            SUBJECT FILTER
        ====================== */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-800">
            Subjects
          </h4>

          {/* Subject Search */}
          <div className="relative">
            <Search
              size={16}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />
            <input
              value={subjectSearch}
              onChange={(e) =>
                setSubjectSearch(e.target.value)
              }
              placeholder="Search subjects..."
              className="
                w-full
                rounded-xl
                border
                border-gray-300
                bg-white
                py-2
                pl-9
                pr-3
                text-sm
                focus:border-indigo-500
                focus:ring-2
                focus:ring-indigo-200
                outline-none
              "
            />
          </div>

          {/* Subject List */}
          <div className="max-h-64 overflow-y-auto pr-1">
            <FilterSection
              title=""
              items={filteredSubjects}
              activeValue={subject as string}
              onSelect={(val) =>
                updateFilter(
                  "subject",
                  val.toLowerCase().replace(/\s+/g, "-")
                )
              }
            />
          </div>
        </div>
      </motion.div>
    </aside>
  );
}
