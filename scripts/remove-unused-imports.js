const fs = require('fs');
const path = require('path');

// Files to fix with their unused imports
const filesToFix = [
  {
    path: 'src/components/admin/rls/AccessDeniedCard.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/admin/rls/PolicyAnalysis.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/admin/rls/PolicyAnalysisTab.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/admin/rls/PolicyRegistryTab.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/admin/rls/PolicyTestConfiguration.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/admin/rls/PolicyTestResults.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/admin/rls/PolicyTestTab.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/ai/ThandiAgent.tsx',
    removeImports: ['useEffect', 'MessageSquare'],
  },
  {
    path: 'src/components/career-guidance/CareerAssessmentCard.tsx',
    removeImports: ['React'],
  },
  {
    path: 'src/components/dashboard/NotificationsPanel.tsx',
    removeImports: ['X'],
  },
  {
    path: 'src/components/dashboard/layout/DashboardSidebar.tsx',
    removeImports: ['Link'],
  },
  {
    path: 'src/components/dashboard/layout/MobileMenu.tsx',
    removeImports: ['Link', 'AdminNavSection'],
  },
  {
    path: 'src/components/documents/DocumentPreview.tsx',
    removeImports: ['Image'],
  },
  {
    path: 'src/components/documents/DocumentUploadStepper.tsx',
    removeImports: ['currentStep'],
  },
];

function removeUnusedImports(filePath, importsToRemove) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const content = fs.readFileSync(fullPath, 'utf8');

    let updatedContent = content;

    importsToRemove.forEach((importName) => {
      // Remove from named imports
      updatedContent = updatedContent.replace(
        new RegExp(`import\\s+${importName}\\s*,?\\s*{`, 'g'),
        'import {',
      );
      updatedContent = updatedContent.replace(new RegExp(`,?\\s*${importName}\\s*,?`, 'g'), '');

      // Clean up empty import statements
      updatedContent = updatedContent.replace(/import\s*{\s*}\s*from.*?;?\n/g, '');
      updatedContent = updatedContent.replace(/import\s*from.*?;?\n/g, '');
    });

    fs.writeFileSync(fullPath, updatedContent);
    console.log(`✅ Fixed unused imports in ${filePath}`);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

console.log('🔧 Removing unused imports...');

filesToFix.forEach(({ path: filePath, removeImports }) => {
  removeUnusedImports(filePath, removeImports);
});

console.log('✅ Completed removing unused imports');
