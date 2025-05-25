/**
 * Script to specifically install the Linux Rollup dependency
 * This is useful for CI environments or when building for Linux targets
 */

const { execSync } = require('child_process');
const path = require('path');

// Define paths
const rootDir = path.resolve(__dirname, '..');

console.log('🐧 Installing Linux Rollup dependency...');

try {
  // First try with normal installation
  execSync('npm install @rollup/rollup-linux-x64-gnu --no-save', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Successfully installed Linux Rollup dependency');
} catch (error) {
  console.error('❌ Failed to install Linux dependency:', error.message);
  
  // Try with force flag
  try {
    console.log('🔄 Trying with --force flag...');
    execSync('npm install @rollup/rollup-linux-x64-gnu --no-save --force', { stdio: 'inherit', cwd: rootDir });
    console.log('✅ Successfully installed Linux Rollup dependency with force flag');
  } catch (forceError) {
    console.error('❌ Failed to install Linux dependency even with force flag:', forceError.message);
    
    // Try with direct download approach
    try {
      console.log('🔄 Trying direct npm registry approach...');
      execSync('npm install https://registry.npmjs.org/@rollup/rollup-linux-x64-gnu/-/rollup-linux-x64-gnu-4.9.5.tgz --no-save', 
        { stdio: 'inherit', cwd: rootDir });
      console.log('✅ Successfully installed Linux Rollup dependency with direct approach');
    } catch (directError) {
      console.error('❌ All approaches failed. Please check your network connection and npm configuration.');
      process.exit(1);
    }
  }
}

console.log('🎉 Linux Rollup dependency installation completed');