import { useRouter } from 'next/router';
import React from 'react';

import Button from '../../components/find-tutor-flow/Button';

const RequestSent: React.FC = () => {
  const router = useRouter();

  return (
    <div
      style={{
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Request Sent Successfully!</h2>
      <p style={{ maxWidth: 420, textAlign: 'center', marginBottom: 40 }}>
        Thank you for your request! A member of our admissions team will look
        over your information and contact you shortly with a demo or to set a
        date.
      </p>
      <Button onClick={() => router.push('/')} variant="primary">
        Back to Dashboard
      </Button>
    </div>
  );
};

export default RequestSent;
