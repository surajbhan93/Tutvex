import React from 'react';

import ProfilePage from '@/components/tutor-dashboard/ProfilePage';
import TutorDashboardLayout from '@/components/tutor-dashboard/TutorDashboardLayout';

const TutorProfile = () => {
  return (
    <TutorDashboardLayout>
      <ProfilePage />
    </TutorDashboardLayout>
  );
};

export default TutorProfile;
