// Script to fix Rollup platform-specific dependencies issues
// This script is used to handle the known npm bug with optional dependencies
// https://github.com/npm/cli/issues/4828

// Use CommonJS since this will be run directly with Node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Rollup dependencies for the current platform...');

// Detect the current platform
const platform = process.platform;
let targetDep = '';

switch (platform) {
  case 'linux':
    // Check if we're on an ARM processor
    const cpuInfo = execSync('uname -m').toString().trim();
    if (cpuInfo.includes('arm') || cpuInfo.includes('aarch64')) {
      targetDep = '@rollup/rollup-linux-arm64-gnu';
    } else {
      targetDep = '@rollup/rollup-linux-x64-gnu';
    }
    break;
  case 'darwin':
    // Check if we're on Apple Silicon
    try {
      const macArch = execSync('uname -m').toString().trim();
      if (macArch === 'arm64') {
        targetDep = '@rollup/rollup-darwin-arm64';
      } else {
        targetDep = '@rollup/rollup-darwin-x64';
      }
    } catch (e) {
      // Default to x64 if we can't determine
      targetDep = '@rollup/rollup-darwin-x64';
    }
    break;
  case 'win32':
    targetDep = '@rollup/rollup-win32-x64-msvc';
    break;
  default:
    console.error(`❌ Unsupported platform: ${platform}`);
    process.exit(1);
}

console.log(`🔍 Detected platform: ${platform}, installing: ${targetDep}`);

try {
  // Install the platform-specific dependency
  execSync(`npm install ${targetDep} --no-save`, { stdio: 'inherit' });
  console.log('✅ Successfully installed platform-specific Rollup dependency');
} catch (error) {
  console.error('❌ Failed to install platform-specific dependency:', error);
  process.exit(1);
}

// Update the build script to use the CI config when in CI environment
if (process.env.CI) {
  console.log('🔄 CI environment detected, updating build command to use CI-specific configuration');
  try {
    const packageJsonPath = path.resolve(process.cwd(), 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Add a CI-specific build command if it doesn't exist
    if (!packageJson.scripts['build:ci']) {
      packageJson.scripts['build:ci'] = 'vite build --config vite.config.ci.ts';
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log('✅ Added build:ci script to package.json');
    }
  } catch (error) {
    console.error('❌ Failed to update package.json:', error);
  }
}

console.log('🎉 Rollup dependency fix completed');