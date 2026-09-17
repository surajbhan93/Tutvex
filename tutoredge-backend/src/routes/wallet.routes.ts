import { FastifyInstance } from "fastify";
import { walletController } from "../controllers/wallet.controller";
import { authMiddleware } from "../middlewares/auth";

export default async function walletRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("preHandler", authMiddleware);

  // Wallet balance and transactions
  fastify.get("/balance", walletController.getWalletBalance);
  fastify.get("/transactions", walletController.getWalletTransactions);
  fastify.post("/withdraw", walletController.requestWithdrawal);

  // Credit wallet
  fastify.get("/credits", walletController.getCreditWallet);
  fastify.get("/credit-transactions", walletController.getCreditTransactions);

  // Credit purchase
  fastify.post("/credits/create-order", walletController.createCreditOrder);
  fastify.post("/credits/verify-payment", walletController.verifyAndAddCredits);

  // Summary
  fastify.get("/summary", walletController.getEarningsSummary);
}
