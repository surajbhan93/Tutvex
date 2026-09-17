import { FastifyRequest, FastifyReply } from "fastify";
import ParentRequest from "../models/ParentRequest";
import mongoose from "mongoose";
import { Types } from "mongoose";
import User from "../models/User";
import Student from "../models/Student";
import StudentRequest from "../models/StudentRequest";
export class AdminController {


  // GET ALL PARENT DEMO REQUESTS
  // =========================
  async getParentDemoRequests(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const requests = await ParentRequest.find()
        .populate("parent", "fullName email phone")
        .populate("student", "name class")
        .populate("requestedTutor", "fullName subjects")
        .populate("tutor", "fullName subjects")
        .sort({ createdAt: -1 });

      return reply.send({
        success: true,
        data: requests,
      });
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message || "Failed to fetch parent demo requests",
      });
    }
  }

  // 🔥 UPDATE REQUEST STATUS / NOTE
// 🔥 UPDATE PARENT DEMO REQUEST (FIXED)
async updateParentDemoRequest(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = req.params as any;
    const { status, adminNote, tutorId } = req.body as any;

    const allowedStatus = [
      "pending",
      "contacted",
      "assigned",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return reply.status(400).send({ error: "Invalid status" });
    }

    // 🔍 Fetch request
    const request = await ParentRequest.findById(id);
    if (!request) {
      return reply.status(404).send({ error: "Request not found" });
    }

    // 🔥 ASSIGN LOGIC
    if (status === "assigned") {
      // tutorId REQUIRED when assigning
      if (!tutorId) {
        return reply.status(400).send({
          error: "Cannot mark as assigned: tutorId missing",
        });
      }

      // validate tutorId
      if (!mongoose.Types.ObjectId.isValid(tutorId)) {
        return reply.status(400).send({
          error: "Invalid tutorId",
        });
      }

      // student must exist
      // if (!request.student) {
      //   return reply.status(400).send({
      //     error: "Cannot mark as assigned: student not linked",
      //   });
      // }

      // student must exist (either linked or manual)
        if (!request.student && !request.studentName) {
          return reply.status(400).send({
            error: "Cannot mark as assigned: student not linked",
          });
        }


      // ✅ ACTUAL ASSIGNMENT
      request.tutor = new mongoose.Types.ObjectId(tutorId);
      request.status = "assigned";
    } else {
      // normal status change
      request.status = status;
    }

    if (adminNote !== undefined) {
      request.adminNote = adminNote;
    }

    await request.save();

    const populated = await ParentRequest.findById(id)
      .populate("parent", "fullName email phone")
      .populate("tutor", "fullName email phone subjects")
      .populate("student", "full_name class_grade");

    return reply.send({
      success: true,
      message: "Parent demo request updated successfully",
      data: populated,
    });

  } catch (err: any) {
    console.error("updateParentDemoRequest ERROR:", err);

    return reply.status(500).send({
      success: false,
      error: err.message || "Failed to update request",
    });
  }
}


  // =========================
  // GET SINGLE PARENT DEMO REQUEST BY ID
  // =========================
//   async getParentDemoRequestById(
//   req: FastifyRequest<{ Params: { id: string } }>,
//   reply: FastifyReply
// ) {
//   try {
//     const { id } = req.params;

//     // 🔐 Validate ObjectId
//     if (!Types.ObjectId.isValid(id)) {
//       return reply.status(400).send({
//         success: false,
//         error: "Invalid request id",
//       });
//     }

//     const request = await ParentRequest.findById(id)
//       .populate("parent", "fullName email phone")
//       .populate("student", "full_name class_grade")
//       .populate({
//         path: "requestedTutor",
//         select: "fullName email phone subjects",
//         options: { strictPopulate: false },
//       })
//       .populate({
//         path: "tutor",
//         select: "fullName email phone subjects",
//         options: { strictPopulate: false },
//       })
//       .lean();

//     if (!request) {
//       return reply.status(404).send({
//         success: false,
//         error: "Parent demo request not found",
//       });
//     }

//     // ✅ RETURN FULL DATA (same as createDemoRequest)
//     return reply.send({
//       success: true,
//       data: {
//         _id: request._id,

