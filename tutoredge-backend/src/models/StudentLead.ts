import { Schema, model, Document, Types } from "mongoose";

export type LeadStatus = "new" | "active" | "assigned" | "closed" | "expired";
export type TeachingMode = "online" | "home" | "hybrid";

export type LeadAvailability = "active" | "already_filled";

export interface IStudentLead extends Document {
  parentId: Types.ObjectId;
  parentName?: string;
  parentPhone?: string;
  parentEmail?: string;
  studentName?: string;
  studentClass: string;
  board?: string; // CBSE, ICSE, State Board, etc.
  schoolName?: string; // Student's school name
  subject: string;
  teachingMode: TeachingMode;
  location: {
    city?: string;
    area?: string;
    state?: string;
    pincode?: string;
    coordinates?: {
      type: "Point";
      coordinates: [number, number]; // [lng, lat]
    };
  };
  budget: number;
  budgetType: "per_hour" | "per_month";
  preferredTime?: string;
  additionalRequirements?: string;
  urgency: "immediate" | "within_week" | "within_month" | "flexible";
  status: LeadStatus;
  availability: LeadAvailability; // "active" = can unlock with credits, "already_filled" = display only
  qualityScore: number; // 0-100
  creditsRequired: number;
  totalUnlocks: number;
  maxUnlocks: number; // Limit how many tutors can unlock
  expiryDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const StudentLeadSchema = new Schema<IStudentLead>(
  {
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentName: { type: String },
    parentPhone: { type: String },
    parentEmail: { type: String },
    studentName: { type: String },
    studentClass: { type: String, required: true },
    board: { type: String }, // CBSE, ICSE, State Board, etc.
    schoolName: { type: String }, // Student's school name
    subject: { type: String, required: true },
    teachingMode: { type: String, enum: ["online", "home", "hybrid"], required: true },
    location: {
      city: { type: String },
      area: { type: String },
      state: { type: String },
      pincode: { type: String },
      coordinates: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], default: [0, 0] },
      },
    },
    budget: { type: Number, required: true },
    budgetType: { type: String, enum: ["per_hour", "per_month"], default: "per_month" },
    preferredTime: { type: String },
    additionalRequirements: { type: String },
    urgency: {
      type: String,
      enum: ["immediate", "within_week", "within_month", "flexible"],
      default: "flexible",
    },
    status: { type: String, enum: ["new", "active", "assigned", "closed", "expired"], default: "new" },
    availability: { 
      type: String, 
      enum: ["active", "already_filled"], 
      default: "active",
      required: true 
    }, // active = can unlock, already_filled = display only
    qualityScore: { type: Number, required: true, default: 50, min: 0, max: 100 },
    creditsRequired: { type: Number, required: true, default: 3 },
    totalUnlocks: { type: Number, default: 0 },
    maxUnlocks: { type: Number, default: 10 },
    expiryDate: { type: Date, required: true },
  },
  { timestamps: true }
);

// Indexes for efficient queries
StudentLeadSchema.index({ status: 1, createdAt: -1 });
StudentLeadSchema.index({ "location.city": 1, subject: 1 });
StudentLeadSchema.index({ expiryDate: 1 });
StudentLeadSchema.index({ parentId: 1 });

// Geospatial index for location-based queries
StudentLeadSchema.index({ "location.coordinates": "2dsphere" });

export default model<IStudentLead>("StudentLead", StudentLeadSchema);
