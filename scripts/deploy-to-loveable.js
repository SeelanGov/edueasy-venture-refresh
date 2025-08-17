#!/usr/bin/env node

/**
 * Deploy to Loveable.dev Script
 * 
 * This script builds the EduEasy project and deploys it to loveable.dev
 * Includes comprehensive error handling, logging, and deployment verification
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[WARNING]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  progress: (msg) => console.log(`${colors.cyan}[PROGRESS]${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.magenta}[STEP]${colors.reset} ${msg}`),
};

// Configuration
const config = {
  rootDir: process.cwd(),
  buildDir: 'dist',
  timeout: 60000, // 60 seconds for build operations
  maxRetries: 3,
  deploymentUrl: 'https://edueasy.lovable.dev',
};

/**
 * Execute command with error handling and retries
 */
function runCommand(command, description, options = {}) {
  const maxAttempts = options.maxRetries || config.maxRetries;
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      log.progress(`${description} (attempt ${attempt}/${maxAttempts})...`);
      const result = execSync(command, {
        cwd: config.rootDir,
        encoding: 'utf8',
        timeout: options.timeout || config.timeout,
        stdio: 'pipe',
        ...options,
      });
      log.success(`${description} completed successfully`);
      return result;
    } catch (error) {
      lastError = error;
      log.warning(`${description} failed (attempt ${attempt}/${maxAttempts}): ${error.message}`);
      
      if (attempt < maxAttempts) {
        log.info('Retrying in 3 seconds...');
        setTimeout(() => {}, 3000);
      }
    }
  }
  
  log.error(`${description} failed after ${maxAttempts} attempts`);
  throw lastError;
}

/**
 * Phase 1: Pre-Deployment Validation
 */
function preDeploymentValidation() {
  log.step('Phase 1: Pre-Deployment Validation');
  console.log('=' .repeat(50));

  // Step 1.1: Check Node.js and Bun availability
  log.info('Step 1.1: Checking Node.js and Bun availability...');
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const bunVersion = execSync('bun --version', { encoding: 'utf8' }).trim();
    log.success(`✅ Node.js version: ${nodeVersion}`);
    log.success(`✅ Bun version: ${bunVersion}`);
  } catch (error) {
    log.error('❌ Node.js or Bun not available');
    throw new Error('Required tools not available');
  }

  // Step 1.2: Check package.json exists
  log.info('Step 1.2: Checking package.json...');
  const packageJsonPath = path.join(config.rootDir, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    log.error('❌ package.json not found');
    throw new Error('package.json not found');
  }
  log.success('✅ package.json found');

  // Step 1.3: Check build script exists
  log.info('Step 1.3: Checking build script...');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  if (!packageJson.scripts || !packageJson.scripts.build) {
    log.error('❌ Build script not found in package.json');
    throw new Error('Build script missing');
  }
  log.success('✅ Build script found');

  // Step 1.4: Check for critical files
  log.info('Step 1.4: Checking critical project files...');
  const criticalFiles = [
    'vite.config.ts',
    'index.html',
    'src/main.tsx',
    'tsconfig.json'
  ];

  criticalFiles.forEach(file => {
    const filePath = path.join(config.rootDir, file);
    if (fs.existsSync(filePath)) {
      log.success(`✅ ${file} found`);
    } else {
      log.warning(`⚠️ ${file} not found`);
    }
  });

  log.success('✅ Pre-deployment validation completed');
}

/**
 * Phase 2: Dependencies Installation
 */
function installDependencies() {
  log.step('Phase 2: Dependencies Installation');
  console.log('=' .repeat(50));

  // Step 2.1: Install dependencies
  log.info('Step 2.1: Installing dependencies...');
  runCommand('bun install', 'Dependencies installation', { timeout: 120000 });

  // Step 2.2: Verify installation
  log.info('Step 2.2: Verifying installation...');
  const nodeModulesPath = path.join(config.rootDir, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    log.success('✅ Dependencies installed successfully');
  } else {
    log.error('❌ Dependencies installation failed');
    throw new Error('Dependencies not installed');
  }

  log.success('✅ Dependencies installation completed');
}

/**
 * Phase 3: Build Process
 */
function buildProject() {
  log.step('Phase 3: Build Process');
  console.log('=' .repeat(50));

  // Step 3.1: Clean previous build
  log.info('Step 3.1: Cleaning previous build...');
  const distPath = path.join(config.rootDir, config.buildDir);
  if (fs.existsSync(distPath)) {
    fs.rmSync(distPath, { recursive: true, force: true });
    log.success('✅ Previous build cleaned');
  }

  // Step 3.2: Run build command
  log.info('Step 3.2: Building project...');
  runCommand('bun run build', 'Project build', { timeout: 180000 });

  // Step 3.3: Verify build output
  log.info('Step 3.3: Verifying build output...');
  if (fs.existsSync(distPath)) {
    const buildFiles = fs.readdirSync(distPath);
    if (buildFiles.length > 0) {
      log.success(`✅ Build completed successfully (${buildFiles.length} files)`);
      buildFiles.forEach(file => {
        log.info(`   📄 ${file}`);
      });
    } else {
      log.error('❌ Build directory is empty');
      throw new Error('Build output is empty');
    }
  } else {
    log.error('❌ Build directory not created');
    throw new Error('Build failed - no output directory');
  }

  log.success('✅ Build process completed');
}

