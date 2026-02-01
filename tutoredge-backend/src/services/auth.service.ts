import User, { IUser } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import { config } from "../config/env";
import ParentRequest from "../models/ParentRequest";
import jwt from "jsonwebtoken";

export class AuthService {
  // 🔹 Admin Login
  async loginAdmin(username: string, password: string) {
    if (
      username !== config.ADMIN_USERNAME ||
      password !== config.ADMIN_PASSWORD
    ) {
      throw new Error("Invalid username or password");
    }

    const adminUser = {
      _id: "1",
      username: config.ADMIN_USERNAME,
      role: "admin"
    };

    const token = signJwt({ id: adminUser._id, role: adminUser.role });

    return { token, user: adminUser };
  }

  // 🔹 Parent Signup
  // async signupParent(data: Partial<IUser>) {
  //   const { fullName, email, phone, password } = data;
  //   const existing = await User.findOne({ email });
  //   if (existing) throw new Error("Email already registered");

  //   const hashed = await hashPassword(password!);

  //   const user = await User.create({
  //     role: "parent",
  //     fullName,
  //     email,
  //     phone,
  //     password: hashed,
  //   });

  //   return user;
  // }

  // auth
  async signupParent(data: Partial<IUser>) {
  const { fullName, email, phone, password } = data;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new Error("Email already registered. Please login.");
  }

  const hashed = await hashPassword(password!);

  const user = await User.create({
    role: "parent",
    fullName,
    email,
    phone,
    password: hashed,
    status: "pending", // optional: admin approval
  });

  // 🔑 AUTO LOGIN TOKEN
  const token = signJwt({
    id: user._id,
    role: user.role,
    email: user.email,
  });

