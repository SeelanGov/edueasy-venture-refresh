// Design System Tokens

/**
 * colors
 * @description Function
 */
export const colors = {
  // Brand colors
  primary: {
    DEFAULT: 'hsl(173, 58%, 39%)', // cap-teal
    50: 'hsl(173, 58%, 95%)',
    100: 'hsl(173, 58%, 90%)',
    200: 'hsl(173, 58%, 80%)',
    300: 'hsl(173, 58%, 70%)',
    400: 'hsl(173, 58%, 60%)',
    500: 'hsl(173, 58%, 50%)',
    600: 'hsl(173, 58%, 39%)', // cap-teal
    700: 'hsl(173, 58%, 30%)',
    800: 'hsl(173, 58%, 20%)',
    900: 'hsl(173, 58%, 10%)',
  },
  secondary: {
    DEFAULT: 'hsl(12, 88%, 59%)', // cap-coral
    50: 'hsl(12, 88%, 95%)',
    100: 'hsl(12, 88%, 90%)',
    200: 'hsl(12, 88%, 80%)',
    300: 'hsl(12, 88%, 70%)',
    400: 'hsl(12, 88%, 60%)',
    500: 'hsl(12, 88%, 59%)', // cap-coral
    600: 'hsl(12, 88%, 50%)',
    700: 'hsl(12, 88%, 40%)',
    800: 'hsl(12, 88%, 30%)',
    900: 'hsl(12, 88%, 20%)',
  },
  // Status colors
  success: {
    DEFAULT: 'hsl(142, 76%, 36%)',
    light: 'hsl(142, 76%, 90%)',
    dark: 'hsl(142, 76%, 25%)',
  },
  warning: {
    DEFAULT: 'hsl(43, 96%, 48%)',
    light: 'hsl(43, 96%, 90%)',
    dark: 'hsl(43, 96%, 35%)',
  },
  error: {
    DEFAULT: 'hsl(0, 84%, 60%)',
    light: 'hsl(0, 84%, 90%)',
    dark: 'hsl(0, 84%, 45%)',
  },
  info: {
    DEFAULT: 'hsl(217, 91%, 60%)',
    light: 'hsl(217, 91%, 90%)',
    dark: 'hsl(217, 91%, 45%)',
  },
  // Consistent gray scale
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
} as const;


/**
 * statusColors
 * @description Function
 */
export const statusColors = {
  success: {
    bg: 'bg-success-light',
    text: 'text-success-dark',
    border: 'border-success',
  },
  warning: {
    bg: 'bg-warning-light',
    text: 'text-warning-dark',
    border: 'border-warning',
  },
  error: {
    bg: 'bg-error-light',
    text: 'text-error-dark',
    border: 'border-error',
  },
  info: {
    bg: 'bg-info-light',
    text: 'text-info-dark',
    border: 'border-info',
  },
  pending: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
} as const;


/**
 * spacing
 * @description Function
 */
export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

// Typography scale

/**
 * typography
 * @description Function
 */
export const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
} as const;

// Status style interface
export interface StatusStyle {
  bg: string;
  text: string;
  border: string;
}

// Base status type
export type StatusType = 'success' | 'error' | 'warning' | 'info' | 'pending';

// Extended status type for application-specific statuses
export type ExtendedStatusType =
  | StatusType
  | 'approved'
  | 'rejected'
  | 'submitted'
  | 'under-review'
  | 'resubmission-required';

// Enhanced status colors with extended types

/**
 * extendedStatusColors
 * @description Function
 */
export const extendedStatusColors: Record<ExtendedStatusType, StatusStyle> = {
  ...statusColors,
  approved: statusColors.success,
  rejected: statusColors.error,
  submitted: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
  },
  'under-review': {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-300',
    border: 'border-amber-200 dark:border-amber-800',
  },
  'resubmission-required': {
    bg: 'bg-orange-50 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-300',
    border: 'border-orange-200 dark:border-orange-800',
  },
};

// Status priority levels for sorting and filtering

/**
 * statusPriority
 * @description Function
 */
export const statusPriority: Record<ExtendedStatusType, number> = {
  error: 1,
  rejected: 2,
  'resubmission-required': 3,
  warning: 4,
  pending: 5,
  'under-review': 6,
  submitted: 7,
  info: 8,
  approved: 9,
  success: 10,
};

// Helper function to get status priority

/**
 * getStatusPriority
 * @description Function
 */
export const getStatusPriority = (status: ExtendedStatusType): number => {
  return statusPriority[status] || 0;
};

// Helper function to sort statuses by priority

/**
 * sortByStatusPriority
 * @description Function
 */
export const sortByStatusPriority = (statuses: ExtendedStatusType[]): ExtendedStatusType[] => {
  return statuses.sort((a, b) => getStatusPriority(a) - getStatusPriority(b));
};
