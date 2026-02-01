import Link from 'next/link';
import React from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

interface UserCardProps {
  user: User;
}

// Helper function to get the correct CSS classes for the role pill
const getRoleClasses = (role: string): string => {
  if (role === 'Admin') {
    return 'bg-purple-100 text-purple-800';
  }
  if (role === 'Tutor') {
    return 'bg-green-100 text-green-800';
  } // Default for Parent/Student
  return 'bg-blue-100 text-blue-800';
};

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const roleClasses = getRoleClasses(user.role); // Call the helper function

  return (
    <div className="rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md">
      <div className="flex items-center space-x-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
          <span className="font-semibold text-blue-600">
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{user.name}</h3>
          <p className="text-sm text-gray-600">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Role:</span>
          {/* Use the variable from the helper function */}
          <span className={`rounded-full px-2 py-1 text-xs ${roleClasses}`}>
            {user.role}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          {/* Kept the simple ternary here as it's not nested */}
          <span
            className={`rounded-full px-2 py-1 text-xs ${
              user.status === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {user.status}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Joined:</span>
          <span>{new Date(user.joinDate).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-4 flex space-x-2">
        <Link
          href={`/admin/users/${user.id}`}
          className="flex-1 rounded-lg bg-blue-600 py-2 text-center text-sm text-white transition-colors hover:bg-blue-700"
        >
          View Details
        </Link>
        <button className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors hover:bg-gray-50">
          Edit
        </button>
      </div>
    </div>
  );
};

export default UserCard;
