const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('🚨 RUNNING FINAL EMERGENCY BUILD FIX');
console.log('📊 Target: Fix remaining TypeScript errors systematically');

// Emergency fix function
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
  
  // 6. Fix functions that return boolean
  content = content.replace(
    /(\s*(?:const|function)\s+\w+[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+(?:true|false))/gm,
    '$1: boolean$2'
  );
  
  // 7. Fix functions that return null
  content = content.replace(
    /(\s*(?:const|function)\s+\w+[^=]*?):\s*void(\s*(?:=>\s*\{|\{)[^}]*return\s+null)/gm,
    '$1: JSX.Element | null$2'
  );
  
  // 8. Fix Element is not assignable to void
  content = content.replace(
    /(\s+return\s+\(\s*<[^>]+>[^<]*<\/[^>]+>\s*\);\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: JSX.Element'
  );
  
  // 9. Fix null is not assignable to void  
  content = content.replace(
    /(\s+return\s+null;\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: JSX.Element | null'
  );
  
  // 10. Fix unknown types to ReactNode
  content = content.replace(
    /(\s+return\s+.+;\s*[\r\n]+\s*})(\s*:\s*void)/g,
    '$1: React.ReactNode'
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

// Find all TypeScript files with errors
const errorFiles = [
  'src/components/admin/audit/AdminActivityLog.tsx',
  'src/components/admin/audit/AuditTrail.tsx',
  'src/components/application/FormActions.tsx',
  'src/components/application/OfflineNotice.tsx',
  'src/components/consultations/ConsultationBookingForm.tsx',
  'src/components/dashboard/ApplicationHeader.tsx',
  'src/components/dashboard/layout/AdminNavSection.tsx',
  'src/components/dashboard/layout/DashboardSidebar.tsx',
  'src/components/demo/JourneyMapDemo.tsx',
  'src/components/docs/ColorSystem.tsx'
];

console.log(`📋 Found ${errorFiles.length} files to process`);

let fixedCount = 0;
errorFiles.forEach(file => {
  if (fs.existsSync(file) && emergencyFixFile(file)) {
    fixedCount++;
  }
});

// Also run on all remaining tsx files
const allFiles = glob.sync('src/**/*.{ts,tsx}', { 
  ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**']
});

allFiles.forEach(file => {
  if (!errorFiles.includes(file) && emergencyFixFile(file)) {
    fixedCount++;
  }
});

console.log(`🎯 Emergency fixes applied: ${fixedCount} files`);
console.log('✅ Final emergency build fix complete');