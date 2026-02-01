"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  Wallet,
  Clock,
  CheckCircle,
} from "lucide-react";
import api from "@/lib/api";

export default function TutorPayments() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.get("/payments/tutor/dashboard").then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <motion.p
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-500"
        >
          Loading earnings...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6">
      {/* ================= FIND STUDENT HEADER ================= */}
        {/* ================= TUTOR EARNINGS HEADER ================= */}
<div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-5 text-white shadow">
  <h1 className="text-xl font-bold">
    Tutor Earnings
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    Track your monthly income, completed sessions, and payment
    history in one place.
  </p>
</div>

{/* ================= INFO / PRIVACY NOTE ================= */}
<div className="mb-6 rounded-xl bg-white p-4 shadow-sm text-sm text-gray-700">
  <p className="font-semibold text-gray-800 mb-1">
    Important Information
  </p>
  <ul className="list-disc pl-5 space-y-1">
    <li>
      Your earnings data is completely private and visible only
      to you.
    </li>
    <li>
      Payments are calculated based on completed and verified
      sessions.
    </li>
    <li>
      Monthly payouts are processed securely to your registered
      bank account.
    </li>
    <li>
      Any pending or delayed payments will be highlighted for
      transparency.
    </li>
  </ul>
</div>


      {/* 🔹 HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <h2 className="text-3xl font-bold text-gray-800">
          📈 Tutor Earnings
        </h2>
      </motion.div>

      {/* 🔹 STATS CARDS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* This Month */}
        <StatCard
          title="This Month"
          value={`₹${data.thisMonthEarning}`}
          icon={<IndianRupee />}
          gradient="from-green-500 to-emerald-500"
        />

        {/* Total Earned */}
        <StatCard
          title="Total Earned"
          value={`₹${data.totalEarning}`}
          icon={<Wallet />}
          gradient="from-blue-500 to-indigo-500"
        />

        {/* Pending */}
        <StatCard
          title="Pending Settlement"
          value={`₹${data.pendingSettlement}`}
          icon={<Clock />}
          gradient="from-orange-500 to-amber-500"
        />
      </div>

      {/* 🔹 PAYMENT HISTORY */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border bg-white shadow-sm"
      >
        <div className="border-b px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-800">
            💳 Payment History
          </h3>
        </div>

        {data.paymentHistory.length === 0 ? (
          <p className="p-6 text-sm text-gray-500">
            No payment records found.
          </p>
        ) : (
          <div className="divide-y">
            {data.paymentHistory.map((p: any, idx: number) => (
              <motion.div
                key={p.paymentId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between"
              >
                {/* Left */}
                <div>
                  <p className="font-medium text-gray-800">
                    {p.studentName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Payment ID: {p.paymentId}
                  </p>
                </div>

                {/* Middle */}
                <div className="text-sm text-gray-700">
                  Amount:{" "}
                  <span className="font-semibold">
                    ₹{p.amount}
                  </span>
                </div>

                {/* Right */}
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium
                    ${
                      p.settlementStatus === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  `}
                >
                  <CheckCircle className="h-4 w-4" />
                  {p.settlementStatus}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ================== STAT CARD COMPONENT ================== */

function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${gradient} p-6 text-white shadow-lg`}
    >
      <div className="absolute right-4 top-4 opacity-20">
        <div className="h-16 w-16">{icon}</div>
      </div>

      <p className="text-sm opacity-90">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </motion.div>
  );
}
