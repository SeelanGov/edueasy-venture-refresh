import { colors } from './design-tokens';

// Export colors in format expected by Tailwind CSS

/**
 * tailwindColors
 * @description Function
 */
export const tailwindColors = {
  // Brand colors with full scale
  'cap-teal': colors.primary.DEFAULT,
  'cap-coral': colors.secondary.DEFAULT,
  primary: colors.primary,
  secondary: colors.secondary,

  // Status colors
  success: colors.success.DEFAULT,
  'success-light': colors.success.light,
  'success-dark': colors.success.dark,
  warning: colors.warning.DEFAULT,
  'warning-light': colors.warning.light,
  'warning-dark': colors.warning.dark,
  error: colors.error.DEFAULT,
  'error-light': colors.error.light,
  'error-dark': colors.error.dark,
  info: colors.info.DEFAULT,
  'info-light': colors.info.light,
  'info-dark': colors.info.dark,

  // Gray scale
  gray: colors.gray,
};
