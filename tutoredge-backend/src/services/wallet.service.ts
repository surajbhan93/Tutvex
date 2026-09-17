import TutorWallet, { ITutorWallet } from "../models/TutorWallet";
import WalletTransaction, { IWalletTransaction } from "../models/WalletTransaction";
import LeadCreditWallet from "../models/LeadCreditWallet";
import CreditTransaction from "../models/CreditTransaction";
import TutorConversion from "../models/TutorConversion";
import { Types } from "mongoose";

export class WalletService {
  /**
   * Get or create tutor wallet
   */
  async getTutorWallet(tutorId: string): Promise<ITutorWallet> {
    let wallet = await TutorWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });

    if (!wallet) {
      wallet = await TutorWallet.create({
        tutorId: new Types.ObjectId(tutorId),
        availableBalance: 0,
        pendingSettlement: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        totalCommissionPaid: 0,
      });
    }

    return wallet;
  }

  /**
   * Get wallet transactions
   */
  async getWalletTransactions(
    tutorId: string,
    limit: number = 50
  ): Promise<IWalletTransaction[]> {
    return await WalletTransaction.find({ tutorId: new Types.ObjectId(tutorId) })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Add student payment to wallet (when student pays tutor)
   */
  async addStudentPayment(
    tutorId: string,
    conversionId: string,
    amount: number,
    commissionPercentage: number = 10
  ): Promise<IWalletTransaction> {
    const wallet = await this.getTutorWallet(tutorId);

    const commissionAmount = (amount * commissionPercentage) / 100;
    const tutorAmount = amount - commissionAmount;

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore + tutorAmount;

    // Update wallet
    wallet.availableBalance = balanceAfter;
    wallet.totalEarned += tutorAmount;
    wallet.totalCommissionPaid += commissionAmount;
    await wallet.save();

    // Create transaction
    const transaction = await WalletTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount: tutorAmount,
      transactionType: "student_payment",
      status: "completed",
      referenceId: conversionId,
      description: `Student payment (${amount} - ${commissionPercentage}% commission)`,
      balanceBefore,
      balanceAfter,
      metadata: {
        grossAmount: amount,
        commissionAmount,
        commissionPercentage,
      },
    });

    // Also create commission deduction transaction for transparency
    await WalletTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount: -commissionAmount,
      transactionType: "commission_deduction",
      status: "completed",
      referenceId: conversionId,
      description: `Platform commission (${commissionPercentage}%)`,
      balanceBefore: amount,
      balanceAfter: tutorAmount,
      metadata: {
        grossAmount: amount,
        commissionPercentage,
      },
    });

    return transaction;
  }

  /**
   * Process withdrawal request
   */
  async processWithdrawal(
    tutorId: string,
    amount: number,
    bankDetails: any
  ): Promise<IWalletTransaction> {
    const wallet = await this.getTutorWallet(tutorId);

    if (wallet.availableBalance < amount) {
      throw new Error("Insufficient balance for withdrawal");
    }

    if (amount < 100) {
      throw new Error("Minimum withdrawal amount is ₹100");
    }

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore - amount;

    // Update wallet
    wallet.availableBalance = balanceAfter;
    wallet.totalWithdrawn += amount;
    wallet.lastWithdrawalAt = new Date();
    await wallet.save();

    // Create transaction
    const transaction = await WalletTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount: -amount,
      transactionType: "withdrawal",
      status: "pending", // Admin needs to approve
      description: `Withdrawal request`,
      balanceBefore,
      balanceAfter,
      metadata: {
        bankDetails,
        requestedAt: new Date(),
      },
    });

    return transaction;
  }

  /**
   * Admin: Approve withdrawal
   */
  async approveWithdrawal(transactionId: string, paymentProof?: string): Promise<IWalletTransaction> {
    const transaction = await WalletTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.transactionType !== "withdrawal") {
      throw new Error("Not a withdrawal transaction");
    }

    transaction.status = "completed";
    transaction.metadata = {
      ...transaction.metadata,
      approvedAt: new Date(),
      paymentProof,
    };
    await transaction.save();

    return transaction;
  }

  /**
   * Admin: Reject withdrawal (refund to wallet)
   */
  async rejectWithdrawal(transactionId: string, reason: string): Promise<IWalletTransaction> {
    const transaction = await WalletTransaction.findById(transactionId);
    if (!transaction) {
      throw new Error("Transaction not found");
    }

    if (transaction.transactionType !== "withdrawal") {
      throw new Error("Not a withdrawal transaction");
    }

    // Refund to wallet
    const wallet = await this.getTutorWallet(transaction.tutorId.toString());
    wallet.availableBalance += Math.abs(transaction.amount);
    wallet.totalWithdrawn -= Math.abs(transaction.amount);
    await wallet.save();

    transaction.status = "cancelled";
    transaction.metadata = {
      ...transaction.metadata,
      rejectedAt: new Date(),
      rejectionReason: reason,
    };
    await transaction.save();

    return transaction;
  }

  /**
   * Add bonus to tutor wallet
   */
  async addBonus(
    tutorId: string,
    amount: number,
    reason: string
  ): Promise<IWalletTransaction> {
    const wallet = await this.getTutorWallet(tutorId);

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore + amount;

    wallet.availableBalance = balanceAfter;
    wallet.totalEarned += amount;
    await wallet.save();

    const transaction = await WalletTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount,
      transactionType: "bonus",
      status: "completed",
      description: reason,
      balanceBefore,
      balanceAfter,
    });

    return transaction;
  }

  /**
   * Admin adjustment (can be positive or negative)
   */
  async adminAdjustment(
    tutorId: string,
    amount: number,
    reason: string
  ): Promise<IWalletTransaction> {
    const wallet = await this.getTutorWallet(tutorId);

    const balanceBefore = wallet.availableBalance;
    const balanceAfter = balanceBefore + amount;

    wallet.availableBalance = balanceAfter;
    if (amount > 0) {
      wallet.totalEarned += amount;
    }
    await wallet.save();

    const transaction = await WalletTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount,
      transactionType: "admin_adjustment",
      status: "completed",
      description: reason,
      balanceBefore,
      balanceAfter,
    });

    return transaction;
  }

  /**
   * Get credit wallet
   */
  async getCreditWallet(tutorId: string): Promise<any> {
    let wallet = await LeadCreditWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });

    if (!wallet) {
      wallet = await LeadCreditWallet.create({
        tutorId: new Types.ObjectId(tutorId),
        availableCredits: 3, // Free credits
        usedCredits: 0,
        totalEarned: 3,
        totalPurchased: 0,
      });
    }

    return wallet;
  }

  /**
   * Purchase credits (after successful payment)
   */
  async purchaseCredits(
    tutorId: string,
    credits: number,
    amount: number,
    razorpayPaymentId: string,
    razorpayOrderId: string
  ): Promise<any> {
    // ✅ IDEMPOTENCY: Check if payment already processed
    const existingTransaction = await CreditTransaction.findOne({
      razorpayPaymentId,
      tutorId: new Types.ObjectId(tutorId),
      transactionType: "purchase",
    });

    if (existingTransaction) {
      console.log(`Payment ${razorpayPaymentId} already processed for tutor ${tutorId}`);
      const wallet = await LeadCreditWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });
      return { wallet, transaction: existingTransaction };
    }

    const wallet = await LeadCreditWallet.findOne({ tutorId: new Types.ObjectId(tutorId) });
    if (!wallet) {
      throw new Error("Credit wallet not found");
    }

    wallet.availableCredits += credits;
    wallet.totalPurchased += credits;
    wallet.lastCreditAddedAt = new Date();
    await wallet.save();

    // Record transaction
    const transaction = await CreditTransaction.create({
      tutorId: new Types.ObjectId(tutorId),
      amount,
      credits,
      transactionType: "purchase",
      status: "completed",
      description: `Purchased ${credits} credits for ₹${amount}`,
      razorpayPaymentId,
      razorpayOrderId,
    });

    return { wallet, transaction };
  }

  /**
   * Get credit transactions
   */
  async getCreditTransactions(
    tutorId: string,
    limit: number = 50
  ): Promise<any[]> {
    return await CreditTransaction.find({ tutorId: new Types.ObjectId(tutorId) })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Get tutor earnings summary
   */
  async getEarningsSummary(tutorId: string): Promise<any> {
    const wallet = await this.getTutorWallet(tutorId);
    const creditWallet = await this.getCreditWallet(tutorId);

    const activeConversions = await TutorConversion.countDocuments({
      tutorId: new Types.ObjectId(tutorId),
      status: "active",
    });

    const totalConversions = await TutorConversion.countDocuments({
      tutorId: new Types.ObjectId(tutorId),
    });

    const recentTransactions = await WalletTransaction.find({
      tutorId: new Types.ObjectId(tutorId),
    })
      .sort({ createdAt: -1 })
      .limit(5);

    return {
      wallet: {
        availableBalance: wallet.availableBalance,
        pendingSettlement: wallet.pendingSettlement,
        totalEarned: wallet.totalEarned,
        totalWithdrawn: wallet.totalWithdrawn,
        totalCommissionPaid: wallet.totalCommissionPaid,
      },
      credits: {
        available: creditWallet.availableCredits,
        used: creditWallet.usedCredits,
        totalEarned: creditWallet.totalEarned,
        totalPurchased: creditWallet.totalPurchased,
      },
      conversions: {
        active: activeConversions,
        total: totalConversions,
      },
      recentTransactions,
    };
  }

  /**
   * Admin: Get pending withdrawals
   */
  async getPendingWithdrawals(): Promise<IWalletTransaction[]> {
    return await WalletTransaction.find({
      transactionType: "withdrawal",
      status: "pending",
    })
      .populate("tutorId", "fullName email phone")
      .sort({ createdAt: 1 });
  }

  /**
   * Admin: Get all wallet stats
   */
  async getAdminWalletStats(): Promise<any> {
    const totalTutorBalance = await TutorWallet.aggregate([
      {
        $group: {
          _id: null,
          totalAvailable: { $sum: "$availableBalance" },
          totalEarned: { $sum: "$totalEarned" },
          totalWithdrawn: { $sum: "$totalWithdrawn" },
          totalCommission: { $sum: "$totalCommissionPaid" },
        },
      },
    ]);

    const pendingWithdrawals = await WalletTransaction.aggregate([
      {
        $match: {
          transactionType: "withdrawal",
          status: "pending",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          totalAmount: { $sum: { $abs: "$amount" } },
        },
      },
    ]);

    return {
      tutorBalances: totalTutorBalance[0] || {
        totalAvailable: 0,
        totalEarned: 0,
        totalWithdrawn: 0,
        totalCommission: 0,
      },
      pendingWithdrawals: pendingWithdrawals[0] || { count: 0, totalAmount: 0 },
    };
  }
}

export default new WalletService();
