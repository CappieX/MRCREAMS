import React from 'react';
import { BRAND_COLORS } from '../../../assets/brand';

const AdminMetricsChart = () => {
  const data = [
    { label: 'Mon', value: 38 },
    { label: 'Tue', value: 42 },
    { label: 'Wed', value: 51 },
    { label: 'Thu', value: 47 },
    { label: 'Fri', value: 58 },
    { label: 'Sat', value: 44 },
    { label: 'Sun', value: 39 }
  ];

  const max = Math.max(...data.map((d) => d.value));

  return (
    <svg viewBox="0 0 220 120" width="100%" height="100%" aria-hidden="true">
      <defs>
        <linearGradient id="admin-line" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={BRAND_COLORS.teal} stopOpacity="0.7" />
          <stop offset="100%" stopColor={BRAND_COLORS.teal} stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <rect
        x="0"
        y="0"
        width="220"
        height="120"
        fill="none"
        stroke="rgba(148,163,184,0.4)"
        strokeWidth="0.5"
        rx="12"
      />
      <polyline
        fill="url(#admin-line)"
        stroke={BRAND_COLORS.teal}
        strokeWidth="2"
        points={data
          .map((point, index) => {
            const x = 16 + (index * 180) / (data.length - 1);
            const y = 90 - (point.value / max) * 60;
            return `${x},${y}`;
          })
          .join(' ')}
      />
      {data.map((point, index) => {
        const x = 16 + (index * 180) / (data.length - 1);
        const y = 90 - (point.value / max) * 60;
        return (
          <g key={point.label}>
            <circle cx={x} cy={y} r="3" fill="#ffffff" stroke={BRAND_COLORS.teal} strokeWidth="1.4" />
            <text
              x={x}
              y="104"
              textAnchor="middle"
              fontSize="9"
              fill="rgba(100,116,139,1)"
            >
              {point.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default AdminMetricsChart;

