import { Search } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import NavBar from '@/components/navbar/NavBar';
import apiClient from '@/lib/apiClient'; // 1. Import (Path fixed)
import Link from "next/link";

// 2. Define type for the application data based on the API
interface TutorApplication {
  id: string;    // Backend mapping se aa raha hai
  _id?: string;  // Optional, safety ke liye // Assuming an 'id' or '_id' comes back for the key
  name: string;
  email: string;
  phone?: string; // Mobile number
  city?: string;  // Location city
  state?: string; // Location state
  appliedDate: string;
  status: string;
}

// Reusable component for status pills
const StatusPill = ({ status }: { status: string }) => {
  const statusColors: { [key: string]: string } = {
    pending: 'bg-yellow-100 text-yellow-800', // API uses lowercase
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
        statusColors[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {status}
    </span>
  );
};

// --- Main Page Component ---
const TutorApplicationsPage = () => {
  // 3. Remove mockData and add state for API data
  const [applications, setApplications] = useState<TutorApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // Fixed syntax error here

  // 4. Fetch data from the API
  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 5. Use the correct API endpoint
        const response = await apiClient.get('/auth/tutor-applications');
        console.log("API Data Sample:", response.data[0]);
        setApplications(response.data || []);
      } catch (err: any) {
        setError(
          'Failed to fetch tutor applications. Are you logged in as an Admin?',
        );
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  // Handle approve action
  const handleApprove = async (appId: string) => {
    if (!confirm('Are you sure you want to approve this tutor application?')) {
      return;
    }
    try {
      await apiClient.patch(`/auth/tutor-applications/${appId}`, {
        status: 'approved'
      });
      // Refresh the list
      setApplications(prevApps => 
        prevApps.map(app => 
          (app.id === appId || app._id === appId) 
            ? { ...app, status: 'approved' } 
            : app
        )
      );
      alert('Tutor application approved successfully!');
    } catch (err: any) {
      alert('Failed to approve application. Please try again.');
      console.error(err);
    }
  };

  // Handle reject action
  const handleReject = async (appId: string) => {
    if (!confirm('Are you sure you want to reject this tutor application?')) {
      return;
    }
    try {
      await apiClient.patch(`/auth/tutor-applications/${appId}`, {
        status: 'rejected'
      });
      // Refresh the list
      setApplications(prevApps => 
        prevApps.map(app => 
          (app.id === appId || app._id === appId) 
            ? { ...app, status: 'rejected' } 
            : app
        )
      );
      alert('Tutor application rejected.');
    } catch (err: any) {
      alert('Failed to reject application. Please try again.');
      console.error(err);
    }
  };
 
  // 6. Update useMemo to use the 'applications' state
  const filteredApplications = useMemo(() => {
    
    return applications
      .filter((app) => statusFilter === 'All' || app.status === statusFilter)
      
      .filter(
        (app) =>
          app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          app.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (app.phone && app.phone.includes(searchQuery)) ||
          (app.city && app.city.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (app.state && app.state.toLowerCase().includes(searchQuery.toLowerCase()))
      );
  }, [searchQuery, statusFilter, applications]);

  // 7. Add loading and error states
  if (isLoading) {
    return <div className="p-4">Loading applications...</div>;
  }
  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <NavBar/>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Tutor Applications</h1>
        <p className="mt-1 text-gray-500">
          Review, approve, or reject new tutor applications.
        </p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 rounded-xl border bg-white p-4 shadow-sm sm:flex-row">
        <div className="relative grow">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name, email, phone, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border-gray-300 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border-gray-300 sm:w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-4 font-medium text-gray-600">Name</th>
              <th className="p-4 font-medium text-gray-600">Email</th>
              <th className="p-4 font-medium text-gray-600">Mobile Number</th>
              <th className="p-4 font-medium text-gray-600">Address</th>
              <th className="p-4 font-medium text-gray-600">Date</th>
              <th className="p-4 font-medium text-gray-600">Approve</th>
              <th className="p-4 font-medium text-gray-600">View</th>
            </tr>
          </thead>
          <tbody>
            {filteredApplications.map((app) => {
              const appId = app.id || (app as any)._id;
              const address = [app.city, app.state].filter(Boolean).join(', ') || 'Not provided';
              const isPending = app.status.toLowerCase() === 'pending';
              
              return (
                <tr key={appId} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-800">{app.name}</td>
                  <td className="p-4 text-gray-600">{app.email}</td>
                  <td className="p-4 text-gray-600">{app.phone || 'Not provided'}</td>
                  <td className="p-4 text-gray-600">{address}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {isPending ? (
                      <button
                        onClick={() => handleApprove(appId)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                      >
                        Approve
                      </button>
                    ) : (
                      <StatusPill status={app.status} />
                    )}
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/applications/${appId}`}
                      className="text-blue-600 hover:text-blue-700 hover:underline text-sm font-medium"
                    >
                      View & Verify
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredApplications.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No applications found for the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorApplicationsPage;
