"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { startParentPayment } from "./RazorpayCheckout";
import { motion } from "framer-motion";
import {
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Wallet,
  CalendarDays,
} from "lucide-react";

export default function PaymentSummaryCard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const res = await api.get("/payments/parent/summary");
      setData(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading)
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
        Loading payment summary...
      </div>
    );

  if (!data)
    return (
      <div className="rounded-xl bg-white p-6 text-sm text-gray-500">
        No payment data
      </div>
    );

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl bg-white p-6 shadow-sm"
    >
      {/* ================= HEADER ================= */}
      <h2 className="text-xl font-bold">💰 Payment Summary</h2>
      <p className="mt-1 text-sm text-gray-500">
        Yahan aap apne students ke monthly payments ka status
        dekh sakte hain.
      </p>

      {/* ================= SUMMARY ================= */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        {[
          {
            label: "This Month Paid",
            value: data.thisMonthPaid,
            icon: CalendarDays,
          },
          {
            label: "Last Month Paid",
            value: data.lastMonthPaid,
            icon: CalendarDays,
          },
          {
            label: "Total Paid",
            value: data.totalPaid,
            icon: Wallet,
          },
          {
            label: "Total Due",
            value: data.totalDue,
            icon: AlertCircle,
          },
        ].map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg bg-slate-50 p-3 text-sm"
          >
            <div className="flex items-center gap-2 text-gray-500">
              <Icon size={16} />
              {label}
            </div>
            <div className="mt-1 text-lg font-bold">
              ₹{value}
            </div>
          </div>
        ))}
      </div>

      {/* ================= STUDENT PAYMENTS ================= */}
      <h3 className="mt-6 mb-3 text-lg font-semibold">
        👨‍🎓 Student-wise Payments
      </h3>

      <div className="space-y-4">
        {data.studentWise.map((s: any) => {
          const isPaying = payingId === s.requestId;

          return (
            <div
              key={s.requestId}
              className="rounded-xl border bg-white p-4 shadow-sm"
            >
              {/* STUDENT INFO */}
              <div className="font-semibold">
                {s.studentName}
              </div>
              <div className="text-sm text-gray-500">
                Tutor: {s.tutorName}
              </div>

              {/* FEE */}
              <div className="mt-2 flex items-center gap-1 text-sm">
                <IndianRupee size={14} />
                Monthly Fee: {s.monthlyFee}
              </div>

              {/* STATUS */}
              {s.paidThisMonth ? (
                <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-green-600">
                  <CheckCircle2 size={16} />
                  Paid for this month
                </div>
              ) : (
                <>
                  <div className="mt-3 flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    Due ₹{s.due}
                  </div>

                  <button
                    disabled={isPaying}
                    className={`mt-3 w-full rounded-lg py-2 text-sm font-semibold text-white transition ${
                      isPaying
                        ? "cursor-not-allowed bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    onClick={async () => {
                      setPayingId(s.requestId);
                      try {
                        await startParentPayment({
                          parentRequestId: s.requestId,
                          month,
                          year,
                          onSuccess: fetchSummary,
                        });
                      } catch {
                        alert("Payment failed, try again");
                      } finally {
                        setPayingId(null);
                      }
                    }}
                  >
                    {isPaying
                      ? "Processing..."
                      : `Pay Now ₹${s.due}`}
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
