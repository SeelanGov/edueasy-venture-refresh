const { execSync } = require('child_process');

console.log('🚨 EMERGENCY RESTORATION EXECUTION');

try {
  // Execute the emergency script
  const result = execSync('node scripts/emergency-build-fix.js', { 
    stdio: 'inherit'
  });
  
  console.log('\n✅ Emergency script execution completed');
  
} catch (error) {
  console.error('❌ Emergency script failed:', error.message);
}