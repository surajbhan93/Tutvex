import dynamic from 'next/dynamic';

const Materials = dynamic(
  () => import('@/components/parent-dashboard/materials'),
  { ssr: false },
);

export default function MaterialsPage() {
  return <Materials />;
}
