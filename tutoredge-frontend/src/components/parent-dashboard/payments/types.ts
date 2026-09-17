export interface StudentWisePayment {
  requestId: string;
  studentId?: string;
  studentName?: string;
  tutorName?: string;
  monthlyFee: number;
  paidThisMonth: boolean;
  due: number;
}

export interface ParentPaymentSummary {
  thisMonthPaid: number;
  lastMonthPaid: number;
  totalPaid: number;
  totalDue: number;
  studentWise: StudentWisePayment[];
}
