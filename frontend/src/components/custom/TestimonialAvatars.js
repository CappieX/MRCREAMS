import React from 'react';
import { BRAND_COLORS } from '../../assets/brand';

const baseAvatarProps = {
  width: 72,
  height: 72,
  viewBox: '0 0 72 72'
};

const { deepBlue, teal, coral } = BRAND_COLORS;

const CoupleBase = ({ accent, secondaryAccent }) => (
  <svg {...baseAvatarProps}>
    <rect x="4" y="4" width="64" height="64" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    <circle cx="26" cy="30" r="11" fill={accent} />
    <circle cx="46" cy="30" r="11" fill={secondaryAccent} />
    <path d="M18 54 C20 44, 32 44, 36 52" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
    <path d="M36 52 C40 44, 52 44, 54 54" fill="none" stroke={deepBlue} strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const TherapistBase = ({ coatColor }) => (
  <svg {...baseAvatarProps}>
    <rect x="4" y="4" width="64" height="64" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
    <circle cx="36" cy="28" r="12" fill={coatColor} />
    <rect x="22" y="36" width="28" height="18" rx="8" fill={deepBlue} />
    <path d="M30 38 L36 48 L42 38" fill={coatColor} />
    <rect x="18" y="46" width="36" height="12" rx="6" fill="#f5f7fb" />
  </svg>
);

export const CoupleAvatarOne = (props) => (
  <CoupleBase accent={teal} secondaryAccent={coral} {...props} />
);

export const CoupleAvatarTwo = (props) => (
  <CoupleBase accent={coral} secondaryAccent={deepBlue} {...props} />
);

export const CoupleAvatarThree = (props) => (
  <CoupleBase accent={deepBlue} secondaryAccent={teal} {...props} />
);

export const CoupleAvatarFour = (props) => (
  <CoupleBase accent={teal} secondaryAccent={deepBlue} {...props} />
);

export const TherapistAvatarOne = (props) => (
  <TherapistBase coatColor={teal} {...props} />
);

export const TherapistAvatarTwo = (props) => (
  <TherapistBase coatColor={coral} {...props} />
);

export const TherapistAvatarThree = (props) => (
  <TherapistBase coatColor={deepBlue} {...props} />
);

export const TherapistAvatarFour = (props) => (
  <TherapistBase coatColor="#ffffff" {...props} />
);

const TestimonialAvatars = {
  CoupleAvatarOne,
  CoupleAvatarTwo,
  CoupleAvatarThree,
  CoupleAvatarFour,
  TherapistAvatarOne,
  TherapistAvatarTwo,
  TherapistAvatarThree,
  TherapistAvatarFour
};

export default TestimonialAvatars;

