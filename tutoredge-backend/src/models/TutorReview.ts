import mongoose, { Schema, Document } from "mongoose";

export interface ITutorReview extends Document {
  tutor: mongoose.Types.ObjectId;
  parent: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
}

const TutorReviewSchema = new Schema<ITutorReview>(
  {
    tutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      maxlength: 500,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ITutorReview>(
  "TutorReview",
  TutorReviewSchema
);
