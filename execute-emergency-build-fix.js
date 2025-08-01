const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚨 EXECUTING EMERGENCY BUILD FIX');
console.log('📊 Target: Fix critical TypeScript errors systematically');

// Create backup and emergency fix function
const emergencyFixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // 1. Fix React component return types (void → JSX.Element)
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 2. Fix hook return types (remove void entirely)
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+use[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1$2'
  );
  
  // 3. Fix utility function return types
  content = content.replace(
    /^(\s*(?:const|function)\s+(?:get|format|calculate|is|has|check)[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1$2'
  );
  
  // 4. Fix functions that return strings
  content = content.replace(
    /(\s*(?:const|function)\s+\w+[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+['"`])/gm,
    '$1: string$2'
  );
  
  // 5. Fix functions that return JSX
  content = content.replace(
    /(\s*(?:const|function)\s+\w+[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+<)/gm,
    '$1: JSX.Element$2'
  );
  
  // 6. Fix type 'null' is not assignable to 'void'
  content = content.replace(
    /(\s+return\s+null;\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: JSX.Element | null'
  );
  
  // 7. Fix Element is not assignable to void
  content = content.replace(
    /(\s+return\s+\(\s*<[^>]+>[^<]*<\/[^>]+>\s*\);\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: JSX.Element'
  );
  
  if (content !== original) {
    // Create backup
    fs.writeFileSync(filePath + '.backup', original);
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
    return true;
  }
  return false;
};

// Find and fix all TypeScript files
const sourceFiles = glob.sync('src/**/*.{ts,tsx}', { 
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

console.log(`📋 Found ${sourceFiles.length} files to process`);

let fixedCount = 0;
sourceFiles.forEach(file => {
  if (emergencyFixFile(file)) {
    fixedCount++;
  }
});

console.log(`🎯 Emergency fixes applied: ${fixedCount} files`);
console.log('✅ Emergency build fix complete');