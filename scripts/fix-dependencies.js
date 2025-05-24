
// Enhanced script to fix dependencies issues with better error handling
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting enhanced dependency fix process...');

// Step 1: Clean npm cache
console.log('\n📦 Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleaned');
} catch (error) {
  console.warn('⚠️ Failed to clean npm cache (continuing anyway):', error.message);
}

// Step 2: Remove node_modules and package-lock.json
console.log('\n🗑️ Removing node_modules and package-lock.json...');
try {
  if (fs.existsSync('node_modules')) {
    if (process.platform === 'win32') {
      execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules', { stdio: 'inherit' });
    }
  }
  if (fs.existsSync('package-lock.json')) {
    fs.unlinkSync('package-lock.json');
  }
  console.log('✅ Removed node_modules and package-lock.json');
} catch (error) {
  console.warn('⚠️ Failed to remove directories (continuing anyway):', error.message);
}

// Step 3: Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  console.log('🔄 Trying alternative approach...');
  
  // Try installing with legacy peer deps
  try {
    execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
    console.log('✅ Dependencies installed with legacy peer deps');
  } catch (fallbackError) {
    console.error('❌ Failed with fallback approach:', fallbackError.message);
    process.exit(1);
  }
}

// Step 4: Install platform-specific Rollup dependency
console.log('\n🔧 Installing platform-specific Rollup dependency...');
try {
  // Detect the current platform and architecture
  const platform = process.platform;
  const arch = process.arch;
  let targetDeps = [];

  switch (platform) {
    case 'linux':
      if (arch === 'arm64') {
        targetDeps = ['@rollup/rollup-linux-arm64-gnu'];
      } else {
        targetDeps = ['@rollup/rollup-linux-x64-gnu'];
      }
      break;
    case 'darwin':
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
      execSync(`npm install ${dep} --no-save`, { stdio: 'inherit' });
      console.log(`✅ Successfully installed ${dep}`);
    } catch (error) {
      console.warn(`⚠️ Failed to install ${dep}:`, error.message);
    }
  }
  
  console.log('✅ Platform-specific Rollup dependencies installation completed');
} catch (error) {
  console.error('❌ Failed to install platform-specific dependencies:', error.message);
  console.log('🔄 Continuing anyway - build may still work');
}

// Step 5: Verify installation
console.log('\n🔍 Verifying installation...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log(`✅ Project: ${packageJson.name} v${packageJson.version}`);
  
  if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules directory exists');
  } else {
    console.warn('⚠️ node_modules directory not found');
  }
  
  if (fs.existsSync('package-lock.json')) {
    console.log('✅ package-lock.json exists');
  } else {
    console.warn('⚠️ package-lock.json not found');
  }
} catch (error) {
  console.warn('⚠️ Verification failed:', error.message);
}

console.log('\n🎉 Enhanced dependency fix process completed!');
console.log('You can now run npm run build to test the build process.');
console.log('If issues persist, try running npm run build:ci for a CI-compatible build.');
