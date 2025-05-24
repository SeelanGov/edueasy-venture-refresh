// Script to fix dependencies issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting dependency fix process...');

// Step 1: Clean npm cache
console.log('\n📦 Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleaned');
} catch (error) {
  console.error('❌ Failed to clean npm cache:', error);
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
  console.error('❌ Failed to remove directories:', error);
}

// Step 3: Install dependencies
console.log('\n📦 Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error);
  process.exit(1);
}

// Step 4: Install platform-specific Rollup dependency
console.log('\n🔧 Installing platform-specific Rollup dependency...');
try {
  // Detect the current platform
  const platform = process.platform;
  let targetDep = '';

  switch (platform) {
    case 'linux':
      targetDep = '@rollup/rollup-linux-x64-gnu';
      break;
    case 'darwin':
      targetDep = '@rollup/rollup-darwin-x64';
      break;
    case 'win32':
      targetDep = '@rollup/rollup-win32-x64-msvc';
      break;
    default:
      console.error(`❌ Unsupported platform: ${platform}`);
      process.exit(1);
  }

  console.log(`🔍 Detected platform: ${platform}, installing: ${targetDep}`);
  execSync(`npm install ${targetDep} --no-save`, { stdio: 'inherit' });
  console.log('✅ Successfully installed platform-specific Rollup dependency');
} catch (error) {
  console.error('❌ Failed to install platform-specific dependency:', error);
  process.exit(1);
}

console.log('\n🎉 Dependency fix process completed successfully!');
console.log('You can now run npm run build to build the project.');