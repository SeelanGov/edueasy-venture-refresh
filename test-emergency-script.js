const fs = require('fs');

console.log('🚨 TESTING EMERGENCY SCRIPT ON CRITICAL FILES');

// Test on a small batch of critical auth components
const testFiles = [
  'src/components/auth/register/FullNameField.tsx',
  'src/components/auth/register/EmailField.tsx',
  'src/components/auth/register/PasswordField.tsx',
  'src/components/auth/RegisterHeader.tsx',
  'src/components/ai/ThandiAgent.tsx'
];

let fixedCount = 0;
let totalFixes = 0;

const testEmergencyFix = (filePath) => {
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  let newContent = content;
  let fileFixCount = 0;
  
  // Count and fix void returns
  const voidMatches = newContent.match(/:\s*void\s*(?:=>\s*\{|\{)/g);
  if (voidMatches) {
    console.log(`📁 ${filePath}: Found ${voidMatches.length} void return types`);
  }
  
  // Fix React component returns
  newContent = newContent.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    (match, p1, p2) => {
      fileFixCount++;
      return p1 + ': JSX.Element' + p2;
    }
  );
  
  // Fix utility function returns
  newContent = newContent.replace(
    /^(\s*(?:const|function)\s+(?:get|format|calculate|is|has|check)[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    (match, p1, p2) => {
      fileFixCount++;
      return p1 + p2;
    }
  );
  
  if (newContent !== original) {
    console.log(`✅ ${filePath}: Applied ${fileFixCount} fixes`);
    fixedCount++;
    totalFixes += fileFixCount;
    return true;
  } else {
    console.log(`⚪ ${filePath}: No fixes needed`);
    return false;
  }
};

console.log('\n🔧 Testing emergency fixes on critical files...\n');

testFiles.forEach(file => {
  testEmergencyFix(file);
});

console.log(`\n📊 TEST RESULTS:`);
console.log(`✅ Files that need fixing: ${fixedCount}`);
console.log(`🔧 Total void return fixes needed: ${totalFixes}`);
console.log(`📁 Files tested: ${testFiles.length}`);

console.log('\n⚠️  NOTE: This was a TEST ONLY - no files were modified');
console.log('To apply fixes, run the full emergency-build-fix.js script');