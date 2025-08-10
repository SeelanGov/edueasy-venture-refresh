// Design Tokens for EduEasy
// Centralized color and spacing system for consistent UI

export const designTokens = {
  colors: {
    // Primary brand colors (South African theme)
    primary: '#1A3C34', // South African green
    secondary: '#F5A623', // SA flag yellow
    accent: '#E74C3C', // SA flag red

    // Semantic colors
    success: '#388E3C', // Green for success states
    error: '#D32F2F', // Red for error states
    warning: '#F57C00', // Orange for warnings
    info: '#1976D2', // Blue for informational states

    // Neutral colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
    },

    // Status colors
    status: {
      pending: '#FFA000', // Amber
      approved: '#388E3C', // Green
      rejected: '#D32F2F', // Red
      draft: '#757575', // Gray
      submitted: '#1976D2', // Blue
    },

    // Background colors
    background: {
      primary: '#FFFFFF',
      secondary: '#F5F5F5',
      tertiary: '#EEEEEE',
      dark: '#212121',
    },

    // Text colors
    text: {
      primary: '#212121',
      secondary: '#757575',
      disabled: '#BDBDBD',
      inverse: '#FFFFFF',
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
  let value: unknown = designTokens.colors;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Color path "${path}" not found in design tokens`);
      return designTokens.colors.gray[500]; // Fallback
    }
  }

  return value;
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
    bg: `bg-[${designTokens.colors.success}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.success}]`,
  },
  error: {
    bg: `bg-[${designTokens.colors.error}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.error}]`,
  },
  warning: {
    bg: `bg-[${designTokens.colors.warning}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.warning}]`,
  },
  info: {
    bg: `bg-[${designTokens.colors.info}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.info}]`,
  },
};

export const extendedStatusColors: Record<
  ExtendedStatusType,
  { bg: string; text: string; border: string }
> = {
  ...statusColors,
  pending: {
    bg: `bg-[${designTokens.colors.status.pending}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.status.pending}]`,
  },
  approved: {
    bg: `bg-[${designTokens.colors.status.approved}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.status.approved}]`,
  },
  rejected: {
    bg: `bg-[${designTokens.colors.status.rejected}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.status.rejected}]`,
  },
  submitted: {
    bg: `bg-[${designTokens.colors.status.submitted}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.status.submitted}]`,
  },
  'under-review': {
    bg: `bg-[${designTokens.colors.info}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.info}]`,
  },
  'resubmission-required': {
    bg: `bg-[${designTokens.colors.warning}]`,
    text: `text-white`,
    border: `border-[${designTokens.colors.warning}]`,
  },
};

// Tailwind CSS class helpers
export const tailwindClasses = {
  // Background colors
  bgPrimary: `bg-[${designTokens.colors.primary}]`,
  bgSecondary: `bg-[${designTokens.colors.secondary}]`,
  bgSuccess: `bg-[${designTokens.colors.success}]`,
  bgError: `bg-[${designTokens.colors.error}]`,
  bgWarning: `bg-[${designTokens.colors.warning}]`,
  bgInfo: `bg-[${designTokens.colors.info}]`,

  // Text colors
  textPrimary: `text-[${designTokens.colors.primary}]`,
  textSecondary: `text-[${designTokens.colors.secondary}]`,
  textSuccess: `text-[${designTokens.colors.success}]`,
  textError: `text-[${designTokens.colors.error}]`,
  textWarning: `text-[${designTokens.colors.warning}]`,
  textInfo: `text-[${designTokens.colors.info}]`,

  // Border colors
  borderPrimary: `border-[${designTokens.colors.primary}]`,
  borderSecondary: `border-[${designTokens.colors.secondary}]`,
  borderSuccess: `border-[${designTokens.colors.success}]`,
  borderError: `border-[${designTokens.colors.error}]`,
  borderWarning: `border-[${designTokens.colors.warning}]`,
  borderInfo: `border-[${designTokens.colors.info}]`,

  // Status colors
  bgStatusPending: `bg-[${designTokens.colors.status.pending}]`,
  bgStatusApproved: `bg-[${designTokens.colors.status.approved}]`,
  bgStatusRejected: `bg-[${designTokens.colors.status.rejected}]`,
  bgStatusDraft: `bg-[${designTokens.colors.status.draft}]`,
  bgStatusSubmitted: `bg-[${designTokens.colors.status.submitted}]`,

  textStatusPending: `text-[${designTokens.colors.status.pending}]`,
  textStatusApproved: `text-[${designTokens.colors.status.approved}]`,
  textStatusRejected: `text-[${designTokens.colors.status.rejected}]`,
  textStatusDraft: `text-[${designTokens.colors.status.draft}]`,
  textStatusSubmitted: `text-[${designTokens.colors.status.submitted}]`,
};

export default designTokens;
