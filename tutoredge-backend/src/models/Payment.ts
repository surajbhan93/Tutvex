import { Schema, model, Document, Types } from "mongoose";

/**
 * Payment document represents:
 * Parent → Admin monthly payment
 * Admin → Tutor settlement (tracked separately)
 */
export interface IPayment extends Document {
  parent: Types.ObjectId;          // Parent user
  student: Types.ObjectId;         // Student for which payment is done
  tutor: Types.ObjectId;           // Tutor who will receive this amount
  parentRequest: Types.ObjectId;   // Link to ParentRequest

  amount: number;                  // Monthly fee
  month: number;                   // 1 - 12
  year: number;                    // e.g. 2026

  status: "paid" | "pending";      // Parent → Admin
  settlementStatus: "pending" | "settled"; // Admin → Tutor

  createdAt: Date;
}

const PaymentSchema = new Schema<IPayment>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
       required: false, // 🔥 ALLOW MANUAL STUDENT
    },

    tutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    parentRequest: {
      type: Schema.Types.ObjectId,
      ref: "ParentRequest",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    month: {
      type: Number,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["paid", "pending"],
      default: "pending",
    },

    settlementStatus: {
      type: String,
      enum: ["pending", "settled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// Helpful indexes
PaymentSchema.index({ parent: 1, month: 1, year: 1 });
PaymentSchema.index({ tutor: 1, settlementStatus: 1 });

export default model<IPayment>("Payment", PaymentSchema);
