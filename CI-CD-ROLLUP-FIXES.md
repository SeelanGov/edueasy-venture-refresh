# CI/CD Rollup Dependency Fixes

## Problem

The build process was failing in CI/CD environments with the following error:

```
Error: Cannot find module @rollup/rollup-linux-x64-gnu. npm has a bug related to optional dependencies (https://github.com/npm/cli/issues/4828). Please try `npm i` again after removing both package-lock.json and node_modules directory.
```

This is a known issue with npm and optional dependencies in Rollup, particularly when running in certain environments.

## Solution

We've implemented several fixes to address this issue:

1. **Updated CI/CD Workflow**
   - Added a clean install step that removes package-lock.json and node_modules
   - Added a step to explicitly install platform-specific Rollup dependencies
   - Added fallback build configurations

2. **Created Platform-Specific Dependency Fix Script**
   - Added `scripts/fix-rollup-deps.js` to detect and install the correct platform-specific Rollup dependency
   - This script automatically detects the current platform and installs the appropriate dependency

3. **Added Alternative Build Configurations**
   - Created `vite.config.ci.ts` with simplified settings for CI/CD environments
   - Added `build:safe` and `build:ci` scripts to package.json for fallback options
   - Implemented a multi-stage build process that tries different configurations if the standard build fails

4. **Added Local Testing Script**
   - Created `test-ci-build.ps1` to test the CI/CD build process locally
   - This script simulates the CI/CD environment and runs through all the build steps

## How to Use

### Testing CI/CD Build Locally

Run the following command to test the CI/CD build process locally:

```powershell
powershell -ExecutionPolicy Bypass -File test-ci-build.ps1
```

### Fixing Rollup Dependencies Manually

If you encounter Rollup dependency issues, you can run:

```bash
node scripts/fix-rollup-deps.js
```

### Using Alternative Build Configurations

If the standard build fails, you can try:

```bash
# CI-specific build configuration
npm run build:ci

# Safe build configuration with minimal options
npm run build:safe
```

## Technical Details

### Platform-Specific Rollup Dependencies

Rollup requires different dependencies based on the platform:

- Linux x64: `@rollup/rollup-linux-x64-gnu`
- Linux ARM64: `@rollup/rollup-linux-arm64-gnu`
- macOS x64: `@rollup/rollup-darwin-x64`
- macOS ARM64: `@rollup/rollup-darwin-arm64`
- Windows x64: `@rollup/rollup-win32-x64-msvc`

Our fix script automatically detects the current platform and installs the appropriate dependency.

### CI/CD Environment Variables

We've added the following environment variables to the CI/CD workflow:

- `ROLLUP_SKIP_PLATFORM_SPECIFIC`: Set to `true` to skip platform-specific dependencies
- `NODE_OPTIONS`: Set to `--max-old-space-size=4096` for the fallback build to increase memory limit

### Build Configurations

We've created multiple build configurations to handle different scenarios:

1. **Standard Build**: `npm run build`
   - Uses the default Vite configuration
   - Optimized for production

2. **CI-Specific Build**: `npm run build:ci`
   - Uses `vite.config.ci.ts`
   - Disables minification
   - Uses inline sourcemaps
   - Disables code splitting

3. **Safe Build**: `npm run build:safe`
   - Uses minimal options
   - Disables minification
   - Empties the output directory