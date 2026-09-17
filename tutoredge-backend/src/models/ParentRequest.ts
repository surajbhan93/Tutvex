
import { Schema, model, Document, Types } from "mongoose";

export interface IParentRequest extends Document {
  _id: Types.ObjectId;

  parent: Types.ObjectId;

  // 🔥 Parent preference
  requestedTutor: Types.ObjectId | null;

  // 🔥 Tutor who showed interest
  interestedTutor?: Types.ObjectId | null;

  // 🔥 Admin assigned tutor
  tutor: Types.ObjectId | null;

  // 🔥 Student (optional)
  student?: Types.ObjectId | null;

  // 🔥 Manual student name (optional)
  studentName?: string | null;

  board: string;
  classGrade: string;

  academicNeeds: string[];
  scheduling: string[];
  location: string;

  urgency: "within_24_hours" | "within_3_days" | "within_a_week";
// 🔥 ADD THIS
type: "demo" | "manual";
parentName?: string;
phone?: string;
source?: "parent" | "admin" | "olx" | "ads";
  status: "pending" | "contacted" | "assigned" | "completed" | "cancelled";

  adminNote?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

const ParentRequestSchema = new Schema<IParentRequest>(
  {
    parent: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ✅ Parent preferred tutor (optional)
    requestedTutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Tutor who clicked "Interested"
    interestedTutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Admin assigned tutor
    tutor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ✅ Existing student (optional)
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    // ✅ Manual student name (if student not created)
    studentName: {
      type: String,
      trim: true,
      default: null,
    },

    board: {
      type: String,
      required: true,
      trim: true,
    },

    classGrade: {
      type: String,
      required: true,
      trim: true,
    },

    academicNeeds: {
      type: [String],
      required: true,
    },

    scheduling: {
      type: [String],
      default: [],
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    urgency: {
      type: String,
      enum: ["within_24_hours", "within_3_days", "within_a_week"],
      required: true,
    },
 
    // 🔥 Lead type (parent vs admin)
type: {
  type: String,
  enum: ["demo", "manual"],
  default: "demo",
},
// 🔥 Admin lead ke liye contact info
parentName: {
  type: String,
  trim: true,
},

phone: {
  type: String,
  trim: true,
},

// 🔥 Lead source tracking
source: {
  type: String,
  enum: ["parent", "admin", "olx", "ads"],
  default: "parent",
},
    status: {
      type: String,
      enum: ["pending", "contacted", "assigned", "completed", "cancelled"],
      default: "pending",
    },

    adminNote: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

//
// 🔐 VALIDATIONS
//

// ✅ Ensure student OR studentName exists
ParentRequestSchema.pre("validate", function (next) {
  if (!this.student && !this.studentName) {
    return next(
      new Error("Either student or studentName must be provided")
    );
  }
  next();
});

// 🔥 Manual lead validation (admin side)
ParentRequestSchema.pre("validate", function (next) {
  if (this.type === "manual") {
    if (!this.studentName) {
      return next(
        new Error("studentName is required for manual leads")
      );
    }
  }
  next();
});
// ✅ State rules
ParentRequestSchema.pre("save", function (next) {
  if (this.status === "pending" && this.tutor) {
    return next(
      new Error("Tutor cannot be assigned while request is pending")
    );
  }

  if (this.status === "assigned" && !this.tutor) {
    return next(
      new Error("Tutor must be assigned before marking as assigned")
    );
  }

  next();
});

//
// ⚡ INDEXES (Admin Panel Fast Queries)
//
ParentRequestSchema.index({ status: 1 });
ParentRequestSchema.index({ tutor: 1 });
ParentRequestSchema.index({ parent: 1 });
ParentRequestSchema.index({ createdAt: -1 });

export default model<IParentRequest>(
  "ParentRequest",
  ParentRequestSchema
);
