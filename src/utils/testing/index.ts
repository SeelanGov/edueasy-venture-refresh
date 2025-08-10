// Testing utilities index
export {
  validateComponentProps,
  validateDesignSystemUsage,
  validateColorContrast,
  generateDesignSystemReport,
  type ValidationResult,
  type ComponentValidationOptions,
} from './design-system-validator';

export {
  DesignSystemTester,
  designSystemTester,
  createButtonTestScenarios,
  createStatusBadgeTestScenarios,
  type TestScenario,
  type ComponentTestSuite,
} from './component-tester';

export {
  checkAccessibility,
  generateAccessibilityReport,
  simulateKeyboardNavigation,
  type AccessibilityCheckResult,
  type AccessibilityIssue,
} from './accessibility-helpers';

// Re-export existing testing utilities
export { VISUAL_DIFF_CONFIG } from './visual-diff-config';
export {
  CRITICAL_USER_FLOWS,
  validateDesignSystemCompliance,
  runSmokeTest,
  type SmokeTestCase,
} from './smoke-tests';
