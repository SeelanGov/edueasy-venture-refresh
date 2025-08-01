const { execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');

console.log('🚨 EXECUTING FINAL COMPREHENSIVE FIX');

// First run the comprehensive script
try {
  console.log('Running comprehensive TypeScript fix...');
  execSync('node fix-all-typescript-errors.js', { stdio: 'inherit' });
  console.log('✅ Comprehensive script completed');
} catch (error) {
  console.log('⚠️ Script had issues, continuing with manual fixes...');
}

// Manual fixes for specific patterns
const manualFixes = [
  'src/components/admin/audit/AdminActivityLog.tsx',
  'src/components/admin/audit/AuditTrail.tsx',
  'src/components/docs/TypographyGuide.tsx',
  'src/components/documents/**/*.tsx',
  'src/components/error-handling/**/*.tsx'
];

console.log('Applying manual fixes to critical files...');

// Find all matching files
const allFiles = [];
manualFixes.forEach(pattern => {
  const files = glob.sync(pattern);
  allFiles.push(...files);
});

const uniqueFiles = [...new Set(allFiles)];

uniqueFiles.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  const original = content;
  
  // Fix void return types to JSX.Element
  content = content.replace(
    /(\): void( =>\s*\{|\ \{))/g,
    '): JSX.Element$2'
  );
  
  // Fix unknown types in ReactNode contexts
  content = content.replace(
    /\{([^}]*) as unknown\}/g,
    '{String($1 || "")}'
  );
  
  // Fix remaining Type 'unknown' not assignable to ReactNode
  content = content.replace(
    /\{([^}]*\.reason)\}/g,
    '{String($1 || "")}'
  );
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed: ${filePath}`);
  }
});

console.log('🎯 Final comprehensive fix complete');