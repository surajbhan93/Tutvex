import { FastifyInstance } from "fastify";
import { ContactController } from "../controllers/contact.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const controller = new ContactController();

export default async function contactRoutes(app: FastifyInstance) {

  // 🔥 PUBLIC: Submit contact form
  app.post(
    "/contact",
    controller.createContact.bind(controller)
  );

  // 🔥 ADMIN: View contacts
  app.get(
    "/admin/contacts",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    controller.getAllContacts.bind(controller)
  );
}
