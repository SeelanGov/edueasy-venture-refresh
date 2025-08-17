const fs = require('fs');
const path = require('path');

console.log('🔧 COMPREHENSIVE JSX FIX SCRIPT');
console.log('===============================');

function fixJSXIssues() {
  const results = {
    partnerDashboard: { fixed: false, issues: [] },
    studentLogin: { fixed: false, issues: [] },
  };

  try {
    console.log('\n📋 Phase 1: Analyzing PartnerDashboard.tsx');

    const partnerPath = path.join(__dirname, '..', 'src', 'pages', 'PartnerDashboard.tsx');
    let partnerContent = fs.readFileSync(partnerPath, 'utf8');

    // Check for issues
    const hasCardImport = partnerContent.includes("import { Card } from '@/components/ui/card';");
    const hasVoidReturnType = partnerContent.includes('): void => {');
    const openingCards = (partnerContent.match(/<Card/g) || []).length;
    const closingCards = (partnerContent.match(/<\/Card>/g) || []).length;

    console.log(`📊 Issues found:`);
    console.log(`   - Card import: ${hasCardImport ? '✅' : '❌'}`);
    console.log(`   - Void return type: ${hasVoidReturnType ? '❌' : '✅'}`);
    console.log(`   - Card tags: ${openingCards} opening, ${closingCards} closing`);

    // Fix 1: Add Card import
    if (!hasCardImport) {
      partnerContent = partnerContent.replace(
        "import { Button } from '@/components/ui/button';",
        "import { Button } from '@/components/ui/button';\nimport { Card } from '@/components/ui/card';",
      );
      console.log('✅ Added Card import');
    }

    // Fix 2: Fix return type
    if (hasVoidReturnType) {
      partnerContent = partnerContent.replace('): void => {', '): JSX.Element => {');
      console.log('✅ Fixed return type');
    }

    // Fix 3: Fix unclosed Card tags
    if (openingCards > closingCards) {
      const missingClosings = openingCards - closingCards;
      console.log(`🔧 Adding ${missingClosings} missing Card closing tags`);

      // Find strategic places to add closing tags
      const lines = partnerContent.split('\n');
      let cardCount = 0;
      const insertPoints = [];

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<Card')) {
          cardCount++;
        }
        if (lines[i].includes('</Card>')) {
          cardCount--;
        }
        // Add closing tag before major section endings
        if (
          lines[i].includes('</div>') &&
          cardCount > 0 &&
          (lines[i].includes('Register as Partner') ||
            lines[i].includes('WhatsApp 060 123 4567') ||
            lines[i].includes('Unlimited applications') ||
            lines[i].includes('payment.status') ||
            lines[i].includes('API integration coming soon') ||
            lines[i].includes('Download Invoice (Sample)'))
        ) {
          insertPoints.push(i);
        }
      }

      // Add closing tags at strategic points
      for (let i = insertPoints.length - 1; i >= 0 && missingClosings > 0; i--) {
        const lineIndex = insertPoints[i];
        lines.splice(lineIndex, 0, '        </Card>');
      }

      partnerContent = lines.join('\n');
      console.log('✅ Added missing Card closing tags');
    }

    // Write fixed content
    fs.writeFileSync(partnerPath, partnerContent);

    // Verify fixes
    const finalPartnerContent = fs.readFileSync(partnerPath, 'utf8');
    const finalHasCardImport = finalPartnerContent.includes(
      "import { Card } from '@/components/ui/card';",
    );
    const finalHasVoidReturnType = finalPartnerContent.includes('): void => {');
    const finalOpeningCards = (finalPartnerContent.match(/<Card/g) || []).length;
    const finalClosingCards = (finalPartnerContent.match(/<\/Card>/g) || []).length;

    results.partnerDashboard.fixed =
      finalHasCardImport && !finalHasVoidReturnType && finalOpeningCards === finalClosingCards;

    console.log(`📊 PartnerDashboard.tsx final status:`);
    console.log(`   - Card import: ${finalHasCardImport ? '✅' : '❌'}`);
    console.log(`   - Return type: ${finalHasVoidReturnType ? '❌' : '✅'}`);
    console.log(
      `   - Card tags balanced: ${finalOpeningCards === finalClosingCards ? '✅' : '❌'}`,
    );

    console.log('\n📋 Phase 2: Analyzing StudentLogin.tsx');

    const studentPath = path.join(__dirname, '..', 'src', 'pages', 'StudentLogin.tsx');
    let studentContent = fs.readFileSync(studentPath, 'utf8');

    // Check for issues
    const studentHasCardImport = studentContent.includes(
      "import { Card } from '@/components/ui/card';",
    );
    const studentOpeningCards = (studentContent.match(/<Card/g) || []).length;
    const studentClosingCards = (studentContent.match(/<\/Card>/g) || []).length;

    console.log(`📊 Issues found:`);
    console.log(`   - Card import: ${studentHasCardImport ? '✅' : '❌'}`);
    console.log(`   - Card tags: ${studentOpeningCards} opening, ${studentClosingCards} closing`);

    // Fix 1: Add Card import
    if (!studentHasCardImport) {
      studentContent = studentContent.replace(
        "import { Button } from '@/components/ui/button';",
        "import { Button } from '@/components/ui/button';\nimport { Card } from '@/components/ui/card';",
      );
      console.log('✅ Added Card import');
    }

    // Fix 2: Fix unclosed Card tag
    if (studentOpeningCards > studentClosingCards) {
      const lines = studentContent.split('\n');
      let cardOpened = false;
      let insertIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes('<Card') && !lines[i].includes('/>')) {
          cardOpened = true;
        }
        if (cardOpened && lines[i].includes('</div>') && lines[i].trim() === '</div>') {
          insertIndex = i;
          break;
        }
      }

      if (insertIndex !== -1) {
        lines.splice(insertIndex, 0, '        </Card>');
        studentContent = lines.join('\n');
        console.log('✅ Added missing Card closing tag');
      }
    }

    // Write fixed content
    fs.writeFileSync(studentPath, studentContent);

    // Verify fixes
    const finalStudentContent = fs.readFileSync(studentPath, 'utf8');
    const finalStudentHasCardImport = finalStudentContent.includes(
      "import { Card } from '@/components/ui/card';",
    );
    const finalStudentOpeningCards = (finalStudentContent.match(/<Card/g) || []).length;
    const finalStudentClosingCards = (finalStudentContent.match(/<\/Card>/g) || []).length;

    results.studentLogin.fixed =
      finalStudentHasCardImport && finalStudentOpeningCards === finalStudentClosingCards;

    console.log(`📊 StudentLogin.tsx final status:`);
    console.log(`   - Card import: ${finalStudentHasCardImport ? '✅' : '❌'}`);
    console.log(
      `   - Card tags balanced: ${finalStudentOpeningCards === finalStudentClosingCards ? '✅' : '❌'}`,
    );

    return results;
  } catch (error) {
    console.error('❌ Error during JSX fix:', error.message);
    return results;
  }
}

// Run the fix
const results = fixJSXIssues();

console.log('\n🎯 FINAL SUMMARY');
console.log('===============');

const allFixed = results.partnerDashboard.fixed && results.studentLogin.fixed;

if (allFixed) {
  console.log('✅ ALL JSX ISSUES RESOLVED');
  console.log('   - Card imports added to both files');
  console.log('   - Return type corrected in PartnerDashboard');
  console.log('   - All Card tags properly balanced');
  console.log('\n🚀 Ready for TypeScript compilation test');
} else {
  console.log('❌ Some issues remain:');
  if (!results.partnerDashboard.fixed) {
    console.log('   - PartnerDashboard.tsx needs attention');
  }
  if (!results.studentLogin.fixed) {
    console.log('   - StudentLogin.tsx needs attention');
  }
}

console.log('\n' + '='.repeat(50));
if (allFixed) {
  console.log('🎉 JSX FIXES COMPLETED SUCCESSFULLY');
} else {
  console.log('⚠️ JSX FIXES INCOMPLETE - MANUAL REVIEW NEEDED');
}
console.log('='.repeat(50));
