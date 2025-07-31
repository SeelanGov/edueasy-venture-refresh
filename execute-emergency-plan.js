const { execSync } = require('child_process');

console.log('🚨 EXECUTING EMERGENCY BUILD RESTORATION PLAN');
console.log('📊 Target: Fix 67+ TypeScript errors in 4 phases\n');

// Phase 1: Execute Emergency Script
console.log('PHASE 1: Running Emergency Build Fix Script...');
try {
  const scriptResult = execSync('node scripts/emergency-build-fix.js', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  console.log('✅ Emergency script completed');
  console.log('📋 Results:', scriptResult.split('\n').slice(-5).join('\n'));
} catch (error) {
  console.error('❌ Emergency script failed:', error.message);
}

// Phase 2: Check build status
console.log('\nPHASE 2: Checking Build Status...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ BUILD SUCCESSFUL! All errors resolved.');
} catch (buildError) {
  console.log('⚠️  Build errors remain:');
  const errorOutput = buildError.stdout || buildError.stderr || '';
  const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
  console.log(`📊 Error count: ${errorLines.length}`);
  
  if (errorLines.length <= 10) {
    console.log('🎯 Remaining errors (manageable):');
    errorLines.slice(0, 10).forEach(error => console.log(`  - ${error}`));
  } else {
    console.log('🔧 High error count - manual intervention needed');
  }
}

console.log('\n🎉 EMERGENCY RESTORATION PLAN EXECUTED');
console.log('📋 Next Steps:');
console.log('  1. Review build output above');
console.log('  2. Test admin panel functionality');
console.log('  3. Verify partner management components');
console.log('  4. Check RLS dashboard functionality');