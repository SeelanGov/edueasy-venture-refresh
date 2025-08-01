#!/usr/bin/env node

/**
 * Critical void return type fix script
 * Fixes remaining critical components that need JSX.Element return types
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Starting critical void error fixes...');

const filesToFix = [
  'src/components/error-handling/ErrorBoundary.tsx',
  'src/components/error-handling/RecoveryHelper.tsx',
  'src/components/footer.tsx',
  'src/components/home/Footer.tsx',
  'src/components/layout/Responsive.tsx',
  'src/components/profile-completion/AddressInfoStep.tsx',
  'src/components/profile-completion/ContactInfoStep.tsx',
  'src/components/profile-completion/EducationHistoryStep.tsx',
  'src/components/profile-completion/PersonalInfoStep.tsx',
  'src/components/profile-completion/ProfileCompletionStepper.tsx',
  'src/components/profile-completion/address/AddressForm.tsx',
  'src/components/profile-completion/contact/ContactForm.tsx'
];

const fixFunctions = [
  // Fix component return types void -> JSX.Element
  {
    pattern: /(\w+\s*:\s*React\.FC[^=]*=\s*\([^)]*\))\s*:\s*void\s*=>/g,
    replacement: '$1: JSX.Element =>'
  },
  // Fix function component declarations
  {
    pattern: /(export\s+const\s+\w+\s*=\s*\([^)]*\))\s*:\s*void\s*=>/g,
    replacement: '$1: JSX.Element =>'
  },
  // Fix helper function return types
  {
    pattern: /(const\s+\w+\s*=\s*\([^)]*\))\s*:\s*void\s*=>/g,
    replacement: '$1: string =>'
  },
  // Fix method return types inside components
  {
    pattern: /(const\s+get\w+\s*=\s*\([^)]*\))\s*:\s*void\s*=>/g,
    replacement: '$1: string =>'
  },
  // Fix HOC return types
  {
    pattern: /(const\s+WrappedComponent\s*=\s*\([^)]*\))\s*:\s*void\s*=>/g,
    replacement: '$1: JSX.Element =>'
  }
];

let totalFixed = 0;

filesToFix.forEach(filePath => {
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  console.log(`📝 Processing: ${filePath}`);
  
  // Create backup
  const backupPath = `${filePath}.backup-${Date.now()}`;
  fs.copyFileSync(filePath, backupPath);
  console.log(`📋 Backup created: ${backupPath}`);

  let content = fs.readFileSync(filePath, 'utf8');
  let fileFixed = 0;

  fixFunctions.forEach((fix, index) => {
    const matches = content.match(fix.pattern);
    if (matches) {
      content = content.replace(fix.pattern, fix.replacement);
      fileFixed += matches.length;
      console.log(`  ✅ Applied fix ${index + 1}: ${matches.length} matches`);
    }
  });

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content);
    console.log(`  🎉 Fixed ${fileFixed} issues in ${filePath}`);
    totalFixed += fileFixed;
  } else {
    console.log(`  ℹ️  No fixes needed in ${filePath}`);
    // Remove unnecessary backup
    fs.unlinkSync(backupPath);
  }
});

console.log(`\n🎉 Total fixes applied: ${totalFixed}`);
console.log('✅ Critical void error fixes completed!');