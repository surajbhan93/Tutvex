import React from 'react';

import AdminDashboardLayout from '@/components/admin-dashboard/AdminDashboardLayout';
import ParentRequestDetailPage from '@/components/admin-dashboard/ParentRequestDetailPage';

// In a real app, you would fetch this data from your API using the requestId.
// This mock data represents the detailed object for a single request.
const mockRequestDetails = {
  id: 'req-001',
  parent: {
    name: 'Peter Parker',
    email: 'peter.parker123@email.com',
    phone: '(555) 123-4567',
  },
  request: {
    tutoringMode: 'Online',
    subject: 'Mathematics',
    tutorName: 'Chloe Clark',
    grade: '10th Grade',
    preferredTiming: 'Weekdays after 4 PM',
    location: 'N/A', // Or an address if offline
  },
  status: 'Active',
};

const RequestDetail = () => {
  // const router = useRouter();
  // const { requestId } = router.query; // This gets the ID from the URL

  // Here you would fetch the data based on the requestId.
  // For now, we'll just use the mock data.
  const request = mockRequestDetails;

  if (!request) {
    return (
      <AdminDashboardLayout>
        <p>Request not found.</p>
      </AdminDashboardLayout>
    );
  }

  return (
    <AdminDashboardLayout>
      <ParentRequestDetailPage request={request} />
    </AdminDashboardLayout>
  );
};

export default RequestDetail;
