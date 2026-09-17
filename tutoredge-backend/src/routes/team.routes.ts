import { FastifyInstance } from "fastify";
import { TeamController } from "../controllers/team.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const controller = new TeamController();

export default async function teamRoutes(app: FastifyInstance) {

  // 🔥 PUBLIC
  app.get("/team", controller.getAllTeam);

  // 🔥 ADMIN
  app.post(
    "/admin/team",
    { preHandler: [authMiddleware, roleMiddleware(["admin"])] },
    controller.createTeam
  );

app.put<{ Params: { id: string } }>(
    "/admin/team/:id",
    { preHandler: [authMiddleware, roleMiddleware(["admin"])] },
    controller.updateTeam
  );

  app.delete<{ Params: { id: string } }>(
    "/admin/team/:id",
    { preHandler: [authMiddleware, roleMiddleware(["admin"])] },
    controller.deleteTeam
  );
  
}
