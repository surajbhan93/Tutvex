import mongoose, { Schema, Document, Model } from "mongoose";

/**
 * 🔹 TypeScript interface
 */
export interface IChatbotMessage {
  sessionId: string;
  sender: "user" | "bot";
  message: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * 🔹 Mongoose Document
 */
export interface ChatbotMessageDocument
  extends IChatbotMessage,
    Document {}

/**
 * 🔹 Schema
 */
const ChatbotMessageSchema = new Schema<ChatbotMessageDocument>(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
    },

    sender: {
      type: String,
      enum: ["user", "bot"],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * 🔹 SAFE model export (MOST IMPORTANT)
 */
const ChatbotMessage: Model<ChatbotMessageDocument> =
  mongoose.models.ChatbotMessage ||
  mongoose.model<ChatbotMessageDocument>(
    "ChatbotMessage",
    ChatbotMessageSchema
  );

export default ChatbotMessage;
