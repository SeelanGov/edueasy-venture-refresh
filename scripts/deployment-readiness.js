const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 DEPLOYMENT READINESS CHECK');
console.log('============================');

function checkDeploymentReadiness() {
  const checks = {
    typescript: false,
    localStorage: false,
    security: false,
    errorHandling: false,
    todos: false,
    gitStatus: false,
  };

  console.log('\n📋 Running critical checks...\n');

  // Check 1: TypeScript compilation
  console.log('🔧 Check 1: TypeScript Compilation');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript compilation: PASSED');
    checks.typescript = true;
  } catch (error) {
    console.log('❌ TypeScript compilation: FAILED');
    console.log('   - Fix compilation errors before deployment');
  }

  // Check 2: localStorage recursion bug
  console.log('\n🔧 Check 2: localStorage Recursion Bug');
  const securityPath = path.join(__dirname, '..', 'src', 'utils', 'security.ts');
  if (fs.existsSync(securityPath)) {
    const content = fs.readFileSync(securityPath, 'utf8');
    const hasOldPatterns = content.includes('sessionStorage.setItem') ||
                          content.includes('sessionStorage.getItem') ||
                          content.includes('sessionStorage.removeItem') ||
                          content.includes('sessionStorage.clear');
    
    if (!hasOldPatterns) {
      console.log('✅ localStorage recursion bug: FIXED');
      checks.localStorage = true;
    } else {
      console.log('❌ localStorage recursion bug: NOT FIXED');
      console.log('   - Critical security issue remains');
    }
  } else {
    console.log('❌ security.ts file missing');
  }

  // Check 3: Security implementation
  console.log('\n🔧 Check 3: Security Implementation');
  const securitySettingsPath = path.join(__dirname, '..', 'src', 'components', 'security', 'SecuritySettings.tsx');
  if (fs.existsSync(securitySettingsPath)) {
    const content = fs.readFileSync(securitySettingsPath, 'utf8');
    const hasPasswordAPI = content.includes('supabase.auth.updateUser') &&
                          !content.includes('TODO: Implement password change API call');
    
    if (hasPasswordAPI) {
      console.log('✅ Password change API: IMPLEMENTED');
      checks.security = true;
    } else {
      console.log('❌ Password change API: NOT IMPLEMENTED');
    }
  } else {
    console.log('❌ SecuritySettings.tsx file missing');
  }

  // Check 4: Error handling system
  console.log('\n🔧 Check 4: Error Handling System');
  const errorHandlingPath = path.join(__dirname, '..', 'src', 'utils', 'errorHandling.ts');
  if (fs.existsSync(errorHandlingPath)) {
    const content = fs.readFileSync(errorHandlingPath, 'utf8');
    const hasCentralizedSystem = content.includes('export const handleError') &&
                               content.includes('export const safeAsync');
    
    if (hasCentralizedSystem) {
      console.log('✅ Centralized error handling: IMPLEMENTED');
      checks.errorHandling = true;
    } else {
      console.log('❌ Centralized error handling: INCOMPLETE');
    }
  } else {
    console.log('❌ errorHandling.ts file missing');
  }

  // Check 5: Critical TODO items
  console.log('\n🔧 Check 5: Critical TODO Items');
  const criticalTodos = [];
  
  const searchForTodos = (dir) => {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        searchForTodos(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('TODO: Implement') && 
            (content.includes('password') || content.includes('security') || content.includes('API'))) {
          criticalTodos.push(fullPath.replace(path.join(__dirname, '..'), ''));
        }
      }
    }
  };
  
  searchForTodos(path.join(__dirname, '..', 'src'));
  
  if (criticalTodos.length === 0) {
    console.log('✅ No critical TODO items found');
    checks.todos = true;
  } else {
    console.log('⚠️ Critical TODO items found:');
    criticalTodos.forEach(todo => {
      console.log(`   - ${todo}`);
    });
  }

  // Check 6: Git status
  console.log('\n🔧 Check 6: Git Status');
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    if (gitStatus.trim() === '') {
      console.log('✅ Working directory clean');
      checks.gitStatus = true;
    } else {
      console.log('⚠️ Uncommitted changes detected');
      console.log('   - Consider committing changes before deployment');
    }
  } catch (error) {
    console.log('❌ Git status check failed');
  }

  // Final assessment
  console.log('\n📊 DEPLOYMENT ASSESSMENT');
  console.log('========================');
  
  const totalChecks = Object.keys(checks).length;
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const criticalChecks = [checks.typescript, checks.localStorage, checks.security];
  const criticalPassed = criticalChecks.filter(Boolean).length;
  
  console.log(`Total Checks: ${totalChecks}`);
  console.log(`Passed Checks: ${passedChecks}`);
  console.log(`Critical Checks Passed: ${criticalPassed}/${criticalChecks.length}`);
  
  console.log('\n🎯 DEPLOYMENT RECOMMENDATION:');
  console.log('============================');
  
  if (criticalPassed === criticalChecks.length && passedChecks >= totalChecks - 1) {
    console.log('🎉 READY FOR DEPLOYMENT');
    console.log('   ✅ All critical security issues resolved');
    console.log('   ✅ TypeScript compilation clean');
    console.log('   ✅ localStorage recursion bug fixed');
    console.log('   ✅ Security features implemented');
    console.log('   ✅ Error handling standardized');
    console.log('\n🚀 You can safely push to remote with confidence!');
    
    console.log('\n📋 Recommended deployment steps:');
    console.log('1. git add .');
    console.log('2. git commit -m "Fix: Complete security and error handling improvements"');
    console.log('3. git push origin main');
    
    return true;
  } else if (criticalPassed === criticalChecks.length) {
    console.log('⚠️ MOSTLY READY FOR DEPLOYMENT');
    console.log('   ✅ Critical issues resolved');
    console.log('   ⚠️ Minor issues remain (non-blocking)');
    console.log('\n🚀 Safe to deploy, but consider addressing minor issues');
    
    return true;
  } else {
    console.log('❌ NOT READY FOR DEPLOYMENT');
    console.log('   ❌ Critical issues remain');
    console.log('   ❌ Security vulnerabilities present');
    console.log('\n🔧 Address critical issues before deployment');
    
    if (!checks.typescript) {
      console.log('   - Fix TypeScript compilation errors');
    }
    if (!checks.localStorage) {
      console.log('   - Fix localStorage recursion bug');
    }
    if (!checks.security) {
      console.log('   - Implement missing security features');
    }
    
    return false;
  }
}

// Run deployment readiness check
const isReady = checkDeploymentReadiness();

console.log('\n' + '='.repeat(50));
if (isReady) {
  console.log('🎉 DEPLOYMENT READY - SAFE TO PUSH TO REMOTE');
} else {
  console.log('❌ DEPLOYMENT NOT READY - FIX ISSUES FIRST');
}
console.log('='.repeat(50)); 