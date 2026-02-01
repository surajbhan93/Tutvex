import React from 'react';

import DashboardHomePage from '@/components/tutor-dashboard/DashboardHomePage';
import TutorDashboardLayout from '@/components/tutor-dashboard/TutorDashboardLayout';

const TutorDashboard = () => {
  return (
    <TutorDashboardLayout>
      <DashboardHomePage />
    </TutorDashboardLayout>
  );
};

export default TutorDashboard;
