# GitHub Workflow Guide

## Code Quality Standards

Our codebase maintains high quality standards through automated checks:

### TypeScript Configuration

- Strict type checking enabled
- No implicit any types
- Strict null checks
- Strict function types
- Exact optional property types

### Prettier Configuration

- Line width: 100 characters
- Single quotes for JavaScript/TypeScript
- Double quotes for CSS/SCSS
- 2 spaces indentation
- Trailing commas enabled
- Consistent arrow function parentheses

### Pre-commit Hooks

All commits are automatically checked for:

1. TypeScript compilation errors
2. ESLint violations
3. Prettier formatting
4. Unit test failures

## Contributing Process

1. **Branch Naming**
   - Features: `feature/description`
   - Bugfixes: `fix/description`
   - Documentation: `docs/description`

2. **Commit Messages** Follow conventional commits:
   - feat: New features
   - fix: Bug fixes
   - docs: Documentation changes
   - style: Code style changes
   - refactor: Code refactoring
   - test: Test updates
   - chore: Maintenance tasks

3. **Pull Request Process**
   - Create PR against main branch
   - Fill out PR template
   - Ensure all checks pass
   - Request review from team members

4. **Code Review Guidelines**
   - Check for type safety
   - Verify test coverage
   - Review bundle size impact
   - Ensure documentation is updated

## CI/CD Pipeline

Our GitHub Actions workflow automatically:

1. Builds the project
2. Runs type checks
3. Executes linting
4. Runs unit tests
5. Validates environment setup
6. Builds production bundle

### Environment Variables

Required secrets in GitHub:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

### Branch Protection

Main branch is protected:

- Requires passing CI checks
- Requires code review approval
- No direct pushes allowed