  return {
    user,
    token,
  };
}

  async loginParent(email: string, password: string) {
    const user = await User.findOne({ role: "parent", email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const token = signJwt({ id: user._id, role: user.role });
    return { token, user };
  }

  // 🔹 Tutor Signup
  // 🔹 Tutor Signup
async signupTutor(data: Partial<IUser>) {
  try {
    console.log("🟡 SIGNUP HIT with data:", {
      
      email: data.email,
      phone: data.phone,
      yearsOfExperience: data.yearsOfExperience
    });

    const { email, password } = data;
    console.log("📦 DB NAME:", User.db.name);
console.log("📦 COLLECTION:", User.collection.name);

    const existing = await User.findOne({ email });
    if (existing) {
      console.error("🔴 SIGNUP FAILED: Email already exists:", email);
      throw new Error("Email already registered");
    }

    const hashed = await hashPassword(password!);
console.log("📦 DB NAME:", User.db.name);
console.log("📦 COLLECTION:", User.collection.name);
// ✅ NORMALIZE PHONE HERE
    const normalizedPhone = data.phone
      ?.replace(/\D/g, "")
      .slice(-10);

    const user = await User.create({
      ...data,
    role: "tutor",
      phone: normalizedPhone,
      phone_verified: false,
      password: hashed,
      status: "pending",
    });

    console.log("🟢 SIGNUP SUCCESS: Tutor saved in DB with id:", user._id);

    return user;
  } catch (err: any) {
    console.error("❌ SIGNUP ERROR:", err.message);
    throw err;
  }
}


  async loginTutor(email: string, password: string) {
    const user = await User.findOne({ role: "tutor", email });
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    if (user.status !== "approved") throw new Error("Tutor not approved yet");

    const token = signJwt({ id: user._id, role: user.role });
    return { token, user };
  }

async getTutorById(id: string) {
  const tutor = await User.findById(id).lean();

  if (!tutor || tutor.role !== "tutor") {
    throw new Error("Tutor not found");
  }

  return tutor;
}

  // async getTutorApplications(status?: string, limit: number = 5) {
  //   const validStatuses = ["pending", "approved", "rejected"];
  //   if (status && !validStatuses.includes(status)) {
  //     throw new Error("Invalid status");
  //   }

  //   const limitValue = Number(limit) || 5;
  //   if (!Number.isInteger(limitValue) || limitValue <= 0) {
  //     throw new Error("Invalid limit");
  //   }

  //   const query: any = { role: "tutor" };
  //   if (status) query.status = status;

  //   const tutors = await User.find(query)
  //     .sort({ createdAt: -1 }) // latest first
  //     .limit(limitValue)
  //     .select("fullName email status createdAt")
  //     .lean();

  //   return tutors.map((t: any) => ({
  //    _id: t._id.toString(), // Explicitly add this
  // id: t._id.toString(),             // ⭐ VERY IMPORTANT
  //     name: t.fullName,
  //     email: t.email,
  //     status: t.status,
  //     appliedDate:
  //       t.createdAt instanceof Date
  //         ? t.createdAt.toISOString()
  //         : new Date(t.createdAt).toISOString()
  //   }));
  // }

  // async createParentRequest(parentId: string, data: any) {
  //   const { academicNeeds, scheduling, location, urgency } = data;

  //   // validation
  //   if (!academicNeeds || !Array.isArray(academicNeeds) || academicNeeds.length === 0) {
  //     throw new Error("academicNeeds cannot be empty");
  //   }

  //   const validUrgencies = ["within_24_hours", "within_3_days", "within_a_week"];
  //   if (!validUrgencies.includes(urgency)) {
  //     throw new Error("Invalid urgency value");
  //   }

  //   const request = await ParentRequest.create({
  //     parentId,
  //     academicNeeds,
  //     scheduling,
  //     location,
  //     urgency
  //   });

  //   return request;
  // }

async getTutorApplications(status?: string, limit: number = 5) {
  const validStatuses = ["pending", "approved", "rejected"];
  if (status && !validStatuses.includes(status)) {
    throw new Error("Invalid status");
  }

  const limitValue = Number(limit) || 5;
  if (!Number.isInteger(limitValue) || limitValue <= 0) {
    throw new Error("Invalid limit");
  }

  // ✅ FINAL QUERY
  const query: any = {
    role: "tutor",
    phone_verified: true   // ⭐ IMPORTANT ADDITION
  };

  if (status) {
    query.status = status;
  }

  const tutors = await User.find(query)
    .sort({ createdAt: -1 })
    .limit(limitValue)
    .select("fullName email status createdAt")
    .lean();

  return tutors.map((t: any) => ({
    _id: t._id.toString(),
    id: t._id.toString(),
    name: t.fullName,
    email: t.email,
    status: t.status,
    appliedDate:
      t.createdAt instanceof Date
        ? t.createdAt.toISOString()
        : new Date(t.createdAt).toISOString()
  }));
}



    // 🔹 Tutor Login with Phone (OTP verified)
  async loginTutorWithPhone(phone: string) {
    const user = await User.findOne({ role: "tutor", phone });

    if (!user) {
      throw new Error("Tutor not found with this phone number");
    }

    if (user.status !== "approved") {
      throw new Error("Tutor not approved yet");
    }

    const token = signJwt({
      id: user._id,
      role: user.role
    });

    return { user, token };
  }


  // 🔹 Mark Tutor Phone as Verified (after OTP success)
// async markTutorPhoneVerified(phone: string) {
//   const normalizedPhone = phone.replace(/\D/g, "").replace(/^0+/, "").slice(-10);

//   const user = await User.findOne({
//     role: "tutor",
//     phone: normalizedPhone
//   });

//   if (!user) {
//     console.error("❌ Tutor not found for phone:", normalizedPhone);
//     return null;
//   }

//   if (user.status === "pending") {
//     user.status = "phone_verified";
//     await user.save();
//     console.log("🟢 Status updated to phone_verified for:", normalizedPhone);
//   }

//   return user;
// }


// async markTutorPhoneVerified(phone: string) {
//   const normalizedPhone = phone
//     .replace(/\D/g, "")
//     .replace(/^0+/, "")
//     .slice(-10);

//   const user = await User.findOne({
//     role: "tutor",
//     phone: normalizedPhone
//   });

//   if (!user) {
//     console.error("❌ Tutor not found for phone:", normalizedPhone);
//     return null;
//   }

//   // ✅ ONLY mark phone as verified
//   if (!user.phone_verified) {
//     user.phone_verified = true;
//     await user.save();
//     console.log("🟢 Phone verified for:", normalizedPhone);
//   }

//   return user;
// }

async markTutorPhoneVerified(phone: string) {
  const normalizedPhone = phone
    .replace(/\D/g, "")
    .slice(-10);

  const result = await User.updateOne(
    {
      role: "tutor",
      phone: normalizedPhone
    },
    {
      $set: { phone_verified: true }
    }
  );

  console.log("📞 Phone verify update result:", result);

  if (result.matchedCount === 0) {
    console.error("❌ Tutor not found for phone:", normalizedPhone);
    return null;
  }

  return true;
}

// 🔹 Admin: Update Tutor Status
// async updateTutorStatus(id: string, status: "approved" | "rejected") {
//   const tutor = await User.findById(id);

//   if (!tutor || tutor.role !== "tutor") {
//     throw new Error("Tutor not found");
//   }

//   tutor.status = status;
//   await tutor.save();

//   return tutor;
// }
async updateTutorStatus(id: string, status: "approved" | "rejected") {
  const tutor = await User.findById(id);

  if (!tutor || tutor.role !== "tutor") {
    throw new Error("Tutor not found");
  }

  tutor.status = status;
  await tutor.save();

  return tutor;
}


// 🔹 Admin: Update Parent Status
// async updateParentStatus(id: string, status: "approved" | "rejected") {
//   const parent = await User.findById(id);

//   if (!parent || parent.role !== "parent") {
//     throw new Error("Parent not found");
//   }

//   parent.status = status;
//   await parent.save();

//   return parent;
// }

// 🔹 Admin: Update Parent Status
async updateParentStatus(
  parentId: string,
  status: "approved" | "rejected"
) {
  const parent = await User.findById(parentId);

  if (!parent) {
    throw new Error("Parent not found");
  }

  if (parent.role !== "parent") {
    throw new Error("User is not a parent");
  }

  parent.status = status;
  await parent.save();

  return {
    _id: parent._id.toString(),
    fullName: parent.fullName,
    email: parent.email,
    phone: parent.phone,
    status: parent.status,
    updatedAt: parent.updatedAt
  };
}


// 🔹 Admin: Get All Parents
async getAllParents() {
  const parents = await User.find({ role: "parent" })
    .sort({ createdAt: -1 })
    .select("fullName email phone status createdAt")
    .lean();

  return parents.map((p: any) => ({
    _id: p._id.toString(),
    fullName: p.fullName,
    email: p.email,
    phone: p.phone,
    status: p.status,
    createdAt: p.createdAt
  }));
}


}



