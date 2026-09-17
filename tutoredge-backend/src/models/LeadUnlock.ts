import { Schema, model, Document, Types } from "mongoose";

export type LeadUnlockStatus =
  | "new"
  | "contacted"
  | "response_received"
  | "demo_scheduled"
  | "demo_completed"
  | "converted"
  | "lost";

export interface ILeadUnlock extends Document {
  leadId: Types.ObjectId;
  tutorId: Types.ObjectId;
  creditsUsed: number;
  status: LeadUnlockStatus;
  contactedAt?: Date;
  demoScheduledAt?: Date;
  demoCompletedAt?: Date;
  convertedAt?: Date;
  lostAt?: Date;
  lostReason?: string;
  notes?: string;
  unlockedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeadUnlockSchema = new Schema<ILeadUnlock>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "StudentLead", required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    creditsUsed: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "response_received",
        "demo_scheduled",
        "demo_completed",
        "converted",
        "lost",
      ],
      default: "new",
    },
    contactedAt: { type: Date },
    demoScheduledAt: { type: Date },
    demoCompletedAt: { type: Date },
    convertedAt: { type: Date },
    lostAt: { type: Date },
    lostReason: { type: String },
    notes: { type: String },
    unlockedAt: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true }
);

// Unique constraint: A tutor cannot unlock the same lead twice
LeadUnlockSchema.index({ leadId: 1, tutorId: 1 }, { unique: true });

// Other indexes
LeadUnlockSchema.index({ tutorId: 1, status: 1, createdAt: -1 });
LeadUnlockSchema.index({ leadId: 1 });

export default model<ILeadUnlock>("LeadUnlock", LeadUnlockSchema);
