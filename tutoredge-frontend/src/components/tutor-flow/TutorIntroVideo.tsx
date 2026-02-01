import React from "react";
import { motion } from "framer-motion";
import { Mail, Phone, CheckCircle, PlayCircle } from "lucide-react";

const steps = [
  { id: 1, text: "Fill tutor registration form", color: "bg-blue-600" },
  { id: 2, text: "Verify phone number", color: "bg-indigo-600" },
  { id: 3, text: "Your application received", color: "bg-green-600" },
];

const TutorIntroVideo = () => {
  return (

    
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-md"
    >
        <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-5 text-sm text-gray-600"
      >
        ▶️ Watch this video and fill the application form according to the video.
      </motion.p>
      {/* VIDEO */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="relative mb-5 overflow-hidden rounded-xl pt-[56.25%]"
      >
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src="https://www.youtube.com/embed/a-r3Kiw3y5o?si=wcASbn2AKUvLmwml"
          title="Tutor Registration Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {/* Play hint */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <PlayCircle className="h-14 w-14 text-white/80 drop-shadow-lg" />
        </div>
      </motion.div>

      {/* INFO TEXT */}
    
   <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-5 text-sm text-gray-600"
      >
        ▶️ All Steps tutevex registration.
      </motion.p>
      {/* STEPS */}
      <div className="mb-6 space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.15 }}
            className="flex items-center gap-3"
          >
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${step.color}`}
            >
              {step.id}
            </span>
            <p className="text-gray-700">{step.text}</p>

            {step.id === 3 && (
              <CheckCircle className="ml-auto h-4 w-4 text-green-500" />
            )}
          </motion.div>
        ))}
      </div>

      {/* CONTACT / HELP BOX */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-4"
      >
        <p className="mb-3 text-sm font-medium text-gray-800">
          Need help with registration?
        </p>

        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-indigo-600" />
            <span>
              Email:{" "}
              <span className="font-semibold">contact@tutevex.com</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-indigo-600" />
            <span>
              Mobile:{" "}
              <span className="font-semibold">+91-9336-XXXXXX</span>
            </span>
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-500">
          Our support team is available to guide you through the onboarding
          process.
        </p>
      </motion.div>
    </motion.div>
  );
};

export default TutorIntroVideo;
