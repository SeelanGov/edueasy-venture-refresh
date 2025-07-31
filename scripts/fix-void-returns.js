const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix void return types in TypeScript files
function fixVoidReturnTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix React component return types from void to JSX.Element
  const componentReturnPattern = /^(export\s+(?:const|function)\s+[A-Z]\w*.*?):\s*void\s*(=>?\s*\{|\{)/gm;
  content = content.replace(componentReturnPattern, (match, prefix, suffix) => {
    modified = true;
    return prefix + ': JSX.Element' + suffix;
  });

  // Fix hook return types from void to proper return type (remove : void)
  const hookReturnPattern = /^(export\s+(?:const|function)\s+use[A-Z]\w*.*?):\s*void\s*(=>?\s*\{|\{)/gm;
  content = content.replace(hookReturnPattern, (match, prefix, suffix) => {
    modified = true;
    return prefix + suffix;
  });

  // Fix function return types that return strings
  const stringReturnPattern = /^(\s*(?:const|function)\s+\w+.*?):\s*void\s*(=>?\s*\{[\s\S]*?return\s+.*?['"]\w+['"]/gm;
  content = content.replace(stringReturnPattern, (match, prefix) => {
    if (match.includes('return \'') || match.includes('return "')) {
      modified = true;
      return prefix + ': string' + match.substring(prefix.length + 6); // Remove ": void"
    }
    return match;
  });

  // Fix functions that return JSX elements
  const jsxReturnPattern = /^(\s*(?:const|function)\s+\w+.*?):\s*void\s*(=>?\s*\{[\s\S]*?return\s+<)/gm;
  content = content.replace(jsxReturnPattern, (match, prefix) => {
    modified = true;
    return prefix + ': JSX.Element' + match.substring(prefix.length + 6); // Remove ": void"
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed void return types in: ${filePath}`);
    return true;
  }
  return false;
}

// Find all TypeScript files
const tsFiles = glob.sync('src/**/*.{ts,tsx}');

console.log(`Found ${tsFiles.length} TypeScript files to check...`);

let fixedCount = 0;
tsFiles.forEach((file) => {
  try {
    if (fixVoidReturnTypes(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nFixed void return types in ${fixedCount} files.`);