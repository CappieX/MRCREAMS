import React from 'react';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS } from '../../assets/brand';

const { deepBlue, teal, coral } = BRAND_COLORS;

const baseCardStyle = {
  background: '#ffffff',
  borderRadius: BRAND_RADII.lg,
  boxShadow: BRAND_SHADOWS.soft,
  padding: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  border: `1px solid rgba(10, 37, 64, 0.08)`,
  maxWidth: 420
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: 16
};

const metaStyle = {
  display: 'flex',
  flexDirection: 'column'
};

const quoteStyle = {
  fontSize: 14,
  lineHeight: 1.6,
  color: 'rgba(10, 37, 64, 0.86)'
};

const metricPillStyle = {
  padding: '4px 10px',
  borderRadius: BRAND_RADII.pill,
  fontSize: 12,
  fontWeight: 600,
  background: 'rgba(0, 180, 216, 0.08)',
  color: teal
};

export const TestimonialCard = ({
  avatar,
  name,
  role,
  quote,
  metricLabel,
  metricValue,
  tone = 'teal'
}) => {
  const accent = tone === 'coral' ? coral : tone === 'blue' ? deepBlue : teal;

  return (
    <div style={baseCardStyle}>
      <div style={headerStyle}>
        <div style={{ flexShrink: 0 }}>{avatar}</div>
        <div style={metaStyle}>
          <span style={{ fontWeight: 700, color: deepBlue }}>{name}</span>
          <span style={{ fontSize: 12, color: 'rgba(10, 37, 64, 0.6)' }}>{role}</span>
        </div>
      </div>
      <div style={quoteStyle}>"{quote}"</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={metricPillStyle}>
          {metricValue} {metricLabel}
        </div>
        <div style={{ display: 'flex', gap: 4, color: accent, fontSize: 18 }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>
    </div>
  );
};

export const coupleTestimonials = [
  {
    name: 'Sarah & Michael',
    role: 'Married, 3 years',
    quote:
      'In three weeks, MR.CREAMS helped us turn recurring fights into calm, honest conversations.',
    metricLabel: 'better communication',
    metricValue: '85%'
  },
  {
    name: 'Amina & Luis',
    role: 'Engaged',
    quote:
      'We use the emotion check-ins before difficult talks. It changed how we listen to each other.',
    metricLabel: 'fewer conflict spirals',
    metricValue: '40%'
  },
  {
    name: 'Jordan & Alex',
    role: 'Dating, long distance',
    quote:
      'The harmony timeline gave us a shared language for progress instead of blame.',
    metricLabel: 'increase in shared “calm” days',
    metricValue: '72%'
  },
  {
    name: 'Priya & Ravi',
    role: 'Parents of two',
    quote:
      'Seeing our emotional patterns on one screen helped us break a 10-year argument loop.',
    metricLabel: 'drop in recurring arguments',
    metricValue: '63%'
  }
];

export const therapistTestimonials = [
  {
    name: 'Dr. Ellis',
    role: 'Couples therapist',
    quote:
      'MR.CREAMS compresses what used to take three sessions of probing into a single visual story.',
    metricLabel: 'time saved on assessment',
    metricValue: '40%'
  },
  {
    name: 'Kim Seo',
    role: 'LMFT',
    quote:
      'The emotion intensity spider chart lets my clients “see” what they could only feel before.',
    metricLabel: 'clients reporting clearer self-understanding',
    metricValue: '78%'
  },
  {
    name: 'Dr. Rivera',
    role: 'Clinical supervisor',
    quote:
      'My team uses the harmony timeline to track risk signals without losing nuance or context.',
    metricLabel: 'reduction in missed risk flags',
    metricValue: '32%'
  },
  {
    name: 'Casey Rowan',
    role: 'Trauma-informed therapist',
    quote:
      'The MR.CREAMS dashboard lets me stay relational while the AI quietly tracks the data.',
    metricLabel: 'documentation time saved',
    metricValue: '45%'
  }
];

