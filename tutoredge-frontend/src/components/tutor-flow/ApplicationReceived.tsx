// src/components/tutor-flow/ApplicationReceived.tsx
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import NavBar from "@/components/navbar/NavBar";
import Footer from "@/components/landing/Footer";
import { CheckCircle, Clock, Bell, UserCheck, MessageCircle } from "lucide-react";
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
                  <span className="font-semibold text-indigo-600">pending</span>{" "}
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
                  <span className="font-semibold">100% of all required fields</span>
                  . Your profile will automatically become public after approval.
                </span>
              </li>
            </ul>
          </div>

          {/* WAIT NOTE */}
          <p className="mb-6 text-sm text-gray-500">
            Please wait for up to{" "}
            <span className="font-semibold text-gray-700">2 days</span>.{" "}
            Our team may contact you via call or message for demo or interview.
          </p>

          {/* ── WHATSAPP COMMUNITY BOX ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mb-8 rounded-2xl border-2 border-green-200 bg-green-50 px-6 py-5"
          >
            <div className="mb-3 flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-base font-bold text-green-800">
                Join Our WhatsApp Community
              </h2>
            </div>

            <p className="mb-4 text-sm text-green-700">
              Stay updated about your{" "}
              <span className="font-semibold">interview schedule</span>,
              approval status, and important announcements — all in one place.
            </p>

            <button
              onClick={() =>
                window.open(
                  "https://chat.whatsapp.com/KlMNGSmRaYi1u7uvXq4zGq",
                  "_blank"
                )
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-500 px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.02] hover:bg-green-600 hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Join Community for Updates
            </button>
          </motion.div>

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