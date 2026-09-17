import { Schema, model, Document, Types } from "mongoose";

export type CreditTransactionType =
  | "purchase"
  | "subscription_credit"
  | "lead_unlock"
  | "refund"
  | "bonus"
  | "admin_adjustment";

export type TransactionStatus = "pending" | "completed" | "failed" | "refunded";

export interface ICreditTransaction extends Document {
  tutorId: Types.ObjectId;
  amount: number; // Money amount in rupees
  credits: number; // Credits added/deducted
  transactionType: CreditTransactionType;
  status: TransactionStatus;
  referenceId?: string; // Lead ID, Order ID, etc.
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  description?: string;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true, default: 0 },
    credits: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: ["purchase", "subscription_credit", "lead_unlock", "refund", "bonus", "admin_adjustment"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
    },
    referenceId: { type: String },
    razorpayPaymentId: { type: String },
    razorpayOrderId: { type: String },
    description: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes
CreditTransactionSchema.index({ tutorId: 1, createdAt: -1 });
CreditTransactionSchema.index({ razorpayPaymentId: 1 });
CreditTransactionSchema.index({ status: 1 });

export default model<ICreditTransaction>("CreditTransaction", CreditTransactionSchema);
