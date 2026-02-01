import Head from 'next/head';

import RequestSent from '@/pages/find-tutor-flow/RequestSent';

export default function RequestSentPage() {
  return (
    <>
      <Head>
        <title>Request sent – Tutvex</title>
      </Head>
      <main className="mx-auto max-w-6xl p-6">
        <RequestSent />
      </main>
    </>
  );
}
