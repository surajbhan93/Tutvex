import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export default async function healthRoutes(fastify: FastifyInstance) {
  // Basic health check
  fastify.get("/health", async (req: FastifyRequest, reply: FastifyReply) => {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || "development",
      version: "1.0.0",
      cors: {
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || []
      }
    };
  });

  // Simple route test
  fastify.get("/health/test", async (req: FastifyRequest, reply: FastifyReply) => {
    return {
      message: "Health routes working!",
      leadRoutesRegistered: true
    };
  });
}
