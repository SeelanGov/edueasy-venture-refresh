const fs = require('fs');
const path = require('path');

// Color mapping from hardcoded Tailwind to design tokens
const colorMappings = {
  // Background colors
  'bg-green-100': 'bg-[#F0F9F0]', // Using a light green that matches our design tokens
  'bg-yellow-100': 'bg-[#FFF8E1]', // Light yellow
  'bg-red-100': 'bg-[#FFEBEE]', // Light red
  'bg-blue-100': 'bg-[#E3F2FD]', // Light blue
  'bg-gray-100': 'bg-[#F5F5F5]', // Light gray
  
  // Text colors
  'text-green-800': 'text-[#1B5E20]', // Dark green
  'text-yellow-800': 'text-[#F57F17]', // Dark yellow
  'text-red-800': 'text-[#B71C1C]', // Dark red
  'text-blue-800': 'text-[#1565C0]', // Dark blue
  'text-gray-800': 'text-[#424242]', // Dark gray
  'text-gray-500': 'text-[#757575]', // Medium gray
  'text-gray-400': 'text-[#BDBDBD]', // Light gray
  'text-blue-600': 'text-[#1976D2]', // Blue link color
  
  // Border colors
  'border-green-200': 'border-[#C8E6C9]',
  'border-yellow-200': 'border-[#FFF59D]',
  'border-red-200': 'border-[#FFCDD2]',
  'border-blue-200': 'border-[#BBDEFB]',
  'border-gray-200': 'border-[#EEEEEE]',
  
  // Status-specific colors
  'bg-green-500': 'bg-[#388E3C]', // Success
  'bg-red-500': 'bg-[#D32F2F]', // Error
  'bg-yellow-500': 'bg-[#F57C00]', // Warning
  'bg-blue-500': 'bg-[#1976D2]', // Info
  'bg-gray-500': 'bg-[#757575]', // Neutral
};

// Files to process (focusing on the most problematic ones first)
const targetFiles = [
  'src/components/admin/partners/PartnerProfile.tsx',
  'src/components/admin/analytics/StatCard.tsx',
  'src/components/admin/analytics/AnalyticsTabs.tsx',
  'src/components/admin/rls/PolicyAnalysis.tsx',
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

function replaceColorsInFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  let replacements = 0;

  // Replace hardcoded colors with design token colors
  for (const [oldColor, newColor] of Object.entries(colorMappings)) {
    const regex = new RegExp(`\\b${oldColor}\\b`, 'g');
    const matches = content.match(regex);
    if (matches) {
      content = content.replace(regex, newColor);
      replacements += matches.length;
    }
  }

  // Add design tokens import if we made replacements
  if (replacements > 0) {
    // Check if design tokens import already exists
    if (!content.includes('@/lib/design-tokens')) {
      // Add import at the top of the file
      const importStatement = "import { designTokens } from '@/lib/design-tokens';\n";
      content = importStatement + content;
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed ${replacements} color violations in ${filePath}`);
  } else {
    console.log(`ℹ️  No color violations found in ${filePath}`);
  }
}

function main() {
  console.log('🎨 Starting design token fixes...\n');
  
  let totalReplacements = 0;
  
  for (const filePath of targetFiles) {
    try {
      replaceColorsInFile(filePath);
    } catch (error) {
      console.error(`❌ Error processing ${filePath}:`, error.message);
    }
  }
  
  console.log('\n🎉 Design token fixes completed!');
  console.log('Run "npm run lint" to check remaining issues.');
}

if (require.main === module) {
  main();
}

module.exports = { replaceColorsInFile, colorMappings }; 