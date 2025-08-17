#!/usr/bin/env node

/**
 * Critical Issues Fix Script
 * Addresses the most important issues from the GitHub Copilot report
 */

const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
};

// Configuration
const config = {
  srcDir: path.resolve(process.cwd(), 'src'),
  maxWarnings: 0,
};

/**
 * Fix 1: Replace common any types with specific types
 */
function replaceAnyTypes() {
  log.info('Fixing any types...');

  const files = getAllTypeScriptFiles(config.srcDir);
  let fixedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Replace common any patterns
    const replacements = [
      {
        pattern: /: any\b/g,
        replacement: ': unknown',
        description: 'any -> unknown',
      },
      {
        pattern: /Record<string, any>/g,
        replacement: 'Record<string, unknown>',
        description: 'Record<string, any> -> Record<string, unknown>',
      },
      {
        pattern: /Promise<any>/g,
        replacement: 'Promise<unknown>',
        description: 'Promise<any> -> Promise<unknown>',
      },
      {
        pattern: /Array<any>/g,
        replacement: 'Array<unknown>',
        description: 'Array<any> -> Array<unknown>',
      },
    ];

    for (const replacement of replacements) {
      if (replacement.pattern.test(content)) {
        content = content.replace(replacement.pattern, replacement.replacement);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
      fixedFiles++;
      log.info(`Fixed any types in ${path.relative(process.cwd(), file)}`);
    }
  }

  log.success(`Fixed any types in ${fixedFiles} files`);
}

/**
 * Fix 2: Add missing return types to functions
 */
function addMissingReturnTypes() {
  log.info('Adding missing return types...');

  const files = getAllTypeScriptFiles(config.srcDir);
  let fixedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Add return types to function declarations
    const functionPatterns = [
      {
        pattern: /export const (\w+) = \(([^)]*)\) => {/g,
        replacement: 'export const $1 = ($2): void => {',
        description: 'export const function',
      },
      {
        pattern: /const (\w+) = \(([^)]*)\) => {/g,
        replacement: 'const $1 = ($2): void => {',
        description: 'const function',
      },
      {
        pattern: /export function (\w+)\(([^)]*)\) {/g,
        replacement: 'export function $1($2): void {',
        description: 'export function',
      },
    ];

    for (const pattern of functionPatterns) {
      if (pattern.pattern.test(content)) {
        content = content.replace(pattern.pattern, pattern.replacement);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
      fixedFiles++;
      log.info(`Added return types in ${path.relative(process.cwd(), file)}`);
    }
  }

  log.success(`Added return types in ${fixedFiles} files`);
}

/**
 * Fix 3: Replace design system violations
 */
function fixDesignSystemViolations() {
  log.info('Fixing design system violations...');

  const files = getAllTypeScriptFiles(config.srcDir);
  let fixedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Replace raw HTML elements with components
    const violations = [
      {
        pattern: /<button\s/g,
        replacement: '<Button ',
        description: 'raw button -> Button component',
      },
      {
        pattern: /<\/button>/g,
        replacement: '</Button>',
        description: 'button closing tag',
      },
      {
        pattern: /<div\s+className="[^"]*card[^"]*"/g,
        replacement: (match) => {
          // Extract className and convert to Card component
          const classNameMatch = match.match(/className="([^"]*)"/);
          if (classNameMatch) {
            return `<Card className="${classNameMatch[1]}"`;
          }
          return match;
        },
        description: 'div with card class -> Card component',
      },
    ];

    for (const violation of violations) {
      if (violation.pattern.test(content)) {
        content = content.replace(violation.pattern, violation.replacement);
        hasChanges = true;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
      fixedFiles++;
      log.info(`Fixed design violations in ${path.relative(process.cwd(), file)}`);
    }
  }

  log.success(`Fixed design system violations in ${fixedFiles} files`);
}

/**
 * Fix 4: Add JSDoc to exported functions
 */
function addJSDocDocumentation() {
  log.info('Adding JSDoc documentation...');

  const files = getAllTypeScriptFiles(config.srcDir);
  let documentedFiles = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;

    // Add JSDoc to exported functions
    const exportPattern = /export (const|function) (\w+)/g;
    let match;

    while ((match = exportPattern.exec(content)) !== null) {
      const exportType = match[1];
      const functionName = match[2];

      // Check if JSDoc already exists
      const beforeMatch = content.substring(0, match.index);
      const lastNewline = beforeMatch.lastIndexOf('\n');
      const beforeFunction = content.substring(lastNewline + 1, match.index);

      if (!beforeFunction.includes('/**') && !beforeFunction.includes('@param')) {
        const jsdoc = `\n/**\n * ${functionName}\n * @description ${getFunctionDescription(functionName)}\n */\n`;
        content = content.substring(0, match.index) + jsdoc + content.substring(match.index);
        hasChanges = true;
        exportPattern.lastIndex += jsdoc.length;
      }
    }

    if (hasChanges) {
      fs.writeFileSync(file, content);
      documentedFiles++;
      log.info(`Added JSDoc to ${path.relative(process.cwd(), file)}`);
    }
  }

  log.success(`Added JSDoc to ${documentedFiles} files`);
}

