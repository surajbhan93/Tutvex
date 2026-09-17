import StudentLead, { IStudentLead } from "../models/StudentLead";
import LeadUnlock, { ILeadUnlock } from "../models/LeadUnlock";
import LeadCreditWallet from "../models/LeadCreditWallet";
import CreditTransaction from "../models/CreditTransaction";
import TutorConversion from "../models/TutorConversion";
import User from "../models/User";
import { Types } from "mongoose";

interface MatchingCriteria {
  tutorId: string;
  subjects?: string[];
  location?: {
    city?: string;
    maxDistance?: number; // in km
    coordinates?: [number, number]; // [lng, lat]
  };
  minBudget?: number;
  teachingModes?: string[];
}

interface LeadMatchScore {
  lead: IStudentLead;
  matchScore: number;
  reasons: string[];
}

export class LeadService {
  /**
   * Create a new student lead (from parent)
   */
  async createLead(parentId: string, leadData: Partial<IStudentLead>): Promise<IStudentLead> {
    // Calculate quality score based on lead completeness
    const qualityScore = this.calculateQualityScore(leadData);

    // Calculate credits required based on quality and urgency
    const creditsRequired = this.calculateCreditsRequired(qualityScore, leadData.urgency || "flexible");

    // Set expiry date (30 days from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 30);

    const lead = await StudentLead.create({
      ...leadData,
      parentId: new Types.ObjectId(parentId),
      qualityScore,
      creditsRequired,
      expiryDate,
      status: "new",
      totalUnlocks: 0,
      maxUnlocks: 10,
    });

    return lead;
  }

  /**
   * Calculate lead quality score (0-100)
   */
  private calculateQualityScore(leadData: Partial<IStudentLead>): number {
    let score = 50; // Base score

    // Budget provided
    if (leadData.budget && leadData.budget > 0) score += 10;

    // Location details
    if (leadData.location?.city) score += 10;
    if (leadData.location?.area) score += 5;
    if (leadData.location?.pincode) score += 5;

    // Teaching mode specified
    if (leadData.teachingMode) score += 10;

    // Additional requirements provided
    if (leadData.additionalRequirements && leadData.additionalRequirements.length > 20) score += 10;

    // Urgency
    if (leadData.urgency === "immediate") score += 10;
    else if (leadData.urgency === "within_week") score += 5;

    return Math.min(score, 100);
  }

  /**
   * Calculate credits required to unlock
   */
  private calculateCreditsRequired(qualityScore: number, urgency: string): number {
    let credits = 3; // Base

    // High quality leads cost more
    if (qualityScore >= 90) credits = 5;
    else if (qualityScore >= 75) credits = 4;

    // Urgent leads cost more
    if (urgency === "immediate") credits += 2;
    else if (urgency === "within_week") credits += 1;

    return credits;
  }

