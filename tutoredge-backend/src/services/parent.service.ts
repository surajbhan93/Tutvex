import User from "../models/User";
import ParentRequest from "../models/ParentRequest";
import { FastifyRequest, FastifyReply } from "fastify";
import Student from "../models/Student";
import { Types } from "mongoose";

interface AddStudentPayload {
  full_name: string;
  class: string;
  board: string;
  institution_name: string;
  subjects_required: string[];
  additional_notes?: string;
}
export class ParentService {

  async getProfile(userId: string) {
    return User.findOne({ _id: userId, role: "parent" }).select(
      "fullName email phone notificationWhatsapp"
    );
  }

  // async updateProfile(
  //   userId: string,
  //   data: {
  //     fullName: string;
  //     phone: string;
  //     notificationWhatsapp: boolean;
  //   }
  // ) {
  //   return User.findOneAndUpdate(
  //     { _id: userId, role: "parent" },
  //     {
  //       $set: {
  //         fullName: data.fullName,
  //         phone: data.phone,
  //         notificationWhatsapp: data.notificationWhatsapp,
  //       },
  //     },
  //     { new: true }
  //   );
  // }


  async updateProfile(
  userId: string,
  data: {
    fullName: string;
    phone: string;
    notificationWhatsapp: boolean;
  }
) {
  // update profile first
  const parent = await User.findOneAndUpdate(
    { _id: userId, role: "parent" },
    {
      $set: {
        fullName: data.fullName,
        phone: data.phone,
        notificationWhatsapp: data.notificationWhatsapp,
      },
    },
    { new: true }
  );

  if (!parent) return null;

  // 🔥 CHECK PROFILE COMPLETENESS
  const studentsCount = await Student.countDocuments({
    parent_id: parent._id,
  });

  const hasBasicInfo =
    Boolean(parent.fullName) && Boolean(parent.phone);

  const isComplete = hasBasicInfo && studentsCount > 0;

  // 🔥 update flag only if changed
  if (parent.isProfileComplete !== isComplete) {
    parent.isProfileComplete = isComplete;
    await parent.save();
  }

  return parent;
}

  // 🔹 Get all students of parent
async getStudentsByParent(parentId: string) {
  return Student.find({ parent_id: new Types.ObjectId(parentId) });
}


  // 🔹 Update student (SECURE)
async updateStudent(
  parentId: string,
  studentId: string,
  data: { full_name: string; class_grade: string }
) {
  if (!Types.ObjectId.isValid(studentId)) return null;

  return Student.findOneAndUpdate(
    {
      _id: new Types.ObjectId(studentId),
      parent_id: new Types.ObjectId(parentId),
    },
    { $set: data },
    { new: true }
  );
}


  async searchTutors(filters: any) {
    const query: any = { role: "tutor" };

    // Apply filters only if they exist
    if (filters.subject) {
      query.subjects = { $elemMatch: { $regex: new RegExp(filters.subject, "i") } };

    }

    if (filters.teachingMode) {
      query.teachingMode = filters.teachingMode;
    }

    if (filters.minPrice || filters.maxPrice) {
      query.price = {};
      if (filters.minPrice) query.price.$gte = Number(filters.minPrice);
      if (filters.maxPrice) query.price.$lte = Number(filters.maxPrice);
    }

    if (filters.minExperience) {
      query.yearsOfExperience = { $gte: Number(filters.minExperience) };
    }

    if (filters.availability) {
      query.availability = filters.availability;
    }

    if (filters.minRating) {
      query.rating = { $gte: Number(filters.minRating) };
    }

    console.log("Final Query:", query);

    // Execute query
    const tutors = await User.find(query)
      .sort({ rating: -1 }) // sort by rating desc
      .select(
        "fullName email subjects teachingMode price yearsOfExperience availability rating testimonial"
      )
      .lean();

    return tutors;
  }

  async getParentRequests(params: any) {
    const { type = "latest", status, subject } = params;
    let limit = params.limit ? Number(params.limit) : 5;

    if (isNaN(limit) || limit <= 0) {
      throw new Error("Invalid limit value");
    }

    // validate type
    if (!["latest", "all"].includes(type)) {
      throw new Error("Invalid type; allowed values: latest, all");
    }

    // build base query
    const query: any = {};

    if (status) {
      const validStatuses = ["pending", "assigned", "completed", "cancelled"];
      if (!validStatuses.includes(status)) throw new Error("Invalid status value");
      query.status = status;
    }

    if (subject) {
      // academicNeeds is array of strings — use regex to match subject text-insensitive
      query.academicNeeds = { $elemMatch: { $regex: new RegExp(subject, "i") } };
    }

    const mongoQuery = ParentRequest.find(query).sort({ createdAt: -1 });

    if (type === "latest") {
      mongoQuery.limit(limit);
    } else {
      // type === 'all' -> optional limit - allow large but set a safe maximum cap (e.g. 500)
      const maxCap = 500;
      if (limit > maxCap) limit = maxCap;
      mongoQuery.limit(limit);
    }

    // select fields to return. You can expand as needed.
    const requests = await mongoQuery
      .select("parentId academicNeeds scheduling location urgency status createdAt")
      .lean();

    // Optionally enrich parent info (name, email) — do a small lookup
    const parentIds = Array.from(new Set(requests.map((r: any) => r.parentId))).filter(Boolean);
    const parents = await User.find({ _id: { $in: parentIds } })
      .select("fullName email phone")
      .lean();

    const parentMap: Record<string, any> = {};
    parents.forEach((p: any) => (parentMap[String(p._id)] = p));

    // format response
    return requests.map((r: any) => ({
      id: r._id,
      parentId: r.parentId,
      parent: parentMap[r.parentId] || null,
      academicNeeds: r.academicNeeds,
      scheduling: r.scheduling,
      location: r.location,
      urgency: r.urgency,
      status: r.status,
      createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : new Date(r.createdAt).toISOString()
    }));
  }


