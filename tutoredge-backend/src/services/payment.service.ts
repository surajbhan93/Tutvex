import Payment from "../models/Payment";
import ParentRequest from "../models/ParentRequest";

/* =========================================================
   1️⃣ CREATE MONTHLY PAYMENT (Parent → Admin)
========================================================= */
// jab studendID apki parent demo se ja rahi hogi tab keliye  

// export const createMonthlyPayment = async (
//   parentId: string,
//   parentRequestId: string,
//   month: number,
//   year: number
// ) => {
//   const request = await ParentRequest.findById(parentRequestId)
//     .populate("tutor")
//     .populate("student");

//   if (!request) {
//     throw new Error("Parent request not found");
//   }
//  // 🔥 DEBUG LOG — ADD THIS
// console.log("🧠 ParentRequest =", {
//   id: request._id.toString(),
//   status: request.status,
//   parent: request.parent?.toString(),
//   student: request.student,
// });

//   if (request.parent.toString() !== parentId) {
//     throw new Error("Unauthorized access");
//   }

//   if (!request.student) {
//     throw new Error("ParentRequest has no student linked");
//   }

//   if (request.status !== "assigned") {
//     throw new Error("Tutor not assigned yet");
//   }

//   const tutor: any = request.tutor;

//   if (!tutor || tutor.priceType !== "per_month") {
//     throw new Error("Tutor does not support monthly pricing");
//   }

//   const studentId =
//     typeof request.student === "object"
//       ? request.student._id
//       : request.student;

//   // ✅ CHECK EXISTING PAYMENT
//   const existingPayment = await Payment.findOne({
//     parent: parentId,
//     parentRequest: request._id,
//     student: studentId,
//     month,
//     year,
//   });

//   // ✅ VERY IMPORTANT FIX
//   if (existingPayment) {
//     return existingPayment; // 🔥 do NOT throw
//   }

//   // ✅ CREATE PAYMENT
//   const payment = await Payment.create({
//     parent: parentId,
//     student: studentId,
//     tutor: tutor._id,
//     parentRequest: request._id,
//     amount: tutor.price,
//     month,
//     year,
//     status: "pending",
//     settlementStatus: "pending",
//   });

//   return payment;
// };

// Only name 

export const createMonthlyPayment = async (
  parentId: string,
  parentRequestId: string,
  month: number,
  year: number
) => {
  const request = await ParentRequest.findById(parentRequestId)
    .populate("tutor")
    .populate("student");

  if (!request) {
    throw new Error("Parent request not found");
  }

  // 🔥 DEBUG (keep this for now)
  console.log("🧠 ParentRequest =", {
    id: request._id.toString(),
    status: request.status,
    parent: request.parent?.toString(),
    student: request.student,
    studentName: (request as any).studentName,
  });

  // 🔐 Ownership check
  if (request.parent.toString() !== parentId) {
    throw new Error("Unauthorized access");
  }

  // ❌ REMOVE HARD BLOCK — allow manual student
  // if (!request.student) {
  //   throw new Error("ParentRequest has no student linked");
  // }

  if (request.status !== "assigned") {
    throw new Error("Tutor not assigned yet");
  }

  const tutor: any = request.tutor;

  if (!tutor || tutor.priceType !== "per_month") {
    throw new Error("Tutor does not support monthly pricing");
  }

  // 🔥 SAFE student reference
  const studentRef =
    request.student && typeof request.student === "object"
      ? request.student._id
      : undefined; // 👈 manual student case

  // ✅ CHECK EXISTING PAYMENT (NO DUPLICATE)
  const existingPayment = await Payment.findOne({
    parent: parentId,
    parentRequest: request._id,
    month,
    year,
  });

  if (existingPayment) {
    return existingPayment; // ✅ idempotent
  }

  // ✅ CREATE PAYMENT
  const payment = await Payment.create({
    parent: parentId,
    parentRequest: request._id,
    tutor: tutor._id,
    student: studentRef, // 🔥 optional now
    amount: tutor.price,
    month,
    year,
    status: "pending",
    settlementStatus: "pending",
  });

  return payment;
};

/* =========================================================
   2️⃣ PARENT DASHBOARD PAYMENT SUMMARY
========================================================= */
export const getParentPaymentDashboard = async (parentId: string) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
  const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

  // All payments of parent
  const payments = await Payment.find({ parent: parentId })
    .populate("student", "full_name")
    .populate("tutor", "fullName");

  let thisMonthPaid = 0;
  let lastMonthPaid = 0;
  let totalPaid = 0;

  payments.forEach(p => {
    totalPaid += p.amount;

    if (p.month === currentMonth && p.year === currentYear) {
      thisMonthPaid += p.amount;
    }

    if (p.month === lastMonth && p.year === lastMonthYear) {
      lastMonthPaid += p.amount;
    }
  });

  // Active assigned requests = expected monthly payments
  const activeRequests = await ParentRequest.find({
    parent: parentId,
    status: "assigned",
  }).populate("tutor student");

  let totalDue = 0;
  const studentWise = [];

for (const parentReq of activeRequests) {
  const tutor: any = parentReq.tutor;
  const student: any = parentReq.student;

  const expected = tutor.price;

const paidThisMonth = payments.find(
  p =>
    p.parentRequest.toString() === parentReq.id && // ✅ FIX
    p.month === currentMonth &&
    p.year === currentYear
);


  const due = paidThisMonth ? 0 : expected;
  totalDue += due;

  studentWise.push({
    requestId: parentReq._id,   // 🔥 VERY IMPORTANT
    studentId: student?._id,
    studentName:
    student?.full_name || parentReq.studentName || "Student",
    tutorName: tutor?.fullName,
    monthlyFee: expected,
    paidThisMonth: !!paidThisMonth,
    due,
  });
}


  return {
    thisMonthPaid,
    lastMonthPaid,
    totalPaid,
    totalDue,
    studentWise,
  };
};

