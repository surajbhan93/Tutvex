"use client";
import { useRouter } from "next/navigation";

export default function BookingSuccess() {
  const router = useRouter();

  return (
    <div style={{ textAlign: "center", marginTop: 80 }}>
      <h1>✅ Payment Successful</h1>
      <p>Your monthly fee has been received.</p>

      <button onClick={() => router.push("/parent/payments")}>
        Go to Dashboard
      </button>
    </div>
  );
}
