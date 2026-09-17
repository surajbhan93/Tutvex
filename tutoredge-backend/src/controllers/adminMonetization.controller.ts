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
      ] = await Promise.all([
        TutorSubscription.countDocuments(),
        TutorSubscription.countDocuments({ status: "active" }),
        SubscriptionPlan.countDocuments({ isActive: true }),
        StudentLead.countDocuments(),
        walletService.getAdminWalletStats(),
      ]);

      reply.status(200).send({
        success: true,
        data: {
          subscriptions: {
            total: totalSubscriptions,
            active: activeSubscriptions,
          },
          plans: totalPlans,
          leads: totalLeads,
          walletStats,
        },
      });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/monetization/plans - Get all plans
   */
  async getAllPlans(req: FastifyRequest, reply: FastifyReply) {
    try {
      const plans = await SubscriptionPlan.find().sort({ displayOrder: 1 });
      reply.status(200).send({ success: true, data: plans });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
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
      reply.status(200).send({
        success: true,
        data: plan,
        message: "Plan saved successfully",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
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
      reply.status(200).send({
        success: true,
        data: plan,
        message: "Plan deactivated",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
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
        .populate("tutorId", "fullName email phone")
        .populate("planId")
        .sort({ createdAt: -1 })
        .limit(limit ? parseInt(limit) : 100);

      reply.status(200).send({ success: true, data: subscriptions });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
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
      reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/monetization/wallets - Get pending withdrawals
   */
  async getPendingWithdrawals(req: FastifyRequest, reply: FastifyReply) {
    try {
      const withdrawals = await walletService.getPendingWithdrawals();
      reply.status(200).send({ success: true, data: withdrawals });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
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

      reply.status(200).send({
        success: true,
        data: transaction,
        message: "Withdrawal approved",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
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

      reply.status(200).send({
        success: true,
        data: transaction,
        message: "Withdrawal rejected",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
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

      reply.status(200).send({
        success: true,
        data: wallet,
        message: `${credits} credits added to tutor`,
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
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

      reply.status(200).send({
        success: true,
        data: transaction,
        message: "Wallet adjusted successfully",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/monetization/seed-plans - Seed default plans
   */
  async seedPlans(req: FastifyRequest, reply: FastifyReply) {
    try {
      await subscriptionService.seedDefaultPlans();
      reply.status(200).send({
        success: true,
        message: "Default plans seeded successfully",
      });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },
};
