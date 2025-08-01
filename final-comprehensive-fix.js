const fs = require('fs');
const glob = require('glob');

console.log('🚨 COMPREHENSIVE TYPESCRIPT ERROR FIX');

// Find all TypeScript files
const allFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

console.log(`📋 Found ${allFiles.length} TypeScript files to check`);

const fixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // 1. Fix export const/function with void return → JSX.Element
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\([^)]*\)\s*\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 2. Fix const components with void return → JSX.Element | null  
  content = content.replace(
    /^(\s*const\s+[A-Z][a-zA-Z0-9]*\s*=\s*\([^)]*\)):\s*void(\s*=>\s*\{)/gm,
    '$1: JSX.Element | null$2'
  );
  
  // 3. Fix internal functions that can return null/JSX
  content = content.replace(
    /(\s+const\s+[a-zA-Z][a-zA-Z0-9]*\s*=\s*\([^)]*\)):\s*void(\s*=>\s*\{)/gm,
    '$1$2'
  );
  
  // 4. Fix PaymentForm void return types
  if (filePath.includes('PaymentForm')) {
    content = content.replace(
      /(\s*export\s+(?:const|function)\s+PaymentForm[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
      '$1: JSX.Element$2'
    );
  }
  
  // 5. Fix ColorCard void return types
  if (filePath.includes('ColorSystem')) {
    content = content.replace(
      /(\s*const\s+ColorCard[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
      '$1: JSX.Element$2'
    );
  }
  
  // 6. Fix ConsultationBookingForm void return
  if (filePath.includes('ConsultationBookingForm')) {
    content = content.replace(
      /(\s*export\s+(?:const|function)\s+ConsultationBookingForm[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
      '$1: JSX.Element$2'
    );
  }
  
  // 7. Fix any remaining component void returns
  content = content.replace(
    /(\s*export\s+(?:const|function)\s+[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 8. Fix any demo component void returns
  if (filePath.includes('Demo')) {
    content = content.replace(
      /(\s*export\s+(?:const|function)\s+[A-Z][a-zA-Z0-9]*Demo[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
      '$1: JSX.Element$2'
    );
  }
  
  // 9. Fix unknown to ReactNode in display contexts
  content = content.replace(
    /(\w+\.map\(\([^)]+\)\s*=>\s*)([a-zA-Z_.]+)(\s*\))/g,
    '$1String($2)$3'
  );
  
  // 10. Add React import if JSX.Element is used but React is not imported
  if (content.includes('JSX.Element') && !content.includes("import React") && !content.includes("import * as React")) {
    content = `import React from 'react';\n${content}`;
  }
  
  if (content !== original) {
    // Create backup
    fs.writeFileSync(filePath + '.backup', original);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
};

let totalFixed = 0;

// Process all files
allFiles.forEach(file => {
  if (fixFile(file)) {
    totalFixed++;
  }
});

console.log(`🎯 Total files fixed: ${totalFixed}`);
console.log('✅ Comprehensive TypeScript fix complete');

// Also specifically fix known problem files
const problemFiles = [
  'src/components/admin/audit/AdminActivityLog.tsx',
  'src/components/admin/audit/AuditTrail.tsx',
  'src/components/consultations/ConsultationBookingForm.tsx',
  'src/components/demo/JourneyMapDemo.tsx',
  'src/components/docs/ColorSystem.tsx'
];

console.log('\n🔧 Applying specific fixes to known problem files...');

problemFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;
    
    // Fix unknown to String() conversion for ReactNode compatibility
    content = content.replace(
      /(\{[^}]*\.map\([^)]+\)\s*=>\s*)([a-zA-Z_.]+)(\)?\s*\})/g,
      '$1String($2 || "")$3'
    );
    
    // Fix any remaining void returns in this file
    content = content.replace(
      /(\s*(?:export\s+)?(?:const|function)\s+[a-zA-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
      '$1: JSX.Element$2'
    );
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`✅ Applied specific fix to: ${file}`);
    }
  }
});

console.log('\n🎉 All fixes applied!');