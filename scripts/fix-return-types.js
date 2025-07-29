const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix return types in a file
function fixReturnTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix component return types from void to JSX.Element
  const componentPattern = /export\s+(?:const|function)\s+(\w+)\s*=\s*\([^)]*\):\s*void\s*=>\s*{/g;
  content = content.replace(componentPattern, (match, componentName) => {
    // Skip if it's a hook (starts with 'use')
    if (componentName.startsWith('use')) {
      return match;
    }
    modified = true;
    return match.replace(': void =>', ': JSX.Element =>');
  });

  // Fix function return types from void to proper types
  const functionPattern = /const\s+(\w+)\s*=\s*\([^)]*\):\s*void\s*=>\s*{/g;
  content = content.replace(functionPattern, (match, functionName) => {
    // Skip if it's a hook or event handler
    if (functionName.startsWith('use') || functionName.startsWith('handle')) {
      return match;
    }
    modified = true;
    return match.replace(': void =>', ' =>');
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed return types in: ${filePath}`);
  }
}

// Find all TSX files
const tsxFiles = glob.sync('src/**/*.tsx');

console.log(`Found ${tsxFiles.length} TSX files to check...`);

let fixedCount = 0;
tsxFiles.forEach((file) => {
  try {
    fixReturnTypes(file);
    fixedCount++;
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log(`\nFixed return types in ${fixedCount} files.`);
