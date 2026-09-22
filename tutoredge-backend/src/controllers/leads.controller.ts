import { FastifyRequest, FastifyReply } from "fastify";
import leadService from "../services/lead.service";
import { IStudentLead } from "../models/StudentLead";
import fcmService from "../services/fcm.service";

export const leadsController = {
  /**
   * GET /leads/marketplace - Get matched leads for tutor
   */
  async getMarketplaceLeads(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user?.id;

      const matchedLeads = await leadService.getMatchedLeads({ tutorId });
      return reply.status(200).send({ success: true, data: matchedLeads });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
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
      const tutorName = (req as any).user.fullName || "A tutor";
      const { leadId } = req.body;

      if (!leadId) {
        return reply.status(400).send({ success: false, message: "Lead ID is required" });
      }

      const unlock = await leadService.unlockLead(tutorId, leadId);
      
      // Get lead details and send notification to parent
      try {
        const lead = await leadService.getLeadById(leadId);
        if (lead && lead.parentId) {
          await fcmService.sendLeadUnlockedNotification(lead.parentId, {
            leadId: (lead._id as any).toString(),
            subject: lead.subject,
            studentClass: lead.studentClass,
            tutorName: tutorName,
          });
          console.log(`[FCM] Lead unlocked notification sent to parent ${lead.parentId}`);
        }
      } catch (notificationError) {
        // Don't fail the request if notification fails
        console.error('[FCM] Failed to send lead unlocked notification:', notificationError);
      }
      
      return reply.status(200).send({
        success: true,
        data: unlock,
        redirectUrl: "/tutor/leads/my-leads", // ✅ Redirect to My Leads
        message: "Lead unlocked successfully. Redirecting to My Leads...",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
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
      return reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /leads/stats - Get tutor's lead statistics
   */
  async getLeadStats(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user?.id;
      
      const StudentLead = require("../models/StudentLead").default;
      const LeadUnlock = require("../models/LeadUnlock").default;
      const LeadCreditWallet = require("../models/LeadCreditWallet").default;

      // Get available leads count
      const availableLeads = await StudentLead.countDocuments({
        status: { $ne: "closed" }
      });

      // Get unlocked leads count
      const unlockedLeads = await LeadUnlock.countDocuments({
        tutorId,
        status: { $ne: "converted" }
      });

      // Get active students (converted leads)
      const activeStudents = await LeadUnlock.countDocuments({
        tutorId,
        status: "converted"
      });

      // Get credit balance
      const wallet = await LeadCreditWallet.findOne({ tutorId });
      const totalCredits = wallet?.availableCredits ?? wallet?.balance ?? 0;

      return reply.status(200).send({
        success: true,
        data: {
          availableLeads,
          unlockedLeads,
          activeStudents,
          totalCredits
        }
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
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
      return reply.status(200).send({
        success: true,
        data: unlock,
        message: "Lead status updated",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
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

      return reply.status(200).send({
        success: true,
        data: result,
        message: "Lead marked as converted",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
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
      
      // Send push notification to parent confirming lead creation
      try {
        await fcmService.sendLeadCreatedNotification(parentId, {
          leadId: (lead._id as any).toString(),
          subject: lead.subject,
          studentClass: lead.studentClass,
          studentName: lead.studentName,
        });
        console.log(`[FCM] Lead created notification sent to parent ${parentId}`);
      } catch (notificationError) {
        // Don't fail the request if notification fails
        console.error('[FCM] Failed to send lead created notification:', notificationError);
      }
      
      return reply.status(201).send({
        success: true,
        data: lead,
        message: "Lead created successfully",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /leads/my-requests - Get parent's leads
   */
  async getParentLeads(req: FastifyRequest, reply: FastifyReply) {
    try {
      const parentId = (req as any).user.id;
      const leads = await leadService.getParentLeads(parentId);
      return reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
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

      return reply.status(200).send({ success: true, data: lead });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
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
      return reply.status(200).send({
        success: true,
        data: lead,
        message: "Lead closed successfully",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  // ============================================
  // ADMIN ENDPOINTS FOR STUDENT LEADS
  // ============================================

  /**
   * GET /admin/student-leads - Get all student leads (admin only)
   */
  async adminGetAllLeads(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (req as any).user;
      
      // Check if user is admin
      if (!user || user.role !== "admin") {
        return reply.status(403).send({ success: false, message: "Forbidden - Admin access required" });
      }

      const StudentLead = require("../models/StudentLead").default;
      
      const leads = await StudentLead.find()
        .populate("parentId", "fullName email phone")
        .sort({ createdAt: -1 })
        .lean();

      return reply.status(200).send({ success: true, data: leads });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/student-leads - Create student lead (admin only)
   */
  async adminCreateLead(
    req: FastifyRequest<{ Body: any }>,
    reply: FastifyReply
  ) {
    try {
      const user = (req as any).user;
      
      // Check if user is admin
      if (!user || user.role !== "admin") {
        return reply.status(403).send({ success: false, message: "Forbidden - Admin access required" });
      }

      const StudentLead = require("../models/StudentLead").default;
      const mongoose = require("mongoose");
      const fcmService = require("../services/fcm.service").default;
      const leadMatchingService = require("../services/leadMatching.service").default;
      const notificationService = require("../services/notification.service").default;

      const leadData: any = req.body;

      // Calculate quality score based on completeness
      const calculateQualityScore = (data: any): number => {
        let score = 50; // Base score

        if (data.studentName) score += 5;
        if (data.studentClass) score += 5;
        if (data.subject) score += 5;
        if (data.location?.state) score += 5;
        if (data.location?.city) score += 5;
        if (data.location?.area) score += 3;
        if (data.location?.pincode) score += 2;
        if (data.budget && data.budget > 0) score += 10;
        if (data.teachingMode) score += 5;
        if (data.preferredTime) score += 3;
        if (data.additionalRequirements && data.additionalRequirements.length > 20) score += 7;
        if (data.parentName) score += 3;
        if (data.parentPhone) score += 4;
        if (data.parentEmail) score += 3;

        return Math.min(score, 100);
      };

      const qualityScore = calculateQualityScore(leadData);
      const dummyParentId = new mongoose.Types.ObjectId();

      const newLead = await StudentLead.create({
        parentId: dummyParentId,
        parentName: leadData.parentName,
        parentPhone: leadData.parentPhone,
        parentEmail: leadData.parentEmail,
        studentName: leadData.studentName,
        studentClass: leadData.studentClass,
        board: leadData.board,
        schoolName: leadData.schoolName,
        subject: leadData.subject,
        teachingMode: leadData.teachingMode,
        location: leadData.location,
        budget: leadData.budget,
        budgetType: leadData.budgetType || "per_month",
        preferredTime: leadData.preferredTime,
        additionalRequirements: leadData.additionalRequirements,
        urgency: leadData.urgency || "flexible",
        status: leadData.status || "active",
        availability: leadData.availability || "active",
        qualityScore,
        creditsRequired: leadData.creditsRequired || 3,
        maxUnlocks: leadData.maxUnlocks || 10,
        expiryDate: leadData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });

      // 🔔 SEND FCM NOTIFICATIONS TO MATCHING TUTORS
      try {
        const matchingTutorIds = await leadMatchingService.findMatchingTutors(newLead);
        if (matchingTutorIds.length > 0) {
          await fcmService.sendNewLeadNotification(matchingTutorIds, {
            leadId: newLead._id.toString(),
            subject: newLead.subject,
            studentClass: newLead.studentClass,
            location: newLead.location?.city && newLead.location?.area 
              ? `${newLead.location.area}, ${newLead.location.city}`
              : newLead.location?.city || undefined,
          });

          for (const tutorId of matchingTutorIds) {
            await notificationService.notifyNewLead(
              tutorId.toString(),
              newLead._id.toString(),
              newLead.subject
            );
          }
        }
      } catch (notificationError) {
        console.error("Error sending notifications:", notificationError);
      }

      return reply.status(201).send({
        success: true,
        data: newLead,
        message: "Student lead created successfully and notifications sent to matching tutors",
      });
    } catch (error: any) {
      console.error("Error creating lead:", error);
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * PUT /admin/student-leads/:id - Update student lead (admin only)
   */
  async adminUpdateLead(
    req: FastifyRequest<{ Params: { id: string }; Body: any }>,
    reply: FastifyReply
  ) {
    try {
      const user = (req as any).user;
      
      if (!user || user.role !== "admin") {
        return reply.status(403).send({ success: false, message: "Forbidden - Admin access required" });
      }

      const { id } = req.params;
      const updateData = req.body;
      const StudentLead = require("../models/StudentLead").default;

      const oldLead = await StudentLead.findById(id);
      if (!oldLead) {
        return reply.status(404).send({ success: false, message: "Lead not found" });
      }

      const lead = await StudentLead.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      );

      return reply.status(200).send({
        success: true,
        data: lead,
        message: "Lead updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating lead:", error);
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * DELETE /admin/student-leads/:id - Delete student lead (admin only)
   */
  async adminDeleteLead(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = (req as any).user;
      
      if (!user || user.role !== "admin") {
        return reply.status(403).send({ success: false, message: "Forbidden - Admin access required" });
      }

      const { id } = req.params;
      const StudentLead = require("../models/StudentLead").default;

      const lead = await StudentLead.findByIdAndDelete(id);

      if (!lead) {
        return reply.status(404).send({ success: false, message: "Lead not found" });
      }

      return reply.status(200).send({
        success: true,
        message: "Lead deleted successfully",
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /leads/public/preview - Get leads for public landing page (NO AUTH)
   */
  async getPublicLeadsPreview(req: FastifyRequest, reply: FastifyReply) {
    try {
      const StudentLead = require("../models/StudentLead").default;
      
      const leads = await StudentLead.find({
        status: { $ne: "closed" },
      })
        .select("-parentId -parentName -parentPhone -parentEmail")
        .sort({ availability: 1, createdAt: -1 })
        .limit(100)
        .lean();

      const matchedLeads = leads.map((lead: any) => ({
        lead,
        matchScore: Math.floor(Math.random() * 20) + 80,
        reasons: [
          "Subject matches your expertise",
          "Location in your service area"
        ]
      }));

      return reply.status(200).send({ success: true, data: matchedLeads });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/lead-unlocks/:leadId - Get unlock history for a lead (admin only)
   */
  async adminGetLeadUnlocks(
    req: FastifyRequest<{ Params: { leadId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== "admin") {
        return reply.status(403).send({ success: false, message: "Forbidden - Admin access required" });
      }

      const { leadId } = req.params;
      const LeadUnlock = require("../models/LeadUnlock").default;
      
      const unlocks = await LeadUnlock.find({ leadId })
        .populate("tutorId", "fullName email phone subjects location profilePicture")
        .sort({ unlockedAt: -1 })
        .lean();

      return reply.status(200).send({ success: true, data: unlocks });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/all-unlocks - Get all lead unlocks (admin only)
   */
  async adminGetAllUnlocks(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (req as any).user;
      if (!user || user.role !== "admin") {
        return reply.status(403).send({ success: false, message: "Forbidden - Admin access required" });
      }

      const LeadUnlock = require("../models/LeadUnlock").default;
      
      const unlocks = await LeadUnlock.find()
        .populate("tutorId", "fullName email phone subjects location profilePicture")
        .populate("leadId", "subject studentClass location budget budgetType teachingMode status parentName parentPhone parentEmail")
        .sort({ unlockedAt: -1 })
        .lean();

      return reply.status(200).send({ success: true, data: unlocks });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * PUT /update-unlock-status - Update unlock status (admin/tutor)
   */
  async updateUnlockStatus(
    req: FastifyRequest<{ Body: { unlockId: string; status: string; notes?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const user = (req as any).user;
      const { unlockId, status, notes } = req.body;

      if (!unlockId || !status) {
        return reply.status(400).send({ success: false, message: "Unlock ID and status are required" });
      }

      const LeadUnlock = require("../models/LeadUnlock").default;
      
      const unlock = await LeadUnlock.findById(unlockId);
      if (!unlock) {
        return reply.status(404).send({ success: false, message: "Unlock record not found" });
      }

      unlock.status = status;
      if (notes) unlock.notes = notes;
      
      const now = new Date();
      if (status === 'contacted' && !unlock.contactedAt) {
        unlock.contactedAt = now;
      } else if (status === 'demo_scheduled' && !unlock.demoScheduledAt) {
        unlock.demoScheduledAt = now;
      } else if (status === 'demo_completed' && !unlock.demoCompletedAt) {
        unlock.demoCompletedAt = now;
      } else if (status === 'converted' && !unlock.convertedAt) {
        unlock.convertedAt = now;
      } else if (status === 'lost' && !unlock.lostAt) {
        unlock.lostAt = now;
      }

      await unlock.save();

      return reply.status(200).send({ 
        success: true, 
        data: unlock,
        message: "Unlock status updated successfully" 
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * POST /leads/:leadId/request-contact-access - Request contact access for unlocked lead
   */
  async requestContactAccess(
    req: FastifyRequest<{ Params: { leadId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const tutorId = (req as any).user.id;
      const { leadId } = req.params;

      if (!leadId) {
        return reply.status(400).send({ success: false, message: "Lead ID is required" });
      }

      const unlock = await leadService.requestContactAccess(leadId, tutorId);

      return reply.status(200).send({
        success: true,
        data: unlock,
        message: "Contact access request submitted. Waiting for admin approval.",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * PATCH /admin/leads/:leadId/contact-access/:tutorId - Grant/deny contact access (Admin)
   */
  async updateContactAccess(
    req: FastifyRequest<{
      Params: { leadId: string; tutorId: string };
      Body: { granted: boolean; notes?: string };
    }>,
    reply: FastifyReply
  ) {
    try {
      const adminId = (req as any).user.id;
      const adminRole = (req as any).user.role;
      const { leadId, tutorId } = req.params;
      const { granted, notes } = req.body;

      console.log('[Controller] Contact Access Update:', { 
        leadId, 
        tutorId, 
        adminId, 
        granted, 
        notes,
        url: req.url 
      });

      if (adminRole !== "admin") {
        return reply.status(403).send({ success: false, message: "Admin access required" });
      }

      if (granted === undefined) {
        return reply.status(400).send({ success: false, message: "granted field is required" });
      }

      const unlock = await leadService.updateContactAccess(
        leadId,
        tutorId,
        adminId,
        granted,
        notes
      );

      return reply.status(200).send({
        success: true,
        data: unlock,
        message: granted ? "Contact access granted" : "Contact access denied",
      });
    } catch (error: any) {
      return reply.status(400).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /admin/leads/contact-access-requests - Get pending contact access requests (Admin)
   */
  async getPendingContactAccessRequests(req: FastifyRequest, reply: FastifyReply) {
    try {
      const adminRole = (req as any).user.role;

      if (adminRole !== "admin") {
        return reply.status(403).send({ success: false, message: "Admin access required" });
      }

      const requests = await leadService.getPendingContactAccessRequests();

      return reply.status(200).send({
        success: true,
        data: requests,
      });
    } catch (error: any) {
      return reply.status(500).send({ success: false, message: error.message });
    }
  },
};
