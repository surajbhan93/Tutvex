// src/components/tutor-flow/ApplicationReceived.tsx
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { CheckCircle, Clock, Bell, UserCheck } from "lucide-react";
import OnboardingStepper from "@/components/tutor-flow/OnboardingStepper";

export default function ApplicationReceived() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />

      {/* Stepper */}
      <div className="px-4 pt-6">
        <OnboardingStepper currentStep={4} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 items-center justify-center bg-gradient-to-tr from-purple-400 via-pink-300 to-yellow-200 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-lg rounded-3xl bg-white px-8 py-10 text-center shadow-2xl"
        >
          {/* ICON */}
          <div className="mb-5 flex justify-center">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>

          {/* TITLE */}
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Application Received 🎉
          </h1>

          <p className="mb-8 text-gray-600">
            Thank you for applying at{" "}
            <span className="font-semibold">Tutvex</span>.
          </p>

          {/* INFO BOX */}
          <div className="mb-6 rounded-2xl bg-indigo-50 px-6 py-5 text-left">
            <ul className="space-y-4 text-sm text-gray-700">
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-indigo-600" />
                <span>
                  Your profile is currently{" "}
                  <span className="font-semibold text-indigo-600">
                    pending
                  </span>{" "}
                  and not public yet.
                </span>
              </li>

              <li className="flex gap-3">
                <Bell className="mt-0.5 h-4 w-4 text-indigo-600" />
                <span>
                  You will receive a notification once your profile is approved.
                </span>
              </li>

              <li className="flex gap-3">
                <UserCheck className="mt-0.5 h-4 w-4 text-indigo-600" />
                <span>
                  Login to the website and complete{" "}
                  <span className="font-semibold">
                    100% of all required fields
                  </span>
                  . Your profile will automatically become public after approval.
                </span>
              </li>
            </ul>
          </div>

          {/* WAIT NOTE */}
          <p className="mb-8 text-sm text-gray-500">
            Please wait for up to{" "}
            <span className="font-semibold text-gray-700">2 days</span>.  
            Our team may contact you via call or message for demo or interview.
          </p>

          {/* BUTTON */}
          <button
            onClick={() => router.push("/")}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:shadow-lg"
          >
            Back to Home Page
          </button>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
