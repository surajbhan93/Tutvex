// src/pages/_app.tsx
import '../styles/globals.css';
import { Toaster } from 'react-hot-toast';
import type { AppProps } from 'next/app';
import GlobalSEO from "@/components/seo/GlobalSEO";
import Script from "next/script";
export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
     {/* ✅ Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />
         <GlobalSEO />
      <Component {...pageProps} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
