import React from 'react';
import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../../assets/brand';
import { ANIMATIONS } from '../../styles/custom-theme';
import { cn } from '../../lib/utils';

export const BrandCard = ({
  as: Element = 'section',
  tone = 'surface',
  interactive = false,
  className,
  style,
  children,
  header,
  ...props
}) => {
  const background =
    tone === 'surface'
      ? '#ffffff'
      : tone === 'tinted'
      ? 'linear-gradient(135deg, rgba(0,180,216,0.06), rgba(255,107,107,0.06))'
      : '#0A2540';

  return (
    <Element
      className={cn(
        'relative flex flex-col',
        interactive && 'transition-transform hover:-translate-y-0.5',
        className
      )}
      style={{
        background,
        borderRadius: BRAND_RADII.lg,
        padding: BRAND_SPACING.lg,
        boxShadow: BRAND_SHADOWS.subtle,
        border: tone === 'surface' ? '1px solid rgba(10,37,64,0.08)' : 'none',
        overflow: 'hidden',
        transitionDuration: `${ANIMATIONS.durations.slow}ms`,
        transitionTimingFunction: ANIMATIONS.easing.subtle,
        ...style
      }}
      {...props}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          insetInline: -24,
          top: -40,
          height: 80,
          background:
            tone === 'surface'
              ? `linear-gradient(90deg, ${BRAND_COLORS.teal}22, ${BRAND_COLORS.coral}15)`
              : `linear-gradient(90deg, ${BRAND_COLORS.teal}33, ${BRAND_COLORS.coral}33)`,
          transform: 'skewY(-6deg)',
          opacity: 0.9
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {header && (
          <div
            style={{
              marginBottom: BRAND_SPACING.md,
              display: 'flex',
              alignItems: 'baseline',
              justifyContent: 'space-between',
              gap: BRAND_SPACING.sm
            }}
          >
            {header.title && (
              <h3
                style={{
                  fontFamily: '"Poppins", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                  fontSize: 18,
                  fontWeight: 600,
                  color: tone === 'elevated' ? '#ffffff' : BRAND_COLORS.deepBlue
                }}
              >
                {header.title}
              </h3>
            )}
            {header.meta && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 500,
                  color: tone === 'elevated' ? 'rgba(255,255,255,0.7)' : 'rgba(10,37,64,0.7)'
                }}
              >
                {header.meta}
              </span>
            )}
          </div>
        )}
        {children}
      </div>
    </Element>
  );
};

