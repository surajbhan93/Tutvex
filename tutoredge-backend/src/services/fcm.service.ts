import { getFirebaseMessaging } from "../config/firebaseAdmin";
import UserNotificationToken from "../models/UserNotificationToken";
import { Types } from "mongoose";

export interface FCMNotificationPayload {
  title: string;
  body: string;
  type: string;
  url?: string;
  leadId?: string;
  metadata?: any;
}

export class FCMService {
  /**
   * Send push notification to a single user
   */
  async sendToUser(
    userId: string | Types.ObjectId,
    payload: FCMNotificationPayload
  ): Promise<{ success: boolean; sentCount: number; failedCount: number }> {
    try {
      // Get all active tokens for the user
      const tokenDocs = await UserNotificationToken.find({
        userId: new Types.ObjectId(userId),
        isActive: true,
      }).select("token").lean();

      const tokens = tokenDocs.map((t: any) => t.token);

      if (tokens.length === 0) {
        console.log(`No active FCM tokens found for user ${userId}`);
        return { success: true, sentCount: 0, failedCount: 0 };
      }

      // Send to all tokens
      return await this.sendToTokens(tokens, payload);
    } catch (error) {
      console.error("Error sending notification to user:", error);
      return { success: false, sentCount: 0, failedCount: 0 };
    }
  }

  /**
   * Send push notification to multiple users
   */
  async sendToUsers(
    userIds: (string | Types.ObjectId)[],
    payload: FCMNotificationPayload
  ): Promise<{ success: boolean; sentCount: number; failedCount: number }> {
    try {
      let totalSent = 0;
      let totalFailed = 0;

      // Send to each user
      for (const userId of userIds) {
        const result = await this.sendToUser(userId, payload);
        totalSent += result.sentCount;
        totalFailed += result.failedCount;
      }

      return {
        success: true,
        sentCount: totalSent,
        failedCount: totalFailed,
      };
    } catch (error) {
      console.error("Error sending notifications to users:", error);
      return { success: false, sentCount: 0, failedCount: 0 };
    }
  }

  /**
   * Send push notification to specific FCM tokens
   */
  async sendToTokens(
    tokens: string[],
    payload: FCMNotificationPayload
  ): Promise<{ success: boolean; sentCount: number; failedCount: number }> {
    try {
      if (tokens.length === 0) {
        return { success: true, sentCount: 0, failedCount: 0 };
      }

      const messaging = getFirebaseMessaging();
      
      // Check if Firebase messaging is available
      if (!messaging) {
        console.warn("⚠️  Firebase messaging not available - notifications skipped");
        return { success: false, sentCount: 0, failedCount: tokens.length };
      }

      // Build FCM message
      const message: any = {
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: {
          type: payload.type,
          url: payload.url || "/tutor/dashboard",
          ...(payload.leadId && { leadId: payload.leadId }),
          ...(payload.metadata && { metadata: JSON.stringify(payload.metadata) }),
        },
        webpush: {
          fcmOptions: {
            link: payload.url || "/tutor/dashboard",
          },
          notification: {
            icon: "/logo.png",
            badge: "/logo.png",
            requireInteraction: false,
            tag: payload.type,
          },
        },
      };

      // Send to multiple tokens (max 500 per batch)
      let sentCount = 0;
      let failedCount = 0;

      // Process in batches of 500 (FCM limit)
      const batchSize = 500;
      for (let i = 0; i < tokens.length; i += batchSize) {
        const batch = tokens.slice(i, i + batchSize);

        try {
          const response = await messaging.sendEachForMulticast({
            ...message,
            tokens: batch,
          });

          sentCount += response.successCount;
          failedCount += response.failureCount;

          // Handle failed tokens
          if (response.failureCount > 0) {
            const failedTokens: string[] = [];
            response.responses.forEach((resp: any, idx: number) => {
              if (!resp.success) {
                const token = batch[idx];
                const errorCode = resp.error?.code;

                console.error(
                  `Failed to send to token ${token.substring(0, 20)}...: ${errorCode}`
                );

                // Mark token as inactive if it's invalid
                if (
                  errorCode === "messaging/invalid-registration-token" ||
                  errorCode === "messaging/registration-token-not-registered"
                ) {
                  failedTokens.push(token);
                }
              }
            });

            // Deactivate invalid tokens
            if (failedTokens.length > 0) {
              await this.deactivateTokens(failedTokens);
            }
          }
        } catch (error) {
          console.error("Error sending batch:", error);
          failedCount += batch.length;
        }
      }

      console.log(
        `FCM notifications sent: ${sentCount} successful, ${failedCount} failed`
      );

      return {
        success: sentCount > 0,
        sentCount,
        failedCount,
      };
    } catch (error) {
      console.error("Error sending FCM notifications:", error);
      return { success: false, sentCount: 0, failedCount: 0 };
    }
  }

  /**
   * Deactivate invalid FCM tokens
   */
  async deactivateTokens(tokens: string[]): Promise<void> {
    try {
      await UserNotificationToken.updateMany(
        { token: { $in: tokens } },
        { $set: { isActive: false } }
      );

      console.log(`Deactivated ${tokens.length} invalid FCM tokens`);
    } catch (error) {
      console.error("Error deactivating tokens:", error);
    }
  }

