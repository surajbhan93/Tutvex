"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startParentPayment } from "./RazorpayCheckout";

export default function PaymentCard({ data }: any) {
  const router = useRouter();
  const now = new Date();
  const [loading, setLoading] = useState(false);

  return (
    <button
      disabled={loading}
      onClick={async () => {
        if (loading) return;

        setLoading(true);

        try {
          await startParentPayment({
            parentRequestId: data.requestId, // ✅ FIX (important)
            month: now.getMonth() + 1,
            year: now.getFullYear(),
            onSuccess: () => {
              router.push("/parent/payments"); // ✅ better UX
            },
          });
        } catch (err) {
          console.error("Payment failed", err);
          alert("Payment failed. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
      className={`rounded-md px-4 py-2 text-sm font-semibold text-white ${
        loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
      }`}
    >
      {loading ? "Processing..." : `Pay Now ₹${data.due}`}
    </button>
  );
}
