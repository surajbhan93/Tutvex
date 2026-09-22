import { FastifyInstance } from "fastify";
import { leadsController } from "../controllers/leads.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function leadsRoutes(fastify: FastifyInstance) {
  // Public route for landing page (NO AUTH - explicitly skip middleware)
  fastify.route({
    method: 'GET',
    url: '/public/preview',
    handler: leadsController.getPublicLeadsPreview,
    // No preHandler means no auth middleware
  });

  // All authenticated routes
  const authenticatedRoutes = async (fastify: FastifyInstance) => {
    // Apply auth middleware to all routes in this context
    fastify.addHook("preHandler", authMiddleware);

  // Admin routes for StudentLeads
  fastify.get("/admin/student-leads", leadsController.adminGetAllLeads);
  fastify.post("/admin/student-leads", leadsController.adminCreateLead);
  fastify.put("/admin/student-leads/:id", leadsController.adminUpdateLead);
  fastify.delete("/admin/student-leads/:id", leadsController.adminDeleteLead);
  
  // Admin: Get unlock history for a lead
  fastify.get("/admin/lead-unlocks/:leadId", leadsController.adminGetLeadUnlocks);
  
  // Admin: Get all unlocks across all leads
  fastify.get("/admin/all-unlocks", leadsController.adminGetAllUnlocks);
  
  // Admin: Update unlock status
  fastify.put("/update-unlock-status", leadsController.updateUnlockStatus);

  // Tutor routes (specific routes BEFORE dynamic :id route)
  fastify.get("/marketplace", leadsController.getMarketplaceLeads);
  fastify.get("/my-leads", leadsController.getMyLeads);
  fastify.post("/unlock", leadsController.unlockLead);
  fastify.put("/update-status", leadsController.updateLeadStatus);
  fastify.post("/mark-converted", leadsController.markAsConverted);
  
  // Contact access routes
  fastify.post("/:leadId/request-contact-access", leadsController.requestContactAccess);
  
  // Admin contact access routes
  fastify.get("/admin/contact-access-requests", leadsController.getPendingContactAccessRequests);
  fastify.patch("/admin/:leadId/contact-access/:tutorId", leadsController.updateContactAccess);
  
  // Stats route (MUST be before /:id route!)
  fastify.get("/stats", leadsController.getLeadStats);

  // Parent routes
  fastify.post("/create", leadsController.createLead);
  fastify.get("/my-requests", leadsController.getParentLeads);
  fastify.post("/close", leadsController.closeLead);

  // Dynamic route MUST be last
  fastify.get("/:id", leadsController.getLeadById);
  };

  // Register authenticated routes
  fastify.register(authenticatedRoutes);
}
