import { FastifyRequest, FastifyReply } from "fastify";
import { DemoLead } from "../models/DemoLead";

export class DemoLeadController {
  // ==========================================
  // 🔥 PUBLIC: Submit Free Demo Request Form
  // ==========================================
  public async createDemoLead(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        city = "Agra",
        state = "Uttar Pradesh",
        studentClass,
        locality,
        phone,
        sourceUrl,
      } = (request.body || {}) as any;

      // 1. Validation
      if (!studentClass || !locality || !phone) {
        return reply.status(400).send({
          success: false,
          message: "Missing required fields (studentClass, locality, phone).",
        });
      }

      // 2. Phone Sanitization & Validation (Indian 10-digit mobile)
      const cleanPhone = phone.toString().replace(/\s+|-/g, "").trim();
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        return reply.status(400).send({
          success: false,
          message: "Please enter a valid 10-digit Indian mobile number.",
        });
      }

      // 3. Duplicate Prevention (10 minutes window)
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
      const existingLead = await DemoLead.findOne({
        phone: cleanPhone,
        createdAt: { $gte: tenMinutesAgo },
      });

      if (existingLead) {
        return reply.status(200).send({
          success: true,
          message: `Demo request already received for ${city}. Our team will contact you within 2 hours!`,
          leadId: existingLead.leadId,
        });
      }

      // 4. Generate Unique Lead ID
      const cityCode = city.substring(0, 4).toUpperCase();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const leadId = `TUT-${cityCode}-${Date.now().toString(36).toUpperCase()}-${randomSuffix}`;

      // 5. Save Document in MongoDB
      const newLead = await DemoLead.create({
        leadId,
        city,
        state,
        studentClass,
        locality,
        phone: cleanPhone,
        sourceUrl: sourceUrl || (request.headers.referer as string),
        status: "PENDING",
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });

      return reply.status(201).send({
        success: true,
        message: `Free demo session requested successfully for ${city}!`,
        leadId: newLead.leadId,
        data: newLead,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // ==========================================
  // 🔥 ADMIN: View All Demo Leads with Filters
  // ==========================================
  public async getAllDemoLeads(request: FastifyRequest, reply: FastifyReply) {
    try {
      const {
        page = "1",
        limit = "20",
        search,
        city,
        status,
        startDate,
        endDate,
      } = (request.query || {}) as any;

      const query: any = {};

      if (city) {
        query.city = { $regex: city, $options: "i" };
      }

      if (status) {
        query.status = status;
      }

      if (search) {
        query.$or = [
          { phone: { $regex: search, $options: "i" } },
          { locality: { $regex: search, $options: "i" } },
          { leadId: { $regex: search, $options: "i" } },
        ];
      }

      if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
      }

      const pageNum = parseInt(page, 10);
      const limitNum = parseInt(limit, 10);
      const skip = (pageNum - 1) * limitNum;

      const [leads, total] = await Promise.all([
        DemoLead.find(query).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
        DemoLead.countDocuments(query),
      ]);

      return reply.status(200).send({
        success: true,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum),
        data: leads,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // ==========================================
  // 🔥 ADMIN: Lead Analytics & Dashboard Stats
  // ==========================================
  public async getDemoLeadStats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const [totalLeads, pendingLeads, contactedLeads, scheduledLeads, convertedLeads, cityBreakdown] =
        await Promise.all([
          DemoLead.countDocuments(),
          DemoLead.countDocuments({ status: "PENDING" }),
          DemoLead.countDocuments({ status: "CONTACTED" }),
          DemoLead.countDocuments({ status: "DEMO_SCHEDULED" }),
          DemoLead.countDocuments({ status: "CONVERTED" }),
          DemoLead.aggregate([
            { $group: { _id: "$city", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ]),
        ]);

      return reply.status(200).send({
        success: true,
        stats: {
          totalLeads,
          pendingLeads,
          contactedLeads,
          scheduledLeads,
          convertedLeads,
          conversionRate: totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(2) + "%" : "0%",
          cityBreakdown,
        },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // ==========================================
  // 🔥 ADMIN: Update Lead Status & Counselor
  // ==========================================
  public async updateDemoLeadStatus(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = (request.params || {}) as any;
      const { status, assignedCounselor, adminNotes } = (request.body || {}) as any;

      const lead = await DemoLead.findById(id);
      if (!lead) {
        return reply.status(404).send({
          success: false,
          message: "Lead not found",
        });
      }

      if (status) lead.status = status;
      if (assignedCounselor !== undefined) lead.assignedCounselor = assignedCounselor;
      if (adminNotes !== undefined) lead.adminNotes = adminNotes;

      await lead.save();

      return reply.status(200).send({
        success: true,
        message: "Lead updated successfully",
        data: lead,
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }

  // ==========================================
  // 🔥 ADMIN: Delete Demo Lead
  // ==========================================
  public async deleteDemoLead(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = (request.params || {}) as any;

      const lead = await DemoLead.findByIdAndDelete(id);
      if (!lead) {
        return reply.status(404).send({
          success: false,
          message: "Lead not found",
        });
      }

      return reply.status(200).send({
        success: true,
        message: "Lead deleted successfully",
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error",
        error: error.message,
      });
    }
  }
}
