# Troubleshooting Guide

This guide provides solutions for common issues you might encounter when working with the EduEasy codebase.

## Build Issues

### Rollup Platform-Specific Dependency Error

**Error Message:**
```
Error: Cannot find module @rollup/rollup-linux-x64-gnu
```

**Cause:**
This error occurs due to a known npm bug related to optional dependencies (https://github.com/npm/cli/issues/4828). The build process requires platform-specific Rollup binaries that may not be installed correctly.

**Solution:**

1. Run the dependency fix script:
   ```bash
   npm run fix-deps
   ```

2. If that doesn't work, try the Rollup-specific fix:
   ```bash
   npm run fix-rollup
   ```

3. If issues persist, try a clean installation:
   ```bash
   npm run clean
   ```

### TypeScript Type Errors

**Error Message:**
```
Type 'unknown[]' is not assignable to parameter of type 'SetStateAction<string[]>'
```

**Cause:**
TypeScript strict mode is enabled, but some code is not properly typed.

**Solution:**

1. Add proper type annotations to variables and function parameters
2. Use type assertions when necessary
3. Update interfaces to match the actual data structure

## Cross-Platform Issues

### Windows-Specific Script Errors

**Error Message:**
```
'powershell' is not recognized as an internal or external command
```

**Cause:**
Some scripts may be written specifically for Windows using PowerShell commands.

**Solution:**

Use the cross-platform scripts instead:
- `npm run clean` - Cross-platform cleanup script
- `npm run deploy:staging` - Cross-platform deployment script
- `npm run deploy:production` - Cross-platform deployment script

### Path Separator Issues

**Error Message:**
```
Error: ENOENT: no such file or directory
```

**Cause:**
Hardcoded path separators (backslashes or forward slashes) that don't work across platforms.

**Solution:**

Use Node.js path module to handle paths:
```javascript
const path = require('path');
const filePath = path.join(directory, 'filename');
```

## Dependency Issues

### Duplicate Dependencies

**Symptom:**
Large bundle size or conflicting versions of the same library.

**Solution:**

Run the deduplication command:
```bash
npx dedupe
```

### Peer Dependency Warnings

**Error Message:**
```
npm WARN unmet peer dependency
```

**Solution:**

1. Install the specific version of the peer dependency:
   ```bash
   npm install <peer-dependency>@<version>
   ```

2. Update the parent package to a version with compatible peer dependencies

## CI/CD Issues

### CI Build Failures

**Symptom:**
Builds pass locally but fail in CI environment.

**Solution:**

1. Use the CI-specific build command:
   ```bash
   npm run build:ci
   ```

2. Check CI status:
   ```bash
   npm run ci:status
   ```

3. Verify that all platform-specific dependencies are properly handled in the CI environment

## Performance Issues

### Large Bundle Size

**Symptom:**
Slow initial load times or large JavaScript files.

**Solution:**

1. Analyze the bundle:
   ```bash
   npm run build:analyze
   ```

2. Implement code splitting with React.lazy and dynamic imports

3. Review and optimize large dependencies

## Need More Help?

If you're still experiencing issues after trying these solutions, please:

1. Check the project documentation
2. Review recent commits for any related changes
3. Contact the development team for assistance