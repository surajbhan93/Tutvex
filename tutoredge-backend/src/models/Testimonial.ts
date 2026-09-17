import mongoose, { Schema, Document } from "mongoose";

export interface ITestimonial extends Document {
  user: mongoose.Types.ObjectId;
  role: "parent" | "student" | "tutor";
  name: string;
  rating: number;
  message: string;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["parent", "student", "tutor"],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    
    message: {
      type: String,
      required: true,
      maxlength: 500,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>(
  "Testimonial",
  TestimonialSchema
);
