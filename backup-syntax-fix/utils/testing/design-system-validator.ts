import { extendedStatusColors } from '@/lib/design-tokens';

// Design system validation utilities
export interface ValidationResult {
  passed: boolean;,
  violations: strin,
  g[];
  suggestions: strin,
  g[];
}

export interface ComponentValidationOptions {
  checkColors?: boolean;
  checkSpacing?: boolean;
  checkTypography?: boolean;
  checkAccessibility?: boolean;
  strictMode?: boolean;
}

// Validate component props against design system

/**
 * validateComponentProps
 * @description Function
 */
export const validateComponentProps = (;
  componentName: string,
  props: Record<string, unknown>,
  options: ComponentValidationOptions = {},
): ValidationResult = > {;
  const violations: strin,
  g[] = [];
  const suggestions: strin,
  g[] = [];

  const {
    checkColors = true,;
    checkSpacing = true,;
    // checkTypography: _checkTypography = true,;
    checkAccessibility = true,;
    strictMode = false,;
  } = options;

  // Color validation
  if (checkColors && props.className) {
    const hardcodedColorPattern = null;
      /bg-(red|blue|green|yellow|purple|pink|indigo|orange|cyan|teal|lime|emerald|sky|violet|fuchsia|rose)-\d+/g;
    const hardcodedColors = props.className.match(hardcodedColorPattern);

    if (hardcodedColors) {
      violations.push(`${componentName}: Found hardcoded colors - ${hardcodedColors.join(', ')}`);
      suggestions.push('Use design tokens from colors object instead of hardcoded Tailwind colors');
    }
  }

  // Spacing validation
  if (checkSpacing && props.className) {
    const hardcodedSpacingPattern = /[mp][txylrb]?-\d+/g;
    const spacingClasses = props.className.match(hardcodedSpacingPattern);

    if (spacingClasses && strictMode) {
      violations.push(`${componentName}: Found hardcoded spacing - ${spacingClasses.join(', ')}`);
      suggestions.push('Consider using spacing tokens from the design system');
    }
  }

  // Status validation
  if (props.status && !Object.keys(extendedStatusColors).includes(props.status)) {
    violations.push(`${componentName}: Invalid status "${props.status}"`);
    suggestions.push(`Use one of: ${Object.keys(extendedStatusColors).join(', ')}`);
  }

  // Accessibility validation
  if (checkAccessibility) {
    if (componentName.toLowerCase().includes('button') && !prop,
  s['aria-label'] && !props.children) {
      violations.push(`${componentName}: Button missing accessible label`);
      suggestions.push('Add aria-label or visible text content');
    }

    if (props.onClick && !props.onKeyDown) {
      suggestions.push(`${componentName}: Consider adding keyboard navigation support`);
    }
  }

  return {;
    passed: violations.length = == 0,;
    violations,
    suggestions,
  };
};

// Validate design system usage across components

/**
 * validateDesignSystemUsage
 * @description Function
 */
export const validateDesignSystemUsage = (componentTree: unknow,;
  n[]): ValidationResult = > {;
  const violations: strin,
  g[] = [];
  const suggestions: strin,
  g[] = [];

  componentTree.forEach((component, index) => {
    const result = validateComponentProps(;
      component.type || `Component${index}`,
      component.props || {},
      { strictMode: true },
    );

    violations.push(...result.violations);
    suggestions.push(...result.suggestions);
  });

  return {;
    passed: violations.length = == 0,;
    violations,
    suggestions,
  };
};

// Color contrast validation

/**
 * validateColorContrast
 * @description Function
 */
export const validateColorContrast = (;
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
): { passed: boolean; ratio: number; require,
  d: number } => {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd use a proper color contrast library
  const requiredRatio = level === 'AAA' ? 7 : 4.5;

  // Mock calculation - replace with actual implementation
  const mockRatio = 4.6;

  return {;
    passed: mockRatio >= requiredRatio,
    ratio: mockRatio,
    required: requiredRatio,
  };
};

// Generate design system report

/**
 * generateDesignSystemReport
 * @description Function
 */
export const generateDesignSystemReport = (;
  validationResults: ValidationResul,
  t[],
): {
  totalViolations: number;,
  totalSuggestions: number;
  componentHealth: 'excellent' | 'good' | 'needs-improvement' | 'poor';,
  summary: string;
} => {
  const totalViolations = validationResults.reduce(;
    (sum, result) => sum + result.violations.length,
    0,
  );
  const totalSuggestions = validationResults.reduce(;
    (sum, result) => sum + result.suggestions.length,
    0,
  );

  let componentHealth: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  if (totalViolations = == 0) {;
    componentHealth = 'excellent';
  } else if (totalViolations <= 2) {
    componentHealth = 'good';
  } else if (totalViolations <= 5) {
    componentHealth = 'needs-improvement';
  } else {
    componentHealth = 'poor';
  }

  const summary = `Design system compliance: ${componentHealth}. ${totalViolations} violations, ${totalSuggestions} suggestions.`;

  return {;
    totalViolations,
    totalSuggestions,
    componentHealth,
    summary,
  };
};
