# Contributing Guidelines

## Core Development Rules

⚠️ **CRITICAL: These rules prevent codebase instability**

### 1. No Direct Commits to Main
- All changes must go through pull requests to `develop` branch
- Main branch is protected - no exceptions
- Emergency fixes still require PR + review

### 2. No Wide-Scope Refactors by AI
- AI tools (including Cursor) are limited to single-file or small surface edits
- Global refactors must be planned manually and implemented incrementally
- If Cursor suggests multi-file changes, scope them into separate focused PRs

### 3. All AI Changes Land via PR to Develop with CI Green
- Every PR must pass CI checks (type-check, build, tests)
- No merging with failing CI
- Pre-commit hooks enforce code quality

## Development Workflow

1. Create feature branch: `feature/<scope>`
2. Make targeted changes
3. Ensure CI passes locally
4. Create PR to `develop`
5. Merge only after CI green + review

## PR Checklist

- [ ] Environment variables present and secure
- [ ] CI passes (green checks)
- [ ] No new large assets committed
- [ ] No secrets in code
- [ ] No wide-scope AI diffs
- [ ] Single-purpose, focused changes

## Emergency Procedures

Even for urgent fixes:
1. Create emergency branch
2. Make minimal fix
3. Fast-track PR with required review
4. Document post-incident

**No exceptions to the PR rule.**
