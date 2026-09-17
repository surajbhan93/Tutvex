import dynamic from 'next/dynamic';

const Profile = dynamic(() => import('@/components/parent-dashboard/profile'), {
  ssr: false,
});

export default function ProfilePage() {
  return <Profile />;
}
