import { FastifyRequest, FastifyReply } from "fastify";
import Contact from "../models/Contact";

export class ContactController {

  // 🔥 CREATE CONTACT
  async createContact(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const { name, email, phone, message } = req.body as any;

    if (!name || !email || !message) {
      return reply.status(400).send({
        success: false,
        message: "Name, email and message are required",
      });
    }

    const contact = await Contact.create({
      name,
      email,
      phone,
      message,
    });

    return reply.send({
      success: true,
      message: "Message sent successfully",
      data: contact,
    });
  }

  // 🔥 ADMIN: GET ALL CONTACTS
  async getAllContacts(
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return reply.send({
      success: true,
      data: contacts,
    });
  }
}
