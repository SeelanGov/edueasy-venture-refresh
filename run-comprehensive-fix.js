const { execSync } = require('child_process');

console.log('🚨 RUNNING COMPREHENSIVE TYPESCRIPT FIX');
console.log('📊 Target: Fix all remaining TypeScript errors systematically');

try {
  console.log('\n🔧 PHASE 1: Running comprehensive fix script...');
  const result = execSync('node fix-all-typescript-errors.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  
  console.log('✅ Comprehensive script completed');
  console.log('📋 Script Output:');
  console.log(result);
  
} catch (error) {
  console.error('❌ Comprehensive fix failed:', error.message);
}

console.log('\n📋 COMPREHENSIVE FIX COMPLETE');