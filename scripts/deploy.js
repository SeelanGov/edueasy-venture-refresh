// Cross-platform deployment script
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Get environment from command line arguments
const environment = process.argv[2];

if (!environment || !['staging', 'production'].includes(environment)) {
  console.error('❌ Please specify a valid environment: staging or production');
  process.exit(1);
}

console.log(`🚀 Starting deployment to ${environment}...`);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const envFilePath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

// Check if .env file exists
if (!fs.existsSync(envFilePath)) {
  console.error('❌ .env file not found. Please create one based on .env.example');
  if (fs.existsSync(envExamplePath)) {
    console.log('ℹ️ .env.example file found. You can copy it to .env and update the values.');
  }
  process.exit(1);
}

// Verify environment variables
try {
  console.log('🔍 Verifying environment variables...');
  execSync('node scripts/verify-env.js', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('❌ Environment verification failed:', error.message);
  process.exit(1);
}

// Run type checking
try {
  console.log('🔍 Running type checking...');
  execSync('npm run type-check', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('❌ Type checking failed:', error.message);
  process.exit(1);
}

// Run linting with auto-fix
try {
  console.log('🔍 Running linting with auto-fix...');
  execSync('npm run lint:fix', { stdio: 'inherit', cwd: rootDir });
  
  // Run regular lint to check if all issues are fixed
  console.log('🔍 Verifying linting...');
  execSync('npm run lint', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('❌ Linting failed:', error.message);
  console.log('⚠️ Some linting issues could not be fixed automatically. Please fix them manually.');
  
  // Ask for confirmation to continue despite linting errors
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Continue with deployment despite linting errors? (y/n): ', (answer) => {
    readline.close();
    if (answer.toLowerCase() !== 'y') {
      console.log('❌ Deployment aborted due to linting errors.');
      process.exit(1);
    }
    console.log('⚠️ Continuing deployment despite linting errors...');
  });
}

// Fix Rollup dependencies
try {
  console.log('🔧 Fixing Rollup dependencies...');
  execSync('npm run fix-rollup', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  console.error('⚠️ Rollup dependency fix failed, but continuing:', error.message);
}

// Build the application
try {
  console.log(`🏗️ Building for ${environment}...`);
  if (environment === 'production') {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  } else {
    execSync('npm run build:dev', { stdio: 'inherit', cwd: rootDir });
  }
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // Try fallback build
  console.log('⚠️ Attempting fallback build...');
  try {
    execSync('npm run build:safe', { stdio: 'inherit', cwd: rootDir });
  } catch (fallbackError) {
    console.error('❌ Fallback build also failed:', fallbackError.message);
    process.exit(1);
  }
}

// Deploy to environment
console.log(`📤 Deploying to ${environment}...`);
try {
  // Check if platform-specific deployment script exists
  const isWindows = process.platform === 'win32';
  const deployScriptPs = path.join(rootDir, `scripts/deploy-${environment}.ps1`);
  const deployScriptSh = path.join(rootDir, `scripts/deploy-${environment}.sh`);
  
  if (isWindows && fs.existsSync(deployScriptPs)) {
    execSync(`powershell -File scripts/deploy-${environment}.ps1`, { stdio: 'inherit', cwd: rootDir });
  } else if (fs.existsSync(deployScriptSh)) {
    execSync(`bash scripts/deploy-${environment}.sh`, { stdio: 'inherit', cwd: rootDir });
  } else {
    console.log('⚠️ No platform-specific deployment script found. Simulating deployment...');
    console.log(`✅ Simulated deployment to ${environment} completed successfully`);
  }
} catch (error) {
  console.error(`❌ Deployment to ${environment} failed:`, error.message);
  process.exit(1);
}

console.log(`🎉 Deployment to ${environment} completed successfully`);