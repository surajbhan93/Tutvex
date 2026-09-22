import { FastifyRequest, FastifyReply } from "fastify";
import notificationService from "../services/notification.service";
import UserNotificationToken from "../models/UserNotificationToken";

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

  /**
   * POST /notifications/register-token - Register FCM token
   */
  async registerToken(
    req: FastifyRequest<{
      Body: {
        token: string;
        platform?: "web" | "android" | "ios";
        browser?: string;
        deviceId?: string;
      };
    }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (req as any).user?.id; // Allow anonymous registration
      const { token, platform = "web", browser, deviceId } = req.body;

      console.log(`[FCM] Registering token for user: ${userId || 'anonymous'}`);

      if (!token) {
        return reply.status(400).send({
          success: false,
          message: "Token is required",
        });
      }

      // Check if token already exists
      let existingToken = await UserNotificationToken.findOne({ token });

      if (existingToken) {
        // Update existing token
        if (userId) existingToken.userId = userId; // Associate with user if authenticated
        existingToken.platform = platform;
        existingToken.browser = browser;
        existingToken.deviceId = deviceId;
        existingToken.isActive = true;
        existingToken.lastUsedAt = new Date();
        await existingToken.save();

        console.log(`[FCM] Token updated for user: ${userId || 'anonymous'}`);

        return reply.status(200).send({
          success: true,
          message: "Token updated successfully",
          data: { tokenId: existingToken._id },
        });
      }

      // Create new token
      const tokenData: any = {
        token,
        platform,
        browser,
        deviceId,
        isActive: true,
        lastUsedAt: new Date(),
      };

      if (userId) {
        tokenData.userId = userId;
      }

      const newToken = await UserNotificationToken.create(tokenData);

      console.log(`[FCM] New token created for user: ${userId || 'anonymous'}`);

      reply.status(201).send({
        success: true,
        message: "Token registered successfully",
        data: { tokenId: newToken._id },
      });
    } catch (error: any) {
      console.error("Error registering FCM token:", error);
      
      // Handle duplicate key error
      if (error.code === 11000) {
        return reply.status(200).send({
          success: true,
          message: "Token already registered",
        });
      }

      reply.status(500).send({
        success: false,
        message: error.message || "Failed to register token",
      });
    }
  },

  /**
   * DELETE /notifications/unregister-token - Unregister FCM token
   */
  async unregisterToken(
    req: FastifyRequest<{ Body: { token: string } }>,
    reply: FastifyReply
  ) {
    try {
      const userId = (req as any).user.id;
      const { token } = req.body;

      if (!token) {
        return reply.status(400).send({
          success: false,
          message: "Token is required",
        });
      }

      // Find and deactivate the token
      const tokenDoc = await UserNotificationToken.findOne({
        token,
        userId,
      });

      if (!tokenDoc) {
        return reply.status(404).send({
          success: false,
          message: "Token not found",
        });
      }

      tokenDoc.isActive = false;
      await tokenDoc.save();

      reply.status(200).send({
        success: true,
        message: "Token unregistered successfully",
      });
    } catch (error: any) {
      console.error("Error unregistering FCM token:", error);
      reply.status(500).send({
        success: false,
        message: error.message || "Failed to unregister token",
      });
    }
  },

  /**
   * GET /notifications/token-status - Get FCM token status for current user
   */
  async getTokenStatus(req: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (req as any).user.id;

      const tokens = await UserNotificationToken.find({
        userId,
        isActive: true,
      }).select("platform browser deviceId lastUsedAt createdAt");

      reply.status(200).send({
        success: true,
        data: {
          hasActiveTokens: tokens.length > 0,
          tokenCount: tokens.length,
          tokens,
        },
      });
    } catch (error: any) {
      reply.status(500).send({
        success: false,
        message: error.message,
      });
    }
  },
};
