import { Schema, model, Document, Types } from "mongoose";

export type ConversionStatus = "active" | "completed" | "cancelled" | "disputed";

export interface ITutorConversion extends Document {
  leadId: Types.ObjectId;
  tutorId: Types.ObjectId;
  parentId: Types.ObjectId;
  unlockId: Types.ObjectId;
  monthlyFee: number;
  commissionPercentage: number;
  commissionAmount: number;
  tutorAmount: number;
  startDate: Date;
  endDate?: Date;
  status: ConversionStatus;
  numberOfClasses?: number;
  classesCompleted?: number;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  totalPaid: number;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

const TutorConversionSchema = new Schema<ITutorConversion>(
  {
    leadId: { type: Schema.Types.ObjectId, ref: "StudentLead", required: true },
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    parentId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    unlockId: { type: Schema.Types.ObjectId, ref: "LeadUnlock", required: true },
    monthlyFee: { type: Number, required: true },
    commissionPercentage: { type: Number, required: true, default: 10 },
    commissionAmount: { type: Number, required: true },
    tutorAmount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled", "disputed"],
      default: "active",
    },
    numberOfClasses: { type: Number },
    classesCompleted: { type: Number, default: 0 },
    lastPaymentDate: { type: Date },
    nextPaymentDate: { type: Date },
    totalPaid: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes
TutorConversionSchema.index({ tutorId: 1, status: 1 });
TutorConversionSchema.index({ leadId: 1 });
TutorConversionSchema.index({ parentId: 1 });
TutorConversionSchema.index({ nextPaymentDate: 1 });

export default model<ITutorConversion>("TutorConversion", TutorConversionSchema);
