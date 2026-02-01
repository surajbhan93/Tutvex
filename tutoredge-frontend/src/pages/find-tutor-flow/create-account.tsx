import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

import NavBar from '@/components/navbar/NavBar';
import Footer from '@/components/landing/Footer';
import Button from '@/components/find-tutor-flow/Button';
import InputField from '@/components/find-tutor-flow/InputField';
import apiClient from '@/lib/apiClient';
import OnboardingStepper from '@/pages/find-tutor-flow/OnboardingStepper';

/* ------------------ Animations ------------------ */

const pageVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const cardHover = {
  hover: { scale: 1.02 },
};

/* ------------------ Component ------------------ */

const CreateAccount: React.FC = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError(null);

  //   try {
  //     await apiClient.post('/auth/parent/signup', form);
     
  //     router.push('/find-tutor-flow/preferences');
  //   } catch (err: any) {
  //     const backendMessage = err.response?.data?.message;
  //     setError(
  //       backendMessage ||
  //         'This email is already registered. Please use another email or login instead. '
  //     );
  //     setIsLoading(false);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError(null);

  try {
    const res = await apiClient.post('/auth/parent/signup', form);

    // ✅ AUTO-LOGIN TOKEN STORE
    if (res.data?.token) {
      localStorage.setItem('token', res.data.token);
    }

    router.push('/find-tutor-flow/preferences');
  } catch (err: any) {
    const backendMessage =
      err.response?.data?.error || err.response?.data?.message;

    setError(
      backendMessage ||
        'This email is already registered. Please login instead.'
    );
  } finally {
    setIsLoading(false);
  }
};


  return (
    <motion.div
      variants={pageVariant}
      initial="hidden"
      animate="visible"
      className="flex flex-col min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-white overflow-hidden"
    >
      <NavBar />
     

      {/* ------------------ MAIN SECTION ------------------ */}
      <div className="flex flex-1 items-center justify-center px-4 py-6">
        <div className="w-full max-w-7xl">

          {/* Header */}
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-purple-700">
              Start Your Tutvex Journey 🚀
            </h1>
            <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
              Create your account and get matched with trusted tutors,
              tailored exactly to your learning needs.
            </p>
          </motion.div>
<OnboardingStepper currentStep={1} />
          {/* Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">
{/* <OnboardingStepper currentStep={1} /> */}
            {/* ------------------ LEFT PANEL ------------------ */}
            <motion.div variants={fadeUp} className="space-y-6">

              {/* Video Card */}
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-white rounded-3xl p-6 shadow-xl"
              >
                <h3 className="text-xl font-semibold text-purple-700 mb-2">
                  Watch How Tutvex Works 🎥
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  A quick walkthrough to help you complete the signup smoothly.
                </p>

                <div className="relative w-full pt-[56.25%] rounded-2xl overflow-hidden">
                  <iframe
                    src="https://www.youtube.com/embed/rm8AhGGYEVA"
                    title="Tutvex Signup Guide"
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allowFullScreen
                  />
                </div>
              </motion.div>

              {/* Steps */}
              <motion.div
                whileHover="hover"
                variants={cardHover}
                className="bg-white rounded-3xl p-8 shadow-xl"
              >
                <h3 className="text-lg font-semibold text-purple-700 mb-4">
                  Your Learning Journey 📍
                </h3>

                <ul className="space-y-3 text-gray-700 border-lime-800">
                  <li>① Create your Tutvex account</li>
                  <li>② Tell us your preferences</li>
                  <li>③ Get matched with verified tutors</li>
                  <li>④ Send your learning requirements</li>
                  <li>⑤ Track sessions & progress</li>
                </ul>
              </motion.div>
            </motion.div>

            {/* ------------------ RIGHT PANEL (FORM) ------------------ */}
            <motion.div
              variants={fadeUp}
              className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md mx-auto w-full"
            >
              <div className="flex justify-center mb-6">
                <img
                  src="/images/logo1.png"
                  alt="Tutvex"
                  className="w-32"
                />
              </div>

              <h2 className="text-3xl font-bold text-center text-purple-700 mb-2">
                Create Your Account
              </h2>

              <p className="text-center text-gray-600 mb-8">
                Join thousands of learners finding the right tutors on Tutvex.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">

                <InputField
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  type="text"
                  disabled={isLoading}
                />

                <InputField
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  type="email"
                  disabled={isLoading}
                />

                <InputField
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create Password"
                  type="password"
                  disabled={isLoading}
                />

                <InputField
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Mobile Number"
                  type="tel"
                  disabled={isLoading}
                />

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="w-full mt-6 text-lg rounded-xl shadow-lg"
                >
                  {isLoading ? 'Creating Account...' : 'Continue →'}
                </Button>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}
              </form>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already registered?{' '}
                <Link href="/login">
                  <span className="text-purple-600 hover:underline cursor-pointer">
                    Login here
                  </span>
                </Link>
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </motion.div>
  );
};

export default CreateAccount;
