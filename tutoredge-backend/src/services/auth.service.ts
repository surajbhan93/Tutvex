import User, { IUser } from "../models/User";
import { hashPassword, comparePassword } from "../utils/hash";
import { signJwt } from "../utils/jwt";
import { config } from "../config/env";
import ParentRequest from "../models/ParentRequest";
import jwt from "jsonwebtoken";
const RESET_SECRET = process.env.RESET_PASSWORD_SECRET || "reset_secret";
const RESET_EXPIRY = "15m";
// import bcrypt from "bcrypt";
// import { sendEmail } from "./utils/sendEmail";
import { sendEmail } from "../utils/sendEmail";

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
      id: "admin-1",
      _id: "admin-1",
      name: "Admin",
      username: config.ADMIN_USERNAME,
      email: "admin@tutvex.com",
      role: "admin" as const
    };

    const token = signJwt({ id: adminUser.id, role: adminUser.role });

    const result = { user: adminUser, token };
    console.log('Login admin result:', JSON.stringify(result, null, 2));
    
    return result;
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

   // ✅ location sanitize
  let location = data.location;
   if (location) {
    // coordinates missing or invalid
    if (
      !location.coordinates ||
      !Array.isArray(location.coordinates.coordinates) ||
      location.coordinates.coordinates.length !== 2
    ) {
      location.coordinates = {
        type: "Point",
        coordinates: [78.9629, 20.5937] // ✅ default valid geo
      };
    }
  }
  const user = await User.create({
    role: "parent",
    fullName,
    email,
    phone,
    password: hashed,
    status: "pending",
    location // ✅ now always safe // optional: admin approval
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

  async loginParent(emailOrPhone: string, password: string) {
    const rawInput = emailOrPhone.trim();
    const digitsOnly = rawInput.replace(/\D/g, "");
    const isPhone = digitsOnly.length >= 10;
    const query = isPhone
      ? { role: "parent", phone: { $regex: digitsOnly.slice(-10) + "$" } }
      : { role: "parent", email: rawInput.toLowerCase() };

    const user = await User.findOne(query);
    if (!user) throw new Error("Invalid email/phone or password");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid email/phone or password");

    const token = signJwt({ id: user._id, role: user.role });
    return { token, user };
  }

  // 🔹 Tutor Signup
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

    const existing = await User.findOne({ email });
    if (existing) {
      throw new Error("Email already registered");
    }

    const hashed = await hashPassword(password!);

    // ✅ NORMALIZE PHONE
    const normalizedPhone = data.phone
      ?.replace(/\D/g, "")
      .slice(-10);

    /* =========================
       ✅ LOCATION SANITIZE
    ========================= */
    let location = data.location;

    // Agar location nahi aayi ya coordinates invalid hain
    if (
      !location ||
      !location.coordinates ||
      !Array.isArray(location.coordinates.coordinates) ||
      location.coordinates.coordinates.length !== 2
    ) {
      location = {
        city: data.location?.city || "Unknown",
        area: data.location?.area || "Unknown",
        country: "India",
        coordinates: {
          type: "Point",
          coordinates: [78.9629, 20.5937] // ✅ default India (lng, lat)
        }
      };
    }

    const user = await User.create({
      ...data,
      role: "tutor",
      phone: normalizedPhone,
      phone_verified: true,
      password: hashed,
      status: "pending",
      location // ✅ ALWAYS VALID
    });

    console.log("🟢 SIGNUP SUCCESS: Tutor saved with id:", user._id);
    return user;

  } catch (err: any) {
    console.error("❌ SIGNUP ERROR:", err.message);
    throw err;
  }
}


  async loginTutor(emailOrPhone: string, password: string) {
    const rawInput = emailOrPhone.trim();
    const digitsOnly = rawInput.replace(/\D/g, "");
    const isPhone = digitsOnly.length >= 10;
    const query = isPhone
      ? { role: "tutor", phone: { $regex: digitsOnly.slice(-10) + "$" } }
      : { role: "tutor", email: rawInput.toLowerCase() };

    const user = await User.findOne(query);
    if (!user) throw new Error("Invalid email/phone or password");

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) throw new Error("Invalid email/phone or password");

    if (user.status !== "approved") {
      throw new Error("Your tutor application is pending approval. Please wait for admin verification.");
    }

    const token = signJwt({ id: user._id, role: user.role });
    return { token, user };
  }

// async getTutorById(id: string) {
//   const tutor = await User.findById(id).lean();

//   if (!tutor || tutor.role !== "tutor") {
//     throw new Error("Tutor not found");
//   }

