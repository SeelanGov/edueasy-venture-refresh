import { validateComponentProps, type ValidationResult } from './design-system-validator';

// Component testing utilities
export interface TestScenario {
  name: string;
  props: Record<string, unknown>;
  expectedBehavior?: string;
  shouldFail?: boolean;
}

export interface ComponentTestSuite {
  componentName: string;
  scenarios: TestScenario[];
  setup?: () => void;
  teardown?: () => void;
}

// Test runner for design system components
export class DesignSystemTester {
  private results: Map<string, ValidationResult[]> = new Map();

  async runTestSuite(testSuite: ComponentTestSuite): Promise<ValidationResult[]> {
    const { componentName, scenarios, setup, teardown } = testSuite;

    if (setup) setup();

    const results: ValidationResult[] = [];

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

  getResults(componentName?: string): ValidationResult[] {
    if (componentName) {
      return this.results.get(componentName) || [];
    }

    return Array.from(this.results.values()).flat();
  }

  generateReport(): {
    totalTests: number;
    passed: number;
    failed: number;
    components: string[];
  } {
    const allResults = this.getResults();
    const passed = allResults.filter((r) => r.passed).length;
    const failed = allResults.length - passed;

    return {
      totalTests: allResults.length,
      passed,
      failed,
      components: Array.from(this.results.keys()),
    };
  }

  clear(): void {
    this.results.clear();
  }
}

// Pre-built test scenarios for common components

/**
 * createButtonTestScenarios
 * @description Function
 */
export const createButtonTestScenarios = (): TestScenario[] => [
  {
    name: 'Default button',
    props: { children: 'Click me' },
  },
  {
    name: 'Button with hardcoded color (should fail)',
    props: { className: 'bg-red-500', children: 'Click me' },
    shouldFail: true,
  },
  {
    name: 'Button without accessible label (should fail)',
    props: { onClick: () => {} },
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
export const createStatusBadgeTestScenarios = (): TestScenario[] => [
  {
    name: 'Valid status',
    props: { status: 'success', children: 'Success' },
  },
  {
    name: 'Invalid status (should fail)',
    props: { status: 'invalid-status', children: 'Invalid' },
    shouldFail: true,
  },
  {
    name: 'Status with icon',
    props: { status: 'warning', showIcon: true, children: 'Warning' },
  },
];

// Global test runner instance

/**
 * designSystemTester
 * @description Function
 */
export const designSystemTester = new DesignSystemTester();
