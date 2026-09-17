import mongoose, { Schema, Document, Model } from "mongoose";

export interface IDemoLead extends Document {
  leadId: string;
  city: string;
  state: string;
  studentClass: string;
  locality: string;
  phone: string;
  sourceUrl?: string;
  status: "PENDING" | "CONTACTED" | "DEMO_SCHEDULED" | "CONVERTED" | "CANCELLED";
  assignedCounselor?: string;
  adminNotes?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DemoLeadSchema: Schema<IDemoLead> = new Schema(
  {
    leadId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      index: true,
    },
    state: {
      type: String,
      default: "Uttar Pradesh",
      trim: true,
    },
    studentClass: {
      type: String,
      required: [true, "Student Class is required"],
      trim: true,
    },
    locality: {
      type: String,
      required: [true, "Locality is required"],
      trim: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },
    sourceUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "CONTACTED", "DEMO_SCHEDULED", "CONVERTED", "CANCELLED"],
      default: "PENDING",
      index: true,
    },
    assignedCounselor: {
      type: String,
      trim: true,
    },
    adminNotes: {
      type: String,
      trim: true,
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching in Admin Dashboard
DemoLeadSchema.index({ city: 1, status: 1 });
DemoLeadSchema.index({ createdAt: -1 });

export const DemoLead: Model<IDemoLead> =
  mongoose.models.DemoLead || mongoose.model<IDemoLead>("DemoLead", DemoLeadSchema);

export default DemoLead;
