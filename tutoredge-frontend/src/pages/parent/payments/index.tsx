"use client";

import { useState } from "react";
import ParentPayments from "@/components/parent-dashboard/payments/ParentPayments";
import PaymentSummaryCard from "@/components/parent-dashboard/payments/PaymentSummaryCard";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";


export default function ParentPaymentsPage() {
  const [showSummary, setShowSummary] = useState(false);

  return (
    <ParentDashboardLayout>
     

      <ParentPayments />

      {/* 🔥 BUTTON */}
      <div style={{ marginTop: 24 }}>
        <button
          onClick={() => setShowSummary(true)}
          style={{
            padding: "10px 16px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          View Payment Summary
        </button>
      </div>

      {/* ================= MODAL ================= */}
      {showSummary && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setShowSummary(false)}
        >
          <div
            style={{
              background: "#fff",
              width: "90%",
              maxWidth: 520,
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>
                💰 Payment Summary
              </h3>

              <button
                onClick={() => setShowSummary(false)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                ❌
              </button>
            </div>

            {/* Summary Content */}
            <PaymentSummaryCard />
          </div>
        </div>
      )}
    </ParentDashboardLayout>
  );
}
