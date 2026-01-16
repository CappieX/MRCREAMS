import React from 'react';
import { BRAND_COLORS, BRAND_SPACING, BRAND_RADII, BRAND_SHADOWS } from '../../assets/brand';
import { ANIMATIONS } from '../../styles/custom-theme';
import { cn } from '../../lib/utils';

const baseClasses =
  'inline-flex items-center justify-center whitespace-nowrap select-none font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-60 disabled:pointer-events-none transition-transform';

const sizeClasses = {
  sm: 'h-9 px-3 text-xs',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

const variantStyles = {
  primary: {
    backgroundColor: BRAND_COLORS.teal,
    color: '#ffffff',
    boxShadow: BRAND_SHADOWS.subtle
  },
  secondary: {
    backgroundColor: BRAND_COLORS.coral,
    color: '#ffffff',
    boxShadow: BRAND_SHADOWS.soft
  },
  outline: {
    backgroundColor: '#ffffff',
    color: BRAND_COLORS.deepBlue,
    border: `1px solid rgba(10,37,64,0.22)`
  },
  ghost: {
    backgroundColor: 'transparent',
    color: BRAND_COLORS.deepBlue
  }
};

export const BrandButton = React.forwardRef(
  ({ as: Element = 'button', variant = 'primary', size = 'md', className, style, ...props }, ref) => {
    const variantStyle = variantStyles[variant] || variantStyles.primary;

    return (
      <Element
        ref={ref}
        className={cn(
          baseClasses,
          sizeClasses[size] || sizeClasses.md,
          'rounded-xl',
          'active:translate-y-[1px]',
          className
        )}
        style={{
          paddingInline: BRAND_SPACING.md,
          borderRadius: BRAND_RADII.lg,
          transitionDuration: `${ANIMATIONS.durations.base}ms`,
          transitionTimingFunction: ANIMATIONS.easing.standard,
          ...variantStyle,
          ...style
        }}
        {...props}
      />
    );
  }
);

BrandButton.displayName = 'BrandButton';

