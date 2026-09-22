import { Schema, model, Document, Types } from "mongoose";

export interface IUserNotificationToken extends Document {
  userId?: Types.ObjectId; // Make optional for anonymous users
  token: string;
  platform: "web" | "android" | "ios";
  browser?: string;
  deviceId?: string;
  isActive: boolean;
  lastUsedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserNotificationTokenSchema = new Schema<IUserNotificationToken>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // Allow anonymous users
      index: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    platform: {
      type: String,
      enum: ["web", "android", "ios"],
      required: true,
      default: "web",
    },
    browser: {
      type: String,
    },
    deviceId: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for efficient queries
UserNotificationTokenSchema.index({ userId: 1, isActive: 1 });
UserNotificationTokenSchema.index({ userId: 1, platform: 1 });
UserNotificationTokenSchema.index({ token: 1 }, { unique: true });
UserNotificationTokenSchema.index({ lastUsedAt: 1 });

// Method to deactivate token
UserNotificationTokenSchema.methods.deactivate = async function () {
  this.isActive = false;
  return this.save();
};

// Static method to get active tokens for a user
UserNotificationTokenSchema.statics.getActiveTokens = async function (
  userId: string | Types.ObjectId
): Promise<string[]> {
  const tokens = await this.find({
    userId: new Types.ObjectId(userId),
    isActive: true,
  }).select("token");

  return tokens.map((t: any) => t.token);
};

// Static method to deactivate a specific token
UserNotificationTokenSchema.statics.deactivateToken = async function (
  token: string
): Promise<boolean> {
  const result = await this.updateOne(
    { token },
    { $set: { isActive: false } }
  );
  return result.modifiedCount > 0;
};

// Static method to cleanup old inactive tokens (older than 90 days)
UserNotificationTokenSchema.statics.cleanupOldTokens = async function (): Promise<number> {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const result = await this.deleteMany({
    isActive: false,
    lastUsedAt: { $lt: ninetyDaysAgo },
  });

  return result.deletedCount || 0;
};

export default model<IUserNotificationToken>(
  "UserNotificationToken",
  UserNotificationTokenSchema
);