// import Payment from "../models/Payment";

/**
 * Tutor dashboard payment summary
 */
export const getTutorPaymentDashboard = async (tutorId: string) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  // ✅ FIXED QUERY CHAIN
  const payments = await Payment.find({ tutor: tutorId })
    .populate("student", "full_name")
    .populate("parent", "fullName")
    .populate("parentRequest", "studentName")
    .sort({ createdAt: -1 });

  let thisMonthEarning = 0;
  let totalEarning = 0;
  let pendingSettlement = 0;

  payments.forEach(p => {
    totalEarning += p.amount;

    if (p.month === currentMonth && p.year === currentYear) {
      thisMonthEarning += p.amount;
    }

    if (p.settlementStatus === "pending") {
      pendingSettlement += p.amount;
    }
  });

  const paymentHistory = payments.map(p => {
    const studentFromDoc = (p.student as any)?.full_name;
    const studentFromText = (p.parentRequest as any)?.studentName;

    return {
      paymentId: p._id,
      // ✅ BOTH CASES HANDLED
      studentName: studentFromDoc || studentFromText || "N/A",
      parentName: (p.parent as any)?.fullName || "N/A",
      amount: p.amount,
      month: p.month,
      year: p.year,
      status: p.status,
      settlementStatus: p.settlementStatus,
      createdAt: p.createdAt,
    };
  });

  return {
    thisMonthEarning,
    totalEarning,
    pendingSettlement,
    paymentHistory,
  };
};


/* =========================================================
   3️⃣ ADMIN – ALL PAYMENTS
========================================================= */
export const getAllPaymentsForAdmin = async () => {
  const payments = await Payment.find()
    .populate("parent", "fullName email phone")
    .populate("tutor", "fullName email")
    .populate("student", "full_name")
    .populate("parentRequest", "studentName")
    .sort({ createdAt: -1 });

   return payments.map(p => ({
    ...p.toObject(),
    studentName:
      (p.student as any)?.full_name ||
      (p.parentRequest as any)?.studentName ||
      "N/A",
  }));
};

/* =========================================================
   4️⃣ ADMIN – PENDING SETTLEMENTS (Tutor-wise)
========================================================= */
export const getPendingSettlements = async () => {
  const payments = await Payment.find({ settlementStatus: "pending" })
    .populate("tutor", "fullName email")
    .populate("student", "full_name")
    .populate("parentRequest", "studentName");

  const tutorMap: any = {};

  payments.forEach(p => {
    const tutorId = (p.tutor as any)._id.toString();

    if (!tutorMap[tutorId]) {
      tutorMap[tutorId] = {
        tutorId,
        tutorName: (p.tutor as any).fullName,
        totalPending: 0,
        payments: [],
      };
    }

    tutorMap[tutorId].totalPending += p.amount;

    tutorMap[tutorId].payments.push({
      paymentId: p._id,
      amount: p.amount,
      month: p.month,
      year: p.year,
      studentName:
        (p.student as any)?.full_name ||
        (p.parentRequest as any)?.studentName ||
        "N/A",
      createdAt: p.createdAt,
    });
  });

  return Object.values(tutorMap);
};


// /* =========================================================*
/* =========================================================
   ADMIN – SETTLE PAYMENT
========================================================= */
/* =========================================================
   5️⃣ ADMIN – SETTLE PAYMENT (SERVICE)
========================================================= */
export const getParentPaymentSummary = async (parentId: string) => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const lastMonth = month === 1 ? 12 : month - 1;
  const lastMonthYear = month === 1 ? year - 1 : year;

  const payments = await Payment.find({ parent: parentId })
    .populate("student", "full_name")
    .populate("tutor", "fullName")
    .populate("parentRequest", "studentName");

  let thisMonthPaid = 0;
  let lastMonthPaid = 0;
  let totalPaid = 0;

  payments.forEach(p => {
    totalPaid += p.amount;

    if (p.month === month && p.year === year) {
      thisMonthPaid += p.amount;
    }

    if (p.month === lastMonth && p.year === lastMonthYear) {
      lastMonthPaid += p.amount;
    }
  });

  const requests = await ParentRequest.find({
    parent: parentId,
    status: "assigned",
  })
    .populate("tutor")
    .populate("student");

  let totalDue = 0;
  const studentWise: any[] = [];

  for (const req of requests) {
    const tutor: any = req.tutor;
    const student: any = req.student;

    const paidThisMonth = payments.find(
      p =>
        String(p.parentRequest) === String(req._id) &&
        p.month === month &&
        p.year === year
    );

    const expected = tutor.price;
    const due = paidThisMonth ? 0 : expected;
    totalDue += due;

    studentWise.push({
      requestId: req._id,
      studentId: student?._id,
      studentName:
        student?.full_name || req.studentName || "N/A",
      tutorName: tutor?.fullName,
      monthlyFee: expected,
      paidThisMonth: !!paidThisMonth,
      due,
    });
  }

  return {
    thisMonthPaid,
    lastMonthPaid,
    totalPaid,
    totalDue,
    studentWise,
  };
};
