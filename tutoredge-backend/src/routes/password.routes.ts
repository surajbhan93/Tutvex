import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";

const authController = new AuthController();

export default async function passwordRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/auth/forgot-password",
    authController.forgotPassword.bind(authController)
  );

  fastify.post(
    "/auth/reset-password",
    authController.resetPassword.bind(authController)
  );
}
