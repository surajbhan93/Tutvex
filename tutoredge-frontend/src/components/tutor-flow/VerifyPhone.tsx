// src/components/tutor-flow/VerifyPhone.tsx
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import Image from 'next/image';
import apiClient from '../../lib/apiClient';
// import { useAuthStore } from '../../stores/useAuthStore';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import OnboardingStepper from "@/components/tutor-flow/OnboardingStepper";
const VerifyPhone: NextPage = () => {
  const router = useRouter();
  const { phone } = router.query;

  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '');
    setOtp(v.slice(0, 6));
  };

  // Submit OTP for verification
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!phone || otp.length < 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/otp/verify', {
        phone: phone as string,
        otp: Number(otp),
      });

      if (response.data.success) {
        setSuccessMsg('OTP verified successfully!');
        // useAuthStore.getState().login({ phone }, 'dummy-token'); // Adjust according to your login logic
        router.push('/tutor-flow/application-received');
      } else {
        setError(response.data.message || 'OTP verification failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP or an error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (!phone) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.post('/otp/send', { phone: phone as string });
      if (response.data.success) {
        setSuccessMsg('OTP resent successfully!');
      } else {
        setError('Failed to resend OTP');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
     <div className="px-4 pt-6">
        <OnboardingStepper currentStep={2} />
      </div>
      <div className="flex flex-col items-center justify-center flex-1 bg-gradient-to-tr from-purple-400 via-pink-300 to-yellow-200 px-4 py-12">
        <div className="mb-8 flex flex-col items-center text-center">
          <Image
            src="/images/logo1.png"
            alt="Tutvex Logo"
            width={90}
            height={90}
          />
          <h1 className="mt-4 text-3xl font-bold text-white">Tutvex</h1>
          <p className="mt-2 max-w-md text-white/90">
            Empowering tutors and students to connect seamlessly. Verify your phone
            to continue and unlock personalized tutoring experiences.
          </p>
        </div>

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">Verify Your Phone</h2>
          <p className="mb-6 text-gray-500">
            Enter the 6-digit code sent to <span className="font-medium">{phone ? `+91-${phone}` : 'your phone'}</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              inputMode="numeric"
              pattern="\d*"
              value={otp}
              onChange={handleChange}
              placeholder="Enter OTP"
              maxLength={6}
              className="w-full rounded-xl border border-gray-300 p-3 text-center text-lg tracking-widest focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              required
              disabled={isLoading}
            />

            {error && <p className="text-center text-sm text-red-600">{error}</p>}
            {successMsg && <p className="text-center text-sm text-green-600">{successMsg}</p>}

            <button
              type="submit"
              className={`w-full rounded-xl bg-purple-600 py-3 text-white hover:bg-purple-700 transition-colors duration-200 ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Didn’t receive the code?{' '}
            <button onClick={handleResend} className="underline text-purple-600" disabled={isLoading}>
              Resend OTP
            </button>
          </div>
        </div>

        <div className="mt-8 max-w-md text-center text-white">
          <h3 className="mb-2 text-xl font-semibold">Why Tutvex?</h3>
          <ul className="space-y-1 text-white/90">
            <li>✅ Find expert tutors in any subject</li>
            <li>✅ Personalized learning paths</li>
            <li>✅ Flexible online sessions</li>
            <li>✅ Track your progress easily</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyPhone;
