import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  illustrationUrl: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  illustrationUrl,
}) => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Side: Form Content */}
          <div className="p-8 md:p-12">
            <Link href="/" className="mb-8 inline-block">
              <Image
                src="/images/logo.png"
                alt="Tutvex Logo"
                width={150}
                height={40}
              />
            </Link>

            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            <p className="mt-2 text-gray-600">{subtitle}</p>

            <div className="mt-8">{children}</div>
          </div>

          {/* Right Side: Illustration */}
          <div className="relative hidden items-center justify-center bg-blue-50 md:flex">
            <div className="relative size-64">
              <Image
                src={illustrationUrl}
                alt="Auth Illustration"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
