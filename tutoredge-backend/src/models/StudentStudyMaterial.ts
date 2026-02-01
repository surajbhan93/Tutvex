import { Schema, model, Document, Types } from "mongoose";

export interface IStudentStudyMaterial extends Document {
  material_id: Types.ObjectId;
  student_id: Types.ObjectId;
  tutor_id: Types.ObjectId;
  assigned_at: Date;
}

const StudentStudyMaterialSchema = new Schema<IStudentStudyMaterial>(
  {
    material_id: {
      type: Schema.Types.ObjectId,
      ref: "StudyMaterial",
      required: true
    },
    student_id: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    tutor_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assigned_at: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

// prevent duplicate assignment
StudentStudyMaterialSchema.index(
  { material_id: 1, student_id: 1 },
  { unique: true }
);

export default model<IStudentStudyMaterial>(
  "StudentStudyMaterial",
  StudentStudyMaterialSchema
);
