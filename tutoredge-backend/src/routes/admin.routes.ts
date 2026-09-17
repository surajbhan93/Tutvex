import { FastifyInstance } from "fastify";
import { AdminController } from "../controllers/admin.controller";
import { authMiddleware, roleMiddleware } from "../middlewares/auth";

const adminController = new AdminController();

export default async function adminRoutes(app: FastifyInstance) {

  // ✅ GET ALL PARENT DEMO REQUESTS
  app.get(
    "/admin/parent-requests",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    adminController.getParentDemoRequests.bind(adminController)
  );
  // 🔹 GET ALL TUTORS
 // 🔹 GET ALL TUTORS
app.get(
  "/admin/tutors",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.getAllTutors.bind(adminController)
);


  // 🔥 GET SINGLE PARENT DEMO REQUEST (VIEW PAGE)
app.get(
  "/admin/parent-requests/:id",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  (request, reply) =>
    adminController.getParentDemoRequestById(
      request as any,
      reply
    )
);



  // ✅ UPDATE REQUEST STATUS / NOTE
  app.patch(
    "/admin/parent-requests/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    adminController.updateParentDemoRequest.bind(adminController)
  );

   // 🔔 Tutor Demo Requests (LIST)
  app.get(
    "/admin/tutor-demo-requests",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    adminController.getTutorDemoRequests.bind(adminController)
  );

  // 🔥 Tutor Demo Request ACTION (Assign / Complete / Cancel)
  app.put(
    "/admin/tutor-demo-requests/:id",
    {
      preHandler: [authMiddleware, roleMiddleware(["admin"])],
    },
    adminController.updateTutorDemoRequest.bind(adminController)
  );

  
app.post(
  "/admin/logout",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.logout.bind(adminController)
);

// Parent list
app.get(
  "/admin/parents",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.getAllParents.bind(adminController)
);

// Parent dashboard
app.get(
  "/admin/parent-dashboard/:parentId",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  (request, reply) =>
    adminController.getParentDashboard(request as any, reply)
);


// tutor all about 

// adminTutor.routes.ts

// ================= ADMIN TUTOR DASHBOARD =================

// 🔹 Admin Dashboard – All Tutors
app.get(
  "/admin_dashboard/tutors",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.adminGetAllTutors.bind(adminController)
);

// 🔹 Admin – Get Single Tutor (View Page)
app.get(
  "/admin/tutors/:tutorId",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.adminGetTutorById.bind(adminController)
);

// 🔹 Admin – Update Tutor Status (Approve / Reject)
app.patch(
  "/admin/tutors/:tutorId",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.adminUpdateTutorStatus.bind(adminController)
);

// 🔹 Admin – Tutor Dashboard Stats
app.get(
  "/admin/tutors/dashboard/stats",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.adminTutorStats.bind(adminController)
);

app.post(
  "/admin/create-lead",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.createLeadByAdmin.bind(adminController)
);
app.get(
  "/admin/all-leads",
  {
    preHandler: [authMiddleware, roleMiddleware(["admin"])],
  },
  adminController.getAllLeads.bind(adminController)
);
}
