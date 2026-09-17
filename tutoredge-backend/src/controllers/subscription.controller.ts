import { FastifyRequest, FastifyReply } from "fastify";
import subscriptionService from "../services/subscription.service";
import monetizationService from "../services/monetization.service";

export const subscriptionController = {
  /**
   * GET /subscription/plans - Get all subscription plans
   */
  async getAllPlans(req: FastifyRequest, reply: FastifyReply) {
    try {
      const plans = await subscriptionService.getAllPlans();
      reply.status(200).send({ success: true, data: plans });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /subscription/current - Get tutor's current subscription
   */
  async getCurrentSubscription(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const subscription = await subscriptionService.getTutorSubscription(tutorId);
      reply.status(200).send({ success: true, data: subscription });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /subscription/history - Get subscription history
   */
  async getSubscriptionHistory(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const history = await subscriptionService.getTutorSubscriptionHistory(tutorId);
      reply.status(200).send({ success: true, data: history });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /subscription/activate-free - Activate free plan
   */
  async activateFreePlan(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const subscription = await subscriptionService.activateFreePlan(tutorId);
      reply.status(200).send({
        success: true,
        data: subscription,
        message: "Free plan activated with 3 free credits",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /subscription/create-order - Create Razorpay order for subscription
   */
  async createSubscriptionOrder(
    req: FastifyRequest<{ Body: { planSlug: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { planSlug } = req.body;

      if (!planSlug) {
        return reply.status(400).send({ success: false, message: "Plan slug is required" });
      }

      const order = await monetizationService.createSubscriptionOrder(tutorId, planSlug);
      reply.status(200).send({ success: true, data: order });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /subscription/verify-payment - Verify payment and activate subscription
   */
  async verifyAndActivate(
    req: FastifyRequest<{
      Body: {
        planSlug: string;
        razorpayOrderId: string;
        razorpayPaymentId: string;
        razorpaySignature: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { planSlug, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

      if (!planSlug || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
        return reply.status(400).send({ success: false, message: "Missing required fields" });
      }

      const result = await monetizationService.verifyAndActivateSubscription(
        tutorId,
        planSlug,
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
   * POST /subscription/cancel - Cancel subscription
   */
  async cancelSubscription(
    req: FastifyRequest<{ Body: { reason?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { reason } = req.body;

      const subscription = await subscriptionService.cancelSubscription(tutorId, reason);
      reply.status(200).send({
        success: true,
        data: subscription,
        message: "Subscription cancelled successfully",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /subscription/toggle-auto-renew - Toggle auto-renewal
   */
  async toggleAutoRenew(
    req: FastifyRequest<{ Body: { autoRenew: boolean } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { autoRenew } = req.body;

      const subscription = await subscriptionService.toggleAutoRenew(tutorId, autoRenew);
      reply.status(200).send({ success: true, data: subscription });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /subscription/seed-plans - Seed default plans (admin only)
   */
  async seedDefaultPlans(req: FastifyRequest, reply: FastifyReply) {
    try {
      await subscriptionService.seedDefaultPlans();
      reply.status(200).send({ success: true, message: "Default plans seeded successfully" });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },
};
