import { FastifyReply, FastifyRequest } from "fastify";
import { ParentService } from "../services/parent.service";
// import { Request, Response } from "express";
import ParentRequest from "../models/ParentRequest";
const parentService = new ParentService();
import Payment from "../models/Payment";
import Student from "../models/Student";
// import Assignment from "../models/Assignment"
import { ParentAssignmentService } from "../services/parentAssignment.service";
import mongoose from "mongoose";
import StudentAssignment from "../models/StudentAssignment";
import Assignment from "../models/Assignment";
import StudentQuiz from "../models/StudentQuiz";
import Quiz from "../models/Quiz";
import { Types } from "mongoose";
interface PopulatedStudent {
  _id: Types.ObjectId;
  parent_id: Types.ObjectId;
  full_name?: string;
  class_grade?: string;
}

interface PopulatedQuiz {
  _id: Types.ObjectId;
  title: string;
  subject: string;
  class_grade: string;
  questions: any[];
}
export class ParentController {

  

 // ✅ GET ALL STUDENTS OF A PARENT
 async getParentStudents(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = (req as any).user;

    // ✅ Only parent allowed
    if (!user || user.role !== "parent") {
      return reply.status(403).send({
        success: false,
        error: "Forbidden",
      });
    }

    const students = await Student.find({
      parent_id: user.id, // 🔥 exact schema match
    })
      .select(
        "_id full_name class board institution_name subjects_required additional_notes createdAt"
      )
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      count: students.length,
      students: students.map((s) => ({
        id: s._id,
        full_name: s.full_name,
        class: s.class,
        board: s.board,
        institution_name: s.institution_name,
        subjects_required: s.subjects_required,
        additional_notes: s.additional_notes || "",
        createdAt: s.createdAt,
      })),
    });
  } catch (err) {
    console.error("getParentStudents error:", err);

    return reply.status(500).send({
      success: false,
      error: "Internal Server Error",
    });
  }
}

async getProfile(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user;
  const parent = await parentService.getProfile(user.id);

  if (!parent) {
    return reply.status(404).send({
      message: "Parent profile not found",
      parent: null,
      isProfileComplete: false,
    });
  }

  return reply.send({
    parent,
    isProfileComplete: parent.isProfileComplete ?? false,
  });
}


  // ✅ PUT /parent/profile
