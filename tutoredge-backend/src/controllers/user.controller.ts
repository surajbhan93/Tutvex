import { FastifyReply, FastifyRequest } from "fastify";
import User from "../models/User";
import Student from "../models/Student";

export class UserController {
  async getMe(req: FastifyRequest, reply: FastifyReply) {
    const user = (req as any).user;

    if (!user) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const dbUser = await User.findById(user.id)
      .select("-password")
      .lean();

    if (!dbUser) {
      return reply.status(404).send({ error: "User not found" });
    }

    // 🔥 Fetch students separately
    const students = await Student.find({
      parent_id: dbUser._id,
    })
      .select("full_name class_grade")
      .lean();

    return reply.send({
      _id: dbUser._id,
      fullName: dbUser.fullName,
      role: dbUser.role,
      status: dbUser.status,

      students,                // ✅ real students array
      notificationsCount: 3    // dummy for now
    });
  }
}
