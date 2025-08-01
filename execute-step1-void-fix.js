const { execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');

console.log('🚨 STEP 1: COMPREHENSIVE VOID FIX EXECUTION');
console.log('📊 Target: Fix 86+ void return type errors across home, error handling, and document components');

// Comprehensive void fix function
const fixVoidReturnTypes = (filePath) => {
  if (!fs.existsSync(filePath)) return false;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  console.log(`📝 Processing: ${filePath}`);
  
  // 1. Fix React component void returns to JSX.Element
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1: JSX.Element$2'
  );
  
  // 2. Fix hook void returns (remove void entirely)
  content = content.replace(
    /^(\s*export\s+(?:const|function)\s+use[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1$2'
  );
  
  // 3. Fix utility function void returns
  content = content.replace(
    /^(\s*(?:const|function)\s+(?:get|format|calculate|is|has|check)[A-Z]\w*[^=]*?):\s*void(\s*(?:=>\s*\{|\{))/gm,
    '$1$2'
  );
  
  // 4. Fix functions that return strings
  content = content.replace(
    /(\s*(?:const|function)\s+\w+[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+['"`])/gm,
    '$1: string$2'
  );
  
  // 5. Fix unknown types in ReactNode contexts
  content = content.replace(
    /\{([^}]*) as unknown\}/g,
    '{String($1 || "")}'
  );
  
  // 6. Fix remaining Type 'unknown' not assignable to ReactNode
  content = content.replace(
    /\{([^}]*\.reason)\}/g,
    '{String($1 || "")}'
  );
  
  // 7. Add React import if JSX.Element is used but React not imported
  if (content.includes('JSX.Element') && !content.includes('import React')) {
    content = 'import React from \'react\';\n' + content;
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

// Priority files (home, error handling, document components)
const priorityFiles = [
  // Home components
  'src/components/home/AboutContent.tsx',
  'src/components/home/AISupportSection.tsx',
  'src/components/home/Hero.tsx',
  'src/components/home/HeroContent.tsx',
  'src/components/home/HeroImage.tsx',
  'src/components/home/CTASection.tsx',
  'src/components/home/CommunitySection.tsx',
  'src/components/home/AboutSection.tsx',
  'src/components/home/PartnersSection.tsx',
  'src/components/home/TestimonialsSection.tsx',
  'src/components/home/HowItWorks.tsx',
  
  // Error handling components
  'src/components/error-handling/ErrorDisplay.tsx',
  'src/components/error-handling/OfflineErrorDisplay.tsx',
  'src/components/error-handling/ErrorBoundary.tsx',
  'src/components/error-handling/RecoveryHelper.tsx',
  
  // Document components
  'src/components/documents/DocumentPreview.tsx',
  'src/components/documents/DocumentUploadStepper.tsx',
  
  // Other critical components
  'src/components/footer.tsx',
  'src/components/home/Footer.tsx'
];

console.log('🎯 BATCH 1: Processing priority files...');
let batch1Fixed = 0;
priorityFiles.forEach(file => {
  if (fixVoidReturnTypes(file)) batch1Fixed++;
});

console.log(`✅ Batch 1 Complete: ${batch1Fixed} files fixed`);

// Find and fix all other TypeScript files with void issues
console.log('🎯 BATCH 2: Processing remaining TypeScript files...');
const allFiles = glob.sync('src/**/*.{ts,tsx}', { 
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

let batch2Fixed = 0;
allFiles.forEach(file => {
  if (!priorityFiles.includes(file)) {
    if (fixVoidReturnTypes(file)) batch2Fixed++;
  }
});

console.log(`✅ Batch 2 Complete: ${batch2Fixed} files fixed`);

const totalFixed = batch1Fixed + batch2Fixed;
console.log(`🎯 TOTAL FILES FIXED: ${totalFixed}`);

// Run build check
console.log('\n📊 RUNNING BUILD CHECK...');
try {
  const buildResult = execSync('npm run build', { 
    stdio: 'pipe', 
    encoding: 'utf8' 
  });
  console.log('✅ BUILD SUCCESSFUL!');
} catch (buildError) {
  const errorOutput = buildError.stdout || buildError.stderr || '';
  const errorLines = errorOutput.split('\n').filter(line => line.includes('error TS'));
  console.log(`📊 Remaining errors: ${errorLines.length}`);
  
  if (errorLines.length <= 20) {
    console.log('🎯 Remaining errors:');
    errorLines.slice(0, 20).forEach(error => console.log(`  - ${error}`));
  }
}

console.log('\n📋 STEP 1 VOID FIX COMPLETE');
console.log('📁 Backup files created for all modified files (.backup extension)');
console.log('🔄 Rollback: Restore .backup files if needed');
