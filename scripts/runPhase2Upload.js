const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 Executing Phase 2: Enhanced Knowledge Base Upload...\n');

try {
  // Execute the knowledge upload script
  const scriptPath = path.join(__dirname, 'executeKnowledgeUpload.js');
  console.log(`📂 Running: ${scriptPath}\n`);

  execSync(`node "${scriptPath}"`, {
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  });

  console.log('\n✅ Phase 2 completed successfully! Knowledge base uploaded with verification.');
} catch (error) {
  console.error('\n❌ Phase 2 failed:', error.message);
  console.error('Error details:', error.toString());
  process.exit(1);
}
