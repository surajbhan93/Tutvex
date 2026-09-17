import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

import Button from '@/components/ui/Button';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch(
        "http://localhost:3001/api/v1/auth/forgot-password",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setMessage('Password reset link sent to your email');
      setEmail('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-purple-50 via-blue-50 to-white">
      <NavBar />

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl bg-gradient-to-br from-white via-purple-50 to-white p-8 shadow-2xl">

          <h1 className="mb-1 text-center text-3xl font-bold text-purple-600">
            Tutvex
          </h1>
          <p className="mb-6 text-center text-gray-500">
            India's Most Trusted Learning Platform
          </p>

          <h2 className="mb-2 text-xl font-semibold text-gray-900 text-center">
            Forgot your password?
          </h2>
          <p className="mb-6 text-center text-gray-600">
            Don’t worry! Enter your email to recover your account.
          </p>

          <div className="flex justify-center mb-6">
            <img
              src="/images/login-flow/forgot-password.png"
              alt="Forgot Password"
              className="w-52 select-none drop-shadow-lg"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all"
                placeholder="you@example.com"
                required
              />
            </div>

            {message && (
              <p className="text-sm text-green-600 text-center">{message}</p>
            )}

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full text-lg rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-md transition-all"
            >
              {loading ? 'Sending...' : 'Submit'}
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

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
