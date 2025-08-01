const fs = require('fs');
const path = require('path');
const glob = require('glob');

// List of files with specific void return type issues
const filesToFix = [
  'src/components/documents/DocumentUploadStepper.tsx',
  'src/components/home/AISupportSection.tsx',
  'src/components/home/AboutContent.tsx', 
  'src/components/home/AboutSection.tsx',
  'src/components/home/CTASection.tsx',
  'src/components/home/CommunitySection.tsx',
  'src/components/home/Hero.tsx',
  'src/components/home/HeroContent.tsx',
  'src/components/home/HeroImage.tsx',
  'src/components/home/HowItWorks.tsx',
  'src/components/home/PartnersSection.tsx',
  'src/components/home/StudentSuccessCard.tsx',
  'src/components/home/TestimonialCard.tsx',
  'src/components/home/TestimonialsSection.tsx',
  'src/components/profile-completion/AddressInfoStep.tsx',
  'src/components/profile-completion/ContactInfoStep.tsx',
  'src/components/profile-completion/EducationHistoryStep.tsx',
  'src/components/profile-completion/PersonalInfoStep.tsx',
  'src/components/profile/ProfileForm.tsx',
  'src/components/profile/UserProfileCard.tsx',
  'src/components/subscription/PlanSelector.tsx',
  'src/components/system/UILockSystem.tsx',
  'src/components/thandi/FeedbackSystem.tsx',
  'src/components/thandi/IntentForm.tsx',
  'src/components/thandi/training/TrainingFooter.tsx',
  'src/components/ui/ErrorBoundary.tsx',
  'src/components/ui/ErrorRecovery.tsx',
  'src/components/ui/ProgressIndicator.tsx',
  'src/components/ui/fonts.tsx',
  'src/components/admin/audit/AdminActivityLog.tsx',
  'src/components/admin/audit/AuditTrail.tsx',
  'src/components/journey/MilestoneDetail.tsx',
  'src/components/error-handling/ErrorDisplay.tsx',
  'src/components/error-handling/OfflineErrorDisplay.tsx',
  'src/components/error-handling/ErrorBoundary.tsx',
  'src/components/error-handling/RecoveryHelper.tsx',
  'src/components/footer.tsx',
  'src/components/home/Footer.tsx'
];

function fixVoidReturnTypes(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️ File not found: ${filePath}`);
      return false;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    const original = content;
    let modified = false;

    // 1. Fix React component exports with void return type
    content = content.replace(
      /export\s+const\s+([A-Z][A-Za-z0-9]*)\s*=\s*\(([^)]*)\)\s*:\s*void\s*=>/g,
      'export const $1 = ($2): JSX.Element =>'
    );

    // 2. Fix React component function declarations
    content = content.replace(
      /export\s+function\s+([A-Z][A-Za-z0-9]*)\s*\(([^)]*)\)\s*:\s*void\s*{/g,
      'export function $1($2): JSX.Element {'
    );

    // 3. Fix internal component functions
    content = content.replace(
      /const\s+([A-Z][A-Za-z0-9]*)\s*=\s*\(([^)]*)\)\s*:\s*void\s*=>/g,
      'const $1 = ($2): JSX.Element =>'
    );

    // 4. Fix helper functions that return strings
    content = content.replace(
      /const\s+(get[A-Z][A-Za-z]*|format[A-Z][A-Za-z]*)\s*=\s*\(([^)]*)\)\s*:\s*void\s*=>/g,
      'const $1 = ($2): string =>'
    );

    // 5. Fix boolean helper functions
    content = content.replace(
      /const\s+(is[A-Z][A-Za-z]*|has[A-Z][A-Za-z]*|can[A-Z][A-Za-z]*|should[A-Z][A-Za-z]*)\s*=\s*\(([^)]*)\)\s*:\s*void\s*=>/g,
      'const $1 = ($2): boolean =>'
    );

    // 6. Fix utility functions that return any
    content = content.replace(
      /const\s+(render[A-Z][A-Za-z]*|create[A-Z][A-Za-z]*|build[A-Z][A-Za-z]*)\s*=\s*\(([^)]*)\)\s*:\s*void\s*=>/g,
      'const $1 = ($2): any =>'
    );

    // 7. Fix hook functions
    content = content.replace(
      /export\s+const\s+(use[A-Z][A-Za-z]*)\s*=\s*\(([^)]*)\)\s*:\s*void\s*=>/g,
      'export const $1 = ($2) =>'
    );

    // 8. Fix unknown types in ReactNode contexts
    content = content.replace(
      /\{([^}]*\.reason)\s+as\s+unknown\}/g,
      '{String($1 || "")}'
    );

    // 9. Fix direct unknown usage in JSX
    content = content.replace(
      /\{([^}]*\.reason)\}/g,
      '{String($1 || "")}'
    );

    // 10. Fix specific audit log patterns  
    if (filePath.includes('AdminActivityLog.tsx') || filePath.includes('AuditTrail.tsx')) {
      content = content.replace(
        /\{log\.details\?\.reason\s+&&\s+typeof\s+log\.details\.reason\s+===\s+'string'\s+&&\s+\([^)]*\)\}/g,
        '{log.details?.reason && typeof log.details.reason === \'string\' && String(log.details.reason)}'
      );
    }

    if (content !== original) {
      // Create backup
      const backupPath = filePath + '.backup-void';
      if (!fs.existsSync(backupPath)) {
        fs.writeFileSync(backupPath, original);
      }
      
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed void returns in: ${filePath}`);
      modified = true;
    }

    return modified;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

console.log(`🔍 Processing ${filesToFix.length} files with void return type issues...`);

let fixedCount = 0;
filesToFix.forEach((file) => {
  if (fixVoidReturnTypes(file)) {
    fixedCount++;
  }
});

// Also process all remaining TypeScript files for any missed patterns
const allTsFiles = glob.sync('src/**/*.{ts,tsx}', {
  ignore: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}']
});

console.log(`\n🔍 Processing ${allTsFiles.length} additional TypeScript files...`);

allTsFiles.forEach((file) => {
  if (!filesToFix.includes(file)) {
    if (fixVoidReturnTypes(file)) {
      fixedCount++;
    }
  }
});

console.log(`\n🎯 Fixed void return types in ${fixedCount} files`);
console.log('✅ Final void return type fix complete!');