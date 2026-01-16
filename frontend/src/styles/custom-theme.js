import { BRAND_COLORS, BRAND_RADII, BRAND_SHADOWS, BRAND_SPACING } from '../assets/brand';

export const TYPOGRAPHY = {
  fontFamilyBody: '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontFamilyHeading: '"Poppins", "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    display: 34
  },
  lineHeights: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.7
  }
};

export const BORDERS = {
  subtle: '1px solid rgba(10,37,64,0.08)',
  strong: '1px solid rgba(10,37,64,0.16)',
  focus: `0 0 0 2px rgba(0,180,216,0.55)`,
  radius: BRAND_RADII
};

export const ANIMATIONS = {
  durations: {
    fast: 120,
    base: 180,
    slow: 260
  },
  easing: {
    standard: 'cubic-bezier(0.21, 0.79, 0.26, 0.99)',
    subtle: 'cubic-bezier(0.16, 1, 0.3, 1)'
  }
};

export const THEME_TOKENS = {
  colors: BRAND_COLORS,
  spacing: BRAND_SPACING,
  radii: BRAND_RADII,
  shadows: BRAND_SHADOWS,
  typography: TYPOGRAPHY,
  borders: BORDERS,
  animations: ANIMATIONS
};

const mapToCssVariables = () => {
  const entries = {};

  entries['color-deep-blue'] = BRAND_COLORS.deepBlue;
  entries['color-teal'] = BRAND_COLORS.teal;
  entries['color-coral'] = BRAND_COLORS.coral;

  Object.entries(BRAND_SPACING).forEach(([key, value]) => {
    entries[`space-${key}`] = `${value}px`;
  });

  Object.entries(BRAND_RADII).forEach(([key, value]) => {
    entries[`radius-${key}`] = `${value}px`;
  });

  Object.entries(BRAND_SHADOWS).forEach(([key, value]) => {
    entries[`shadow-${key}`] = value;
  });

  entries['font-body'] = TYPOGRAPHY.fontFamilyBody;
  entries['font-heading'] = TYPOGRAPHY.fontFamilyHeading;

  Object.entries(TYPOGRAPHY.sizes).forEach(([key, value]) => {
    entries[`font-size-${key}`] = `${value}px`;
  });

  Object.entries(TYPOGRAPHY.lineHeights).forEach(([key, value]) => {
    entries[`line-height-${key}`] = String(value);
  });

  entries['easing-standard'] = ANIMATIONS.easing.standard;
  entries['easing-subtle'] = ANIMATIONS.easing.subtle;
  entries['duration-fast'] = `${ANIMATIONS.durations.fast}ms`;
  entries['duration-base'] = `${ANIMATIONS.durations.base}ms`;
  entries['duration-slow'] = `${ANIMATIONS.durations.slow}ms`;

  return entries;
};

export const CSS_VARIABLES = mapToCssVariables();

export const applyCustomTheme = () => {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(CSS_VARIABLES).forEach(([key, value]) => {
    root.style.setProperty(`--mr-${key}`, value);
  });
};

