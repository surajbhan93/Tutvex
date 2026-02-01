import React from 'react';

import AdminDashboardLayout from '@/components/admin-dashboard/AdminDashboardLayout';
import TutorApplicationsPage from '@/components/admin-dashboard/TutorApplicationsPage';

const Applications = () => {
  return (
    <AdminDashboardLayout>
      <TutorApplicationsPage />
    </AdminDashboardLayout>
  );
};

export default Applications;
