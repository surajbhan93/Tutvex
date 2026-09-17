import { FastifyReply, FastifyRequest } from "fastify";
import ChatbotLead, {
  IChatbotLead,
} from "../models/ChatbotLead.model";
import ChatbotMessage from "../models/ChatbotMessage.model";

export class AdminChatbotController {
  /**
   * 🔹 Get all chatbot leads
   */
  async getAllLeads(
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    const leads = await ChatbotLead.find()
      .sort({ createdAt: -1 })
      .lean<IChatbotLead[]>();

    return reply.send({
      success: true,
      data: leads,
    });
  }

  /**
   * 🔹 Get full chat by sessionId
   */
  async getChatBySession(
    request: FastifyRequest<{ Params: { sessionId: string } }>,
    reply: FastifyReply
  ) {
    const { sessionId } = request.params;

    const lead = await ChatbotLead.findOne({ sessionId })
      .lean<IChatbotLead>();

    if (!lead) {
      return reply.status(404).send({
        success: false,
        message: "Chat session not found",
      });
    }

    const chats = await ChatbotMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .lean();

    return reply.send({
      success: true,
      lead,
      chats,
    });
  }

  /**
   * 🔹 Search chat by phone number
   */
  async searchByPhone(
    request: FastifyRequest<{ Querystring: { phone: string } }>,
    reply: FastifyReply
  ) {
    const { phone } = request.query;

    const lead = await ChatbotLead.findOne({ phone })
      .lean<IChatbotLead>();

    if (!lead) {
      return reply.status(404).send({
        success: false,
        message: "No record found",
      });
    }

    const chats = await ChatbotMessage.find({
      sessionId: lead.sessionId,
    }).lean();

    return reply.send({
      success: true,
      lead,
      chats,
    });
  }
}
