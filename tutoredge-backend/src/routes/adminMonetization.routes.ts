import { FastifyInstance } from "fastify";
import { adminMonetizationController } from "../controllers/adminMonetization.controller";
import { authMiddleware } from "../middlewares/auth";
import { adminOnly } from "../middlewares/adminOnly";

export default async function adminMonetizationRoutes(fastify: FastifyInstance) {
  // All routes require authentication and admin role
  fastify.addHook("preHandler", authMiddleware);
  fastify.addHook("preHandler", adminOnly);

  // Overview
  fastify.get("/overview", adminMonetizationController.getOverview);

  // Plans
  fastify.get("/plans", adminMonetizationController.getAllPlans);
  fastify.post("/plans", adminMonetizationController.upsertPlan);
  fastify.delete("/plans/:id", adminMonetizationController.deactivatePlan);
  fastify.post("/seed-plans", adminMonetizationController.seedPlans);

  // Subscriptions
  fastify.get("/subscriptions", adminMonetizationController.getAllSubscriptions);

  // Leads
  fastify.get("/leads", adminMonetizationController.getAllLeads);

  // Withdrawals
  fastify.get("/withdrawals", adminMonetizationController.getPendingWithdrawals);
  fastify.post("/withdrawals/:id/approve", adminMonetizationController.approveWithdrawal);
  fastify.post("/withdrawals/:id/reject", adminMonetizationController.rejectWithdrawal);

  // Credits & Wallet
  fastify.post("/credits/add", adminMonetizationController.addCreditsToTutor);
  fastify.post("/wallet/adjust", adminMonetizationController.adjustWalletBalance);
}
