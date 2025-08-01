const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚨 CRITICAL DEPLOYMENT FIX EXECUTION');
console.log('===================================');

// Step 1: Run the comprehensive void fixes
console.log('\n📦 Step 1: Running comprehensive void return type fixes...');
try {
  execSync('node fix-all-remaining-void-errors.js', { stdio: 'inherit' });
  console.log('✅ Void fixes completed');
} catch (error) {
  console.error('❌ Void fixes failed:', error.message);
}

// Step 2: Run TypeScript check to get exact error count
console.log('\n📦 Step 2: Running TypeScript build check...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ BUILD SUCCESSFUL - READY FOR DEPLOYMENT!');
} catch (error) {
  console.error('❌ Build still has errors - DEPLOYMENT BLOCKED');
  
  // Try TypeScript check for more detailed errors
  try {
    execSync('npx tsc --noEmit', { stdio: 'inherit' });
  } catch (tscError) {
    console.error('TypeScript errors persist');
  }
}

console.log('\n🎯 DEPLOYMENT READINESS ASSESSMENT COMPLETE');