import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  BookOpen,
  Wallet,
  BarChart3,
} from "lucide-react";

import ParentFlow from "./ParentFlow";
import TutorFlow from "./TutorFlow";

type ViewType = "parent" | "tutor";

/* ======================
   SUMMARY DATA
====================== */
const SUMMARY = {
  parent: [
    {
      icon: <ShieldCheck className="text-green-600" />,
      title: "Verified Tutors",
      desc: "Background-checked, interviewed & approved tutors only.",
    },
    {
      icon: <BookOpen className="text-indigo-600" />,
      title: "All Subjects & Boards",
      desc: "CBSE, ICSE & State Board tutors for all major subjects.",
    },
    {
      icon: <BarChart3 className="text-indigo-600" />,
      title: "Parent Dashboard",
      desc: "Track attendance, performance & monthly reports.",
    },
  ],
  tutor: [
    {
      icon: <Users className="text-indigo-600" />,
      title: "Real Student Leads",
      desc: "Get matched with students based on subject & location.",
    },
    {
      icon: <Wallet className="text-green-600" />,
      title: "Transparent Payments",
      desc: "Clear earnings, payouts & payment history.",
    },
    {
      icon: <BarChart3 className="text-indigo-600" />,
      title: "Tutor Dashboard",
      desc: "Manage students, assignments & income easily.",
    },
  ],
};

export default function HowItWorksToggle() {
  const router = useRouter();
  const { type } = router.query;

  const [active, setActive] = useState<ViewType>("parent");

  /* ======================
     READ FROM URL
  ====================== */
  useEffect(() => {
    if (type === "parent" || type === "tutor") {
      setActive(type);
    }
  }, [type]);

  /* ======================
     UPDATE URL ON TOGGLE
  ====================== */
  const changeView = (view: ViewType) => {
    setActive(view);

    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, type: view },
      },
      undefined,
      { shallow: true }
    );
  };

  return (
    <section className="mt-4 space-y-10">
      {/* ======================
          HEADER
      ====================== */}
      {/* <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
          How Tutvex Works
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          A simple and transparent process built separately
          for parents and tutors.
        </p>
      </div> */}

      {/* ======================
          TOGGLE
      ====================== */}
      <div className="flex justify-center">
        <div className="relative inline-flex bg-gray-100 rounded-2xl p-1 shadow-inner">
          <button
            onClick={() => changeView("parent")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition
              ${active === "parent" ? "text-white" : "text-gray-700"}
            `}
          >
            <Users size={18} />
            For Parents
          </button>

          <button
            onClick={() => changeView("tutor")}
            className={`relative z-10 flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition
              ${active === "tutor" ? "text-white" : "text-gray-700"}
            `}
          >
            <GraduationCap size={18} />
            For Tutors
          </button>

          {/* Slider */}
          <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute top-1 bottom-1 w-1/2 rounded-xl bg-indigo-600 shadow-md"
            style={{
              left: active === "parent" ? "4px" : "50%",
            }}
          />
        </div>
      </div>

      {/* ======================
          SUMMARY CARDS
      ====================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="
            grid gap-6
            sm:grid-cols-2 lg:grid-cols-3
            max-w-6xl mx-auto
          "
        >
          {SUMMARY[active].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-indigo-50">
                  {item.icon}
                </div>
                <h4 className="font-semibold text-gray-900">
                  {item.title}
                </h4>
              </div>
              <p className="text-sm text-gray-600">
                {item.desc}
              </p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ======================
          FLOW CONTENT
      ====================== */}
      <AnimatePresence mode="wait">
        {active === "parent" ? (
          <motion.div
            key="parent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <ParentFlow />
          </motion.div>
        ) : (
          <motion.div
            key="tutor"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
          >
            <TutorFlow />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
