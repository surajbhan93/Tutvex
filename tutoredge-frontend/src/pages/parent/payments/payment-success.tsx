"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e7f5ff, #f8f9fa)",
        padding: 16,
      }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          maxWidth: 420,
          width: "100%",
          padding: 24,
          borderRadius: 14,
          background: "#fff",
          textAlign: "center",
          boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <CheckCircle2 size={56} color="#16a34a" />
        </motion.div>

        {/* TITLE */}
        <h2
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#111827",
          }}
        >
          Payment Successful
        </h2>

        {/* TEXT */}
        <p
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "#4b5563",
          }}
        >
          Aapka payment successfully ho gaya hai 🎉
        </p>

        <p
          style={{
            marginTop: 6,
            fontSize: 13,
            color: "#6b7280",
          }}
        >
          ⏳ Admin ke yahan settlement <b>pending</b> hai
        </p>

        {/* BUTTON */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
          onClick={() => router.push("/parent/payments")}
          style={{
            marginTop: 22,
            width: "100%",
            padding: "12px 16px",
            background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 15,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          Go to Payment Summary
          <ArrowRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
