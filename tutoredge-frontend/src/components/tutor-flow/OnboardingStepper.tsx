import { motion } from "framer-motion";
import { Check } from "lucide-react";

type Props = {
  currentStep: number; // 1, 2, 3
};

const steps = [
  { id: 1, title: "Fill tutor registration form" },
  { id: 2, title: "Verify phone number" },
  { id: 3, title: "Your application received" },
];

const OnboardingStepper = ({ currentStep }: Props) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl">
      
      {/* Info Text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-sm text-blue-100"
      >
        ▶️ Watch this video and fill the application form according to the video.
      </motion.p>

      {/* STEPPER */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;

          return (
            <div key={step.id} className="flex items-center gap-4">
              
              {/* CIRCLE */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.15 }}
                className={`flex h-10 w-10 items-center justify-center rounded-full font-bold shadow-md
                  ${
                    isCompleted
                      ? "bg-green-400 text-white"
                      : isActive
                      ? "bg-white text-indigo-600 ring-4 ring-white/30"
                      : "bg-indigo-300/40 text-white"
                  }
                `}
              >
                {isCompleted ? <Check size={18} /> : step.id}
              </motion.div>

              {/* TEXT */}
              <span
                className={`text-sm font-medium
                  ${
                    isActive
                      ? "text-white"
                      : isCompleted
                      ? "text-green-200"
                      : "text-indigo-200"
                  }
                `}
              >
                {step.title}
              </span>

              {/* LINE (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block h-1 w-12 rounded bg-white/30" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;
