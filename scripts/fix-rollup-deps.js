
// Enhanced cross-platform script to fix Rollup dependencies with better error handling
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Create a simple logger
const logger = {
  info: (message, ...args) => console.log('[INFO]', message, ...args),
  success: (message, ...args) => console.log('[SUCCESS]', message, ...args),
  warn: (message, ...args) => console.warn('[WARN]', message, ...args),
  error: (message, ...args) => console.error('[ERROR]', message, ...args),
};

logger.info('🔧 Starting enhanced dependency fix process...');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(rootDir, 'node_modules');
const packageLockPath = path.join(rootDir, 'package-lock.json');

// Step 1: Install platform-specific Rollup dependency
logger.info('\n🔧 Installing platform-specific Rollup dependency...');
try {
  // Detect the current platform and architecture
  const platform = os.platform();
  const arch = os.arch();
  let targetDeps = [];

  logger.info(`📊 Detected platform: ${platform}, architecture: ${arch}`);

  // Always install Linux dependency for CI/build environments
  if (process.env.CI === 'true' || process.env.NODE_ENV === 'production') {
    logger.info('🐧 CI/Production environment detected, installing Linux dependency...');
    targetDeps.push('@rollup/rollup-linux-x64-gnu');
  }

  // Install platform-specific dependency based on current platform
  switch (platform) {
    case 'linux':
      if (arch === 'arm64' || arch === 'arm') {
        targetDeps.push('@rollup/rollup-linux-arm64-gnu');
      } else {
        targetDeps.push('@rollup/rollup-linux-x64-gnu');
      }
      break;
    case 'darwin': // macOS
      if (arch === 'arm64') {
        targetDeps.push('@rollup/rollup-darwin-arm64');
      } else {
        targetDeps.push('@rollup/rollup-darwin-x64');
      }
      break;
    case 'win32':
      targetDeps.push('@rollup/rollup-win32-x64-msvc');
      break;
    default:
      logger.warn(`⚠️ Unsupported platform: ${platform}, installing Linux x64 as fallback`);
      targetDeps.push('@rollup/rollup-linux-x64-gnu');
  }

  // Remove duplicates
  targetDeps = [...new Set(targetDeps)];

  logger.info(`🔍 Installing dependencies: ${targetDeps.join(', ')}`);
  
  for (const dep of targetDeps) {
    try {
      execSync(`npm install ${dep} --no-save`, { stdio: 'inherit', cwd: rootDir });
      logger.success(`✅ Successfully installed ${dep}`);
    } catch (error) {
      logger.warn(`⚠️ Failed to install ${dep}, trying with force flag...`);
      try {
        execSync(`npm install ${dep} --no-save --force`, { stdio: 'inherit', cwd: rootDir });
        logger.success(`✅ Successfully installed ${dep} with force flag`);
      } catch (forceError) {
        logger.error(`❌ Failed to install ${dep} even with force flag:`, forceError.message);
      }
    }
  }
  
  logger.success('✅ Platform-specific Rollup dependencies installation completed');
} catch (error) {
  logger.error('❌ Failed to install platform-specific dependencies:', error.message);
  
  // Try alternative approach if the first one fails
  logger.info('🔄 Trying alternative approach...');
  try {
    // Remove node_modules/.bin/rollup to force reinstallation
    const rollupBinPath = path.join(nodeModulesPath, '.bin', 'rollup');
    if (fs.existsSync(rollupBinPath)) {
      fs.unlinkSync(rollupBinPath);
      logger.success('✅ Removed rollup binary to force reinstallation');
    }
    
    // Reinstall rollup
    execSync('npm install rollup --no-save', { stdio: 'inherit', cwd: rootDir });
    logger.success('✅ Reinstalled rollup');
  } catch (secondError) {
    logger.error('❌ Alternative approach also failed:', secondError.message);
    logger.info('🔄 Continuing anyway - build may still work');
  }
}

// Step 2: Check for other common dependency issues
logger.info('\n🔍 Checking for other common dependency issues...');

// Check for duplicate dependencies
try {
  logger.info('🔍 Checking for duplicate dependencies...');
  execSync('npm dedupe', { stdio: 'inherit', cwd: rootDir });
  logger.success('✅ Deduplication completed');
} catch (error) {
  logger.warn('⚠️ Deduplication failed:', error.message);
}

// Step 3: Verify installation
logger.info('\n🔍 Verifying installation...');
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  logger.success(`✅ Project: ${packageJson.name} v${packageJson.version}`);
  
  if (fs.existsSync(nodeModulesPath)) {
    logger.success('✅ node_modules directory exists');
  } else {
    logger.warn('⚠️ node_modules directory not found');
  }
  
  if (fs.existsSync(packageLockPath)) {
    logger.success('✅ package-lock.json exists');
  } else {
    logger.warn('⚠️ package-lock.json not found');
  }
} catch (error) {
  logger.warn('⚠️ Verification failed:', error.message);
}

logger.info('\n🎉 Enhanced dependency fix process completed!');
logger.info('📋 Next steps:');
logger.info('   1. Try building the project: npm run build');
logger.info('   2. If build fails, try the safe build: npm run build:safe');
logger.info('   3. If issues persist, check environment variables');
