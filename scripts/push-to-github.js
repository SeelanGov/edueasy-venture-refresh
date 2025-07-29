/**
 * Script to push any remaining changes to GitHub
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Checking for any remaining changes...');

try {
  // Check git status
  const status = execSync('git status --porcelain', { cwd: rootDir }).toString();

  if (status.trim() === '') {
    console.log('✅ No changes to commit. Everything is up to date.');
  } else {
    console.log('📝 Found changes to commit:');
    console.log(status);

    // Add all changes
    console.log('📝 Adding all changes...');
    execSync('git add --all', { stdio: 'inherit', cwd: rootDir });

    // Commit the changes
    console.log('💾 Committing changes...');
    execSync('git commit -m "Fix: Additional linting and code quality improvements"', {
      stdio: 'inherit',
      cwd: rootDir,
    });
  }

  // Push to GitHub
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit', cwd: rootDir });

  console.log('✅ Successfully pushed to GitHub!');
} catch (error) {
  console.error('❌ Error during Git operations:', error.message);
  process.exit(1);
}
