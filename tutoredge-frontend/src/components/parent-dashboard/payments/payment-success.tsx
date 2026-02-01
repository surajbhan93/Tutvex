"use client";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          padding: 24,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 22, fontWeight: 700 }}>
          🎉 Payment Successful
        </h2>

        <p style={{ marginTop: 12, color: "#555" }}>
          Aapka payment successfully ho gaya hai.
        </p>

        <p style={{ marginTop: 6, color: "#777" }}>
          ⏳ Admin ke yahan settlement <b>pending</b> hai.
        </p>

        <button
          onClick={() => router.push("/parent/payments")}
          style={{
            marginTop: 20,
            padding: "10px 16px",
            background: "#0d6efd",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Go to Payment Summary
        </button>
      </div>
    </div>
  );
}
