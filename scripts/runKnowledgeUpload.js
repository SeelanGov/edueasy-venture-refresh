const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Running Thandi Knowledge Base Upload with Verification...\n');

try {
  // Execute the TypeScript upload script
  const scriptPath = path.join(__dirname, 'uploadKnowledgeBaseWithVerification.ts');
  console.log(`📂 Executing: ${scriptPath}\n`);

  execSync(`npx ts-node "${scriptPath}"`, {
    stdio: 'inherit',
    env: process.env,
  });

  console.log('\n✅ Knowledge base upload and verification completed successfully!');
} catch (error) {
  console.error('\n❌ Upload process failed:', error.message);
  process.exit(1);
}
