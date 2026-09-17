import dynamic from 'next/dynamic';

const AddCard = dynamic(
  () => import('@/components/parent-dashboard/add-card'),
  { ssr: false },
);

export default function AddCardPage() {
  return <AddCard />;
}
