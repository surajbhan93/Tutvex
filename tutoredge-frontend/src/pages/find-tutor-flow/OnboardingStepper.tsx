import { motion } from 'framer-motion';

interface StepperProps {
  currentStep: number; // 1,2,3
}

const steps = ['Create Account', 'Preferences', 'Tutor Match'];

const OnboardingStepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;

          return (
            <div key={label} className="flex-1 flex flex-col items-center">
              {/* Circle */}
              <motion.div
                initial={false}
                animate={{
                  backgroundColor: isCompleted
                    ? '#7c3aed'
                    : isActive
                    ? '#a78bfa'
                    : '#e5e7eb',
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold"
              >
                {isCompleted ? '✓' : stepNumber}
              </motion.div>

              {/* Label */}
              <span
                className={`text-xs mt-2 text-center ${
                  isActive ? 'text-purple-700 font-medium' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="relative mt-4 h-1 bg-gray-200 rounded-full">
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStep / steps.length) * 100}%` }}
          transition={{ duration: 0.5 }}
          className="absolute left-0 top-0 h-1 bg-purple-600 rounded-full"
        />
      </div>

      <p className="text-center text-xs text-gray-500 mt-2">
        Step {currentStep} of {steps.length}
      </p>
    </div>
  );
};

export default OnboardingStepper;
