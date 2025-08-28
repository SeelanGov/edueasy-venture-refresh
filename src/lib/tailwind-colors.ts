
// Export colors in format expected by Tailwind CSS

/**
 * tailwindColors
 * @description Function
 */
export const tailwindColors = {
  // Brand colors with full scale
  'cap-teal': 'hsl(var(--cap-teal-hue) var(--cap-teal-saturation) var(--cap-teal-lightness))',
  'cap-coral': 'hsl(var(--cap-coral-hue) var(--cap-coral-saturation) var(--cap-coral-lightness))',
  primary: 'hsl(var(--primary))',
  secondary: 'hsl(var(--secondary))',

  // Status colors
  success: 'hsl(var(--success-hue) var(--success-saturation) var(--success-lightness))',
  warning: 'hsl(var(--warning-hue) var(--warning-saturation) var(--warning-lightness))',
  error: 'hsl(var(--error-hue) var(--error-saturation) var(--error-lightness))',
  info: 'hsl(var(--info-hue) var(--info-saturation) var(--info-lightness))',

  // Gray scale
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
};
