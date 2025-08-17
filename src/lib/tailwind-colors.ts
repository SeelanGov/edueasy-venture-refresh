import { designTokens } from './design-tokens';

// Export colors in format expected by Tailwind CSS

/**
 * tailwindColors
 * @description Function
 */
export const tailwindColors = {
  // Brand colors with full scale
  'cap-teal': designTokens.colors.primary,
  'cap-coral': designTokens.colors.secondary,
  primary: designTokens.colors.primary,
  secondary: designTokens.colors.secondary,

  // Status colors
  success: designTokens.colors.success,
  warning: designTokens.colors.warning,
  error: designTokens.colors.error,
  info: designTokens.colors.info,

  // Gray scale
  gray: designTokens.colors.gray,
};
