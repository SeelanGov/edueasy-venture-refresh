# CI/CD Pipeline Documentation

## Overview

The EduEasy project uses GitHub Actions for Continuous Integration and Continuous Deployment. The
pipeline is configured to ensure code quality, run tests, and manage deployments to different
environments.

## Pipeline Stages

### 1. Validate

- Runs on every push and pull request
- Checks:
  - Environment variables
  - TypeScript compilation
  - ESLint rules
  - Unit tests
  - Code formatting

### 2. Build

- Creates production build
- Runs after successful validation
- Uploads build artifacts for deployment

### 3. Deploy

- Staging: Automatically deploys to staging from the `develop` branch
- Production: Automatically deploys to production from the `main` branch
- Environment-specific configurations are used

## Scripts

### Development

- `bun run dev` - Start development server
- `bun run test` - Run tests
- `bun run lint` - Check code quality
- `bun run format` - Format code
- `bun run type-check` - Check TypeScript

### CI/CD

- `bun run ci:verify` - Run all CI checks locally
- `bun run build:ci` - Create CI build
- `bun run test:ci` - Run tests with CI configuration
- `bun run deploy:staging` - Deploy to staging
- `bun run deploy:production` - Deploy to production

## Environment Variables

Required for CI/CD:

- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Branch Strategy

- `main` - Production branch
- `develop` - Development branch
- Feature branches: `feature/*`
- Bug fixes: `fix/*`
- Documentation: `docs/*`

## Deployment Environments

### Staging

- Automatic deployment from `develop` branch
- Used for testing and QA
- Preview of new features

### Production

- Automatic deployment from `main` branch
- Requires successful build and tests
- Protected branch with review requirements

## Monitoring and Rollback

### Monitoring

- GitHub Actions dashboard
- Deployment status notifications
- Error tracking in production

### Rollback Process

1. Access GitHub Actions
2. Find the last successful deployment
3. Re-run the workflow with that commit
4. Verify the rollback in staging first

## Common Issues and Solutions

### Failed Builds

1. Check environment variables
2. Verify dependency versions
3. Review build logs for errors
4. Run `bun run ci:verify` locally

### Failed Tests

1. Run tests locally with `bun run test`
2. Check test coverage
3. Review test logs in CI

### Deployment Issues

1. Verify environment variables
2. Check deployment logs
3. Run `bun run verify-env`
4. Test deployment locally if possible
