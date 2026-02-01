import React from 'react';

import FindStudentPage from '@/components/tutor-dashboard/FindStudentPage';
import TutorDashboardLayout from '@/components/tutor-dashboard/TutorDashboardLayout';

const FindStudent = () => {
  return (
    <TutorDashboardLayout>
      <FindStudentPage />
    </TutorDashboardLayout>
  );
};

export default FindStudent;
