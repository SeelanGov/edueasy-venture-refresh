#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Cleaning build artifacts and temporary files..."

# Build outputs
echo "📁 Removing build outputs..."
rm -rf dist/
rm -rf build/
rm -rf .vite/
rm -rf node_modules/.vite/

# Test outputs
echo "📁 Removing test artifacts..."
rm -rf coverage/
rm -rf .nyc_output/
rm -f test-results.xml
rm -f junit.xml

# Storybook outputs
echo "📁 Removing Storybook artifacts..."
rm -rf storybook-static/
rm -rf .storybook-out/

# TypeScript outputs
echo "📁 Removing TypeScript artifacts..."
rm -f tsconfig.tsbuildinfo
rm -rf .tsbuildinfo/

# Temporary files
echo "📁 Removing temporary files..."
find . -name "*.tmp" -type f -delete || true
find . -name "*.temp" -type f -delete || true
find . -name ".DS_Store" -type f -delete || true
find . -name "Thumbs.db" -type f -delete || true

# Log files
echo "📁 Removing log files..."
rm -f *.log
rm -f npm-debug.log*
rm -f yarn-debug.log*
rm -f yarn-error.log*
rm -f lerna-debug.log*

# Cache directories
echo "📁 Removing cache directories..."
rm -rf .cache/
rm -rf .parcel-cache/

# IDE files (optional - uncomment if needed)
# rm -rf .vscode/
# rm -rf .idea/

echo "✅ Clean complete!"
echo ""
echo "Remaining important files:"
echo "- package.json, package-lock.json"
echo "- src/ directory"
echo "- .env files (preserved)"
echo "- .git/ directory"