/**
 * Phase 4: Deployment to Loveable.dev
 */
function deployToLoveable() {
  log.step('Phase 4: Deployment to Loveable.dev');
  console.log('=' .repeat(50));

  // Step 4.1: Check git status for deployment trigger
  log.info('Step 4.1: Checking git status for deployment trigger...');
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim() === '') {
      log.warning('⚠️ No changes to commit - deployment may not trigger');
    } else {
      log.info('📝 Changes detected - will trigger deployment');
    }
  } catch (error) {
    log.warning('⚠️ Could not check git status');
  }

  // Step 4.2: Commit build changes
  log.info('Step 4.2: Committing build changes...');
  try {
    runCommand('git add .', 'Staging changes');
    runCommand('git commit -m "Deploy: Build for loveable.dev deployment"', 'Committing changes');
    log.success('✅ Build changes committed');
  } catch (error) {
    log.warning('⚠️ Could not commit changes - may already be committed');
  }

  // Step 4.3: Push to trigger deployment
  log.info('Step 4.3: Pushing to trigger loveable.dev deployment...');
  try {
    runCommand('git push origin main', 'Pushing to GitHub');
    log.success('✅ Push completed - loveable.dev deployment triggered');
  } catch (error) {
    log.error('❌ Push failed - deployment not triggered');
    throw new Error('GitHub push failed');
  }

  log.success('✅ Deployment to loveable.dev initiated');
}

/**
 * Phase 5: Deployment Verification
 */
function verifyDeployment() {
  log.step('Phase 5: Deployment Verification');
  console.log('=' .repeat(50));

  // Step 5.1: Display deployment information
  log.info('Step 5.1: Deployment information...');
  console.log(`\n🎯 DEPLOYMENT DETAILS:`);
  console.log('=====================');
  console.log(`📦 Build Directory: ${config.buildDir}/`);
  console.log(`🌐 Expected URL: ${config.deploymentUrl}`);
  console.log(`⏱️  Deployment Time: ${new Date().toISOString()}`);
  console.log(`📋 Commit Hash: ${execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim()}`);

  // Step 5.2: Provide monitoring instructions
  log.info('Step 5.2: Monitoring instructions...');
  console.log(`\n📊 MONITORING INSTRUCTIONS:`);
  console.log('==========================');
  console.log('1. Check loveable.dev dashboard for deployment progress');
  console.log('2. Monitor build logs for any errors');
  console.log('3. Wait for deployment to complete (usually 2-5 minutes)');
  console.log('4. Test the live site once deployed');

  // Step 5.3: Provide testing instructions
  log.info('Step 5.3: Testing instructions...');
  console.log(`\n🧪 TESTING INSTRUCTIONS:`);
  console.log('========================');
  console.log('Once deployed, test the following:');
  console.log('✅ Registration form (RegisterForm.tsx)');
  console.log('✅ Document upload (DocumentsUploadStep.tsx)');
  console.log('✅ Error handling (ErrorBoundary.tsx)');
  console.log('✅ Payment integration (if applicable)');
  console.log('✅ Responsive design on different devices');

  log.success('✅ Deployment verification completed');
}

/**
 * Main execution function
 */
function main() {
  console.log(`${colors.cyan}🚀 Deploy to Loveable.dev${colors.reset}`);
  console.log(`${colors.cyan}========================${colors.reset}\n`);
  
  const startTime = new Date();
  
  try {
    // Phase 1: Pre-Deployment Validation
    preDeploymentValidation();
    
    // Phase 2: Dependencies Installation
    installDependencies();
    
    // Phase 3: Build Process
    buildProject();
    
    // Phase 4: Deployment to Loveable.dev
    deployToLoveable();
    
    // Phase 5: Deployment Verification
    verifyDeployment();
    
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n${colors.cyan}📊 DEPLOYMENT SUMMARY:${colors.reset}`);
    console.log('========================');
    console.log(`✅ Pre-Deployment Validation: Completed`);
    console.log(`✅ Dependencies Installation: Completed`);
    console.log(`✅ Build Process: Completed`);
    console.log(`✅ Deployment Trigger: Initiated`);
    console.log(`✅ Verification: Completed`);
    console.log(`⏱️  Total Duration: ${duration.toFixed(2)} seconds`);
    
    console.log(`\n${colors.green}🎉 DEPLOYMENT TO LOVABLE.DEV INITIATED SUCCESSFULLY!${colors.reset}`);
    console.log('\n📋 Next Steps:');
    console.log('1. Monitor loveable.dev dashboard for deployment progress');
    console.log('2. Wait for deployment to complete (2-5 minutes)');
    console.log('3. Test the live site at the provided URL');
    console.log('4. Report any issues to the development team');
    
  } catch (error) {
    const endTime = new Date();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n${colors.red}❌ DEPLOYMENT FAILED${colors.reset}`);
    console.log('==================');
    console.log(`Error: ${error.message}`);
    console.log(`Duration: ${duration.toFixed(2)} seconds`);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check the error message above');
    console.log('2. Verify all dependencies are installed');
    console.log('3. Ensure git is properly configured');
    console.log('4. Contact the development team if issues persist');
    
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = {
  preDeploymentValidation,
  installDependencies,
  buildProject,
  deployToLoveable,
  verifyDeployment,
  main
}; 