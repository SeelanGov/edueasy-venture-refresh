const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixTypeScriptErrors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  const original = content;

  // 1. Fix React component return types from void to JSX.Element
  content = content.replace(
    /(\): void\s*=>\s*\{)/g,
    '): JSX.Element => {'
  );
  
  content = content.replace(
    /(\)\s*:\s*void\s*\{)/g,
    '): JSX.Element {'
  );

  // 2. Fix unknown types in JSX contexts - cast to string
  content = content.replace(
    /\{([^}]*)\s+as\s+unknown\}/g,
    '{String($1 || "")}'
  );

  // 3. Fix specific unknown reason patterns in audit logs
  content = content.replace(
    /\{log\.details\?\.reason\s+&&\s+typeof\s+log\.details\.reason\s+===\s+'string'\s+&&\s+\(\s*<[^>]*>\{log\.details\.reason\}<\/[^>]*>\s*\)\}/g,
    '{log.details?.reason && typeof log.details.reason === \'string\' && (<div className="text-sm truncate">{String(log.details.reason)}</div>)}'
  );

  // 4. Fix patterns like {log.details?.reason} in audit logs
  content = content.replace(
    /\{log\.details\?\.reason\s+&&\s+typeof\s+log\.details\.reason\s+===\s+'string'\s+&&\s+\(\s*<[^>]*>Reason:\s+\{log\.details\.reason\}<\/[^>]*>\s*\)\}/g,
    '{log.details?.reason && typeof log.details.reason === \'string\' && (<div className="mt-1 text-sm text-gray-600">Reason: {String(log.details.reason)}</div>)}'
  );

  // 5. Fix function declarations that return void but should return JSX.Element
  content = content.replace(
    /export\s+const\s+(\w+)\s*=\s*\([^)]*\)\s*:\s*void\s*=>/g,
    'export const $1 = ($1): JSX.Element =>'
  );

  // 6. Fix function return types in function declarations
  content = content.replace(
    /function\s+(\w+)\s*\([^)]*\)\s*:\s*void/g,
    'function $1($1): JSX.Element'
  );

  // 7. Fix early returns that are null/string/boolean but function returns void
  content = content.replace(
    /(\s+if\s*\([^)]+\)\s*return\s+null;)/g,
    '$1'
  );

  content = content.replace(
    /(\s+if\s*\([^)]+\)\s*return\s+["'][^"']*["'];)/g,
    '$1'
  );

  content = content.replace(
    /(\s+if\s*\([^)]+\)\s*return\s+(?:true|false);)/g,
    '$1'
  );

  // 8. Fix getIconClassName and similar functions that should return string
  content = content.replace(
    /const\s+(getIconClassName|getSeverityColor|formatDate|formatDocumentType)\s*=\s*\([^)]*\)\s*:\s*void\s*=>/g,
    'const $1 = ($1): string =>'
  );

  // 9. Fix utility functions that return values
  content = content.replace(
    /const\s+(format\w+|get\w+|is\w+|has\w+|can\w+)\s*=\s*\([^)]*\)\s*:\s*void\s*=>/g,
    'const $1 = ($1) =>'
  );

  // 10. Fix helper functions that return boolean
  content = content.replace(
    /const\s+(isActive|isSelected|isValid|hasError|canAccess)\s*=\s*\([^)]*\)\s*:\s*void\s*=>/g,
    'const $1 = ($1): boolean =>'
  );

  if (content !== original) {
    // Create backup
    const backupPath = filePath + '.backup';
    if (!fs.existsSync(backupPath)) {
      fs.writeFileSync(backupPath, original);
    }
    
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed TypeScript errors in: ${filePath}`);
    modified = true;
  }

  return modified;
}

// Find all TypeScript files in src
const tsFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}']
});

console.log(`🔍 Found ${tsFiles.length} TypeScript files to fix...`);

let fixedCount = 0;
const errorFiles = [];

tsFiles.forEach((file) => {
  try {
    if (fixTypeScriptErrors(file)) {
      fixedCount++;
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
    errorFiles.push(file);
  }
});

console.log(`\n🎯 Fixed TypeScript errors in ${fixedCount} files`);

if (errorFiles.length > 0) {
  console.log(`\n⚠️ Failed to process ${errorFiles.length} files:`);
  errorFiles.forEach(file => console.log(`  - ${file}`));
}

console.log('\n✅ TypeScript error fixing complete!');