#!/usr/bin/env node

/**
 * Fix Parsing Errors Script
 * 
 * This script fixes the critical parsing errors that are preventing the build from working.
 * These are typically syntax errors that need immediate attention.
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
  backupDir: path.resolve(process.cwd(), 'backup-parsing-fix'),
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
        if (item !== 'node_modules' && item !== 'backup-parsing-fix') {
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
  log.info('Creating backup of files before parsing fixes...');
  
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
 * Fix 1: Remove TODO comments that cause parsing errors
 */
function fixTodoComments() {
  log.info('Fixing TODO comments that cause parsing errors...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Pattern: Remove TODO comments in useEffect dependency arrays
    const todoPattern = /,\s*\[\s*\]\s*\/\/\s*TODO:\s*Add missing dependencies\s*\)/g;
    if (todoPattern.test(content)) {
      content = content.replace(todoPattern, ', []);');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern: Remove TODO comments in other contexts
    const todoPattern2 = /\/\/\s*TODO:\s*Add missing dependencies\s*\)/g;
    if (todoPattern2.test(content)) {
      content = content.replace(todoPattern2, ');');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed TODO comments in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed TODO comments in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 2: Fix missing commas in object/array declarations
 */
function fixMissingCommas() {
  log.info('Fixing missing commas in object/array declarations...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Pattern: Fix missing commas in object properties
    const missingCommaPattern = /(\w+)\s*:\s*([^,}\n]+)\s*(\w+)\s*:/g;
    if (missingCommaPattern.test(content)) {
      content = content.replace(missingCommaPattern, '$1: $2,\n  $3:');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern: Fix missing commas in array elements
    const missingArrayCommaPattern = /(\w+)\s*(\w+)\s*\[/g;
    if (missingArrayCommaPattern.test(content)) {
      content = content.replace(missingArrayCommaPattern, '$1,\n  $2[');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed missing commas in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed missing commas in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 3: Fix expression expected errors
 */
function fixExpressionExpected() {
  log.info('Fixing expression expected errors...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Pattern: Fix empty lines that cause expression expected
    const emptyLinePattern = /^\s*$\n/gm;
    if (emptyLinePattern.test(content)) {
      // Remove excessive empty lines
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern: Fix incomplete statements
    const incompletePattern = /(\w+)\s*=\s*$/gm;
    if (incompletePattern.test(content)) {
      content = content.replace(incompletePattern, '$1 = null;');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed expression expected in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed expression expected in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 4: Fix semicolon expected errors
 */
function fixSemicolonExpected() {
  log.info('Fixing semicolon expected errors...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Pattern: Fix missing semicolons after statements
    const missingSemicolonPattern = /(\w+)\s*=\s*([^;}\n]+)\s*$/gm;
    if (missingSemicolonPattern.test(content)) {
      content = content.replace(missingSemicolonPattern, '$1 = $2;');
      hasChanges = true;
      fileFixed++;
    }
    
    // Pattern: Fix missing semicolons after return statements
    const missingReturnSemicolonPattern = /return\s+([^;}\n]+)\s*$/gm;
    if (missingReturnSemicolonPattern.test(content)) {
      content = content.replace(missingReturnSemicolonPattern, 'return $1;');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed semicolon expected in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed semicolon expected in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Run TypeScript check to verify fixes
 */
function runTypeScriptCheck() {
  log.info('Running TypeScript check to verify fixes...');
  
  try {
    const { execSync } = require('child_process');
    const result = execSync('npx tsc --noEmit', { 
      encoding: 'utf8',
      stdio: 'pipe'
    });
    
    log.success('✅ TypeScript compilation successful!');
    return true;
  } catch (error) {
    log.warning('⚠️ TypeScript found issues:');
    console.log(error.stdout || error.message);
    return false;
  }
}

/**
 * Main execution function
 */
function main() {
  console.log(`${colors.cyan}🔧 Parsing Error Fix${colors.reset}`);
  console.log(`${colors.cyan}==================${colors.reset}\n`);
  
  try {
    // Step 1: Create backup
    createBackup();
    
    // Step 2: Apply fixes
    const fixes = [
      { name: 'TODO Comments', fn: fixTodoComments },
      { name: 'Missing Commas', fn: fixMissingCommas },
      { name: 'Expression Expected', fn: fixExpressionExpected },
      { name: 'Semicolon Expected', fn: fixSemicolonExpected },
    ];
    
    let totalFixed = 0;
    let totalFilesModified = 0;
    
    for (const fix of fixes) {
      log.info(`Applying ${fix.name} fixes...`);
      const result = fix.fn();
      totalFixed += result.totalFixed;
      totalFilesModified += result.filesModified;
    }
    
    // Step 3: Run TypeScript check
    const tsPassed = runTypeScriptCheck();
    
    // Summary
    console.log(`\n${colors.cyan}📊 Parsing Fix Summary:${colors.reset}`);
    console.log(`  - Total fixes applied: ${totalFixed}`);
    console.log(`  - Files modified: ${totalFilesModified}`);
    console.log(`  - TypeScript status: ${tsPassed ? '✅ PASSED' : '❌ ISSUES REMAIN'}`);
    
    if (tsPassed) {
      log.success('\n🎉 All parsing errors resolved!');
    } else {
      log.warning('\n⚠️ Some parsing errors remain. Manual review may be needed.');
    }
    
  } catch (error) {
    log.error(`Parsing fix failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixTodoComments,
  fixMissingCommas,
  fixExpressionExpected,
  fixSemicolonExpected,
  runTypeScriptCheck,
}; 