// 🔹 UPDATE parent profile
  async updateProfile(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const { fullName, phone, notificationWhatsapp } = req.body as any;

    await parentService.updateProfile(user.id, {
      fullName,
      phone,
      notificationWhatsapp,
    });

    return reply.send({ message: "Profile updated successfully" });
  }


  

    // 🔹 GET all students
  async getMyStudents(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const students = await parentService.getStudentsByParent(user.id);
    return reply.send({ students });
  }

  // 🔹 UPDATE student
  async updateStudent(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;
    const { studentId } = req.params as any;
    const { full_name, class_grade } = req.body as any;

    const updated = await parentService.updateStudent(
      user.id,
      studentId,
      { full_name, class_grade }
    );

    if (!updated) {
      return reply.status(404).send({ message: "Student not found" });
    }

    return reply.send({ message: "Student updated successfully" });
  }

  async getTutors(req: FastifyRequest, reply: FastifyReply) {
    try {
      const tutors = await parentService.searchTutors(req.query);
      return reply.send(tutors);
    } catch (err: any) {
      console.error("Error fetching tutors:", err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  }

  // Add student
  async addStudent(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (req as any).user;

      // ✅ Only parent allowed
      if (!user || user.role !== "parent") {
        return reply.status(403).send({
          success: false,
          message: "Forbidden"
        });
      }

      const {
        full_name,
        class_grade,        // ✅ FIX
        board,
        institution_name,
        subjects_required,
        additional_notes
      } = req.body as any;

      const student = await parentService.addStudent(user.id, {
        full_name,
        class: class_grade,        // ✅ FIX,
        board,
        institution_name,
        subjects_required,
        additional_notes
      });

      return reply.status(201).send({
        success: true,
        message: "Student added successfully",
        data: {
          id: student._id,
          full_name: student.full_name,
          class: student.class,
          board: student.board,
          institution_name: student.institution_name,
          subjects_required: student.subjects_required,
          additional_notes: student.additional_notes,
          parent_id: student.parent_id,
          created_at: student.createdAt
        }
      });
    } catch (err: any) {
      console.error("addStudent error:", err);

      if (err.message === "Invalid parent id") {
        return reply.status(400).send({
          success: false,
          message: "Invalid parent id"
        });
      }

      if (err.message === "Missing required fields") {
        return reply.status(400).send({
          success: false,
          message: err.message
        });
      }

      return reply.status(500).send({
        success: false,
        message: "Internal Server Error"
      });
    }
  }

async createDemoRequest(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== "parent") {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const result = await parentService.createDemoRequest(
      user.id,
      req.body
    );

    return reply.code(201).send(result);
  } catch (err: any) {
    return reply.status(400).send({
      success: false,
      error: err.message || "Failed to create demo request",
    });
  }
}

  //Admin panel
  async getParentRequests(req: FastifyRequest, reply: FastifyReply) {
    try {
      // ensure admin access is enforced in route preHandler
      const { type, status, subject, limit } = req.query as any;

      const result = await parentService.getParentRequests({ type, status, subject, limit });
      return reply.send(result);
    } catch (err: any) {
      console.error("getParentRequests error:", err);
      // return 400 for validation errors
      if (err.message && (err.message.includes("Invalid") || err.message.includes("allowed"))) {
        return reply.status(400).send({ error: err.message });
      }
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  }

   // 🔥 POST /parent/request-demo
  async requestDemo(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (req as any).user;

      if (!user || user.role !== "parent") {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const result = await parentService.createDemoRequest(
        user.id,
        req.body
      );

      return reply.code(201).send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }



async getMyTutors(req: FastifyRequest, reply: FastifyReply) {
  const user = (req as any).user;

  if (!user || user.role !== "parent") {
    return reply.status(403).send({ error: "Forbidden" });
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const requests = await ParentRequest.find({
    parent: user.id,
    status: "assigned",
  })
    .populate("tutor", "fullName subjects phone email")
    .populate("student", "full_name class_grade")
    .lean();

  // ✅ ONLY keep records where tutor exists
  const validRequests = requests.filter((r: any) => r.tutor);

  const data = await Promise.all(
    validRequests.map(async (r: any) => {
      const payment = await Payment.findOne({
        parent: user.id,
        parentRequest: r._id,
        month: currentMonth,
        year: currentYear,
        status: "paid",
      }).lean();

      return {
        requestId: r._id,
        tutor: r.tutor,
        student: r.student,
        assignedAt: r.updatedAt,
        paymentStatus: payment ? "paid" : "unpaid",
      };
    })
  );

  return reply.send({
    success: true,
    count: data.length,
    data,
  });
}



  async logout(req: FastifyRequest, reply: FastifyReply) {
    try {
      // For JWT: nothing to invalidate server-side
      return reply.send({
        success: true,
        message: "Parent logged out successfully",
      });
    } catch (error) {
      return reply.status(500).send({
        success: false,
        message: "Logout failed",
      });
    }
  }


  // assinment 
 async getParentAssignments(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const user = (req as any).user;

      if (!user || user.role !== "parent") {
        return reply.status(403).send({
          success: false,
          message: "Forbidden"
        });
      }

      const assignments =
        await ParentAssignmentService.getAssignmentsForParent(user.id);

      return reply.send({
        success: true,
        data: assignments
      });

    } catch (err) {
      console.error("getParentAssignments error:", err);
      return reply.status(500).send({
        success: false,
        message: "Internal Server Error"
      });
    }
  }


  async getAssignmentById(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { assignmentId } = req.params as any;

    const assignment = await Assignment.findById(assignmentId)
      .populate("created_by", "fullName")
      .lean();

    if (!assignment) {
      return reply.status(404).send({
        success: false,
        message: "Assignment not found",
      });
    }

    return reply.send({
      success: true,
      data: assignment,
    });
  } catch (err) {
    console.error("getAssignmentById error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
}

async getParentAssignmentById(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { id } = req.params as any;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return reply.status(400).send({ error: "Invalid ID" });
    }

    const record = await StudentAssignment.findById(id)
      .populate("assignment_id")   // 🔥 MAIN DATA
      .populate("student_id", "full_name class_grade")
      .populate("tutor_id", "fullName")
      .lean();

    if (!record) {
      return reply.status(404).send({ error: "Assignment not found" });
    }

   return reply.send({
  success: true,
  data: {
    studentAssignmentId: record._id,        // 👈 agar chahiye to
    assignmentId: record.assignment_id._id, // ✅ REAL Assignment ID

    status: record.status,
    due_date: record.due_date,

    assignment: record.assignment_id,
    student: record.student_id,
    tutor: record.tutor_id,
  }
});


  } catch (err) {
    console.error("getParentAssignmentById error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

//quizez 
async getParentQuizzes(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = (req as any).user;

    // 🔐 AUTH CHECK
    if (!user || user.role !== "parent") {
      return reply.status(403).send({
        success: false,
        message: "Forbidden"
      });
    }

    // 📥 FETCH QUIZZES FOR PARENT
    const quizzes =
      await ParentAssignmentService.getQuizzesForParent(user.id);

    return reply.send({
      success: true,
      data: quizzes
    });

  } catch (err) {
    console.error("getParentQuizzes error:", err);
    return reply.status(500).send({
      success: false,
      message: "Internal Server Error"
    });
  }
}
// 📄 Quiz Details (read-only, before start)


// import { FastifyRequest, FastifyReply } from "fastify";
// import StudentQuiz from "../models/StudentQuiz";

async getParentQuizDetails(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parent = (req as any).user;
    const { studentQuizId } = req.params as any;

    const quizEntry = await StudentQuiz.findById(studentQuizId)
      .populate("quiz_id")
      .populate("student_id")
      .lean();

    if (!quizEntry) {
      return reply.status(404).send({ success: false, message: "Quiz not found" });
    }

    const student = quizEntry.student_id as unknown as PopulatedStudent;
    const quiz = quizEntry.quiz_id as unknown as PopulatedQuiz;

    if (student.parent_id.toString() !== parent.id) {
      return reply.status(403).send({ success: false, message: "Not authorized" });
    }

    return reply.send({
      success: true,
      data: {
        title: quiz.title,
        subject: quiz.subject,
        class_grade: quiz.class_grade,
        total_questions: quiz.questions.length,
        status: quizEntry.status,
      },
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({ success: false, message: "Internal Server Error" });
  }
}



// 📝 Quiz Attempt (questions only, no correct answers)

async getQuizForAttempt(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parent = (req as any).user;
    const { studentQuizId } = req.params as any;

    const quizEntry = await StudentQuiz.findById(studentQuizId)
      .populate("quiz_id")
      .populate("student_id")
      .lean();

    if (!quizEntry) {
      return reply.status(404).send({ success: false, message: "Quiz not found" });
    }

    const student = quizEntry.student_id as unknown as PopulatedStudent;
    const quiz = quizEntry.quiz_id as unknown as PopulatedQuiz;

    if (student.parent_id.toString() !== parent.id) {
      return reply.status(403).send({ success: false, message: "Not authorized" });
    }

    if (quizEntry.status !== "assigned") {
      return reply.status(400).send({
        success: false,
        message: "Quiz already attempted or checked",
      });
    }

    const safeQuestions = quiz.questions.map(q => ({
      _id: q._id,
      question: q.question,
      options: q.options,
      type: q.type,
    }));

    return reply.send({
      success: true,
      data: {
        title: quiz.title,
        subject: quiz.subject,
        class_grade: quiz.class_grade,
        questions: safeQuestions,
      },
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({ success: false, message: "Internal Server Error" });
  }
}

// Quiz Submit → Tutor Dashboard


async submitQuiz(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const parent = (req as any).user;
    const { studentQuizId } = req.params as any;
    const { answers } = req.body as any;

    const quizEntry = await StudentQuiz.findById(studentQuizId)
      .populate("student_id");

    if (!quizEntry) {
      return reply.status(404).send({ success: false, message: "Quiz not found" });
    }

    const student = quizEntry.student_id as any;

    if (student.parent_id.toString() !== parent.id) {
      return reply.status(403).send({ success: false, message: "Not authorized" });
    }

    if (quizEntry.status !== "assigned") {
      return reply.status(400).send({
        success: false,
        message: "Quiz already submitted",
      });
    }

    quizEntry.status = "submitted";
    quizEntry.submission = {
      answers,
      submitted_at: new Date(),
    };

    await quizEntry.save();

    return reply.send({
      success: true,
      message: "Quiz submitted successfully",
    });

  } catch (err) {
    console.error(err);
    return reply.status(500).send({ success: false, message: "Internal Server Error" });
  }
}


}
