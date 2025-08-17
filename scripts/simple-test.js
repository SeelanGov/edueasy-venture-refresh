// Simple test to verify localStorage fix
const fs = require('fs');
const path = require('path');

console.log('🔍 Simple localStorage Fix Test...');
console.log('==================================');

const localStoragePath = path.join(__dirname, '..', 'src', 'utils', 'security', 'localStorage.ts');
const content = fs.readFileSync(localStoragePath, 'utf8');

// Check for the old recursive pattern
const oldPatterns = [
  'sessionStorage.setItem(key, encryptedValue)',
  'sessionStorage.setItem(key, value)',
  'sessionStorage.getItem(key)',
  'sessionStorage.removeItem(key)',
  'sessionStorage.clear()',
];

// Check for the new fixed pattern
const newPatterns = [
  'window.sessionStorage.setItem(key, encryptedValue)',
  'window.sessionStorage.setItem(key, value)',
  'window.sessionStorage.getItem(key)',
  'window.sessionStorage.removeItem(key)',
  'window.sessionStorage.clear()',
];

console.log('\n🔍 Checking for old recursive patterns:');
let foundOldPatterns = 0;
oldPatterns.forEach((pattern) => {
  if (content.includes(pattern)) {
    console.log(`❌ Found: ${pattern}`);
    foundOldPatterns++;
  } else {
    console.log(`✅ Not found: ${pattern}`);
  }
});

console.log('\n🔍 Checking for new fixed patterns:');
let foundNewPatterns = 0;
newPatterns.forEach((pattern) => {
  if (content.includes(pattern)) {
    console.log(`✅ Found: ${pattern}`);
    foundNewPatterns++;
  } else {
    console.log(`❌ Not found: ${pattern}`);
  }
});

console.log('\n📊 Summary:');
console.log(`Old recursive patterns found: ${foundOldPatterns}`);
console.log(`New fixed patterns found: ${foundNewPatterns}`);

if (foundOldPatterns === 0 && foundNewPatterns === newPatterns.length) {
  console.log('\n🎉 localStorage recursion bug is FIXED!');
} else {
  console.log('\n⚠️ localStorage recursion bug needs attention.');
}
