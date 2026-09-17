import React from 'react';

import MyStudentsPage from '@/components/tutor-dashboard/MyStudentsPage';
import TutorDashboardLayout from '@/components/tutor-dashboard/TutorDashboardLayout';

const StudentsPage = () => {
  return (
    <TutorDashboardLayout>
      <MyStudentsPage />
    </TutorDashboardLayout>
  );
};

export default StudentsPage;
