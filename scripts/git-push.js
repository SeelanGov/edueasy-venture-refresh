/**
 * Script to push changes to GitHub
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Preparing to push changes to GitHub...');

try {
  // Add the modified files
  console.log('📝 Adding modified files...');
  execSync('git add package.json scripts/clean.js scripts/fix-rollup-deps.js scripts/install-linux-rollup.js', 
    { stdio: 'inherit', cwd: rootDir });
  
  // Commit the changes
  console.log('💾 Committing changes...');
  execSync('git commit -m "Fix: Ensure Linux Rollup dependency is installed for CI builds"', 
    { stdio: 'inherit', cwd: rootDir });
  
  // Push to GitHub
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin main', 
    { stdio: 'inherit', cwd: rootDir });
  
  console.log('✅ Successfully pushed changes to GitHub!');
} catch (error) {
  console.error('❌ Error during Git operations:', error.message);
  process.exit(1);
}