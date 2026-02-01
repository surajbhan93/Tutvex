import { Schema, model, Document } from "mongoose";

export type UserRole = "admin" | "parent" | "tutor";
// export type TutorStatus = "pending" | "phone_verified" | "approved" | "rejected";
export type TutorStatus = "pending" | "approved" | "rejected";

export type TeachingMode = "online" | "offline" | "hybrid";
export type Availability = "weekdays" | "weekends" | "flexible";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface IUser extends Document {
  role: UserRole;

  // Common
  email?: string;
  username?: string;
  password: string;
  fullName?: string;
  phone?: string;
  profileImage?: string;

    // ✅ ADD THIS (Parent notification preference)
  notificationWhatsapp?: boolean;
  // Tutor Profile
  bio?: string;
  headline?: string;
  gender?: Gender;
  dateOfBirth?: Date;

  subjects?: string[];
  languages?: string[];
  classesTaught?: string[];

  qualification?: string;
  college?: string;
  certifications?: string[];

  yearsOfExperience?: number;
  experienceDescription?: string;

  // status?: TutorStatus;
  status?: TutorStatus;
phone_verified?: boolean;


  price?: number;
  priceType?: "per_hour" | "per_month";
  teachingMode?: TeachingMode;
  availability?: Availability;
  demoAvailable?: boolean;

  rating?: number;
  testimonial?: string;

  // Platform stats
  totalStudents?: number;
  profileViews?: number;
  lastActiveAt?: Date;

  isProfileComplete?: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    role: { type: String, enum: ["admin", "parent", "tutor"], required: true },

    username: { type: String, unique: true, sparse: true },

    email: { type: String, lowercase: true, unique: true, sparse: true },
    fullName: String,
    phone: String,
    password: { type: String, required: true },

    // 🔹 Profile
    profileImage: { type: String, default: "" },

     // ✅ ADD THIS
    notificationWhatsapp: { type: Boolean, default: true },
    
    bio: { type: String, maxlength: 1000 },
    headline: { type: String, maxlength: 120 },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"]
    },
    dateOfBirth: Date,

    // 🔹 Tutor Expertise
    subjects: { type: [String], default: [] },
    languages: { type: [String], default: [] },
    classesTaught: { type: [String], default: [] },

    qualification: String,
    college: String,
    certifications: { type: [String], default: [] },

    yearsOfExperience: Number,
    experienceDescription: String,

    // status: {
    //   type: String,
    //   enum: ["pending", "phone_verified", "approved", "rejected"],
    //   default: "pending"
    // },

    status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending"
        },

        phone_verified: {
          type: Boolean,
          default: false
        },


    price: { type: Number, default: 0 },
    priceType: {
      type: String,
      enum: ["per_hour", "per_month"],
      default: "per_hour"
    },

    teachingMode: {
      type: String,
      enum: ["online", "offline", "hybrid"]
    },
    availability: {
      type: String,
      enum: ["weekdays", "weekends", "flexible"]
    },
    demoAvailable: { type: Boolean, default: false },

    rating: { type: Number, default: 0 },
    testimonial: { type: String, default: "" },

    // 🔹 Platform metrics
    totalStudents: { type: Number, default: 0 },
    profileViews: { type: Number, default: 0 },
    lastActiveAt: Date,

    isProfileComplete: { type: Boolean, default: false }
  },
  { timestamps: true }
);

//  Role-based validation
UserSchema.pre("validate", function (next) {
  if (this.role === "admin") {
    if (!this.username) return next(new Error("Admin must have a username"));
  }

  if (this.role === "parent") {
    if (!this.fullName || !this.email || !this.phone) {
      return next(new Error("Parent must have fullName, email, phone"));
    }
  }

  if (this.role === "tutor") {
    if (
      !this.fullName ||
      !this.email ||
      !this.phone ||
      !this.subjects?.length ||
      !this.languages?.length ||
      !this.classesTaught?.length ||
      !this.qualification ||
      !this.college ||
      this.yearsOfExperience === undefined

    ) {
      return next(new Error("Tutor must have all required fields"));
    }
  }

  next();
});

// Indexes for faster filtering
UserSchema.index({ subjects: 1 });
UserSchema.index({ price: 1 });
UserSchema.index({ rating: -1 });

export default model<IUser>("User", UserSchema);
