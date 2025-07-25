// Accessibility testing utilities
export interface AccessibilityCheckResult {
  passed: boolean;
  issues: AccessibilityIssue[];
  level: 'A' | 'AA' | 'AAA';
}

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  element?: string;
  suggestion?: string;
}

// Type guard to check if element is a form element with labels
const isFormElementWithLabels = (
  element: Element,
): element is HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement => {
  return (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement ||
    element instanceof HTMLSelectElement
  );
};

// Check for common accessibility issues

/**
 * checkAccessibility
 * @description Function
 */
export const checkAccessibility = (
  element: HTMLElement | null,
  level: 'A' | 'AA' | 'AAA' = 'AA',
): AccessibilityCheckResult => {
  const issues: AccessibilityIssue[] = [];

  if (!element) {
    issues.push({
      type: 'error',
      message: 'Element not found',
      suggestion: 'Ensure element exists before accessibility check',
    });

    return { passed: false, issues, level };
  }

  // Check for missing alt text on images
  const images = element.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-label')) {
      issues.push({
        type: 'error',
        message: `Image ${index + 1} missing alt text`,
        element: 'img',
        suggestion: 'Add descriptive alt text or aria-label',
      });
    }
  });

  // Check for missing form labels
  const inputs = element.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');

    let hasLabel = false;
    if (isFormElementWithLabels(input)) {
      hasLabel = Boolean(input.labels && input.labels.length > 0);
    }

    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push({
        type: 'error',
        message: `Form input ${index + 1} missing label`,
        element: input.tagName.toLowerCase(),
        suggestion: 'Add associated label or aria-label',
      });
    }
  });

  // Check for interactive elements without keyboard access
  const interactiveElements = element.querySelectorAll('[onclick], .cursor-pointer');
  interactiveElements.forEach((el, index) => {
    const isButton = el.tagName === 'BUTTON';
    const isLink = el.tagName === 'A';
    const hasTabIndex = el.hasAttribute('tabindex');
    // const _hasKeyHandler = el.hasAttribute('onkeydown') || el.hasAttribute('onkeyup');

    if (!isButton && !isLink && !hasTabIndex) {
      issues.push({
        type: 'warning',
        message: `Interactive element ${index + 1} may not be keyboard accessible`,
        element: el.tagName.toLowerCase(),
        suggestion: 'Add tabindex and keyboard event handlers, or use semantic elements',
      });
    }
  });

  // Check heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const currentLevel = parseInt(heading.tagName.charAt(1));

    if (index === 0 && currentLevel !== 1) {
      issues.push({
        type: 'warning',
        message: 'Page should start with h1',
        element: heading.tagName.toLowerCase(),
        suggestion: 'Use h1 for the main page heading',
      });
    }

    if (currentLevel > previousLevel + 1) {
      issues.push({
        type: 'warning',
        message: `Heading level ${currentLevel} skips levels`,
        element: heading.tagName.toLowerCase(),
        suggestion: 'Use consecutive heading levels for proper hierarchy',
      });
    }

    previousLevel = currentLevel;
  });

  // Check color contrast (basic check)
  const elementsWithBackground = element.querySelectorAll('[style*="background"], [class*="bg-"]');
  elementsWithBackground.forEach((el) => {
    const hasTextContent = el.textContent?.trim();
    if (hasTextContent && level === 'AA') {
      issues.push({
        type: 'info',
        message: 'Manual color contrast check recommended',
        element: el.tagName.toLowerCase(),
        suggestion: 'Verify 4.5:1 contrast ratio for normal text, 3:1 for large text',
      });
    }
  });

  return {
    passed: issues.filter((issue) => issue.type === 'error').length === 0,
    issues,
    level,
  };
};

// Generate accessibility report

/**
 * generateAccessibilityReport
 * @description Function
 */
export const generateAccessibilityReport = (
  checkResults: AccessibilityCheckResult[],
): {
  overallScore: number;
  totalIssues: number;
  errorCount: number;
  warningCount: number;
  recommendations: string[];
} => {
  const allIssues = checkResults.flatMap((result) => result.issues);
  const errorCount = allIssues.filter((issue) => issue.type === 'error').length;
  const warningCount = allIssues.filter((issue) => issue.type === 'warning').length;

  const overallScore = Math.max(0, 100 - errorCount * 10 - warningCount * 5);

  const recommendations = [
    'Review all error-level accessibility issues immediately',
    'Address warning-level issues to improve user experience',
    'Test with screen readers and keyboard-only navigation',
    'Validate color contrast ratios meet WCAG guidelines',
    'Ensure all interactive elements are keyboard accessible',
  ];

  return {
    overallScore,
    totalIssues: allIssues.length,
    errorCount,
    warningCount,
    recommendations,
  };
};

// Keyboard navigation helper

/**
 * simulateKeyboardNavigation
 * @description Function
 */
export const simulateKeyboardNavigation = (
  element: HTMLElement,
): {
  focusableElements: Element[];
  navigationPath: string[];
} => {
  const focusableSelectors = [
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'a[href]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  const focusableElements = Array.from(element.querySelectorAll(focusableSelectors));
  const navigationPath = focusableElements.map(
    (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''),
  );

  return {
    focusableElements,
    navigationPath,
  };
};
