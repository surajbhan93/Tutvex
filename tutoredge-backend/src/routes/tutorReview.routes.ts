import { FastifyInstance } from "fastify";
import { authMiddleware } from "../middlewares/auth";
import {
  addTutorReview,
  getTutorReviews,
} from "../controllers/tutorReview.controller";

export default async function tutorReviewRoutes(app: FastifyInstance) {
  app.post(
    "/tutors/:tutorId/reviews",
    { preHandler: authMiddleware },
    addTutorReview
  );

  app.get(
    "/tutors/:tutorId/reviews",
    getTutorReviews
  );
}
