import React from 'react';

type AttendanceDonutProps = {
  percentage: number; // 0-100
  size?: number; // px
  strokeWidth?: number; // px
  title?: string;
};

export default function AttendanceDonut({
  percentage,
  size = 140,
  strokeWidth = 14,
  title = 'Attendance',
}: AttendanceDonutProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Math.round(percentage)));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 w-full text-left text-sm font-semibold text-gray-500">
        {title}
      </div>
      <svg
        width={size}
        height={size}
        role="img"
        aria-label={`${title} ${clamped}%`}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#10b981"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="none"
          />
        </g>
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="22"
          fontWeight={700}
          fill="#111827"
        >
          {clamped}%
        </text>
      </svg>
    </div>
  );
}
