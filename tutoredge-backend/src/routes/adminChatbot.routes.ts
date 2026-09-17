import { FastifyInstance } from "fastify";
import { AdminChatbotController } from "../controllers/adminChatbot.controller";

export default async function adminChatbotRoutes(app: FastifyInstance) {
  const controller = new AdminChatbotController();

  app.get(
    "/leads",
    controller.getAllLeads.bind(controller)
  );

  app.get(
    "/chat/:sessionId",
    controller.getChatBySession.bind(controller)
  );

  app.get(
    "/search",
    controller.searchByPhone.bind(controller)
  );
}