//         // 🔹 Relations
//         parent: request.parent,
//         student: request.student,
//         requestedTutor: request.requestedTutor || null,
//         tutor: request.tutor || null,

//         // 🔹 Academic info
//         academicNeeds: request.academicNeeds,
//         scheduling: request.scheduling || [],
//         location: request.location,
//         urgency: request.urgency,
//         board: request.board,
//         classGrade: request.classGrade,

//         // 🔹 Admin / system
//         status: request.status,
//         adminNote: request.adminNote || "",
//         createdAt: request.createdAt,
//         updatedAt: request.updatedAt,
//       },
//     });
//   } catch (err: any) {
//     console.error("🔥 getParentDemoRequestById error:", err);

//     return reply.status(500).send({
//       success: false,
//       error: err.message || "Failed to fetch demo request",
//     });
//   }
// }

async getParentDemoRequestById(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    const { id } = req.params;

    // 🔐 Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return reply.status(400).send({
        success: false,
        error: "Invalid request id",
      });
    }

    const request = await ParentRequest.findById(id)
      .populate("parent", "fullName email phone")
      .populate("student", "full_name class_grade")
      .populate({
        path: "requestedTutor",
        select: "fullName email phone subjects",
        options: { strictPopulate: false },
      })
      .populate({
        path: "tutor",
        select: "fullName email phone subjects",
        options: { strictPopulate: false },
      })
      .lean();

    if (!request) {
      return reply.status(404).send({
        success: false,
        error: "Parent demo request not found",
      });
    }

    // 🔥 IMPORTANT PART: student name resolution
    const studentDisplayName = request.student
      ? (request.student as any).full_name
      : request.studentName || null;

    return reply.send({
      success: true,
      data: {
        _id: request._id,

        // 🔹 Relations
        parent: request.parent,
        student: request.student || null,

        // 🔥 NEW: always available for frontend
        studentDisplayName,

        requestedTutor: request.requestedTutor || null,
        tutor: request.tutor || null,

        // 🔹 Academic info
        academicNeeds: request.academicNeeds,
        scheduling: request.scheduling || [],
        location: request.location,
        urgency: request.urgency,
        board: request.board,
        classGrade: request.classGrade,

        // 🔹 Admin / system
        status: request.status,
        adminNote: request.adminNote || "",
        createdAt: request.createdAt,
        updatedAt: request.updatedAt,
      },
    });
  } catch (err: any) {
    console.error("🔥 getParentDemoRequestById error:", err);

    return reply.status(500).send({
      success: false,
      error: err.message || "Failed to fetch demo request",
    });
  }
}

//  parent request update by id finish 


  async getTutorDemoRequests(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { limit = 20 } = req.query as any;

  const requests = await ParentRequest.find({
  status: "contacted",
  interestedTutor: { $ne: null },
})
  .populate("parent", "fullName email phone")
  .populate("interestedTutor", "fullName email phone subjects")
  .populate("student", "full_name class_grade")
  .sort({ updatedAt: -1 })
  .lean();


  
return reply.send({
  success: true,
  data: requests.map((r) => ({
    _id: r._id,
    academicNeeds: r.academicNeeds,
    urgency: r.urgency,
    location: r.location,
    status: r.status,
    adminNote: r.adminNote,

    parent: r.parent,
    student: r.student,

    tutor: r.interestedTutor, // ✅ TS now happy
  })),
});

}


