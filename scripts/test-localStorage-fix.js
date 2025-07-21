// Simple localStorage Fix Validation Script
// This script validates that the localStorage recursion bug is fixed

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating localStorage Fixes...');
console.log('==================================');

function validateFixes() {
  const results = {
    secureStorageCreated: false,
    localStorageFixed: false,
    filesUpdated: false
  };

  try {
    console.log('\n📁 Step 1: Checking secureStorage.ts creation...');
    
    const secureStoragePath = path.join(__dirname, '..', 'src', 'utils', 'secureStorage.ts');
    
    if (fs.existsSync(secureStoragePath)) {
      const content = fs.readFileSync(secureStoragePath, 'utf8');
      
      if (content.includes('export const secureStorage = {') &&
          content.includes('window.sessionStorage.getItem') &&
          content.includes('window.sessionStorage.setItem')) {
        console.log('✅ secureStorage.ts created successfully');
        console.log('   - Safe wrapper for sessionStorage operations');
        console.log('   - Uses window.sessionStorage to prevent recursion');
        results.secureStorageCreated = true;
      } else {
        console.log('❌ secureStorage.ts has issues');
      }
    } else {
      console.log('❌ secureStorage.ts file missing');
    }

    console.log('\n🔧 Step 2: Checking localStorage.ts recursion fix...');
    
    const localStoragePath = path.join(__dirname, '..', 'src', 'utils', 'security', 'localStorage.ts');
    
    if (fs.existsSync(localStoragePath)) {
      const content = fs.readFileSync(localStoragePath, 'utf8');
      
      // Check if recursion bug is fixed
      const hasRecursionBug = content.includes('sessionStorage.setItem(key, encryptedValue)') ||
                             content.includes('sessionStorage.setItem(key, value)') ||
                             content.includes('sessionStorage.getItem(key)') ||
                             content.includes('sessionStorage.removeItem(key)') ||
                             content.includes('sessionStorage.clear()');
      
      const isFixed = content.includes('window.sessionStorage.setItem') &&
                     content.includes('window.sessionStorage.getItem') &&
                     content.includes('window.sessionStorage.removeItem') &&
                     content.includes('window.sessionStorage.clear()');
      
      if (!hasRecursionBug && isFixed) {
        console.log('✅ localStorage.ts recursion bug is FIXED');
        console.log('   - All sessionStorage calls now use window.sessionStorage');
        console.log('   - No more infinite recursion');
        results.localStorageFixed = true;
      } else {
        console.log('❌ localStorage.ts still has recursion bug');
        if (hasRecursionBug) {
          console.log('   - Found recursive sessionStorage calls');
        }
        if (!isFixed) {
          console.log('   - Missing window.sessionStorage calls');
        }
      }
    } else {
      console.log('❌ localStorage.ts file missing');
    }

    console.log('\n📝 Step 3: Checking updated files...');
    
    const filesToCheck = [
      { path: 'src/pages/CheckoutPage.tsx', name: 'CheckoutPage' },
      { path: 'src/pages/Register.tsx', name: 'Register' },
      { path: 'src/pages/Pricing.tsx', name: 'Pricing' },
      { path: 'src/pages/PaymentSuccess.tsx', name: 'PaymentSuccess' },
      { path: 'src/hooks/useSubscription.ts', name: 'useSubscription' },
      { path: 'src/components/auth/RegisterForm.tsx', name: 'RegisterForm' }
    ];
    
    let updatedFiles = 0;
    let totalFiles = 0;
    
    for (const file of filesToCheck) {
      const filePath = path.join(__dirname, '..', file.path);
      if (fs.existsSync(filePath)) {
        totalFiles++;
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (content.includes('import { secureStorage }') && 
            content.includes('secureStorage.')) {
          console.log(`✅ ${file.name} - Updated to use secureStorage`);
          updatedFiles++;
        } else if (content.includes('sessionStorage.')) {
          console.log(`❌ ${file.name} - Still using sessionStorage directly`);
        } else {
          console.log(`⚠️  ${file.name} - No sessionStorage usage found`);
        }
      } else {
        console.log(`⚠️  ${file.name} - File not found`);
      }
    }
    
    if (updatedFiles === totalFiles && totalFiles > 0) {
      console.log('✅ All files have been updated to use secureStorage');
      results.filesUpdated = true;
    } else {
      console.log(`⚠️  ${updatedFiles}/${totalFiles} files updated`);
    }

    console.log('\n🎯 Step 4: Validation Summary...');
    console.log('==============================');
    
    const allPassed = Object.values(results).every(Boolean);
    
    if (results.secureStorageCreated) {
      console.log('✅ secureStorage wrapper: CREATED');
    } else {
      console.log('❌ secureStorage wrapper: MISSING');
    }
    
    if (results.localStorageFixed) {
      console.log('✅ localStorage recursion bug: FIXED');
    } else {
      console.log('❌ localStorage recursion bug: NOT FIXED');
    }
    
    if (results.filesUpdated) {
      console.log('✅ All files: UPDATED');
    } else {
      console.log('⚠️  Files: PARTIALLY UPDATED');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('==============');
    
    if (allPassed) {
      console.log('🎉 All localStorage fixes completed successfully!');
      console.log('');
      console.log('The recursion bug has been fixed and all files updated.');
      console.log('You can now safely run the application without infinite loops.');
      console.log('');
      console.log('To test the application:');
      console.log('  npm run dev');
      console.log('  # Then visit http://localhost:3000');
      console.log('');
      console.log('To create test users:');
      console.log('  # Set your service role key:');
      console.log('  $env:SUPABASE_SERVICE_ROLE_KEY="your-key-here"');
      console.log('  # Then run:');
      console.log('  .\\scripts\\create-test-users.ps1');
    } else {
      console.log('⚠️  Some fixes need attention. Please review the errors above.');
      console.log('');
      console.log('Critical issues to address:');
      if (!results.secureStorageCreated) {
        console.log('- Create secureStorage.ts wrapper');
      }
      if (!results.localStorageFixed) {
        console.log('- Fix recursion bug in localStorage.ts');
      }
      if (!results.filesUpdated) {
        console.log('- Update files to use secureStorage');
      }
    }

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation
validateFixes(); 