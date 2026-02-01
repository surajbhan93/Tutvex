import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/auth.service";
const authService = new AuthService();
import User, { IUser } from "../models/User";
export class AuthController {
  // 🔹 Admin Login
  async adminLogin(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { username, password } = req.body as any;
      const result = await authService.loginAdmin(username, password);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  // 🔹 Parent Signup
  // async parentSignup(req: FastifyRequest, reply: FastifyReply) {
  //   try {
  //     const user = await authService.signupParent(req.body as any);
  //     return reply.code(201).send(user);
  //   } catch (err: any) {
  //     return reply.status(400).send({ error: err.message });
  //   }
  // }
  // with auth singup time 
  async parentSignup(req: FastifyRequest, reply: FastifyReply) {
  try {
    const result = await authService.signupParent(req.body as any);
    return reply.code(201).send(result); // { user, token }
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}


  // 🔹 Parent Login
  async parentLogin(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = req.body as any;
      const result = await authService.loginParent(email, password);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  // 🔹 Tutor Signup
  async tutorSignup(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = await authService.signupTutor(req.body as any);
      return reply.code(201).send(user);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  // 🔹 Tutor Login
  async tutorLogin(req: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = req.body as any;
      const result = await authService.loginTutor(email, password);
      return reply.send(result);
    } catch (err: any) {
      return reply.status(400).send({ error: err.message });
    }
  }

  // 🔹 Get Tutor Applications (Admin only)
  async getTutorApplications(req: FastifyRequest, reply: FastifyReply) {
    try {
      const user = (req as any).user;
      if (!user) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      if (user.role !== "admin") {
        return reply.status(403).send({ error: "Forbidden" });
      }

      const { status, limit } = req.query as { status?: string; limit?: string };
      const limitValue = limit ? parseInt(limit, 10) : 5;

      const validStatuses = ["pending", "approved", "rejected"];
      if (status && !validStatuses.includes(status)) {
        return reply.status(400).send({ error: "Invalid status value" });
      }

      if (isNaN(limitValue) || limitValue <= 0) {
        return reply.status(400).send({ error: "Invalid limit value" });
      }

      const result = await authService.getTutorApplications(status, limitValue);
      return reply.send(result);
    } catch (err: any) {
      console.error("getTutorApplications error:", err);
      return reply.status(500).send({ error: "Internal Server Error" });
    }
  }

  // 🔹 Admin: Get All Parents
// 🔹 Admin: Get Parents List
async getAllParents(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== "admin") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const parents = await authService.getAllParents();
    return reply.send(parents);
  } catch (err: any) {
    console.error("getAllParents error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}

  async createParentRequest(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;
    if (!user || user.role !== "parent") {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const result = await authService.createParentRequest(user.id, req.body as any);
    return reply.code(201).send(result);
  } catch (err: any) {
    if (err.message.includes("Invalid") || err.message.includes("empty")) {
      return reply.status(400).send({ error: err.message });
    }
    console.error("createParentRequest error:", err);
    return reply.status(500).send({ error: "Internal Server Error" });
  }
}


// 🔹 Admin: Approve / Reject Tutor
// async updateTutorStatus(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     const { tutorId } = req.params as any;
//     const { status } = req.body as any;

//     if (!["approved", "rejected"].includes(status)) {
//       return reply.status(400).send({ error: "Invalid status" });
//     }

//     const tutor = await authService.updateTutorStatus(tutorId, status);

//     return reply.send({
//       success: true,
//       message: `Tutor ${status} successfully`,
//       tutor,
//     });
//   } catch (err: any) {
//     return reply.status(400).send({ error: err.message });
//   }
// }

// 🔹 Admin: Update Tutor Status
async updateTutorStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const user = (req as any).user;

    if (!user || user.role !== "admin") {
      return reply.status(403).send({ error: "Forbidden" });
    }

    const { id } = req.params as any;
    const { status } = req.body as any;

    if (!["approved", "rejected"].includes(status)) {
      return reply.status(400).send({ error: "Invalid status value" });
    }

    const tutor = await authService.updateTutorStatus(id, status);
    return reply.send(tutor);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
}

// 🔹 Admin: Approve / Reject Parent
// async updateParentStatus(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     const user = (req as any).user;

//     if (!user || user.role !== "admin") {
//       return reply.status(403).send({ error: "Forbidden" });
//     }

//     const { id } = req.params as any;
//     const { status } = req.body as any;

//     if (!["approved", "rejected"].includes(status)) {
//       return reply.status(400).send({ error: "Invalid status value" });
//     }

//     const parent = await authService.updateParentStatus(id, status);
//     return reply.send(parent);
//   } catch (err: any) {
//     return reply.status(400).send({ error: err.message });
//   }
// }


// 🔹 Admin: Approve / Reject Parent
async updateParentStatus(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const { status } = req.body as { status: "approved" | "rejected" };

    if (!id) {
      return reply.status(400).send({ error: "Parent ID is required" });
    }

    if (!["approved", "rejected"].includes(status)) {
      return reply.status(400).send({ error: "Invalid status value" });
    }

    const parent = await authService.updateParentStatus(id, status);

    return reply.send({
      success: true,
      message: `Parent ${status} successfully`,
      parent
    });
  } catch (err: any) {
    console.error("updateParentStatus error:", err);
    return reply.status(400).send({ error: err.message });
  }
}


async getTutorById(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as any;
    const tutor = await authService.getTutorById(id);
    return reply.send(tutor);
  } catch (err: any) {
    return reply.status(404).send({ error: err.message });
  }
}

}
