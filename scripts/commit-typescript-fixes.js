/**
 * Script to commit TypeScript fixes
 *
 * This script:
 * 1. Stages the fixed files
 * 2. Creates a commit with a descriptive message
 */

const { execSync } = require('child_process');

console.log('🔍 Committing TypeScript fixes...');

// Stage the fixed files
console.log('\n📦 Staging files...');
try {
  // Stage the script files
  execSync(
    'git add scripts/fix-react-imports.js scripts/find-missing-return-types.js scripts/fix-typescript-errors.js scripts/run-typescript-fixes.js scripts/commit-typescript-fixes.js scripts/check-typescript-config.js scripts/README.md',
    { stdio: 'inherit' },
  );

  // Stage the documentation
  execSync('git add TYPESCRIPT-FIXES.md', { stdio: 'inherit' });

  // Stage the fixed components
  execSync('git add src/components/footer.tsx src/components/AdminButton.tsx', {
    stdio: 'inherit',
  });

  // Stage other fixed files
  execSync(
    'git add src/components/ui/skeleton.tsx src/components/ui/toaster.tsx src/components/ui/sidebar.tsx src/components/ui/stepper.tsx',
    { stdio: 'inherit' },
  );
  execSync(
    'git add src/utils/lazyLoad.tsx src/components/error-handling/ErrorDisplay.tsx src/pages/SponsorshipsPage.tsx src/pages/ReferralsPage.tsx src/components/PatternBorder.tsx',
    { stdio: 'inherit' },
  );

  console.log('✅ Successfully staged files');
} catch (error) {
  console.error('❌ Error staging files:', error.message);
}

// Create a commit
console.log('\n📦 Creating commit...');
try {
  execSync(
    'git commit -m "Fix TypeScript errors: Remove unused React imports, add missing return types, fix footer component"',
    { stdio: 'inherit' },
  );
  console.log('✅ Successfully created commit');
} catch (error) {
  console.error('❌ Error creating commit:', error.message);
}

console.log('\n🎉 TypeScript fixes committed!');
console.log('You can now push the changes to the repository.');
