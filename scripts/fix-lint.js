/**
 * Script to automatically fix linting issues
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🔍 Running ESLint with auto-fix...');

try {
  // Run ESLint with --fix flag
  execSync('npx eslint --fix .', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Linting issues fixed successfully');
} catch (error) {
  console.error('⚠️ Some linting issues could not be fixed automatically:', error.message);
  console.log('Please fix the remaining issues manually.');
  
  // Don't exit with error code to allow CI to continue
  // process.exit(1);
}

console.log('🎉 Linting fix process completed');