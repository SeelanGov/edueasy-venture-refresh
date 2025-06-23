
// Design System Tokens
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
} as const;

export const statusColors = {
  success: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
  },
  warning: {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    border: 'border-yellow-200',
  },
  error: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
  },
  info: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
  },
  pending: {
    bg: 'bg-gray-50',
    text: 'text-gray-700',
    border: 'border-gray-200',
  },
} as const;

export const spacing = {
  xs: '0.5rem',
  sm: '0.75rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
} as const;

export type StatusType = keyof typeof statusColors;
