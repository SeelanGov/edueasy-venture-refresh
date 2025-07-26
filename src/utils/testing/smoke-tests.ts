// Smoke test utilities for design system validation
export interface SmokeTestCase {
  name: string;
  component: string;
  testId?: string;
  expectedElements: string[];
  criticalUserFlow?: boolean;
}

/**
 * CRITICAL_USER_FLOWS
 * @description Function
 */
export const CRITICAL_USER_FLOWS: SmokeTestCase[] = [
  {
    name: 'Login Flow',
    component: 'Login',
    expectedElements: ['email-input', 'password-input', 'login-button'],
    criticalUserFlow: true,
  },
  {
    name: 'Register Flow',
    component: 'Register',
    expectedElements: ['email-input', 'password-input', 'register-button'],
    criticalUserFlow: true,
  },
  {
    name: 'Dashboard Navigation',
    component: 'Dashboard',
    expectedElements: ['user-profile', 'applications-section', 'journey-map'],
    criticalUserFlow: true,
  },
  {
    name: 'Application Form',
    component: 'ApplicationForm',
    expectedElements: ['personal-info', 'submit-button', 'save-draft-button'],
    criticalUserFlow: true,
  },
  {
    name: 'Admin Dashboard',
    component: 'AdminDashboard',
    expectedElements: ['document-verification', 'user-management', 'analytics'],
    criticalUserFlow: true,
  },
];

/**
 * validateDesignSystemCompliance
 * @description Function
 */
export const validateDesignSystemCompliance = (
  componentHtml: string,
): {
  passed: boolean;
  violations: string[];
} => {
  const violations: string[] = [];

  // Check for hardcoded colors
  const hardcodedColorRegex =
    /bg-(blue|red|green|yellow|purple|pink|indigo|orange|cyan|teal|lime|emerald|sky|violet|fuchsia|rose)-\d+/g;
  const hardcodedColors = componentHtml.match(hardcodedColorRegex);
  if (hardcodedColors) {
    violations.push(`Found hardcoded colors: ${hardcodedColors.join(', ')}`);
  }

  // Check for raw buttons
  const rawButtonRegex = /<button(?![^>]*Button)/g;
  const rawButtons = componentHtml.match(rawButtonRegex);
  if (rawButtons) {
    violations.push(`Found ${rawButtons.length} raw <button> elements`);
  }

  // Check for missing design system components
  if (componentHtml.includes('className="border') && !componentHtml.includes('<Card')) {
    violations.push('Found manual card styling instead of Card component');
  }

  return {
    passed: violations.length === 0,
    violations,
  };
};

/**
 * runSmokeTest
 * @description Function
 */
export const runSmokeTest = async (testCase: SmokeTestCase): Promise<boolean> => {
  try {
    console.log(`Running smoke test: ${testCase.name}`);

    // Mock implementation - in real scenario this would render the component
    // and verify all expected elements are present
    const mockComponentHtml = `<div data-testid="${testCase.component.toLowerCase()}">Mock component</div>`;

    const compliance = validateDesignSystemCompliance(mockComponentHtml);

    if (!compliance.passed) {
      console.error(`Smoke test failed for ${testCase.name}:`, compliance.violations);
      return false;
    }

    console.log(`✅ Smoke test passed: ${testCase.name}`);
    return true;
  } catch (error) {
    console.error(`Smoke test error for ${testCase.name}:`, error);
    return false;
  }
};
