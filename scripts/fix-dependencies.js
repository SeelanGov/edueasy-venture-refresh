// Enhanced cross-platform script to fix dependencies issues with better error handling
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

// Create a simple logger since we can't import the project logger (circular dependency)
const logger = {
  info: (message, ...args) => console.log(chalk.blue('[INFO]'), message, ...args),
  success: (message, ...args) => console.log(chalk.green('[SUCCESS]'), message, ...args),
  warn: (message, ...args) => console.warn(chalk.yellow('[WARN]'), message, ...args),
  error: (message, ...args) => console.error(chalk.red('[ERROR]'), message, ...args),
};

logger.info('🔧 Starting enhanced dependency fix process...');

// Define paths for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(rootDir, 'node_modules');
const packageLockPath = path.join(rootDir, 'package-lock.json');

// Step 1: Clean npm cache
logger.info('\n📦 Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit', cwd: rootDir });
  logger.success('✅ npm cache cleaned');
} catch (error) {
  logger.warn('⚠️ Failed to clean npm cache (continuing anyway):', error.message);
}

// Step 2: Remove node_modules and package-lock.json
logger.info('\n🗑️ Removing node_modules and package-lock.json...');
try {
  if (fs.existsSync(nodeModulesPath)) {
    // Use rimraf for cross-platform directory removal
    try {
      execSync('npx rimraf node_modules', { stdio: 'inherit', cwd: rootDir });
    } catch (rimrafError) {
      // Fallback to platform-specific commands if rimraf fails
      if (process.platform === 'win32') {
        execSync('rmdir /s /q node_modules', { stdio: 'inherit', cwd: rootDir });
      } else {
        execSync('rm -rf node_modules', { stdio: 'inherit', cwd: rootDir });
      }
    }
  }

  if (fs.existsSync(packageLockPath)) {
    fs.unlinkSync(packageLockPath);
  }
  logger.success('✅ Removed node_modules and package-lock.json');
} catch (error) {
  logger.warn('⚠️ Failed to remove directories (continuing anyway):', error.message);
}

// Step 3: Install dependencies
logger.info('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });
  logger.success('✅ Dependencies installed');
} catch (error) {
  logger.error('❌ Failed to install dependencies:', error.message);
  logger.info('🔄 Trying alternative approach...');

  // Try installing with legacy peer deps
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: rootDir });
    logger.success('✅ Dependencies installed with legacy peer deps');
  } catch (fallbackError) {
    logger.error('❌ Failed with fallback approach:', fallbackError.message);
    logger.info('⚠️ Attempting to continue with platform-specific dependency installation...');
  }
}

// Step 4: Install platform-specific Rollup dependency
logger.info('\n🔧 Installing platform-specific Rollup dependency...');
try {
  // Detect the current platform and architecture
  const platform = os.platform();
  const arch = os.arch();
  let targetDeps = [];

  logger.info(`📊 Detected platform: ${platform}, architecture: ${arch}`);

  switch (platform) {
    case 'linux':
      if (arch === 'arm64' || arch === 'arm') {
        targetDeps = ['@rollup/rollup-linux-arm64-gnu'];
      } else {
        targetDeps = ['@rollup/rollup-linux-x64-gnu'];
      }
      break;
    case 'darwin': // macOS
      if (arch === 'arm64') {
        targetDeps = ['@rollup/rollup-darwin-arm64'];
      } else {
        targetDeps = ['@rollup/rollup-darwin-x64'];
      }
      break;
    case 'win32':
      targetDeps = ['@rollup/rollup-win32-x64-msvc'];
      break;
    default:
      logger.warn(`⚠️ Unsupported platform: ${platform}, installing common Rollup dependencies`);
      targetDeps = [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-win32-x64-msvc',
      ];
  }

  logger.info(`🔍 Detected platform: ${platform} (${arch}), installing: ${targetDeps.join(', ')}`);

  for (const dep of targetDeps) {
    try {
      execSync(`npm install ${dep} --no-save`, { stdio: 'inherit', cwd: rootDir });
      logger.success(`✅ Successfully installed ${dep}`);
    } catch (error) {
      logger.warn(`⚠️ Failed to install ${dep}:`, error.message);
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

// Step 5: Check for other common dependency issues
logger.info('\n🔍 Checking for other common dependency issues...');

// Check for duplicate dependencies
try {
  logger.info('🔍 Checking for duplicate dependencies...');
  execSync('npx dedupe', { stdio: 'inherit', cwd: rootDir });
  logger.success('✅ Deduplication completed');
} catch (error) {
  logger.warn('⚠️ Deduplication failed:', error.message);
}

// Step 6: Verify installation
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
logger.info('   3. If issues persist, try running: npm run fix-rollup');
