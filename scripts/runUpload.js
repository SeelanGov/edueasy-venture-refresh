// Simple Node.js script to execute the TypeScript upload
const { execSync } = require('child_process');
const path = require('path');

// Set environment variables for Supabase
process.env.SUPABASE_URL = 'https://pensvamtfjtpsaoefblx.supabase.co';
process.env.SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('🚀 Running Thandi Knowledge Base Upload...');
console.log('📊 Environment check:');
console.log('  - SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('  - SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '✅ Set' : '❌ Missing');

if (!process.env.SUPABASE_SERVICE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

try {
  // Execute the TypeScript file using ts-node
  const scriptPath = path.join(__dirname, 'uploadThandiKnowledgeBase.ts');
  console.log('\n📂 Executing:', scriptPath);
  
  execSync(`npx ts-node "${scriptPath}"`, { 
    stdio: 'inherit',
    env: process.env 
  });
  
  console.log('\n✅ Upload script completed successfully!');
} catch (error) {
  console.error('\n❌ Upload script failed:', error.message);
  process.exit(1);
}