import dynamic from 'next/dynamic';

const Tutors = dynamic(() => import('@/components/parent-dashboard/tutors'), {
  ssr: false,
});

export default function TutorsPage() {
  return <Tutors />;
}
