#!/usr/bin/env node

/**
 * Emergency TypeScript Fix Script
 * Fixes the most common TypeScript errors in the EduEasy project
 */

const fs = require('fs');
const path = require('path');

console.log('🚨 EMERGENCY TYPESCRIPT FIX STARTING...');

// Common fixes to apply
const fixes = [
  // Fix missing React imports
  {
    pattern: /^import.*from 'react';$/m,
    replacement: "import React, { useState, useEffect } from 'react';",
    condition: (content) => !content.includes('import React') && (content.includes('useState') || content.includes('useEffect'))
  },
  
  // Fix duplicate RefreshCw imports
  {
    pattern: /import { RefreshCw } from 'lucide-react';\s*[\s\S]*?RefreshCw,/g,
    replacement: (match) => match.replace(/RefreshCw,/g, '').replace(/RefreshCw/g, ''),
    condition: (content) => content.includes('RefreshCw') && content.split('RefreshCw').length > 3
  },
  
  // Fix missing parameter types
  {
    pattern: /\(\s*{\s*([^}]+)\s*}\s*\)\s*=>/g,
    replacement: '({ $1 }: any) =>',
    condition: (content) => content.includes('implicitly has an \'any\' type')
  }
];

// Function to apply fixes to a file
function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    fixes.forEach(fix => {
      if (!fix.condition || fix.condition(content)) {
        const newContent = content.replace(fix.pattern, fix.replacement);
        if (newContent !== content) {
          content = newContent;
          modified = true;
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
    return false;
  }
}

// Recursively find and fix TypeScript files
function fixDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  let fixedCount = 0;
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      fixedCount += fixDirectory(itemPath);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      if (fixFile(itemPath)) {
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

// Run the fixes
const srcPath = path.join(__dirname, '..', 'src');
const fixedFiles = fixDirectory(srcPath);

console.log(`\n🎯 Emergency fix complete: ${fixedFiles} files fixed`);
console.log('💡 This is a basic fix - manual review still needed for complex issues');