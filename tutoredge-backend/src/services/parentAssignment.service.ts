import Student from "../models/Student";
import StudentAssignment from "../models/StudentAssignment";
import StudentQuiz from "../models/StudentQuiz";
import StudentRequest from "../models/StudentRequest";

export class ParentAssignmentService {

  static async getAssignmentsForParent(parentId: string) {
  // 1️⃣ Parent ke saare students
  const students = await Student.find(
    { parent_id: parentId },
    { _id: 1 }
  ).lean();

  if (!students.length) {
    return [];
  }

  const studentIds = students.map(s => s._id);

  // 2️⃣ StudentAssignments fetch
  const assignments = await StudentAssignment.find({
    student_id: { $in: studentIds }
  })
    .populate({
      path: "assignment_id",
      select: "title subject class_grade due_date instructions"
    })
    .populate({
      path: "student_id",
      select: "full_name class_grade"
    })
    .populate({
      path: "tutor_id",
      select: "fullName email phone"
    })
    .sort({ assigned_at: -1 })
    .lean();

  // 🔥 STATUS MAPPER (IMPORTANT)
  const mapStatus = (status: string) => {
    if (status === "assigned") return "Pending";
    if (status === "submitted") return "Submitted";
    if (status === "checked") return "Checked";
    return "Pending";
  };

  // 3️⃣ Clean response for frontend
  return assignments.map(a => ({
    _id: a._id,

    // 🔥 FIX HERE
    status: mapStatus(a.status),

    due_date: a.due_date,
    assigned_at: a.assigned_at,

    assignment: a.assignment_id,
    student: a.student_id,
    tutor: a.tutor_id,
  }));
}

static async getQuizzesForParent(parentId: string) {
  // 1️⃣ Parent ke students (DIRECT from Student)
  const students = await Student.find(
    { parent_id: parentId },
    { _id: 1 }
  ).lean();

  if (!students.length) return [];

  const studentIds = students.map(s => s._id);

  // 2️⃣ StudentQuiz fetch
  const quizzes = await StudentQuiz.find({
    student_id: { $in: studentIds },
  })
    .populate({
      path: "quiz_id",
      select: "title subject class_grade due_date",
    })
    .populate({
      path: "student_id",
      select: "full_name class_grade",
    })
    .populate({
      path: "tutor_id",
      select: "fullName email phone",
    })
    .sort({ assigned_at: -1 })
    .lean();

  // 🔥 Status mapper (same as assignment)
  const mapStatus = (status: string) => {
    if (status === "assigned") return "Pending";
    if (status === "submitted") return "Submitted";
    if (status === "checked") return "Checked";
    return "Pending";
  };

  // 3️⃣ Clean response
  return quizzes.map(q => ({
    _id: q._id,
    status: mapStatus(q.status),
    due_date: q.due_date,
    assigned_at: q.assigned_at,
    quiz: q.quiz_id,
    student: q.student_id,
    tutor: q.tutor_id,
  }));
}

}
