import { FastifyRequest, FastifyReply } from "fastify";
import subscriptionService from "../services/subscription.service";
import walletService from "../services/wallet.service";
import leadService from "../services/lead.service";
import SubscriptionPlan, { ISubscriptionPlan } from "../models/SubscriptionPlan";
import TutorSubscription from "../models/TutorSubscription";
import LeadCreditWallet from "../models/LeadCreditWallet";
import StudentLead from "../models/StudentLead";

export const adminMonetizationController = {
  /**
   * GET /admin/monetization/overview - Get monetization overview
   */
  async getOverview(req: FastifyRequest, reply: FastifyReply) {
    try {
      const [
        totalSubscriptions,
        activeSubscriptions,
        totalPlans,
        totalLeads,
        walletStats,
        creditWalletStats,
      ] = await Promise.all([
        TutorSubscription.countDocuments(),
        TutorSubscription.countDocuments({ status: "active" }),
        SubscriptionPlan.countDocuments({ isActive: true }),
        StudentLead.countDocuments(),
        walletService.getAdminWalletStats(),
        LeadCreditWallet.aggregate([
          {
            $group: {
              _id: null,
              totalAvailable: { $sum: "$availableCredits" },
              totalUsed: { $sum: "$usedCredits" },
              totalPurchased: { $sum: "$totalPurchased" },
            },
          },
        ]),
      ]);

      return reply.status(200).send({
        success: true,
        data: {
          subscriptions: {
            total: totalSubscriptions,
            active: activeSubscriptions,
          },
          plans: totalPlans,
          leads: totalLeads,
          walletStats,
          creditStats: creditWalletStats[0] || {
            totalAvailable: 0,
            totalUsed: 0,
            totalPurchased: 0,
          },
        },
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/monetization/plans - Get all plans
   */
  async getAllPlans(req: FastifyRequest, reply: FastifyReply) {
    try {
      const plans = await SubscriptionPlan.find().sort({ displayOrder: 1 });
      return reply.status(200).send({ success: true, data: plans });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/plans - Create or update plan
   */
  async upsertPlan(
    req: FastifyRequest<{ Body: any }>,
    reply: FastifyReply
  ) {
    try {
      const plan = await subscriptionService.upsertPlan(req.body as Partial<ISubscriptionPlan>);
      return reply.status(200).send({
        success: true,
        data: plan,
        message: "Plan saved successfully",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * DELETE /admin/monetization/plans/:id - Deactivate plan
   */
  async deactivatePlan(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const plan = await subscriptionService.deactivatePlan(id);
      return reply.status(200).send({
        success: true,
        data: plan,
        message: "Plan deactivated",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/monetization/subscriptions - Get all subscriptions
   */
  async getAllSubscriptions(
    req: FastifyRequest<{ Querystring: { status?: string; limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { status, limit } = req.query;
      const query: any = {};
      if (status) query.status = status;

      const subscriptions = await TutorSubscription.find(query)
        .populate("tutorId", "fullName email phone location profileImage")
        .populate("planId")
        .sort({ createdAt: -1 })
        .limit(limit ? parseInt(limit) : 100);

      return reply.status(200).send({ success: true, data: subscriptions });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/monetization/leads - Get all leads
   */
  async getAllLeads(
    req: FastifyRequest<{ Querystring: { status?: string; limit?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { status, limit } = req.query;
      const filters: any = {};
      if (status) filters.status = status;

      const leads = await leadService.getAllLeadsAdmin(filters);
      return reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/monetization/wallets - Get pending withdrawals & tutor credit wallets list
   */
  async getPendingWithdrawals(req: FastifyRequest, reply: FastifyReply) {
    try {
      const [withdrawals, creditWallets] = await Promise.all([
        walletService.getPendingWithdrawals(),
        LeadCreditWallet.find()
          .populate("tutorId", "fullName email phone profileImage")
          .sort({ totalPurchased: -1 })
          .limit(100),
      ]);

      return reply.status(200).send({
        success: true,
        data: withdrawals,
        creditWallets,
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/withdrawals/:id/approve - Approve withdrawal
   */
  async approveWithdrawal(
    req: FastifyRequest<{
      Params: { id: string };
      Body: { paymentProof?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { paymentProof } = req.body;

      const transaction = await walletService.approveWithdrawal(id, paymentProof);

      return reply.status(200).send({
        success: true,
        data: transaction,
        message: "Withdrawal approved",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/withdrawals/:id/reject - Reject withdrawal
   */
  async rejectWithdrawal(
    req: FastifyRequest<{
      Params: { id: string };
      Body: { reason: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      if (!reason) {
        return reply.status(400).send({ success: false, message: "Reason is required" });
      }

      const transaction = await walletService.rejectWithdrawal(id, reason);

      return reply.status(200).send({
        success: true,
        data: transaction,
        message: "Withdrawal rejected",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/credits/add - Add credits to tutor
   */
  async addCreditsToTutor(
    req: FastifyRequest<{
      Body: { tutorId: string; credits: number; reason: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { tutorId, credits, reason } = req.body;

      const wallet = await LeadCreditWallet.findOne({ tutorId });
      if (!wallet) {
        return reply.status(404).send({ success: false, message: "Wallet not found" });
      }

      wallet.availableCredits += credits;
      wallet.totalEarned += credits;
      await wallet.save();

      return reply.status(200).send({
        success: true,
        data: wallet,
        message: `${credits} credits added to tutor`,
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/wallet/adjust - Adjust wallet balance
   */
  async adjustWalletBalance(
    req: FastifyRequest<{
      Body: { tutorId: string; amount: number; reason: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const { tutorId, amount, reason } = req.body;

      const transaction = await walletService.adminAdjustment(tutorId, amount, reason);

      return reply.status(200).send({
        success: true,
        data: transaction,
        message: "Wallet adjusted successfully",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/seed-plans - Seed default plans
   */
  async seedPlans(req: FastifyRequest, reply: FastifyReply) {
    try {
      await subscriptionService.seedDefaultPlans();
      return reply.status(200).send({
        success: true,
        message: "Default plans seeded successfully",
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },
};
