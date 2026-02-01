import Head from 'next/head';

import CreateAccount from '@/pages/find-tutor-flow/create-account';

export default function FindTutorIndexPage() {
  return (
    <>
      <Head>
        <title>Create account – Tutvex</title>
      </Head>
      <main className="mx-auto max-w-6xl p-6">
        <CreateAccount />
      </main>
    </>
  );
}
