"use client";
import api from "@/lib/api";

declare global {
  interface Window {
    Razorpay: any;
  }
}
function getParentFromAuth() {
  if (typeof window === "undefined") return null;
 
  const authRaw = localStorage.getItem("auth-storage");
  if (!authRaw) return null;

  try {
    const auth = JSON.parse(authRaw);
    return auth?.state?.user || null;
  } catch {
    return null;
  }
}

export async function startParentPayment({
  
  parentRequestId,
  month,
  year,
  onSuccess,
}: {
  parentRequestId: string;
  month: number;
  year: number;
  onSuccess: () => void;
}) {
  // 🔥 STEP 1: create / fetch payment
  const payRes = await api.post("/payments/parent/pay", {
    parentRequestId,
    month,
    year,
  });
 const parent = getParentFromAuth();

  console.log("PAY API RESPONSE =>", payRes.data);

  const payment = payRes?.data?.data;
  if (!payment?._id) {
    throw new Error("Invalid payment response");
  }

  const paymentId = payment._id;

  // 🔥 STEP 2: create razorpay order
  const orderRes = await api.post("/payments/razorpay/order", {
    paymentId,
  });

  const { order, key } = orderRes.data.data;

  // 🔐 Razorpay SDK guard
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Razorpay SDK not loaded");
  }

  const options = {
    key,
    amount: order.amount,
    currency: "INR",
    name: "TutVex",
    description: "Monthly Fee Payment",
    order_id: order.id,
          // 🔥 ADD THIS (VERY IMPORTANT)
       // ✅ FIXED PREFILL (NO ERROR)
  prefill: {
    name: parent?.fullName || "Parent",
    email: parent?.email || "parent@Tutvex.com",
    contact: parent?.phone || "9999999999",
  },

        theme: {
          color: "#4f46e5",
        },

    handler: async function (response: any) {
      await api.post("/payments/razorpay/verify", {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        paymentId,
      });

      alert("✅ Payment successful");
      onSuccess();
    },
    modal: {
    ondismiss: () => {
      console.log("❌ Razorpay popup closed");
    },
  },
  };
 
  const rzp = new window.Razorpay(options);
  rzp.open();
}
