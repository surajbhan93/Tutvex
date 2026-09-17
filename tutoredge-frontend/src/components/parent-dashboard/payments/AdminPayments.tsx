"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminPayments() {
  const [pending, setPending] = useState<any[]>([]);

  useEffect(() => {
    api.get("/payments/admin/pending").then(res => {
      setPending(res.data.data);
    });
  }, []);

  const settle = async (paymentId: string) => {
    await api.patch(`/payments/admin/settle/${paymentId}`);
    alert("Payment Settled");
    window.location.reload();
  };

  return (
    <div>
      <h2>🧾 Pending Settlements</h2>

      {pending.map((tutor: any) => (
        <div key={tutor.tutorId} style={{ marginBottom: 20 }}>
          <h3>{tutor.tutorName}</h3>
          <p>Total Pending: ₹{tutor.totalPending}</p>

          {tutor.payments.map((p: any) => (
            <div key={p._id}>
              <span>₹{p.amount}</span>
              <button onClick={() => settle(p._id)}>Settle</button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
