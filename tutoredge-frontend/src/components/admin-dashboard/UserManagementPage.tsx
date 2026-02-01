import { Search } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import NavBar from '@/components/navbar/NavBar';
// --- Mock Data ---
const mockTutors = [
  {
    id: 1,
    name: 'Dr. Amelia Harper',
    email: 'amelia.harper@example.com',
    status: 'Active',
    totalStudents: 25,
    joinedDate: '2022-03-15',
  },
  {
    id: 2,
    name: 'Prof. Ethan Carter',
    email: 'ethan.carter@example.com',
    status: 'Active',
    totalStudents: 32,
    joinedDate: '2021-11-20',
  },
  {
    id: 3,
    name: 'Ms. Olivia Bennett',
    email: 'olivia.bennett@example.com',
    status: 'Active',
    totalStudents: 18,
    joinedDate: '2023-01-10',
  },
  {
    id: 4,
    name: 'Mr. Noah Thompson',
    email: 'noah.thompson@example.com',
    status: 'Suspended',
    totalStudents: 0,
    joinedDate: '2022-07-05',
  },
];

const mockParents = [
  {
    id: 101,
    name: 'Peter Parker',
    email: 'peter.parker@example.com',
    students: 1,
    joinedDate: '2023-05-10',
  },
  {
    id: 102,
    name: 'Jackson Reed',
    email: 'jackson.reed@example.com',
    students: 2,
    joinedDate: '2022-08-22',
  },
  {
    id: 103,
    name: 'Isabella Hayes',
    email: 'isabella.hayes@example.com',
    students: 1,
    joinedDate: '2023-02-15',
  },
];

// --- Reusable Components ---
const StatusPill = ({ status }: { status: string }) => {
  const statusColors: { [key: string]: string } = {
    Active: 'bg-green-100 text-green-800',
    Suspended: 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {status}
    </span>
  );
};

const ActionMenu = () => (
  <div className="flex gap-2 text-sm font-medium">
    <a href="#" className="text-blue-600 hover:underline">
      View Profile
    </a>
    <span className="text-gray-300">|</span>
    <a href="#" className="text-blue-600 hover:underline">
      Edit
    </a>
    <span className="text-gray-300">|</span>
    <a href="#" className="text-red-600 hover:underline">
      Suspend
    </a>
  </div>
);

// --- Main Page Component ---
const UserManagementPage = () => {
  const [activeTab, setActiveTab] = useState('Tutors');
  const [searchQuery, setSearchQuery] = useState('');
  const tabs = ['Tutors', 'Parents'];

  const filteredTutors = useMemo(() => {
    return mockTutors.filter(
      (tutor) =>
        tutor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tutor.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  const filteredParents = useMemo(() => {
    return mockParents.filter(
      (parent) =>
        parent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        parent.email.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <NavBar/>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="mt-1 text-gray-500">
          Manage all users on the platform, including tutors and students.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder={`Search ${activeTab.toLowerCase()} by name or email...`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border-gray-300 bg-white py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Conditional Table Rendering */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        {activeTab === 'Tutors' && (
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">Status</th>
                <th className="p-4 font-medium text-gray-600">
                  Total Students
                </th>
                <th className="p-4 font-medium text-gray-600">Joined Date</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTutors.map((tutor) => (
                <tr key={tutor.id} className="border-t">
                  <td className="p-4 font-medium text-gray-800">
                    {tutor.name}
                  </td>
                  <td className="p-4 text-gray-600">{tutor.email}</td>
                  <td className="p-4">
                    <StatusPill status={tutor.status} />
                  </td>
                  <td className="p-4 text-gray-600">{tutor.totalStudents}</td>
                  <td className="p-4 text-gray-600">{tutor.joinedDate}</td>
                  <td className="p-4">
                    <ActionMenu />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {activeTab === 'Parents' && (
          <table className="w-full min-w-[800px] text-sm">
            <thead className="bg-gray-50 text-left">
              <tr>
                <th className="p-4 font-medium text-gray-600">Name</th>
                <th className="p-4 font-medium text-gray-600">Email</th>
                <th className="p-4 font-medium text-gray-600">
                  No. of Students
                </th>
                <th className="p-4 font-medium text-gray-600">Joined Date</th>
                <th className="p-4 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParents.map((parent) => (
                <tr key={parent.id} className="border-t">
                  <td className="p-4 font-medium text-gray-800">
                    {parent.name}
                  </td>
                  <td className="p-4 text-gray-600">{parent.email}</td>
                  <td className="p-4 text-gray-600">{parent.students}</td>
                  <td className="p-4 text-gray-600">{parent.joinedDate}</td>
                  <td className="p-4">
                    <ActionMenu />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserManagementPage;
