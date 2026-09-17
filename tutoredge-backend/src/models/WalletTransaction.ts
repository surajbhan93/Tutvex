import { Schema, model, Document, Types } from "mongoose";

export type WalletTransactionType =
  | "student_payment"
  | "commission_deduction"
  | "refund"
  | "withdrawal"
  | "bonus"
  | "penalty"
  | "admin_adjustment";

export type WalletTransactionStatus = "pending" | "completed" | "failed" | "cancelled";

export interface IWalletTransaction extends Document {
  tutorId: Types.ObjectId;
  amount: number;
  transactionType: WalletTransactionType;
  status: WalletTransactionStatus;
  referenceId?: string; // Conversion ID, Withdrawal ID, etc.
  description?: string;
  balanceBefore: number;
  balanceAfter: number;
  metadata?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransaction>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    transactionType: {
      type: String,
      enum: [
        "student_payment",
        "commission_deduction",
        "refund",
        "withdrawal",
        "bonus",
        "penalty",
        "admin_adjustment",
      ],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "cancelled"],
      default: "pending",
    },
    referenceId: { type: String },
    description: { type: String },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

// Indexes
WalletTransactionSchema.index({ tutorId: 1, createdAt: -1 });
WalletTransactionSchema.index({ status: 1 });
WalletTransactionSchema.index({ referenceId: 1 });

export default model<IWalletTransaction>("WalletTransaction", WalletTransactionSchema);
