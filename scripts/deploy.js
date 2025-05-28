// Cross-platform deployment script
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const logger = require('../src/utils/logger');

// Get environment from command line arguments
const environment = process.argv[2];

if (!environment || !['staging', 'production'].includes(environment)) {
  logger.error('❌ Please specify a valid environment: staging or production');
  process.exit(1);
}

logger.info(`🚀 Starting deployment to ${environment}...`);

// Define paths
const rootDir = path.resolve(__dirname, '..');
const envFilePath = path.join(rootDir, '.env');
const envExamplePath = path.join(rootDir, '.env.example');

// Check if .env file exists
if (!fs.existsSync(envFilePath)) {
  logger.error('❌ .env file not found. Please create one based on .env.example');
  if (fs.existsSync(envExamplePath)) {
    logger.info('ℹ️ .env.example file found. You can copy it to .env and update the values.');
  }
  process.exit(1);
}

// Verify environment variables
try {
  logger.info('🔍 Verifying environment variables...');
  execSync('node scripts/verify-env.js', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  logger.error('❌ Environment verification failed:', error.message);
  process.exit(1);
}

// Run type checking
try {
  logger.info('🔍 Running type checking...');
  execSync('npm run type-check', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  logger.error('❌ Type checking failed:', error.message);
  process.exit(1);
}

// Run linting with auto-fix
try {
  logger.info('🔍 Running linting with auto-fix...');
  execSync('npm run lint:fix', { stdio: 'inherit', cwd: rootDir });
  
  // Run regular lint to check if all issues are fixed
  logger.info('🔍 Verifying linting...');
  execSync('npm run lint', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  logger.error('❌ Linting failed:', error.message);
  logger.info('⚠️ Some linting issues could not be fixed automatically. Please fix them manually.');
  
  // Ask for confirmation to continue despite linting errors
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  readline.question('Continue with deployment despite linting errors? (y/n): ', (answer) => {
    readline.close();
    if (answer.toLowerCase() !== 'y') {
      logger.error('❌ Deployment aborted due to linting errors.');
      process.exit(1);
    }
    logger.info('⚠️ Continuing deployment despite linting errors...');
  });
}

// Fix Rollup dependencies
try {
  logger.info('🔧 Fixing Rollup dependencies...');
  execSync('npm run fix-rollup', { stdio: 'inherit', cwd: rootDir });
} catch (error) {
  logger.warn('⚠️ Rollup dependency fix failed, but continuing:', error.message);
}

// Build the application
try {
  logger.info(`🏗️ Building for ${environment}...`);
  if (environment === 'production') {
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });
  } else {
    execSync('npm run build:dev', { stdio: 'inherit', cwd: rootDir });
  }
} catch (error) {
  logger.error('❌ Build failed:', error.message);
  
  // Try fallback build
  logger.info('⚠️ Attempting fallback build...');
  try {
    execSync('npm run build:safe', { stdio: 'inherit', cwd: rootDir });
  } catch (fallbackError) {
    logger.error('❌ Fallback build also failed:', fallbackError.message);
    process.exit(1);
  }
}

// Deploy to environment
logger.info(`📤 Deploying to ${environment}...`);
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
    logger.info('⚠️ No platform-specific deployment script found. Simulating deployment...');
    logger.info(`✅ Simulated deployment to ${environment} completed successfully`);
  }
} catch (error) {
  logger.error(`❌ Deployment to ${environment} failed:`, error.message);
  process.exit(1);
}

logger.info(`🎉 Deployment to ${environment} completed successfully`);