  /**
   * Send new lead notification to matching tutors
   */
  async sendNewLeadNotification(
    tutorIds: (string | Types.ObjectId)[],
    leadData: {
      leadId: string;
      subject: string;
      studentClass: string;
      location?: string;
    }
  ): Promise<void> {
    try {
      const locationStr = leadData.location ? ` in ${leadData.location}` : "";

      const payload: FCMNotificationPayload = {
        title: "🔔 New Student Lead",
        body: `${leadData.studentClass} ${leadData.subject} requirement matches your profile${locationStr}.`,
        type: "NEW_LEAD",
        url: `/tutor/leads/${leadData.leadId}`,
        leadId: leadData.leadId,
        metadata: {
          subject: leadData.subject,
          class: leadData.studentClass,
        },
      };

      const result = await this.sendToUsers(tutorIds, payload);

      console.log(
        `New lead notification sent to ${tutorIds.length} tutors: ${result.sentCount} delivered`
      );
    } catch (error) {
      console.error("Error sending new lead notification:", error);
    }
  }

  /**
   * Send low credits warning notification
   */
  async sendLowCreditsNotification(
    tutorId: string | Types.ObjectId,
    remainingCredits: number
  ): Promise<void> {
    try {
      const payload: FCMNotificationPayload = {
        title: "⚠️ Low Credits",
        body: `You have only ${remainingCredits} lead credits remaining. Buy more to continue unlocking leads.`,
        type: "CREDITS_LOW",
        url: "/tutor/credits",
      };

      await this.sendToUser(tutorId, payload);
    } catch (error) {
      console.error("Error sending low credits notification:", error);
    }
  }

  /**
   * Send subscription expiring notification
   */
  async sendSubscriptionExpiringNotification(
    tutorId: string | Types.ObjectId,
    daysLeft: number
  ): Promise<void> {
    try {
      const payload: FCMNotificationPayload = {
        title: "⏰ Subscription Expiring",
        body: `Your subscription will expire in ${daysLeft} days. Renew now to continue enjoying premium benefits.`,
        type: "SUBSCRIPTION_EXPIRING",
        url: "/tutor/subscription",
      };

      await this.sendToUser(tutorId, payload);
    } catch (error) {
      console.error("Error sending subscription expiring notification:", error);
    }
  }

  /**
   * Test notification (admin only)
   */
  async sendTestNotification(
    tutorId: string | Types.ObjectId,
    message?: string
  ): Promise<boolean> {
    try {
      const payload: FCMNotificationPayload = {
        title: "🧪 Test Notification",
        body: message || "This is a test notification from Tutvex.",
        type: "TEST",
        url: "/tutor/dashboard",
      };

      const result = await this.sendToUser(tutorId, payload);
      return result.success && result.sentCount > 0;
    } catch (error) {
      console.error("Error sending test notification:", error);
      return false;
    }
  }

  /**
   * Send lead created confirmation notification to parent
   */
  async sendLeadCreatedNotification(
    parentId: string | Types.ObjectId,
    leadData: {
      leadId: string;
      subject: string;
      studentClass: string;
      studentName?: string;
    }
  ): Promise<void> {
    try {
      const payload: FCMNotificationPayload = {
        title: "✅ Lead Request Submitted!",
        body: `Your request for ${leadData.studentClass} ${leadData.subject} tutor has been submitted successfully. We'll notify you when tutors show interest.`,
        type: "LEAD_CREATED",
        url: "/parent/my-requests",
        leadId: leadData.leadId,
        metadata: {
          subject: leadData.subject,
          class: leadData.studentClass,
          studentName: leadData.studentName,
        },
      };

      await this.sendToUser(parentId, payload);
      console.log(`Lead created notification sent to parent ${parentId}`);
    } catch (error) {
      console.error("Error sending lead created notification:", error);
    }
  }

  /**
   * Send lead unlocked notification to parent (when tutor shows interest)
   */
  async sendLeadUnlockedNotification(
    parentId: string | Types.ObjectId,
    leadData: {
      leadId: string;
      subject: string;
      studentClass: string;
      tutorName: string;
    }
  ): Promise<void> {
    try {
      const payload: FCMNotificationPayload = {
        title: "🎉 A Tutor is Interested!",
        body: `${leadData.tutorName} has shown interest in your ${leadData.studentClass} ${leadData.subject} request. Check your dashboard for details.`,
        type: "LEAD_UNLOCKED",
        url: "/parent/my-requests",
        leadId: leadData.leadId,
        metadata: {
          subject: leadData.subject,
          class: leadData.studentClass,
          tutorName: leadData.tutorName,
        },
      };

      await this.sendToUser(parentId, payload);
      console.log(`Lead unlocked notification sent to parent ${parentId}`);
    } catch (error) {
      console.error("Error sending lead unlocked notification:", error);
    }
  }
}

export default new FCMService();
