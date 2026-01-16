import React from 'react';
import { TYPOGRAPHY } from '../../styles/custom-theme';
import { cn } from '../../lib/utils';

const variantMap = {
  display: {
    tag: 'h1',
    size: TYPOGRAPHY.sizes.display,
    weight: TYPOGRAPHY.weights.bold,
    line: TYPOGRAPHY.lineHeights.tight
  },
  h1: {
    tag: 'h1',
    size: TYPOGRAPHY.sizes.xl,
    weight: TYPOGRAPHY.weights.bold,
    line: TYPOGRAPHY.lineHeights.snug
  },
  h2: {
    tag: 'h2',
    size: 22,
    weight: TYPOGRAPHY.weights.semibold,
    line: TYPOGRAPHY.lineHeights.snug
  },
  h3: {
    tag: 'h3',
    size: 18,
    weight: TYPOGRAPHY.weights.semibold,
    line: TYPOGRAPHY.lineHeights.snug
  },
  h4: {
    tag: 'h4',
    size: 16,
    weight: TYPOGRAPHY.weights.semibold,
    line: TYPOGRAPHY.lineHeights.normal
  },
  h5: {
    tag: 'h5',
    size: 14,
    weight: TYPOGRAPHY.weights.medium,
    line: TYPOGRAPHY.lineHeights.normal
  },
  h6: {
    tag: 'h6',
    size: 13,
    weight: TYPOGRAPHY.weights.medium,
    line: TYPOGRAPHY.lineHeights.normal
  },
  body: {
    tag: 'p',
    size: TYPOGRAPHY.sizes.md,
    weight: TYPOGRAPHY.weights.regular,
    line: TYPOGRAPHY.lineHeights.relaxed
  },
  subtle: {
    tag: 'p',
    size: TYPOGRAPHY.sizes.sm,
    weight: TYPOGRAPHY.weights.medium,
    line: TYPOGRAPHY.lineHeights.normal
  },
  caption: {
    tag: 'span',
    size: TYPOGRAPHY.sizes.xs,
    weight: TYPOGRAPHY.weights.medium,
    line: TYPOGRAPHY.lineHeights.normal
  }
};

export const BrandText = ({ as, variant = 'body', className, style, children, tone = 'default', ...props }) => {
  const config = variantMap[variant] || variantMap.body;
  const Tag = as || config.tag;

  const color =
    tone === 'muted'
      ? 'rgba(10,37,64,0.65)'
      : tone === 'soft'
      ? 'rgba(10,37,64,0.8)'
      : tone === 'inverted'
      ? '#ffffff'
      : '#0A2540';

  return (
    <Tag
      className={cn(
        variant.startsWith('h') || variant === 'display' ? 'font-heading' : 'font-sans',
        className
      )}
      style={{
        fontFamily:
          variant.startsWith('h') || variant === 'display'
            ? TYPOGRAPHY.fontFamilyHeading
            : TYPOGRAPHY.fontFamilyBody,
        fontSize: config.size,
        fontWeight: config.weight,
        lineHeight: config.line,
        letterSpacing: variant === 'caption' ? 0.04 : 0.01,
        color,
        ...style
      }}
      {...props}
    >
      {children}
    </Tag>
  );
};
