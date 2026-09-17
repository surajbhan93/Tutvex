import { Schema, model, Document, Types } from "mongoose";

export type NotificationType =
  | "new_lead"
  | "lead_unlocked"
  | "subscription_activated"
  | "subscription_expiring"
  | "subscription_expired"
  | "credit_purchased"
  | "payment_received"
  | "withdrawal_approved"
  | "withdrawal_rejected"
  | "conversion_created";

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link?: string;
  metadata?: any;
  createdAt?: Date;
  readAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "new_lead",
        "lead_unlocked",
        "subscription_activated",
        "subscription_expiring",
        "subscription_expired",
        "credit_purchased",
        "payment_received",
        "withdrawal_approved",
        "withdrawal_rejected",
        "conversion_created",
      ],
      required: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String },
    metadata: { type: Schema.Types.Mixed },
    readAt: { type: Date },
  },
  { timestamps: true }
);

// Indexes
NotificationSchema.index({ userId: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, isRead: 1 });

export default model<INotification>("Notification", NotificationSchema);
