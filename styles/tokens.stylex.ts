import * as stylex from '@stylexjs/stylex';

// Design tokens matching theme colors and design system
export const colors = stylex.defineVars({
  background: 'hsl(210 40% 98%)',
  foreground: 'hsl(222 47% 11%)',
  card: 'hsl(0 0% 100%)',
  cardForeground: 'hsl(222 47% 11%)',
  popover: 'hsl(0 0% 100%)',
  popoverForeground: 'hsl(222 47% 11%)',
  primary: 'hsl(221 83% 53%)',
  primaryForeground: 'hsl(210 40% 98%)',
  secondary: 'hsl(210 40% 96%)',
  secondaryForeground: 'hsl(222 47% 11%)',
  muted: 'hsl(210 40% 96%)',
  mutedForeground: 'hsl(215 16% 47%)',
  accent: 'hsl(210 40% 96%)',
  accentForeground: 'hsl(222 47% 11%)',
  destructive: 'hsl(0 84% 60%)',
  destructiveForeground: 'hsl(0 0% 98%)',
  border: 'hsl(214 32% 91%)',
  input: 'hsl(214 32% 91%)',
  ring: 'hsl(221 83% 53%)',

  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',

  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',

  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',

  indigo50: '#eef2ff',
  indigo200: '#c7d2fe',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',
  indigo700: '#4338ca',

  red50: '#fef2f2',
  red100: '#fee2e2',
  red200: '#fecaca',
  red500: '#ef4444',
  red600: '#dc2626',
  red700: '#b91c1c',

  amber50: '#fffbeb',
  amber200: '#fde68a',
  amber700: '#b45309',

  orange50: '#fff7ed',
  orange200: '#fed7aa',
  orange700: '#c2410c',

  purple50: '#faf5ff',
  purple200: '#e9d5ff',
  purple700: '#7e22ce',

  sky50: '#f0f9ff',
  sky200: '#bae6fd',
  sky700: '#0369a1',

  emerald50: '#ecfdf5',
  emerald200: '#a7f3d0',
  emerald700: '#047857',
});

export const spacing = stylex.defineVars({
  px: '1px',
  0: '0px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
});

export const radii = stylex.defineVars({
  none: '0px',
  sm: 'calc(0.5rem - 4px)',
  md: 'calc(0.5rem - 2px)',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  full: '9999px',
});

export const fonts = stylex.defineVars({
  sans: 'Arial, Helvetica, sans-serif',
});
