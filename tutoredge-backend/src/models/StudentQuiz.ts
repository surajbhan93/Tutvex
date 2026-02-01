import { Schema, model, Document, Types } from "mongoose";

/* ======================
   SUBMISSION TYPE
====================== */
export interface IQuizSubmission {
  answers: {
    question_id: Types.ObjectId;
    selected_option: string;
  }[];
  submitted_at: Date;
}

/* ======================
   MAIN INTERFACE
====================== */
export interface IStudentQuiz extends Document {
  quiz_id: Types.ObjectId;
  student_id: Types.ObjectId;
  tutor_id: Types.ObjectId;

  status: "assigned" | "submitted" | "checked";

  due_date?: Date;
  assigned_at: Date;

  submission?: IQuizSubmission;

  score?: number;
  checked_at?: Date;
}

/* ======================
   SCHEMA
====================== */
const StudentQuizSchema = new Schema<IStudentQuiz>(
  {
    quiz_id: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
      index: true,
    },

    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    tutor_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["assigned", "submitted", "checked"],
      default: "assigned",
      index: true,
    },

    due_date: {
      type: Date,
    },

    assigned_at: {
      type: Date,
      default: Date.now,
    },

    /* 🔥 QUIZ SUBMISSION */
    submission: {
      answers: [
        {
          question_id: {
            type: Schema.Types.ObjectId,
            required: true,
          },
          selected_option: {
            type: String,
            required: true,
          },
        },
      ],
      submitted_at: {
        type: Date,
      },
    },

    /* 🔥 RESULT */
    score: {
      type: Number,
      default: null,
    },

    checked_at: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* ======================
   INDEXES
====================== */

// ❌ prevent duplicate quiz assignment
StudentQuizSchema.index(
  { quiz_id: 1, student_id: 1 },
  { unique: true }
);

// ⚡ fast tutor dashboard queries
StudentQuizSchema.index({
  tutor_id: 1,
  status: 1,
});

// ⚡ fast parent/student dashboard queries
StudentQuizSchema.index({
  student_id: 1,
  status: 1,
});

export default model<IStudentQuiz>("StudentQuiz", StudentQuizSchema);
