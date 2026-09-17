import { FastifyReply, FastifyRequest } from "fastify";
import Testimonial from "../models/Testimonial";
import User from "../models/User"; // ✅ ADD THIS

export class TestimonialController {

  // ✅ POST /testimonials (Logged-in user)
 async create(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;

    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const { rating, message } = req.body as any;

    if (!rating || !message) {
      return reply.status(400).send({ error: "Missing fields" });
    }

    // 🔥 IMPORTANT FIX: DB se name lao
    const dbUser = await User.findById(user.id).select("fullName").lean();

    if (!dbUser) {
      return reply.status(404).send({ error: "User not found" });
    }

    const testimonial = await Testimonial.create({
      user: user.id,
      role: user.role,
      name: dbUser.fullName, // ✅ GUARANTEED
      rating,
      message,
    });

    return reply.status(201).send({
      message: "Testimonial submitted for review",
      data: testimonial,
    });
  }

  // 🌍 GET /testimonials (Public – approved only)
async getPublic(req: FastifyRequest, reply: FastifyReply) {
  const testimonials = await Testimonial.find({
    isApproved: true,
  })
    .populate({
      path: "user",
      select: "fullName profileImage",
    })
    .sort({ createdAt: -1 })
    .lean();

  const formatted = testimonials.map((t: any) => ({
    _id: t._id,
    name: t.name,
    role: t.role,
    rating: t.rating,
    message: t.message,
    image: t.user?.profileImage || null,
    date: t.createdAt, // ✅ DATE ADDED
  }));

  return reply.send({ data: formatted });
}


  // 🛡️ GET /admin/testimonials
  async getAll(req: FastifyRequest, reply: FastifyReply) {
    const testimonials = await Testimonial.find()
      .sort({ createdAt: -1 })
      .lean();

    return reply.send({ data: testimonials });
  }

  // ✅ PATCH /admin/testimonials/:id/approve
  async approve(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!updated) {
      return reply.status(404).send({ error: "Not found" });
    }

    return reply.send({ message: "Testimonial approved" });
  }

  // ⭐ PATCH /admin/testimonials/:id/feature
  async feature(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;

    const updated = await Testimonial.findByIdAndUpdate(
      id,
      { isFeatured: true },
      { new: true }
    );

    if (!updated) {
      return reply.status(404).send({ error: "Not found" });
    }

    return reply.send({ message: "Marked as featured" });
  }

  // 🗑️ DELETE /admin/testimonials/:id
  async remove(req: FastifyRequest, reply: FastifyReply) {
    const { id } = req.params as any;

    await Testimonial.findByIdAndDelete(id);
    return reply.send({ message: "Testimonial deleted" });
  }
}