  /**
   * Get matched leads for a tutor with scoring
   */
  async getMatchedLeads(criteria: MatchingCriteria): Promise<LeadMatchScore[]> {
    const { tutorId } = criteria;

    // Get tutor profile
    const tutor = await User.findById(tutorId);
    if (!tutor || tutor.role !== "tutor") {
      throw new Error("Tutor not found");
    }

    // Find leads that tutor hasn't unlocked yet
    const unlockedLeadIds = await LeadUnlock.find({
      tutorId: new Types.ObjectId(tutorId),
    }).distinct("leadId");

    // Build query
    const query: any = {
      status: { $in: ["new", "active"] },
      expiryDate: { $gt: new Date() },
      _id: { $nin: unlockedLeadIds },
      totalUnlocks: { $lt: 10 }, // Ensure lead not fully unlocked
    };

    // Location filter
    if (criteria.location?.city) {
      query["location.city"] = new RegExp(criteria.location.city, "i");
    }

    // Subject filter
    if (criteria.subjects && criteria.subjects.length > 0) {
      query.subject = { $in: criteria.subjects.map((s) => new RegExp(s, "i")) };
    }

    const leads = await StudentLead.find(query).sort({ createdAt: -1 }).limit(50);

    // Calculate match scores
    const matchedLeads: LeadMatchScore[] = leads.map((lead) => {
      const { matchScore, reasons } = this.calculateMatchScore(lead, tutor, criteria);
      return { lead, matchScore, reasons };
    });

    // Filter by minimum score (60) and sort by score
    return matchedLeads.filter((m) => m.matchScore >= 60).sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Calculate match score between tutor and lead
   */
  private calculateMatchScore(
    lead: IStudentLead,
    tutor: any,
    criteria: MatchingCriteria
  ): { matchScore: number; reasons: string[] } {
    let score = lead.qualityScore; // Start with lead quality
    const reasons: string[] = [];

    // Subject match (if tutor has subjects field)
    if (tutor.subjects && Array.isArray(tutor.subjects)) {
      const subjectMatch = tutor.subjects.some((s: string) =>
        lead.subject.toLowerCase().includes(s.toLowerCase())
      );
      if (subjectMatch) {
        score += 20;
        reasons.push("Subject match");
      } else {
        score -= 10;
      }
    }

    // Location match
    if (tutor.location?.city && lead.location?.city) {
      if (tutor.location.city.toLowerCase() === lead.location.city.toLowerCase()) {
        score += 15;
        reasons.push("Same city");
      }
    }

    // Teaching mode match
    if (tutor.teachingMode) {
      if (
        lead.teachingMode === tutor.teachingMode ||
        lead.teachingMode === "hybrid" ||
        tutor.teachingMode === "hybrid"
      ) {
        score += 10;
        reasons.push("Teaching mode compatible");
      }
    }

    // Budget consideration
    if (lead.budget && tutor.expectedFee) {
      if (lead.budget >= tutor.expectedFee * 0.8) {
        score += 10;
        reasons.push("Budget matches expectations");
      } else {
        score -= 5;
      }
    }

    // Urgency bonus
    if (lead.urgency === "immediate") {
      score += 5;
      reasons.push("Urgent requirement");
    }

    return { matchScore: Math.min(score, 100), reasons };
  }

  /**
   * Unlock a lead (deduct credits)
   */
  async unlockLead(tutorId: string, leadId: string): Promise<ILeadUnlock> {
    const lead = await StudentLead.findById(leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    if (lead.status === "closed" || lead.status === "expired") {
      throw new Error("Lead is no longer available");
    }

    if (lead.expiryDate < new Date()) {
      throw new Error("Lead has expired");
    }

    if (lead.totalUnlocks >= lead.maxUnlocks) {
      throw new Error("Maximum unlocks reached for this lead");
    }

    // Check if already unlocked
    const existingUnlock = await LeadUnlock.findOne({
      leadId: new Types.ObjectId(leadId),
      tutorId: new Types.ObjectId(tutorId),
    });

    if (existingUnlock) {
      throw new Error("You have already unlocked this lead");
    }

    // Check credit balance
    const wallet = await LeadCreditWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });
    if (!wallet || wallet.availableCredits < lead.creditsRequired) {
      throw new Error("Insufficient credits. Please purchase more credits.");
    }

    // Deduct credits
    wallet.availableCredits -= lead.creditsRequired;
    wallet.usedCredits += lead.creditsRequired;
    await wallet.save();

    // Create unlock record
    const unlock = await LeadUnlock.create({
      leadId: new Types.ObjectId(leadId),
      tutorId: new Types.ObjectId(tutorId),
      creditsUsed: lead.creditsRequired,
      status: "new",
      unlockedAt: new Date(),
    });

    // Update lead unlock count
    lead.totalUnlocks += 1;
    if (lead.status === "new") lead.status = "active";
    await lead.save();

    // Record transaction
    await CreditTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount: 0,
      credits: -lead.creditsRequired,
      transactionType: "lead_unlock",
      status: "completed",
      description: `Unlocked lead: ${lead.subject} - ${lead.studentClass}`,
      referenceId: (unlock._id as Types.ObjectId).toString(),
    });

    return unlock;
  }

  /**
   * Get tutor's unlocked leads
   */
  async getUnlockedLeads(tutorId: string, status?: string): Promise<ILeadUnlock[]> {
    const query: any = { tutorId: new Types.ObjectId(tutorId) };
    if (status) query.status = status;

    return await LeadUnlock.find(query)
      .populate("leadId")
      .sort({ createdAt: -1 });
  }

  /**
   * Update lead status in unlock pipeline
   */
  async updateLeadStatus(
    tutorId: string,
    unlockId: string,
    status: string,
    notes?: string
  ): Promise<ILeadUnlock> {
    const unlock = await LeadUnlock.findOne({
      _id: new Types.ObjectId(unlockId),
      tutorId: new Types.ObjectId(tutorId),
    });

    if (!unlock) {
      throw new Error("Unlock record not found");
    }

    unlock.status = status as any;
    if (notes) unlock.notes = notes;

    // Update timestamps based on status
    const now = new Date();
    switch (status) {
      case "contacted":
        unlock.contactedAt = now;
        break;
      case "demo_scheduled":
        unlock.demoScheduledAt = now;
        break;
      case "demo_completed":
        unlock.demoCompletedAt = now;
        break;
      case "converted":
        unlock.convertedAt = now;
        break;
      case "lost":
        unlock.lostAt = now;
        break;
    }

    await unlock.save();
    return unlock;
  }

  /**
   * Mark lead as converted (create conversion record)
   */
  async markAsConverted(
    tutorId: string,
    unlockId: string,
    monthlyFee: number,
    commissionPercentage: number = 10
  ): Promise<any> {
    const unlock = await LeadUnlock.findOne({
      _id: new Types.ObjectId(unlockId),
      tutorId: new Types.ObjectId(tutorId),
    }).populate("leadId");

    if (!unlock) {
      throw new Error("Unlock record not found");
    }

    if (unlock.status === "converted") {
      throw new Error("Lead already marked as converted");
    }

    // Update unlock status
    unlock.status = "converted";
    unlock.convertedAt = new Date();
    await unlock.save();

    const lead = unlock.leadId as any;

    // Calculate commission
    const commissionAmount = (monthlyFee * commissionPercentage) / 100;
    const tutorAmount = monthlyFee - commissionAmount;

    // Create conversion record
    const conversion = await TutorConversion.create({
      leadId: lead._id,
      tutorId: new Types.ObjectId(tutorId),
      parentId: lead.parentId,
      unlockId: unlock._id,
      monthlyFee,
      commissionPercentage,
      commissionAmount,
      tutorAmount,
      startDate: new Date(),
      status: "active",
      totalPaid: 0,
    });

    // Update lead status
    lead.status = "assigned";
    await lead.save();

    return { conversion, unlock };
  }

  /**
   * Get all leads (for parents)
   */
  async getParentLeads(parentId: string): Promise<IStudentLead[]> {
    return await StudentLead.find({ parentId: new Types.ObjectId(parentId) }).sort({
      createdAt: -1,
    });
  }

  /**
   * Get lead details with unlock count
   */
  async getLeadById(leadId: string): Promise<IStudentLead | null> {
    return await StudentLead.findById(leadId);
  }

  /**
   * Check if user has access to lead (for IDOR protection)
   */
  async userHasAccessToLead(userId: string, userRole: string, leadId: string): Promise<boolean> {
    const lead = await StudentLead.findById(leadId);
    if (!lead) return false;

    // Parent can only view their own leads
    if (userRole === "parent") {
      return String(lead.parentId) === String(userId);
    }

    // Tutor can only view leads they unlocked
    if (userRole === "tutor") {
      const unlock = await LeadUnlock.findOne({
        tutorId: new Types.ObjectId(userId),
        leadId: new Types.ObjectId(leadId),
      });
      return !!unlock;
    }

    // Admin can view all leads
    if (userRole === "admin") {
      return true;
    }

    return false;
  }

  /**
   * Close a lead
   */
  async closeLead(leadId: string, parentId: string): Promise<IStudentLead> {
    const lead = await StudentLead.findOne({
      _id: new Types.ObjectId(leadId),
      parentId: new Types.ObjectId(parentId),
    });

    if (!lead) {
      throw new Error("Lead not found");
    }

    lead.status = "closed";
    await lead.save();

    return lead;
  }

  /**
   * Expire old leads (cron job)
   */
  async expireLeads(): Promise<number> {
    const now = new Date();
    const result = await StudentLead.updateMany(
      {
        status: { $in: ["new", "active"] },
        expiryDate: { $lt: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    return result.modifiedCount;
  }

  /**
   * Admin: Get all leads with stats
   */
  async getAllLeadsAdmin(filters?: any): Promise<IStudentLead[]> {
    const query = filters || {};
    return await StudentLead.find(query)
      .populate("parentId", "fullName email phone")
      .sort({ createdAt: -1 })
      .limit(100);
  }
}

export default new LeadService();
