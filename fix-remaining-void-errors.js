#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// List of components with void return types that need to be fixed
const filesToFix = [
  'src/components/profile/UserProfileCard.tsx',
  'src/components/system/UILockSystem.tsx', 
  'src/components/ui/ErrorBoundary.tsx',
  'src/components/ui/ErrorRecovery.tsx',
  'src/components/ui/fonts.tsx',
  'src/components/profile/ProfileForm.tsx',
  'src/components/sponsorships/FAQCollapsible.tsx',
  'src/components/sponsorships/HowItWorksStepper.tsx',
  'src/components/sponsorships/ImpactStats.tsx',
  'src/components/sponsorships/SponsorshipCard.tsx',
  'src/components/sponsorships/TestimonialsSection.tsx',
  'src/components/subscription/PlanLimitWarning.tsx',
  'src/components/subscription/PlanSelector.tsx',
  'src/components/subscription/PremiumFeature.tsx',
  'src/components/subscription/SubscriptionTierCard.tsx',
  'src/components/thandi/FeedbackSystem.tsx',
  'src/components/thandi/IntentForm.tsx',
  'src/components/thandi/IntentList.tsx',
  'src/components/thandi/MessageTraining.tsx'
];

function fixVoidReturnTypes(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix export component function with void return type
  const voidExportPattern = /export const (\w+) = \(([^)]*)\): void =>/g;
  content = content.replace(voidExportPattern, (match, componentName, params) => {
    modified = true;
    console.log(`Fixed ${componentName} void return type in ${filePath}`);
    return `export const ${componentName} = (${params}): JSX.Element =>`;
  });

  // Fix hook function with void return type
  const voidHookPattern = /export const (use\w+) = \(([^)]*)\): void =>/g;
  content = content.replace(voidHookPattern, (match, hookName, params) => {
    modified = true;
    console.log(`Fixed ${hookName} void return type in ${filePath}`);
    
    // For hooks, return the appropriate type based on the hook name
    if (hookName.includes('Error')) {
      return `export const ${hookName} = (${params}) =>`;
    }
    return `export const ${hookName} = (${params}) =>`;
  });

  // Fix function declarations with void return type
  const voidFunctionPattern = /const (\w+) = \(([^)]*)\): void =>/g;
  content = content.replace(voidFunctionPattern, (match, funcName, params) => {
    modified = true;
    console.log(`Fixed ${funcName} void return type in ${filePath}`);
    return `const ${funcName} = (${params}) =>`;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Fixed void return types in ${filePath}`);
  } else {
    console.log(`No void return types found in ${filePath}`);
  }
}

console.log('🔧 Fixing remaining void return type errors...\n');

filesToFix.forEach(filePath => {
  try {
    fixVoidReturnTypes(filePath);
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log('\n✅ Completed fixing void return type errors!');