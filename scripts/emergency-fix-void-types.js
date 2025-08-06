#!/usr/bin/env node

/**
 * Emergency Fix Script for Void Return Types
 * 
 * This script fixes the critical issue where React components have been
 * incorrectly annotated with `: void` return types instead of proper JSX return types.
 * This is causing build failures across the entire codebase.
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

// Configuration
const config = {
  srcDir: path.resolve(process.cwd(), 'src'),
  backupDir: path.resolve(process.cwd(), 'backup-void-fix'),
  maxWarnings: 0,
};

/**
 * Get all TypeScript and TSX files recursively
 */
function getAllTypeScriptFiles(dir) {
  const files = [];
  
  function scanDirectory(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and backup directories
        if (item !== 'node_modules' && item !== 'backup-void-fix') {
          scanDirectory(fullPath);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    }
  }
  
  scanDirectory(dir);
  return files;
}

/**
 * Create backup of files before modification
 */
function createBackup() {
  log.info('Creating backup of files before modification...');
  
  if (!fs.existsSync(config.backupDir)) {
    fs.mkdirSync(config.backupDir, { recursive: true });
  }
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let backupCount = 0;
  
  for (const file of files) {
    const relativePath = path.relative(config.srcDir, file);
    const backupPath = path.join(config.backupDir, relativePath);
    const backupDir = path.dirname(backupPath);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    fs.copyFileSync(file, backupPath);
    backupCount++;
  }
  
  log.success(`Created backup of ${backupCount} files in ${config.backupDir}`);
}

/**
 * Fix void return types in React components
 */
function fixVoidReturnTypes() {
  log.info('Fixing void return types in React components...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Pattern 1: Fix React component declarations with void return types
    const componentPattern = /(const\s+(\w+)\s*=\s*\([^)]*\)):\s*void\s*=>/g;
    if (componentPattern.test(content)) {
      content = content.replace(componentPattern, '$1 =>');
      hasChanges = true;
      fileFixed += (content.match(componentPattern) || []).length;
    }
    
    // Pattern 2: Fix exported React component declarations
    const exportComponentPattern = /(export\s+const\s+(\w+)\s*=\s*\([^)]*\)):\s*void\s*=>/g;
    if (exportComponentPattern.test(content)) {
      content = content.replace(exportComponentPattern, '$1 =>');
      hasChanges = true;
      fileFixed += (content.match(exportComponentPattern) || []).length;
    }
    
    // Pattern 3: Fix function declarations that return JSX but are marked as void
    const functionPattern = /(function\s+(\w+)\s*\([^)]*\)):\s*void\s*{/g;
    if (functionPattern.test(content)) {
      content = content.replace(functionPattern, '$1 {');
      hasChanges = true;
      fileFixed += (content.match(functionPattern) || []).length;
    }
    
    // Pattern 4: Fix arrow functions with void return types that return JSX
    const arrowFunctionPattern = /(\([^)]*\)):\s*void\s*=>\s*{/g;
    if (arrowFunctionPattern.test(content)) {
      content = content.replace(arrowFunctionPattern, '$1 => {');
      hasChanges = true;
      fileFixed += (content.match(arrowFunctionPattern) || []).length;
    }
    
    // Pattern 5: Fix memo components with void return types
    const memoPattern = /(memo\s*\(\s*\([^)]*\)):\s*void\s*=>/g;
    if (memoPattern.test(content)) {
      content = content.replace(memoPattern, '$1 =>');
      hasChanges = true;
      fileFixed += (content.match(memoPattern) || []).length;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed ${fileFixed} void return types in ${path.relative(process.cwd(), file)}`);
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
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let remainingIssues = 0;
  const problematicFiles = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check for remaining void return types in React components
    const voidPatterns = [
      /:\s*void\s*=>/g,
      /:\s*void\s*{/g,
    ];
    
    for (const pattern of voidPatterns) {
      const matches = content.match(pattern);
      if (matches) {
        remainingIssues += matches.length;
        if (!problematicFiles.includes(file)) {
          problematicFiles.push(file);
        }
      }
    }
  }
  
  if (remainingIssues === 0) {
    log.success('✅ All void return type issues have been fixed!');
    return true;
  } else {
    log.warning(`⚠️ Found ${remainingIssues} remaining void return type issues in ${problematicFiles.length} files`);
    log.info('Problematic files:');
    problematicFiles.forEach(file => {
      log.info(`  - ${path.relative(process.cwd(), file)}`);
    });
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
  console.log(`${colors.cyan}🚨 Emergency Void Return Type Fix${colors.reset}`);
  console.log(`${colors.cyan}================================${colors.reset}\n`);
  
  try {
    // Step 1: Create backup
    createBackup();
    
    // Step 2: Apply fixes
    const { totalFixed, filesModified } = fixVoidReturnTypes();
    
    // Step 3: Validate fixes
    const validationPassed = validateFixes();
    
    // Step 4: Run TypeScript check
    const compilationPassed = runTypeScriptCheck();
    
    // Summary
    console.log(`\n${colors.cyan}📊 Fix Summary:${colors.reset}`);
    console.log(`  - Files modified: ${filesModified}`);
    console.log(`  - Void return types fixed: ${totalFixed}`);
    console.log(`  - Validation passed: ${validationPassed ? '✅' : '❌'}`);
    console.log(`  - Compilation passed: ${compilationPassed ? '✅' : '❌'}`);
    
    if (validationPassed && compilationPassed) {
      log.success('\n🎉 Emergency fix completed successfully!');
      log.info('The codebase should now compile and run properly.');
    } else {
      log.warning('\n⚠️ Some issues remain. Manual review may be needed.');
    }
    
  } catch (error) {
    log.error(`Emergency fix failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixVoidReturnTypes,
  validateFixes,
  runTypeScriptCheck,
}; 