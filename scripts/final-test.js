// Final accurate test to verify localStorage fix
const fs = require('fs');
const path = require('path');

console.log('🔍 Final localStorage Fix Test...');
console.log('==================================');

const localStoragePath = path.join(__dirname, '..', 'src', 'utils', 'security', 'localStorage.ts');
const content = fs.readFileSync(localStoragePath, 'utf8');

// Check for the old recursive pattern (without window.)
const oldPatterns = [
  /sessionStorage\.setItem\(key, encryptedValue\)/g,
  /sessionStorage\.setItem\(key, value\)/g,
  /sessionStorage\.getItem\(key\)/g,
  /sessionStorage\.removeItem\(key\)/g,
  /sessionStorage\.clear\(\)/g,
];

// Check for the new fixed pattern (with window.)
const newPatterns = [
  /window\.sessionStorage\.setItem\(key, encryptedValue\)/g,
  /window\.sessionStorage\.setItem\(key, value\)/g,
  /window\.sessionStorage\.getItem\(key\)/g,
  /window\.sessionStorage\.removeItem\(key\)/g,
  /window\.sessionStorage\.clear\(\)/g,
];

console.log('\n🔍 Checking for old recursive patterns (without window.):');
let foundOldPatterns = 0;
oldPatterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  if (matches && matches.length > 0) {
    console.log(`❌ Found ${matches.length} instances of old pattern ${index + 1}`);
    foundOldPatterns += matches.length;
  } else {
    console.log(`✅ No old pattern ${index + 1} found`);
  }
});

console.log('\n🔍 Checking for new fixed patterns (with window.):');
let foundNewPatterns = 0;
newPatterns.forEach((pattern, index) => {
  const matches = content.match(pattern);
  if (matches && matches.length > 0) {
    console.log(`✅ Found ${matches.length} instances of new pattern ${index + 1}`);
    foundNewPatterns += matches.length;
  } else {
    console.log(`❌ No new pattern ${index + 1} found`);
  }
});

console.log('\n📊 Summary:');
console.log(`Old recursive patterns found: ${foundOldPatterns}`);
console.log(`New fixed patterns found: ${foundNewPatterns}`);

if (foundOldPatterns === 0 && foundNewPatterns >= 5) {
  console.log('\n🎉 localStorage recursion bug is FIXED!');
  console.log('✅ All sessionStorage calls now use window.sessionStorage');
  console.log('✅ No more infinite recursion');
} else {
  console.log('\n⚠️ localStorage recursion bug needs attention.');
  if (foundOldPatterns > 0) {
    console.log(`❌ Found ${foundOldPatterns} old recursive patterns`);
  }
  if (foundNewPatterns < 5) {
    console.log(`❌ Missing ${5 - foundNewPatterns} new fixed patterns`);
  }
}
