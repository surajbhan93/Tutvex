import dynamic from 'next/dynamic';

const PaymentMethods = dynamic(() => import('@/components/parent-dashboard'), {
  ssr: false,
});

export default function PaymentMethodsPage() {
  return <PaymentMethods />;
}

// pages/parent/payment-methods.tsx

// 👉 UPI / Card / Netbanking UI (optional)

// payment-methods.tsx


// 👉 Mostly UI only, Razorpay handles actual methods.