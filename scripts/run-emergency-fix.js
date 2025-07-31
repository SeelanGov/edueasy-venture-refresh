const { execSync } = require('child_process');

console.log('🚨 Running Emergency Build Fix...');

try {
  // Run the emergency build fix  
  const result = execSync('node scripts/emergency-build-fix.js', { stdio: 'pipe', encoding: 'utf8' });
  console.log(result);
  
  console.log('✅ Emergency build fix completed successfully!');
} catch (error) {
  console.error('❌ Emergency build fix failed:', error.message);
  if (error.stdout) console.log('STDOUT:', error.stdout);
  if (error.stderr) console.log('STDERR:', error.stderr);
  process.exit(1);
}