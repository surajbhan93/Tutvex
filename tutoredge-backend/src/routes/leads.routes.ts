import { FastifyInstance } from "fastify";
import { leadsController } from "../controllers/leads.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function leadsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("preHandler", authMiddleware);

  // Tutor routes
  fastify.get("/marketplace", leadsController.getMarketplaceLeads);
  fastify.post("/unlock", leadsController.unlockLead);
  fastify.get("/my-leads", leadsController.getMyLeads);
  fastify.put("/update-status", leadsController.updateLeadStatus);
  fastify.post("/mark-converted", leadsController.markAsConverted);

  // Parent routes
  fastify.post("/create", leadsController.createLead);
  fastify.get("/my-requests", leadsController.getParentLeads);
  fastify.post("/close", leadsController.closeLead);

  // Common routes
  fastify.get("/:id", leadsController.getLeadById);
}
