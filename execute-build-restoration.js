const fs = require('fs');
const path = require('path');

console.log('🚨 EXECUTING EMERGENCY BUILD RESTORATION');

// Emergency fix for systematic void return issues
const fixVoidReturns = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix React component returns
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // Fix hook returns  
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+use[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1$2'
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
};

// Critical files to fix immediately
const criticalFiles = [
  'src/hooks/admin/useSponsorAllocations.ts',
  'src/hooks/admin/useUserVerificationLogs.ts', 
  'src/components/auth/RegisterForm.tsx',
  'src/components/ai/ThandiAgent.tsx',
  'src/components/admin/partners/TiersManager.tsx',
  'src/components/application/ApplicationFormFields.tsx'
];

let fixedCount = 0;
criticalFiles.forEach(file => {
  if (fixVoidReturns(file)) fixedCount++;
});

console.log(`🎯 Emergency fixes applied: ${fixedCount} files`);
console.log('⚠️  180+ errors remain - full script execution needed');