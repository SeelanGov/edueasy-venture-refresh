/**
 * Execute Repository Synchronization
 * This script runs the comprehensive repository synchronization process
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 Executing EduEasy Repository Synchronization...');
console.log('================================================');

try {
  // Run the synchronization script
  console.log('\n📋 Running synchronization script...');
  execSync('node scripts/sync-repository.js', {
    stdio: 'inherit',
    cwd: rootDir,
  });

  console.log('\n✅ Synchronization completed successfully!');
} catch (error) {
  console.error('\n❌ Synchronization failed:', error.message);
  process.exit(1);
}
