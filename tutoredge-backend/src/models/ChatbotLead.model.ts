import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * 🔹 TypeScript interface
 */
export interface IChatbotLead {
  sessionId: string;
  name?: string;
  role: "guest" | "parent" | "student" | "tutor" | "admin";
  phone?: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 🔹 Mongoose Document type
 */
export interface ChatbotLeadDocument
  extends IChatbotLead,
    Document {}

/**
 * 🔹 Schema
 */
const ChatbotLeadSchema = new Schema<ChatbotLeadDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    name: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["guest", "parent", "student", "tutor", "admin"],
      default: "guest",
    },

    phone: {
      type: String,
      index: true,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * 🔹 Safe model export (prevents OverwriteModelError)
 */
const ChatbotLead: Model<ChatbotLeadDocument> =
  mongoose.models.ChatbotLead ||
  mongoose.model<ChatbotLeadDocument>("ChatbotLead", ChatbotLeadSchema);

export default ChatbotLead;
