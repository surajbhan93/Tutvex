"use client";

import Link from "next/link";
import { useState } from "react";
import ParentDashboardLayout from "@/layouts/ParentDashboardLayout";
import { CreditCard, Smartphone } from "lucide-react";

// Recharts
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export default function PaymentMethodsPage() {
  const cards: Array<{ brand: string; last4: string; exp: string }> = [];

  const [showUPIModal, setShowUPIModal] = useState(false);
  const [upiId, setUpiId] = useState("");

  const handlePayWithUPI = () => {
    if (!upiId.trim()) return;

    // simulate success
    setShowUPIModal(false);
    setUpiId("");
    alert("✅ Payment initiated via UPI");
  };

  // 🔹 dummy payment stats
  const paymentStats = [
    { name: "UPI", value: 65 },
    { name: "Card", value: 35 },
  ];

  const COLORS = ["#22c55e", "#3b82f6"];

  return (
    <ParentDashboardLayout>
      <div className="space-y-6">

        {/* ===== HEADER ===== */}
        <div className="rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white shadow">
          <h1 className="text-2xl font-bold">Payment Methods</h1>
          <p className="mt-1 text-sm text-indigo-100">
            Manage your saved cards and make secure payments using UPI or Card.
          </p>
        </div>

        {/* ===== ACTION BAR ===== */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Payment Options
          </h2>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/parent/payment-methods/add-card"
              className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <CreditCard size={16} /> Add Card
            </Link>

            <button
              onClick={() => setShowUPIModal(true)}
              className="flex items-center gap-2 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
            >
              <Smartphone size={16} /> Pay with UPI
            </button>
          </div>
        </div>

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* ---- CARDS LIST ---- */}
          <div className="lg:col-span-2 rounded-xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4">
              <h3 className="font-semibold text-gray-800">
                Saved Cards
              </h3>
              <p className="text-sm text-gray-500">
                Your cards are securely stored.
              </p>
            </div>

            {cards.length === 0 ? (
              <div className="p-6 text-sm text-gray-600">
                No saved cards yet. Add a card to make faster payments.
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-3 bg-gray-50 px-5 py-3 text-sm font-semibold text-gray-600">
                  <div>Brand</div>
                  <div>Last 4</div>
                  <div className="text-right">Expiry</div>
                </div>

                {cards.map((c, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 items-center px-5 py-3 text-sm"
                  >
                    <div className="font-medium">{c.brand}</div>
                    <div>•••• {c.last4}</div>
                    <div className="text-right">{c.exp}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ---- PAYMENT STATS ---- */}
          <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-800">
              Payment Usage
            </h3>
            <p className="mb-4 text-sm text-gray-500">
              Preferred payment methods overview.
            </p>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStats}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={50}
                    outerRadius={80}
                  >
                    {paymentStats.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* ===== UPI MODAL ===== */}
      {showUPIModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              Pay via UPI
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Enter your UPI ID to proceed with payment.
            </p>

            <input
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="example@upi"
              className="mt-4 w-full rounded-md border px-3 py-2 text-sm"
            />

            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowUPIModal(false)}
                className="rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handlePayWithUPI}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}
    </ParentDashboardLayout>
  );
}
