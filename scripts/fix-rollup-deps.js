// Script to fix Rollup platform-specific dependencies issues
// This script is used to handle the known npm bug with optional dependencies
// https://github.com/npm/cli/issues/4828

// Use CommonJS since this will be run directly with Node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing Rollup dependencies for the current platform...');

// Check if we should skip platform-specific dependencies
const skipPlatformSpecific = process.env.ROLLUP_SKIP_PLATFORM_SPECIFIC === 'true';

if (skipPlatformSpecific) {
  console.log('⏩ Skipping platform-specific dependencies due to ROLLUP_SKIP_PLATFORM_SPECIFIC=true');
  console.log('⚠️ This may cause issues if the build requires platform-specific binaries');
  
  // For CI environments, we'll install the Linux x64 version as a fallback
  if (process.env.CI === 'true') {
    console.log('🔄 CI environment detected, installing Linux x64 version as fallback');
    try {
      execSync('npm install @rollup/rollup-linux-x64-gnu --no-save', { stdio: 'inherit' });
      console.log('✅ Successfully installed fallback Rollup dependency');
    } catch (error) {
      console.error('❌ Failed to install fallback dependency:', error);
      // Don't exit with error, try to continue
    }
  }
} else {
  // Detect the current platform
  const platform = process.platform;
  let targetDep = '';

  switch (platform) {
    case 'linux':
      // Check if we're on an ARM processor
      try {
        const cpuInfo = execSync('uname -m').toString().trim();
        if (cpuInfo.includes('arm') || cpuInfo.includes('aarch64')) {
          targetDep = '@rollup/rollup-linux-arm64-gnu';
        } else {
          targetDep = '@rollup/rollup-linux-x64-gnu';
        }
      } catch (e) {
        // Default to x64 if we can't determine
        targetDep = '@rollup/rollup-linux-x64-gnu';
        console.warn('⚠️ Could not determine CPU architecture, defaulting to x64');
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
        console.warn('⚠️ Could not determine CPU architecture, defaulting to x64');
      }
      break;
    case 'win32':
      targetDep = '@rollup/rollup-win32-x64-msvc';
      break;
    default:
      console.error(`❌ Unsupported platform: ${platform}`);
      if (process.env.CI === 'true') {
        console.log('⚠️ Attempting to continue without platform-specific dependency');
        targetDep = '@rollup/rollup-linux-x64-gnu'; // Default fallback
      } else {
        process.exit(1);
      }
  }

  console.log(`🔍 Detected platform: ${platform}, installing: ${targetDep}`);

  try {
    // Install the platform-specific dependency
    execSync(`npm install ${targetDep} --no-save`, { stdio: 'inherit' });
    console.log('✅ Successfully installed platform-specific Rollup dependency');
  } catch (error) {
    console.error('❌ Failed to install platform-specific dependency:', error);
    if (process.env.CI === 'true') {
      console.log('⚠️ Continuing despite error in CI environment');
    } else {
      process.exit(1);
    }
  }
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
    
    // Check if vite.config.ci.ts exists
    const ciConfigPath = path.resolve(process.cwd(), 'vite.config.ci.ts');
    if (!fs.existsSync(ciConfigPath)) {
      console.warn('⚠️ vite.config.ci.ts not found, CI build may fail');
      // Copy the regular vite.config.ts as a fallback
      const regularConfigPath = path.resolve(process.cwd(), 'vite.config.ts');
      if (fs.existsSync(regularConfigPath)) {
        const regularConfig = fs.readFileSync(regularConfigPath, 'utf8');
        fs.writeFileSync(ciConfigPath, regularConfig);
        console.log('✅ Created vite.config.ci.ts as a copy of vite.config.ts');
      }
    }
  } catch (error) {
    console.error('❌ Failed to update package.json or check config files:', error);
    // Don't exit with error in CI environment
  }
}

console.log('🎉 Rollup dependency fix completed');