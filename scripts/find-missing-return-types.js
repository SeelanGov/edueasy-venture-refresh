/**
 * Script to find functions that might be missing return types
 *
 * This script:
 * 1. Finds all .tsx files in the src directory
 * 2. Identifies functions that don't have explicit return types
 * 3. Outputs a list of files and functions that might need fixing
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

// Check for functions without return types
const findFunctionsWithoutReturnTypes = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');

    const results = [];

    // Regular expressions to match function declarations without return types
    const functionPatterns = [
      /function\s+(\w+)\s*\([^)]*\)\s*{/g, // function name() {
      /export\s+function\s+(\w+)\s*\([^)]*\)\s*{/g, // export function name() {
      /const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/g, // const name = () => {
      /export\s+const\s+(\w+)\s*=\s*\([^)]*\)\s*=>\s*{/g, // export const name = () => {
    ];

    // Check each line for function declarations
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      for (const pattern of functionPatterns) {
        const matches = [...line.matchAll(pattern)];

        for (const match of matches) {
          // Check if the line doesn't contain a return type
          if (!line.includes('):') && !line.includes('): ')) {
            const functionName = match[1] || 'anonymous';
            results.push({
              line: i + 1,
              text: line.trim(),
              functionName,
            });
          }
        }
      }
    }

    return results;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return [];
  }
};

// Main function
const main = () => {
  const files = findTsxFiles();
  console.log(`Found ${files.length} TSX files to process`);

  let totalIssues = 0;
  const fileIssues = {};

  files.forEach((file) => {
    const issues = findFunctionsWithoutReturnTypes(file);
    if (issues.length > 0) {
      fileIssues[file] = issues;
      totalIssues += issues.length;
    }
  });

  console.log(
    `\nFound ${totalIssues} potential functions without return types in ${Object.keys(fileIssues).length} files\n`,
  );

  // Output the results
  for (const [file, issues] of Object.entries(fileIssues)) {
    console.log(`\n${file}:`);
    issues.forEach((issue) => {
      console.log(`  Line ${issue.line}: ${issue.functionName}`);
      console.log(`    ${issue.text}`);
    });
  }
};

main();
