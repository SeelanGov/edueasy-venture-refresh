const { execSync } = require('child_process');

console.log('🚨 EXECUTING COMPREHENSIVE TYPESCRIPT FIX');

try {
  console.log('Running comprehensive TypeScript fix script...');
  const result = execSync('node fix-all-remaining-typescript-errors.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  
  console.log('✅ Comprehensive fix completed');
  console.log('📋 Output:', result);
  
} catch (error) {
  console.error('❌ Comprehensive fix had issues:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
}

console.log('\n📋 COMPREHENSIVE FIX COMPLETE');