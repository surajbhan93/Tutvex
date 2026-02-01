import React from 'react';
import NavBar from '@/components/navbar/NavBar';
import Button from '@/components/ui/Button';

// --- Type Definition for the request data ---
type ParentRequest = {
  id: string;
  parent: { name: string; email: string; phone: string };
  request: {
    tutoringMode: string;
    subject: string;
    tutorName: string;
    grade: string;
    preferredTiming: string;
    location: string;
  };
  status: string;
};

// A reusable component to display data fields cleanly
const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <div className="py-2">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-medium text-gray-800">{value}</p>
  </div>
);

// --- Main Page Component ---
const ParentRequestDetailPage: React.FC<{ request: ParentRequest }> = ({
  request,
}) => {
  const handleMarkAsContacted = () => {
    // API call to update status would go here
  };

  return (
    <div className="flex flex-col gap-6">
      <NavBar/>
      <div>
        <h1 className="text-3xl font-bold text-gray-800">
          Parent Request Details: {request.parent.name}
        </h1>
      </div>

      {/* Details Card */}
      <div className="rounded-xl border bg-white p-8 shadow-sm">
        {/* Parent Information */}
        <section>
          <h2 className="text-xl font-semibold text-gray-800">
            Parent Information
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem label="Name" value={request.parent.name} />
            <DetailItem label="Email" value={request.parent.email} />
            <DetailItem label="Phone Number" value={request.parent.phone} />
          </div>
        </section>

        {/* Request Details */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800">
            Request Details
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
            <DetailItem
              label="Tutoring mode"
              value={request.request.tutoringMode}
            />
            <DetailItem label="Subject" value={request.request.subject} />
            <DetailItem label="Tutor name" value={request.request.tutorName} />
            <DetailItem label="Grade" value={request.request.grade} />
            <DetailItem
              label="Preferred Timing"
              value={request.request.preferredTiming}
            />
            <DetailItem label="Location" value={request.request.location} />
          </div>
        </section>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3 border-t pt-6 sm:flex-row">
          <Button onClick={handleMarkAsContacted}>Mark as Contacted</Button>
          <Button
            variant="dark"
            className="bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Assign Tutor
          </Button>
          <Button
            variant="dark"
            className="bg-red-100 text-red-700 hover:bg-red-200"
          >
            Close Request
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParentRequestDetailPage;
