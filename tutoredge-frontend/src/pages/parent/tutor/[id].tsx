import dynamic from 'next/dynamic';

const TutorDetail = dynamic(
  () => import('@/components/parent-dashboard/[id]'),
  { ssr: false },
);

export default function TutorDetailPage() {
  return <TutorDetail />;
}
