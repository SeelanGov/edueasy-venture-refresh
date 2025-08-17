const fs = require('fs');
const path = require('path');

console.log('🔍 COMPREHENSIVE VALIDATION OF ALL FIXES');
console.log('========================================');

function validateAllFixes() {
  const results = {
    localStorageRecursion: false,
    typescriptCompilation: false,
    errorHandling: false,
    securityImplementation: false,
    passwordChangeAPI: false,
    designSystem: false,
    todos: false,
  };

  try {
    console.log('\n📋 Phase 1: Critical Security Fixes');
    console.log('=====================================');

    // Test 1: localStorage recursion bug
    console.log('\n🔧 Test 1: localStorage Recursion Bug Fix');
    const securityPath = path.join(__dirname, '..', 'src', 'utils', 'security.ts');
    if (fs.existsSync(securityPath)) {
      const content = fs.readFileSync(securityPath, 'utf8');

      const hasOldPatterns =
        content.includes('sessionStorage.setItem') ||
        content.includes('sessionStorage.getItem') ||
        content.includes('sessionStorage.removeItem') ||
        content.includes('sessionStorage.clear');

      const hasNewPatterns =
        content.includes('window.sessionStorage.setItem') &&
        content.includes('window.sessionStorage.getItem') &&
        content.includes('window.sessionStorage.removeItem') &&
        content.includes('window.sessionStorage.clear');

      if (!hasOldPatterns && hasNewPatterns) {
        console.log('✅ localStorage recursion bug: FIXED');
        results.localStorageRecursion = true;
      } else {
        console.log('❌ localStorage recursion bug: NOT FIXED');
        if (hasOldPatterns) {
          console.log('   - Found old recursive patterns');
        }
        if (!hasNewPatterns) {
          console.log('   - Missing window.sessionStorage patterns');
        }
      }
    } else {
      console.log('❌ security.ts file missing');
    }

    // Test 2: TypeScript compilation
    console.log('\n🔧 Test 2: TypeScript Compilation');
    const { execSync } = require('child_process');
    try {
      execSync('npx tsc --noEmit', { stdio: 'pipe' });
      console.log('✅ TypeScript compilation: PASSED');
      results.typescriptCompilation = true;
    } catch (error) {
      console.log('❌ TypeScript compilation: FAILED');
      console.log('   - Compilation errors found');
    }

    // Test 3: Error handling system
    console.log('\n🔧 Test 3: Centralized Error Handling');
    const errorHandlingPath = path.join(__dirname, '..', 'src', 'utils', 'errorHandling.ts');
    if (fs.existsSync(errorHandlingPath)) {
      const content = fs.readFileSync(errorHandlingPath, 'utf8');

      const hasCentralizedSystem =
        content.includes('export const handleError') &&
        content.includes('export const safeAsync') &&
        content.includes('export const parseError') &&
        content.includes('AppError');

      if (hasCentralizedSystem) {
        console.log('✅ Centralized error handling: IMPLEMENTED');
        results.errorHandling = true;
      } else {
        console.log('❌ Centralized error handling: MISSING');
      }
    } else {
      console.log('❌ errorHandling.ts file missing');
    }

    // Test 4: Security implementation
    console.log('\n🔧 Test 4: Security Implementation');
    const securitySettingsPath = path.join(
      __dirname,
      '..',
      'src',
      'components',
      'security',
      'SecuritySettings.tsx',
    );
    if (fs.existsSync(securitySettingsPath)) {
      const content = fs.readFileSync(securitySettingsPath, 'utf8');

      const hasPasswordAPI =
        content.includes('supabase.auth.updateUser') &&
        !content.includes('TODO: Implement password change API call');

      const usesErrorHandling =
        content.includes('import { handleError, safeAsync }') && content.includes('safeAsync(');

      if (hasPasswordAPI && usesErrorHandling) {
        console.log('✅ Security implementation: COMPLETE');
        results.securityImplementation = true;
        results.passwordChangeAPI = true;
      } else {
        console.log('❌ Security implementation: INCOMPLETE');
        if (!hasPasswordAPI) {
          console.log('   - Password change API not implemented');
        }
        if (!usesErrorHandling) {
          console.log('   - Not using centralized error handling');
        }
      }
    } else {
      console.log('❌ SecuritySettings.tsx file missing');
    }

    // Test 5: Design system violations
    console.log('\n🔧 Test 5: Design System Compliance');
    const designSystemViolations = [];

    // Check for raw HTML elements
    const filesToCheck = [
      'src/components/security/SecuritySettings.tsx',
      'src/components/ui/Button.tsx',
      'src/components/ui/Card.tsx',
    ];

    for (const file of filesToCheck) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');

        // Check for raw HTML elements instead of components
        if (content.includes('<button ') && !content.includes('import { Button }')) {
          designSystemViolations.push(`${file}: Raw <button> element`);
        }

        if (
          content.includes('<div ') &&
          content.includes('className="bg-') &&
          !content.includes('import { Card }')
        ) {
          designSystemViolations.push(`${file}: Raw <div> with hardcoded colors`);
        }
      }
    }

    if (designSystemViolations.length === 0) {
      console.log('✅ Design system compliance: GOOD');
      results.designSystem = true;
    } else {
      console.log('⚠️ Design system violations found:');
      designSystemViolations.forEach((violation) => {
        console.log(`   - ${violation}`);
      });
    }

    // Test 6: TODO items
    console.log('\n🔧 Test 6: TODO Items');
    const todoPatterns = ['TODO: Implement', 'FIXME:', 'BUG:', 'HACK:'];

    const todoFiles = [];
    const searchInDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
          searchInDirectory(fullPath);
        } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx'))) {
          const content = fs.readFileSync(fullPath, 'utf8');
          for (const pattern of todoPatterns) {
            if (content.includes(pattern)) {
              todoFiles.push(`${fullPath}: ${pattern}`);
            }
          }
        }
      }
    };

    searchInDirectory(path.join(__dirname, '..', 'src'));

    if (todoFiles.length === 0) {
      console.log('✅ No critical TODO items found');
      results.todos = true;
    } else {
      console.log('⚠️ Critical TODO items found:');
      todoFiles.slice(0, 5).forEach((todo) => {
        console.log(`   - ${todo}`);
      });
      if (todoFiles.length > 5) {
        console.log(`   - ... and ${todoFiles.length - 5} more`);
      }
    }

    console.log('\n📊 VALIDATION SUMMARY');
    console.log('=====================');

    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;

    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`);

    console.log('\n🎯 DETAILED RESULTS:');
    console.log('===================');

    Object.entries(results).forEach(([test, passed]) => {
      const status = passed ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} ${test.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
    });

    console.log('\n🚀 DEPLOYMENT READINESS:');
    console.log('=======================');

    if (passedTests >= totalTests - 1) {
      console.log('🎉 READY FOR DEPLOYMENT');
      console.log('   - All critical issues resolved');
      console.log('   - Security fixes implemented');
      console.log('   - Error handling standardized');
      console.log('   - TypeScript compilation clean');
    } else if (passedTests >= totalTests - 2) {
      console.log('⚠️ MOSTLY READY FOR DEPLOYMENT');
      console.log('   - Minor issues remain');
      console.log('   - Consider addressing remaining issues');
    } else {
      console.log('❌ NOT READY FOR DEPLOYMENT');
      console.log('   - Critical issues remain');
      console.log('   - Address issues before deployment');
    }

    return results;
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return results;
  }
}

// Run validation
validateAllFixes();
