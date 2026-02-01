import api from "@/lib/api";

/* ================= ADMIN PAYMENTS ================= */

// All payments
export const getAllAdminPayments = () =>
  api.get("/payments/admin/all");

// Pending settlements (tutor-wise)
export const getPendingSettlements = () =>
  api.get("/payments/admin/pending");

// Settle a payment
export const settlePayment = (paymentId: string) =>
  api.patch(`/payments/admin/settle/${paymentId}`);
