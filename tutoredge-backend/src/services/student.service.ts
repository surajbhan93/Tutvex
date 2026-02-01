import StudentAssignment from "../models/StudentAssignment";
import StudentQuiz from "../models/StudentQuiz";

export class StudentService {
  async fetchAssignmentsAndQuizzes(options: {
    studentId: string;
    status?: "upcoming" | "completed";
    page?: number;
    limit?: number;
  }) {
    const { studentId, status, page = 1, limit = 10 } = options;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* ======================
       ASSIGNMENTS (MAPPING)
    ====================== */
    const assignmentDocs = await StudentAssignment.find({
      student_id: studentId
    })
      .populate({
        path: "assignment_id",
        populate: {
          path: "created_by",
          select: "fullName"
        }
      })
      .sort({ assigned_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const upcomingAssignments: any[] = [];
    const completedAssignments: any[] = [];

    for (const doc of assignmentDocs) {
      const a: any = doc.assignment_id;
      if (!a) continue;

      const dueDate = a.due_date
        ? new Date(a.due_date + "T23:59:59Z")
        : null;

      const isCompleted =
        doc.status === "submitted" ||
        doc.status === "checked" ||
        (dueDate ? dueDate < today : false);

      const item = {
        _id: String(a._id),
        title: a.title,
        subject: a.subject,
        tutor: a.created_by?.fullName || "",
        due_date: a.due_date || null,
        status: doc.status,
        type: "Assignment"
      };

      isCompleted
        ? completedAssignments.push(item)
        : upcomingAssignments.push(item);
    }

    /* ======================
       QUIZZES (MAPPING)
    ====================== */
    const quizDocs = await StudentQuiz.find({
      student_id: studentId
    })
      .populate({
        path: "quiz_id",
        populate: {
          path: "created_by",
          select: "fullName"
        }
      })
      .sort({ assigned_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const upcomingQuizzes: any[] = [];
    const completedQuizzes: any[] = [];

    for (const doc of quizDocs) {
      const q: any = doc.quiz_id;
      if (!q) continue;

      const isCompleted =
        doc.status === "attempted" ||
        doc.status === "checked";

      const item = {
        _id: String(q._id),
        title: q.title,
        subject: q.subject,
        tutor: q.created_by?.fullName || "",
        due_date: q.due_date || null,
        status: doc.status,
        type: "Quiz"
      };

      isCompleted
        ? completedQuizzes.push(item)
        : upcomingQuizzes.push(item);
    }

    /* ======================
       FILTER BY STATUS
    ====================== */
    let upcoming = [...upcomingAssignments, ...upcomingQuizzes];
    let completed = [...completedAssignments, ...completedQuizzes];

    if (status === "upcoming") completed = [];
    if (status === "completed") upcoming = [];

    return {
      upcoming,
      completed,
      summary: {
        upcoming_count: upcoming.length,
        completed_count: completed.length
      }
    };
  }
}

export default new StudentService();
