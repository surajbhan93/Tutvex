import { FastifyInstance } from "fastify";
import { notificationController } from "../controllers/notification.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function notificationRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("preHandler", authMiddleware);

  fastify.get("/", notificationController.getNotifications);
  fastify.get("/unread-count", notificationController.getUnreadCount);
  fastify.put("/:id/read", notificationController.markAsRead);
  fastify.put("/read-all", notificationController.markAllAsRead);
  fastify.delete("/:id", notificationController.deleteNotification);
}
