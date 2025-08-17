// Testing utilities index

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

// Basic visual diff configuration (simplified)
export const VISUAL_DIFF_CONFIG = {
  thresholds: {
    pixel: 0.1,
    layout: 0.05,
  },
  settings: {
    antialiasing: true,
    fullPage: true,
  },
};
export {
  CRITICAL_USER_FLOWS,
  validateDesignSystemCompliance,
  runSmokeTest,
  type SmokeTestCase,
} from './smoke-tests';
