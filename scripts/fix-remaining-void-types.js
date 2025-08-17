#!/usr/bin/env node

/**
 * Fix Remaining Void Return Types
 * 
 * This script targets the specific patterns that the emergency fix script missed.
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
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  progress: (msg) => console.log(`${colors.cyan}[PROGRESS]${colors.reset} ${msg}`),
};

// Problematic files identified by the previous script
const problematicFiles = [
  'src/components/ErrorBoundary.tsx',
  'src/services/AnalyticsService.ts',
  'src/services/AutoMatchingService.ts',
  'src/services/MatchingRulesService.ts',
  'src/services/paymentService.ts',
  'src/services/PaymentTestingService.ts',
  'src/utils/accessibility.ts',
  'src/utils/performance/monitoring.ts',
  'src/utils/testing/component-tester.ts'
];

/**
 * Fix void return types with more specific patterns
 */
function fixRemainingVoidTypes() {
  log.info('Fixing remaining void return types...');
  
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const filePath of problematicFiles) {
    if (!fs.existsSync(filePath)) {
      log.warning(`File not found: ${filePath}`);
      continue;
    }
    
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Pattern 1: handleReset = (): void => {
    const handleResetPattern = /(handleReset\s*=\s*\([^)]*\)):\s*void\s*=>/g;
    if (handleResetPattern.test(content)) {
      content = content.replace(handleResetPattern, '$1 =>');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern 2: componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const componentDidCatchPattern = /(componentDidCatch\s*\([^)]*\)):\s*void\s*{/g;
    if (componentDidCatchPattern.test(content)) {
      content = content.replace(componentDidCatchPattern, '$1 {');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern 3: export function withErrorBoundary<P extends object>(...): void {
    const exportFunctionPattern = /(export\s+function\s+\w+[^)]*\)):\s*void\s*{/g;
    if (exportFunctionPattern.test(content)) {
      content = content.replace(exportFunctionPattern, '$1 {');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern 4: const functionName = (): void => {
    const constFunctionPattern = /(const\s+\w+\s*=\s*\([^)]*\)):\s*void\s*=>/g;
    if (constFunctionPattern.test(content)) {
      content = content.replace(constFunctionPattern, '$1 =>');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern 5: export const functionName = (): void => {
    const exportConstPattern = /(export\s+const\s+\w+\s*=\s*\([^)]*\)):\s*void\s*=>/g;
    if (exportConstPattern.test(content)) {
      content = content.replace(exportConstPattern, '$1 =>');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern 6: function functionName(): void {
    const functionDeclarationPattern = /(function\s+\w+\s*\([^)]*\)):\s*void\s*{/g;
    if (functionDeclarationPattern.test(content)) {
      content = content.replace(functionDeclarationPattern, '$1 {');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern 7: Class method with void return type
    const classMethodPattern = /(\w+\s*\([^)]*\)):\s*void\s*{/g;
    if (classMethodPattern.test(content)) {
      content = content.replace(classMethodPattern, '$1 {');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed ${fileFixed} void return types in ${filePath}`);
    }
  }
  
  log.success(`Fixed ${totalFixed} void return types across ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Validate the fixes by checking for remaining void return types
 */
function validateFixes() {
  log.info('Validating fixes...');
  
  let remainingIssues = 0;
  const problematicFiles = [];
  
  for (const filePath of problematicFiles) {
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for remaining void return types
    const voidPatterns = [
      /:\s*void\s*=>/g,
      /:\s*void\s*{/g,
    ];
    
    for (const pattern of voidPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        remainingIssues += matches.length;
        if (!problematicFiles.includes(filePath)) {
          problematicFiles.push(filePath);
        }
      }
    }
  }
  
  if (remainingIssues === 0) {
    log.success('✅ All void return type issues have been fixed!');
    return true;
  } else {
    log.warning(`⚠️ Found ${remainingIssues} remaining void return type issues`);
    return false;
  }
}

/**
 * Run TypeScript compilation check
 */
function runTypeScriptCheck() {
  log.info('Running TypeScript compilation check...');
  
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx tsc --noEmit', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    log.success('✅ TypeScript compilation successful!');
    return true;
  } catch (error) {
    log.error('❌ TypeScript compilation failed:');
    console.log(error.stdout || error.message);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  console.log(`${colors.cyan}🔧 Fix Remaining Void Return Types${colors.reset}`);
  console.log(`${colors.cyan}==================================${colors.reset}\n`);
  
  try {
    // Step 1: Apply targeted fixes
    const { totalFixed, filesModified } = fixRemainingVoidTypes();
    
    // Step 2: Validate fixes
    const validationPassed = validateFixes();
    
    // Step 3: Run TypeScript check
    const compilationPassed = runTypeScriptCheck();
    
    // Summary
    console.log(`\n${colors.cyan}📊 Fix Summary:${colors.reset}`);
    console.log(`  - Files modified: ${filesModified}`);
    console.log(`  - Void return types fixed: ${totalFixed}`);
    console.log(`  - Validation passed: ${validationPassed ? '✅' : '❌'}`);
    console.log(`  - Compilation passed: ${compilationPassed ? '✅' : '❌'}`);
    
    if (validationPassed && compilationPassed) {
      log.success('\n🎉 All void return type issues resolved!');
    } else {
      log.warning('\n⚠️ Some issues may remain. Manual review recommended.');
    }
    
  } catch (error) {
    log.error(`Fix failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixRemainingVoidTypes,
  validateFixes,
  runTypeScriptCheck,
}; 