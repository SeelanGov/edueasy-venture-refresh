const { execSync } = require('child_process');

console.log('🚨 EXECUTING STEP 1: COMPREHENSIVE VOID FIX');

try {
  // Execute the comprehensive fix script
  console.log('Running comprehensive void fix script...');
  const result = execSync('node execute-step1-void-fix.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  
  console.log('✅ Script completed');
  console.log('📋 Output:', result);
  
} catch (error) {
  console.error('❌ Script failed:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
}

console.log('\n📋 STEP 1 EXECUTION COMPLETE');