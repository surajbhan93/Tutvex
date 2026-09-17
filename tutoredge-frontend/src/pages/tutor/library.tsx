import React from 'react';

import ContentLibraryPage from '@/components/tutor-dashboard/ContentLibraryPage';
import TutorDashboardLayout from '@/components/tutor-dashboard/TutorDashboardLayout';

const Library = () => {
  return (
    <TutorDashboardLayout>
      <ContentLibraryPage />
    </TutorDashboardLayout>
  );
};

export default Library;
