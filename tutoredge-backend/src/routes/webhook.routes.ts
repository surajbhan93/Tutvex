import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import monetizationService from "../services/monetization.service";

export default async function webhookRoutes(fastify: FastifyInstance) {
  /**
   * POST /webhook/razorpay - Handle Razorpay webhooks
   * NOTE: Signature verification should ideally use raw body,
   * but Fastify parses JSON by default. Using stringified body as workaround.
   */
  fastify.post(
    "/razorpay",
    async (req: FastifyRequest<{ Body: any }>, reply: FastifyReply) => {
      try {
        const signature = req.headers["x-razorpay-signature"] as string;

        if (!signature) {
          return reply.status(400).send({ success: false, message: "Missing signature" });
        }

        // Use stringified body for signature verification
        const rawBody = JSON.stringify(req.body);
        const result = await monetizationService.handleWebhook(req.body, signature, rawBody);
        reply.status(200).send(result);
      } catch (error: any) {
        console.error("Webhook error:", error);
        reply.status(400).send({ success: false, message: error.message });
      }
    }
  );
}
