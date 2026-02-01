interface Props {
  step: string;
  title: string;
  description: string;
}

export default function StepCard({ step, title, description }: Props) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <span className="text-indigo-600 font-bold text-lg">
        Step {step}
      </span>
      <h3 className="font-semibold text-xl mt-2 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 text-sm">
        {description}
      </p>
    </div>
  );
}
