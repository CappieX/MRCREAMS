import React from 'react';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS } from '../../assets/brand';

const { deepBlue, teal, coral } = BRAND_COLORS;

const baseFrame = {
  background: '#ffffff',
  borderRadius: BRAND_RADII.lg,
  boxShadow: BRAND_SHADOWS.subtle,
  padding: 24
};

export const OnboardingWelcomeIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="8" y="16" width="404" height="148" rx="24" fill="rgba(0,180,216,0.06)" />
      <circle cx="110" cy="96" r="40" fill="#ffffff" stroke={teal} strokeWidth="2" />
      <circle cx="310" cy="96" r="40" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <path
        d="M150 118 C190 90, 230 90, 270 118"
        fill="none"
        stroke={coral}
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M80 60 C100 40, 120 40, 140 60"
        fill="none"
        stroke={deepBlue}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M280 60 C300 40, 320 40, 340 60"
        fill="none"
        stroke={deepBlue}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const EmotionAnalysisIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="12" y="20" width="396" height="140" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <circle cx="90" cy="90" r="32" fill="rgba(0,180,216,0.12)" stroke={teal} strokeWidth="2" />
      <circle cx="90" cy="90" r="6" fill={teal} />
      <line x1="150" y1="60" x2="360" y2="60" stroke="rgba(10,37,64,0.2)" strokeWidth="2" />
      <path
        d="M150 110 C190 80, 230 120, 270 84 C310 52, 340 94, 360 70"
        fill="none"
        stroke={coral}
        strokeWidth="2"
      />
    </svg>
  </div>
);

export const TherapistDashboardIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="16" y="24" width="388" height="132" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <rect x="32" y="40" width="60" height="104" rx="12" fill="rgba(10,37,64,0.06)" />
      <circle cx="62" cy="76" r="16" fill={teal} />
      <rect x="112" y="48" width="260" height="36" rx="10" fill="rgba(0,180,216,0.06)" />
      <rect x="112" y="96" width="120" height="28" rx="8" fill="rgba(255,107,107,0.08)" />
      <rect x="252" y="96" width="120" height="28" rx="8" fill="rgba(10,37,64,0.06)" />
    </svg>
  </div>
);

export const ClientProgressIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="16" y="32" width="388" height="116" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <line x1="40" y1="120" x2="380" y2="120" stroke="rgba(10,37,64,0.12)" strokeWidth="2" />
      <path
        d="M40 118 C80 96, 140 90, 200 100 C260 110, 320 82, 380 68"
        fill="none"
        stroke={teal}
        strokeWidth="3"
      />
      <circle cx="120" cy="104" r="6" fill={coral} />
      <circle cx="220" cy="98" r="6" fill={teal} />
      <circle cx="320" cy="88" r="6" fill={deepBlue} />
    </svg>
  </div>
);

export const PrivacySecurityIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="32" y="36" width="356" height="108" rx="22" fill="rgba(10,37,64,0.04)" />
      <rect x="88" y="52" width="244" height="88" rx="18" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <path
        d="M210 68 C228 60, 244 60, 262 68 L262 96 C262 112, 244 124, 236 128 C228 124, 210 112, 210 96 Z"
        fill={teal}
      />
      <circle cx="236" cy="94" r="10" fill="#ffffff" />
    </svg>
  </div>
);

export const MobileAppPreviewIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="140" y="24" width="140" height="132" rx="28" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <rect x="154" y="40" width="112" height="40" rx="14" fill="rgba(0,180,216,0.08)" />
      <rect x="154" y="88" width="112" height="16" rx="8" fill="rgba(10,37,64,0.08)" />
      <rect x="154" y="112" width="72" height="16" rx="8" fill="rgba(255,107,107,0.12)" />
      <circle cx="210" cy="140" r="4" fill={deepBlue} />
    </svg>
  </div>
);

export const IntegrationEcosystemIllustration = (props) => (
  <div style={baseFrame} {...props}>
    <svg width="100%" height="180" viewBox="0 0 420 180">
      <rect x="24" y="40" width="372" height="100" rx="22" fill="#ffffff" stroke={deepBlue} strokeWidth="2" />
      <circle cx="120" cy="90" r="22" fill="rgba(0,180,216,0.12)" stroke={teal} strokeWidth="2" />
      <circle cx="210" cy="90" r="22" fill="rgba(255,107,107,0.12)" stroke={coral} strokeWidth="2" />
      <circle cx="300" cy="90" r="22" fill="rgba(10,37,64,0.06)" stroke={deepBlue} strokeWidth="2" />
      <path d="M142 90 L188 90" stroke="rgba(10,37,64,0.4)" strokeWidth="2" strokeLinecap="round" />
      <path d="M232 90 L278 90" stroke="rgba(10,37,64,0.4)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

const Illustrations = {
  OnboardingWelcomeIllustration,
  EmotionAnalysisIllustration,
  TherapistDashboardIllustration,
  ClientProgressIllustration,
  PrivacySecurityIllustration,
  MobileAppPreviewIllustration,
  IntegrationEcosystemIllustration
};

export default Illustrations;

