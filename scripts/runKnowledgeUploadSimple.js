const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Knowledge Base Upload with Verification...\n');

try {
  const scriptPath = path.join(__dirname, 'executeKnowledgeUpload.ts');
  console.log(`📂 Executing: ${scriptPath}\n`);
  
  execSync(`npx ts-node "${scriptPath}"`, { 
    stdio: 'inherit',
    env: process.env 
  });
  
  console.log('\n✅ Knowledge base upload completed!');
} catch (error) {
  console.error('\n❌ Upload failed:', error.message);
  process.exit(1);
}