#!/usr/bin/env node

/**
 * Fix Critical Syntax Errors Script
 * 
 * This script fixes the critical syntax errors that are preventing
 * the application from running properly.
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
  backupDir: path.resolve(process.cwd(), 'backup-syntax-fix'),
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
        if (item !== 'node_modules' && item !== 'backup-syntax-fix') {
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
  log.info('Creating backup of files before syntax fixes...');
  
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
 * Fix 1: Remove stray semicolons and fix broken useState declarations
 */
function fixBrokenUseState() {
  log.info('Fixing broken useState declarations...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Fix broken useState declarations like: const[var, setVar] = useState(...)
    const brokenUseStatePattern = /const\[([^,]+),\s*([^\]]+)\]\s*=\s*useState/g;
    if (brokenUseStatePattern.test(content)) {
      content = content.replace(brokenUseStatePattern, 'const [$1, $2] = useState');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken useState declarations with cons, t patterns
    const consPattern = /cons,\s*t\[([^,]+),\s*([^\]]+)\]\s*=\s*useState/g;
    if (consPattern.test(content)) {
      content = content.replace(consPattern, 'const [$1, $2] = useState');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken useState declarations with just cons, t
    const consTPattern = /cons,\s*t\[([^,]+),\s*([^\]]+)\]\s*=\s*useState<([^>]+)>/g;
    if (consTPattern.test(content)) {
      content = content.replace(consTPattern, 'const [$1, $2] = useState<$3>');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken useState declarations with just cons, t (no type)
    const consTPatternNoType = /cons,\s*t\[([^,]+),\s*([^\]]+)\]\s*=\s*useState\(/g;
    if (consTPatternNoType.test(content)) {
      content = content.replace(consTPatternNoType, 'const [$1, $2] = useState(');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed useState declarations in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed useState declarations in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 2: Remove stray semicolons and commas
 */
function fixStraySemicolons() {
  log.info('Fixing stray semicolons and commas...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Remove stray semicolons at the beginning of lines
    const straySemicolonPattern = /^\s*;\s*$/gm;
    if (straySemicolonPattern.test(content)) {
      content = content.replace(straySemicolonPattern, '');
      hasChanges = true;
      fileFixed++;
    }
    
    // Remove stray commas at the beginning of lines
    const strayCommaPattern = /^\s*,\s*$/gm;
    if (strayCommaPattern.test(content)) {
      content = content.replace(strayCommaPattern, '');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken import statements with stray semicolons
    const brokenImportPattern = /import\s+([^;]+);\s*;/g;
    if (brokenImportPattern.test(content)) {
      content = content.replace(brokenImportPattern, 'import $1;');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken JSX with stray semicolons
    const brokenJSXPattern = /;\s*</g;
    if (brokenJSXPattern.test(content)) {
      content = content.replace(brokenJSXPattern, '\n  <');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed stray semicolons in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed stray semicolons in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 3: Fix broken JSX syntax
 */
function fixBrokenJSX() {
  log.info('Fixing broken JSX syntax...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Fix broken JSX attributes with spaces around equals
    const brokenJSXAttrPattern = /(\w+)\s*=\s*"/g;
    if (brokenJSXAttrPattern.test(content)) {
      content = content.replace(brokenJSXAttrPattern, '$1="');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken JSX closing tags
    const brokenJSXClosePattern = /"\s*>/g;
    if (brokenJSXClosePattern.test(content)) {
      content = content.replace(brokenJSXClosePattern, '">');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken JSX self-closing tags
    const brokenJSXSelfClosePattern = /"\s*\/>/g;
    if (brokenJSXSelfClosePattern.test(content)) {
      content = content.replace(brokenJSXSelfClosePattern, '" />');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed JSX syntax in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed JSX syntax in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 4: Fix broken function declarations
 */
function fixBrokenFunctions() {
  log.info('Fixing broken function declarations...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Fix broken function declarations with stray semicolons
    const brokenFunctionPattern = /const\s+(\w+)\s*=\s*\(\)\s*=>\s*\([\s\n]*;/g;
    if (brokenFunctionPattern.test(content)) {
      content = content.replace(brokenFunctionPattern, 'const $1 = () => (');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken return statements
    const brokenReturnPattern = /return\s*\([\s\n]*;/g;
    if (brokenReturnPattern.test(content)) {
      content = content.replace(brokenReturnPattern, 'return (');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed function declarations in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed function declarations in ${filesModified} files`);
  return { totalFixed, filesModified };
}

/**
 * Fix 5: Fix broken object declarations
 */
function fixBrokenObjects() {
  log.info('Fixing broken object declarations...');
  
  const files = getAllTypeScriptFiles(config.srcDir);
  let totalFixed = 0;
  let filesModified = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let hasChanges = false;
    let fileFixed = 0;
    
    // Fix broken object properties with stray semicolons
    const brokenObjectPattern = /(\w+):\s*([^,}]+),\s*;/g;
    if (brokenObjectPattern.test(content)) {
      content = content.replace(brokenObjectPattern, '$1: $2,');
      hasChanges = true;
      fileFixed++;
    }
    
    // Fix broken object declarations
    const brokenObjectDeclPattern = /const\s+(\w+)\s*=\s*{[\s\n]*;/g;
    if (brokenObjectDeclPattern.test(content)) {
      content = content.replace(brokenObjectDeclPattern, 'const $1 = {');
      hasChanges = true;
      fileFixed++;
    }
    
    if (hasChanges) {
      fs.writeFileSync(file, content);
      filesModified++;
      totalFixed += fileFixed;
      log.progress(`Fixed object declarations in ${path.relative(process.cwd(), file)}`);
    }
  }
  
  log.success(`Fixed object declarations in ${filesModified} files`);
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
  console.log(`${colors.cyan}🔧 Critical Syntax Error Fix${colors.reset}`);
  console.log(`${colors.cyan}============================${colors.reset}\n`);
  
  try {
    // Step 1: Create backup
    createBackup();
    
    // Step 2: Apply fixes
    const fixes = [
      { name: 'Broken useState', fn: fixBrokenUseState },
      { name: 'Stray Semicolons', fn: fixStraySemicolons },
      { name: 'Broken JSX', fn: fixBrokenJSX },
      { name: 'Broken Functions', fn: fixBrokenFunctions },
      { name: 'Broken Objects', fn: fixBrokenObjects },
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
    console.log(`\n${colors.cyan}📊 Syntax Fix Summary:${colors.reset}`);
    console.log(`  - Total fixes applied: ${totalFixed}`);
    console.log(`  - Files modified: ${totalFilesModified}`);
    console.log(`  - TypeScript status: ${tsPassed ? '✅ PASSED' : '❌ ISSUES REMAIN'}`);
    
    if (tsPassed) {
      log.success('\n🎉 All critical syntax errors resolved!');
    } else {
      log.warning('\n⚠️ Some syntax errors remain. Manual review may be needed.');
    }
    
  } catch (error) {
    log.error(`Syntax fix failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixBrokenUseState,
  fixStraySemicolons,
  fixBrokenJSX,
  fixBrokenFunctions,
  fixBrokenObjects,
  runTypeScriptCheck,
}; 