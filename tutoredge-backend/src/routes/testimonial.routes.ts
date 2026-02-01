import { FastifyInstance } from "fastify";
import { TestimonialController } from "../controllers/testimonial.controller";
import { authMiddleware } from "../middlewares/auth";

import { adminOnly } from "../middlewares/adminOnly";

export default async function testimonialRoutes(app: FastifyInstance) {
  const controller = new TestimonialController();

  // Public
  app.get("/testimonials", controller.getPublic);

  // User
  app.post(
    "/testimonials",
    { preHandler: [authMiddleware] },
    controller.create
  );

  // Admin
  app.get(
    "/admin/testimonials",
    { preHandler: [authMiddleware, adminOnly] },
    controller.getAll
  );

  app.patch(
    "/admin/testimonials/:id/approve",
    { preHandler: [authMiddleware, adminOnly] },
    controller.approve
  );

  app.patch(
    "/admin/testimonials/:id/feature",
    { preHandler: [authMiddleware, adminOnly] },
    controller.feature
  );

  app.delete(
    "/admin/testimonials/:id",
    { preHandler: [authMiddleware, adminOnly] },
    controller.remove
  );
}
