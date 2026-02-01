import { FastifyInstance } from "fastify";
import {
  payMonthlyFee,
  parentPaymentDashboard,
  tutorPaymentDashboard, adminAllPayments,
  adminPendingSettlements,
  adminSettlePayment,parentPaymentSummary
} from "../controllers/payment.controller";
import { authMiddleware,roleMiddleware } from "../middlewares/auth"; // ✅ FIX

export default async function paymentRoutes(fastify: FastifyInstance) {

  // ===== PARENT =====
  fastify.post(
    "/parent/pay",
    { preHandler: authMiddleware },
    payMonthlyFee
  );

  fastify.get(
    "/parent/dashboard",
    { preHandler: authMiddleware },
    parentPaymentDashboard
  );

  fastify.get(
    "/parent/summary",
    { preHandler: authMiddleware },
    parentPaymentSummary
  );

  // ===== TUTOR =====
  fastify.get(
    "/tutor/dashboard",
    { preHandler: authMiddleware },
    tutorPaymentDashboard
  );

  // ===== ADMIN =====
  fastify.get(
    "/admin/all",
    { preHandler: [authMiddleware, roleMiddleware(["admin"])] },
    adminAllPayments
  );

  fastify.get(
    "/admin/pending",
    { preHandler: [authMiddleware, roleMiddleware(["admin"])] },
    adminPendingSettlements
  );

  // fastify.patch(
  //   "/admin/settle/:paymentId",
  //   { preHandler: [authMiddleware, roleMiddleware(["admin"])] },
  //   adminSettlePayment
  // );
}
