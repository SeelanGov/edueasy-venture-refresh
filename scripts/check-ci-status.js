// Cross-platform script to check CI status
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🔍 Checking CI/CD status...');

// Define paths
const rootDir = path.resolve(__dirname, '..');
const ciConfigPath = path.join(rootDir, '.github', 'workflows');

// Check if CI configuration exists
if (fs.existsSync(ciConfigPath)) {
  console.log('✅ CI configuration found at:', ciConfigPath);
  
  // List workflow files
  const workflowFiles = fs.readdirSync(ciConfigPath).filter(file => file.endsWith('.yml') || file.endsWith('.yaml'));
  
  if (workflowFiles.length > 0) {
    console.log('📋 CI Workflow files:');
    workflowFiles.forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.warn('⚠️ No workflow files found in CI configuration directory');
  }
} else {
  console.warn('⚠️ CI configuration directory not found');
}

// Check for Vite CI config
const viteConfigCiPath = path.join(rootDir, 'vite.config.ci.ts');
if (fs.existsSync(viteConfigCiPath)) {
  console.log('✅ Vite CI configuration found');
} else {
  console.warn('⚠️ Vite CI configuration not found');
}

// Check for platform-specific dependencies
try {
  console.log('🔍 Checking for platform-specific dependencies...');
  
  // Check for Rollup platform-specific dependencies
  const nodeModulesPath = path.join(rootDir, 'node_modules');
  const rollupPlatformDeps = fs.readdirSync(nodeModulesPath)
    .filter(dir => dir.startsWith('@rollup/rollup-'));
  
  if (rollupPlatformDeps.length > 0) {
    console.log('✅ Rollup platform-specific dependencies found:');
    rollupPlatformDeps.forEach(dep => {
      console.log(`  - ${dep}`);
    });
  } else {
    console.warn('⚠️ No Rollup platform-specific dependencies found');
    console.log('   Run "npm run fix-rollup" to install the correct dependencies');
  }
} catch (error) {
  console.error('❌ Error checking platform-specific dependencies:', error.message);
}

// Check for build scripts
const packageJsonPath = path.join(rootDir, 'package.json');
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const buildScripts = Object.keys(packageJson.scripts || {})
    .filter(script => script.startsWith('build'));
  
  if (buildScripts.length > 0) {
    console.log('📋 Available build scripts:');
    buildScripts.forEach(script => {
      console.log(`  - ${script}: ${packageJson.scripts[script]}`);
    });
  } else {
    console.warn('⚠️ No build scripts found in package.json');
  }
} catch (error) {
  console.error('❌ Error reading package.json:', error.message);
}

console.log('🎉 CI/CD status check completed');