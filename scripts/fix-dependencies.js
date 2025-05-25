// Enhanced cross-platform script to fix dependencies issues with better error handling
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('🔧 Starting enhanced dependency fix process...');

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

// Step 2: Remove node_modules and package-lock.json
console.log('\n🗑️ Removing node_modules and package-lock.json...');
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
  console.log('✅ Removed node_modules and package-lock.json');
} catch (error) {
  console.warn('⚠️ Failed to remove directories (continuing anyway):', error.message);
}

// Step 3: Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  console.log('🔄 Trying alternative approach...');
  
  // Try installing with legacy peer deps
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Dependencies installed with legacy peer deps');
  } catch (fallbackError) {
    console.error('❌ Failed with fallback approach:', fallbackError.message);
    console.log('⚠️ Attempting to continue with platform-specific dependency installation...');
  }
}

// Step 4: Install platform-specific Rollup dependency
console.log('\n🔧 Installing platform-specific Rollup dependency...');
try {
  // Detect the current platform and architecture
  const platform = os.platform();
  const arch = os.arch();
  let targetDeps = [];

  console.log(`📊 Detected platform: ${platform}, architecture: ${arch}`);

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
      console.warn(`⚠️ Unsupported platform: ${platform}, installing common Rollup dependencies`);
      targetDeps = [
        '@rollup/rollup-linux-x64-gnu',
        '@rollup/rollup-darwin-x64',
        '@rollup/rollup-win32-x64-msvc'
      ];
  }

  console.log(`🔍 Detected platform: ${platform} (${arch}), installing: ${targetDeps.join(', ')}`);
  
  for (const dep of targetDeps) {
    try {
      execSync(`npm install ${dep} --no-save`, { stdio: 'inherit', cwd: rootDir });
      console.log(`✅ Successfully installed ${dep}`);
    } catch (error) {
      console.warn(`⚠️ Failed to install ${dep}:`, error.message);
    }
  }
  
  console.log('✅ Platform-specific Rollup dependencies installation completed');
} catch (error) {
  console.error('❌ Failed to install platform-specific dependencies:', error.message);
  
  // Try alternative approach if the first one fails
  console.log('🔄 Trying alternative approach...');
  try {
    // Remove node_modules/.bin/rollup to force reinstallation
    const rollupBinPath = path.join(nodeModulesPath, '.bin', 'rollup');
    if (fs.existsSync(rollupBinPath)) {
      fs.unlinkSync(rollupBinPath);
      console.log('✅ Removed rollup binary to force reinstallation');
    }
    
    // Reinstall rollup
    execSync('npm install rollup --no-save', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Reinstalled rollup');
  } catch (secondError) {
    console.error('❌ Alternative approach also failed:', secondError.message);
    console.log('🔄 Continuing anyway - build may still work');
  }
}

// Step 5: Check for other common dependency issues
console.log('\n🔍 Checking for other common dependency issues...');

// Check for duplicate dependencies
try {
  console.log('🔍 Checking for duplicate dependencies...');
  execSync('npx dedupe', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Deduplication completed');
} catch (error) {
  console.warn('⚠️ Deduplication failed:', error.message);
}

// Step 6: Verify installation
console.log('\n🔍 Verifying installation...');
try {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`✅ Project: ${packageJson.name} v${packageJson.version}`);
  
  if (fs.existsSync(nodeModulesPath)) {
    console.log('✅ node_modules directory exists');
  } else {
    console.warn('⚠️ node_modules directory not found');
  }
  
  if (fs.existsSync(packageLockPath)) {
    console.log('✅ package-lock.json exists');
  } else {
    console.warn('⚠️ package-lock.json not found');
  }
} catch (error) {
  console.warn('⚠️ Verification failed:', error.message);
}

console.log('\n🎉 Enhanced dependency fix process completed!');
console.log('📋 Next steps:');
console.log('   1. Try building the project: npm run build');
console.log('   2. If build fails, try the safe build: npm run build:safe');
console.log('   3. If issues persist, try running: npm run fix-rollup');
