import Notification, { INotification, NotificationType } from "../models/Notification";
import { Types } from "mongoose";

export class NotificationService {
  /**
   * Create a notification
   */
  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string,
    metadata?: any
  ): Promise<INotification> {
    return await Notification.create({
      userId: new Types.ObjectId(userId),
      type,
      title,
      message,
      link,
      metadata,
      isRead: false,
    });
  }

  /**
   * Get user notifications
   */
  async getUserNotifications(
    userId: string,
    limit: number = 50,
    unreadOnly: boolean = false
  ): Promise<INotification[]> {
    const query: any = { userId: new Types.ObjectId(userId) };
    if (unreadOnly) {
      query.isRead = false;
    }

    return await Notification.find(query).sort({ createdAt: -1 }).limit(limit);
  }

  /**
   * Get unread count
   */
  async getUnreadCount(userId: string): Promise<number> {
    return await Notification.countDocuments({
      userId: new Types.ObjectId(userId),
      isRead: false,
    });
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<INotification | null> {
    return await Notification.findOneAndUpdate(
      {
        _id: new Types.ObjectId(notificationId),
        userId: new Types.ObjectId(userId),
      },
      {
        isRead: true,
        readAt: new Date(),
      },
      { new: true }
    );
  }

  /**
   * Mark all as read
   */
  async markAllAsRead(userId: string): Promise<number> {
    const result = await Notification.updateMany(
      {
        userId: new Types.ObjectId(userId),
        isRead: false,
      },
      {
        isRead: true,
        readAt: new Date(),
      }
    );

    return result.modifiedCount;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId: string, userId: string): Promise<boolean> {
    const result = await Notification.deleteOne({
      _id: new Types.ObjectId(notificationId),
      userId: new Types.ObjectId(userId),
    });

    return result.deletedCount > 0;
  }

  /**
   * Helper: Notify on new lead (for tutors matching the lead)
   */
  async notifyNewLead(tutorId: string, leadId: string, subject: string): Promise<void> {
    await this.createNotification(
      tutorId,
      "new_lead",
      "New Lead Available!",
      `A new ${subject} enquiry matches your profile. Check the marketplace.`,
      "/tutor/leads/marketplace",
      { leadId }
    );
  }

  /**
   * Helper: Notify on lead unlock
   */
  async notifyLeadUnlocked(tutorId: string, subject: string): Promise<void> {
    await this.createNotification(
      tutorId,
      "lead_unlocked",
      "Lead Unlocked Successfully",
      `You've unlocked a ${subject} lead. Contact the parent now!`,
      "/tutor/leads/my-leads"
    );
  }

  /**
   * Helper: Notify on subscription activation
   */
  async notifySubscriptionActivated(
    tutorId: string,
    planName: string,
    credits: number
  ): Promise<void> {
    await this.createNotification(
      tutorId,
      "subscription_activated",
      "Subscription Activated!",
      `Your ${planName} plan is now active. You received ${credits} credits!`,
      "/tutor/subscription"
    );
  }

  /**
   * Helper: Notify subscription expiring soon
   */
  async notifySubscriptionExpiring(
    tutorId: string,
    planName: string,
    daysLeft: number
  ): Promise<void> {
    await this.createNotification(
      tutorId,
      "subscription_expiring",
      "Subscription Expiring Soon",
      `Your ${planName} plan expires in ${daysLeft} days. Renew to keep your benefits.`,
      "/tutor/subscription"
    );
  }

  /**
   * Helper: Notify credit purchase
   */
  async notifyCreditPurchase(tutorId: string, credits: number): Promise<void> {
    await this.createNotification(
      tutorId,
      "credit_purchased",
      "Credits Added!",
      `${credits} credits have been added to your wallet.`,
      "/tutor/credits"
    );
  }

  /**
   * Helper: Notify payment received
   */
  async notifyPaymentReceived(tutorId: string, amount: number): Promise<void> {
    await this.createNotification(
      tutorId,
      "payment_received",
      "Payment Received",
      `You received ₹${amount} from a student payment.`,
      "/tutor/wallet"
    );
  }

  /**
   * Helper: Notify withdrawal approved
   */
  async notifyWithdrawalApproved(tutorId: string, amount: number): Promise<void> {
    await this.createNotification(
      tutorId,
      "withdrawal_approved",
      "Withdrawal Approved",
      `Your withdrawal request of ₹${amount} has been approved and processed.`,
      "/tutor/wallet"
    );
  }

  /**
   * Helper: Notify withdrawal rejected
   */
  async notifyWithdrawalRejected(tutorId: string, amount: number, reason: string): Promise<void> {
    await this.createNotification(
      tutorId,
      "withdrawal_rejected",
      "Withdrawal Rejected",
      `Your withdrawal request of ₹${amount} was rejected. Reason: ${reason}`,
      "/tutor/wallet"
    );
  }

  /**
   * Helper: Notify conversion created
   */
  async notifyConversionCreated(tutorId: string, monthlyFee: number): Promise<void> {
    await this.createNotification(
      tutorId,
      "conversion_created",
      "🎉 Lead Converted!",
      `Congratulations! You've successfully converted a lead. Monthly fee: ₹${monthlyFee}`,
      "/tutor/leads/my-leads"
    );
  }
}

export default new NotificationService();
