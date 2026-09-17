import razorpayService from "./razorpay.service";
import subscriptionService from "./subscription.service";
import walletService from "./wallet.service";
import { Types } from "mongoose";

/**
 * Monetization Service - Handles all payment flows
 */
export class MonetizationService {
  /**
   * Create order for subscription purchase
   */
  async createSubscriptionOrder(tutorId: string, planSlug: string): Promise<any> {
    const plan = await subscriptionService.getPlanBySlug(planSlug);
    if (!plan) {
      throw new Error("Subscription plan not found");
    }

    if (plan.price === 0) {
      throw new Error("Free plan cannot be purchased. Use activation endpoint.");
    }

    const order = await razorpayService.createSubscriptionOrder(plan.price, tutorId, planSlug);

    return {
      orderId: order.id,
      amount: plan.price,
      currency: "INR",
      planName: plan.name,
      planSlug: plan.slug,
      razorpayKeyId: process.env.RAZORPAY_KEY,
    };
  }

  /**
   * Verify and activate subscription after payment
   */
  async verifyAndActivateSubscription(
    tutorId: string,
    planSlug: string,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<any> {
    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      throw new Error("Payment verification failed. Invalid signature.");
    }

    // Activate subscription
    const subscription = await subscriptionService.activatePaidSubscription(
      tutorId,
      planSlug,
      razorpayPaymentId,
      razorpayOrderId
    );

    return {
      success: true,
      subscription,
      message: "Subscription activated successfully",
    };
  }

  /**
   * Create order for credit purchase
   */
  async createCreditPurchaseOrder(tutorId: string, packageType: string): Promise<any> {
    const packages: any = {
      basic: { credits: 10, price: 199 },
      standard: { credits: 30, price: 499 },
      premium: { credits: 75, price: 999 },
      enterprise: { credits: 150, price: 1799 },
    };

    const selectedPackage = packages[packageType];
    if (!selectedPackage) {
      throw new Error("Invalid credit package");
    }

    const order = await razorpayService.createCreditPurchaseOrder(
      selectedPackage.price,
      tutorId,
      selectedPackage.credits
    );

    return {
      orderId: order.id,
      amount: selectedPackage.price,
      credits: selectedPackage.credits,
      currency: "INR",
      packageType,
      razorpayKeyId: process.env.RAZORPAY_KEY,
    };
  }

  /**
   * Verify and add credits after payment
   */
  async verifyAndAddCredits(
    tutorId: string,
    credits: number,
    amount: number,
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<any> {
    // Verify signature
    const isValid = razorpayService.verifyPaymentSignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (!isValid) {
      throw new Error("Payment verification failed. Invalid signature.");
    }

    // Add credits to wallet
    const result = await walletService.purchaseCredits(
      tutorId,
      credits,
      amount,
      razorpayPaymentId,
      razorpayOrderId
    );

    return {
      success: true,
      wallet: result.wallet,
      transaction: result.transaction,
      message: `${credits} credits added successfully`,
    };
  }

  /**
   * Handle Razorpay webhook
   */
  async handleWebhook(body: any, signature: string, rawBody?: string): Promise<any> {
    // Use raw body for signature verification if available, otherwise stringify
    const bodyString = rawBody || JSON.stringify(body);
    const isValid = razorpayService.verifyWebhookSignature(bodyString, signature);

    if (!isValid) {
      throw new Error("Invalid webhook signature");
    }

    const event = body.event;
    const payload = body.payload;

    switch (event) {
      case "payment.captured":
        return await this.handlePaymentCaptured(payload.payment.entity);

      case "payment.failed":
        return await this.handlePaymentFailed(payload.payment.entity);

      case "subscription.charged":
        return await this.handleSubscriptionCharged(payload.subscription.entity);

      case "subscription.cancelled":
        return await this.handleSubscriptionCancelled(payload.subscription.entity);

      default:
        console.log(`Unhandled webhook event: ${event}`);
        return { received: true };
    }
  }

  /**
   * Handle payment captured event
   */
  private async handlePaymentCaptured(payment: any): Promise<any> {
    console.log("Payment captured:", payment.id);
    // Additional logic if needed (e.g., send email notification)
    return { received: true };
  }

  /**
   * Handle payment failed event
   */
  private async handlePaymentFailed(payment: any): Promise<any> {
    console.log("Payment failed:", payment.id);
    // Additional logic (e.g., notify user)
    return { received: true };
  }

  /**
   * Handle subscription charged event (for recurring payments)
   */
  private async handleSubscriptionCharged(subscription: any): Promise<any> {
    console.log("Subscription charged:", subscription.id);
    // Auto-renew logic if needed
    return { received: true };
  }

  /**
   * Handle subscription cancelled event
   */
  private async handleSubscriptionCancelled(subscription: any): Promise<any> {
    console.log("Subscription cancelled:", subscription.id);
    // Update subscription status
    return { received: true };
  }

  /**
   * Process refund
   */
  async processRefund(paymentId: string, amount?: number): Promise<any> {
    const refund = await razorpayService.createRefund(paymentId, amount);
    return {
      success: true,
      refund,
      message: "Refund processed successfully",
    };
  }

  /**
   * Get payment details
   */
  async getPaymentDetails(paymentId: string): Promise<any> {
    return await razorpayService.getPaymentDetails(paymentId);
  }
}

export default new MonetizationService();
