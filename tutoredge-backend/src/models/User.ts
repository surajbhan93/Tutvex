import { Schema, model, Document } from "mongoose";

export type UserRole = "admin" | "parent" | "tutor";
// export type TutorStatus = "pending" | "phone_verified" | "approved" | "rejected";
export type TutorStatus = "pending" | "approved" | "rejected";

export type TeachingMode = "online" | "offline" | "hybrid";
export type Availability = "weekdays" | "weekends" | "flexible";
export type Gender = "male" | "female" | "other" | "prefer_not_to_say";

export interface TutorLocation {
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;

  // ✅ NEW: Local area / locality
  area?: string; // e.g. "Civil Lines", "Sector 62", "Aliganj"

  // future use (maps / nearby search)
  coordinates?: {
    type: "Point";
    coordinates: [number, number]; // [lng, lat]
  };
}

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
  // Tutor Location
location?: TutorLocation;

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

//  documents 

documents?: {
  identityProof?: string;
  educationProof?: string;
  annexureB?: string;
  bankDetails?: string;
};

isDocumentsSubmitted?: boolean;
isDocumentsVerified?: boolean;

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

    // 🔥 DOCUMENTS (ADD THIS)
documents: {
  identityProof: { type: String, default: "" },
  educationProof: { type: String, default: "" },
  annexureB: { type: String, default: "" },
  bankDetails: { type: String, default: "" },
},

isDocumentsSubmitted: { type: Boolean, default: false },
isDocumentsVerified: { type: Boolean, default: false },
    // 
    location: {
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  country: { type: String, trim: true, default: "India" },
  pincode: { type: String },

  // ✅ NEW
  area: { type: String, trim: true },


  coordinates: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [lng, lat]
      index: "2dsphere"
    }
  }
},

    

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

  if (this.role === "tutor" ) {
    if (
      !this.fullName ||
      !this.email ||
      !this.phone ||
      !this.subjects?.length ||
      !this.languages?.length ||
      !this.classesTaught?.length ||
      !this.qualification ||
      !this.college ||
      this.yearsOfExperience === undefined ||
      !this.location?.city ||
      !this.location?.area        // ✅ ADD

    ) {
      return next(new Error("Tutor must have all required fields"));
    }
  }

     // ✅ DOCUMENT VALIDATION YAHI ADD KAR
   const docs = this.documents || {};

// 🔥 at least 1 doc uploaded
this.isDocumentsSubmitted =
  !!docs.identityProof ||
  !!docs.educationProof ||
  !!docs.annexureB ||
  !!docs.bankDetails;

// 🔥 all docs complete
this.isDocumentsVerified =
  !!docs.identityProof &&
  !!docs.educationProof &&
  !!docs.annexureB &&
  !!docs.bankDetails;
  
  next();
});


// Indexes for faster filtering & query execution
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ role: 1, phone_verified: 1, status: 1 });
UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ role: 1, "location.city": 1 });
UserSchema.index({ subjects: 1 });
UserSchema.index({ price: 1 });
UserSchema.index({ rating: -1 });
UserSchema.index({ "location.city": 1 });
UserSchema.index({ "location.area": 1 });
UserSchema.index({ "location.pincode": 1 });
UserSchema.index({ "location.coordinates": "2dsphere" });

export default model<IUser>("User", UserSchema);
