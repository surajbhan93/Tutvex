// import { FastifyReply, FastifyRequest } from "fastify";
// import { verifyJwt } from "../utils/jwt";

// export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) throw new Error("Missing Authorization header");

//     const token = authHeader.split(" ")[1];
//     const decoded = verifyJwt(token);
//     (req as any).user = decoded;
//   } catch (err: any) {
//     reply.status(401).send({ error: "Unauthorized" });
//   }
// }

// export function roleMiddleware(roles: string[]) {
//   return async (req: FastifyRequest, reply: FastifyReply) => {
//     const user = (req as any).user;
//     if (!user || !roles.includes(user.role)) {
//       return reply.status(403).send({ error: "Forbidden" });
//     }
//   };
// }

import { FastifyReply, FastifyRequest } from "fastify";
import { verifyJwt } from "../utils/jwt";

export async function authMiddleware(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = verifyJwt(token);

    (req as any).user = {
      id: decoded.id,
      role: decoded.role,
       fullName: decoded.fullName, // ⭐ ADD THIS
    };

    return; // ✅ IMPORTANT
  } catch (err) {
    return reply.status(401).send({ error: "Unauthorized" });
  }
}

export function roleMiddleware(roles: string[]) {
  return async (req: FastifyRequest, reply: FastifyReply) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return reply.status(403).send({ error: "Forbidden" });
    }
  };
}
