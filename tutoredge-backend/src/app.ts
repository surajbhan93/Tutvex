import dotenv from "dotenv";
dotenv.config();
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
import passwordRoutes from "./routes/password.routes";
import chatbotRoutes from "./routes/chatbot.routes";
import adminChatbotRoutes from "./routes/adminChatbot.routes";
import DemoLead from "./routes/demoLead.routes";
import compress from "@fastify/compress";
import subscriptionRoutes from "./routes/subscription.routes";
import leadsRoutes from "./routes/leads.routes";
import walletRoutes from "./routes/wallet.routes";
import analyticsRoutes from "./routes/analytics.routes";
import webhookRoutes from "./routes/webhook.routes";
import notificationRoutes from "./routes/notification.routes";
import adminMonetizationRoutes from "./routes/adminMonetization.routes";
import { initializeFirebaseAdmin } from "./config/firebaseAdmin";

// Initialize Firebase Admin SDK for FCM Push Notifications
try {
  initializeFirebaseAdmin();
  console.log("✓ Firebase Admin SDK initialized for push notifications");
} catch (error) {
  console.error("✗ Failed to initialize Firebase Admin SDK:", error);
  console.warn("⚠️  Push notifications will not work without Firebase Admin SDK");
}

async function buildApp() {
  // Register Gzip/Brotli Compression for Fast API Responses
  await app.register(compress, { threshold: 512, encodings: ["gzip", "deflate"] });

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

//   await app.register(fastifyStatic, {
//   root: path.join(process.cwd(), "uploads"),
//   prefix: "/uploads/",
//   setHeaders: (res, filePath) => {
//     if (filePath.endsWith(".jpg") || filePath.endsWith(".png")) {
//       res.setHeader("Content-Type", "image/jpeg");
//       res.setHeader("Content-Disposition", "inline");
//     }
//   },
// });


  // Routes DemoLead
  app.register(DemoLead, { prefix: "/api/v1" });
    app.register(adminRoutes, { prefix: "/api/v1" });
app.register(contactRoutes, { prefix: "/api/v1" });
  app.register(authRoutes, { prefix: "/api/v1" });
  app.register(parentRoutes, { prefix: "/api/v1" });
  app.register(tutorRoutes, { prefix: "/api/v1" });
  app.register(studentRoutes, { prefix: "/api/v1" });
  // app.register(otpRoutes, { prefix: "/api" });
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
  app.register(passwordRoutes, { prefix: "/v1" });
 app.register(chatbotRoutes, { prefix: "/api/v1" });
 app.register(adminChatbotRoutes, { prefix: "/api/v1" });

  // Monetization routes
  app.register(subscriptionRoutes, { prefix: "/api/v1/subscription" });
  app.register(leadsRoutes, { prefix: "/api/v1/leads" });
  app.register(walletRoutes, { prefix: "/api/v1/wallet" });
  app.register(analyticsRoutes, { prefix: "/api/v1/analytics" });
  app.register(webhookRoutes, { prefix: "/api/v1/webhook" });
  app.register(notificationRoutes, { prefix: "/api/v1/notifications" });
  app.register(adminMonetizationRoutes, { prefix: "/api/v1/admin/monetization" });

  return app;
}

export default buildApp;
