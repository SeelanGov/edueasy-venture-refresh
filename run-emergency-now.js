const { execSync } = require('child_process');

console.log('🚨 RUNNING EMERGENCY FIX NOW');

try {
  const result = execSync('node execute-emergency-build-fix.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  
  console.log('✅ Emergency script completed');
  console.log(result);
  
  console.log('\n🔍 Checking build status...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('🎉 BUILD SUCCESSFUL!');
  } catch (buildError) {
    const errorOutput = String(buildError.stdout || buildError.stderr || '');
    const errorLines = errorOutput.split('\n').filter(line => 
      line.includes('error TS')
    );
    console.log(`📊 Remaining errors: ${errorLines.length}`);
    
    if (errorLines.length <= 20) {
      console.log('🎯 Remaining errors:');
      errorLines.slice(0, 20).forEach(error => console.log(`  ${error.trim()}`));
    }
  }
  
} catch (error) {
  console.error('❌ Emergency fix failed:', error.message);
}