async updateTutorDemoRequest(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = req.params as any;
    const { status, adminNote, tutorId } = req.body as any;

    const allowedStatus = ["assigned", "completed", "cancelled"];
    if (!allowedStatus.includes(status)) {
      return reply.status(400).send({ error: "Invalid status" });
    }

    const request = await ParentRequest.findById(id);
    if (!request) {
      return reply.status(404).send({ error: "Request not found" });
    }

    // 🔥 ASSIGN
    if (status === "assigned") {
      if (!tutorId) {
        return reply.status(400).send({
          error: "tutorId is required",
        });
      }

      request.tutor = tutorId;              // ✅ FINAL ASSIGNED TUTOR
      request.interestedTutor = null;       // ✅ CLEAR INTEREST
      request.status = "assigned";
    }

    // 🔥 COMPLETE / CANCEL
    if (status === "completed" || status === "cancelled") {
      request.status = status;
    }

    if (adminNote) {
      request.adminNote = adminNote;
    }

    await request.save();

    const populated = await ParentRequest.findById(id)
      .populate("parent", "fullName email phone")
      .populate("tutor", "fullName email phone subjects")
      .populate("student", "full_name class_grade");

    return reply.send({
      success: true,
      data: populated,
    });
  } catch (err: any) {
    console.error("updateTutorDemoRequest ERROR:", err);
    return reply.status(500).send({ error: err.message });
  }
}

async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      // If using cookies
      reply.clearCookie("adminToken", {
        path: "/",
      });

      return reply.send({
        success: true,
        message: "Admin logged out successfully",
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Logout failed",
      });
    }
  }

// GET /admin/parent-dashboard/:parentId
// 


async getParentDashboard(
  req: FastifyRequest<{ Params: { parentId: string } }>,
  reply: FastifyReply
) {
  try {
    const { parentId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return reply.status(400).send({
        success: false,
        error: "Invalid parent id",
      });
    }

    /* ======================
       Parent Info (with location)
    ====================== */
    const parent = await User.findById(parentId)
      .select("fullName email phone location")
      .lean();

    if (!parent) {
      return reply.status(404).send({
        success: false,
        error: "Parent not found",
      });
    }

    /* ======================
       Students (SAFE query)
    ====================== */
    const students = await Student.find({
      parent: new mongoose.Types.ObjectId(parentId),
    })
      .select("full_name class_grade")
      .lean();

    /* ======================
       Class-wise count
    ====================== */
    const classWise: Record<string, number> = {};
    students.forEach((s: any) => {
      const cls = s.class_grade;
      classWise[cls] = (classWise[cls] || 0) + 1;
    });

    /* ======================
       Demo Requests
    ====================== */
    const requests = await ParentRequest.find({ parent: parentId })
      .populate("student", "full_name class_grade")
      .populate("tutor", "fullName subjects")
      .lean();

    const statusWise: Record<string, number> = {};
    requests.forEach((r: any) => {
      statusWise[r.status] = (statusWise[r.status] || 0) + 1;
    });

    /* ======================
       Student → Tutor Mapping
    ====================== */
    const studentTutorMap = requests.map((r: any) => ({
      student: r.student,
      tutor: r.tutor || null,
    }));

    /* ======================
       RESPONSE
    ====================== */
    return reply.send({
      success: true,
      data: {
        parent,
        students: {
          total: students.length,
          classWise,
          list: students, // ✅ optional but useful
        },
        demoRequests: {
          total: requests.length,
          statusWise,
        },
        studentTutorMap,
      },
    });
  } catch (err: any) {
    console.error("Parent dashboard error:", err);
    return reply.status(500).send({
      success: false,
      error: err.message,
    });
  }
}


  // parent list 
// parent list 
async getAllParents(req: FastifyRequest, reply: FastifyReply) {
  try {
    const parents = await User.find({ role: "parent" })
      .select("fullName email phone createdAt location") // ✅ location added
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: parents,
    });
  } catch (err: any) {
    return reply.status(500).send({
      success: false,
      error: err.message,
    });
  }
}


// =========================
// GET ALL TUTORS (for assign)
// =========================
async getAllTutors(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const tutors = await User.find({ role: "tutor" })
      .select("fullName subjects email phone")
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      count: tutors.length,
      data: tutors,
    });
  } catch (err: any) {
    console.error("getAllTutors error:", err);

    return reply.status(500).send({
      success: false,
      error: "Failed to fetch tutors",
    });
  }
}



// tutor in admin pannal 
// 🔹 ADMIN: Get All Tutors (Full Data)
async adminGetAllTutors(req: any, reply: any) {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter: any = { role: "tutor" };

    // Optional filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.isProfileComplete !== undefined) {
      filter.isProfileComplete = req.query.isProfileComplete === "true";
    }

    const tutors = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await User.countDocuments(filter);

    return reply.send({
      success: true,
      data: tutors,
      pagination: {
        total,
        page,
        limit,
      },
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to fetch tutors" });
  }
}


