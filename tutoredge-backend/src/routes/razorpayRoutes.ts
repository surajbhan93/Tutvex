import { FastifyInstance } from "fastify";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
} from "../controllers/razorpay.controller";
import { authMiddleware } from "../middlewares/auth"; // ✅ FIX

export default async function paymentRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/razorpay/order",
    { preHandler: authMiddleware }, // ✅ FIX
    createRazorpayOrder
  );

  fastify.post(
    "/razorpay/verify",
    { preHandler: authMiddleware }, // ✅ FIX
    verifyRazorpayPayment
  );
}