//   return tutor;
// }
async getTutorById(id: string) {
  const tutor = await User.findById(id)
    .select(
      "fullName email phone role status phone_verified " +
      "qualification college yearsOfExperience " +
      "subjects languages classesTaught " +
      "price rating testimonial createdAt " +
      "location"
    )
    .lean();

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

  async createParentRequest(parentId: string, data: any) {
    const { academicNeeds, scheduling, location, urgency } = data;

    // validation
    if (!academicNeeds || !Array.isArray(academicNeeds) || academicNeeds.length === 0) {
      throw new Error("academicNeeds cannot be empty");
    }

    const validUrgencies = ["within_24_hours", "within_3_days", "within_a_week"];
    if (!validUrgencies.includes(urgency)) {
      throw new Error("Invalid urgency value");
    }

    const request = await ParentRequest.create({
      parentId,
      academicNeeds,
      scheduling,
      location,
      urgency
    });

    return request;
  }

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
    .select("fullName email phone status createdAt location profileImage") // ✅ Added profileImage
    .lean();

  return tutors.map((t: any) => ({
    _id: t._id.toString(),
    id: t._id.toString(),
    name: t.fullName,
    email: t.email,
    phone: t.phone || t.mobileNumber || t.phoneNumber || "",
    city: t.location?.city || t.city || "",
    state: t.location?.state || t.state || "",
    status: t.status,
    profileImage: t.profileImage || "", // ✅ Added profileImage
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


  
// async markTutorPhoneVerified(phone: string) {
//   const normalizedPhone = phone
//     .replace(/\D/g, "")
//     .slice(-10);

//   const result = await User.updateOne(
//     {
//       role: "tutor",
//       phone: normalizedPhone
//     },
//     {
//       $set: { phone_verified: true }
//     },
    
//   );

//   console.log("📞 Phone verify update result:", result);

//   if (result.matchedCount === 0) {
//     console.error("❌ Tutor not found for phone:", normalizedPhone);
//     return null;
//   }

//   return true;
// }

async markTutorPhoneVerified(phone: string) {
  const normalizedPhone = phone
    .replace(/\D/g, "")
    .slice(-10);

  const user = await User.findOneAndUpdate(
    {
      role: "tutor",
      phone: normalizedPhone
    },
    {
      $set: { phone_verified: true }
    },
    {
      new: true
    }
  );

  if (!user) {
    console.error("❌ Tutor not found for phone:", normalizedPhone);
    return null;
  }

  console.log("📞 Phone verified for tutor:", user._id);
  return user;
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
    _id: (parent._id as any).toString(),

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
    .select(
      "fullName email phone status createdAt location"
    )
    .lean();

  return parents.map((p: any) => ({
    _id: p._id.toString(),
    fullName: p.fullName,
    email: p.email,
    phone: p.phone,
    status: p.status,
    createdAt: p.createdAt,

    // ✅ location for admin
   location: p.location || null   // ✅ THIS
  }));
}



// ----------// add this 

  async forgotPassword(email: string) {
     console.log("📧 Email received:", email);
     console.log("✅ Forgot password hit");

    const user = await User.findOne({ email: email.toLowerCase().trim() });
  console.log("👤 User:", user ? "FOUND" : "NULL");
    if (!user) {
      throw new Error("User not found");
    }

    const token = jwt.sign(
      { id: user._id },
      RESET_SECRET,
      { expiresIn: RESET_EXPIRY }
    );

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
   console.log("FRONTEND_URL =", process.env.FRONTEND_URL);

   await sendEmail({
  to: email,
  subject: "Reset your Tutvex password",
  html: `
  <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 15px;">
          
          <!-- Main Card -->
          <table width="100%" max-width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 6px 18px rgba(0,0,0,0.08);">
            
            <!-- Banner -->
            <tr>
              <td style="
                background: linear-gradient(135deg, #4f46e5, #06b6d4);
                padding:25px;
                text-align:center;
                color:#ffffff;
              ">
                <h1 style="margin:0;font-size:28px;letter-spacing:1px;">
                  Tutvex
                </h1>
                <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">
                  Learn Smarter. Grow Faster.
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;">
                <h2 style="margin-top:0;color:#111827;">
                  Reset your password
                </h2>

                <p style="color:#374151;font-size:15px;line-height:1.6;">
                  Hi <strong>${user.fullName || "there"}</strong>,
                </p>

                <p style="color:#374151;font-size:15px;line-height:1.6;">
                  We received a request to reset your Tutvex account password.
                  Click the button below to create a new password.
                </p>

                <!-- Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="${resetLink}"
                     style="
                       background: linear-gradient(135deg, #4f46e5, #06b6d4);
                       color:#ffffff;
                       text-decoration:none;
                       padding:14px 28px;
                       border-radius:6px;
                       font-weight:bold;
                       display:inline-block;
                     ">
                    Reset Password
                  </a>
                </div>

                <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                  This link is valid for <strong>15 minutes</strong>.
                  If you did not request this, you can safely ignore this email.
                </p>

                <p style="color:#6b7280;font-size:14px;line-height:1.6;">
                  If the button doesn’t work, copy and paste this link into your browser:
                </p>

                <p style="word-break:break-all;font-size:13px;color:#2563eb;">
                  ${resetLink}
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f9fafb;padding:20px;text-align:center;">
                <p style="margin:0;font-size:13px;color:#6b7280;">
                  © ${new Date().getFullYear()} Tutvex. All rights reserved.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>
  </div>
  `
});


  }

  // async resetPassword(token: string, newPassword: string) {
  //   let decoded: any;
  //   try {
  //     decoded = jwt.verify(token, RESET_SECRET);
  //   } catch {
  //     throw new Error("Invalid or expired token");
  //   }

  //   const user = await User.findById(decoded.id);
  //   if (!user) {
  //     throw new Error("User not found");
  //   }

  //   const hashedPassword = await bcrypt.hash(newPassword, 10);
  //   user.password = hashedPassword;
  //   await user.save();
  // }

  async resetPassword(token: string, newPassword: string) {
  let decoded: any;
  try {
    decoded = jwt.verify(token, RESET_SECRET);
  } catch {
    throw new Error("Invalid or expired token");
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    throw new Error("User not found");
  }

  // ✅ bcryptjs-based helper
  const hashedPassword = await hashPassword(newPassword);
  user.password = hashedPassword;
  await user.save();
}


}






