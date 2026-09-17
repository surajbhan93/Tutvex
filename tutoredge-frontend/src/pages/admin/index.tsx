import {
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import React from 'react';

import StatsCard from '@/components/admin-dashboard/StatsCard';

const stats = [
  {
    title: 'Total Users',
    value: '1,234',
    icon: UsersIcon,
    color: 'bg-blue-500',
    change: '+12%',
  },
  {
    title: 'Total Content',
    value: '567',
    icon: DocumentTextIcon,
    color: 'bg-green-500',
    change: '+8%',
  },
  {
    title: 'Revenue',
    value: '$12,345',
    icon: CurrencyDollarIcon,
    color: 'bg-purple-500',
    change: '+15%',
  },
  {
    title: 'Active Sessions',
    value: '89',
    icon: ChartBarIcon,
    color: 'bg-orange-500',
    change: '+3%',
  },
];

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center space-x-3 text-sm">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <span>New user registered</span>
                <span className="ml-auto text-gray-500">2 hours ago</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full rounded-lg bg-blue-50 px-4 py-3 text-left text-blue-700 transition-colors hover:bg-blue-100">
              Add New User
            </button>
            <button className="w-full rounded-lg bg-green-50 px-4 py-3 text-left text-green-700 transition-colors hover:bg-green-100">
              Create Content
            </button>
            <button className="w-full rounded-lg bg-purple-50 px-4 py-3 text-left text-purple-700 transition-colors hover:bg-purple-100">
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
