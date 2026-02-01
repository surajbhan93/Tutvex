import React from 'react';

import TutorPayments from "@/components/tutor-dashboard/TutorPayments";
import TutorDashboardLayout from '@/components/tutor-dashboard/TutorDashboardLayout';

const Earnings = () => {
  return (
    <TutorDashboardLayout>
      <TutorPayments />
    </TutorDashboardLayout>
  );
};

export default Earnings;

// import TutorPayments from "@/components/tutor-dashboard/TutorPayments";
// import TutorSidebar from "@/components/tutor-dashboard/Sidebar";
// export default function TutorPaymentsPage() {
//   return <TutorPayments />;
// }
