import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth";

const userController = new UserController();

export default async function userRoutes(app: FastifyInstance) {
  app.get(
    "/me",
    { preHandler: [authMiddleware] },
    (req, reply) => userController.getMe(req, reply)
  );
}
