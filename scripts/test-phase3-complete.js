
const { execSync } = require('child_process');
const https = require('https');

console.log('🚀 Phase 3 Complete System Test');
console.log('================================');

// Test configuration
const PROJECT_REF = 'pensvamtfjtpsaoeflbx';
const SUPABASE_URL = 'https://pensvamtfjtpsaoeflbx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBlbnN2YW10Zmp0cHNhb2VmbGJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzcyOTcsImV4cCI6MjA1OTQxMzI5N30.ZGFT9bcxwFuDVRF7ZYtLTQDPP3LKmt5Yo8BsJAFQyPM';

// Test results tracking
let testResults = {
  deployment: false,
  functionAccessible: false,
  listOrphaned: false,
  listFailed: false,
  configValid: false,
  frontendIntegration: false
};

async function deployFunction() {
  console.log('\n📤 Step 1: Deploying Payment Recovery Function...');
  
  try {
    // Check if function exists
    const fs = require('fs');
    const path = require('path');
    const functionPath = path.join(__dirname, '..', 'supabase', 'functions', 'payment-recovery');
    
    if (!fs.existsSync(functionPath)) {
      throw new Error('Payment recovery function not found');
    }
    
    console.log('✅ Function source found');
    
    // Deploy using npx supabase
    execSync(`npx supabase functions deploy payment-recovery --project-ref ${PROJECT_REF}`, {
      stdio: 'inherit'
    });
    
    testResults.deployment = true;
    console.log('✅ Function deployed successfully');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n🔧 Alternative: Use Supabase Dashboard');
    console.log('1. Go to: https://supabase.com/dashboard/project/pensvamtfjtpsaoeflbx/functions');
    console.log('2. Create new function: payment-recovery');
    console.log('3. Copy code from supabase/functions/payment-recovery/index.ts');
    return false;
  }
  
  return true;
}

async function testFunctionAccessibility() {
  console.log('\n🔍 Step 2: Testing Function Accessibility...');
  
  return new Promise((resolve) => {
    const postData = JSON.stringify({ action: 'list_orphaned' });
    
    const options = {
      hostname: 'pensvamtfjtpsaoeflbx.supabase.co',
      port: 443,
      path: '/functions/v1/payment-recovery',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          testResults.functionAccessible = true;
          console.log('✅ Function is accessible');
          resolve(true);
        } else {
          console.log(`⚠️ Function returned status: ${res.statusCode}`);
          console.log('Response:', data);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.error('❌ Function accessibility test failed:', error.message);
      resolve(false);
    });

    req.write(postData);
    req.end();

    // Timeout after 10 seconds
    setTimeout(() => {
      console.log('⏰ Function test timed out');
      resolve(false);
    }, 10000);
  });
}

async function testFunctionOperations() {
  console.log('\n🧪 Step 3: Testing Function Operations...');
  
  const operations = [
    { action: 'list_orphaned', name: 'List Orphaned Payments' },
    { action: 'list_failed', name: 'List Failed Payments' }
  ];
  
  for (const op of operations) {
    console.log(`\n  Testing: ${op.name}...`);
    
    const success = await new Promise((resolve) => {
      const postData = JSON.stringify({ action: op.action });
      
      const options = {
        hostname: 'pensvamtfjtpsaoeflbx.supabase.co',
        port: 443,
        path: '/functions/v1/payment-recovery',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.success !== undefined) {
              console.log(`    ✅ ${op.name}: Working`);
              resolve(true);
            } else {
              console.log(`    ⚠️ ${op.name}: Unexpected response format`);
              resolve(false);
            }
          } catch (e) {
            console.log(`    ❌ ${op.name}: Invalid JSON response`);
            resolve(false);
          }
        });
      });

      req.on('error', () => resolve(false));
      req.write(postData);
      req.end();

      setTimeout(() => resolve(false), 5000);
    });
    
    if (op.action === 'list_orphaned') testResults.listOrphaned = success;
    if (op.action === 'list_failed') testResults.listFailed = success;
  }
}

async function validateConfiguration() {
  console.log('\n⚙️ Step 4: Validating Configuration...');
  
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check config.toml
    const configPath = path.join(__dirname, '..', 'supabase', 'config.toml');
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    if (configContent.includes('[functions.payment-recovery]')) {
      console.log('✅ payment-recovery function configured in config.toml');
      testResults.configValid = true;
    } else {
      console.log('❌ payment-recovery function not found in config.toml');
    }
    
    // Check frontend components exist
    const componentsToCheck = [
      'src/components/admin/dashboard/PaymentRecoveryPanel.tsx',
      'src/components/user/PaymentRecoveryNotice.tsx',
      'src/hooks/usePaymentRecovery.ts',
      'src/pages/admin/AdminPaymentRecovery.tsx'
    ];
    
    let allComponentsExist = true;
    for (const component of componentsToCheck) {
      const componentPath = path.join(__dirname, '..', component);
      if (fs.existsSync(componentPath)) {
        console.log(`✅ ${component.split('/').pop()}: Found`);
      } else {
        console.log(`❌ ${component.split('/').pop()}: Missing`);
        allComponentsExist = false;
      }
    }
    
    testResults.frontendIntegration = allComponentsExist;
    
  } catch (error) {
    console.error('❌ Configuration validation failed:', error.message);
  }
}

function generateTestReport() {
  console.log('\n📊 Phase 3 Test Results');
  console.log('========================');
  
  const tests = [
    { name: 'Function Deployment', result: testResults.deployment },
    { name: 'Function Accessibility', result: testResults.functionAccessible },
    { name: 'List Orphaned Payments', result: testResults.listOrphaned },
    { name: 'List Failed Payments', result: testResults.listFailed },
    { name: 'Configuration Valid', result: testResults.configValid },
    { name: 'Frontend Integration', result: testResults.frontendIntegration }
  ];
  
  let passedTests = 0;
  tests.forEach(test => {
    console.log(`${test.result ? '✅' : '❌'} ${test.name}`);
    if (test.result) passedTests++;
  });
  
  const successRate = Math.round((passedTests / tests.length) * 100);
  console.log(`\n📈 Success Rate: ${successRate}% (${passedTests}/${tests.length})`);
  
  if (successRate >= 80) {
    console.log('🎉 Phase 3 System: OPERATIONAL');
    console.log('\n🔗 Access Points:');
    console.log(`   • Admin Panel: /admin/payment-recovery`);
    console.log(`   • Function URL: ${SUPABASE_URL}/functions/v1/payment-recovery`);
    console.log(`   • Dashboard: /admin`);
  } else {
    console.log('⚠️ Phase 3 System: NEEDS ATTENTION');
    console.log('\n🔧 Next Steps:');
    if (!testResults.deployment) console.log('   • Deploy function manually via dashboard');
    if (!testResults.functionAccessible) console.log('   • Check function authentication settings');
    if (!testResults.configValid) console.log('   • Update supabase/config.toml');
  }
}

// Run complete test
async function runCompleteTest() {
  console.log('Starting Phase 3 Complete System Test...\n');
  
  // Step 1: Deploy
  await deployFunction();
  
  // Wait for deployment to propagate
  console.log('\n⏳ Waiting for deployment to propagate...');
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Step 2-4: Test
  await testFunctionAccessibility();
  await testFunctionOperations();
  await validateConfiguration();
  
  // Generate report
  generateTestReport();
}

// Execute
runCompleteTest().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
