# EduEasy Scripts

This directory contains utility scripts for the EduEasy project.

## TypeScript Fix Scripts

These scripts help identify and fix TypeScript errors in the codebase.

### `fix-react-imports.js`

Automatically removes unused React imports from TSX files while preserving imports where React
namespace is actually used.

```bash
node scripts/fix-react-imports.js
```

### `find-missing-return-types.js`

Identifies functions that might be missing return type annotations.

```bash
node scripts/find-missing-return-types.js
```

### `fix-typescript-errors.js`

Master script that runs all the fixes in sequence.

```bash
node scripts/fix-typescript-errors.js
```

### `run-typescript-fixes.js`

Comprehensive script that runs the fixes, performs a TypeScript type check, and runs ESLint.

```bash
node scripts/run-typescript-fixes.js
```

### `check-typescript-config.js`

Script to check the TypeScript configuration and suggest improvements.

```bash
node scripts/check-typescript-config.js
```

### `commit-typescript-fixes.js`

Script to commit all the TypeScript fixes.

```bash
node scripts/commit-typescript-fixes.js
```

## Best Practices

When adding new scripts:

1. Add proper documentation at the top of the script
2. Make sure the script is cross-platform compatible
3. Add error handling
4. Update this README with the new script

## Troubleshooting

If you encounter issues with the scripts:

1. Make sure you're running them from the project root directory
2. Check that you have the necessary dependencies installed
3. For Windows users, make sure you're using the correct path separators
