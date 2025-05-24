// Script to verify CI/CD setup
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying CI/CD setup...');

// Required files for CI/CD
const requiredFiles = [
  { path: '.github/workflows/ci-cd.yml', description: 'GitHub Actions workflow file' },
  { path: 'scripts/fix-rollup-deps.js', description: 'Rollup dependencies fix script' },
  { path: 'scripts/check-env-vars.js', description: 'Environment variables check script' },
  { path: 'scripts/deploy-staging.ps1', description: 'Staging deployment script' },
  { path: 'scripts/deploy-production.ps1', description: 'Production deployment script' },
  { path: 'scripts/check-ci-status.ps1', description: 'CI status check script' },
  { path: 'vite.config.ts', description: 'Vite configuration' }
];

// Check if files exist
const missingFiles = [];
const existingFiles = [];

requiredFiles.forEach(file => {
  const filePath = path.resolve(process.cwd(), file.path);
  if (fs.existsSync(filePath)) {
    existingFiles.push(file);
  } else {
    missingFiles.push(file);
  }
});

// Display results
console.log('\n✅ Found CI/CD files:');
existingFiles.forEach(file => {
  console.log(`  - ${file.path} (${file.description})`);
});

if (missingFiles.length > 0) {
  console.log('\n❌ Missing CI/CD files:');
  missingFiles.forEach(file => {
    console.log(`  - ${file.path} (${file.description})`);
  });
  console.error('\n⚠️ CI/CD setup is incomplete. Please add the missing files.');
} else {
  console.log('\n🎉 All required CI/CD files are present!');
}

// Check package.json for required scripts
try {
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredScripts = [
    'build', 'test', 'check-env', 'type-check', 'lint', 'fix-rollup'
  ];
  
  const missingScripts = requiredScripts.filter(script => !packageJson.scripts[script]);
  
  if (missingScripts.length > 0) {
    console.log('\n❌ Missing package.json scripts:');
    missingScripts.forEach(script => {
      console.log(`  - ${script}`);
    });
    console.error('\n⚠️ Some required scripts are missing from package.json.');
  } else {
    console.log('\n✅ All required package.json scripts are present!');
  }
} catch (error) {
  console.error('\n❌ Error checking package.json:', error.message);
}

// Check GitHub workflow file
try {
  const workflowPath = path.resolve(process.cwd(), '.github/workflows/ci-cd.yml');
  if (fs.existsSync(workflowPath)) {
    const workflowContent = fs.readFileSync(workflowPath, 'utf8');
    
    // Check for key sections
    const hasBuildJob = workflowContent.includes('build-and-test:');
    
    console.log('\n🔍 GitHub workflow checks:');
    console.log(`  - Build job: ${hasBuildJob ? '✅' : '❌'}`);
    
    if (!hasBuildJob) {
      console.error('\n⚠️ GitHub workflow is missing some required jobs.');
    } else {
      console.log('\n✅ GitHub workflow contains all required jobs!');
    }
  }
} catch (error) {
  console.error('\n❌ Error checking GitHub workflow:', error.message);
}

console.log('\n📋 CI/CD verification complete!');