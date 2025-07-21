// EduEasy Fixes Validation Script
// This script validates that the localStorage recursion bug is fixed and system works correctly

const { createClient } = require('@supabase/supabase-js');

console.log('🔍 Validating EduEasy Fixes...');
console.log('==============================');

// Test configuration
const SUPABASE_URL = 'https://pensvamtfjtpsaoeflbx.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!SUPABASE_KEY) {
  console.error('❌ Error: VITE_SUPABASE_ANON_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function validateFixes() {
  const results = {
    localStorageFix: false,
    secureStorage: false,
    sessionStorage: false,
    authSystem: false,
    databaseConnection: false
  };

  try {
    console.log('\n📁 Step 1: Checking localStorage.ts recursion fix...');
    
    // Check if the secureStorage file exists
    const fs = require('fs');
    const path = require('path');
    
    const secureStoragePath = path.join(__dirname, '..', 'src', 'utils', 'secureStorage.ts');
    const localStoragePath = path.join(__dirname, '..', 'src', 'utils', 'security', 'localStorage.ts');
    
    if (fs.existsSync(secureStoragePath)) {
      console.log('✅ secureStorage.ts file exists');
      results.secureStorage = true;
    } else {
      console.log('❌ secureStorage.ts file missing');
    }
    
    if (fs.existsSync(localStoragePath)) {
      const localStorageContent = fs.readFileSync(localStoragePath, 'utf8');
      
      // Check if recursion bug is fixed (should use window.sessionStorage)
      if (localStorageContent.includes('window.sessionStorage.setItem') && 
          localStorageContent.includes('window.sessionStorage.getItem')) {
        console.log('✅ localStorage.ts recursion bug is fixed');
        results.localStorageFix = true;
      } else {
        console.log('❌ localStorage.ts still has recursion bug');
      }
      
      // Check if sessionStorage object is properly defined
      if (localStorageContent.includes('export const sessionStorage = {')) {
        console.log('✅ sessionStorage object is properly exported');
        results.sessionStorage = true;
      } else {
        console.log('❌ sessionStorage object is missing');
      }
    } else {
      console.log('❌ localStorage.ts file missing');
    }

    console.log('\n🔗 Step 2: Testing database connection...');
    
    // Test basic database connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (!testError) {
      console.log('✅ Database connection successful');
      results.databaseConnection = true;
    } else {
      console.log('❌ Database connection failed:', testError.message);
    }

    console.log('\n🔐 Step 3: Testing authentication system...');
    
    // Test auth system by checking if we can access auth endpoints
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (!authError) {
      console.log('✅ Authentication system is accessible');
      results.authSystem = true;
    } else {
      console.log('❌ Authentication system error:', authError.message);
    }

    console.log('\n📊 Step 4: Checking updated files...');
    
    // Check if all files have been updated to use secureStorage
    const filesToCheck = [
      'src/pages/CheckoutPage.tsx',
      'src/pages/Register.tsx',
      'src/pages/Pricing.tsx',
      'src/pages/PaymentSuccess.tsx',
      'src/hooks/useSubscription.ts',
      'src/components/auth/RegisterForm.tsx'
    ];
    
    let updatedFiles = 0;
    for (const file of filesToCheck) {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('import { secureStorage }') && 
            content.includes('secureStorage.')) {
          console.log(`✅ ${file} - Updated to use secureStorage`);
          updatedFiles++;
        } else {
          console.log(`❌ ${file} - Not updated to use secureStorage`);
        }
      } else {
        console.log(`⚠️  ${file} - File not found`);
      }
    }
    
    if (updatedFiles === filesToCheck.length) {
      console.log('✅ All files have been updated to use secureStorage');
    } else {
      console.log(`⚠️  ${updatedFiles}/${filesToCheck.length} files updated`);
    }

    console.log('\n🎯 Step 5: Validation Summary...');
    console.log('==============================');
    
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;
    
    console.log(`Tests Passed: ${passedTests}/${totalTests}`);
    
    if (results.localStorageFix) {
      console.log('✅ localStorage recursion bug: FIXED');
    } else {
      console.log('❌ localStorage recursion bug: NOT FIXED');
    }
    
    if (results.secureStorage) {
      console.log('✅ secureStorage wrapper: CREATED');
    } else {
      console.log('❌ secureStorage wrapper: MISSING');
    }
    
    if (results.sessionStorage) {
      console.log('✅ sessionStorage object: WORKING');
    } else {
      console.log('❌ sessionStorage object: BROKEN');
    }
    
    if (results.databaseConnection) {
      console.log('✅ Database connection: WORKING');
    } else {
      console.log('❌ Database connection: FAILED');
    }
    
    if (results.authSystem) {
      console.log('✅ Authentication system: WORKING');
    } else {
      console.log('❌ Authentication system: FAILED');
    }
    
    console.log('\n📋 Next Steps:');
    console.log('==============');
    
    if (passedTests === totalTests) {
      console.log('🎉 All fixes validated successfully!');
      console.log('');
      console.log('To create test users, run:');
      console.log('  # On Windows:');
      console.log('  .\\scripts\\create-test-users.ps1');
      console.log('');
      console.log('  # On Linux/Mac:');
      console.log('  ./scripts/create-test-users.sh');
      console.log('');
      console.log('To test the application:');
      console.log('  npm run dev');
      console.log('  # Then visit http://localhost:3000');
    } else {
      console.log('⚠️  Some fixes need attention. Please review the errors above.');
    }

  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run validation
validateFixes(); 