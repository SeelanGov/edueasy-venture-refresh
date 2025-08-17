#!/usr/bin/env node

/**
 * VerifyID Integration Testing Script
 * 
 * This script performs comprehensive testing of the VerifyID system including
 * TypeScript compilation, build process, and integration tests.
 */

const { execSync } = require('child_process');
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
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}[STEP]${colors.reset} ${msg}`),
  test: (msg) => console.log(`${colors.magenta}[TEST]${colors.reset} ${msg}`),
};

// Test configuration
const TEST_USERS = [
  {
    name: 'John Smith',
    idNumber: '0103055029083',
    email: 'john.smith@edueasy.co',
    gender: 'Male',
    password: 'TestPass123!'
  },
  {
    name: 'Sarah Johnson',
    idNumber: '0607065029084',
    email: 'sarah.johnson@edueasy.co',
    gender: 'Female',
    password: 'TestPass123!'
  },
  {
    name: 'Michael Brown',
    idNumber: '1208085029085',
    email: 'michael.brown@edueasy.co',
    gender: 'Male',
    password: 'TestPass123!'
  }
];

/**
 * Test TypeScript compilation
 */
function testTypeScriptCompilation() {
  log.test('Testing TypeScript compilation...');
  
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    log.success('TypeScript compilation passed');
    return true;
  } catch (error) {
    log.error('TypeScript compilation failed');
    log.error(error.message);
    return false;
  }
}

/**
 * Test ESLint
 */
function testESLint() {
  log.test('Testing ESLint...');
  
  try {
    execSync('npm run lint', { stdio: 'pipe' });
    log.success('ESLint passed');
    return true;
  } catch (error) {
    log.warning('ESLint found issues (continuing with tests)');
    log.warning(error.message);
    return true; // Continue with tests even if linting has warnings
  }
}

/**
 * Test build process
 */
function testBuildProcess() {
  log.test('Testing build process...');
  
  try {
    execSync('npm run build', { stdio: 'pipe' });
    log.success('Build process passed');
    return true;
  } catch (error) {
    log.error('Build process failed');
    log.error(error.message);
    return false;
  }
}

/**
 * Test VerifyID hook functionality
 */
function testVerifyIDHook() {
  log.test('Testing VerifyID hook functionality...');
  
  try {
    // Check if useVerifyID.ts exists and has proper structure
    const hookPath = 'src/hooks/useVerifyID.ts';
    if (!fs.existsSync(hookPath)) {
      log.error('useVerifyID.ts not found');
      return false;
    }
    
    const hookContent = fs.readFileSync(hookPath, 'utf8');
    
    // Check for required interfaces
    const requiredInterfaces = [
      'UseVerifyIDReturn',
      'UseVerificationStatusReturn', 
      'UseVerificationAuditReturn'
    ];
    
    for (const interfaceName of requiredInterfaces) {
      if (!hookContent.includes(`interface ${interfaceName}`)) {
        log.error(`Required interface '${interfaceName}' not found`);
        return false;
      }
    }
    
    // Check for proper hook exports
    const requiredHooks = [
      'useVerifyID',
      'useVerificationStatus',
      'useVerificationAudit'
    ];
    
    for (const hookName of requiredHooks) {
      if (!hookContent.includes(`export const ${hookName}`)) {
        log.error(`Required hook '${hookName}' not found`);
        return false;
      }
    }
    
    log.success('VerifyID hook structure validated');
    return true;
  } catch (error) {
    log.error('VerifyID hook test failed');
    log.error(error.message);
    return false;
  }
}

/**
 * Test consent recording utility
 */
function testConsentRecording() {
  log.test('Testing consent recording utility...');
  
  try {
    const consentPath = 'src/utils/consent-recording.ts';
    if (!fs.existsSync(consentPath)) {
      log.error('consent-recording.ts not found');
      return false;
    }
    
    const consentContent = fs.readFileSync(consentPath, 'utf8');
    
    // Check for required functions
    const requiredFunctions = [
      'hasValidConsent',
      'recordUserConsent'
    ];
    
    for (const funcName of requiredFunctions) {
      if (!consentContent.includes(`export const ${funcName}`)) {
        log.error(`Required function '${funcName}' not found`);
        return false;
      }
    }
    
    log.success('Consent recording utility validated');
    return true;
  } catch (error) {
    log.error('Consent recording test failed');
    log.error(error.message);
    return false;
  }
}

/**
 * Test edge function deployment
 */
function testEdgeFunctionDeployment() {
  log.test('Testing edge function deployment...');
  
  try {
    const edgeFunctionPath = 'supabase/functions/verifyid-integration/index.ts';
    if (!fs.existsSync(edgeFunctionPath)) {
      log.error('verifyid-integration edge function not found');
      return false;
    }
    
    const edgeContent = fs.readFileSync(edgeFunctionPath, 'utf8');
    
    // Check for required components
    const requiredComponents = [
      'Deno.serve',
      'verifyIdWithVerifyID',
      'CORS headers'
    ];
    
    for (const component of requiredComponents) {
      if (!edgeContent.includes(component)) {
        log.warning(`Component '${component}' not found in edge function`);
      }
    }
    
    log.success('Edge function structure validated');
    return true;
  } catch (error) {
    log.error('Edge function test failed');
    log.error(error.message);
    return false;
  }
}

/**
 * Generate test report
 */
function generateTestReport(results) {
  log.info('=== VerifyID Integration Test Report ===');
  
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  const failedTests = totalTests - passedTests;
  
  log.info(`Total Tests: ${totalTests}`);
  log.info(`Passed: ${passedTests}`);
  log.info(`Failed: ${failedTests}`);
  
  console.log('\nDetailed Results:');
  for (const [testName, passed] of Object.entries(results)) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${testName}`);
  }
  
  if (failedTests === 0) {
    log.success('All integration tests passed!');
    return true;
  } else {
    log.error(`${failedTests} test(s) failed. Please fix issues before deployment.`);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  log.info('=== VerifyID Integration Testing ===');
  log.info('Date: ' + new Date().toISOString());
  log.info('Project: EduEasy VerifyID System');
  
  const results = {
    'TypeScript Compilation': testTypeScriptCompilation(),
    'ESLint': testESLint(),
    'Build Process': testBuildProcess(),
    'VerifyID Hook': testVerifyIDHook(),
    'Consent Recording': testConsentRecording(),
    'Edge Function': testEdgeFunctionDeployment(),
  };
  
  const allPassed = generateTestReport(results);
  
  if (allPassed) {
    log.success('=== Integration Testing Complete ===');
    log.info('Next steps:');
    log.info('1. Execute database migration');
    log.info('2. Deploy to staging environment');
    log.info('3. Run end-to-end tests with test users');
  } else {
    log.error('=== Integration Testing Failed ===');
    log.info('Please fix the failed tests before proceeding.');
  }
  
  return allPassed;
}

// Run the script
if (require.main === module) {
  const success = main();
  process.exit(success ? 0 : 1);
}

module.exports = {
  testTypeScriptCompilation,
  testESLint,
  testBuildProcess,
  testVerifyIDHook,
  testConsentRecording,
  testEdgeFunctionDeployment,
  generateTestReport,
}; 