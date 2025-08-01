const fs = require('fs');
const glob = require('glob');

console.log('🚨 FINAL COMPREHENSIVE TYPESCRIPT FIX');

// Find all TypeScript files
const allFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

console.log(`📋 Processing ${allFiles.length} TypeScript files`);

const fixFile = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // 1. Fix ALL export components with void return → JSX.Element
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\([^)]*\)\s*\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 2. Fix ALL const components with void return → JSX.Element  
  content = content.replace(
    /^(\s*const\s+[A-Z][a-zA-Z0-9]*\s*=\s*\([^)]*\)):\s*void(\s*=>\s*\{)/gm,
    '$1: JSX.Element$2'
  );
  
  // 3. Fix specific function patterns that return strings
  content = content.replace(
    /(\s*(?:const|function)\s+(?:format|get|calculate)[A-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+['""`])/gm,
    '$1: string$2'
  );
  
  // 4. Fix functions that return boolean
  content = content.replace(
    /(\s*(?:const|function)\s+[a-zA-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+(?:true|false))/gm,
    '$1: boolean$2'
  );
  
  // 5. Fix functions that return null → JSX.Element | null
  content = content.replace(
    /(\s*(?:const|function)\s+[a-zA-Z][a-zA-Z0-9]*[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+null)/gm,
    '$1: JSX.Element | null$2'
  );
  
  // 6. Fix specific pattern: Type 'Element' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+\(\s*<[\s\S]*?<\/[^>]+>\s*\);\s*[\r\n]+\s*}[^:]*?):\s*void/g,
    '$1: JSX.Element'
  );
  
  // 7. Fix Type 'null' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+null;\s*[\r\n]+\s*}[^:]*?):\s*void/g,
    '$1: JSX.Element | null'
  );
  
  // 8. Fix Type 'string' is not assignable to type 'void'
  content = content.replace(
    /(\s+return\s+['"`][^'"`]*['"`];\s*[\r\n]+\s*}[^:]*?):\s*void/g,
    '$1: string'
  );
  
  // 9. Fix unknown types in ReactNode contexts
  content = content.replace(
    /\{([^}]*log\.details\.reason)\}/g,
    '{String($1 || "")}'
  );
  
  // 10. Add React import if JSX.Element is used but React is not imported
  if (content.includes('JSX.Element') && !content.includes("import React") && !content.includes("import * as React") && !content.includes("React.")) {
    content = `import React from 'react';\n${content}`;
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

let totalFixed = 0;

// Process all files
allFiles.forEach(file => {
  if (fixFile(file)) {
    totalFixed++;
  }
});

console.log(`🎯 Total files fixed: ${totalFixed}`);
console.log('✅ Final comprehensive TypeScript fix complete');