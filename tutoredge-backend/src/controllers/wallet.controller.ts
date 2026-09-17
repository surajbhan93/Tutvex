import { FastifyRequest, FastifyReply } from "fastify";
import walletService from "../services/wallet.service";
import monetizationService from "../services/monetization.service";

export const walletController = {
  /**
   * GET /wallet/balance - Get tutor wallet balance
   */
  async getWalletBalance(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const wallet = await walletService.getTutorWallet(tutorId);
      reply.status(200).send({ success: true, data: wallet });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /wallet/transactions - Get wallet transactions
   */
  async getWalletTransactions(
    req: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;

      const transactions = await walletService.getWalletTransactions(tutorId, limit);
      reply.status(200).send({ success: true, data: transactions });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /wallet/withdraw - Request withdrawal
   */
  async requestWithdrawal(
    req: FastifyRequest<{
      Body: { amount: number; bankDetails: any };
    }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { amount, bankDetails } = req.body;

      if (!amount || !bankDetails) {
        return reply.status(400).send({ success: false, message: "Missing required fields" });
      }

      const transaction = await walletService.processWithdrawal(tutorId, amount, bankDetails);
      reply.status(200).send({
        success: true,
        data: transaction,
        message: "Withdrawal request submitted",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /wallet/credits - Get credit wallet
   */
  async getCreditWallet(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const wallet = await walletService.getCreditWallet(tutorId);
      reply.status(200).send({ success: true, data: wallet });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /wallet/credit-transactions - Get credit transactions
   */
  async getCreditTransactions(
    req: FastifyRequest<{ Querystring: { limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;

      const transactions = await walletService.getCreditTransactions(tutorId, limit);
      reply.status(200).send({ success: true, data: transactions });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /wallet/credits/create-order - Create order for credit purchase
   */
  async createCreditOrder(
    req: FastifyRequest<{ Body: { packageType: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { packageType } = req.body;

      if (!packageType) {
        return reply.status(400).send({ success: false, message: "Package type is required" });
      }

      const order = await monetizationService.createCreditPurchaseOrder(tutorId, packageType);
      reply.status(200).send({ success: true, data: order });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /wallet/credits/verify-payment - Verify payment and add credits
   */
  async verifyAndAddCredits(
    req: FastifyRequest<{
      Body: {
        credits: number;
        amount: number;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { credits, amount, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!credits || !amount || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return reply.status(400).send({ success: false, message: "Missing required fields" });
      }

      const result = await monetizationService.verifyAndAddCredits(
        tutorId,
        credits,
        amount,
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      reply.status(200).send(result);
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /wallet/summary - Get earnings summary
   */
  async getEarningsSummary(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const summary = await walletService.getEarningsSummary(tutorId);
      reply.status(200).send({ success: true, data: summary });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },
};
