import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import authRoutes from "./routes/auth.routes";
import parentRoutes from "./routes/parent.routes";
import studentRoutes from "./routes/student.routes";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import path from "path";
import tutorRoutes from "./routes/tutor.routes";
import cors from "@fastify/cors";
import { otpRoutes } from "./routes/otp.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import contactRoutes from "./routes/contact.routes";
const app = fastify({ logger: true });
// import multipart from "@fastify/multipart";
import teamRoutes from "./routes/team.routes";
import testimonialRoutes from "./routes/testimonial.routes";
import tutorReviewRoutes  from "./routes/tutorReview.routes";
import razorpayRoutes from "./routes/razorpayRoutes";
import paymentRoutes from "./routes/payment.routes";


async function buildApp() {
    // Register CORS
  await app.register(cors, {
  origin: "http://localhost:3000", // ❌ "*" mat rakho
  credentials: true,               // 🔥 VERY IMPORTANT
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
});


  // Swagger setup
  await app.register(swagger, {
    openapi: {
      info: {
        title: "TutorEdge API",
        description: "API documentation for TutorEdge platform",
        version: "1.0.0"
      },
      servers: [
        { url: "http://localhost:3000/api/v1", description: "Development" },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [{ bearerAuth: [] }]
    }
  });

  await app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true
    }
  });

  await app.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

 /* ✅ STATIC FILES (MOST IMPORTANT FIX) */
  const rootDir = path.join(process.cwd()); 
  // process.cwd() = tutoredge-backend

  await app.register(fastifyStatic, {
    root: path.join(rootDir, "uploads"), // 👈 correct
    prefix: "/uploads/",
  });

// app.register(fastifyStatic, {
//   root: path.join(process.cwd(), "uploads"),
//   prefix: "/uploads/",
//   decorateReply: false
// });

  // Routes
  app.register(adminRoutes, { prefix: "/api/v1" });
app.register(contactRoutes, { prefix: "/api/v1" });
  app.register(authRoutes, { prefix: "/api/v1" });
  app.register(parentRoutes, { prefix: "/api/v1" });
  app.register(tutorRoutes, { prefix: "/api/v1" });
  app.register(studentRoutes, { prefix: "/api/v1" });
  app.register(otpRoutes, { prefix: "/api" });
// OTP routes
  app.register(otpRoutes, { prefix: "/api/v1" });
  app.register(userRoutes, { prefix: "/api/v1" });
  app.register(teamRoutes, { prefix: "/api/v1" });
   app.register(testimonialRoutes, { prefix: "/api/v1" });
   app.register(tutorReviewRoutes, { prefix: "/api/v1" });
 // 🔥 PAYMENT MODULE (THIS WAS MISSING)
app.register(paymentRoutes, { prefix: "/api/v1/payments" });

// 🔥 RAZORPAY
app.register(razorpayRoutes, { prefix: "/api/v1/payments" });
  return app;
}

export default buildApp;
