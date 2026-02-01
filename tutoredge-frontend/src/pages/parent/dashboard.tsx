import dynamic from 'next/dynamic';

const ParentDashboard = dynamic(
  () => import('@/components/parent-dashboard/ParentDashboard'),
  { ssr: false },
);

export default function ParentDashboardPage() {
  return <ParentDashboard />;
}
