/**
 * Script to remove unused React imports from TSX files
 *
 * This script:
 * 1. Finds all .tsx files in the src directory
 * 2. Removes 'import React from "react"' statements where React is not used
 * 3. Preserves imports where React is actually used (React.useState, etc.)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get all .tsx files in the src directory - Windows compatible version
const findTsxFiles = () => {
  try {
    // Use a more Windows-friendly approach
    const srcDir = path.join(process.cwd(), 'src');
    return findTsxFilesRecursive(srcDir);
  } catch (error) {
    console.error('Error finding TSX files:', error);
    return [];
  }
};

// Recursive function to find all .tsx files
const findTsxFilesRecursive = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Recursively search directories
      results = results.concat(findTsxFilesRecursive(filePath));
    } else if (file.endsWith('.tsx')) {
      // Add .tsx files to the results
      results.push(filePath);
    }
  });

  return results;
};

// Check if React is actually used in the file content
const isReactUsed = (content) => {
  // Check for React.X usage or JSX.X references
  return /React\.[a-zA-Z]/.test(content) || /JSX\./.test(content);
};

// Process a single file
const processFile = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Check if file has React import
    if (
      content.includes("import React from 'react'") ||
      content.includes('import React from "react"')
    ) {
      // Check if React is actually used
      if (!isReactUsed(content)) {
        console.log(`Removing unused React import from ${filePath}`);

        // Remove the import line
        const updatedContent = content
          .replace(/import React from ['"]react['"];?\n?/g, '')
          .replace(/import React from ['"]react['"];? /g, '');

        fs.writeFileSync(filePath, updatedContent);
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return false;
  }
};

// Main function
const main = () => {
  const files = findTsxFiles();
  console.log(`Found ${files.length} TSX files to process`);

  let modifiedCount = 0;

  files.forEach((file) => {
    if (processFile(file)) {
      modifiedCount++;
    }
  });

  console.log(`Processed ${files.length} files, modified ${modifiedCount} files`);
};

main();
