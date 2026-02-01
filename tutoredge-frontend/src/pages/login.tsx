// src/pages/login.tsx

import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import LoginHeader from "@/components/common/LoginHeader";
import AboutUsCTA from "@/components/common/AboutUsCTA";
import { motion } from "framer-motion"
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import Button from "@/components/ui/Button";
import PasswordInput from "@/components/ui/PasswordInput";
import apiClient from "@/lib/apiClient";
import { useAuthStore } from "@/stores/useAuthStore";

const roles = ["Parent", "Tutor", "Admin"] as const;
type Role = (typeof roles)[number];

const LoginPage = () => {
  const [activeRole, setActiveRole] = useState<Role>("Parent");
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();
  const router = useRouter();

  const mainInputLabel = activeRole === "Admin" ? "Username" : "Email";

  const ROLE_CONFIG: Record<
    Role,
    { endpoint: string; payloadKey: "email" | "username"; dashboard: string }
  > = {
    Parent: {
      endpoint: "/auth/parent/login",
      payloadKey: "email",
      dashboard: "/parent/dashboard",
    },
    Tutor: {
      endpoint: "/auth/tutor/login",
      payloadKey: "email",
      dashboard: "/tutor/dashboard",
    },
    Admin: {
      endpoint: "/auth/admin/login",
      payloadKey: "username",
      dashboard: "/admin/dashboard",
    },
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const config = ROLE_CONFIG[activeRole];

    try {
      const response = await apiClient.post(config.endpoint, {
        [config.payloadKey]: emailOrUsername,
        password,
      });

      const { user, token } = response.data;
      login(user, token);

      const redirectUrl =
        (router.query.redirect as string) || config.dashboard;

      router.push(redirectUrl);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Invalid credentials"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <NavBar />
      <LoginHeader />

      {/* MAIN */}
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">




          {/* LEFT : VIDEO + INFO */}
        <motion.section
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
  className="flex flex-col justify-between
             bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600
             p-6 md:p-10 text-white rounded-3xl"
>

  {/* 🎥 VIDEO */}
  <motion.div
    initial={{ scale: 0.95, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{ delay: 0.2, duration: 0.5 }}
    className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-6"
  >
    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/dl00fOOYLOM?autoplay=1&mute=1&loop=1&playlist=dl00fOOYLOM&controls=0&modestbranding=1"
      title="Tutvex Intro"
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
    />
  </motion.div>

  {/* 📝 CONTENT */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.35 }}
  >
    <h3 className="text-2xl md:text-3xl font-bold mb-2 leading-tight">
      Learn. Teach. Grow with Tutvex 🚀
    </h3>

    <p className="text-sm md:text-base text-indigo-100 max-w-md">
      India’s trusted platform for parents & tutors — personalized,
      verified and result-oriented learning.
    </p>
  </motion.div>

  {/* ✅ TRUST BADGES */}
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.45 }}
    className="flex flex-wrap gap-3 mt-5"
  >
    {["Trusted Tutors", "Secure Payments", "PAN-India Coverage"].map(
      (item) => (
        <span
          key={item}
          className="flex items-center gap-1
                     bg-white/15 backdrop-blur
                     px-4 py-1.5 rounded-full
                     text-xs font-medium shadow-sm"
        >
          ✔ {item}
        </span>
      )
    )}
  </motion.div>

  {/* 📞 SUPPORT */}
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.55 }}
    className="mt-6 pt-4 border-t border-white/20 text-xs md:text-sm text-indigo-100"
  >
    <p>📧 support@tutvex.com</p>
    <p>📞 +91-XXXX-XXXX</p>
  </motion.div>

</motion.section>




          {/* RIGHT : LOGIN FORM */}
          <div className="p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Welcome Back 👋
            </h2>
            <p className="text-gray-500 mb-6">
              Login to access your dashboard
            </p>

            {/* ROLE TABS */}
            <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    setActiveRole(role);
                    setError(null);
                  }}
                  className={`w-full py-2 text-sm font-semibold rounded-lg transition ${
                    activeRole === role
                      ? "bg-white shadow text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  {mainInputLabel}
                </label>
                <input
                  type="text"
                  value={emailOrUsername}
                  onChange={(e) => setEmailOrUsername(e.target.value)}
                  placeholder={
                    activeRole === "Admin"
                      ? "admin_username"
                      : "you@example.com"
                  }
                  className="mt-1 w-full rounded-xl border-gray-300 py-3 px-4 focus:ring-2 focus:ring-indigo-400"
                  required
                />
              </div>

              <PasswordInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              {error && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl text-center">
                  {error}
                </div>
              )}

              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-600">
                  <input type="checkbox" className="rounded" />
                  Remember me
                </label>

                <Link
                  href="/forgot-password"
                  className="text-indigo-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-lg rounded-xl"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>

              {/* SIGNUP LINKS */}
              <div className="text-center text-sm text-gray-600 space-y-2 pt-2">
                <p>
                  Student / Parent?
                  <Link
                    href="/find-tutor-flow/create-account/?source=MOBILE_NAV&campaign=FIND_TUTOR"
                    className="ml-1 text-indigo-600 font-semibold hover:underline"
                  >
                    Sign up here
                  </Link>
                </p>

                <p>
                  Want to teach on Tutvex?
                  <a
                    href="/tutor-flow/tutor-registration/?role=tutor&source=MOBILE_NAV&campaign=BECOME_TUTOR"
                    className="ml-1 text-indigo-600 font-semibold hover:underline"
                  >
                    Become a Tutor
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      
  <AboutUsCTA />
      <Footer />
    </div>
  );
};

export default LoginPage;
