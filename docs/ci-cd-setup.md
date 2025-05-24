# CI/CD Setup Guide for EduEasy

This document provides detailed instructions for setting up and troubleshooting the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the EduEasy project.

## Overview

The CI/CD pipeline is implemented using GitHub Actions and consists of three main stages:
1. Build and Test
2. Staging Deployment
3. Production Deployment

## Prerequisites

Before setting up the CI/CD pipeline, ensure you have:

1. A GitHub account with admin access to the repository
2. Staging and production servers with SSH access
3. Supabase project set up (or mock values for development)

## Setting Up GitHub Secrets

The CI/CD pipeline relies on several secrets that need to be configured in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click on "New repository secret"
4. Add the following secrets:

### Build Environment Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abcdefghijklm.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Deployment Secrets

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `DEPLOY_SSH_KEY` | Your SSH private key for deployment | `-----BEGIN OPENSSH PRIVATE KEY-----\n...` |
| `STAGING_SERVER_IP` | IP address of your staging server | `192.168.1.100` |
| `STAGING_SERVER_USER` | SSH username for staging server | `deploy` |
| `STAGING_SERVER_PATH` | Path to deploy to on staging server | `/var/www/edueasy-staging` |
| `PRODUCTION_SERVER_IP` | IP address of your production server | `192.168.1.200` |
| `PRODUCTION_SERVER_USER` | SSH username for production server | `deploy` |
| `PRODUCTION_SERVER_PATH` | Path to deploy to on production server | `/var/www/edueasy` |

## Generating SSH Keys for Deployment

If you don't have an SSH key for deployment, you can generate one using the following steps:

1. Open a terminal or command prompt
2. Run the following command:
   ```
   ssh-keygen -t ed25519 -C "deploy@edueasy.com"
   ```
3. When prompted, save the key to a file (e.g., `id_ed25519_deploy`)
4. Add the private key to GitHub Secrets as `DEPLOY_SSH_KEY`
5. Add the public key to the `~/.ssh/authorized_keys` file on your staging and production servers

## Setting Up Deployment Servers

On your staging and production servers:

1. Create the deployment directories:
   ```
   mkdir -p /var/www/edueasy-staging
   mkdir -p /var/www/edueasy
   ```

2. Set appropriate permissions:
   ```
   chown -R deploy:deploy /var/www/edueasy-staging
   chown -R deploy:deploy /var/www/edueasy
   ```

3. Configure your web server (Nginx, Apache, etc.) to serve the deployed files

## Workflow Configuration

The CI/CD workflow is defined in `.github/workflows/ci-cd.yml`. The workflow:

1. Builds and tests the application on every push and pull request to the main branch
2. Deploys to staging when changes are pushed to the main branch
3. Deploys to production after a successful staging deployment

### Key Features

The workflow includes several important features:

1. **Concurrency Control**: Prevents multiple deployments from running simultaneously, which could lead to conflicts
2. **Timeout Settings**: Prevents jobs from running indefinitely if something goes wrong
3. **Environment URLs**: Provides direct links to the deployed environments in the GitHub UI
4. **Fallback Mechanisms**: Multiple build strategies to handle different scenarios
5. **Conditional Execution**: Steps only run if the required secrets are available

## Verifying the CI/CD Setup

You can verify that your CI/CD setup is complete and correctly configured by running:

```sh
npm run ci:verify-setup
```

This script checks:
- All required files are present
- All required npm scripts are defined
- The GitHub workflow contains all necessary jobs

## Troubleshooting

### Common Issues

#### Build Failures

If the build fails, check:
- GitHub Actions logs for specific error messages
- Ensure all required environment variables are set
- Check for Rollup dependency issues (the workflow includes special handling for this)
- Look for memory issues (the workflow sets `NODE_OPTIONS="--max-old-space-size=4096"` to help with this)

#### Deployment Failures

If deployment fails, check:
- SSH key is correctly set up in GitHub Secrets
- Server IP, username, and path are correctly configured
- The deployment user has write permissions to the target directory
- The server is accessible from GitHub Actions runners
- The rsync command is available on the GitHub Actions runner

### Rollup Dependency Issues

The CI/CD workflow includes special handling for Rollup platform-specific dependencies. If you encounter issues:

1. Check the `fix-rollup-deps.js` script in the `scripts` directory
2. Ensure the correct platform-specific dependency is being installed
3. Try running the build locally with the `ROLLUP_SKIP_PLATFORM_SPECIFIC=true` environment variable

## Manual Deployment

You can also deploy manually using the provided scripts:

```sh
# Deploy to staging
npm run deploy:staging
# Or with parameters
./scripts/deploy-staging.ps1 -ServerUser user -ServerIP 192.168.1.1 -ServerPath /var/www/edueasy-staging

# Deploy to production
npm run deploy:production
# Or with parameters
./scripts/deploy-production.ps1 -ServerUser user -ServerIP 192.168.1.1 -ServerPath /var/www/edueasy
```

## Checking CI/CD Status

You can check the status of your CI/CD pipeline using:

```sh
npm run ci:status
```

This will show the status of recent workflow runs.

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Environment Variables](https://supabase.com/docs/guides/auth/env-variables)