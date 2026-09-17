import { FastifyRequest, FastifyReply } from "fastify";
import notificationService from "../services/notification.service";

export const notificationController = {
  /**
   * GET /notifications - Get user notifications
   */
  async getNotifications(
    req: FastifyRequest<{ Querystring: { limit?: string; unreadOnly?: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (req as any).user.id;
      const limit = req.query.limit ? parseInt(req.query.limit) : 50;
      const unreadOnly = req.query.unreadOnly === "true";

      const notifications = await notificationService.getUserNotifications(
        userId,
        limit,
        unreadOnly
      );

      reply.status(200).send({ success: true, data: notifications });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * GET /notifications/unread-count - Get unread count
   */
  async getUnreadCount(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;
      const count = await notificationService.getUnreadCount(userId);

      reply.status(200).send({ success: true, data: { count } });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * PUT /notifications/:id/read - Mark as read
   */
  async markAsRead(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const notification = await notificationService.markAsRead(id, userId);

      if (!notification) {
        return reply.status(404).send({ success: false, message: "Notification not found" });
      }

      reply.status(200).send({ success: true, data: notification });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * PUT /notifications/read-all - Mark all as read
   */
  async markAllAsRead(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;
      const count = await notificationService.markAllAsRead(userId);

      reply.status(200).send({
        success: true,
        data: { markedCount: count },
        message: "All notifications marked as read",
      });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },

  /**
   * DELETE /notifications/:id - Delete notification
   */
  async deleteNotification(
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;

      const deleted = await notificationService.deleteNotification(id, userId);

      if (!deleted) {
        return reply.status(404).send({ success: false, message: "Notification not found" });
      }

      reply.status(200).send({ success: true, message: "Notification deleted" });
    } catch (error: any) {
      reply.status(500).send({ success: false, message: error.message });
    }
  },
};
