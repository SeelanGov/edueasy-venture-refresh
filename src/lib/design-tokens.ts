// Design Tokens for EduEasy
// Centralized color and spacing system for consistent UI

export const designTokens = {
  colors: {
    // Primary brand colors (South African theme)
    primary: 'hsl(var(--cap-teal-hue) var(--cap-teal-saturation) var(--cap-teal-lightness))',
    secondary: 'hsl(var(--cap-coral-hue) var(--cap-coral-saturation) var(--cap-coral-lightness))',
    accent: 'hsl(var(--cap-coral-hue) var(--cap-coral-saturation) var(--cap-coral-lightness)',

    // Semantic colors
    success: 'hsl(var(--success-hue) var(--success-saturation) var(--success-lightness))',
    error: 'hsl(var(--error-hue) var(--error-saturation) var(--error-lightness))',
    warning: 'hsl(var(--warning-hue) var(--warning-saturation) var(--warning-lightness))',
    info: 'hsl(var(--info-hue) var(--info-saturation) var(--info-lightness))',

    // Neutral colors
    white: 'hsl(var(--cap-light-hue) var(--cap-light-saturation) var(--cap-light-lightness))',
    black: 'hsl(var(--cap-dark-hue) var(--cap-dark-saturation) var(--cap-dark-lightness))',
    gray: {
      50: 'hsl(var(--gray-50))',
      100: 'hsl(var(--gray-100))',
      200: 'hsl(var(--gray-200))',
      300: 'hsl(var(--gray-300))',
      400: 'hsl(var(--gray-400))',
      500: 'hsl(var(--gray-500))',
      600: 'hsl(var(--gray-600))',
      700: 'hsl(var(--gray-700))',
      800: 'hsl(var(--gray-800))',
      900: 'hsl(var(--gray-900))',
    },

    // Status colors
    status: {
      pending: 'hsl(var(--warning-hue) var(--warning-saturation) var(--warning-lightness))',
      approved: 'hsl(var(--success-hue) var(--success-saturation) var(--success-lightness))',
      rejected: 'hsl(var(--error-hue) var(--error-saturation) var(--error-lightness))',
      draft: 'hsl(var(--gray-500))',
      submitted: 'hsl(var(--info-hue) var(--info-saturation) var(--info-lightness))',
    },

    // Background colors
    background: {
      primary: 'hsl(var(--background))',
      secondary: 'hsl(var(--muted))',
      tertiary: 'hsl(var(--muted))',
      dark: 'hsl(var(--cap-dark-hue) var(--cap-dark-saturation) var(--cap-dark-lightness))',
    },

    // Text colors
    text: {
      primary: 'hsl(var(--foreground))',
      secondary: 'hsl(var(--muted-foreground))',
      disabled: 'hsl(var(--muted-foreground))',
      inverse: 'hsl(var(--background))',
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },

  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },

  typography: {
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
      xxxl: '32px',
    },
    fontWeights: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

// Utility functions for design tokens
export const getColor = (path: string): string => {
  const keys = path.split('.');
  let value: any = designTokens.colors;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Color path "${path}" not found in design tokens`);
      return designTokens.colors.gray[500]; // Fallback
    }
  }

  return String(value);
};

export const getSpacing = (size: keyof typeof designTokens.spacing): string => {
  return designTokens.spacing[size];
};

// Status color types and mappings
export type ExtendedStatusType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'submitted'
  | 'under-review'
  | 'resubmission-required';

// Status color mappings
export const statusColors = {
  success: {
    bg: 'bg-success',
    text: `text-white`,
    border: 'border-success',
  },
  error: {
    bg: 'bg-error',
    text: `text-white`,
    border: 'border-error',
  },
  warning: {
    bg: 'bg-warning',
    text: `text-white`,
    border: 'border-warning',
  },
  info: {
    bg: 'bg-info',
    text: `text-white`,
    border: 'border-info',
  },
};

export const extendedStatusColors: Record<
  ExtendedStatusType,
  { bg: string; text: string; border: string }
> = {
  ...statusColors,
  pending: {
    bg: 'bg-warning',
    text: `text-white`,
    border: 'border-warning',
  },
  approved: {
    bg: 'bg-success',
    text: `text-white`,
    border: 'border-success',
  },
  rejected: {
    bg: 'bg-error',
    text: `text-white`,
    border: 'border-error',
  },
  submitted: {
    bg: 'bg-info',
    text: `text-white`,
    border: 'border-info',
  },
  'under-review': {
    bg: 'bg-info',
    text: `text-white`,
    border: 'border-info',
  },
  'resubmission-required': {
    bg: 'bg-warning',
    text: `text-white`,
    border: 'border-warning',
  },
};

// Tailwind CSS class helpers
export const tailwindClasses = {
  // Background colors
  bgPrimary: 'bg-primary',
  bgSecondary: 'bg-secondary',
  bgSuccess: 'bg-success',
  bgError: 'bg-error',
  bgWarning: 'bg-warning',
  bgInfo: 'bg-info',

  // Text colors
  textPrimary: 'text-primary',
  textSecondary: 'text-secondary',
  textSuccess: 'text-success',
  textError: 'text-error',
  textWarning: 'text-warning',
  textInfo: 'text-info',

  // Border colors
  borderPrimary: 'border-primary',
  borderSecondary: 'border-secondary',
  borderSuccess: 'border-success',
  borderError: 'border-error',
  borderWarning: 'border-warning',
  borderInfo: 'border-info',

  // Status colors
  bgStatusPending: 'bg-warning',
  bgStatusApproved: 'bg-success',
  bgStatusRejected: 'bg-error',
  bgStatusDraft: 'bg-muted',
  bgStatusSubmitted: 'bg-info',

  textStatusPending: 'text-warning',
  textStatusApproved: 'text-success',
  textStatusRejected: 'text-error',
  textStatusDraft: 'text-muted-foreground',
  textStatusSubmitted: 'text-info',
};

export default designTokens;
