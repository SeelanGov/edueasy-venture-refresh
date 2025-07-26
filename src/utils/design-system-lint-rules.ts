// ESLint rules for design system compliance

/**
 * DESIGN_SYSTEM_VIOLATIONS
 * @description Function
 */
export const DESIGN_SYSTEM_VIOLATIONS = {
  // Hardcoded colors that should use design tokens
  HARDCODED_COLORS: [
    /bg-(blue|red|green|yellow|purple|pink|indigo|orange|cyan|lime|emerald|sky|violet|fuchsia|rose)-\d+/g,
    /text-(blue|red|green|yellow|purple|pink|indigo|orange|cyan|lime|emerald|sky|violet|fuchsia|rose)-\d+/g,
    /border-(blue|red|green|yellow|purple|pink|indigo|orange|cyan|lime|emerald|sky|violet|fuchsia|rose)-\d+/g,
  ],

  // Raw HTML elements that should use components
  RAW_ELEMENTS: {
    button: 'Use Button component from @/components/ui/button',
    card: 'Use Card component from @/components/ui/card',
    badge: 'Use Badge or StatusBadge component',
  },

  // Spacing that should use design tokens
  HARDCODED_SPACING: [/p-\d+/g, /m-\d+/g, /gap-\d+/g],
};

/**
 * validateDesignSystemUsage
 * @description Function
 */
export const validateDesignSystemUsage = (
  code: string,
): {
  violations: string[];
  suggestions: string[];
} => {
  const violations: string[] = [];
  const suggestions: string[] = [];

  // Check for hardcoded colors
  DESIGN_SYSTEM_VIOLATIONS.HARDCODED_COLORS.forEach((regex) => {
    const matches = code.match(regex);
    if (matches) {
      violations.push(`Hardcoded colors found: ${matches.join(', ')}`);
      suggestions.push(
        'Use StatusBadge for status colors or design tokens from @/lib/design-tokens',
      );
    }
  });

  // Check for raw buttons
  if (code.includes('<button') && !code.includes('Button')) {
    violations.push('Raw <button> element found');
    suggestions.push('Use Button component from @/components/ui/button');
  }

  // Check for manual card styling
  if (code.includes('className="border') && !code.includes('<Card')) {
    violations.push('Manual card styling detected');
    suggestions.push('Use Card component from @/components/ui/card');
  }

  return { violations, suggestions };
};
