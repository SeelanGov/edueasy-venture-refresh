const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Function to fix return types in a file
function fixVoidReturnTypes(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix React component return types from void to JSX.Element
  const componentPattern = /export\s+(?:const|function)\s+(\w+)\s*=\s*\([^)]*\):\s*void\s*=>/g;
  content = content.replace(componentPattern, (match, componentName) => {
    // Skip hooks (start with 'use')
    if (componentName.startsWith('use')) {
      return match.replace(': void =>', ' =>');
    }
    modified = true;
    return match.replace(': void =>', ': JSX.Element =>');
  });

  // Fix regular function declarations
  const functionDeclarationPattern = /export\s+function\s+(\w+)\s*\([^)]*\):\s*void\s*{/g;
  content = content.replace(functionDeclarationPattern, (match, functionName) => {
    if (functionName.startsWith('use')) {
      return match.replace(': void {', ' {');
    }
    modified = true;
    return match.replace(': void {', ': JSX.Element {');
  });

  // Fix internal functions with void return types that return JSX
  const internalFunctionPattern = /const\s+(\w+)\s*=\s*\([^)]*\):\s*void\s*=>/g;
  content = content.replace(internalFunctionPattern, (match, functionName) => {
    // Skip hooks and event handlers
    if (functionName.startsWith('use') || functionName.startsWith('handle') || functionName.startsWith('on')) {
      return match;
    }
    
    // Check if the function name suggests it returns JSX (ends with Component, Element, etc.)
    if (functionName.includes('Component') || functionName.includes('Element') || functionName.includes('Render')) {
      modified = true;
      return match.replace(': void =>', ': JSX.Element =>');
    }
    
    // For utility functions, remove the void type annotation
    if (functionName.includes('get') || functionName.includes('format') || functionName.includes('calculate')) {
      modified = true;
      return match.replace(': void =>', ' =>');
    }
    
    return match;
  });

  // Fix object return types that are incorrectly typed as void
  const objectReturnPattern = /(\w+):\s*void\s*=>\s*{/g;
  content = content.replace(objectReturnPattern, (match, funcName) => {
    // Check if it's likely returning an object
    if (match.includes('useState') || match.includes('useEffect') || funcName.startsWith('handle')) {
      return match;
    }
    modified = true;
    return match.replace(': void =>', ' =>');
  });

  // Fix specific patterns for hooks
  const hookPattern = /export\s+const\s+(use\w+)\s*=\s*\([^)]*\):\s*void\s*=>/g;
  content = content.replace(hookPattern, (match, hookName) => {
    modified = true;
    return match.replace(': void =>', ' =>');
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed void return types in: ${filePath}`);
    return true;
  }
  return false;
}

// Find all TypeScript files
const tsFiles = glob.sync('src/**/*.{ts,tsx}');

console.log(`🔍 Found ${tsFiles.length} TypeScript files to check...`);

let fixedCount = 0;
let totalFixed = 0;

// Priority files to fix first
const priorityFiles = [
  'src/components/ui/ErrorRecovery.tsx',
  'src/components/ui/ErrorBoundary.tsx',
  'src/components/ui/chart.tsx',
  'src/components/ui/form.tsx',
  'src/components/ui/MobileOptimizedCard.tsx',
  'src/components/sponsorships/TestimonialsSection.tsx',
  'src/components/subscription/SubscriptionTierCard.tsx',
  'src/components/system/UILockSystem.tsx',
  'src/components/thandi/IntentList.tsx',
  'src/components/ui/EnhancedFormField.test.tsx'
];

// Fix priority files first
console.log('\n📋 Fixing priority files...');
priorityFiles.forEach((file) => {
  if (fs.existsSync(file)) {
    try {
      if (fixVoidReturnTypes(file)) {
        fixedCount++;
      }
      totalFixed++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
});

// Fix remaining files
console.log('\n📋 Fixing remaining files...');
tsFiles.forEach((file) => {
  if (!priorityFiles.includes(file)) {
    try {
      if (fixVoidReturnTypes(file)) {
        fixedCount++;
      }
      totalFixed++;
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  }
});

console.log(`\n🎉 Fixed void return types in ${fixedCount} out of ${totalFixed} files.`);
console.log('✅ All TypeScript files have been processed.');