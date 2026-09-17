import React from 'react';

type MarkDatum = {
  label: string;
  value: number; // 0-100
};

type MarksChartProps = {
  title?: string;
  data: MarkDatum[];
  height?: number; // px
};

export default function MarksChart({
  title = 'Marks',
  data,
  height = 180,
}: MarksChartProps) {
  const maxValue = 100;
  const barWidth = Math.max(12, Math.floor(280 / Math.max(1, data.length)));
  const chartPadding = 16;
  const chartHeight = height;
  const chartWidth = data.length * (barWidth + 12) + chartPadding * 2;

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-gray-500">{title}</div>
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={chartHeight + 40}
          role="img"
          aria-label={`${title} bar chart`}
        >
          {/* Axes */}
          <line
            x1={chartPadding}
            y1={chartPadding}
            x2={chartPadding}
            y2={chartHeight + chartPadding}
            stroke="#e5e7eb"
          />
          <line
            x1={chartPadding}
            y1={chartHeight + chartPadding}
            x2={chartWidth - chartPadding}
            y2={chartHeight + chartPadding}
            stroke="#e5e7eb"
          />

          {data.map((d, i) => {
            const x = chartPadding + i * (barWidth + 12) + 8;
            const h = Math.max(
              2,
              Math.round((d.value / maxValue) * chartHeight),
            );
            const y = chartHeight + chartPadding - h;
            return (
              <g key={d.label}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={h}
                  rx={4}
                  fill="#3b82f6"
                />
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + chartPadding + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {d.label}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={y - 6}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#374151"
                >
                  {d.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
