import SubscriptionPlan, { ISubscriptionPlan } from "../models/SubscriptionPlan";
import TutorSubscription, { ITutorSubscription } from "../models/TutorSubscription";
import LeadCreditWallet from "../models/LeadCreditWallet";
import CreditTransaction from "../models/CreditTransaction";
import { Types } from "mongoose";

export class SubscriptionService {
  /**
   * Get all active subscription plans
   */
  async getAllPlans(): Promise<ISubscriptionPlan[]> {
    return await SubscriptionPlan.find({ isActive: true }).sort({ displayOrder: 1 });
  }

  /**
   * Get plan by slug (free, starter, pro, premium)
   */
  async getPlanBySlug(slug: string): Promise<ISubscriptionPlan | null> {
    return await SubscriptionPlan.findOne({ slug, isActive: true });
  }

  /**
   * Get plan by ID
   */
  async getPlanById(planId: string): Promise<ISubscriptionPlan | null> {
    return await SubscriptionPlan.findById(planId);
  }

  /**
   * Get tutor's current active subscription
   */
  async getTutorSubscription(tutorId: string): Promise<ITutorSubscription | null> {
    return await TutorSubscription.findOne({
      tutorId: new Types.ObjectId(tutorId),
      status: "active",
      expiryDate: { $gt: new Date() },
    })
      .populate("planId")
      .sort({ createdAt: -1 });
  }

  /**
   * Get tutor's subscription history
   */
  async getTutorSubscriptionHistory(tutorId: string): Promise<ITutorSubscription[]> {
    return await TutorSubscription.find({
      tutorId: new Types.ObjectId(tutorId),
    })
      .populate("planId")
      .sort({ createdAt: -1 });
  }

