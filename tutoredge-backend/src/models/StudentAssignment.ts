import { Schema, model, Document, Types } from "mongoose";

export interface IStudentAssignment extends Document {
  assignment_id: Types.ObjectId;
  student_id: Types.ObjectId;
  tutor_id: Types.ObjectId;

  status: "assigned" | "submitted" | "checked";
  assigned_at: Date;
  due_date: string;

  submission?: {
    files: {
      filename: string;
      url: string;
    }[];

    submitted_at: Date;

    // 🔥 ADD THESE
    submitted_by?: "parent" | "student";
    student_name?: string;
  };

  marks?: number;    // out of 100
  feedback?: string; // tutor feedback
}

const StudentAssignmentSchema = new Schema<IStudentAssignment>(
  {
    assignment_id: {
      type: Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
    },

    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    tutor_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["assigned", "submitted", "checked"],
      default: "assigned",
    },

    assigned_at: {
      type: Date,
      default: Date.now,
    },

    due_date: {
      type: String,
      required: true,
    },

    submission: {
      files: [
        {
          filename: String,
          url: String,
        },
      ],

      submitted_at: Date,

      submitted_by: {
        type: String,
        enum: ["parent", "student"],
        default: "parent",
      },

      student_name: {
        type: String,
      },
    },

    marks: Number,
    feedback: String,
  },
  { timestamps: true }
);

// prevent duplicate assignment to same student
StudentAssignmentSchema.index(
  { assignment_id: 1, student_id: 1 },
  { unique: true }
);

export default model<IStudentAssignment>(
  "StudentAssignment",
  StudentAssignmentSchema
);
