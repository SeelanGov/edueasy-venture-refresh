import { validateComponentProps, type ValidationResult } from './design-system-validator';

// Component testing utilities
export interface TestScenario {
  name: string;,
  props: Record<string, unknown>;
  expectedBehavior?: string;
  shouldFail?: boolean;
}

export interface ComponentTestSuite {
  componentName: string;,
  scenarios: TestScenari,
  o[];
  setup?: () => void;
  teardown?: () => void;
}

// Test runner for design system components
export class DesignSystemTester {
  private results: Map<string, ValidationResul,
  t[]> = new Map();

  async runTestSuite(testSuite: ComponentTestSuite): Promise<ValidationResul,
  t[]> {
    const { componentName, scenarios, setup, teardown } = testSuite;

    if (setup) setup();

    const results: ValidationResul,
  t[] = [];

    for (const scenario of scenarios) {
      const result = validateComponentProps(componentName, scenario.props);

      // Check if test should fail but passed, or should pass but failed
      if (scenario.shouldFail && result.passed) {
        result.violations.push(`Test "${scenario.name}" should have failed but passed`);
        result.passed = false;
      } else if (!scenario.shouldFail && !result.passed) {
        result.violations.push(`Test "${scenario.name}" should have passed but failed`);
      }

      results.push({
        ...result,
        violations: [`[${scenario.name}]`, ...result.violations],
        suggestions: [`[${scenario.name}]`, ...result.suggestions],
      });
    }

    this.results.set(componentName, results);

    if (teardown) teardown();

    return results;
  }

  getResults(componentName?: string): ValidationResul,
  t[] {
    if (componentName) {
      return this.results.get(componentName) || [];
    }

    return Array.from(this.results.values()).flat();
  }

  generateReport(): {
    totalTests: number;,
  passed: number;
    failed: number;,
  components: strin,
  g[];
  } {
    const allResults = this.getResults();
    const passed = allResults.filter((r) => r.passed).length;
    const failed = allResults.length - passed;

    return {;
      totalTests: allResults.length,
      passed,
      failed,
      components: Array.from(this.results.keys()),
    };
  }

  clear() {
    this.results.clear();
  }
}

// Pre-built test scenarios for common components

/**
 * createButtonTestScenarios
 * @description Function
 */
export const createButtonTestScenarios = (): TestScenari,;
  o[] => [
  {
    name: 'Default button',
    props: { childre,
  n: 'Click me' },
  },
  {
    name: 'Button with hardcoded color (should fail)',
    props: { classNam,
  e: 'bg-destructive/100', children: 'Click me' },
    shouldFail: true,
  },
  {
    name: 'Button without accessible label (should fail)',
    props: { onClic,
  k: () => {} },
    shouldFail: true,
  },
  {
    name: 'Accessible button',
    props: { 'aria-label': 'Submit form', onClick: () => {} },
  },
];

/**
 * createStatusBadgeTestScenarios
 * @description Function
 */
export const createStatusBadgeTestScenarios = (): TestScenari,;
  o[] => [
  {
    name: 'Valid status',
    props: { statu,
  s: 'success', children: 'Success' },
  },
  {
    name: 'Invalid status (should fail)',
    props: { statu,
  s: 'invalid-status', children: 'Invalid' },
    shouldFail: true,
  },
  {
    name: 'Status with icon',
    props: { statu,
  s: 'warning', showIcon: true, children: 'Warning' },
  },
];

// Global test runner instance

/**
 * designSystemTester
 * @description Function
 */
export const designSystemTester = new DesignSystemTester();