// 🔹 ADMIN: Get Tutor By ID (Full Profile)
async adminGetTutorById(req: any, reply: any) {
  try {
    const { tutorId } = req.params;

    const tutor = await User.findOne({
      _id: tutorId,
      role: "tutor",
    }).select("-password");

    if (!tutor) {
      return reply.status(404).send({ message: "Tutor not found" });
    }

    return reply.send({
      success: true,
      data: tutor,
    });
  } catch (err) {
    console.error(err);
    return reply.status(400).send({ message: "Invalid tutor ID" });
  }
}

// 🔹 ADMIN: Update Tutor Status
async adminUpdateTutorStatus(req: any, reply: any) {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved | rejected | pending

    if (!["approved", "rejected", "pending"].includes(status)) {
      return reply.status(400).send({ message: "Invalid status" });
    }

    const tutor = await User.findOneAndUpdate(
      { _id: id, role: "tutor" },
      { status },
      { new: true }
    ).select("-password");

    if (!tutor) {
      return reply.status(404).send({ message: "Tutor not found" });
    }

    return reply.send({
      success: true,
      message: `Tutor status updated to ${status}`,
      data: tutor,
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ message: "Failed to update status" });
  }
}

// 🔹 ADMIN: Tutor Stats
async adminTutorStats(req: any, reply: any) {
  try {
    const totalTutors = await User.countDocuments({ role: "tutor" });
    const approved = await User.countDocuments({ role: "tutor", status: "approved" });
    const pending = await User.countDocuments({ role: "tutor", status: "pending" });
    const profileComplete = await User.countDocuments({
      role: "tutor",
      isProfileComplete: true,
    });

    return reply.send({
      success: true,
      data: {
        totalTutors,
        approved,
        pending,
        profileComplete,
      },
    });
  } catch (err) {
    return reply.status(500).send({ message: "Failed to load stats" });
  }
}



// 🔥 ADMIN: CREATE MANUAL LEAD
async createLeadByAdmin(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = (req as any).user;

    // ✅ only admin allowed
    if (!user || user.role !== "admin") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const {
      studentName,
      classGrade,
      board,
      subject,
      location,
      phone,
      parentName,
      urgency,
    } = req.body as any;

    // 🔥 create lead
    const lead = await ParentRequest.create({
      type: "manual",
       // 🔥 FIX (IMPORTANT)
  parent: new mongoose.Types.ObjectId(), // ✅ valid ObjectId
      studentName,
      classGrade,
      board,
      academicNeeds: [subject], // 👈 important
      location,
      phone,
      parentName,
      urgency,
      source: "admin",
      status: "pending",
    });

    return reply.send({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  } catch (err: any) {
    console.error("Create Lead Error:", err);

    return reply.status(500).send({
      success: false,
      error: err.message || "Internal Server Error",
    });
  }
}
// 🔥 GET ALL LEADS (manual + parent)
async getAllLeads(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const requests = await ParentRequest.find()
      .populate("parent", "fullName phone")
      .populate("student", "full_name class_grade")
      .sort({ createdAt: -1 })
      .lean();

    const formatted = requests.map((r: any) => ({
      _id: r._id,
      type: r.type, // 🔥 important

      academicNeeds: r.academicNeeds,
      location: r.location,
      urgency: r.urgency,
      status: r.status,

      // ✅ student fix
      student: r.student
        ? {
            name: r.student.full_name,
            class_grade: r.student.class_grade,
          }
        : {
            name: r.studentName,
            class_grade: r.classGrade,
          },

      // ✅ parent fix
      parent: r.parent
        ? {
            name: r.parent.fullName,
            phone: r.parent.phone,
          }
        : {
            name: r.parentName,
            phone: r.phone,
          },

      createdAt: r.createdAt,
    }));

    return reply.send({
      success: true,
      count: formatted.length,
      data: formatted,
    });
  } catch (err) {
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}
}

