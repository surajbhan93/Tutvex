// src/pages/set-password.tsx

import { useRouter } from 'next/router';
import React, { useState } from 'react';

import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';

import Button from '@/components/ui/Button';
import PasswordInput from '@/components/ui/PasswordInput';

const SetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Setting new password...');
    alert('Password has been reset! (Simulated)');
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-white">

      {/* 🔵 TutoEdge Header */}
      <NavBar />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">

          {/* LEFT ILLUSTRATION */}
          <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-10">
            <img
              src="/images/login-flow/forgot-password.png"
              alt="Reset Password Illustration"
              className="w-4/5 drop-shadow-xl"
            />
          </div>

          {/* RIGHT FORM */}
          <div className="p-8 md:p-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Set Your New Password 🔐
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Welcome to <span className="font-semibold text-blue-600">Tutvex</span>!  
              Your previous password has been reset.  
              Please create a strong and secure new password for your account.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <PasswordInput
                label="Create Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <PasswordInput
                label="Re-enter Password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button type="submit" className="h-12 w-full text-lg rounded-xl shadow-md">
                Set New Password
              </Button>
            </form>

            <p className="text-center text-gray-500 text-sm mt-4">
              Remembered your password? 
              <span
                className="text-blue-600 font-medium cursor-pointer hover:underline"
                onClick={() => router.push('/login')}
              >
                {' '}Back to Login
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 🔵 Footer */}
      <Footer />
    </div>
  );
};

export default SetPasswordPage;
