const { execSync } = require('child_process');

console.log('🚨 Running Emergency Build Fix...');

try {
  // Run the emergency build fix
  execSync('node scripts/emergency-build-fix.js', { stdio: 'inherit' });
  
  console.log('✅ Emergency build fix completed successfully!');
} catch (error) {
  console.error('❌ Emergency build fix failed:', error.message);
  process.exit(1);
}