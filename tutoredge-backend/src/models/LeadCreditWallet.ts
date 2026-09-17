import { Schema, model, Document, Types } from "mongoose";

export interface ILeadCreditWallet extends Document {
  tutorId: Types.ObjectId;
  availableCredits: number;
  usedCredits: number;
  totalEarned: number;
  totalPurchased: number;
  lastCreditAddedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const LeadCreditWalletSchema = new Schema<ILeadCreditWallet>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    availableCredits: { type: Number, required: true, default: 3 }, // Free 3 credits
    usedCredits: { type: Number, required: true, default: 0 },
    totalEarned: { type: Number, required: true, default: 3 },
    totalPurchased: { type: Number, required: true, default: 0 },
    lastCreditAddedAt: { type: Date },
  },
  { timestamps: true }
);

// Note: unique: true on tutorId already creates an index, no need for explicit index

export default model<ILeadCreditWallet>("LeadCreditWallet", LeadCreditWalletSchema);
