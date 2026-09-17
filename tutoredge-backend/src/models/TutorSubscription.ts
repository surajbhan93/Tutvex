import { Schema, model, Document, Types } from "mongoose";

export type SubscriptionStatus = "active" | "expired" | "cancelled" | "pending";

export interface ITutorSubscription extends Document {
  tutorId: Types.ObjectId;
  planId: Types.ObjectId;
  status: SubscriptionStatus;
  startDate: Date;
  expiryDate: Date;
  autoRenew: boolean;
  razorpaySubscriptionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  cancelledAt?: Date;
  cancelReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const TutorSubscriptionSchema = new Schema<ITutorSubscription>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    planId: { type: Schema.Types.ObjectId, ref: "SubscriptionPlan", required: true },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled", "pending"],
      default: "pending",
    },
    startDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: false },
    razorpaySubscriptionId: { type: String },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
  },
  { timestamps: true }
);

// Index for faster queries
TutorSubscriptionSchema.index({ tutorId: 1, status: 1 });
TutorSubscriptionSchema.index({ expiryDate: 1 });

export default model<ITutorSubscription>("TutorSubscription", TutorSubscriptionSchema);
