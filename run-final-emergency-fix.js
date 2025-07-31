const { execSync } = require('child_process');
const fs = require('fs');

console.log('🚨 EXECUTING FINAL EMERGENCY FIX - PHASE 2');
console.log('📊 Target: Systematic fix of remaining :void and type errors');

try {
  console.log('\n🔧 Running Emergency Build Fix Script...');
  const result = execSync('node execute-emergency-fix-now.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  
  console.log('✅ Emergency script completed');
  console.log('📋 Script Output:');
  console.log(result);
  
  console.log('\n🔍 Post-Fix Build Check...');
  try {
    execSync('npm run build 2>&1', { stdio: 'pipe' });
    console.log('🎉 BUILD SUCCESSFUL! All errors resolved.');
  } catch (buildError) {
    const errorOutput = String(buildError.stdout || buildError.stderr || '');
    const errorLines = errorOutput.split('\n').filter(line => 
      line.includes('error TS') || line.includes('Error:')
    );
    console.log(`📊 Remaining errors: ${errorLines.length}`);
    
    if (errorLines.length <= 20) {
      console.log('🎯 Remaining manageable errors:');
      errorLines.slice(0, 20).forEach(error => console.log(`  - ${error.trim()}`));
    } else {
      console.log('🔧 High error count - showing first 10:');
      errorLines.slice(0, 10).forEach(error => console.log(`  - ${error.trim()}`));
    }
  }
  
} catch (error) {
  console.error('❌ Emergency fix failed:', error.message);
  console.log('\n🔄 FALLBACK: Manual intervention required');
}

console.log('\n📋 FINAL EMERGENCY FIX COMPLETE');
console.log('🎯 NEXT STEPS:');
console.log('  1. Review remaining errors above');
console.log('  2. Test user registration flow');
console.log('  3. Test AI assistant (ThandiAgent)');
console.log('  4. Test admin dashboard functionality');