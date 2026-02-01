import React from 'react';
import AdminSidebar from './AdminSidebar';

type AdminDashboardLayoutProps = {
  children: React.ReactNode;
  title?: string;
};

const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({
  children,
  title,
}) => {
  return (
    <div className="flex min-h-screen w-full bg-gray-50 font-sans">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        {title && (
          <h1 className="mb-6 text-2xl font-bold text-gray-900">
            {title}
          </h1>
        )}

        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
