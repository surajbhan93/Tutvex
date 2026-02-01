import mongoose, { Schema, Document } from "mongoose";

export interface TeamDocument extends Document {
  name: string;
  role: string;
  bio?: string;
  image?: string;
  linkedin?: string;
  isActive: boolean;
  isFounder: boolean; // 👈 NEW
}

const TeamSchema = new Schema<TeamDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
    },
    bio: String,
    image: String,
    linkedin: String,

    isFounder: {
      type: Boolean,
      default: false, // 👈 important
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<TeamDocument>("Team", TeamSchema);
