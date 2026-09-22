import User from "../models/User";
import { IStudentLead } from "../models/StudentLead";
import { Types } from "mongoose";

export interface MatchingCriteria {
  subject: string;
  studentClass: string;
  city?: string;
  area?: string;
  teachingMode: "online" | "home" | "hybrid";
}

export class LeadMatchingService {
  /**
   * Find tutors matching a student lead
   */
  async findMatchingTutors(lead: IStudentLead): Promise<Types.ObjectId[]> {
    try {
      const query: any = {
        role: "tutor",
        status: "approved",
        isProfileComplete: true,
      };

      // Match subject (case-insensitive)
      if (lead.subject) {
        query.subjects = { $regex: new RegExp(lead.subject, "i") };
      }

      // Match class taught
      if (lead.studentClass) {
        query.classesTaught = { $regex: new RegExp(lead.studentClass, "i") };
      }

      // Match teaching mode
      if (lead.teachingMode) {
        if (lead.teachingMode === "hybrid") {
          // Hybrid matches both online and offline tutors
          query.teachingMode = { $in: ["online", "offline", "hybrid"] };
        } else if (lead.teachingMode === "home") {
          // Home tuition requires offline or hybrid
          query.teachingMode = { $in: ["offline", "hybrid"] };
        } else if (lead.teachingMode === "online") {
          // Online matches online or hybrid
          query.teachingMode = { $in: ["online", "hybrid"] };
        }
      }

      // Match location (if offline/home tuition)
      if (lead.teachingMode !== "online" && lead.location?.city) {
        // Match city (required for offline)
        query["location.city"] = { $regex: new RegExp(lead.location.city, "i") };

        // Optional: also match area if provided
        if (lead.location.area) {
          query["location.area"] = { $regex: new RegExp(lead.location.area, "i") };
        }
      }

      // Find matching tutors
      const tutors = await User.find(query)
        .select("_id")
        .sort({ subscriptionPriority: -1, rating: -1 }) // Premium tutors first
        .limit(100) // Limit to top 100 matching tutors
        .lean();

      const tutorIds = tutors.map((t: any) => new Types.ObjectId(t._id));

      console.log(
        `Found ${tutorIds.length} matching tutors for lead: ${lead.studentClass} ${lead.subject} in ${lead.location?.city || "any location"}`
      );

      return tutorIds;
    } catch (error) {
      console.error("Error finding matching tutors:", error);
      return [];
    }
  }

  /**
   * Find tutors matching specific criteria
   */
  async findTutorsByCriteria(criteria: MatchingCriteria): Promise<Types.ObjectId[]> {
    try {
      const query: any = {
        role: "tutor",
        status: "approved",
        isProfileComplete: true,
      };

      // Match subject
      if (criteria.subject) {
        query.subjects = { $regex: new RegExp(criteria.subject, "i") };
      }

      // Match class
      if (criteria.studentClass) {
        query.classesTaught = { $regex: new RegExp(criteria.studentClass, "i") };
      }

      // Match teaching mode
      if (criteria.teachingMode === "hybrid") {
        query.teachingMode = { $in: ["online", "offline", "hybrid"] };
      } else if (criteria.teachingMode === "home") {
        query.teachingMode = { $in: ["offline", "hybrid"] };
      } else if (criteria.teachingMode === "online") {
        query.teachingMode = { $in: ["online", "hybrid"] };
      }

      // Match location
      if (criteria.city) {
        query["location.city"] = { $regex: new RegExp(criteria.city, "i") };
      }

      if (criteria.area) {
        query["location.area"] = { $regex: new RegExp(criteria.area, "i") };
      }

      const tutors = await User.find(query)
        .select("_id")
        .sort({ subscriptionPriority: -1, rating: -1 })
        .limit(100)
        .lean();

      return tutors.map((t: any) => new Types.ObjectId(t._id));
    } catch (error) {
      console.error("Error finding tutors by criteria:", error);
      return [];
    }
  }

  /**
   * Check if a specific tutor matches a lead
   */
  async doesTutorMatchLead(
    tutorId: string | Types.ObjectId,
    lead: IStudentLead
  ): Promise<boolean> {
    try {
      const tutor = await User.findOne({
        _id: tutorId,
        role: "tutor",
        status: "approved",
      }).lean();

      if (!tutor) return false;

      // Check subject match
      if (lead.subject && tutor.subjects) {
        const subjectMatch = tutor.subjects.some(
          (s) => s.toLowerCase().includes(lead.subject.toLowerCase())
        );
        if (!subjectMatch) return false;
      }

      // Check class match
      if (lead.studentClass && tutor.classesTaught) {
        const classMatch = tutor.classesTaught.some(
          (c) => c.toLowerCase().includes(lead.studentClass.toLowerCase())
        );
        if (!classMatch) return false;
      }

      // Check teaching mode match
      if (lead.teachingMode && tutor.teachingMode) {
        if (lead.teachingMode === "home" && tutor.teachingMode === "online") {
          return false;
        }
        if (lead.teachingMode === "online" && tutor.teachingMode === "offline") {
          // Online lead can only match online or hybrid tutors
          return false;
        }
      }

      // Check location match (for offline/home tuition)
      if (lead.teachingMode !== "online" && lead.location?.city && tutor.location?.city) {
        const cityMatch =
          lead.location.city.toLowerCase() === tutor.location.city.toLowerCase();
        if (!cityMatch) return false;
      }

      return true;
    } catch (error) {
      console.error("Error checking tutor match:", error);
      return false;
    }
  }

  /**
   * Get matching score for a tutor and lead (0-100)
   */
  async getMatchingScore(
    tutorId: string | Types.ObjectId,
    lead: IStudentLead
  ): Promise<number> {
    try {
      const tutor = await User.findOne({
        _id: tutorId,
        role: "tutor",
      }).lean();

      if (!tutor) return 0;

      let score = 0;

      // Subject match (30 points)
      if (lead.subject && tutor.subjects) {
        const subjectMatch = tutor.subjects.some(
          (s) => s.toLowerCase() === lead.subject.toLowerCase()
        );
        if (subjectMatch) score += 30;
      }

      // Class match (20 points)
      if (lead.studentClass && tutor.classesTaught) {
        const classMatch = tutor.classesTaught.some(
          (c) => c.toLowerCase() === lead.studentClass.toLowerCase()
        );
        if (classMatch) score += 20;
      }

      // Teaching mode match (15 points)
      if (lead.teachingMode && tutor.teachingMode) {
        if (lead.teachingMode === tutor.teachingMode) {
          score += 15;
        } else if (tutor.teachingMode === "hybrid") {
          score += 10; // Hybrid tutors get partial points
        }
      }

      // Location match (20 points)
      if (lead.location?.city && tutor.location?.city) {
        if (lead.location.city.toLowerCase() === tutor.location.city.toLowerCase()) {
          score += 15;

          // Area match bonus (5 points)
          if (
            lead.location.area &&
            tutor.location.area &&
            lead.location.area.toLowerCase() === tutor.location.area.toLowerCase()
          ) {
            score += 5;
          }
        }
      } else if (lead.teachingMode === "online") {
        // Online doesn't require location match
        score += 20;
      }

      // Premium membership bonus (10 points)
      if (tutor.subscriptionPriority && tutor.subscriptionPriority > 50) {
        score += 10;
      }

      // Rating bonus (5 points)
      if (tutor.rating && tutor.rating >= 4.5) {
        score += 5;
      }

      return Math.min(score, 100);
    } catch (error) {
      console.error("Error calculating matching score:", error);
      return 0;
    }
  }
}

export default new LeadMatchingService();
