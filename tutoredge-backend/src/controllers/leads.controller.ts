import { FastifyRequest, FastifyReply } from "fastify";
import leadService from "../services/lead.service";

export const leadsController = {
  /**
   * GET /leads/marketplace - Get matched leads for tutor
   */
  async getMarketplaceLeads(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;

      const matchedLeads = await leadService.getMatchedLeads({ tutorId });
      reply.status(200).send({ success: true, data: matchedLeads });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /leads/unlock - Unlock a lead
   */
  async unlockLead(
    req: FastifyRequest<{ Body: { leadId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { leadId } = req.body;

      if (!leadId) {
        return reply.status(400).send({ success: false, message: "Lead ID is required" });
      }

      const unlock = await leadService.unlockLead(tutorId, leadId);
      reply.status(200).send({
        success: true,
        data: unlock,
        message: "Lead unlocked successfully",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /leads/my-leads - Get tutor's unlocked leads
   */
  async getMyLeads(
    req: FastifyRequest<{ Querystring: { status?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { status } = req.query;

      const leads = await leadService.getUnlockedLeads(tutorId, status);
      reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * PUT /leads/update-status - Update lead status in pipeline
   */
  async updateLeadStatus(
    req: FastifyRequest<{
      Body: { unlockId: string; status: string; notes?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { unlockId, status, notes } = req.body;

      if (!unlockId || !status) {
        return reply.status(400).send({ success: false, message: "Missing required fields" });
      }

      const unlock = await leadService.updateLeadStatus(tutorId, unlockId, status, notes);
      reply.status(200).send({
        success: true,
        data: unlock,
        message: "Lead status updated",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /leads/mark-converted - Mark lead as converted
   */
  async markAsConverted(
    req: FastifyRequest<{
      Body: { unlockId: string; monthlyFee: number; commissionPercentage?: number };
    }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { unlockId, monthlyFee, commissionPercentage } = req.body;

      if (!unlockId || !monthlyFee) {
        return reply.status(400).send({ success: false, message: "Missing required fields" });
      }

      const result = await leadService.markAsConverted(
        tutorId,
        unlockId,
        monthlyFee,
        commissionPercentage
      );

      reply.status(200).send({
        success: true,
        data: result,
        message: "Lead marked as converted",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /leads/create - Create new lead (for parents)
   */
  async createLead(req: FastifyRequest<{ Body: any }>, reply: FastifyReply) {
    try {
      const parentId = (req as any).user.id;
      const leadData = req.body;

      const lead = await leadService.createLead(parentId, leadData as Partial<IStudentLead>);
      reply.status(201).send({
        success: true,
        data: lead,
        message: "Lead created successfully",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /leads/my-requests - Get parent's leads
   */
  async getParentLeads(req: FastifyRequest, reply: FastifyReply) {
    try {
      const parentId = (req as any).user.id;
      const leads = await leadService.getParentLeads(parentId);
      reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /leads/:id - Get lead details (only if tutor unlocked it or parent owns it)
   */
  async getLeadById(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = req.params;
      const user = (req as any).user;
      
      const lead = await leadService.getLeadById(id);

      if (!lead) {
        return reply.status(404).send({ success: false, message: "Lead not found" });
      }

      // ✅ SECURITY: Check if user has access to this lead
      const hasAccess = await leadService.userHasAccessToLead(user.id, user.role, id);
      if (!hasAccess) {
        return reply.status(403).send({ success: false, message: "Forbidden - You don't have access to this lead" });
      }

      reply.status(200).send({ success: true, data: lead });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /leads/close - Close a lead (parent)
   */
  async closeLead(
    req: FastifyRequest<{ Body: { leadId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const parentId = (req as any).user.id;
      const { leadId } = req.body;

      const lead = await leadService.closeLead(leadId, parentId);
      reply.status(200).send({
        success: true,
        data: lead,
        message: "Lead closed successfully",
      });
    } catch (error: any) {
      reply.status(400).send({ success: false, message: error.message });
    }
  },
};
