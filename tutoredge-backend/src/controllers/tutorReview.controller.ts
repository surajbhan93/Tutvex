import { FastifyReply, FastifyRequest } from "fastify";
import TutorReview from "../models/TutorReview";
import User from "../models/User";

// ⭐ POST: Parent adds review
export async function addTutorReview(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = (req as any).user;

  if (!user || user.role !== "parent") {
    return reply.status(403).send({ error: "Only parents can review tutors" });
  }

  const { tutorId, rating, comment } = req.body as any;

  if (!tutorId || !rating || !comment) {
    return reply.status(400).send({ error: "Missing fields" });
  }

  // ❌ Prevent duplicate review
  const exists = await TutorReview.findOne({
    tutor: tutorId,
    parent: user.id,
  });
  if (exists) {
    return reply
      .status(400)
      .send({ error: "You already reviewed this tutor" });
  }

  // ✅ Save review
  await TutorReview.create({
    tutor: tutorId,
    parent: user.id,
    rating,
    comment,
  });

  // 🔥 Recalculate tutor rating
  const stats = await TutorReview.aggregate([
    { $match: { tutor: new (require("mongoose")).Types.ObjectId(tutorId) } },
    {
      $group: {
        _id: "$tutor",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length) {
    await User.findByIdAndUpdate(tutorId, {
      rating: Number(stats[0].avgRating.toFixed(1)),
      totalReviews: stats[0].totalReviews,
    });
  }

  return reply.send({ message: "Review submitted successfully" });
}

// 🌍 GET: Public reviews of tutor
export async function getTutorReviews(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { tutorId } = req.params as any;

    const reviews = await TutorReview.find({ tutor: tutorId })
      .populate("parent", "fullName profileImage")
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({
      success: true,
      data: reviews, // ✅ frontend expects this
    });
  } catch (err) {
    console.error(err);
    return reply.status(500).send({ error: "Failed to fetch reviews" });
  }
}

