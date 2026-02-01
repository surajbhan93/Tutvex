// import { Schema, model, Document, Types } from "mongoose";

// export interface IParentRequest extends Document {
//   _id: Types.ObjectId; // ✅ ADD THIS
//   parent: Types.ObjectId;
//   requestedTutor: Types.ObjectId;      // 🔥 parent enquiry
//   tutor: Types.ObjectId | null;         // 🔥 admin assigns late 
//              // 🔥 which tutor
//   student?: Types.ObjectId;
// interestedTutor?: Types.ObjectId | null; // 🔥 tutor who clicked "request to teach"
//    board: string;        // ✅ FIXED
//   classGrade: string;   // ✅ FIXED
//   academicNeeds: string[];
//   scheduling: string[];
//   location: string;

//   urgency: "within_24_hours" | "within_3_days" | "within_a_week";

//   status: "pending" | "contacted" | "assigned" | "completed" | "cancelled";

//   adminNote?: string;               // 🔥 admin call notes
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// const ParentRequestSchema = new Schema<IParentRequest>(
//   {
//     parent: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     // ✅ Parent preference (REQUIRED)
//     requestedTutor: {
//   type: Schema.Types.ObjectId,
//   ref: "User",
//   required: false, // important
//   default: null,
// },

// interestedTutor: {
//   type: Schema.Types.ObjectId,
//   ref: "User",
//   default: null,
// },



//     // ✅ Admin assignment (OPTIONAL)
//     tutor: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       default: null,
//     },

//     board: { type: String, required: true },
//     classGrade: { type: String, required: true },

//     student: {
//       type: Schema.Types.ObjectId,
//       ref: "Student",
//       required: true, // ✅ MAKE REQUIRED
//     },

//     academicNeeds: {
//       type: [String],
//       required: true,
//     },

//     scheduling: {
//       type: [String],
//       default: [],
//     },

//     location: {
//       type: String,
//       required: true,
//     },

//     urgency: {
//       type: String,
//       enum: ["within_24_hours", "within_3_days", "within_a_week"],
//       required: true,
//     },

//     status: {
//       type: String,
//       enum: ["pending", "contacted", "assigned", "completed", "cancelled"],
//       default: "pending",
//     },

//     adminNote: {
//       type: String,
//     },
//   },
//   { timestamps: true }
// );

// // 🔐 State validation
// ParentRequestSchema.pre("save", function (next) {
//   if (this.status === "pending" && this.tutor !== null) {
//     return next(
//       new Error("Tutor cannot be assigned when status is pending")
//     );
//   }

//   if (this.status === "assigned" && !this.tutor) {
//     return next(
//       new Error("Tutor must be assigned before marking as assigned")
//     );
//   }

//   next();
// });


// // 🔍 Admin panel fast filters
// ParentRequestSchema.index({ status: 1 });
// ParentRequestSchema.index({ tutor: 1 });
// ParentRequestSchema.index({ parent: 1 });
// ParentRequestSchema.index({ createdAt: -1 });

// export default model<IParentRequest>("ParentRequest", ParentRequestSchema);


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