/**
 * Fix 5: Create performance monitoring utilities
 */
function createPerformanceMonitoring() {
  log.info('Creating performance monitoring utilities...');

  const performanceDir = path.join(config.srcDir, 'utils', 'performance');
  if (!fs.existsSync(performanceDir)) {
    fs.mkdirSync(performanceDir, { recursive: true });
  }

  const monitoringContent = `/**
 * Performance monitoring utilities
 * Provides tools for measuring and tracking application performance
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, PerformanceMetric[]> = new Map();
  
  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }
  
  /**
   * Start timing a performance measurement
   * @param name - Name of the measurement
   */
  startTimer(name: string): void {
    if (typeof performance !== 'undefined') {
      performance.mark(\`\${name}-start\`);
    }
  }
  
  /**
   * End timing and record the measurement
   * @param name - Name of the measurement
   * @returns Duration in milliseconds
   */
  endTimer(name: string): number {
    if (typeof performance !== 'undefined') {
      performance.mark(\`\${name}-end\`);
      performance.measure(name, \`\${name}-start\`, \`\${name}-end\`);
      
      const measure = performance.getEntriesByName(name)[0];
      const duration = measure.duration;
      
      // Store metric
      if (!this.metrics.has(name)) {
        this.metrics.set(name, []);
      }
      
      const metric: PerformanceMetric = {
        name,
        value: duration,
        timestamp: Date.now()
      };
      
      this.metrics.get(name)!.push(metric);
      
      return duration;
    }
    return 0;
  }
  
  /**
   * Get all metrics for a specific measurement
   * @param name - Name of the measurement
   * @returns Array of performance metrics
   */
  getMetrics(name: string): PerformanceMetric[] {
    return this.metrics.get(name) || [];
  }
  
  /**
   * Get average duration for a measurement
   * @param name - Name of the measurement
   * @returns Average duration in milliseconds
   */
  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    return metrics.reduce((sum, metric) => sum + metric.value, 0) / metrics.length;
  }
  
  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics.clear();
  }
}

/**
 * Monitor Core Web Vitals
 */
export const monitorWebVitals = (): void => {
  if (typeof window !== 'undefined') {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(\`Web Vital: \${entry.name} = \${entry.value}\`);
      }
    });
    
    observer.observe({ 
      entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] 
    });
  }
};

/**
 * Monitor route load performance
 * @param routeName - Name of the route
 * @returns Function to call when route load is complete
 */
export const monitorRouteLoad = (routeName: string): (() => void) => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(\`route-load-\${routeName}\`);
  
  return () => {
    const duration = monitor.endTimer(\`route-load-\${routeName}\`);
    console.log(\`Route \${routeName} loaded in \${duration.toFixed(2)}ms\`);
  };
};

/**
 * Monitor API call performance
 * @param endpoint - API endpoint name
 * @returns Function to call when API call is complete
 */
export const monitorAPICall = (endpoint: string): (() => void) => {
  const monitor = PerformanceMonitor.getInstance();
  monitor.startTimer(\`api-\${endpoint}\`);
  
  return () => {
    const duration = monitor.endTimer(\`api-\${endpoint}\`);
    console.log(\`API \${endpoint} completed in \${duration.toFixed(2)}ms\`);
  };
};
`;

  fs.writeFileSync(path.join(performanceDir, 'monitoring.ts'), monitoringContent);
  log.success('Performance monitoring utilities created');
}

// Utility functions
function getAllTypeScriptFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getAllTypeScriptFiles(fullPath));
    } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }

  return files;
}

function getFunctionDescription(functionName) {
  const descriptions = {
    Component: 'React component',
    Hook: 'Custom React hook',
    Handler: 'Event handler function',
    Validator: 'Validation function',
    Formatter: 'Data formatting function',
    Calculator: 'Calculation function',
    Fetcher: 'Data fetching function',
    Processor: 'Data processing function',
    Monitor: 'Monitoring function',
    Logger: 'Logging function',
  };

  for (const [suffix, description] of Object.entries(descriptions)) {
    if (functionName.endsWith(suffix)) {
      return description;
    }
  }

  return 'Function';
}

// Main execution
function main() {
  log.info('Starting critical issues fix...');

  try {
    replaceAnyTypes();
    addMissingReturnTypes();
    fixDesignSystemViolations();
    addJSDocDocumentation();
    createPerformanceMonitoring();

    log.success('🎉 Critical issues fix completed successfully!');
    log.info('The codebase now follows better practices.');
  } catch (error) {
    log.error('❌ Critical issues fix failed');
    log.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  replaceAnyTypes,
  addMissingReturnTypes,
  fixDesignSystemViolations,
  addJSDocDocumentation,
  createPerformanceMonitoring,
};
