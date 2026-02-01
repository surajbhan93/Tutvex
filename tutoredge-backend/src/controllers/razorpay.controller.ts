import { FastifyRequest, FastifyReply } from "fastify";
import crypto from "crypto";
import razorpay from "../services/razorpay.service";
import { createMonthlyPayment } from "../services/payment.service";
import Payment from "../models/Payment"; // ✅ exact filename

/* ======================================================
   1️⃣ CREATE RAZORPAY ORDER
====================================================== */
export const createRazorpayOrder = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const parentId = (req.user as any).id;
    const { paymentId } = req.body as any;

    if (!paymentId) {
      return reply.status(400).send({
        success: false,
        message: "paymentId is required",
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return reply.status(400).send({
        success: false,
        message: "Invalid payment",
      });
    }

    if (payment.parent.toString() !== parentId) {
      throw new Error("Unauthorized");
    }

  const order = await razorpay.orders.create({
  amount: payment.amount * 100,
  currency: "INR",
  receipt: String(payment._id), // ✅ FIXED (Type-safe)
});

    return reply.send({
      success: true,
      data: {
        order: {
          id: order.id,
          amount: order.amount,
        },
        key: process.env.RAZORPAY_KEY,
      },
    });
  } catch (err: any) {
    return reply.status(400).send({
      success: false,
      message: err.message,
    });
  }
};

/* ======================================================
   2️⃣ VERIFY RAZORPAY PAYMENT
====================================================== */
/* ======================================================
   2️⃣ VERIFY RAZORPAY PAYMENT (FIXED)
====================================================== */
export const verifyRazorpayPayment = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const parentId = (req.user as any).id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body as any;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !paymentId
    ) {
      return reply.status(400).send({
        success: false,
        message: "Invalid payment payload",
      });
    }

    // 🔐 verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return reply.status(400).send({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ✅ UPDATE BY paymentId (NEW FLOW)
    const payment = await Payment.findOneAndUpdate(
      {
        _id: paymentId,
        parent: parentId,
        status: "pending",
      },
      { status: "paid" },
      { new: true }
    );

    if (!payment) {
      return reply.status(404).send({
        success: false,
        message: "Pending payment not found",
      });
    }

    return reply.send({
      success: true,
      message: "Payment verified & updated",
      data: payment,
    });
  } catch (err: any) {
    return reply.status(400).send({
      success: false,
      message: err.message,
    });
  }
};
