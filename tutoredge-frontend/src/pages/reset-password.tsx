import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import Button from '@/components/ui/Button';
import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setError('Invalid or expired reset link');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            newPassword: password
          })
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Reset failed');
      }

      router.push('/login?reset=success');
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
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

          <h2 className="text-2xl font-bold text-center text-purple-600">
            Reset Password
          </h2>

          <p className="text-center text-gray-600 mt-2 mb-6">
            Create a new password for your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              placeholder="New Password"
              className="w-full rounded-xl border py-3 px-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full rounded-xl border py-3 px-4"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-xl bg-purple-600 text-white"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
