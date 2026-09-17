import React from 'react';

type SeriesPoint = {
  label: string; // test name or month
  previous: number; // 0-100
  current: number; // 0-100
};

type TestsComparisonProps = {
  title?: string;
  data: SeriesPoint[];
  height?: number; // px
};

export default function TestsComparison({
  title = 'Tests: Previous vs Current',
  data,
  height = 200,
}: TestsComparisonProps) {
  const maxValue = 100;
  const padding = 24;
  const innerHeight = height - padding * 2;
  const groupWidth = Math.max(28, Math.floor(360 / Math.max(1, data.length)));
  const barGap = 8;
  const chartWidth = data.length * (groupWidth + 16) + padding * 2;

  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-gray-500">{title}</div>
      <div className="overflow-x-auto">
        <svg
          width={chartWidth}
          height={height + 32}
          role="img"
          aria-label={title}
        >
          {/* gridline */}
          <line
            x1={padding}
            y1={height - padding}
            x2={chartWidth - padding}
            y2={height - padding}
            stroke="#e5e7eb"
          />

          {data.map((d, i) => {
            const groupX = padding + i * (groupWidth + 16) + 8;
            const prevHeight = Math.max(
              2,
              Math.round((d.previous / maxValue) * innerHeight),
            );
            const currHeight = Math.max(
              2,
              Math.round((d.current / maxValue) * innerHeight),
            );
            const prevY = height - padding - prevHeight;
            const currY = height - padding - currHeight;

            return (
              <g key={d.label}>
                <rect
                  x={groupX}
                  y={prevY}
                  width={(groupWidth - barGap) / 2}
                  height={prevHeight}
                  rx={4}
                  fill="#94a3b8"
                />
                <rect
                  x={groupX + (groupWidth - barGap) / 2 + barGap}
                  y={currY}
                  width={(groupWidth - barGap) / 2}
                  height={currHeight}
                  rx={4}
                  fill="#3b82f6"
                />
                <text
                  x={groupX + groupWidth / 2}
                  y={height - padding + 14}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#6b7280"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* legend */}
          <g transform={`translate(${padding}, ${height + 8})`}>
            <rect x={0} y={0} width={10} height={10} rx={2} fill="#94a3b8" />
            <text x={14} y={9} fontSize="10" fill="#6b7280">
              Previous
            </text>
            <rect x={70} y={0} width={10} height={10} rx={2} fill="#3b82f6" />
            <text x={84} y={9} fontSize="10" fill="#6b7280">
              Current
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}
