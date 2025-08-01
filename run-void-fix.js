const { execSync } = require('child_process');

console.log('🚨 RUNNING VOID RETURN TYPE FIX');

try {
  console.log('Executing void fix script...');
  const result = execSync('node final-void-fix.js', { 
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

console.log('\n📋 VOID FIX COMPLETE');