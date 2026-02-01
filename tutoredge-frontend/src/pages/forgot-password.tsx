import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    alert('Password reset email sent! (Simulated)');
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 via-blue-50 to-white">

      {/* Header */}
      <NavBar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        {/* Card */}
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-white via-purple-50 to-white p-8 shadow-2xl">
          
          {/* Branding */}
          <h1 className="mb-1 text-center text-3xl font-bold text-purple-600">
            Tutvex
          </h1>
          <p className="mb-6 text-center text-gray-500">
            India's Most Trusted Learning Platform
          </p>

          {/* Title */}
          <h2 className="mb-2 text-xl font-semibold text-gray-900 text-center">
            Forgot your password?
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Don’t worry! Enter your email to recover your account.
          </p>

          {/* Illustration */}
          <div className="flex justify-center mb-6">
            <img
              src="/images/login-flow/forgot-password.png"
              alt="Forgot Password"
              className="w-52 select-none drop-shadow-lg"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="Tutvex@gmail.com"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full text-lg rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all"
            >
              Submit
            </Button>

            <div className="text-center pt-2">
              <Link href="/login">
                <span className="inline-flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer transition-all">
                  <ArrowLeft size={16} />
                  Back to Login
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
