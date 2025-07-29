/**
 * Script to automatically fix linting and formatting issues
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

const runCommand = (command, errorMessage) => {
  try {
    execSync(command, { stdio: 'inherit', cwd: rootDir });
    return true;
  } catch (error) {
    console.error(`⚠️ ${errorMessage}:`, error.message);
    return false;
  }
};

console.log('🧹 Starting code cleanup process...');

// Type checking
console.log('\n🔍 Running TypeScript type check...');
const typeCheckSuccess = runCommand('npm run type-check', 'TypeScript errors found');

// ESLint fixes
console.log('\n🛠️ Running ESLint with auto-fix...');
const lintSuccess = runCommand(
  'npm run lint:fix',
  'Some linting issues could not be fixed automatically',
);

// Prettier formatting
console.log('\n✨ Running Prettier formatting...');
const formatSuccess = runCommand(
  'npm run format',
  'Some formatting issues could not be fixed automatically',
);

// Report results
console.log('\n📊 Results:');
console.log(`TypeScript check: ${typeCheckSuccess ? '✅' : '❌'}`);
console.log(`ESLint fixes: ${lintSuccess ? '✅' : '❌'}`);
console.log(`Prettier format: ${formatSuccess ? '✅' : '❌'}`);

if (typeCheckSuccess && lintSuccess && formatSuccess) {
  console.log('\n🎉 All checks passed and fixes applied successfully!');
} else {
  console.log('\n⚠️ Some issues require manual attention. Please review the errors above.');
  // Exit with error in CI environments
  if (process.env.CI) {
    process.exit(1);
  }
}
