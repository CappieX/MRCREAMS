import React from 'react';
import { BRAND_COLORS } from '../../assets/brand';

const { deepBlue, teal, coral } = BRAND_COLORS;

export const EmotionWheel = (props) => (
  <svg width="260" height="260" viewBox="0 0 260 260" {...props}>
    <circle cx="130" cy="130" r="120" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    {Array.from({ length: 12 }).map((_, index) => {
      const angle = (index / 12) * Math.PI * 2;
      const nextAngle = ((index + 1) / 12) * Math.PI * 2;
      const innerR = 40;
      const outerR = 120;
      const x1 = 130 + innerR * Math.cos(angle);
      const y1 = 130 + innerR * Math.sin(angle);
      const x2 = 130 + outerR * Math.cos(angle);
      const y2 = 130 + outerR * Math.sin(angle);
      const x3 = 130 + outerR * Math.cos(nextAngle);
      const y3 = 130 + outerR * Math.sin(nextAngle);
      const x4 = 130 + innerR * Math.cos(nextAngle);
      const y4 = 130 + innerR * Math.sin(nextAngle);
      const segmentColor =
        index % 3 === 0 ? teal : index % 3 === 1 ? coral : deepBlue;
      return (
        <path
          key={index}
          d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 0 0 ${x1} ${y1} Z`}
          fill={segmentColor}
          opacity="0.18"
        />
      );
    })}
    <circle cx="130" cy="130" r="32" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    <circle cx="130" cy="130" r="6" fill={teal} />
  </svg>
);

export const HarmonyTimeline = (props) => (
  <svg width="360" height="140" viewBox="0 0 360 140" {...props}>
    <rect x="8" y="8" width="344" height="124" rx="16" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    <line x1="32" y1="90" x2="328" y2="90" stroke="rgba(10,37,64,0.18)" strokeWidth="2" strokeLinecap="round" />
    {[
      { x: 48, label: 'Start', color: coral },
      { x: 132, label: 'Reflect', color: teal },
      { x: 216, label: 'Practice', color: teal },
      { x: 300, label: 'Harmony', color: deepBlue }
    ].map((step, index) => (
      <g key={step.label}>
        <circle cx={step.x} cy="90" r="10" fill="#ffffff" stroke={step.color} strokeWidth="2" />
        <circle cx={step.x} cy="90" r="4" fill={step.color} />
        <text
          x={step.x}
          y="65"
          textAnchor="middle"
          fontSize="11"
          fill={deepBlue}
          style={{ fontWeight: index === 3 ? 700 : 500 }}
        >
          {step.label}
        </text>
      </g>
    ))}
    <path
      d="M 32 92 C 80 40, 160 120, 220 62 C 280 12, 320 82, 328 60"
      fill="none"
      stroke={teal}
      strokeWidth="2"
    />
  </svg>
);

export const EmotionIntensitySpider = (props) => (
  <svg width="260" height="220" viewBox="0 0 260 220" {...props}>
    <circle cx="130" cy="110" r="4" fill={deepBlue} />
    {Array.from({ length: 6 }).map((_, index) => {
      const angle = (index / 6) * Math.PI * 2 - Math.PI / 2;
      const x = 130 + 84 * Math.cos(angle);
      const y = 110 + 84 * Math.sin(angle);
      return (
        <g key={index}>
          <line x1="130" y1="110" x2={x} y2={y} stroke="rgba(10,37,64,0.2)" strokeWidth="1" />
          <circle cx={x} cy={y} r="2" fill="rgba(10,37,64,0.4)" />
        </g>
      );
    })}
    {[28, 56, 84].map((radius, ring) => (
      <circle
        key={radius}
        cx="130"
        cy="110"
        r={radius}
        fill="none"
        stroke="rgba(10,37,64,0.12)"
        strokeWidth="1"
      />
    ))}
    <polygon
      points="130,46 188,94 166,176 94,168 80,92 118,58"
      fill={teal}
      opacity="0.16"
      stroke={teal}
      strokeWidth="2"
    />
  </svg>
);

export const RelationshipBalanceScale = (props) => (
  <svg width="260" height="180" viewBox="0 0 260 180" {...props}>
    <rect x="20" y="140" width="220" height="8" rx="4" fill="rgba(10,37,64,0.12)" />
    <polygon points="120,140 140,140 130,116" fill={deepBlue} />
    <line x1="130" y1="40" x2="130" y2="116" stroke={deepBlue} strokeWidth="2" />
    <line x1="60" y1="64" x2="200" y2="64" stroke={teal} strokeWidth="2" />
    <circle cx="130" cy="64" r="6" fill="#ffffff" stroke={teal} strokeWidth="2" />
    <rect x="36" y="64" width="40" height="20" rx="6" fill="#ffffff" stroke={coral} strokeWidth="2" />
    <rect x="184" y="64" width="40" height="20" rx="6" fill="#ffffff" stroke={teal} strokeWidth="2" />
    <text x="56" y="78" textAnchor="middle" fontSize="11" fill={coral}>
      Self
    </text>
    <text x="204" y="78" textAnchor="middle" fontSize="11" fill={teal}>
      Partner
    </text>
  </svg>
);

export const ConflictResolutionFlow = (props) => (
  <svg width="340" height="180" viewBox="0 0 340 180" {...props}>
    <rect x="8" y="8" width="324" height="164" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    {[
      { x: 40, label: 'Trigger', color: coral },
      { x: 120, label: 'Name Emotions', color: teal },
      { x: 200, label: 'Reframe', color: teal },
      { x: 280, label: 'Repair', color: deepBlue }
    ].map((step, index) => (
      <g key={step.label}>
        <rect
          x={step.x - 40}
          y="40"
          width="80"
          height="40"
          rx="12"
          fill="#ffffff"
          stroke={step.color}
          strokeWidth="2"
        />
        <text
          x={step.x}
          y="64"
          textAnchor="middle"
          fontSize="11"
          fill={deepBlue}
          style={{ fontWeight: index === 3 ? 700 : 500 }}
        >
          {step.label}
        </text>
        {index < 3 && (
          <path
            d={`M ${step.x + 40} 60 C ${step.x + 52} 60, ${step.x + 52} 60, ${step.x + 64} 60`}
            fill="none"
            stroke="rgba(10,37,64,0.5)"
            strokeWidth="2"
            markerEnd="url(#arrowhead)"
          />
        )}
      </g>
    ))}
    <defs>
      <marker
        id="arrowhead"
        markerWidth="8"
        markerHeight="8"
        refX="4"
        refY="4"
        orient="auto"
      >
        <polygon points="0 0, 8 4, 0 8" fill="rgba(10,37,64,0.6)" />
      </marker>
    </defs>
    <path
      d="M 40 120 C 80 140, 160 140, 300 120"
      fill="none"
      stroke="rgba(0,180,216,0.6)"
      strokeWidth="2"
      strokeDasharray="4 4"
    />
  </svg>
);

const DataVisualizations = {
  EmotionWheel,
  HarmonyTimeline,
  EmotionIntensitySpider,
  RelationshipBalanceScale,
  ConflictResolutionFlow
};

export default DataVisualizations;

