import { motion } from "framer-motion";
import { Check, Sparkles, UserCheck, PhoneCall, ShieldCheck } from "lucide-react";

type Props = {
  currentStep: number; // 1, 2, 3
};

const steps = [
  { id: 1, title: "Fill Registration Form", icon: UserCheck, desc: "Profile & Documents" },
  { id: 2, title: "Verify Phone (OTP)", icon: PhoneCall, desc: "Instant SMS Code" },
  { id: 3, title: "Approval & Live Profile", icon: ShieldCheck, desc: "Get Parent Leads" },
];

const OnboardingStepper = ({ currentStep }: Props) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-4 md:p-5 text-white shadow-lg border border-indigo-500/20">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {steps.map((step, index) => {
          const isCompleted = step.id < currentStep;
          const isActive = step.id === currentStep;
          const Icon = step.icon;

          return (
            <div key={step.id} className="flex flex-1 items-center gap-3">
              {/* CIRCLE ICON */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold shadow-md transition-all
                  ${
                    isCompleted
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-emerald-500/20"
                      : isActive
                      ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white ring-4 ring-purple-500/30 shadow-indigo-500/30"
                      : "bg-white/10 text-gray-400 border border-white/10"
                  }
                `}
              >
                {isCompleted ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}
              </motion.div>

              {/* TEXT */}
              <div className="flex flex-col">
                <span className="text-[11px] font-semibold tracking-wider uppercase text-indigo-300/80">
                  Step 0{step.id}
                </span>
                <span
                  className={`text-xs md:text-sm font-bold leading-tight
                    ${
                      isActive
                        ? "text-white"
                        : isCompleted
                        ? "text-emerald-300"
                        : "text-gray-400"
                    }
                  `}
                >
                  {step.title}
                </span>
                <span className="text-[11px] text-gray-400 hidden sm:inline-block mt-0.5">
                  {step.desc}
                </span>
              </div>

              {/* CONNECTING LINE (desktop only) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block flex-1 h-[2px] mx-4 rounded bg-gradient-to-r from-indigo-500/30 to-purple-500/10" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingStepper;
