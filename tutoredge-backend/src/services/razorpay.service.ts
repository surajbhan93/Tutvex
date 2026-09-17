import Razorpay from "razorpay";
import crypto from "crypto";

if (!process.env.RAZORPAY_KEY || !process.env.RAZORPAY_SECRET) {
  throw new Error("Razorpay env variables are missing");
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export class RazorpayService {
  /**
   * Create order for subscription payment
   */
  async createSubscriptionOrder(
    amount: number,
    tutorId: string,
    planSlug: string
  ): Promise<any> {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `sub_${tutorId}_${Date.now()}`,
      notes: {
        tutorId,
        planSlug,
        type: "subscription",
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  }

  /**
   * Create order for credit purchase
   */
  async createCreditPurchaseOrder(
    amount: number,
    tutorId: string,
    credits: number
  ): Promise<any> {
    const options = {
      amount: amount * 100, // Convert to paise
      currency: "INR",
      receipt: `credit_${tutorId}_${Date.now()}`,
      notes: {
        tutorId,
        credits: credits.toString(),
        type: "credit_purchase",
      },
    };

    const order = await razorpay.orders.create(options);
    return order;
  }

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): boolean {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(text)
      .digest("hex");

    return generated_signature === razorpaySignature;
  }

  /**
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string): boolean {
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    return expectedSignature === signature;
  }

  /**
   * Fetch payment details
   */
  async getPaymentDetails(paymentId: string): Promise<any> {
    return await razorpay.payments.fetch(paymentId);
  }

  /**
   * Fetch order details
   */
  async getOrderDetails(orderId: string): Promise<any> {
    return await razorpay.orders.fetch(orderId);
  }

  /**
   * Create refund
   */
  async createRefund(paymentId: string, amount?: number): Promise<any> {
    const options: any = { payment_id: paymentId };
    if (amount) {
      options.amount = amount * 100; // Convert to paise
    }
    return await razorpay.payments.refund(paymentId, options);
  }

  /**
   * Create subscription (for recurring payments - optional)
   */
  async createSubscription(planId: string, customerId: string, totalCount: number): Promise<any> {
    const options = {
      plan_id: planId,
      customer_notify: 1 as 0 | 1,
      total_count: totalCount,
      notes: {
        customerId,
      },
    };

    return await razorpay.subscriptions.create(options);
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<any> {
    return await razorpay.subscriptions.cancel(subscriptionId);
  }

  /**
   * Get Razorpay instance (for direct access if needed)
   */
  getInstance(): Razorpay {
    return razorpay;
  }
}

export default new RazorpayService();
