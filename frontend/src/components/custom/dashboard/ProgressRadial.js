import React from 'react';
import { BRAND_COLORS } from '../../../assets/brand';

const ProgressRadial = ({ value }) => {
  const radius = 42;
  const stroke = 8;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <svg width="120" height="120" viewBox="0 0 120 120" aria-hidden="true">
      <defs>
        <linearGradient id="radial-progress" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor={BRAND_COLORS.teal} />
          <stop offset="100%" stopColor={BRAND_COLORS.coral} />
        </linearGradient>
      </defs>
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        fill="none"
        stroke="rgba(148,163,184,0.35)"
        strokeWidth={stroke}
      />
      <circle
        cx="60"
        cy="60"
        r={normalizedRadius}
        fill="none"
        stroke="url(#radial-progress)"
        strokeWidth={stroke}
        strokeDasharray={circumference + ' ' + circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
      />
      <text
        x="60"
        y="56"
        textAnchor="middle"
        fontSize="20"
        fontWeight="600"
        fill={BRAND_COLORS.deepBlue}
      >
        {value}%
      </text>
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fontSize="10"
        fill="rgba(100,116,139,1)"
      >
        On track
      </text>
    </svg>
  );
};

export default ProgressRadial;

