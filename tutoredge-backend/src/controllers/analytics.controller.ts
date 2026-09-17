import { FastifyRequest, FastifyReply } from "fastify";
import LeadUnlock from "../models/LeadUnlock";
import TutorConversion from "../models/TutorConversion";
import StudentLead from "../models/StudentLead";
import { Types } from "mongoose";

export const analyticsController = {
  /**
   * GET /analytics/dashboard - Get tutor analytics dashboard
   */
  async getTutorAnalytics(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const tutorObjectId = new Types.ObjectId(tutorId);

      // Lead stats
      const totalUnlocks = await LeadUnlock.countDocuments({ tutorId: tutorObjectId });
      const unlockedByStatus = await LeadUnlock.aggregate([
        { $match: { tutorId: tutorObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]);

      // Conversion stats
      const totalConversions = await TutorConversion.countDocuments({
        tutorId: tutorObjectId,
      });
      const activeConversions = await TutorConversion.countDocuments({
        tutorId: tutorObjectId,
        status: "active",
      });

      // Revenue stats
      const revenueStats = await TutorConversion.aggregate([
        { $match: { tutorId: tutorObjectId } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$tutorAmount" },
            totalCommission: { $sum: "$commissionAmount" },
            totalPaid: { $sum: "$totalPaid" },
          },
        },
      ]);

      // Conversion rate
      const conversionRate = totalUnlocks > 0 ? (totalConversions / totalUnlocks) * 100 : 0;

      // Recent unlocks with status
      const recentUnlocks = await LeadUnlock.find({ tutorId: tutorObjectId })
        .populate("leadId")
        .sort({ createdAt: -1 })
        .limit(10);

      // Monthly trend
      const monthlyTrend = await LeadUnlock.aggregate([
        { $match: { tutorId: tutorObjectId } },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
            },
            unlocks: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 6 },
      ]);

      reply.status(200).send({
        success: true,
        data: {
          leadStats: {
            totalUnlocks,
            byStatus: unlockedByStatus,
          },
          conversionStats: {
            total: totalConversions,
            active: activeConversions,
            rate: conversionRate.toFixed(2),
          },
          revenueStats: revenueStats[0] || {
            totalRevenue: 0,
            totalCommission: 0,
            totalPaid: 0,
          },
          recentUnlocks,
          monthlyTrend,
        },
      });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /analytics/conversion-funnel - Get conversion funnel data
   */
  async getConversionFunnel(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const tutorObjectId = new Types.ObjectId(tutorId);

      const funnel = await LeadUnlock.aggregate([
        { $match: { tutorId: tutorObjectId } },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

      const funnelMap: any = {
        new: 0,
        contacted: 0,
        response_received: 0,
        demo_scheduled: 0,
        demo_completed: 0,
        converted: 0,
        lost: 0,
      };

      funnel.forEach((item) => {
        funnelMap[item._id] = item.count;
      });

      reply.status(200).send({ success: true, data: funnelMap });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /analytics/revenue-breakdown - Get revenue breakdown
   */
  async getRevenueBreakdown(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const tutorObjectId = new Types.ObjectId(tutorId);

      const breakdown = await TutorConversion.aggregate([
        { $match: { tutorId: tutorObjectId } },
        {
          $group: {
            _id: {
              year: { $year: "$startDate" },
              month: { $month: "$startDate" },
            },
            revenue: { $sum: "$tutorAmount" },
            commission: { $sum: "$commissionAmount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": -1, "_id.month": -1 } },
        { $limit: 12 },
      ]);

      reply.status(200).send({ success: true, data: breakdown });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /analytics/lead-performance - Get lead quality and performance
   */
  async getLeadPerformance(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutorId = (req as any).user.id;
      const tutorObjectId = new Types.ObjectId(tutorId);

      const unlocks = await LeadUnlock.find({ tutorId: tutorObjectId }).populate("leadId");

      const qualityBuckets: any = {
        excellent: 0, // 90-100
        good: 0, // 75-89
        average: 0, // 60-74
        poor: 0, // <60
      };

      const urgencyPerformance: any = {
        immediate: { total: 0, converted: 0 },
        within_week: { total: 0, converted: 0 },
        within_month: { total: 0, converted: 0 },
        flexible: { total: 0, converted: 0 },
      };

      unlocks.forEach((unlock) => {
        const lead = unlock.leadId as any;
        if (!lead) return;

        // Quality buckets
        const score = lead.qualityScore || 0;
        if (score >= 90) qualityBuckets.excellent++;
        else if (score >= 75) qualityBuckets.good++;
        else if (score >= 60) qualityBuckets.average++;
        else qualityBuckets.poor++;

        // Urgency performance
        const urgency = lead.urgency || "flexible";
        if (urgencyPerformance[urgency]) {
          urgencyPerformance[urgency].total++;
          if (unlock.status === "converted") {
            urgencyPerformance[urgency].converted++;
          }
        }
      });

      reply.status(200).send({
        success: true,
        data: {
          qualityBuckets,
          urgencyPerformance,
        },
      });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },
};
