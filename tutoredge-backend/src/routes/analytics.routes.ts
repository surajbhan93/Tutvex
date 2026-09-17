import { FastifyInstance } from "fastify";
import { analyticsController } from "../controllers/analytics.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function analyticsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/dashboard", analyticsController.getTutorAnalytics);
  fastify.get("/conversion-funnel", analyticsController.getConversionFunnel);
  fastify.get("/revenue-breakdown", analyticsController.getRevenueBreakdown);
  fastify.get("/lead-performance", analyticsController.getLeadPerformance);
}
