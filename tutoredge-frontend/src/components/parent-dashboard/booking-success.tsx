import Link from 'next/link';
import ParentTopBar from "@/components/parent-dashboard/ParentTopBar";
import { CheckCircleIcon } from '@heroicons/react/24/solid';

export default function BookingSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 via-white to-blue-50 flex flex-col">
      <ParentTopBar
  parentName="Parent"
  studentName="Student"
  notificationsCount={0}
/>
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 shadow-xl transform transition-all hover:scale-105">
          <CheckCircleIcon className="mx-auto mb-4 h-16 w-16 text-green-500 animate-bounce" />
          <h1 className="mb-4 text-3xl font-extrabold text-gray-800">Request Sent Successfully!</h1>
          <p className="mb-6 text-gray-600">
            Your session request has been sent. We will notify you once the tutor confirms the session.
          </p>
          <Link
            href="/parent/dashboard"
            className="inline-block w-full rounded-lg bg-blue-600 px-6 py-3 text-center text-white font-semibold shadow-md hover:bg-blue-700 transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
      <footer className="mt-auto py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Tutvex. All rights reserved.
      </footer>
    </div>
  );
}
