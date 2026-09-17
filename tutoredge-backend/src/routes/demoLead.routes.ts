import { FastifyInstance } from "fastify";
import { DemoLeadController } from "../controllers/demoLead.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const controller = new DemoLeadController();

export default async function demoLeadRoutes(app: FastifyInstance) {
  // 🔥 PUBLIC: Submit demo booking form
  app.post(
    "/book-demo",
    controller.createDemoLead.bind(controller)
  );

  app.post(
    "/demo-leads",
    controller.createDemoLead.bind(controller)
  );

  // 🔥 ADMIN: View all demo leads
  app.get(
    "/admin/demo-leads",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    controller.getAllDemoLeads.bind(controller)
  );

  // 🔥 ADMIN: View lead stats & analytics
  app.get(
    "/admin/demo-leads/stats",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    controller.getDemoLeadStats.bind(controller)
  );

  // 🔥 ADMIN: Update lead status & assigned counselor
  app.patch(
    "/admin/demo-leads/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    controller.updateDemoLeadStatus.bind(controller)
  );

  // 🔥 ADMIN: Delete demo lead
  app.delete(
    "/admin/demo-leads/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    controller.deleteDemoLead.bind(controller)
  );
}
