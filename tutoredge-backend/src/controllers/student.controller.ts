import { FastifyReply, FastifyRequest } from "fastify";
import StudentService from "../services/student.service";
import mongoose from "mongoose";
import Student from "../models/Student";
import StudentRequest from "../models/StudentRequest";
// import mongoose from "mongoose";
import StudentAssignment from "../models/StudentAssignment";
import Assignment from "../models/Assignment";
import Quiz from "../models/Quiz";
import { saveFile } from "../utils/saveFile";
export class StudentController {
async getAssignmentsQuizzes(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || !["student", "parent"].includes(user.role)) {
      return reply.status(403).send({ success: false, message: "Forbidden" });
    }

    const status = (req.query as any).status;
    const page = Number((req.query as any).page) || 1;
    const limit = Number((req.query as any).limit) || 10;

    let studentId: string | undefined;

    if (user.role === "student") {
      studentId = user.student_id || user.id;
    }

    if (user.role === "parent") {
      studentId = (req.query as any).studentId;
    }

    if (!studentId) {
      return reply.status(400).send({
        success: false,
        message: "studentId is required"
      });
    }

    const result = await StudentService.fetchAssignmentsAndQuizzes({
      studentId,
      status,
      page,
      limit
    });

    return reply.status(200).send({
      success: true,
      data: {
        upcoming: result.upcoming,
        completed: result.completed
      },
      summary: result.summary
    });

  } catch (err: any) {
    console.error("getAssignmentsQuizzes error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}


  // 🔥 GET STUDENT FULL DETAILS
  async getStudentById(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const { studentId } = req.params as any;

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return reply.status(400).send({
        error: "Invalid studentId",
      });
    }

    // 1️⃣ Student basic info
    const student = await Student.findById(studentId)
      .populate("parent_id", "fullName email phone")
      .lean();

    if (!student) {
      return reply.status(404).send({
        error: "Student not found",
      });
    }

    // 2️⃣ Student learning requests
    const requests = await StudentRequest.find({
      student: studentId,
    })
      .populate("parent", "fullName email phone")
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: {
        student: {
          _id: student._id,
          full_name: student.full_name,
          class_grade: student.class,
          createdAt: student.createdAt,
        },
        parent: student.parent_id,
        requests: requests.map((r) => ({
          requestId: r._id,
          subject: r.subject,
          class_grade: r.class_grade,
          description: r.description,
          mode: r.mode,
          location: r.location,
          status: r.status,
          createdAt: r.createdAt,
        })),
      },
    });
  }

 
//   async submitAssignment(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     if (!req.isMultipart()) {
//       return reply.status(400).send({ error: "Multipart required" });
//     }

//     const user = (req as any).user;
//     const { assignmentId } = req.params as any;

//     // 🔥 studentId must come from form-data
//     const parts = req.parts();
//    let studentId: string | null = null;
// const files: { filename: string; url: string }[] = [];

// for await (const part of parts) {
//   if (part.type === "file") {
//     const buffer = await part.toBuffer();

//     const saved = await saveFile(
//       buffer,
//       part.filename || "file",
//       part.mimetype || ""
//     );

//     files.push({
//       filename: saved.filename,
//       url: `${process.env.BACKEND_URL}${saved.url}`,
//     });
//   } else {
//     // 🔥 FIXED TYPE SAFELY
//     if (part.fieldname === "studentId" && typeof part.value === "string") {
//       studentId = part.value;
//     }
//   }
// }


//     if (!studentId) {
//       return reply.status(400).send({
//         error: "studentId is required",
//       });
//     }

//     const studentAssignment = await StudentAssignment.findOne({
//       assignment_id: assignmentId,
//       student_id: studentId,
//     });

//     if (!studentAssignment) {
//       return reply.status(404).send({
//         error: "Student assignment not found",
//       });
//     }

//     studentAssignment.submission = {
//       files,
//       submitted_at: new Date(),
//     };

//     studentAssignment.status = "submitted";
//     await studentAssignment.save();

//     return reply.send({
//       success: true,
//       message: "Assignment submitted successfully",
//     });
//   } catch (err) {
//     console.error("submitAssignment error:", err);
//     return reply.status(500).send({
//       error: "Internal Server Error",
//     });
//   }
// }

async submitAssignment(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    if (!req.isMultipart()) {
      return reply.status(400).send({ error: "Multipart required" });
    }

    const user = (req as any).user;
    const { assignmentId } = req.params as { assignmentId: string };

    if (!user || user.role !== "parent") {
      return reply.status(403).send({
        error: "Only parent can submit assignment",
      });
    }

    // 🔥 STEP 1: find assignment already assigned by tutor
    const studentAssignment = await StudentAssignment.findOne({
      assignment_id: assignmentId,
    });

    if (!studentAssignment) {
      return reply.status(404).send({
        error: "Assignment not assigned yet by tutor",
      });
    }

    // 🔥 STEP 2: upload files
    const files: { filename: string; url: string }[] = [];

    // ✅ BACKEND URL SAFETY (MOST IMPORTANT)
    const BACKEND_URL =
      process.env.BACKEND_URL || "http://localhost:3001";

    for await (const part of req.parts()) {
      if (part.type === "file") {
        const buffer = await part.toBuffer();

        const saved = await saveFile(
          buffer,
          part.filename || "file",
          part.mimetype || ""
        );

        // 🔥 FINAL ABSOLUTE URL (PDF WILL OPEN)
        files.push({
          filename: saved.filename,
          url: `${BACKEND_URL}${saved.url}`, // 👈 THIS FIXES PDF ISSUE
        });
      }
    }

    if (files.length === 0) {
      return reply.status(400).send({
        error: "No file uploaded",
      });
    }

    // 🔥 STEP 3: get student name (for display)
    const student = await Student.findById(
      studentAssignment.student_id
    ).select("full_name");

    // 🔥 STEP 4: UPDATE submission (NO CREATE)
    studentAssignment.submission = {
      files,
      submitted_at: new Date(),
      submitted_by: "parent",
      student_name: student?.full_name || "N/A",
    };

    studentAssignment.status = "submitted";

    await studentAssignment.save();

    return reply.send({
      success: true,
      message: "Assignment submitted successfully",
      files, // 👈 optional: frontend debug
    });

  } catch (err) {
    console.error("submitAssignment error:", err);
    return reply.status(500).send({
      error: "Internal Server Error",
    });
  }
}



async checkAssignment(req: FastifyRequest, reply: FastifyReply) {
  try {
    const tutor = (req as any).user;
    const { id } = req.params as any;
    const { marks, feedback } = req.body as any;

    if (!tutor || tutor.role !== "tutor") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const sa = await StudentAssignment.findById(id);

    if (!sa) {
      return reply.status(404).send({ error: "Submission not found" });
    }

    if (String(sa.tutor_id) !== tutor.id) {
      return reply.status(403).send({ error: "Not your student" });
    }

    sa.marks = marks;
    sa.feedback = feedback;
    sa.status = "checked";

    await sa.save();

    reply.send({
      success: true,
      message: "Marks submitted",
    });
  } catch (err) {
    reply.status(500).send({ error: "Internal Server Error" });
  }
}


}

export default new StudentController();
