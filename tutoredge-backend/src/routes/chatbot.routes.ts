import { FastifyInstance } from "fastify";
import { ChatbotController } from "../controllers/chatbot.controller";

export default async function chatbotRoutes(app: FastifyInstance) {
  const controller = new ChatbotController();

  app.post(
    "/chatbot/ask",
    controller.askChatbot.bind(controller) // 🔥 VERY IMPORTANT
  );
}
