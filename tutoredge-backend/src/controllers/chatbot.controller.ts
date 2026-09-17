import { FastifyReply, FastifyRequest } from "fastify";
import { getChatbotReply } from "../services/chatbot.service";
import ChatbotMessage from "../models/ChatbotMessage.model";

interface ChatbotRequest {
  Body: {
    message: string;
    sessionId: string;
  };
}
export class ChatbotController {
  async askChatbot(
    request: FastifyRequest<ChatbotRequest>,
    reply: FastifyReply
  ) {
    const { message, sessionId } = request.body;
    if (!sessionId) {
      return reply.code(400).send({
        success: false,
        message: "sessionId is required",
      });
    }
    // Save USER message
    if (message) {
      await ChatbotMessage.create({
        sessionId,
        sender: "user",
        message,
      });
    }
    const botReply = await getChatbotReply({ message, sessionId });
    // Save BOT message
    await ChatbotMessage.create({
      sessionId,
      sender: "bot",
      message: botReply,
    });
    return reply.send({
      success: true,
      reply: botReply,
    });
  }
}
