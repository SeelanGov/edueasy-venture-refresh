const fs = require('fs');
const glob = require('glob');

console.log('🚨 COMPREHENSIVE TYPESCRIPT ERROR FIX');

// Find all TypeScript files
const allFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

console.log(`📋 Found ${allFiles.length} TypeScript files to fix`);

const fixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // 1. Fix all function components with void return → JSX.Element
  content = content.replace(
    /^(\s*(?:export\s+)?(?:const|function)\s+[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\([^)]*\)\s*\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 2. Fix internal const components with void return → JSX.Element | null  
  content = content.replace(
    /^(\s*const\s+[A-Z][a-zA-Z0-9]*\s*=\s*\([^)]*\)):\s*void(\s*=>\s*\{)/gm,
    '$1: JSX.Element$2'
  );
  
  // 3. Fix utility functions with void return that should return string
  content = content.replace(
    /(\s*(?:const|function)\s+(?:format|get|calculate)[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1: string$2'
  );
  
  // 4. Fix unknown types in ReactNode contexts
  content = content.replace(
    /String\(([^)]+)\)/g,
    'String($1 || "")'
  );
  
  // 5. Fix Type 'Element' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+\(\s*<[^>]+>[^}]*<\/[^>]+>\s*\);\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: JSX.Element'
  );
  
  // 6. Fix Type 'null' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+null;\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: JSX.Element | null'
  );
  
  // 7. Fix Type 'string' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+['"`][^'"`]*['"`];\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: string'
  );
  
  // 8. Fix Type 'boolean' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+(?:true|false);\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: boolean'
  );
  
  // 9. Fix unknown to ReactNode display issues
  content = content.replace(
    /\{([^}]*)\s*as\s*unknown\}/g,
    '{String($1 || "")}'
  );
  
  // 10. Fix hook-like functions - remove void entirely for these
  content = content.replace(
    /(\s*(?:const|function)\s+use[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1$2'
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

let totalFixed = 0;

// Process all files
allFiles.forEach(file => {
  if (fixFile(file)) {
    totalFixed++;
  }
});

console.log(`🎯 Total files fixed: ${totalFixed}`);
console.log('✅ Comprehensive TypeScript fix complete');