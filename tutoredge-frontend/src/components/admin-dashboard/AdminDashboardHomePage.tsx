import React from 'react';
// import NavBar from '@/components/navbar/NavBar';
// import Footer from '@/components/landing/Footer';

// --- Mock Data ---
const stats = [
  { name: 'Total Tutors', value: '125' },
  { name: 'Total Students', value: '350' },
  { name: 'Active Parent Requests', value: '15' },
];

const recentApplications = [
  {
    name: 'Ethan Harper',
    email: 'ethan.h@email.com',
    status: 'Pending',
    date: '2025-10-14',
  },
  {
    name: 'Olivia Bennett',
    email: 'olivia.b@email.com',
    status: 'Approved',
    date: '2025-10-13',
  },
];

const recentRequests = [
  {
    parent: 'Sophia Clark',
    student: 'Chloe Clark',
    subject: 'Math',
    status: 'New',
    date: '2025-10-15',
  },
  {
    parent: 'Jackson Reed',
    student: 'Owen Reed',
    subject: 'Science',
    status: 'In Progress',
    date: '2025-10-14',
  },
];

// Reusable component for status pills
const StatusPill = ({ status }: { status: string }) => {
  const statusColors: { [key: string]: string } = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    New: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
};

// --- Main Page Component ---
const AdminDashboardHomePage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
     

      {/* Main Content */}
      <div className="container mx-auto px-4 py-10 flex-1">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.name}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <h3 className="text-gray-500">{stat.name}</h3>
                <p className="mt-4 text-3xl font-bold text-gray-800">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Tables for Recent Activity */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Tutor Applications */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Recent Tutor Applications
              </h2>
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-4 font-medium text-gray-600">Name</th>
                      <th className="p-4 font-medium text-gray-600">Status</th>
                      <th className="p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.email} className="border-t">
                        <td className="p-4">
                          <p className="font-medium text-gray-800">{app.name}</p>
                          <p className="text-gray-500">{app.email}</p>
                        </td>
                        <td className="p-4">
                          <StatusPill status={app.status} />
                        </td>
                        <td className="p-4">
                          <a
                            href="#"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            Review
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Parent Requests */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-gray-800">
                Recent Parent Requests
              </h2>
              <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-4 font-medium text-gray-600">Student</th>
                      <th className="p-4 font-medium text-gray-600">Status</th>
                      <th className="p-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((req) => (
                      <tr key={req.student} className="border-t">
                        <td className="p-4">
                          <p className="font-medium text-gray-800">{req.student}</p>
                          <p className="text-gray-500">{req.subject}</p>
                        </td>
                        <td className="p-4">
                          <StatusPill status={req.status} />
                        </td>
                        <td className="p-4">
                          <a
                            href="#"
                            className="font-medium text-blue-600 hover:underline"
                          >
                            Manage
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>

      
    </div>
  );
};

export default AdminDashboardHomePage;