  /**
   * Activate Free Plan for new tutor
   */
  async activateFreePlan(tutorId: string): Promise<ITutorSubscription> {
    const freePlan = await SubscriptionPlan.findOne({ slug: "free" });
    if (!freePlan) {
      throw new Error("Free plan not found. Please seed default plans.");
    }

    // Check if tutor already has an active subscription
    const existingSubscription = await this.getTutorSubscription(tutorId);
    if (existingSubscription) {
      throw new Error("Tutor already has an active subscription");
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + freePlan.durationDays);

    // Create subscription
    const subscription = await TutorSubscription.create({
      tutorId: new Types.ObjectId(tutorId),
      planId: freePlan._id,
      status: "active",
      startDate,
      expiryDate,
      autoRenew: true, // Free plan auto-renews
    });

    // Initialize credit wallet with 3 free credits
    let wallet = await LeadCreditWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });
    if (!wallet) {
      wallet = await LeadCreditWallet.create({
        tutorId: new Types.ObjectId(tutorId),
        availableCredits: 3,
        usedCredits: 0,
        totalEarned: 3,
        totalPurchased: 0,
      });
    }

    // Record credit transaction
    await CreditTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount: 0,
      credits: 3,
      transactionType: "subscription_credit",
      status: "completed",
      description: "Free plan signup credits",
      referenceId: (subscription._id as Types.ObjectId).toString(),
    });

    // ✅ UPDATE USER MEMBERSHIP TYPE
    await this.updateTutorMembership(tutorId, "free", 0);

    return subscription;
  }

  /**
   * Activate Paid Subscription (called after successful payment)
   */
  async activatePaidSubscription(
    tutorId: string,
    planSlug: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySubscriptionId?: string
  ): Promise<ITutorSubscription> {
    // ✅ IDEMPOTENCY: Check if payment already processed
    const existingWithPayment = await TutorSubscription.findOne({
      razorpayPaymentId,
      tutorId: new Types.ObjectId(tutorId),
    });

    if (existingWithPayment) {
      console.log(`Payment ${razorpayPaymentId} already processed for tutor ${tutorId}`);
      return existingWithPayment;
    }

    const plan = await SubscriptionPlan.findOne({ slug: planSlug, isActive: true });
    if (!plan) {
      throw new Error(`Plan '${planSlug}' not found`);
    }

    if (plan.slug === "free") {
      throw new Error("Use activateFreePlan for free subscriptions");
    }

    // Cancel existing active subscription
    const existingSubscription = await this.getTutorSubscription(tutorId);
    if (existingSubscription) {
      existingSubscription.status = "cancelled";
      existingSubscription.cancelReason = "Upgraded to new plan";
      existingSubscription.cancelledAt = new Date();
      await existingSubscription.save();
    }

    const startDate = new Date();
    const expiryDate = new Date(startDate);
    expiryDate.setDate(expiryDate.getDate() + plan.durationDays);

    // Create new subscription
    const subscription = await TutorSubscription.create({
      tutorId: new Types.ObjectId(tutorId),
      planId: plan._id,
      status: "active",
      startDate,
      expiryDate,
      autoRenew: false,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySubscriptionId,
    });

    // Add monthly credits to wallet
    if (plan.monthlyCredits > 0) {
      const wallet = await LeadCreditWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });
      if (wallet) {
        wallet.availableCredits += plan.monthlyCredits;
        wallet.totalEarned += plan.monthlyCredits;
        wallet.lastCreditAddedAt = new Date();
        await wallet.save();

        // Record credit transaction
        await CreditTransaction.create({
          tutorId: new Types.ObjectId(tutorId),
          amount: plan.price,
          credits: plan.monthlyCredits,
          transactionType: "subscription_credit",
          status: "completed",
          description: `${plan.name} subscription credits`,
          referenceId: (subscription._id as Types.ObjectId).toString(),
          razorpayPaymentId,
          razorpayOrderId,
        });
      }
    }

    // ✅ UPDATE USER MEMBERSHIP TYPE AND PRIORITY
    await this.updateTutorMembership(tutorId, plan.slug, plan.priorityScore);

    return subscription;
  }

  /**
   * Update tutor's membership type and priority
   */
  async updateTutorMembership(
    tutorId: string,
    planSlug: string,
    priorityScore: number
  ): Promise<void> {
    const User = (await import("../models/User")).default;
    
    await User.findByIdAndUpdate(tutorId, {
      membershipType: "subscription",
      currentPlanSlug: planSlug,
      subscriptionPriority: priorityScore,
      revenueSharePercentage: 0,
    });
  }

  /**
   * Check and expire subscriptions (cron job)
   */
  async expireSubscriptions(): Promise<number> {
    const now = new Date();
    const result = await TutorSubscription.updateMany(
      {
        status: "active",
        expiryDate: { $lt: now },
      },
      {
        $set: { status: "expired" },
      }
    );

    return result.modifiedCount;
  }

  /**
   * Get subscriptions expiring soon (for notifications)
   */
  async getExpiringSoon(days: number): Promise<ITutorSubscription[]> {
    const now = new Date();
    const futureDate = new Date(now);
    futureDate.setDate(futureDate.getDate() + days);

    return await TutorSubscription.find({
      status: "active",
      expiryDate: { $gte: now, $lte: futureDate },
    }).populate("tutorId planId");
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(tutorId: string, reason?: string): Promise<ITutorSubscription> {
    const subscription = await this.getTutorSubscription(tutorId);
    if (!subscription) {
      throw new Error("No active subscription found");
    }

    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    subscription.cancelReason = reason || "Cancelled by tutor";
    subscription.autoRenew = false;
    await subscription.save();

    return subscription;
  }

  /**
   * Enable/Disable auto-renewal
   */
  async toggleAutoRenew(tutorId: string, autoRenew: boolean): Promise<ITutorSubscription> {
    const subscription = await this.getTutorSubscription(tutorId);
    if (!subscription) {
      throw new Error("No active subscription found");
    }

    subscription.autoRenew = autoRenew;
    await subscription.save();

    return subscription;
  }

  /**
   * Admin: Create or update subscription plan
   */
  async upsertPlan(planData: Partial<ISubscriptionPlan>): Promise<ISubscriptionPlan> {
    if (planData._id) {
      const plan = await SubscriptionPlan.findByIdAndUpdate(planData._id, planData, { new: true });
      if (!plan) throw new Error("Plan not found");
      return plan;
    } else {
      return await SubscriptionPlan.create(planData);
    }
  }

  /**
   * Admin: Deactivate plan
   */
  async deactivatePlan(planId: string): Promise<ISubscriptionPlan> {
    const plan = await SubscriptionPlan.findByIdAndUpdate(
      planId,
      { isActive: false },
      { new: true }
    );
    if (!plan) throw new Error("Plan not found");
    return plan;
  }

  /**
   * Seed default subscription plans (run once)
   */
  async seedDefaultPlans(): Promise<void> {
    const plans = [
      {
        name: "Free",
        slug: "free",
        price: 0,
        durationDays: 365,
        monthlyCredits: 0,
        priorityScore: 0,
        features: {
          featuredProfile: false,
          contactAccess: false,
          analyticsAccess: false,
          priorityMatching: false,
          whatsappAccess: false,
          verifiedBadge: false,
          proBadge: false,
          premiumBadge: false,
          dedicatedSupport: false,
        },
        isActive: true,
        displayOrder: 1,
      },
      {
        name: "Starter",
        slug: "starter",
        price: 299,
        durationDays: 30,
        monthlyCredits: 10,
        priorityScore: 25,
        features: {
          featuredProfile: false,
          contactAccess: true,
          analyticsAccess: false,
          priorityMatching: false,
          whatsappAccess: true,
          verifiedBadge: true,
          proBadge: false,
          premiumBadge: false,
          dedicatedSupport: false,
        },
        isActive: true,
        displayOrder: 2,
      },
      {
        name: "Pro",
        slug: "pro",
        price: 699,
        durationDays: 30,
        monthlyCredits: 30,
        priorityScore: 50,
        features: {
          featuredProfile: true,
          contactAccess: true,
          analyticsAccess: true,
          priorityMatching: true,
          whatsappAccess: true,
          verifiedBadge: true,
          proBadge: true,
          premiumBadge: false,
          dedicatedSupport: false,
        },
        isActive: true,
        displayOrder: 3,
      },
      {
        name: "Premium",
        slug: "premium",
        price: 1499,
        durationDays: 30,
        monthlyCredits: 75,
        priorityScore: 100,
        features: {
          featuredProfile: true,
          contactAccess: true,
          analyticsAccess: true,
          priorityMatching: true,
          whatsappAccess: true,
          verifiedBadge: true,
          proBadge: false,
          premiumBadge: true,
          dedicatedSupport: true,
        },
        isActive: true,
        displayOrder: 4,
      },
    ];

    for (const planData of plans) {
      await SubscriptionPlan.findOneAndUpdate({ slug: planData.slug }, planData, {
        upsert: true,
        new: true,
      });
    }

    console.log("✅ Default subscription plans seeded successfully");
  }

  /**
   * Get membership badge information for display
   */
  getMembershipBadge(
    membershipType: string,
    currentPlanSlug: string,
    revenueSharePercentage?: number
  ): { 
    label: string; 
    icon: string; 
    color: string; 
    bgColor: string;
    borderColor: string;
  } {
    if (membershipType === "revenue_share") {
      return {
        label: "Revenue Share",
        icon: "🤝",
        color: "text-emerald-700",
        bgColor: "bg-emerald-100",
        borderColor: "border-emerald-200",
      };
    }

    // Subscription badges
    const badges: Record<string, any> = {
      free: {
        label: "Free",
        icon: "⚡",
        color: "text-slate-600",
        bgColor: "bg-slate-100",
        borderColor: "border-slate-200",
      },
      starter: {
        label: "Starter",
        icon: "⭐",
        color: "text-blue-700",
        bgColor: "bg-blue-100",
        borderColor: "border-blue-200",
      },
      pro: {
        label: "Pro",
        icon: "✨",
        color: "text-purple-700",
        bgColor: "bg-purple-100",
        borderColor: "border-purple-200",
      },
      premium: {
        label: "Premium",
        icon: "👑",
        color: "text-amber-700",
        bgColor: "bg-amber-100",
        borderColor: "border-amber-200",
      },
    };

    return badges[currentPlanSlug] || badges.free;
  }
}

export default new SubscriptionService();
