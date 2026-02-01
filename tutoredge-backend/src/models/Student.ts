import mongoose, { Schema, Document, Types } from "mongoose";

export interface IStudent extends Document {
  full_name: string;
  class: string;
  board: string;
  institution_name: string;
  subjects_required: string[];
  additional_notes?: string;
  parent_id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    full_name: {
      type: String,
      required: true,
      trim: true
    },

    class: {
      type: String,
      required: true,
      trim: true
    },

    board: {
      type: String,
      required: true,
      trim: true
    },

    institution_name: {
      type: String,
      required: true,
      trim: true
    },

    subjects_required: {
      type: [String],
      required: true
    },

    additional_notes: {
      type: String,
      trim: true
    },

    parent_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IStudent>("Student", StudentSchema);
