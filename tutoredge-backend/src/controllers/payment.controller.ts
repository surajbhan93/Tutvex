import { FastifyRequest, FastifyReply } from "fastify";
import {
  createMonthlyPayment,
  getParentPaymentDashboard,
  getTutorPaymentDashboard,
  getAllPaymentsForAdmin,
  getPendingSettlements,

  getParentPaymentSummary,
} from "../services/payment.service";

/* ===============================
   1️⃣ Parent pays monthly fee
================================ */
export const payMonthlyFee = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    console.log("🔥 HIT /payments/parent/pay");
    console.log("👉 USER:", req.user);
    console.log("👉 BODY:", req.body);
    const parentId = req.user!.id;
    const { parentRequestId, month, year } = req.body as any;

    if (!parentRequestId || !month || !year) {
      return reply.status(400).send({
        success: false,
        message: "parentRequestId, month and year are required",
      });
    }

    const payment = await createMonthlyPayment(
      parentId,
      parentRequestId,
      month,
      year
    );

   return reply.status(200).send({
  success: true,
  message: "Payment ready",
  data: payment,
});

  } catch (err: any) {
    return reply.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

/* ===============================
   2️⃣ Parent dashboard payments
================================ */
export const parentPaymentDashboard = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const parentId = req.user!.id;
    const data = await getParentPaymentDashboard(parentId);

    return reply.send({ success: true, data });
  } catch {
    return reply.status(500).send({
      success: false,
      message: "Failed to load payment dashboard",
    });
  }
};

/* ===============================
   3️⃣ Tutor dashboard payments
================================ */
export const tutorPaymentDashboard = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const tutorId = req.user!.id;
    const data = await getTutorPaymentDashboard(tutorId);

    return reply.send({ success: true, data });
  } catch {
    return reply.status(500).send({
      success: false,
      message: "Failed to load tutor payment dashboard",
    });
  }
};

/* =========================================================
   ADMIN – ALL PAYMENTS
========================================================= */
export const adminAllPayments = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const payments = await getAllPaymentsForAdmin();
    reply.send({ success: true, data: payments });
  } catch (err: any) {
    reply.status(500).send({ success: false, message: err.message });
  }
};

/* =========================================================
   ADMIN – PENDING SETTLEMENTS
========================================================= */
export const adminPendingSettlements = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const data = await getPendingSettlements();
    reply.send({ success: true, data });
  } catch (err: any) {
    reply.status(500).send({ success: false, message: err.message });
  }
};

/* =========================================================
   ADMIN – SETTLE PAYMENT
========================================================= */
// export const adminSettlePayment = async (
//   req: FastifyRequest<{ Params: { paymentId: string } }>,
//   reply: FastifyReply
// ) => {
//   try {
//     const { paymentId } = req.params;
//     const payment = await getPendingSettlements(paymentId);

//     reply.send({
//       success: true,
//       message: "Payment settled successfully",
//       data: payment,
//     });
//   } catch (err: any) {
//     reply.status(400).send({
//       success: false,
//       message: err.message,
//     });
//   }
// };

export const parentPaymentSummary = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const parentId = req.user!.id;

    const data = await getParentPaymentSummary(parentId);

    return reply.send({
      success: true,
      data,
    });
  } catch (err: any) {
    return reply.status(500).send({
      success: false,
      message: err.message,
    });
  }
};