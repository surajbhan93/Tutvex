import { FastifyInstance } from "fastify";
import { ParentController } from "../controllers/parent.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const parentController = new ParentController();

export default async function parentRoutes(app: FastifyInstance) {

  // =========================
  // 👤 PARENT PROFILE
  // =========================

  app.get(
    "/auth/parent/profile",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
      schema: {
        tags: ["Parent"],
        summary: "Get logged-in parent profile",
      },
    },
    (req, reply) => parentController.getProfile(req, reply)
  );

  app.put(
    "/auth/parent/profile",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
      schema: {
        tags: ["Parent"],
        summary: "Update logged-in parent profile",
        body: {
          type: "object",
          required: ["fullName", "phone"],
          properties: {
            fullName: { type: "string" },
            phone: { type: "string" },
            notificationWhatsapp: { type: "boolean" },
          },
        },
      },
    },
    (req, reply) => parentController.updateProfile(req, reply)
  );

  // =========================
  // 👶 STUDENTS (MULTI)
  // =========================

  // Get all students of parent
  app.get(
    "/auth/parent/students",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
      schema: {
        tags: ["Parent"],
        summary: "Get all students of logged-in parent",
      },
    },
    (req, reply) => parentController.getMyStudents(req, reply)
  );

  // Add student
  app.post(
    "/auth/parent/student",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
      schema: {
        tags: ["Parent"],
        summary: "Add a student",
        body: {
          type: "object",
          required: ["full_name", "class_grade"],
          properties: {
            full_name: { type: "string" },
            class_grade: { type: "string" },
          },
        },
      },
    },
    (req, reply) => parentController.addStudent(req, reply)
  );

  // Update student
  app.put(
    "/auth/parent/student/:studentId",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
      schema: {
        tags: ["Parent"],
        summary: "Update student details",
        body: {
          type: "object",
          required: ["full_name", "class_grade"],
          properties: {
            full_name: { type: "string" },
            class_grade: { type: "string" },
          },
        },
      },
    },
    (req, reply) => parentController.updateStudent(req, reply)
  );

  // =========================
  // 🔍 SEARCH TUTORS (PARENT)
  // =========================

  app.get(
    "/auth/parent/tutors",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
      schema: {
        tags: ["Parent"],
        summary: "Search tutors",
      },
    },
    (req, reply) => parentController.getTutors(req, reply)
  );

  // =========================
  // 🛠️ ADMIN – PARENT REQUESTS
  // =========================

  app.get(
    "/auth/admin/parent/requests",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
      schema: {
        tags: ["Admin"],
        summary: "Fetch parent tutor requests",
      },
    },
    (req, reply) => parentController.getParentRequests(req, reply)
  );

  // =========================
 // 🎓 REQUEST DEMO (PARENT)
 // =========================
// =========================
// Parent → Request Demo
// =========================
// app.post(
//   "/auth/parent/request-demo",
//   {
//     preHandler: [authMiddleware, roleMiddleware(["parent"])],
//     schema: {
//       tags: ["Parent"],
//       summary: "Request demo for a tutor",
//       body: {
//         type: "object",
//         required: [
//           "tutorId",
//           "studentId",
//           "academicNeeds",
//           "location",
//           "urgency",
//           "board",
//           "classGrade",
//         ],
//         properties: {
//           tutorId: {
//             type: "string",
//             description: "Tutor ID (approved tutor)",
//           },
//           studentId: {
//             type: "string",
//             description: "Student ID selected by parent",
//           },
//           academicNeeds: {
//             type: "array",
//             items: { type: "string" },
//             minItems: 1,
//           },
//           scheduling: {
//             type: "array",
//             items: { type: "string" },
//             default: [],
//           },
//           location: {
//             type: "string",
//           },
//           urgency: {
//             type: "string",
//             enum: ["within_24_hours", "within_3_days", "within_a_week"],
//           },
//           board: {
//             type: "string",
//             description: "CBSE / ICSE / State",
//           },
//           classGrade: {
//             type: "string",
//             description: "Class 8 / 9 / 10",
//           },
//           notes: {
//             type: "string",
//           },
//         },
//       },
//     },
//   },
//   async (req, reply) => {
//     return parentController.createDemoRequest(req, reply);
//   }
// );


app.post(
  "/auth/parent/request-demo",
  {
    preHandler: [authMiddleware, roleMiddleware(["parent"])],
    schema: {
      tags: ["Parent"],
      summary: "Request demo for a tutor",
      body: {
        type: "object",

        // ❌ studentId yahan se hata diya
        required: [
          "tutorId",
          "academicNeeds",
          "location",
          "urgency",
          "board",
          "classGrade",
        ],

        properties: {
          tutorId: {
            type: "string",
            description: "Tutor ID (approved tutor)",
          },

          // ✅ OPTIONAL: existing student
          studentId: {
            type: "string",
            nullable: true,
            description: "Student ID selected by parent (optional)",
          },

          // ✅ OPTIONAL: manual entry
          studentName: {
            type: "string",
            minLength: 2,
            description: "Student name if student is not registered",
          },

          academicNeeds: {
            type: "array",
            items: { type: "string" },
            minItems: 1,
          },

          scheduling: {
            type: "array",
            items: { type: "string" },
            default: [],
          },

          location: {
            type: "string",
          },

          urgency: {
            type: "string",
            enum: ["within_24_hours", "within_3_days", "within_a_week"],
          },

          board: {
            type: "string",
            description: "CBSE / ICSE / State",
          },

          classGrade: {
            type: "string",
            description: "Class 8 / 9 / 10",
          },

          notes: {
            type: "string",
          },
        },

        // 🔥 IMPORTANT: at least one required
        anyOf: [
          { required: ["studentId"] },
          { required: ["studentName"] },
        ],
      },
    },
  },
  async (req, reply) => {
    return parentController.createDemoRequest(req, reply);
  }
);


  app.get(
    "/auth/parent/my-tutors",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
    },
    (req, reply) => parentController.getMyTutors(req, reply)
  );

  
// 🔥 GET ASSIGNMENTS FOR PARENT DASHBOARD
  app.get(
    "/parent/assignments",
    {
      preHandler: [
        authMiddleware,
        roleMiddleware(["parent"]),
      ],
    },
    parentController.getParentAssignments.bind(parentController)
  );

    app.get(
    "/parent/quizzes",
    {
      preHandler: [
        authMiddleware,
        roleMiddleware(["parent"]),
      ],
    },
    parentController.getParentQuizzes.bind(parentController)
  );


  app.get(
  "/assignments/:assignmentId",
  { preHandler: [authMiddleware] },
  parentController.getAssignmentById
);

  app.get(
  "/parent/assignments/:id",
  { preHandler: [authMiddleware] },
  parentController.getParentAssignmentById
);

   app.get(
    "/parent/quizzes/:studentQuizId",
    {
      preHandler: [
        authMiddleware,
        roleMiddleware(["parent"]),
      ],
    },
    parentController.getParentQuizDetails.bind(parentController)
  );

    app.get(
    "/parent/quizzes/:studentQuizId/attempt",
    {
      preHandler: [
        authMiddleware,
        roleMiddleware(["parent"]),
      ],
    },
    parentController.getQuizForAttempt.bind(parentController)
  );

   app.post(
  "/parent/quizzes/:studentQuizId/submit",
  {
    preHandler: [
      authMiddleware,
      roleMiddleware(["parent"]),
    ],
  },
  parentController.submitQuiz.bind(parentController)
);



 app.get(
    "/parent/students",
    {
      preHandler: [authMiddleware, roleMiddleware(["parent"])],
    },
    parentController.getParentStudents
  );

}