  // add student
  async addStudent(parentId: string, payload: AddStudentPayload) {
    const {
      full_name,
      class: studentClass,
      board,
      institution_name,
      subjects_required,
      additional_notes
    } = payload;

    // 🔹 Required fields check
    if (
      !full_name ||
      !studentClass ||
      !board ||
      !institution_name ||
      !subjects_required ||
      subjects_required.length === 0
    ) {
      throw new Error("Missing required fields");
    }

    // 🔹 Parent ID validation
    if (!Types.ObjectId.isValid(parentId)) {
      throw new Error("Invalid parent id");
    }

    const student = await Student.create({
      full_name: full_name.trim(),
      class: studentClass.trim(),
      board: board.trim(),
      institution_name: institution_name.trim(),
      subjects_required: subjects_required.map(s => s.trim()),
      additional_notes: additional_notes?.trim(),
      parent_id: new Types.ObjectId(parentId)
    });

    return student;
  }


  

// parent.service.ts

//  async createDemoRequest(parentId: string, payload: any) {
//     const {
//       tutorId, // 🔥 parent preference
//       studentId,
//       academicNeeds,
//       scheduling,
//       location,
//       urgency,
//       board,
//       classGrade,
//       notes,
//     } = payload;

//     // ✅ BASIC VALIDATION
//     if (
//       !tutorId ||
//       !studentId ||
//       !academicNeeds?.length ||
//       !location ||
//       !urgency ||
//       !board ||
//       !classGrade
//     ) {
//       throw new Error("Missing required fields");
//     }

//     if (!Types.ObjectId.isValid(tutorId)) {
//       throw new Error("Invalid tutor id");
//     }

//     if (!Types.ObjectId.isValid(studentId)) {
//       throw new Error("Invalid student id");
//     }

//     // 🔍 Tutor existence check (NO STATUS CHECK)
//     const tutor = await User.findOne({
//       _id: tutorId,
//       role: "tutor",
//     });

//     if (!tutor) {
//       throw new Error("Tutor not found");
//     }

//     // 🔥 CREATE PENDING REQUEST (NO tutor assignment)
//     const request = await ParentRequest.create({
//       parent: new Types.ObjectId(parentId),
//       student: new Types.ObjectId(studentId),

//       requestedTutor: new Types.ObjectId(tutorId), // ✅ enquiry info

//       academicNeeds,
//       scheduling: scheduling || [],
//       location,
//       urgency,
//       board,
//       classGrade,
//       adminNote: notes || "",

//       status: "pending", // ✅ waiting for admin
//     });

//     return {
//       success: true,
//       message: "Demo request submitted successfully",
//       data: {
//         requestId: request._id,
//         requestedTutor: tutorId,
//         status: request.status,
//         createdAt: request.createdAt,
//       },
//     };
//   }

async createDemoRequest(parentId: string, payload: any) {
  const {
    tutorId,
    studentId,
    studentName,
    academicNeeds,
    scheduling,
    location,
    urgency,
    board,
    classGrade,
    notes,
  } = payload;

  // 🔥 at least one required
  if (!studentId && !studentName) {
    throw new Error("Either studentId or studentName is required");
  }

  if (
    !tutorId ||
    !academicNeeds?.length ||
    !location ||
    !urgency ||
    !board ||
    !classGrade
  ) {
    throw new Error("Missing required fields");
  }

  if (!Types.ObjectId.isValid(tutorId)) {
    throw new Error("Invalid tutor id");
  }

  // 🔍 validate studentId only if provided
  if (studentId && !Types.ObjectId.isValid(studentId)) {
    throw new Error("Invalid student id");
  }

  // 🔍 tutor check
  const tutor = await User.findOne({ _id: tutorId, role: "tutor" });
  if (!tutor) {
    throw new Error("Tutor not found");
  }

  const request = await ParentRequest.create({
    parent: new Types.ObjectId(parentId),

    // ✅ conditional student reference
    student: studentId ? new Types.ObjectId(studentId) : null,

    // ✅ store manual name if given
    studentName: studentName || null,

    requestedTutor: new Types.ObjectId(tutorId),

    academicNeeds,
    scheduling: scheduling || [],
    location,
    urgency,
    board,
    classGrade,
    adminNote: notes || "",

    status: "pending",
  });

  return {
    success: true,
    message: "Demo request submitted successfully",
    data: {
      requestId: request._id,
      requestedTutor: tutorId,
      studentId: studentId || null,
      studentName: studentName || null,
      status: request.status,
      createdAt: request.createdAt,
    },
  };
}

  // =========================
  // Admin assigns tutor
  // =========================

}

