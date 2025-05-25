// Script to fix Rollup platform-specific dependencies issues
// This script is used to handle the known npm bug with optional dependencies
// https://github.com/npm/cli/issues/4828

// Use CommonJS since this will be run directly with Node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🔧 Fixing Rollup dependencies for the current platform...');

// Check if we should skip platform-specific dependencies
const skipPlatformSpecific = process.env.ROLLUP_SKIP_PLATFORM_SPECIFIC === 'true';

// Always install Linux dependency for CI environments or when explicitly requested
const forceLinuxDep = process.env.CI === 'true' || process.env.FORCE_LINUX_ROLLUP === 'true';

// Install Linux dependency if needed for CI
if (forceLinuxDep) {
  console.log('🔄 CI environment or forced Linux dependency detected, installing Linux x64 version');
  try {
    execSync('npm install @rollup/rollup-linux-x64-gnu --no-save', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Successfully installed Linux Rollup dependency for CI');
  } catch (error) {
    console.error('❌ Failed to install Linux dependency:', error.message);
    // Try with force flag
    try {
      execSync('npm install @rollup/rollup-linux-x64-gnu --no-save --force', { stdio: 'inherit', cwd: rootDir });
      console.log('✅ Successfully installed Linux Rollup dependency with force flag');
    } catch (forceError) {
      console.error('❌ Failed to install Linux dependency even with force flag:', forceError.message);
    }
  }
}

if (skipPlatformSpecific) {
  console.log('⏩ Skipping platform-specific dependencies due to ROLLUP_SKIP_PLATFORM_SPECIFIC=true');
  console.log('⚠️ This may cause issues if the build requires platform-specific binaries');
} else {
  // Detect the current platform and architecture
  const platform = os.platform();
  const arch = os.arch();
  let targetDep = '';

  console.log(`📊 Detected platform: ${platform}, architecture: ${arch}`);

  switch (platform) {
    case 'linux':
      // Use os.arch() for more reliable architecture detection
      if (arch === 'arm64' || arch === 'arm') {
        targetDep = '@rollup/rollup-linux-arm64-gnu';
      } else {
        targetDep = '@rollup/rollup-linux-x64-gnu';
      }
      break;
    case 'darwin': // macOS
      if (arch === 'arm64') {
        targetDep = '@rollup/rollup-darwin-arm64';
      } else {
        targetDep = '@rollup/rollup-darwin-x64';
      }
      break;
    case 'win32':
      targetDep = '@rollup/rollup-win32-x64-msvc';
      break;
    default:
      console.warn(`⚠️ Unsupported platform: ${platform}`);
      console.log('⚠️ Using Linux x64 as fallback');
      targetDep = '@rollup/rollup-linux-x64-gnu';
  }

  console.log(`🔍 Installing: ${targetDep}`);

  try {
    // Install the platform-specific dependency
    execSync(`npm install ${targetDep} --no-save`, { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Successfully installed platform-specific Rollup dependency');
  } catch (error) {
    console.error('❌ Failed to install platform-specific dependency:', error.message);
    
    // Try alternative approach if the first one fails
    console.log('🔄 Trying alternative approach...');
    try {
      // Remove node_modules/.bin/rollup to force reinstallation
      const rollupBinPath = path.join(rootDir, 'node_modules', '.bin', 'rollup');
      if (fs.existsSync(rollupBinPath)) {
        fs.unlinkSync(rollupBinPath);
        console.log('✅ Removed rollup binary to force reinstallation');
      }
      
      // Reinstall rollup
      execSync('npm install rollup --no-save', { stdio: 'inherit', cwd: rootDir });
      console.log('✅ Reinstalled rollup');
      
      // Try installing the platform-specific dependency again
      execSync(`npm install ${targetDep} --no-save --force`, { stdio: 'inherit', cwd: rootDir });
      console.log(`✅ Successfully installed ${targetDep} on second attempt`);
    } catch (secondError) {
      console.error('❌ Alternative approach also failed:', secondError.message);
      
      if (process.env.CI === 'true') {
        console.log('⚠️ Continuing despite error in CI environment');
      } else {
        console.log('⚠️ You may need to manually fix the Rollup dependencies');
        console.log('   Try running: npm run clean');
      }
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