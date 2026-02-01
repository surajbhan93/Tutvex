import { FastifyInstance } from "fastify";
import { TutorController } from "../controllers/tutor.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";
import Assignment from "../models/Assignment";

const tutorController = new TutorController();

export default async function tutorRoutes(app: FastifyInstance) {

  // ✅ PARENT DETAIL – FIRST
app.get(
  "/auth/tutor/parent/:parentId",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  (req, reply) =>
    tutorController.getParentDetailForTutor(req, reply)
);

 app.get(
  "/tutors/featured",
  (req, reply) => tutorController.getFeaturedTutors(req, reply)
);

app.get(
  "/tutors",
  (req, reply) => tutorController.getAllTutors(req, reply)
);

// Public tutor profile
app.get(
  "/tutors/:id",
  (req, reply) => tutorController.getTutorById(req, reply)
);



  app.get(
  "/tutor/me",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])]
  },
  (req, reply) => tutorController.getMyProfile(req, reply)
);

app.put(
  "/tutor/me",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  (req, reply) => tutorController.updateMyProfile(req, reply)
);
app.post(
  "/tutor/profile-image",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  (req, reply) => tutorController.uploadProfileImage(req, reply)
);
app.post(
  "/tutor/profile-view/:id",
  {},
  (req, reply) => tutorController.incrementProfileView(req, reply)
);


  app.post(
    "/tutor/create-assignment",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      // Note: multipart body validation needs manual checks in controller.
      schema: {
        tags: ["Tutor"],
        summary: "Create assignment (multipart/form-data)",
        consumes: ["multipart/form-data"],
        // querystring/body schema omitted because multipart
        response: {
          201: {
            type: "object",
            properties: {
              message: { type: "string" },
              assignment: { type: "object" }
            }
          }
        }
      }
    },
    (req, reply) => tutorController.createAssignment(req, reply)
  );

  //update assignment
   app.put(
    "/tutor/update-assignment/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Update an assignment (multipart/form-data)",
        consumes: ["multipart/form-data"],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"]
        }
      }
    },
    (req, reply) => tutorController.updateAssignment(req, reply)
  );

  // delete assignment
  app.delete(
    "/tutor/delete-assignment/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Delete an assignment (tutor only)",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"]
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              deleted_assignment_id: { type: "string" }
            }
          },
          404: { type: "object", properties: { error: { type: "string" } } },
          403: { type: "object", properties: { error: { type: "string" } } }
        }
      }
    },
    (req, reply) => tutorController.deleteAssignment(req, reply)
  );

  // quiz
  app.post(
    "/tutor/create-quiz",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Create a new quiz (JSON)",
        consumes: ["application/json"],
        body: {
          type: "object",
          required: ["title", "subject", "class_grade", "questions"],
          properties: {
            title: { type: "string" },
            subject: { type: "string" },
            class_grade: { type: "string" },
            description: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                required: ["question", "options", "correct_answer"],
                properties: {
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "string" }
                }
              }
            }
          }
        },
        response: {
          201: {
            type: "object",
            properties: {
              message: { type: "string" },
              quiz: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  title: { type: "string" },
                  subject: { type: "string" },
                  class_grade: { type: "string" },
                  description: { type: "string" },
                  questions_count: { type: "number" },
                  created_at: { type: "string" }
                }
              }
            }
          }
        }
      }
    },
    (req, reply) => tutorController.createQuiz(req, reply)
  );


  // update quiz
  app.put(
    "/tutor/update-quiz/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Update quiz (edit/add/delete questions)",
        consumes: ["application/json"],
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"]
        },
        body: {
          type: "object",
          required: ["title", "subject", "class_grade"],
          properties: {
            title: { type: "string" },
            subject: { type: "string" },
            class_grade: { type: "string" },
            description: { type: "string" },
            questions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  question: { type: "string" },
                  options: { type: "array", items: { type: "string" } },
                  correct_answer: { type: "string" },
                  type: { type: "string" }
                }
              }
            }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              quiz: { type: "object" }
            }
          }
        }
      }
    },
    (req, reply) => tutorController.updateQuiz(req, reply)
  );

  // delete quiz
  app.delete(
    "/tutor/delete-quiz/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Delete a quiz (tutor only)",
        params: {
          type: "object",
          properties: { id: { type: "string" } },
          required: ["id"]
        },
        response: {
          200: {
            type: "object",
            properties: {
              message: { type: "string" },
              deleted_quiz_id: { type: "string" }
            }
          },
          404: { type: "object", properties: { error: { type: "string" } } }
        }
      }
    },
    (req, reply) => tutorController.deleteQuiz(req, reply)
  );


  //upload study material
  app.post(
    "/tutor/upload-study-material",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Upload study material (multipart/form-data)",
        consumes: ["multipart/form-data"],
        body: { type: "object" }, // multipart - validation done in controller
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" },
              data: { type: "object" }
            }
          },
          400: { type: "object" },
          403: { type: "object" }
        }
      }
    },
    (req, reply) => tutorController.uploadStudyMaterial(req, reply)
  );


    // Get all quizzes created by tutor
  app.get(
    "/tutor/quizzes", // or "/tutor/quizzes/" if you want trailing slash
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Get all quizzes created by tutor",
        querystring: {
          type: "object",
          properties: {
            subject: { type: "string" },
            class_grade: { type: "string" },
            page: { type: "number" },
            limit: { type: "number" }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    subject: { type: "string" },
                    class_grade: { type: "string" },
                    due_date: { type: ["string", "null"] },
                    total_questions: { type: "number" },
                    status: { type: "string" }
                  }
                }
              }
            }
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    (req, reply) => tutorController.getTutorQuizzes(req, reply)
  );


  // Get all assignments created by tutor
  app.get(
    "/tutor/assignments",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Get all assignments created by tutor",
        querystring: {
          type: "object",
          properties: {
            subject: { type: "string" },
            class_grade: { type: "string" },
            page: { type: "number" },
            limit: { type: "number" }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              data: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string" },
                    title: { type: "string" },
                    subject: { type: "string" },
                    class_grade: { type: "string" },
                    due_date: { type: "string" },
                    allow_submission_online: { type: "boolean" },
                    status: { type: "string" }
                  }
                }
              }
            }
          },
          404: {
            type: "object",
            properties: {
              success: { type: "boolean" },
              message: { type: "string" }
            }
          }
        }
      }
    },
    (req, reply) => tutorController.getTutorAssignments(req, reply)
  );

