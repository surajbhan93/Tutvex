# Add Lead Stats API Endpoint

If the `/api/v1/leads/stats` endpoint doesn't exist in your backend, follow these instructions:

## 1. Update leads.controller.ts

Add this method to `tutoredge-backend/src/controllers/leads.controller.ts`:

```typescript
/**
 * GET /leads/stats - Get tutor lead statistics
 */
async getLeadStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const tutorId = (req as any).user.id;

    // Import models at top of file if not already imported
    // import LeadCreditWallet from "../models/LeadCreditWallet";
    // import StudentLead from "../models/StudentLead";
    // import LeadUnlock from "../models/LeadUnlock";

    // Get tutor's credit wallet
    const wallet = await LeadCreditWallet.findOne({ tutorId });

    // Count available leads (active and not expired)
    const availableLeads = await StudentLead.countDocuments({
      status: { $in: ["new", "active"] },
      expiryDate: { $gt: new Date() },
    });

    // Count tutor's unlocked leads
    const unlockedLeads = await LeadUnlock.countDocuments({ tutorId });

    // Count converted leads (successfully converted to students)
    const activeStudents = await LeadUnlock.countDocuments({
      tutorId,
      status: "converted",
    });

    reply.status(200).send({
      success: true,
      data: {
        availableLeads,
        unlockedLeads,
        activeStudents,
        creditsRemaining: wallet?.availableCredits || 0,
      },
    });
  } catch (error: any) {
    reply.status(500).send({ success: false, message: error.message });
  }
}
```

## 2. Update leads.routes.ts

Add this route to `tutoredge-backend/src/routes/leads.routes.ts`:

```typescript
export default async function leadsRoutes(fastify: FastifyInstance) {
  // All routes require authentication
  fastify.addHook("preHandler", authMiddleware);

  // Existing routes...
  fastify.get("/marketplace", leadsController.getMarketplaceLeads);
  fastify.post("/unlock", leadsController.unlockLead);
  fastify.get("/my-leads", leadsController.getMyLeads);
  fastify.put("/update-status", leadsController.updateLeadStatus);
  fastify.post("/mark-converted", leadsController.markAsConverted);

  // ADD THIS NEW ROUTE
  fastify.get("/stats", leadsController.getLeadStats);

  // Parent routes...
  fastify.post("/create", leadsController.createLead);
  fastify.get("/my-requests", leadsController.getParentLeads);
  fastify.post("/close", leadsController.closeLead);

  // Common routes...
  fastify.get("/:id", leadsController.getLeadById);
}
```

## 3. Export the new method

Make sure `getLeadStats` is exported in `leadsController`:

```typescript
export const leadsController = {
  getMarketplaceLeads,
  unlockLead,
  getMyLeads,
  updateLeadStatus,
  markAsConverted,
  createLead,
  getParentLeads,
  getLeadById,
  closeLead,
  getLeadStats, // ADD THIS
};
```

## 4. Test the endpoint

### Using curl:
```bash
curl -X GET http://localhost:3001/api/v1/leads/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Expected Response:
```json
{
  "success": true,
  "data": {
    "availableLeads": 12,
    "unlockedLeads": 5,
    "activeStudents": 2,
    "creditsRemaining": 15
  }
}
```

## Alternative: If using lead.service.ts

If your controller uses a service layer pattern, add to `lead.service.ts`:

```typescript
async getTutorStats(tutorId: string) {
  const wallet = await LeadCreditWallet.findOne({ tutorId });

  const [availableLeads, unlockedLeads, activeStudents] = await Promise.all([
    StudentLead.countDocuments({
      status: { $in: ["new", "active"] },
      expiryDate: { $gt: new Date() },
    }),
    LeadUnlock.countDocuments({ tutorId }),
    LeadUnlock.countDocuments({ tutorId, status: "converted" }),
  ]);

  return {
    availableLeads,
    unlockedLeads,
    activeStudents,
    creditsRemaining: wallet?.availableCredits || 0,
  };
}
```

Then in controller:
```typescript
async getLeadStats(req: FastifyRequest, reply: FastifyReply) {
  try {
    const tutorId = (req as any).user.id;
    const stats = await leadService.getTutorStats(tutorId);
    reply.status(200).send({ success: true, data: stats });
  } catch (error: any) {
    reply.status(500).send({ success: false, message: error.message });
  }
}
```

## That's it!

Restart your backend server and the stats endpoint will be available. The frontend already calls this API and will automatically start showing real statistics.
