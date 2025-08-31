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
  destructive: designTokens.colors.error,
  error: designTokens.colors.error,
  info: designTokens.colors.info,

  // Gray scale
  gray: designTokens.colors.gray,

  // Semantic colors for shadcn/ui
  muted: {
    DEFAULT: 'hsl(var(--muted))',
    foreground: 'hsl(var(--muted-foreground))',
  },
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',
  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',
  popover: {
    DEFAULT: 'hsl(var(--popover))',
    foreground: 'hsl(var(--popover-foreground))',
  },
  card: {
    DEFAULT: 'hsl(var(--card))',
    foreground: 'hsl(var(--card-foreground))',
  },
};
