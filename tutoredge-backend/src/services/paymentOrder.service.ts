import razorpay from "./razorpay.service";
import ParentRequest from "../models/ParentRequest";
import { FastifyRequest, FastifyReply } from "fastify";
import Payment from "../models/Payment"; // ✅ exact filename
// export const createOrderService = async (
//   parentId: string,
//   parentRequestId: string
// ) => {
//   const request = await ParentRequest.findById(parentRequestId).populate("tutor");

//   if (!request) throw new Error("Parent request not found");

//   if (request.parent.toString() !== parentId)
//     throw new Error("Unauthorized");

//   if (request.status !== "assigned")
//     throw new Error("Tutor not assigned yet");

//   const tutor: any = request.tutor;

//   if (tutor.priceType !== "per_month")
//     throw new Error("Tutor is not monthly based");

//   const order = await razorpay.orders.create({
//     amount: tutor.price * 100, // Razorpay → paise
//     currency: "INR",
//     receipt: `receipt_${parentRequestId}_${Date.now()}`,
//   });

//  return {
//   order: {
//     id: order.id,
//     amount: tutor.price * 100, // Razorpay needs paise
//   },
//   key: process.env.RAZORPAY_KEY,
// };

// };

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

    const payment = await Payment.findById(paymentId).populate("tutor");

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