app.get(
  "/tutor/dashboard-summary",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  (req, reply) => tutorController.getDashboardSummary(req, reply)
);

// ✅ Tutor Dashboard API
  app.get(
    "/tutor/dashboard/parent-requests",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
    },
    (req, reply) =>
      tutorController.getTutorDashboardRequests(req, reply)
  );

  app.post(
  "/tutor/parent-requests/:requestId/request-to-teach",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  (req, reply) =>
    tutorController.requestToTeach(req, reply)
);

app.get(
    "/auth/tutor/my-student",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
      schema: {
        tags: ["Tutor"],
        summary: "Get assigned students for tutor",
      },
    },
    (req, reply) =>
      tutorController.getMyStudents(req, reply)
  );

 // 🔐 TUTOR LOGOUT
  app.post(
    "/tutor/logout",
    {
      preHandler: [authMiddleware, roleMiddleware(["tutor"])],
    },
    tutorController.logout.bind(tutorController)
  );

//  Assignment assing route 

app.post(
  "/tutor/assignments/assign",
  { preHandler: [authMiddleware, roleMiddleware(["tutor"])] },
  tutorController.assignAssignmentToStudents
);

app.post(
  "/tutor/quizzes/assign",
  { preHandler: [authMiddleware, roleMiddleware(["tutor"])] },
  tutorController.assignQuizToStudents
);

app.post(
  "/tutor/study-material/assign",
  { preHandler: [authMiddleware, roleMiddleware(["tutor"])] },
  tutorController.assignStudyMaterial
);

app.get(
  "/tutor/assignments/submitted",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  tutorController.getSubmittedAssignments
);

app.get(
  "/tutor/quizzes/submitted",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  tutorController.getSubmittedQuizzes
);

// 📄 Tutor opens submitted quiz (view + answers)
app.get(
  "/tutor/quizzes/:studentQuizId",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  tutorController.getTutorQuizForCheck
);

// ✅ Tutor checks / evaluates quiz
app.post(
  "/tutor/quizzes/:studentQuizId/check",
  {
    preHandler: [authMiddleware, roleMiddleware(["tutor"])],
  },
  tutorController.checkQuiz
);



}
