import { Schema, model, Document } from "mongoose";

export interface ISubscriptionPlan extends Document {
  name: string;
  slug: string; // 'free', 'starter', 'pro', 'premium'
  price: number;
  durationDays: number;
  monthlyCredits: number;
  priorityScore: number; // Higher = better visibility
  features: {
    featuredProfile: boolean;
    contactAccess: boolean;
    analyticsAccess: boolean;
    priorityMatching: boolean;
    whatsappAccess: boolean;
    verifiedBadge: boolean;
    proBadge: boolean;
    premiumBadge: boolean;
    dedicatedSupport: boolean;
  };
  isActive: boolean;
  displayOrder: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const SubscriptionPlanSchema = new Schema<ISubscriptionPlan>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true, default: 0 },
    durationDays: { type: Number, required: true, default: 30 },
    monthlyCredits: { type: Number, required: true, default: 0 },
    priorityScore: { type: Number, required: true, default: 0 },
    features: {
      featuredProfile: { type: Boolean, default: false },
      contactAccess: { type: Boolean, default: false },
      analyticsAccess: { type: Boolean, default: false },
      priorityMatching: { type: Boolean, default: false },
      whatsappAccess: { type: Boolean, default: false },
      verifiedBadge: { type: Boolean, default: false },
      proBadge: { type: Boolean, default: false },
      premiumBadge: { type: Boolean, default: false },
      dedicatedSupport: { type: Boolean, default: false },
    },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default model<ISubscriptionPlan>("SubscriptionPlan", SubscriptionPlanSchema);
