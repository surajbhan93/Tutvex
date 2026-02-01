import mongoose from "mongoose";

const StudentRequestSchema = new mongoose.Schema(
  {
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    subject: { type: String, required: true },
    class_grade: { type: String, required: true },
    description: { type: String },
    mode: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    location: {
      type: String,
      default: "Any",
    },
    status: {
  type: String,
  enum: ["pending", "assigned", "closed"],
  default: "pending",
}

  },
  { timestamps: true }
);

export default mongoose.model("StudentRequest", StudentRequestSchema);
