import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle2, PlayCircle, HelpCircle, ShieldCheck } from "lucide-react";

const steps = [
  { id: 1, text: "Fill tutor registration form & documents", color: "bg-indigo-600" },
  { id: 2, text: "Verify mobile number with OTP code", color: "bg-purple-600" },
  { id: 3, text: "Get verified & start receiving parent leads", color: "bg-emerald-600" },
];

const TutorIntroVideo = () => {
  return (
    <div className="rounded-2xl bg-white p-5 md:p-6 shadow-md border border-indigo-100">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs">
          🎥
        </span>
        <h3 className="font-bold text-gray-900 text-sm md:text-base">
          Registration Video Guide
        </h3>
      </div>

      <p className="mb-4 text-xs text-gray-600 leading-relaxed">
        Watch this quick video to learn how to complete your profile &amp; get maximum parent enquiries.
      </p>

      {/* VIDEO EMBED CONTAINER */}
      <div className="relative mb-5 overflow-hidden rounded-xl border border-gray-200 bg-slate-900 pt-[56.25%] shadow-inner group">
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src="https://www.youtube.com/embed/EP4VIoWJP0w?si=5zcYi7LPBr8CIt2J"
          title="Tutvex Tutor Registration Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      {/* ONBOARDING STEPS OVERVIEW */}
      <div className="mb-5 space-y-3 pt-2 border-t border-gray-100">
        <p className="text-xs font-bold text-gray-800 uppercase tracking-wider">Onboarding Process</p>
        {steps.map((step) => (
          <div
            key={step.id}
            className="flex items-center gap-3 p-2 rounded-xl bg-gray-50/70 border border-gray-100"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${step.color}`}
            >
              {step.id}
            </span>
            <p className="text-xs font-medium text-gray-700">{step.text}</p>
            {step.id === 3 && (
              <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-500 shrink-0" />
            )}
          </div>
        ))}
      </div>

      {/* SUPPORT & HELP CARD */}
      <div className="rounded-xl bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-blue-50/80 p-4 border border-indigo-100/80">
        <div className="flex items-center gap-2 mb-2 text-xs font-bold text-indigo-900">
          <HelpCircle size={15} className="text-indigo-600" />
          Need help registering?
        </div>

        <div className="space-y-1.5 text-xs text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span>Email: <a href="mailto:contact@tutvex.com" className="font-semibold text-indigo-700 hover:underline">contact@tutvex.com</a></span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
            <span>Support: <a href="tel:+919305275932" className="font-semibold text-indigo-700 hover:underline">+91 9305275932</a></span>
          </div>
        </div>

        <p className="mt-2.5 text-[11px] text-gray-500 leading-snug">
          Our team is available 10 AM - 7 PM to assist you with profile creation &amp; lead activation.
        </p>
      </div>
    </div>
  );
};

export default TutorIntroVideo;
