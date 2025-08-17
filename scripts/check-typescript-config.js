/**
 * Script to check TypeScript configuration
 *
 * This script:
 * 1. Checks if tsconfig.json exists
 * 2. Validates the configuration
 * 3. Suggests improvements
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Checking TypeScript configuration...');

// Check if tsconfig.json exists
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  console.error('❌ tsconfig.json not found!');
  process.exit(1);
}

// Read the tsconfig.json file
console.log('\n📦 Reading tsconfig.json...');
try {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
  console.log('✅ Successfully read tsconfig.json');

  // Check for important compiler options
  console.log('\n📦 Checking compiler options...');
  const compilerOptions = tsconfig.compilerOptions || {};

  // Check strict mode
  if (compilerOptions.strict !== true) {
    console.warn('⚠️ strict mode is not enabled. Consider enabling it for better type safety.');
  } else {
    console.log('✅ strict mode is enabled');
  }

  // Check noImplicitAny
  if (compilerOptions.noImplicitAny !== true) {
    console.warn('⚠️ noImplicitAny is not enabled. Consider enabling it to catch missing types.');
  } else {
    console.log('✅ noImplicitAny is enabled');
  }

  // Check noImplicitReturns
  if (compilerOptions.noImplicitReturns !== true) {
    console.warn(
      '⚠️ noImplicitReturns is not enabled. Consider enabling it to catch missing return statements.',
    );
  } else {
    console.log('✅ noImplicitReturns is enabled');
  }

  // Check jsx setting
  if (compilerOptions.jsx !== 'react-jsx') {
    console.warn(
      `⚠️ jsx is set to "${compilerOptions.jsx || 'not set'}". Consider using "react-jsx" for React 18.`,
    );
  } else {
    console.log('✅ jsx is set to "react-jsx"');
  }

  // Check module setting
  if (!['esnext', 'es2020', 'es2022'].includes(compilerOptions.module)) {
    console.warn(
      `⚠️ module is set to "${compilerOptions.module || 'not set'}". Consider using "esnext" for modern features.`,
    );
  } else {
    console.log(`✅ module is set to "${compilerOptions.module}"`);
  }

  // Check target setting
  if (!['es2020', 'es2021', 'es2022', 'esnext'].includes(compilerOptions.target)) {
    console.warn(
      `⚠️ target is set to "${compilerOptions.target || 'not set'}". Consider using "es2020" or newer.`,
    );
  } else {
    console.log(`✅ target is set to "${compilerOptions.target}"`);
  }

  // Check include and exclude
  console.log('\n📦 Checking include and exclude patterns...');
  if (!tsconfig.include || tsconfig.include.length === 0) {
    console.warn('⚠️ No include patterns found. Consider adding ["src/**/*.ts", "src/**/*.tsx"].');
  } else {
    console.log(`✅ include patterns: ${JSON.stringify(tsconfig.include)}`);
  }

  if (!tsconfig.exclude) {
    console.warn(
      '⚠️ No exclude patterns found. Consider adding ["node_modules", "build", "dist"].',
    );
  } else {
    console.log(`✅ exclude patterns: ${JSON.stringify(tsconfig.exclude)}`);
  }
} catch (error) {
  console.error('❌ Error parsing tsconfig.json:', error.message);
}

// Run TypeScript compiler to check for errors
console.log('\n📦 Running TypeScript compiler check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript compiler check passed');
} catch (error) {
  console.error('❌ TypeScript compiler check failed:', error.message);
}

console.log('\n🎉 TypeScript configuration check completed!');
console.log('Please review the output above for any suggested improvements.');
