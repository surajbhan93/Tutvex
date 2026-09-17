import { FastifyRequest, FastifyReply } from "fastify";

export async function adminOnly(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const user = (req as any).user;

  if (!user || user.role !== "admin") {
    return reply.status(403).send({ error: "Admin access only" });
  }
}
