import React, { useState } from 'react';
import { BRAND_COLORS, BRAND_RADII, BRAND_SPACING } from '../../assets/brand';
import { ANIMATIONS } from '../../styles/custom-theme';
import { cn } from '../../lib/utils';

export const BrandInput = React.forwardRef(
  ({ label, hint, error, className, style, type = 'text', value, onChange, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    const hasValue = value != null && String(value).length > 0;

    const labelRaised = focused || hasValue;

    return (
      <label
        className={cn('block relative', className)}
        style={{
          display: 'block',
          fontFamily: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          ...style
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: labelRaised ? 6 : '50%',
            transform: labelRaised ? 'translateY(0)' : 'translateY(-50%)',
            paddingInline: 6,
            borderRadius: 999,
            fontSize: labelRaised ? 11 : 13,
            fontWeight: labelRaised ? 600 : 500,
            letterSpacing: 0.01,
            color: error ? BRAND_COLORS.coral : 'rgba(10,37,64,0.7)',
            background: '#ffffff',
            transitionProperty: 'all',
            transitionDuration: `${ANIMATIONS.durations.base}ms`,
            transitionTimingFunction: ANIMATIONS.easing.subtle,
            pointerEvents: 'none',
            zIndex: 1
          }}
        >
          {label}
        </div>
        <input
          ref={ref}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full"
          style={{
            width: '100%',
            borderRadius: BRAND_RADII.lg,
            border: error ? `1px solid ${BRAND_COLORS.coral}` : '1px solid rgba(10,37,64,0.22)',
            paddingTop: 18,
            paddingBottom: 10,
            paddingInline: BRAND_SPACING.md,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
            backgroundColor: '#ffffff',
            transitionProperty: 'border-color, box-shadow, background-color',
            transitionDuration: `${ANIMATIONS.durations.base}ms`,
            transitionTimingFunction: ANIMATIONS.easing.standard,
            boxShadow: focused
              ? `0 0 0 1px rgba(0,180,216,0.32), 0 0 0 4px rgba(0,180,216,0.08)`
              : 'none'
          }}
          {...props}
        />
        {hint && !error && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: 'rgba(10,37,64,0.65)'
            }}
          >
            {hint}
          </div>
        )}
        {error && (
          <div
            style={{
              marginTop: 6,
              fontSize: 12,
              color: BRAND_COLORS.coral
            }}
          >
            {error}
          </div>
        )}
      </label>
    );
  }
);

BrandInput.displayName = 'BrandInput';

