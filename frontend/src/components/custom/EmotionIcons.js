import React from 'react';

const baseProps = {
  width: 48,
  height: 48,
  viewBox: '0 0 48 48'
};

const deepBlue = '#0A2540';
const teal = '#00B4D8';
const coral = '#FF6B6B';

export const JoyIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill={teal} stroke={deepBlue} strokeWidth="2" />
    <path d="M16 20 C18 18, 20 18, 22 20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 20 C28 18, 30 18, 32 20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 28 C20 34, 28 34, 32 28" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const CalmIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="6" y="6" width="36" height="36" rx="18" fill="#ffffff" stroke={teal} strokeWidth="2" />
    <path d="M16 20 C18 19, 20 19, 22 20" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M26 20 C28 19, 30 19, 32 20" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 30 C20 28, 28 28, 32 30" fill="none" stroke={teal} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AnxiousIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill="#ffffff" stroke={coral} strokeWidth="2" />
    <circle cx="18" cy="20" r="3" fill={coral} />
    <circle cx="30" cy="20" r="3" fill={coral} />
    <path d="M16 32 C20 26, 28 26, 32 32" fill="none" stroke={coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 16 L18 18" fill="none" stroke={coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M30 18 L34 16" fill="none" stroke={coral} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SadnessIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill={deepBlue} stroke={deepBlue} strokeWidth="2" />
    <circle cx="18" cy="20" r="2" fill="#ffffff" />
    <circle cx="30" cy="20" r="2" fill="#ffffff" />
    <path d="M18 32 C22 28, 26 28, 30 32" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 34 C16 37, 18 39, 19 40" fill="none" stroke={teal} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const AngerIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="6" y="6" width="36" height="36" rx="8" fill={coral} stroke={deepBlue} strokeWidth="2" />
    <path d="M16 20 L20 18" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M32 20 L28 18" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 30 C20 32, 28 32, 32 30" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M18 14 L22 12" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M26 12 L30 14" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const TrustIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill="#ffffff" stroke={teal} strokeWidth="2" />
    <path
      d="M16 26 L22 32 L34 18"
      fill="none"
      stroke={teal}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="18" cy="18" r="3" fill={deepBlue} />
    <circle cx="30" cy="18" r="3" fill={deepBlue} />
  </svg>
);

export const FearIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    <circle cx="18" cy="20" r="3" fill={deepBlue} />
    <circle cx="30" cy="20" r="3" fill={deepBlue} />
    <path d="M16 32 C20 30, 28 30, 32 32" fill="none" stroke={coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M24 12 L24 16" fill="none" stroke={coral} strokeWidth="2" strokeLinecap="round" />
    <path d="M20 14 L28 14" fill="none" stroke={coral} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const SurpriseIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill={teal} stroke={deepBlue} strokeWidth="2" />
    <circle cx="18" cy="20" r="3" fill="#ffffff" />
    <circle cx="30" cy="20" r="3" fill="#ffffff" />
    <circle cx="24" cy="30" r="3" fill={deepBlue} />
    <path d="M24 10 L24 6" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 12 L12 8" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M32 12 L36 8" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const LoveIcon = (props) => (
  <svg {...baseProps} {...props}>
    <rect x="6" y="6" width="36" height="36" rx="18" fill="#ffffff" stroke={coral} strokeWidth="2" />
    <path
      d="M24 34 L16 26 C13 23, 13 18, 16 16 C18 14, 21 15, 24 18 C27 15, 30 14, 32 16 C35 18, 35 23, 32 26 Z"
      fill={coral}
      stroke={deepBlue}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export const ExcitementIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill={coral} stroke={deepBlue} strokeWidth="2" />
    <path d="M14 30 C18 34, 30 34, 34 30" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M16 18 L20 20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 18 L28 20" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M12 14 L16 12" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    <path d="M36 14 L32 12" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const ContentmentIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill="#ffffff" stroke={teal} strokeWidth="2" />
    <path d="M16 20 C18 21, 20 21, 22 20" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M26 20 C28 21, 30 21, 32 20" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 28 C20 32, 28 32, 32 28" fill="none" stroke={teal} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 26 C16 30, 32 30, 34 26" fill="none" stroke={teal} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
  </svg>
);

export const ConfusionIcon = (props) => (
  <svg {...baseProps} {...props}>
    <circle cx="24" cy="24" r="20" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    <circle cx="18" cy="18" r="2.5" fill={deepBlue} />
    <circle cx="30" cy="18" r="2.5" fill={deepBlue} />
    <path
      d="M18 30 C18 26, 22 26, 24 26 C26 26, 30 26, 30 22"
      fill="none"
      stroke={coral}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="34" r="1.8" fill={coral} />
  </svg>
);

const EmotionIcons = {
  JoyIcon,
  CalmIcon,
  AnxiousIcon,
  SadnessIcon,
  AngerIcon,
  TrustIcon,
  FearIcon,
  SurpriseIcon,
  LoveIcon,
  ExcitementIcon,
  ContentmentIcon,
  ConfusionIcon
};

export default EmotionIcons;

