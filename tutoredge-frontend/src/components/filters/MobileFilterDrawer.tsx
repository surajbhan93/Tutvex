import { useRouter } from "next/router";
import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search } from "lucide-react";

import {
  BOARDS,
  MEDIUMS,
  ALL_SUBJECTS,
} from "@/lib/constants";

/**
 * MobileFilterDrawer
 * - Bottom sheet UX
 * - URL based filters
 * - Searchable subjects
 * - Clear filters
 */
export default function MobileFilterDrawer() {
  const router = useRouter();
  const { board, subject, medium } = router.query;

  const [open, setOpen] = useState(false);
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
    setOpen(false);
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
    <>
      {/* Trigger */}
      <button
        onClick={() => setOpen(true)}
        className="
          lg:hidden w-full mb-4
          rounded-xl bg-indigo-600
          py-3 text-white font-semibold
          flex items-center justify-center gap-2
        "
      >
        <Filter size={18} />
        Filters
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/40 z-40"
          />
        )}
      </AnimatePresence>

      {/* Bottom Sheet */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 25 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120) setOpen(false);
            }}
            className="
              fixed bottom-0 left-0 right-0 z-50
              rounded-t-3xl bg-white
              shadow-xl
            "
          >
            {/* Handle */}
            <div className="flex justify-center pt-2">
              <span className="h-1.5 w-10 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="text-lg font-bold text-gray-900">
                Filters
              </h3>

              <div className="flex items-center gap-3">
                {(board || subject || medium) && (
                  <button
                    onClick={resetFilters}
                    className="text-sm text-red-500"
                  >
                    Clear
                  </button>
                )}
                <button onClick={() => setOpen(false)}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="max-h-[70vh] overflow-y-auto px-5 py-4 space-y-8 text-sm">

              <FilterSection
                title="Board"
                items={BOARDS.map((b) => b.label)}
                activeValue={board as string}
                onSelect={(v) => {
                  updateFilter("board", v.toLowerCase());
                  setOpen(false);
                }}
              />

              <FilterSection
                title="Medium"
                items={MEDIUMS.map((m) => m.label)}
                activeValue={medium as string}
                onSelect={(v) => {
                  updateFilter("medium", v.toLowerCase());
                  setOpen(false);
                }}
              />

              {/* Subjects */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">
                  Subjects
                </h4>

                {/* Subject Search */}
                <div className="relative">
                  <Search
                    size={16}
                    className="
                      absolute left-3 top-1/2
                      -translate-y-1/2 text-gray-400
                    "
                  />
                  <input
                    value={subjectSearch}
                    onChange={(e) =>
                      setSubjectSearch(e.target.value)
                    }
                    placeholder="Search subjects..."
                    className="
                      w-full rounded-xl border
                      border-gray-300 bg-white
                      py-2 pl-9 pr-3 text-sm
                      focus:border-indigo-500
                      focus:ring-2 focus:ring-indigo-200
                      outline-none
                    "
                  />
                </div>

                <FilterSection
                  title=""
                  items={filteredSubjects}
                  activeValue={subject as string}
                  onSelect={(v) => {
                    updateFilter(
                      "subject",
                      v.toLowerCase().replace(/\s+/g, "-")
                    );
                    setOpen(false);
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* =========================
   REUSABLE FILTER SECTION
========================= */
function FilterSection({
  title,
  items,
  activeValue,
  onSelect,
}: {
  title: string;
  items: string[];
  activeValue?: string;
  onSelect: (value: string) => void;
}) {
  return (
    <section className="space-y-3">
      {title && (
        <h4 className="font-semibold text-gray-900">
          {title}
        </h4>
      )}

      <ul className="space-y-2">
        {items.map((item) => {
          const slug = item.toLowerCase().replace(/\s+/g, "-");
          const isActive = activeValue === slug;

          return (
            <li
              key={item}
              onClick={() => onSelect(item)}
              className={`
                cursor-pointer rounded-lg px-3 py-2 transition
                ${
                  isActive
                    ? "bg-indigo-100 text-indigo-700 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }
              `}
            >
              {item}
            </li>
          );
        })}

        {!items.length && (
          <li className="text-xs text-gray-500 px-2">
            No results found
          </li>
        )}
      </ul>
    </section>
  );
}
