#!/usr/bin/env node

/**
 * Fix App.tsx Script
 * 
 * This script fixes the syntax errors in App.tsx that were introduced
 * by the parsing fix script.
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

function fixAppTsx() {
  log.info('Fixing App.tsx syntax errors...');
  
  const appTsxPath = path.resolve(process.cwd(), 'src/App.tsx');
  
  if (!fs.existsSync(appTsxPath)) {
    log.error('App.tsx not found!');
    return false;
  }
  
  let content = fs.readFileSync(appTsxPath, 'utf8');
  
  // Fix 1: Remove stray semicolons
  content = content.replace(/;\s*\n\s*</g, '\n  <');
  content = content.replace(/;\s*$/gm, '');
  
  // Fix 2: Fix Route formatting
  content = content.replace(/path\s*=\s*"/g, 'path="/');
  content = content.replace(/element\s*=\s*{/g, 'element={');
  
  // Fix 3: Remove extra semicolons in JSX
  content = content.replace(/;\s*}/g, '}');
  content = content.replace(/;\s*>/g, '>');
  
  // Fix 4: Fix spacing around equals signs
  content = content.replace(/\s*=\s*"/g, '="');
  content = content.replace(/"\s*>/g, '">');
  
  // Fix 5: Remove empty lines with just semicolons
  content = content.replace(/^\s*;\s*$/gm, '');
  
  // Fix 6: Fix component return statement
  content = content.replace(/const App = \(\) => \([\s\n]*;/g, 'const App = () => (');
  
  // Write the fixed content back
  fs.writeFileSync(appTsxPath, content);
  
  log.success('App.tsx syntax errors fixed!');
  return true;
}

function runBuildTest() {
  log.info('Running build test to verify App.tsx fix...');
  
  try {
    const { execSync } = require('child_process');
    const result = execSync('npm run build', { 
      encoding: 'utf8',
      stdio: 'pipe',
      timeout: 30000
    });
    
    log.success('✅ Build successful!');
    return true;
  } catch (error) {
    log.warning('⚠️ Build still has issues:');
    console.log(error.stdout || error.message);
    return false;
  }
}

function main() {
  console.log(`${colors.cyan}🔧 App.tsx Fix${colors.reset}`);
  console.log(`${colors.cyan}=============${colors.reset}\n`);
  
  try {
    const fixed = fixAppTsx();
    
    if (fixed) {
      const buildPassed = runBuildTest();
      
      if (buildPassed) {
        log.success('\n🎉 App.tsx fix successful! Build is working.');
      } else {
        log.warning('\n⚠️ App.tsx fixed but build still has issues. Manual review needed.');
      }
    } else {
      log.error('\n❌ Failed to fix App.tsx');
    }
    
  } catch (error) {
    log.error(`App.tsx fix failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  fixAppTsx,
  runBuildTest,
}; 