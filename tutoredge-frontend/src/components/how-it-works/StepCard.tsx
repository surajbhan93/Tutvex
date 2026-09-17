interface Props {
  step: string;
  title: string;
  description: string;
}

export default function StepCard({ step, title, description }: Props) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        p-4 sm:p-6
        shadow-sm hover:shadow-md
        transition
      "
    >
      <span
        className="
          inline-block
          text-indigo-600 font-bold
          text-sm sm:text-base
        "
      >
        Step {step}
      </span>

      <h3
        className="
          font-semibold
          text-base sm:text-xl
          mt-2 mb-2
          text-gray-900
        "
      >
        {title}
      </h3>

      <p
        className="
          text-gray-600
          text-sm
          leading-relaxed
        "
      >
        {description}
      </p>
    </div>
  );
}
