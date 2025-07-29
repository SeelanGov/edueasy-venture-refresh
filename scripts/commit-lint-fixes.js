/**
 * Script to commit linting fixes
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Preparing to commit linting fixes...');

try {
  // Add the modified files
  console.log('📝 Adding modified files...');
  execSync(
    'git add .eslintrc.json package.json scripts/fix-lint.js scripts/deploy.js src/components/footer.tsx src/components/ui/command.tsx src/components/ui/textarea.tsx src/hooks/useInstitutionsAndPrograms.ts',
    { stdio: 'inherit', cwd: rootDir },
  );

  // Commit the changes
  console.log('💾 Committing changes...');
  execSync('git commit -m "Fix: TypeScript linting errors and best practices violations"', {
    stdio: 'inherit',
    cwd: rootDir,
  });

  // Push to GitHub
  console.log('🚀 Pushing to GitHub...');
  execSync('git push origin main', { stdio: 'inherit', cwd: rootDir });

  console.log('✅ Successfully pushed linting fixes to GitHub!');
} catch (error) {
  console.error('❌ Error during Git operations:', error.message);
  process.exit(1);
}
