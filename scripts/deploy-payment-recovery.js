
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying Payment Recovery Edge Function...');

const PROJECT_REF = 'pensvamtfjtpsaoeflbx';
const FUNCTION_NAME = 'payment-recovery';

// Check if function exists
const functionPath = path.join(__dirname, '..', 'supabase', 'functions', FUNCTION_NAME);
if (!fs.existsSync(functionPath)) {
  console.error(`❌ Function ${FUNCTION_NAME} not found at: ${functionPath}`);
  process.exit(1);
}

console.log(`✅ Function found at: ${functionPath}`);

// Check if Supabase CLI is available
try {
  const version = execSync('npx supabase --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Supabase CLI available: ${version}`);
} catch (error) {
  console.log('📦 Installing Supabase CLI...');
  try {
    execSync('npm install -g supabase', { stdio: 'inherit' });
  } catch (installError) {
    console.log('⚠️ Global install failed, will use npx');
  }
}

// Deploy function
try {
  console.log(`📤 Deploying ${FUNCTION_NAME}...`);
  
  // Try with npx first
  execSync(`npx supabase functions deploy ${FUNCTION_NAME} --project-ref ${PROJECT_REF}`, {
    stdio: 'inherit'
  });
  
  console.log(`✅ ${FUNCTION_NAME} deployed successfully!`);
  console.log(`🌐 Function URL: https://${PROJECT_REF}.supabase.co/functions/v1/${FUNCTION_NAME}`);
  
} catch (error) {
  console.error(`❌ Deployment failed: ${error.message}`);
  console.log('\n🔧 Alternative deployment methods:');
  console.log('1. Use Supabase Dashboard (manual upload)');
  console.log('2. Go to: https://supabase.com/dashboard/project/pensvamtfjtpsaoeflbx/functions');
  console.log('3. Click "Create a new function"');
  console.log('4. Name: payment-recovery');
  console.log('5. Copy code from supabase/functions/payment-recovery/index.ts');
  console.log('6. Paste and deploy');
  console.log('7. Check authentication: npx supabase login');
  console.log('8. Set access token: export SUPABASE_ACCESS_TOKEN=your_token');
  
  process.exit(1);
}
