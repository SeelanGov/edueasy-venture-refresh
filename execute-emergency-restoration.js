const { execSync } = require('child_process');

console.log('🚨 EXECUTING EMERGENCY RESTORATION PROTOCOL');
console.log('📊 Target: Systematic fix of 180+ TypeScript errors');

try {
  console.log('\n🔧 PHASE 1: Running Emergency Build Fix...');
  const result = execSync('node scripts/emergency-build-fix.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  
  console.log('✅ Emergency script completed');
  console.log('📋 Script Output:');
  console.log(result);
  
  console.log('\n🔍 PHASE 2: Post-Fix Build Check...');
  try {
    execSync('npm run build', { stdio: 'pipe' });
    console.log('✅ BUILD SUCCESSFUL! All errors resolved.');
  } catch (buildError) {
    const errorOutput = buildError.stdout || buildError.stderr || '';
    const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
    console.log(`📊 Remaining errors: ${errorLines.length}`);
    
    if (errorLines.length <= 20) {
      console.log('🎯 Manageable error count - listing remaining issues:');
      errorLines.slice(0, 20).forEach(error => console.log(`  - ${error}`));
    }
  }
  
} catch (error) {
  console.error('❌ Emergency restoration failed:', error.message);
  console.log('\n🔄 FALLBACK: Manual intervention required');
}

console.log('\n📋 RESTORATION COMPLETE');