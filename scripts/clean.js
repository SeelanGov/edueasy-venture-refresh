/**
 * Cross-platform script to clean node_modules and package-lock.json
 * and reinstall dependencies with Rollup fixes
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Cleaning project...');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const nodeModulesPath = path.join(rootDir, 'node_modules');
const packageLockPath = path.join(rootDir, 'package-lock.json');

// Step 1: Clean npm cache
console.log('\n📦 Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ npm cache cleaned');
} catch (error) {
  console.warn('⚠️ Failed to clean npm cache (continuing anyway):', error.message);
}

// Step 2: Remove node_modules
if (fs.existsSync(nodeModulesPath)) {
  console.log('📦 Removing node_modules directory...');
  try {
    // Use rimraf for cross-platform directory removal
    execSync('npx rimraf node_modules', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ node_modules removed successfully');
  } catch (error) {
    console.warn('⚠️ Failed to remove node_modules with rimraf:', error.message);

    // Fallback to platform-specific commands
    try {
      if (process.platform === 'win32') {
        execSync('rmdir /s /q node_modules', { stdio: 'inherit', cwd: rootDir });
      } else {
        execSync('rm -rf node_modules', { stdio: 'inherit', cwd: rootDir });
      }
      console.log('✅ node_modules removed successfully with fallback method');
    } catch (fallbackError) {
      console.error('❌ Failed to remove node_modules:', fallbackError.message);
    }
  }
} else {
  console.log('ℹ️ node_modules directory does not exist');
}

// Step 3: Remove package-lock.json
if (fs.existsSync(packageLockPath)) {
  console.log('🔒 Removing package-lock.json...');
  try {
    fs.unlinkSync(packageLockPath);
    console.log('✅ package-lock.json removed successfully');
  } catch (error) {
    console.error('❌ Failed to remove package-lock.json:', error.message);
  }
} else {
  console.log('ℹ️ package-lock.json does not exist');
}

// Step 4: Install dependencies
console.log('📥 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Dependencies installed successfully');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  console.log('🔄 Trying with legacy peer deps...');

  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Dependencies installed with legacy peer deps');
  } catch (fallbackError) {
    console.error('❌ Failed with fallback approach:', fallbackError.message);
    process.exit(1);
  }
}

// Step 5: Fix Rollup dependencies
console.log('🔧 Installing platform-specific Rollup dependencies...');
try {
  execSync('node scripts/fix-rollup-deps.js', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Platform-specific Rollup dependencies installed');

  // Check if we're in a CI environment or need to force Linux dependency
  if (process.env.CI === 'true' || process.env.FORCE_LINUX_ROLLUP === 'true') {
    console.log('🐧 CI environment detected, ensuring Linux Rollup dependency is installed...');
    execSync('node scripts/install-linux-rollup.js', { stdio: 'inherit', cwd: rootDir });
  }
} catch (error) {
  console.error('❌ Failed to install platform-specific Rollup dependencies:', error.message);

  // Try the Linux-specific script as a fallback
  console.log('🔄 Trying Linux-specific installation as fallback...');
  try {
    execSync('node scripts/install-linux-rollup.js', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Linux Rollup dependency installed as fallback');
  } catch (fallbackError) {
    console.error('❌ All Rollup dependency installation attempts failed:', fallbackError.message);
    process.exit(1);
  }
}

console.log('\n🎉 Clean completed successfully');
console.log('You can now run npm run dev or npm run build');
