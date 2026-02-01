import { FastifyReply, FastifyRequest } from "fastify";
import Team from "../models/Team.model";

export class TeamController {

  /* =========================
     ADMIN: Create Team Member
  ========================= */
  createTeam = async (
    req: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const team = await Team.create(req.body as any);

      return reply.code(201).send({
        success: true,
        message: "Team member added successfully",
        data: team,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: "Failed to add team member",
      });
    }
  };

  /* =========================
     PUBLIC: Get All Team
  ========================= */
  getAllTeam = async (
    _req: FastifyRequest,
    reply: FastifyReply
  ) => {
    try {
      const team = await Team.find({ isActive: true }).sort({ createdAt: 1 });

      return reply.send({
        success: true,
        data: team,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: "Failed to fetch team",
      });
    }
  };

  /* =========================
     ADMIN: Update Team Member
  ========================= */
  updateTeam = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = req.params;

      const team = await Team.findByIdAndUpdate(
        id,
        req.body as any,
        { new: true }
      );

      if (!team) {
        return reply.code(404).send({
          success: false,
          message: "Team member not found",
        });
      }

      return reply.send({
        success: true,
        message: "Team member updated successfully",
        data: team,
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: "Failed to update team member",
      });
    }
  };

  /* =========================
     ADMIN: Delete Team Member
  ========================= */
  deleteTeam = async (
    req: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) => {
    try {
      const { id } = req.params;

      const team = await Team.findByIdAndDelete(id);

      if (!team) {
        return reply.code(404).send({
          success: false,
          message: "Team member not found",
        });
      }

      return reply.send({
        success: true,
        message: "Team member deleted successfully",
      });
    } catch (error) {
      return reply.code(500).send({
        success: false,
        message: "Failed to delete team member",
      });
    }
  };
}
