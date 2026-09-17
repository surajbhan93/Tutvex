import { FastifyInstance } from "fastify";
import { subscriptionController } from "../controllers/subscription.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function subscriptionRoutes(fastify: FastifyInstance) {
  // Public routes
  fastify.get("/plans", subscriptionController.getAllPlans);

  // Protected routes - require authentication
  fastify.get("/current", { preHandler: authMiddleware }, subscriptionController.getCurrentSubscription);
  fastify.get("/history", { preHandler: authMiddleware }, subscriptionController.getSubscriptionHistory);
  fastify.post("/activate-free", { preHandler: authMiddleware }, subscriptionController.activateFreePlan);
  fastify.post("/create-order", { preHandler: authMiddleware }, subscriptionController.createSubscriptionOrder);
  fastify.post("/verify-payment", { preHandler: authMiddleware }, subscriptionController.verifyAndActivate);
  fastify.post("/cancel", { preHandler: authMiddleware }, subscriptionController.cancelSubscription);
  fastify.post("/toggle-auto-renew", { preHandler: authMiddleware }, subscriptionController.toggleAutoRenew);

  // Admin only
  fastify.post("/seed-plans", subscriptionController.seedDefaultPlans);
}
