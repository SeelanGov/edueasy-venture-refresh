// Design Tokens for EduEasy
// Centralized color and spacing system for consistent UI

export const designTokens = {
  colors: {
    // Primary brand colors (South African theme)
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',

    // Semantic colors
    success: 'hsl(var(--success))',
    error: 'hsl(var(--destructive))',
    warning: 'hsl(var(--warning))',
    info: 'hsl(var(--info))',

    // Neutral colors
    white: 'hsl(var(--background))',
    black: 'hsl(var(--foreground))',
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
      pending: 'hsl(var(--warning))',
      approved: 'hsl(var(--success))',
      rejected: 'hsl(var(--destructive))',
      draft: 'hsl(var(--muted-foreground))',
      submitted: 'hsl(var(--info))',
    },

    // Background colors
    background: {
      primary: 'hsl(var(--background))',
      secondary: 'hsl(var(--muted))',
      tertiary: 'hsl(var(--muted))',
      dark: 'hsl(var(--foreground))',
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
