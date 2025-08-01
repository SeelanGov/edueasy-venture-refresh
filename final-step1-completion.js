const fs = require('fs');
const glob = require('glob');

console.log('🚨 FINAL STEP 1 COMPLETION - FIXING REMAINING CRITICAL ISSUES');

// Fix specific patterns that need targeted fixes
const fixSpecificPatterns = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  console.log(`📝 Processing: ${filePath}`);
  
  // 1. Fix React component void returns to JSX.Element
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 2. Fix unknown types in ReactNode contexts
  content = content.replace(
    /\{([^}]*) as unknown\}/g,
    '{String($1 || "")}'
  );
  
  // 3. Fix remaining Type 'unknown' not assignable to ReactNode patterns
  content = content.replace(
    /\{([^}]*\.reason)\s*&&\s*typeof\s+[^}]*\.reason\s*===\s*'string'\s*&&\s*\(/g,
    '{String($1 || "") && ('
  );
  
  // 4. Fix void return utility functions that return strings
  content = content.replace(
    /(\s*(?:const|function)\s+\w+[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+['"`])/gm,
    '$1: string$2'
  );
  
  // 5. Fix layout component utility functions returning strings
  content = content.replace(
    /(\s*const\s+get\w+Classes\s*=\s*\([^)]*\))\s*:\s*void(\s*=>\s*\{)/gm,
    '$1: string$2'
  );
  
  // 6. Fix Footer components
  if (filePath.includes('Footer.tsx') || filePath.includes('footer.tsx')) {
    content = content.replace(
      /export\s+const\s+Footer\s*=\s*\(\s*\)\s*:\s*void/g,
      'export const Footer = (): JSX.Element'
    );
  }
  
  // 7. Fix Error handling components
  if (filePath.includes('error-handling')) {
    content = content.replace(
      /export\s+const\s+\w+\s*=\s*\([^)]*\)\s*:\s*void/g,
      (match) => match.replace(': void', ': JSX.Element')
    );
  }
  
  // 8. Add React import if JSX.Element is used but React not imported
  if (content.includes('JSX.Element') && !content.includes('import React')) {
    content = 'import React from \'react\';\n' + content;
  }
  
  if (content !== original) {
    // Create backup
    fs.writeFileSync(filePath + '.backup-final', original);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
};

// Priority files to fix
const priorityFiles = [
  'src/components/footer.tsx',
  'src/components/home/Footer.tsx',
  'src/components/error-handling/ErrorBoundary.tsx',
  'src/components/error-handling/RecoveryHelper.tsx',
  'src/components/admin/audit/AdminActivityLog.tsx',
  'src/components/admin/audit/AuditTrail.tsx'
];

console.log('🎯 Fixing priority files...');
let priorityFixed = 0;
priorityFiles.forEach(file => {
  if (fixSpecificPatterns(file)) priorityFixed++;
});

console.log(`✅ Priority files fixed: ${priorityFixed}`);

// Find and fix all remaining TypeScript files with issues
console.log('🎯 Processing all remaining TypeScript files...');
const allFiles = glob.sync('src/**/*.{ts,tsx}', { 
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

let totalFixed = priorityFixed;
allFiles.forEach(file => {
  if (!priorityFiles.includes(file)) {
    if (fixSpecificPatterns(file)) totalFixed++;
  }
});

console.log(`🎯 TOTAL FILES FIXED: ${totalFixed}`);
console.log('📁 Backup files created with .backup-final extension');
console.log('✅ FINAL STEP 1 COMPLETION FINISHED');