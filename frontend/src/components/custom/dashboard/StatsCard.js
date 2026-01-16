import React from 'react';
import { BrandCard } from '../Card';
import { BrandText } from '../Typography';
import { BRAND_COLORS } from '../../../assets/brand';

const arrowUp = (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3 10.5L8 5l5 5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const arrowDown = (
  <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
    <path
      d="M3 5.5L8 11l5-5.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StatsCard = ({
  label,
  value,
  hint,
  trend,
  trendDirection = 'up',
  accent = 'teal'
}) => {
  const accentColor =
    accent === 'coral'
      ? BRAND_COLORS.coral
      : accent === 'navy'
      ? BRAND_COLORS.deepBlue
      : BRAND_COLORS.teal;

  const trendColor =
    trendDirection === 'down'
      ? BRAND_COLORS.coral
      : accentColor;

  return (
    <BrandCard
      tone="surface"
      style={{
        padding: 16
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <BrandText variant="caption" tone="muted">
          {label}
        </BrandText>
        <BrandText
          variant="h2"
          style={{
            fontSize: 24,
            color: accentColor
          }}
        >
          {value}
        </BrandText>
        {hint && (
          <BrandText variant="caption" tone="soft">
            {hint}
          </BrandText>
        )}
        {trend && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              paddingInline: 8,
              paddingBlock: 4,
              borderRadius: 999,
              backgroundColor: 'rgba(15,23,42,0.03)',
              alignSelf: 'flex-start'
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 18,
                height: 18,
                borderRadius: 999,
                backgroundColor:
                  trendDirection === 'down'
                    ? 'rgba(248,113,113,0.14)'
                    : 'rgba(22,163,74,0.14)',
                color: trendColor
              }}
            >
              {trendDirection === 'down' ? arrowDown : arrowUp}
            </span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 500,
                color: trendColor
              }}
            >
              {trend}
            </span>
          </div>
        )}
      </div>
    </BrandCard>
  );
};

export default StatsCard;

