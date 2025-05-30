/**
 * Script to run TypeScript fixes and check for errors
 *
 * This script:
 * 1. Runs the fix-typescript-errors.js script
 * 2. Runs a TypeScript type check
 * 3. Reports the results
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Running TypeScript fixes and checks...');

// Run the TypeScript fixes script
console.log('\n📦 Running TypeScript fixes...');
try {
  execSync('node scripts/fix-typescript-errors.js', { stdio: 'inherit' });
  console.log('✅ Successfully ran TypeScript fixes');
} catch (error) {
  console.error('❌ Error running TypeScript fixes:', error.message);
}

// Run TypeScript type check
console.log('\n📦 Running TypeScript type check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check completed successfully');
} catch (error) {
  console.error('❌ TypeScript check failed. Some errors remain:', error.message);
}

// Run ESLint to check for other issues
console.log('\n📦 Running ESLint check...');
try {
  execSync('npx eslint "./src/**/*.{ts,tsx}" --max-warnings=0', { stdio: 'inherit' });
  console.log('✅ ESLint check completed successfully');
} catch (error) {
  console.error('❌ ESLint check failed. Some issues remain:', error.message);
}

console.log('\n🎉 TypeScript and ESLint checks completed!');
console.log('Please review the output above to see if any issues remain.');
