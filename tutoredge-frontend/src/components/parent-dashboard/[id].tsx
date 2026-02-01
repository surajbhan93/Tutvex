import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import ParentDashboardLayout from '@/layouts/ParentDashboardLayout';

export default function TutorDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <ParentDashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tutor Profile</h1>
          <p className="text-gray-600">Tutor ID: {id}</p>
        </div>
        <Link
          href="/parent/tutors"
          className="text-sm font-semibold text-blue-700"
        >
          Back to tutors
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 md:col-span-2">
          <div className="flex items-start gap-4">
            <div className="relative size-24 overflow-hidden rounded-full">
              <Image
                src="/images/tutors/tutor-1.jpg"
                alt="Tutor avatar"
                fill
                style={{ objectFit: 'cover' }}
              />
            </div>
            <div>
              <div className="text-xl font-semibold">Ananya Gupta</div>
              <div className="text-gray-600">Mathematics • 4.9★</div>
              <p className="mt-3 text-gray-700">
                Experienced Math tutor focusing on concepts, problem-solving,
                and exam readiness. Sessions are interactive with practice
                sheets and weekly assessments.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="mb-2 text-lg font-semibold">About</h2>
            <ul className="list-inside list-disc text-gray-700">
              <li>8+ years teaching grades 6–12</li>
              <li>Specializes in Algebra, Geometry, and Calculus</li>
              <li>Available for weekend doubt-clearing</li>
            </ul>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-2 text-lg font-semibold">Request Session</h2>
          <div className="text-sm text-gray-600">Select a date and time.</div>
          <div className="mt-3 rounded-md border p-3 text-sm text-gray-500">
            Calendar placeholder
          </div>
          <Link
            href="/parent/booking-success"
            className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Request Demo
          </Link>
        </div>
      </div>
    </ParentDashboardLayout>
  );
}
