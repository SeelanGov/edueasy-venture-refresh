const fs = require('fs');
const path = require('path');

// Additional color mappings for remaining violations
const additionalColorMappings = {
  // More specific color patterns found in the linting output
  'bg-green-500': 'bg-[#388E3C]',
  'bg-red-500': 'bg-[#D32F2F]',
  'bg-yellow-500': 'bg-[#F57C00]',
  'bg-blue-500': 'bg-[#1976D2]',
  'bg-gray-500': 'bg-[#757575]',
  
  // Text colors
  'text-green-500': 'text-[#388E3C]',
  'text-red-500': 'text-[#D32F2F]',
  'text-yellow-500': 'text-[#F57C00]',
  'text-blue-500': 'text-[#1976D2]',
  'text-gray-500': 'text-[#757575]',
  
  // Border colors
  'border-green-500': 'border-[#388E3C]',
  'border-red-500': 'border-[#D32F2F]',
  'border-yellow-500': 'border-[#F57C00]',
  'border-blue-500': 'border-[#1976D2]',
  'border-gray-500': 'border-[#757575]',
};

// Files with remaining design token violations
const remainingFiles = [
  'src/components/admin/analytics/AnalyticsTabs.tsx',
  'src/components/admin/rls/PolicyTestResults.tsx',
  'src/components/admin/sponsors/SponsorAllocationsTable.tsx',
  'src/components/admin/sponsors/SponsorListTable.tsx',
  'src/components/admin/partners/PartnerIntegrationChecklist.tsx',
  'src/components/documents/DocumentUploadStepper.tsx',
  'src/components/journey/JourneyMilestone.tsx',
  'src/components/sponsor/SponsorCard.tsx',
  'src/components/sponsor/SponsorPaymentHistory.tsx',
  'src/components/sponsor/SponsorStudentTable.tsx',
  'src/components/subscription/PlanLimitWarning.tsx',
  'src/components/thandi/FeedbackSystem.tsx',
  'src/components/thandi/training/MessageRow.tsx',
  'src/components/ui/EnhancedFormField.tsx',
  'src/components/ui/stepper.tsx',
  'src/components/ui/toast.tsx',
  'src/components/dashboard/NotificationsPanel.tsx',
  'src/pages/PartnerDashboard.tsx',
];

function fixRemainingDesignTokens(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let replacements = 0;

  // Replace remaining hardcoded colors
  for (const [oldColor, newColor] of Object.entries(additionalColorMappings)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newColor);
      replacements += matches.length;
    }
  }

  // Remove unused designTokens imports
  if (content.includes("import { designTokens } from '@/lib/design-tokens'") && 
      !content.includes('designTokens.')) {
    content = content.replace(/import \{ designTokens \} from '\/lib\/design-tokens';\n?/g, '');
    console.log(`🗑️  Removed unused designTokens import from ${filePath}`);
  }

  if (replacements > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${replacements} additional color violations in ${filePath}`);
  }
}

function cleanUnusedImports() {
  const filesWithUnusedImports = [
    'src/components/admin/analytics/StatCard.tsx',
    'src/components/admin/partners/PartnerProfile.tsx',
    'src/components/admin/rls/PolicyAnalysis.tsx',
    'src/components/admin/sponsors/SponsorAllocationsTable.tsx',
    'src/components/admin/sponsors/SponsorListTable.tsx',
    'src/components/documents/DocumentUploadStepper.tsx',
    'src/components/journey/JourneyMilestone.tsx',
    'src/components/sponsor/SponsorCard.tsx',
    'src/components/sponsor/SponsorPaymentHistory.tsx',
    'src/components/sponsor/SponsorStudentTable.tsx',
    'src/components/subscription/PlanLimitWarning.tsx',
    'src/components/thandi/FeedbackSystem.tsx',
    'src/components/thandi/training/MessageRow.tsx',
    'src/components/ui/EnhancedFormField.tsx',
    'src/components/ui/stepper.tsx',
    'src/components/dashboard/NotificationsPanel.tsx',
  ];

  for (const filePath of filesWithUnusedImports) {
    if (!fs.existsSync(filePath)) continue;
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove unused designTokens imports
    if (content.includes("import { designTokens } from '@/lib/design-tokens'") && 
        !content.includes('designTokens.')) {
      content = content.replace(/import \{ designTokens \} from '\/lib\/design-tokens';\n?/g, '');
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`🗑️  Cleaned unused import in ${filePath}`);
    }
  }
}

function main() {
  console.log('🎨 Fixing remaining design token violations...\n');
  
  // Fix remaining design token violations
  for (const filePath of remainingFiles) {
    try {
      fixRemainingDesignTokens(filePath);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('\n🧹 Cleaning unused imports...\n');
  cleanUnusedImports();
  
  console.log('\n🎉 Remaining design token fixes completed!');
  console.log('Run "npm run lint" to check remaining issues.');
}

if (require.main === module) {
  main();
}

module.exports = { fixRemainingDesignTokens, cleanUnusedImports }; 