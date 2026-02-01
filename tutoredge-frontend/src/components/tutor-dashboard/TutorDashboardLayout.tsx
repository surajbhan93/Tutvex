import React from 'react';

import Sidebar from './Sidebar';

type TutorDashboardLayoutProps = {
  children: React.ReactNode;
};

const TutorDashboardLayout: React.FC<TutorDashboardLayoutProps> = ({
  children,
}) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 font-sans">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
};

export default TutorDashboardLayout;
