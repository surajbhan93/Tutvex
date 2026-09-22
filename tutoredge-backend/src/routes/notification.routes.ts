import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function notificationRoutes(fastify: FastifyInstance) {
  // Public route - Allow anonymous token registration
  fastify.post("/register-token", async (req: FastifyRequest<{ Body: { token: string; platform?: "web" | "android" | "ios"; browser?: string; deviceId?: string; } }>, reply) => {
    // Try to get user from token, but don't require it
    try {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        await authMiddleware(req, reply);
      }
    } catch (error) {
      // Ignore auth errors for this endpoint - allow anonymous registration
    }
    return notificationController.registerToken(req, reply);
  });

  // All other routes require authentication
  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/", notificationController.getNotifications);
  fastify.get("/unread-count", notificationController.getUnreadCount);
  fastify.put("/:id/read", notificationController.markAsRead);
  fastify.put("/read-all", notificationController.markAllAsRead);
  fastify.delete("/:id", notificationController.deleteNotification);

  // FCM Token Management
  fastify.delete("/unregister-token", notificationController.unregisterToken);
  fastify.get("/token-status", notificationController.getTokenStatus);
}
