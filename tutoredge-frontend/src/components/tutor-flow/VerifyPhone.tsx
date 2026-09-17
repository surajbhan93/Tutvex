


import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import apiClient from '../../lib/apiClient';

import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import OnboardingStepper from "@/components/tutor-flow/OnboardingStepper";

const VerifyPhone: NextPage = () => {
  const router = useRouter();
  const { phone, otp: serverOtp } = router.query;

  const [otp, setOtp] = useState<string>('');
  const [displayOtp, setDisplayOtp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // ✅ Router ready hone ke baad OTP set karo
  useEffect(() => {
    if (router.isReady && serverOtp) {
      setDisplayOtp(serverOtp as string);
    }
  }, [router.isReady, serverOtp]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/\D/g, '');
    setOtp(v.slice(0, 6));
  };

  // ✅ Verify OTP
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!phone || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await apiClient.post('/otp/verify', {
        phone: phone as string,
        otp: otp // ⚠️ STRING hi bhejna
      });

      if (response.data.success) {
        setSuccessMsg('OTP verified successfully!');
        router.push('/tutor-flow/application-received');
      } else {
        setError(response.data.message || 'OTP verification failed.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Resend OTP (new OTP UI me update hoga)
  const handleResend = async () => {
    if (!phone) return;

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const response = await apiClient.post('/otp/send', {
        phone: phone as string
      });

      if (response.data.success) {
        setDisplayOtp(response.data.otp);
        setSuccessMsg('New OTP generated.');
        setOtp('');

        router.replace(
          `/tutor-flow/verify-phone?phone=${phone}&otp=${response.data.otp}`,
          undefined,
          { shallow: true }
        );
      } else {
        setError('Failed to resend OTP.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
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
            Verify your phone number to continue.
          </p>
        </div>

        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">
            Verify Your Phone
          </h2>

          {/* ✅ TEMP OTP DISPLAY */}
          {displayOtp && (
            <p className="mb-4 text-center text-sm font-semibold text-green-600">
              Temporary OTP: {displayOtp}
            </p>
          )}

          <p className="mb-6 text-gray-500">
            Enter the 6-digit code for{' '}
            <span className="font-medium">
              {phone ? `+91-${phone}` : 'your phone'}
            </span>
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

            {error && (
              <p className="text-center text-sm text-red-600">{error}</p>
            )}
            {successMsg && (
              <p className="text-center text-sm text-green-600">
                {successMsg}
              </p>
            )}

            <button
              type="submit"
              className={`w-full rounded-xl bg-purple-600 py-3 text-white hover:bg-purple-700 transition-colors ${
                isLoading ? 'cursor-not-allowed opacity-50' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            Didn’t receive the code?{' '}
            <button
              onClick={handleResend}
              className="underline text-purple-600"
              disabled={isLoading}
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default VerifyPhone;
