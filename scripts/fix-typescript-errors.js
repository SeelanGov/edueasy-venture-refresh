/**
 * Master script to fix TypeScript errors in the codebase
 *
 * This script:
 * 1. Removes unused React imports
 * 2. Identifies functions without return types
 * 3. Runs other fixes as needed
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Starting TypeScript error fixes...');

// Run the React imports fix script
console.log('\n📦 Removing unused React imports...');
try {
  execSync('node scripts/fix-react-imports.js', { stdio: 'inherit' });
  console.log('✅ Successfully removed unused React imports');
} catch (error) {
  console.error('❌ Error removing React imports:', error.message);
}

// Find functions without return types
console.log('\n📦 Finding functions without return types...');
try {
  execSync('node scripts/find-missing-return-types.js', { stdio: 'inherit' });
  console.log('✅ Successfully identified functions without return types');
} catch (error) {
  console.error('❌ Error finding functions without return types:', error.message);
}

// Run TypeScript type check to see if we've fixed the issues
console.log('\n📦 Running TypeScript type check...');
try {
  execSync('npx tsc --noEmit', { stdio: 'inherit' });
  console.log('✅ TypeScript check completed successfully');
} catch (error) {
  console.error('❌ TypeScript check failed. Some errors remain:', error.message);
}

console.log('\n🎉 TypeScript error fix process completed!');
console.log('Please review the output above to see if any issues remain.');
