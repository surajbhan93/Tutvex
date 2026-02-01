import dynamic from 'next/dynamic';

const Assignments = dynamic(
  () => import('@/components/parent-dashboard/assignments'),
  { ssr: false },
);

export default function AssignmentsPage() {
  return <Assignments />;
}
