"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { startParentPayment } from "./RazorpayCheckout";
import { motion } from "framer-motion";
import { IndianRupee, CheckCircle2, AlertCircle } from "lucide-react";

export default function ParentPayments() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchDashboard = () => {
    setLoading(true);
    api
      .get("/payments/parent/dashboard")
      .then(res => setData(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading)
    return <p style={{ padding: 16 }}>Loading payments...</p>;
  if (!data)
    return <p style={{ padding: 16 }}>No payment data</p>;

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  return (
    <div style={{ padding: 12 }}>
      {/* HEADER */}
     {/* ================= PARENT PAYMENTS HEADER ================= */}
<div className="mb-6 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
  <h1 className="text-xl font-bold">
    💳Parent Payments
  </h1>
  <p className="mt-1 text-sm text-indigo-100">
    View payment history, manage pending dues, and make secure
    payments for your child’s learning.
  </p>
</div>


      {/* SUMMARY CARDS */}
    <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: 10,
            marginBottom: 16,
          }}
        >

        {[
          ["This Month", data.thisMonthPaid],
          ["Last Month", data.lastMonthPaid],
          ["Total Paid", data.totalPaid],
          ["Total Due", data.totalDue],
        ].map(([label, value]) => (
          <div
            key={label}
            style={{
              background: "#f8f9fa",
              padding: 10,
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            <div style={{ color: "#666" }}>{label}</div>
            <div style={{ fontWeight: 700 }}>
              ₹{value}
            </div>
          </div>
        ))}
      </div>

      <h3 style={{ marginBottom: 8 }}>Students</h3>

      {/* STUDENT CARDS */}
      {data.studentWise.map((s: any) => (
        <motion.div
          key={s.requestId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 14,
            marginBottom: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontWeight: 600 }}>
            {s.studentName || "Student"}
          </div>
          <div style={{ fontWeight: 600 }}>{s.studentName}</div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Tutor: {s.tutorName}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: 6,
              fontSize: 14,
            }}
          >
            <IndianRupee size={14} />
            <span style={{ marginLeft: 4 }}>
              Monthly Fee: {s.monthlyFee}
            </span>
          </div>

          {s.paidThisMonth ? (
            <div
              style={{
                marginTop: 10,
                display: "flex",
                alignItems: "center",
                color: "green",
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={16} style={{ marginRight: 6 }} />
              Paid for this month
            </div>
          ) : (
            <>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  color: "#dc3545",
                }}
              >
                <AlertCircle size={16} style={{ marginRight: 6 }} />
                Due ₹{s.due}
              </div>

              <button
                disabled={payingId === s.requestId}
                style={{
                  marginTop: 10,
                  width: "100%",
                  padding: "10px",
                  background:
                    payingId === s.requestId ? "#adb5bd" : "#198754",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 15,
                }}
               onClick={() => {
                  if (payingId === s.requestId) return; // 🔒 extra safety

                  if (!s.requestId) {
                    console.error("INVALID REQUEST ID", s);
                    alert("Invalid payment request. Please refresh.");
                    return;
                  }

                  setPayingId(s.requestId);

                  startParentPayment({
                    parentRequestId: s.requestId,
                    month,
                    year,
                    onSuccess: () => {
                      router.push("/parent/payments/payment-success");
                    },
                  }).finally(() => setPayingId(null));
                }}
            

              >
                {payingId === s.requestId
                  ? "Processing..."
                  : `Pay Now ₹${s.due}`}
              </button>
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
}

