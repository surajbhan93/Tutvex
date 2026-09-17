import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const authController = new AuthController();

export default async function authRoutes(fastify: FastifyInstance) {
  // Admin Login
  fastify.post(
    "/auth/admin/login",
    {
      schema: {
        tags: ["Admin"],
        summary: "Admin login",
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" }
          }
        },
        response: {
          200: {
            type: "object",
            properties: {
              token: { type: "string" },
              user: { type: "object" }
            }
          }
        }
      }
    },
    authController.adminLogin
  );

  // Parent Signup
  fastify.post(
    "/auth/parent/signup",
    {
      schema: {
        tags: ["Parent"],
        summary: "Parent signup",
        body: {
          type: "object",
          required: ["fullName", "email", "phone", "password"],
          properties: {
            fullName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            password: { type: "string" }
          }
        }
      }
    },
    authController.parentSignup
  );

  // Parent Login
  fastify.post(
    "/auth/parent/login",
    {
      schema: {
        tags: ["Parent"],
        summary: "Parent login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          }
        }
      }
    },
    authController.parentLogin
  );

  // Tutor Signup
  fastify.post(
    "/auth/tutor/signup",
    {
      schema: {
        tags: ["Tutor"],
        summary: "Tutor signup",
        body: {
          type: "object",
          required: [
            "fullName",
            "email",
            "phone",
            "password",
            "subjects",
            "languages",
            "classesTaught",
            "qualification",
            "college",
            "yearsOfExperience"
          ],
          properties: {
            fullName: { type: "string" },
            email: { type: "string" },
            phone: { type: "string" },
            password: { type: "string" },
            subjects: { type: "array", items: { type: "string" } },
            languages: { type: "array", items: { type: "string" } },
            classesTaught: { type: "array", items: { type: "string" } },
            qualification: { type: "string" },
            college: { type: "string" },
            yearsOfExperience: { type: "number" },
            profileImage: { type: "string" },
            location: { type: "object" }
          }
        }
      }
    },
    authController.tutorSignup
  );

  // Tutor Login
  fastify.post(
    "/auth/tutor/login",
    {
      schema: {
        tags: ["Tutor"],
        summary: "Tutor login",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string" },
            password: { type: "string" }
          }
        }
      }
    },
    authController.tutorLogin
  );

  // tutor-applications
 
  // tutor-applications ✅ FIXED
fastify.get(
  "/auth/tutor-applications",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
    schema: {
      tags: ["Tutor"],
      summary: "Fetch recent tutor applications",
      querystring: {
        type: "object",
        properties: {
          limit: { type: "integer", default: 5, minimum: 1 },
          status: {
            type: "string",
            enum: ["pending", "approved", "rejected"]
          }
        }
      },
      response: {
        200: {
          type: "array",
          items: {
            type: "object",
            properties: {
              _id: { type: "string" },   // ⭐ MUST
              id: { type: "string" },    // ⭐ optional (safe)
              name: { type: "string" },
              email: { type: "string" },
              phone: { type: "string" },
              city: { type: "string" },
              state: { type: "string" },
              status: {
                type: "string",
                enum: ["pending", "approved", "rejected"]
              },
              appliedDate: { type: "string", format: "date-time" }
            }
          }
        }
      }
    }
  },
  authController.getTutorApplications.bind(authController)
);

  // Parent Request (Authenticated)
  // 🔹 Admin: Update tutor status
// fastify.put(
//   "/auth/admin/tutor/:tutorId/status",
//   {
//     preHandler: [authMiddleware, roleMiddleware(["admin"])],
//     schema: {
//       tags: ["Admin"],
//       summary: "Approve or reject tutor",
//       body: {
//         type: "object",
//         required: ["status"],
//         properties: {
//           status: {
//             type: "string",
//             enum: ["approved", "rejected"]
//           }
//         }
//       }
//     }
//   },
//   authController.updateTutorStatus.bind(authController)
// );

fastify.put(
  "/auth/admin/tutor/:id/status",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  authController.updateTutorStatus.bind(authController)
);

fastify.get(
  "/auth/admin/parents",
  {
    preHandler: [async (req: any, reply) => {
      const authHeader = req.headers.authorization;

      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      try {
        const token = authHeader.split(" ")[1];
        const { verifyJwt } = await import("../utils/jwt");
        const decoded = verifyJwt(token);

        if (decoded.role !== "admin") {
          return reply.status(403).send({ error: "Forbidden" });
        }

        req.user = decoded;
      } catch {
        return reply.status(401).send({ error: "Invalid token" });
      }
    }]
  },
  authController.getAllParents
);

// 🔹 Admin: Approve Parent
fastify.patch(
  "/auth/admin/parent/:id/status",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
    schema: {
      tags: ["Admin"],
      summary: "Approve or reject parent",
      body: {
        type: "object",
        required: ["status"],
        properties: {
          status: {
            type: "string",
            enum: ["approved", "rejected"]
          }
        }
      }
    }
  },
  authController.updateParentStatus.bind(authController)
);

fastify.get(
  "/auth/admin/tutor/:id",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  authController.getTutorById.bind(authController)
);

fastify.post(
  "/auth/parent/requests",
  {
    schema: {
      tags: ["Parent"],
      summary: "Submit tutoring request",
      body: {
        type: "object",
        required: ["academicNeeds", "location", "urgency"],
        properties: {
          academicNeeds: { type: "array", items: { type: "string" } },
          scheduling: { type: "array", items: { type: "string" } },
          location: { type: "string" },
          urgency: {
            type: "string",
            enum: ["within_24_hours", "within_3_days", "within_a_week"]
          }
        }
      },
      security: [{ bearerAuth: [] }]
    },
    preHandler: [async (req: any, reply) => {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply.status(401).send({ error: "Unauthorized" });
      }
      const token = authHeader.split(" ")[1];
      const { verifyJwt } = await import("../utils/jwt");
      try {
        const decoded = verifyJwt(token);
        req.user = decoded;
      } catch {
        return reply.status(401).send({ error: "Invalid token" });
      }
    }]
  },
  authController.createParentRequest
);

// Forgot Password
fastify.post(
  "/auth/forgot-password",
  {
    schema: {
      tags: ["Auth"],
      summary: "Forgot password",
      body: {
        type: "object",
        required: ["email"],
        properties: {
          email: { type: "string", format: "email" }
        }
      }
    }
  },
  authController.forgotPassword.bind(authController)
);

// Reset Password
fastify.post(
  "/auth/reset-password",
  {
    schema: {
      tags: ["Auth"],
      summary: "Reset password",
      body: {
        type: "object",
        required: ["token", "newPassword"],
        properties: {
          token: { type: "string" },
          newPassword: { type: "string", minLength: 6 }
        }
      }
    }
  },
  authController.resetPassword.bind(authController)
);

}
