import React from 'react';

import AdminDashboardHomePage from '@/components/admin-dashboard/AdminDashboardHomePage';
import AdminDashboardLayout from '@/components/admin-dashboard/AdminDashboardLayout';

const AdminDashboard = () => {
  return (
    <AdminDashboardLayout>
      <AdminDashboardHomePage />
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
