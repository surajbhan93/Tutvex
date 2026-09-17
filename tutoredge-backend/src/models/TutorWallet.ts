import { Schema, model, Document, Types } from "mongoose";

export interface ITutorWallet extends Document {
  tutorId: Types.ObjectId;
  availableBalance: number;
  pendingSettlement: number;
  totalEarned: number;
  totalWithdrawn: number;
  totalCommissionPaid: number;
  lastWithdrawalAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const TutorWalletSchema = new Schema<ITutorWallet>(
  {
    tutorId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    availableBalance: { type: Number, required: true, default: 0 },
    pendingSettlement: { type: Number, required: true, default: 0 },
    totalEarned: { type: Number, required: true, default: 0 },
    totalWithdrawn: { type: Number, required: true, default: 0 },
    totalCommissionPaid: { type: Number, required: true, default: 0 },
    lastWithdrawalAt: { type: Date },
  },
  { timestamps: true }
);

// Note: unique: true on tutorId already creates an index, no need for explicit index

export default model<ITutorWallet>("TutorWallet", TutorWalletSchema);
