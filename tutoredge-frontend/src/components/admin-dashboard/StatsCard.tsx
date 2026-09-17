import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  change: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  change,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="flex items-center">
        <div className={`rounded-lg p-3 ${color}`}>
          <Icon className="size-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm font-medium text-green-600">
          {change} from last month
        </span>
      </div>
    </div>
  );
};

export default StatsCard;
